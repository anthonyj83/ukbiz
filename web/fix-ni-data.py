#!/usr/bin/env python3
"""
Fix NI county names, merge Derry/Londonderry towns, and clean up messy data
across all IR files. Run from the web folder:
    python fix-ni-data.py
"""
import json, os, re, glob

IR_DIR = os.path.join("public", "data", "ir")

# ── NI County normalization ──────────────────────────────────────────
# Map every known variation to the 6 standard NI counties + cities
COUNTY_MAP = {
    # Antrim
    "antrim": "County Antrim",
    "county antrim": "County Antrim",
    "co antrim": "County Antrim",
    "co. antrim": "County Antrim",
    "co. antrim.": "County Antrim",
    "co.antrim": "County Antrim",
    "co antrim bt390bj": "County Antrim",
    "bushmills  co antrim": "County Antrim",
    # Down
    "down": "County Down",
    "county down": "County Down",
    "co down": "County Down",
    "co. down": "County Down",
    "co. down.": "County Down",
    "co. down,": "County Down",
    "co.down": "County Down",
    "codown": "County Down",
    # Armagh
    "armagh": "County Armagh",
    "county armagh": "County Armagh",
    "co armagh": "County Armagh",
    "co. armagh": "County Armagh",
    "co. armagh.": "County Armagh",  
    "co.armagh": "County Armagh",
    "co.armagh.": "County Armagh",
    "co,armagh": "County Armagh",
    # Tyrone
    "tyrone": "County Tyrone",
    "county tyrone": "County Tyrone",
    "co tyrone": "County Tyrone",
    "co. tyrone": "County Tyrone",
    "co. tyrone.": "County Tyrone",
    "co.tyrone": "County Tyrone",
    "coutny tyrone": "County Tyrone",
    # Londonderry / Derry
    "derry": "County Londonderry",
    "county derry": "County Londonderry",
    "co derry": "County Londonderry",
    "co. derry": "County Londonderry",
    "co. derry.": "County Londonderry",
    "londonderry": "County Londonderry",
    "county londonderry": "County Londonderry",
    "co londonderry": "County Londonderry",
    "co. londonderry": "County Londonderry",
    "co.londonderry": "County Londonderry",
    "co.l'derry": "County Londonderry",
    # Fermanagh
    "fermanagh": "County Fermanagh",
    "county fermanagh": "County Fermanagh",
    "co fermanagh": "County Fermanagh",
    "co. fermanagh": "County Fermanagh",
    # Junk entries to remove
    "region": None,
    "northern ireland": None,
    "n ireland": None,
    "n.ireland": None,
    "belfast": None,  # Belfast is a town, not a county
    "newry": None,
    "craigavon": None,
    "ballymena": None,
    "toomebridge": None,
    "banbridge": None,
    "enniskillen": None,
    "bushmills": None,
    "downpatrick": None,
    "newtownabbey": None,
    "dungannon": None,
    "ardboe": None,
    "1 d'alton road": None,
}

# ── Town normalization (Derry/Londonderry merge + common fixes) ──────
TOWN_MAP = {
    "londonderry": "Derry/Londonderry",
    "derry": "Derry/Londonderry",
    "l'derry": "Derry/Londonderry",
    "l/derry": "Derry/Londonderry",
}

def normalize_county(county):
    """Normalize a county string. Returns None if it should be removed."""
    if not county or not county.strip():
        return None
    key = county.strip().lower()
    if key in COUNTY_MAP:
        return COUNTY_MAP[key]
    return county.strip()

def normalize_town(town):
    """Normalize a town string."""
    if not town or not town.strip():
        return town
    key = town.strip().lower()
    if key in TOWN_MAP:
        return TOWN_MAP[key]
    return town.strip()

def rebuild_stats(companies):
    """Rebuild the topTowns and counties stats from company data."""
    towns = {}
    counties = {}
    for c in companies:
        t = c.get("postTown", "").strip()
        if t:
            towns[t] = towns.get(t, 0) + 1
        co = c.get("county", "").strip()
        if co:
            counties[co] = counties.get(co, 0) + 1
    # Sort by count descending
    towns = dict(sorted(towns.items(), key=lambda x: -x[1]))
    counties = dict(sorted(counties.items(), key=lambda x: -x[1]))
    return towns, counties

def process_file(filepath):
    """Process a single IR file."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    companies = data.get("companies", [])
    changed = False
    
    for c in companies:
        # Normalize county
        old_county = c.get("county", "")
        new_county = normalize_county(old_county)
        if new_county is None:
            new_county = ""
        if new_county != old_county:
            c["county"] = new_county
            changed = True
        
        # Normalize town
        old_town = c.get("postTown", "")
        new_town = normalize_town(old_town)
        if new_town != old_town:
            c["postTown"] = new_town
            changed = True
    
    if changed:
        # Rebuild stats
        towns, counties = rebuild_stats(companies)
        data["stats"]["topTowns"] = towns
        data["stats"]["counties"] = counties
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
    
    return changed

def main():
    files = sorted(glob.glob(os.path.join(IR_DIR, "*.json")))
    print(f"Found {len(files)} IR files to clean up...")
    
    fixed = 0
    for i, fp in enumerate(files, 1):
        if process_file(fp):
            fixed += 1
        if i % 50 == 0:
            print(f"  Processed {i}/{len(files)} files ({fixed} modified)...")
    
    print(f"\nDone! Processed {len(files)} files, modified {fixed}.")
    print(f"\nNow re-split the data:")
    print(f"  node split-data.js")
    print(f"\nThen commit and push.")

if __name__ == "__main__":
    main()
