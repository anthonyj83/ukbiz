"""
enrich_psc.py — PSC Enrichment Pipeline for UK Business Finder
================================================================
Run from the web folder:  python enrich_psc.py
"""

import json
import os
import sys
import zipfile
import urllib.request
import time
from datetime import date, timedelta, datetime
from collections import defaultdict

DATA_DIR = os.path.join("public", "data")
IR_DIR = os.path.join(DATA_DIR, "ir")
META_DIR = os.path.join(DATA_DIR, "ir-meta")
PAGES_DIR = os.path.join(DATA_DIR, "ir-pages")
PSC_DIR = os.path.join(DATA_DIR, "psc")
PAGE_SIZE = 200


def download_psc():
    os.makedirs(PSC_DIR, exist_ok=True)
    zip_path = os.path.join(PSC_DIR, "psc-snapshot.zip")
    json_path = os.path.join(PSC_DIR, "psc-snapshot.json")

    if os.path.exists(json_path):
        age_hours = (time.time() - os.path.getmtime(json_path)) / 3600
        if age_hours < 24:
            print(f"  PSC snapshot already exists ({age_hours:.1f}h old). Skipping download.")
            return json_path

    for days_back in range(0, 8):
        d = date.today() - timedelta(days=days_back)
        url = f"http://download.companieshouse.gov.uk/persons-with-significant-control-snapshot-{d.isoformat()}.zip"
        print(f"  Trying {url}...")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            response = urllib.request.urlopen(req, timeout=30)
            if response.status == 200:
                print(f"  Found snapshot for {d.isoformat()}. Downloading (~1-2GB)...")
                total = int(response.headers.get("Content-Length", 0))
                downloaded = 0
                with open(zip_path, "wb") as f:
                    while True:
                        chunk = response.read(1024 * 1024)
                        if not chunk:
                            break
                        f.write(chunk)
                        downloaded += len(chunk)
                        mb = downloaded / 1024 / 1024
                        if total > 0:
                            print(f"\r  Downloaded {mb:.0f}MB ({downloaded/total*100:.1f}%)", end="", flush=True)
                        else:
                            print(f"\r  Downloaded {mb:.0f}MB", end="", flush=True)
                print()
                break
        except Exception:
            continue
    else:
        print("ERROR: Could not find PSC snapshot.")
        sys.exit(1)

    print("  Extracting ZIP file...")
    with zipfile.ZipFile(zip_path, "r") as zf:
        names = zf.namelist()
        # Find the data file — could be .json or .txt
        data_file = None
        for n in names:
            if n.endswith(".json") or n.endswith(".txt"):
                data_file = n
                break
        if not data_file:
            print(f"ERROR: No .json or .txt file found in zip. Contents: {names}")
            sys.exit(1)

        print(f"  Extracting {data_file}...")
        zf.extract(data_file, PSC_DIR)
        extracted = os.path.join(PSC_DIR, data_file)
        if extracted != json_path:
            if os.path.exists(json_path):
                os.remove(json_path)
            os.rename(extracted, json_path)

    os.remove(zip_path)
    size_gb = os.path.getsize(json_path) / 1024 / 1024 / 1024
    print(f"  Extracted: {size_gb:.1f}GB")
    return json_path


def parse_psc(json_path):
    print(f"  Parsing PSC data...")
    psc_by_company = defaultdict(list)
    count = 0
    skipped = 0
    now = datetime.now()

    with open(json_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                skipped += 1
                continue

            company_number = record.get("company_number", "")
            data = record.get("data", {})
            if not company_number or not data:
                skipped += 1
                continue

            kind = data.get("kind", "")
            psc_entry = None

            if "individual" in kind:
                name_parts = data.get("name_elements", {})
                name = data.get("name", "")
                if not name and name_parts:
                    name = f"{name_parts.get('forename', '')} {name_parts.get('surname', '')}".strip()

                dob = data.get("date_of_birth", {})
                dob_month = dob.get("month")
                dob_year = dob.get("year")

                # Calculate approximate age
                age = None
                if dob_year:
                    age = now.year - dob_year
                    if dob_month and now.month < dob_month:
                        age -= 1

                psc_entry = {
                    "type": "individual",
                    "name": name,
                    "nationality": data.get("nationality", ""),
                    "countryOfResidence": data.get("country_of_residence", ""),
                    "naturesOfControl": data.get("natures_of_control", []),
                    "dobMonth": dob_month,
                    "dobYear": dob_year,
                    "age": age,
                    "ceased": data.get("ceased", False),
                }

            elif "corporate" in kind or "legal-person" in kind:
                identification = data.get("identification", {})
                psc_entry = {
                    "type": "corporate",
                    "name": data.get("name", ""),
                    "legalAuthority": identification.get("legal_authority", ""),
                    "placeRegistered": identification.get("place_registered", ""),
                    "registrationNumber": identification.get("registration_number", ""),
                    "naturesOfControl": data.get("natures_of_control", []),
                    "ceased": data.get("ceased", False),
                }

            elif "statement" in kind:
                skipped += 1
                continue
            else:
                skipped += 1
                continue

            if psc_entry and not psc_entry.get("ceased", False):
                psc_by_company[company_number].append(psc_entry)

            count += 1
            if count % 1_000_000 == 0:
                print(f"    {count:,} records ({len(psc_by_company):,} companies)...")

    print(f"  Done! {count:,} records, {len(psc_by_company):,} companies. Skipped {skipped:,}.")
    return psc_by_company


def simplify_control(natures):
    controls = []
    for n in natures:
        nl = n.lower()
        if "75-to-100" in nl or "more-than-75" in nl:
            controls.append("75%+")
        elif "50-to-75" in nl:
            controls.append("50-75%")
        elif "25-to-50" in nl:
            controls.append("25-50%")
        elif "voting" in nl:
            controls.append("voting")
        elif "appoint" in nl or "remove" in nl:
            controls.append("board control")
        elif "significant-influence" in nl:
            controls.append("significant influence")
        else:
            controls.append("control")
    return list(set(controls))


def simplify_psc(psc_list):
    result = []
    for p in psc_list:
        if p["type"] == "individual":
            entry = {
                "t": "i",
                "n": p["name"],
                "nat": p.get("nationality", ""),
                "cor": p.get("countryOfResidence", ""),
                "c": simplify_control(p.get("naturesOfControl", [])),
            }
            if p.get("age") is not None:
                entry["age"] = p["age"]
            if p.get("dobYear"):
                entry["dobY"] = p["dobYear"]
            if p.get("dobMonth"):
                entry["dobM"] = p["dobMonth"]
            result.append(entry)
        elif p["type"] == "corporate":
            result.append({
                "t": "c",
                "n": p["name"],
                "reg": p.get("registrationNumber", ""),
                "c": simplify_control(p.get("naturesOfControl", [])) or ["corporate owner"],
            })
    return result


def enrich_ir_files(psc_by_company):
    print(f"  Enriching IR files...")
    files = [f for f in os.listdir(IR_DIR) if f.endswith(".json")]
    print(f"  Found {len(files)} files.")

    total_companies = 0
    psc_matches = 0

    for fi, filename in enumerate(files):
        filepath = os.path.join(IR_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        companies = data.get("companies", [])
        total_companies += len(companies)

        for company in companies:
            co_num = company.get("number", "")
            psc_list = psc_by_company.get(co_num, [])
            if psc_list:
                company["pscs"] = simplify_psc(psc_list)
                company["pscCount"] = len(company["pscs"])
                psc_matches += 1
            else:
                company["pscs"] = []
                company["pscCount"] = 0

        # Stats
        stats = data.get("stats", {})
        companies_with_pscs = sum(1 for c in companies if c.get("pscCount", 0) > 0)
        all_nationalities = defaultdict(int)
        foreign_controlled = 0
        corporate_controlled = 0
        individual_pscs = 0

        for c in companies:
            for p in c.get("pscs", []):
                if p.get("t") == "i":
                    individual_pscs += 1
                    nat = p.get("nat", "")
                    if nat:
                        all_nationalities[nat] += 1
                    cor = p.get("cor", "")
                    if cor and cor.lower() not in [
                        "england", "wales", "scotland", "northern ireland",
                        "united kingdom", "uk", "great britain"
                    ]:
                        foreign_controlled += 1
                elif p.get("t") == "c":
                    corporate_controlled += 1

        stats["companiesWithPscs"] = companies_with_pscs
        stats["individualPscCount"] = individual_pscs
        stats["foreignControlledCount"] = foreign_controlled
        stats["corporateControlledCount"] = corporate_controlled
        stats["topNationalities"] = dict(
            sorted(all_nationalities.items(), key=lambda x: -x[1])[:20]
        )
        data["stats"] = stats

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

        if (fi + 1) % 50 == 0 or fi == len(files) - 1:
            print(f"    {fi + 1}/{len(files)} files...")

    print(f"  Done! {total_companies:,} companies, {psc_matches:,} with PSC data.")


def split_data():
    print(f"  Re-splitting data...")
    os.makedirs(META_DIR, exist_ok=True)
    os.makedirs(PAGES_DIR, exist_ok=True)

    for d in [META_DIR, PAGES_DIR]:
        for f in os.listdir(d):
            os.remove(os.path.join(d, f))

    files = [f for f in os.listdir(IR_DIR) if f.endswith(".json")]
    for fi, filename in enumerate(files):
        filepath = os.path.join(IR_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        slug = filename.replace(".json", "")
        companies = data.pop("companies", [])
        data["totalPages"] = max(1, -(-len(companies) // PAGE_SIZE))
        data["pageSize"] = PAGE_SIZE

        with open(os.path.join(META_DIR, f"{slug}.json"), "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

        for i in range(data["totalPages"]):
            chunk = companies[i * PAGE_SIZE : (i + 1) * PAGE_SIZE]
            with open(os.path.join(PAGES_DIR, f"{slug}__{i}.json"), "w", encoding="utf-8") as f:
                json.dump(chunk, f, ensure_ascii=False)

        if (fi + 1) % 50 == 0 or fi == len(files) - 1:
            print(f"    {fi + 1}/{len(files)} files...")

    print(f"  Done!")


if __name__ == "__main__":
    print("=" * 60)
    print("  UK Business Finder - PSC Enrichment Pipeline")
    print("=" * 60)

    print("\n[1/4] Downloading PSC snapshot...")
    json_path = download_psc()

    print("\n[2/4] Parsing PSC data...")
    psc_by_company = parse_psc(json_path)

    print("\n[3/4] Enriching IR files...")
    enrich_ir_files(psc_by_company)

    print("\n[4/4] Re-splitting data...")
    split_data()

    print("\n" + "=" * 60)
    print("  PSC enrichment complete! (includes DOB/age)")
    print("=" * 60)
