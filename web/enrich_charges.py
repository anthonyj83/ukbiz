"""
enrich_charges.py — Charges + Insolvency Enrichment via Companies House API
=============================================================================
Run from the web folder:  python enrich_charges.py YOUR_API_KEY

This script:
1. Scans all IR files for companies with outstanding charges
2. Queries the Companies House API for charge holder details + insolvency history
3. Enriches the IR files with this data
4. Re-splits into ir-meta / ir-pages

Rate limit: 600 requests per 5 minutes (2/sec). This script respects that.
For large datasets this may take several hours — it saves progress and can resume.

Get your free API key at: https://developer.company-information.service.gov.uk
"""

import json
import os
import sys
import time
import base64
import urllib.request
import urllib.error
from collections import defaultdict

# --- Config ---
DATA_DIR = os.path.join("public", "data")
IR_DIR = os.path.join(DATA_DIR, "ir")
META_DIR = os.path.join(DATA_DIR, "ir-meta")
PAGES_DIR = os.path.join(DATA_DIR, "ir-pages")
CACHE_DIR = os.path.join(DATA_DIR, "api-cache")
PAGE_SIZE = 200
RATE_LIMIT_PER_5MIN = 580  # slightly under 600 to be safe
REQUEST_DELAY = 5.0 / RATE_LIMIT_PER_5MIN  # ~0.52 seconds between requests


def make_api_request(path, api_key):
    """Make an authenticated request to Companies House API"""
    url = f"https://api.company-information.service.gov.uk{path}"
    credentials = base64.b64encode(f"{api_key}:".encode()).decode()
    req = urllib.request.Request(url, headers={
        "Authorization": f"Basic {credentials}",
        "User-Agent": "UKBizFinder/1.0",
    })
    try:
        response = urllib.request.urlopen(req, timeout=15)
        return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        elif e.code == 429:
            print("    Rate limited! Waiting 60 seconds...")
            time.sleep(60)
            return make_api_request(path, api_key)  # retry
        else:
            return None
    except Exception:
        return None


# --- Step 1: Find companies needing enrichment ---
def find_companies_to_enrich():
    """Find all companies with outstanding charges across all IR files"""
    print("  Scanning IR files for companies with outstanding charges...")
    companies = []
    files = [f for f in os.listdir(IR_DIR) if f.endswith(".json")]

    for filename in files:
        filepath = os.path.join(IR_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        for c in data.get("companies", []):
            outstanding = c.get("numMortgages", 0) - c.get("numMortSatisfied", 0)
            if outstanding > 0:
                companies.append(c["number"])

    # Deduplicate (same company may appear in multiple industry files)
    unique = list(set(companies))
    print(f"  Found {len(unique):,} unique companies with outstanding charges.")
    return unique


# --- Step 2: Query API for charges + insolvency ---
def query_companies(company_numbers, api_key):
    """Query CH API for charge holders and insolvency status. Saves to cache."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_file = os.path.join(CACHE_DIR, "charges_cache.json")

    # Load existing cache
    if os.path.exists(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            cache = json.load(f)
        print(f"  Loaded cache with {len(cache):,} companies already queried.")
    else:
        cache = {}

    # Filter out already cached
    to_query = [cn for cn in company_numbers if cn not in cache]
    print(f"  {len(to_query):,} companies remaining to query.")

    if not to_query:
        return cache

    est_minutes = len(to_query) * REQUEST_DELAY * 2 / 60  # 2 calls per company
    est_hours = est_minutes / 60
    print(f"  Estimated time: {est_minutes:.0f} minutes ({est_hours:.1f} hours)")
    print(f"  Progress saves every 100 companies. You can stop and resume anytime.")
    print()

    queried = 0
    errors = 0
    start_time = time.time()

    for i, co_num in enumerate(to_query):
        result = {"chargeHolders": [], "hasInsolvency": False, "insolvencyCases": []}

        # Query company profile for insolvency flag
        profile = make_api_request(f"/company/{co_num}", api_key)
        time.sleep(REQUEST_DELAY)

        if profile:
            result["hasInsolvency"] = profile.get("has_insolvency_history", False)

            # If has insolvency, get details
            if result["hasInsolvency"]:
                insolvency = make_api_request(f"/company/{co_num}/insolvency", api_key)
                time.sleep(REQUEST_DELAY)
                if insolvency and "cases" in insolvency:
                    for case in insolvency["cases"][:3]:  # max 3 cases
                        result["insolvencyCases"].append({
                            "type": case.get("type", ""),
                            "dates": case.get("dates", []),
                            "practitioners": [
                                {
                                    "name": p.get("name", ""),
                                    "firm": p.get("appointed_by", ""),
                                }
                                for p in case.get("practitioners", [])[:2]
                            ],
                        })

        # Query charges
        charges = make_api_request(f"/company/{co_num}/charges", api_key)
        time.sleep(REQUEST_DELAY)

        if charges and "items" in charges:
            for charge in charges["items"]:
                status = charge.get("status", "")
                if status in ["outstanding", "part-satisfied"]:
                    holders = charge.get("persons_entitled", [])
                    holder_names = [h.get("name", "") for h in holders if h.get("name")]
                    if holder_names:
                        result["chargeHolders"].extend(holder_names)

            # Deduplicate charge holders
            result["chargeHolders"] = list(set(result["chargeHolders"]))

        cache[co_num] = result
        queried += 1

        # Save cache every 100 companies
        if queried % 100 == 0:
            with open(cache_file, "w", encoding="utf-8") as f:
                json.dump(cache, f, ensure_ascii=False)
            elapsed = time.time() - start_time
            rate = queried / elapsed if elapsed > 0 else 0
            remaining = (len(to_query) - queried) / rate if rate > 0 else 0
            print(f"    {queried:,}/{len(to_query):,} queried "
                  f"({queried/len(to_query)*100:.1f}%) "
                  f"- {rate:.1f}/sec "
                  f"- ~{remaining/60:.0f} min remaining")

    # Final save
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False)

    print(f"  Done! Queried {queried:,} companies. {errors} errors.")
    return cache


# --- Step 3: Enrich IR files with charges + insolvency ---
def enrich_ir_files(cache):
    print(f"  Enriching IR files with charges + insolvency data...")
    files = [f for f in os.listdir(IR_DIR) if f.endswith(".json")]

    total_enriched = 0
    insolvency_count = 0
    charges_enriched = 0

    for fi, filename in enumerate(files):
        filepath = os.path.join(IR_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        companies = data.get("companies", [])

        for company in companies:
            co_num = company.get("number", "")
            api_data = cache.get(co_num)

            if api_data:
                # Charge holders
                if api_data.get("chargeHolders"):
                    company["chargeHolders"] = api_data["chargeHolders"]
                    charges_enriched += 1

                # Insolvency
                if api_data.get("hasInsolvency"):
                    company["hasInsolvency"] = True
                    company["insolvencyCases"] = api_data.get("insolvencyCases", [])
                    insolvency_count += 1
                else:
                    company["hasInsolvency"] = api_data.get("hasInsolvency", False)

                total_enriched += 1

        # Update stats
        stats = data.get("stats", {})
        stats["insolvencyCount"] = sum(
            1 for c in companies if c.get("hasInsolvency", False)
        )

        # Top charge holders
        all_holders = defaultdict(int)
        for c in companies:
            for h in c.get("chargeHolders", []):
                all_holders[h] += 1
        stats["topChargeHolders"] = dict(
            sorted(all_holders.items(), key=lambda x: -x[1])[:20]
        )

        data["stats"] = stats

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

        if (fi + 1) % 50 == 0 or fi == len(files) - 1:
            print(f"    Enriched {fi + 1}/{len(files)} files...")

    print(f"  Done! {total_enriched:,} companies enriched.")
    print(f"  {insolvency_count:,} with insolvency history.")
    print(f"  {charges_enriched:,} with charge holder details.")


# --- Step 4: Re-split ---
def split_data():
    print(f"  Re-splitting into ir-meta and ir-pages...")
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

        if (fi + 1) % 100 == 0 or fi == len(files) - 1:
            print(f"    Split {fi + 1}/{len(files)} files...")

    print(f"  Done!")


# --- Main ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python enrich_charges.py YOUR_API_KEY")
        print("")
        print("Get your free API key at:")
        print("  https://developer.company-information.service.gov.uk")
        sys.exit(1)

    api_key = sys.argv[1]

    print("=" * 60)
    print("  UK Business Finder - Charges + Insolvency Enrichment")
    print("=" * 60)
    print(f"  API Key: {api_key[:8]}...")
    print(f"  Rate limit: ~{RATE_LIMIT_PER_5MIN} requests / 5 min")
    print(f"  Progress is saved - you can stop and resume anytime.")

    print("\n[1/4] Finding companies with outstanding charges...")
    company_numbers = find_companies_to_enrich()

    print("\n[2/4] Querying Companies House API...")
    cache = query_companies(company_numbers, api_key)

    print("\n[3/4] Enriching IR files...")
    enrich_ir_files(cache)

    print("\n[4/4] Re-splitting data...")
    split_data()

    print("\n" + "=" * 60)
    print("  Charges + insolvency enrichment complete!")
    print("")
    print("  To deploy:")
    print("    cd ..")
    print('    git add -A')
    print('    git commit -m "Add charges and insolvency data"')
    print("    git push")
    print("=" * 60)
