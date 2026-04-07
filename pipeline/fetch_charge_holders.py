"""
Charge Holder Enrichment Pipeline
===================================
Hits the Companies House API for every company with outstanding charges,
extracts charge holder (persons_entitled) names, and saves to a JSON file.

Rate limit: 600 requests per 5 minutes (2 per second with buffer)
Checkpoint: saves progress every 100 companies so you can stop/resume

Usage: python fetch_charge_holders.py
"""

import json
import os
import time
import sys
import urllib.request
import urllib.error
import base64
from pathlib import Path

# --- CONFIG ---
API_KEY = "4e0f9665-f156-4e1e-97dd-72de8db27517"
IR_DIR = os.path.join("..", "web", "public", "data", "ir")
OUTPUT_FILE = "charge_holders.json"
CHECKPOINT_FILE = "charge_holders_checkpoint.json"
RATE_LIMIT_DELAY = 0.55  # seconds between requests (~109/min, well under 120/min)
CHECKPOINT_EVERY = 100

# Basic auth header (CH API uses API key as username, no password)
AUTH_HEADER = "Basic " + base64.b64encode(f"{API_KEY}:".encode()).decode()


def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            return json.load(f)
    return {"completed": {}, "results": {}}


def save_checkpoint(checkpoint):
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(checkpoint, f)


def fetch_charges(company_number):
    """Fetch charges for a company from CH API. Returns list of charge holder names."""
    url = f"https://api.company-information.service.gov.uk/company/{company_number}/charges"
    req = urllib.request.Request(url, headers={"Authorization": AUTH_HEADER})
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
            holders = set()
            for item in data.get("items", []):
                status = item.get("status", "")
                # Only get holders for outstanding charges
                if status in ("outstanding", "part-satisfied"):
                    for person in item.get("persons_entitled", []):
                        name = person.get("name", "").strip()
                        if name:
                            holders.add(name)
            return list(holders)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return []  # No charges endpoint for this company
        elif e.code == 429:
            print(f"    Rate limited! Waiting 60 seconds...")
            time.sleep(60)
            return fetch_charges(company_number)  # Retry
        else:
            print(f"    HTTP {e.code} for {company_number}")
            return []
    except Exception as e:
        print(f"    Error for {company_number}: {e}")
        return []


def main():
    print("=" * 60)
    print("  Charge Holder Enrichment Pipeline")
    print("=" * 60)
    print()

    # Load all companies with outstanding charges
    print("Scanning IR files for companies with outstanding charges...")
    targets = []
    ir_files = sorted([f for f in os.listdir(IR_DIR) if f.endswith(".json")])
    
    for fname in ir_files:
        fp = os.path.join(IR_DIR, fname)
        with open(fp, "r", encoding="utf-8") as f:
            data = json.load(f)
        for c in data.get("companies", []):
            num_mort = c.get("numMortgages", 0)
            num_sat = c.get("numMortSatisfied", 0)
            if num_mort > 0 and num_mort > num_sat:
                targets.append({
                    "number": c.get("number", ""),
                    "name": c.get("name", ""),
                    "outstanding": num_mort - num_sat
                })

    print(f"Found {len(targets):,} companies with outstanding charges")
    print()

    # Load checkpoint
    checkpoint = load_checkpoint()
    completed = checkpoint.get("completed", {})
    results = checkpoint.get("results", {})
    
    already_done = len(completed)
    if already_done > 0:
        print(f"Resuming from checkpoint: {already_done:,} already completed")
    
    remaining = [t for t in targets if t["number"] not in completed]
    print(f"Remaining: {len(remaining):,} companies to process")
    print(f"Estimated time: {len(remaining) * RATE_LIMIT_DELAY / 3600:.1f} hours")
    print()
    print("Press Ctrl+C to stop at any time (progress is saved)")
    print("-" * 60)

    processed = 0
    found_holders = 0
    start_time = time.time()

    try:
        for i, target in enumerate(remaining):
            company_num = target["number"]
            
            holders = fetch_charges(company_num)
            
            if holders:
                results[company_num] = {
                    "name": target["name"],
                    "holders": holders
                }
                found_holders += 1

            completed[company_num] = True
            processed += 1

            # Progress update
            if processed % 10 == 0:
                elapsed = time.time() - start_time
                rate = processed / elapsed if elapsed > 0 else 0
                eta_hours = (len(remaining) - processed) / rate / 3600 if rate > 0 else 0
                total_done = already_done + processed
                sys.stdout.write(
                    f"\r  Processed: {total_done:,}/{len(targets):,} | "
                    f"With holders: {len(results):,} | "
                    f"Rate: {rate:.1f}/sec | "
                    f"ETA: {eta_hours:.1f}h   "
                )
                sys.stdout.flush()

            # Checkpoint
            if processed % CHECKPOINT_EVERY == 0:
                checkpoint["completed"] = completed
                checkpoint["results"] = results
                save_checkpoint(checkpoint)

            # Rate limiting
            time.sleep(RATE_LIMIT_DELAY)

    except KeyboardInterrupt:
        print("\n\nStopped by user. Saving checkpoint...")

    # Final save
    checkpoint["completed"] = completed
    checkpoint["results"] = results
    save_checkpoint(checkpoint)

    # Save results
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    total_done = already_done + processed
    print(f"\n\n{'=' * 60}")
    print(f"  Progress: {total_done:,}/{len(targets):,} companies processed")
    print(f"  Companies with charge holder data: {len(results):,}")
    print(f"  Results saved to: {OUTPUT_FILE}")
    print(f"  Checkpoint saved to: {CHECKPOINT_FILE}")
    if total_done < len(targets):
        print(f"\n  Run this script again to continue from where you left off.")
    else:
        print(f"\n  COMPLETE! All companies processed.")
        print(f"  Next step: run enrich_charge_holders.py to add data to the site.")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
