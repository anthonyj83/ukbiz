#!/usr/bin/env python3
"""
Build a search index for the front page.
Splits 2.6M companies into ~676 files by first 2 chars of name.
Each file is small enough to fetch on demand.

Run from the web folder:
    python build-search-index.py
"""
import json, os, glob, re

IR_DIR = os.path.join("public", "data", "ir")
SEARCH_DIR = os.path.join("public", "data", "search")

def clean_prefix(name):
    """Get first 2 lowercase alpha chars from company name."""
    chars = []
    for ch in name.lower():
        if ch.isalpha():
            chars.append(ch)
            if len(chars) == 2:
                break
    if len(chars) < 2:
        return "zz"  # fallback for numeric/weird names
    return "".join(chars)

def main():
    os.makedirs(SEARCH_DIR, exist_ok=True)
    
    files = sorted(glob.glob(os.path.join(IR_DIR, "*.json")))
    print(f"Building search index from {len(files)} IR files...")
    
    # Collect all companies
    index = {}  # prefix -> list of entries
    total = 0
    
    for i, fp in enumerate(files, 1):
        with open(fp, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        industry = data["industry"]
        industryName = data["industryName"]
        region = data["region"]
        regionName = data["regionName"]
        
        for c in data.get("companies", []):
            name = c.get("name", "")
            number = c.get("number", "")
            town = c.get("postTown", "")
            
            if not name:
                continue
            
            prefix = clean_prefix(name)
            
            entry = {
                "n": name,           # company name
                "no": number,        # company number
                "t": town,           # town
                "i": industry,       # industry slug
                "in": industryName,  # industry name
                "r": region,         # region slug
                "rn": regionName,    # region name
            }
            
            if prefix not in index:
                index[prefix] = []
            index[prefix].append(entry)
            total += 1
        
        if i % 50 == 0:
            print(f"  Processed {i}/{len(files)} files ({total:,} companies)...")
    
    print(f"\n  Total: {total:,} companies across {len(index)} prefix groups")
    
    # Also build a number index (by first 2 chars of company number)
    # This goes into the same files with a "num_" prefix
    
    # Write index files
    print(f"\n  Writing search index files to {SEARCH_DIR}...")
    
    # Write a manifest of all prefixes and their sizes
    manifest = {}
    
    for prefix, entries in sorted(index.items()):
        outpath = os.path.join(SEARCH_DIR, f"{prefix}.json")
        with open(outpath, "w", encoding="utf-8") as f:
            json.dump(entries, f, ensure_ascii=False, separators=(",", ":"))
        
        size_kb = os.path.getsize(outpath) / 1024
        manifest[prefix] = {"count": len(entries), "sizeKB": round(size_kb, 1)}
    
    # Write manifest
    manifest_path = os.path.join(SEARCH_DIR, "_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    
    # Stats
    sizes = [v["sizeKB"] for v in manifest.values()]
    total_mb = sum(sizes) / 1024
    print(f"\n  Index files: {len(manifest)}")
    print(f"  Total size: {total_mb:.1f} MB")
    print(f"  Avg file: {sum(sizes)/len(sizes):.1f} KB")
    print(f"  Largest: {max(sizes):.1f} KB")
    print(f"  Smallest: {min(sizes):.1f} KB")
    
    print(f"\nDone! Search index built in {SEARCH_DIR}/")
    print(f"Add 'public/data/search/' to .gitignore (it's generated at build time)")

if __name__ == "__main__":
    main()
