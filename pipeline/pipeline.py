#!/usr/bin/env python3
"""
UK Business Intelligence Pipeline
====================================
Downloads Companies House bulk data and generates JSON data files
for the programmatic SEO site.

Run: python pipeline.py
Output: ../web/public/data/ folder (consumed by Next.js at build time)
"""

import requests
import zipfile
import csv
import json
import os
import re
import time
from io import BytesIO
from pathlib import Path
from collections import defaultdict
from datetime import datetime, date

# ─────────────────────────────────────────────
# INDUSTRY MAPPINGS  (SIC code → slug, label)
# ─────────────────────────────────────────────
INDUSTRY_MAP = {
    "81210": ("cleaning",           "Commercial Cleaning"),
    "81220": ("cleaning",           "Commercial Cleaning"),
    "81290": ("cleaning",           "Cleaning Services"),
    "81200": ("pest-control",       "Pest Control"),
    "81300": ("landscaping",        "Landscaping & Grounds Maintenance"),
    "41100": ("construction",       "Construction"),
    "41201": ("construction",       "Construction"),
    "41202": ("construction",       "Construction"),
    "43210": ("electrical",         "Electrical Services"),
    "43220": ("plumbing",           "Plumbing & Heating"),
    "43290": ("building-services",  "Building Services"),
    "43310": ("building-services",  "Building Services"),
    "43320": ("building-services",  "Building Services"),
    "43330": ("building-services",  "Building Services"),
    "43390": ("building-services",  "Building Services"),
    "43910": ("roofing",            "Roofing & Waterproofing"),
    "69201": ("accounting",         "Accounting & Bookkeeping"),
    "69202": ("accounting",         "Accounting & Bookkeeping"),
    "69209": ("accounting",         "Accounting & Bookkeeping"),
    "69101": ("legal",              "Legal Services"),
    "69102": ("legal",              "Legal Services"),
    "62011": ("software",           "Software Development"),
    "62012": ("software",           "Software Development"),
    "62020": ("it-consulting",      "IT Consulting"),
    "62090": ("it-services",        "IT Services & Support"),
    "63110": ("data-services",      "Data Processing & Hosting"),
    "56101": ("restaurants",        "Restaurants & Cafes"),
    "56102": ("restaurants",        "Restaurants & Cafes"),
    "56210": ("catering",           "Event Catering"),
    "56290": ("catering",           "Food Services"),
    "47110": ("retail",             "General Retail"),
    "47190": ("retail",             "General Retail"),
    "47910": ("ecommerce",          "Online Retail & E-commerce"),
    "68320": ("property-management","Property Management"),
    "68100": ("property",           "Property & Real Estate"),
    "78200": ("recruitment",        "Recruitment & Staffing"),
    "78300": ("recruitment",        "Recruitment & Staffing"),
    "49410": ("transport",          "Road Transport & Haulage"),
    "52100": ("warehousing",        "Warehousing & Storage"),
    "80100": ("security",           "Security Services"),
    "80200": ("security",           "Security Systems"),
    "86101": ("healthcare",         "Healthcare Services"),
    "86210": ("healthcare",         "Healthcare Services"),
    "86900": ("healthcare",         "Healthcare Services"),
    "85410": ("training",           "Professional Training"),
    "85590": ("training",           "Training & Education"),
    "73110": ("marketing",          "Marketing & Advertising"),
    "73120": ("marketing",          "Marketing & Advertising"),
    "55100": ("hotels",             "Hotels & Accommodation"),
    "55201": ("accommodation",      "Guesthouses & B&Bs"),
    "55209": ("accommodation",      "Accommodation"),
    "96020": ("beauty",             "Hair & Beauty"),
    "45111": ("automotive",         "Car Sales & Automotive"),
    "45200": ("automotive",         "Vehicle Repair & Maintenance"),
    "64191": ("financial-services", "Financial Services"),
    "66190": ("financial-services", "Financial Services"),
    "65120": ("insurance",          "Insurance"),
    "65200": ("insurance",          "Insurance"),
    "71110": ("architecture",       "Architecture"),
    "71120": ("engineering",        "Engineering Consultancy"),
    "38110": ("waste-management",   "Waste Management & Recycling"),
    "38120": ("waste-management",   "Waste Management & Recycling"),
    "82300": ("events",             "Events & Conference Management"),
    "88910": ("childcare",          "Childcare & Day Nurseries"),
    "96030": ("funeral",            "Funeral Services"),
    "74201": ("photography",        "Photography & Videography"),
    "75000": ("veterinary",         "Veterinary Services"),
    "18120": ("printing",           "Printing & Publishing"),
    "49320": ("taxis",              "Taxis & Private Hire"),
    "90010": ("arts",               "Arts & Entertainment"),
    "85200": ("schools",            "Schools & Education"),
    "47730": ("pharmacy",           "Pharmacy & Health Retail"),
    "46900": ("wholesale",          "Wholesale & Distribution"),
    "93110": ("sports",             "Sports & Leisure Facilities"),
    "93120": ("sports",             "Sports Clubs"),
    "77110": ("vehicle-hire",       "Vehicle Hire & Leasing"),
    "77120": ("vehicle-hire",       "Vehicle Hire & Leasing"),
    "25110": ("manufacturing",      "Manufacturing & Fabrication"),
    "25120": ("manufacturing",      "Manufacturing & Fabrication"),
    "70229": ("management-consulting","Management Consultancy"),
    "70210": ("pr",                 "PR & Communications"),
    "72190": ("research",           "Research & Development"),
    "74909": ("consultancy",        "Business Consultancy"),
}

# ─────────────────────────────────────────────
# REGION MAPPINGS (postcode prefix → slug)
# ─────────────────────────────────────────────
POSTCODE_REGIONS = {
    # Northern Ireland
    "BT": "northern-ireland",
    # Scotland
    "AB": "scotland", "DD": "scotland", "DG": "scotland", "EH": "scotland",
    "FK": "scotland", "G":  "scotland", "HS": "scotland", "IV": "scotland",
    "KA": "scotland", "KW": "scotland", "KY": "scotland", "ML": "scotland",
    "PA": "scotland", "PH": "scotland", "TD": "scotland", "ZE": "scotland",
    # Wales
    "CF": "wales", "LD": "wales", "LL": "wales",
    "NP": "wales", "SA": "wales",
    # London
    "E":  "london", "EC": "london", "N":  "london", "NW": "london",
    "SE": "london", "SW": "london", "W":  "london", "WC": "london",
    "BR": "london", "CR": "london", "DA": "london", "EN": "london",
    "HA": "london", "IG": "london", "KT": "london", "RM": "london",
    "SM": "london", "TW": "london", "UB": "london", "WD": "london",
    # South East
    "BN": "south-east", "GU": "south-east", "HP": "south-east",
    "ME": "south-east", "MK": "south-east", "OX": "south-east",
    "PO": "south-east", "RG": "south-east", "RH": "south-east",
    "SL": "south-east", "SO": "south-east", "TN": "south-east",
    "CT": "south-east", "GU": "south-east",
    # South West
    "BA": "south-west", "BH": "south-west", "BS": "south-west",
    "DT": "south-west", "EX": "south-west", "GL": "south-west",
    "PL": "south-west", "SP": "south-west", "TA": "south-west",
    "TQ": "south-west", "TR": "south-west",
    # East Midlands
    "CV": "east-midlands", "DE": "east-midlands", "LE": "east-midlands",
    "LN": "east-midlands", "NG": "east-midlands", "NN": "east-midlands",
    "PE": "east-midlands",
    # West Midlands
    "B":  "west-midlands", "DY": "west-midlands", "ST": "west-midlands",
    "TF": "west-midlands", "WR": "west-midlands", "WS": "west-midlands",
    "WV": "west-midlands",
    # East of England
    "AL": "east-england", "CB": "east-england", "CM": "east-england",
    "CO": "east-england", "IP": "east-england", "LU": "east-england",
    "NR": "east-england", "SG": "east-england", "SS": "east-england",
    # Yorkshire
    "BD": "yorkshire", "DN": "yorkshire", "HD": "yorkshire",
    "HG": "yorkshire", "HU": "yorkshire", "HX": "yorkshire",
    "LS": "yorkshire", "S":  "yorkshire", "WF": "yorkshire", "YO": "yorkshire",
    # North West
    "BB": "north-west", "BL": "north-west", "CA": "north-west",
    "CH": "north-west", "CW": "north-west", "FY": "north-west",
    "L":  "north-west", "LA": "north-west", "M":  "north-west",
    "OL": "north-west", "PR": "north-west", "SK": "north-west",
    "WA": "north-west", "WN": "north-west",
    # North East
    "DH": "north-east", "DL": "north-east", "NE": "north-east",
    "SR": "north-east", "TS": "north-east",
    # East Midlands additions
    "MK": "east-midlands",
}

REGION_NAMES = {
    "northern-ireland": "Northern Ireland",
    "scotland":         "Scotland",
    "wales":            "Wales",
    "london":           "London",
    "south-east":       "South East England",
    "south-west":       "South West England",
    "east-midlands":    "East Midlands",
    "west-midlands":    "West Midlands",
    "east-england":     "East of England",
    "yorkshire":        "Yorkshire & Humber",
    "north-west":       "North West England",
    "north-east":       "North East England",
}

# Affiliates / CTAs per industry
INDUSTRY_AFFILIATES = {
    "cleaning":          ["business-insurance", "payroll-software"],
    "pest-control":      ["business-insurance", "vehicle-insurance"],
    "landscaping":       ["business-insurance", "vehicle-insurance"],
    "construction":      ["business-insurance", "accounting-software"],
    "electrical":        ["business-insurance", "accounting-software"],
    "plumbing":          ["business-insurance", "accounting-software"],
    "accounting":        ["accounting-software", "business-banking"],
    "legal":             ["legal-software", "business-banking"],
    "software":          ["business-banking", "accounting-software"],
    "restaurants":       ["pos-software", "business-insurance"],
    "hotels":            ["business-insurance", "accounting-software"],
    "healthcare":        ["business-insurance", "payroll-software"],
    "recruitment":       ["hr-software", "payroll-software"],
    "transport":         ["vehicle-insurance", "accounting-software"],
    "security":          ["business-insurance", "accounting-software"],
    "beauty":            ["pos-software", "business-insurance"],
    "automotive":        ["business-insurance", "accounting-software"],
    "childcare":         ["payroll-software", "business-insurance"],
}

AFFILIATE_DETAILS = {
    "business-insurance": {
        "label":       "Get Business Insurance",
        "description": "Compare quotes from Simply Business",
        "url":         "https://www.simplybusiness.co.uk",
        "cta":         "Get a Quote →",
        "commission":  "~£50 per policy",
    },
    "accounting-software": {
        "label":       "Accounting Software",
        "description": "Free 30-day Xero trial for your business",
        "url":         "https://www.xero.com/uk",
        "cta":         "Try Free →",
        "commission":  "~£20 per referral",
    },
    "business-banking": {
        "label":       "Business Bank Account",
        "description": "Open a Tide business account in minutes",
        "url":         "https://www.tide.co",
        "cta":         "Open Account →",
        "commission":  "~£100 per account",
    },
    "payroll-software": {
        "label":       "Payroll Software",
        "description": "Manage payroll easily with Sage",
        "url":         "https://www.sage.com/en-gb",
        "cta":         "Learn More →",
        "commission":  "~£15 per referral",
    },
    "vehicle-insurance": {
        "label":       "Fleet & Van Insurance",
        "description": "Compare commercial vehicle insurance",
        "url":         "https://www.adrianflux.co.uk",
        "cta":         "Compare Quotes →",
        "commission":  "~£30 per lead",
    },
    "pos-software": {
        "label":       "POS & Payments",
        "description": "Accept card payments with Square",
        "url":         "https://squareup.com/gb",
        "cta":         "Start Free →",
        "commission":  "Revenue share",
    },
    "hr-software": {
        "label":       "HR Software",
        "description": "Manage your team with BrightHR",
        "url":         "https://www.brighthr.com",
        "cta":         "Try Free →",
        "commission":  "~£25 per referral",
    },
    "legal-software": {
        "label":       "Practice Management",
        "description": "Legal practice software for UK firms",
        "url":         "https://www.leap.co.uk",
        "cta":         "Book Demo →",
        "commission":  "~£50 per lead",
    },
}

ACTIVE_STATUSES = {
    "Active",
    "Active - Proposal to Strike off",
    "Voluntary Arrangement",
}

COMPANIES_HOUSE_URL = (
    "https://download.companieshouse.gov.uk/BasicCompanyDataAsOneFile.zip"
)

MAX_COMPANIES_PER_PAGE = None   # Load all companies — filtered client-side
MIN_COMPANIES_TO_INCLUDE = 5   # skip pages with fewer companies than this


def get_postcode_prefix(postcode: str) -> str:
    """Extract the letter prefix(es) from a UK postcode."""
    if not postcode:
        return ""
    pc = postcode.strip().upper()
    # Match 1-2 letter prefix
    m = re.match(r'^([A-Z]{1,2})', pc)
    return m.group(1) if m else ""


def postcode_to_region(postcode: str) -> str | None:
    prefix = get_postcode_prefix(postcode)
    # Try two-letter first, then one-letter
    return (
        POSTCODE_REGIONS.get(prefix)
        or (POSTCODE_REGIONS.get(prefix[0]) if len(prefix) >= 1 else None)
    )


def sic_to_industry(sic_text: str) -> tuple[str, str] | None:
    """Extract SIC code number and map to industry."""
    if not sic_text:
        return None
    # CH format: "81210 - Window cleaning activities" or just "81210"
    m = re.match(r'(\d{5})', sic_text.strip())
    if not m:
        return None
    code = m.group(1)
    return INDUSTRY_MAP.get(code)


def calc_age_years(inc_date_str: str) -> float | None:
    """Return company age in years from incorporation date string."""
    if not inc_date_str:
        return None
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y"):
        try:
            inc = datetime.strptime(inc_date_str.strip(), fmt).date()
            return round((date.today() - inc).days / 365.25, 1)
        except ValueError:
            continue
    return None


def download_bulk_data() -> BytesIO:
    print("⬇️  Downloading Companies House bulk data (~500MB)...")
    print("    This takes 5-15 minutes depending on your connection.")
    resp = requests.get(COMPANIES_HOUSE_URL, stream=True, timeout=600)
    resp.raise_for_status()
    buf = BytesIO()
    downloaded = 0
    for chunk in resp.iter_content(chunk_size=1024 * 1024):
        buf.write(chunk)
        downloaded += len(chunk)
        if downloaded % (50 * 1024 * 1024) == 0:
            print(f"    {downloaded // (1024*1024)} MB downloaded...")
    buf.seek(0)
    print("✅  Download complete.")
    return buf


def process_data(buf: BytesIO) -> dict:
    """
    Parse the bulk CSV and aggregate companies by industry + region.
    Returns a dict keyed by (industry_slug, region_slug).
    """
    print("⚙️  Processing company data...")

    # industry_slug → region_slug → list of company dicts
    grouped: dict[str, dict[str, list]] = defaultdict(lambda: defaultdict(list))

    total = 0
    matched = 0

    buf.seek(0)
    import io as _io
    text_buf = _io.TextIOWrapper(buf, encoding="latin-1")
    reader = csv.DictReader(text_buf, delimiter=",")

    for row in reader:
        total += 1
        if total % 500_000 == 0:
            print(f"    Processed {total:,} rows, {matched:,} matched...")

        # Only active companies
        status = row.get("CompanyStatus", "").strip()
        if status not in ACTIVE_STATUSES:
            continue

        # Resolve region
        postcode = row.get("RegAddress.PostCode", "").strip()
        region = postcode_to_region(postcode)
        if not region:
            continue

        # Resolve industry from SIC codes (try all 4 SIC fields)
        industry_info = None
        for i in range(1, 5):
            sic_text = row.get(f"SICCode.SicText_{i}", "")
            industry_info = sic_to_industry(sic_text)
            if industry_info:
                break
        if not industry_info:
            continue

        industry_slug, industry_name = industry_info

        inc_date = row.get("IncorporationDate", "").strip()
        age = calc_age_years(inc_date)

        # Age bracket
        if age is None:
            age_bracket = "Unknown"
        elif age < 2:
            age_bracket = "0-2 years"
        elif age < 5:
            age_bracket = "2-5 years"
        elif age < 10:
            age_bracket = "5-10 years"
        elif age < 20:
            age_bracket = "10-20 years"
        else:
            age_bracket = "20+ years"

        # Accounts & returns signals
        accounts_due    = row.get("Accounts.NextDueDate", "").strip()
        accounts_made   = row.get("Accounts.LastMadeUpDate", "").strip()
        accounts_cat    = row.get("Accounts.AccountCategory", "").strip()
        returns_due     = row.get("Returns.NextDueDate", "").strip()
        returns_made    = row.get("Returns.LastMadeUpDate", "").strip()

        # Overdue flags
        today_str = date.today().isoformat()
        def is_overdue(due_str):
            if not due_str:
                return False
            for fmt in ("%d/%m/%Y", "%Y-%m-%d"):
                try:
                    return datetime.strptime(due_str, fmt).date() < date.today()
                except ValueError:
                    continue
            return False

        accounts_overdue = is_overdue(accounts_due)
        returns_overdue  = False  # Abolished 2016 - legacy field, always False
        is_dormant       = "dormant" in accounts_cat.lower()

        # Mortgage / charges data
        num_mortgages = 0
        try:
            num_mortgages = int(row.get("Mortgages.NumMortCharges", "0").strip() or "0")
        except ValueError:
            pass

        outstanding_mortgages = 0
        try:
            outstanding_mortgages = int(row.get("Mortgages.NumMortOutstanding", "0").strip() or "0")
        except ValueError:
            pass

        # Company type clean
        company_type = row.get("CompanyCategory", "").strip()

        # Official size classification from Accounts.AccountCategory
        acc_cat_upper = accounts_cat.upper().strip()
        if "MICRO" in acc_cat_upper:
            size_classification = "Micro Entity"
        elif "SMALL" in acc_cat_upper and "EXEMPTION" not in acc_cat_upper:
            size_classification = "Small"
        elif "TOTAL EXEMPTION SMALL" in acc_cat_upper:
            size_classification = "Small (Total Exemption)"
        elif "TOTAL EXEMPTION FULL" in acc_cat_upper:
            size_classification = "Small (Total Exemption Full)"
        elif "MEDIUM" in acc_cat_upper:
            size_classification = "Medium"
        elif "FULL" in acc_cat_upper:
            size_classification = "Large (Full)"
        elif "DORMANT" in acc_cat_upper:
            size_classification = "Dormant"
        elif "GROUP" in acc_cat_upper:
            size_classification = "Group"
        elif "INITIAL" in acc_cat_upper or not acc_cat_upper:
            size_classification = "Not Yet Filed"
        else:
            size_classification = accounts_cat if accounts_cat else "Unknown"

        # Stage bracket — based on age (separate from size)
        if age is None:
            stage_bracket = "Unknown"
        elif age < 2:
            stage_bracket = "Startup (0-2 yrs)"
        elif age < 5:
            stage_bracket = "Early Stage (2-5 yrs)"
        elif age < 10:
            stage_bracket = "Growing (5-10 yrs)"
        elif age < 20:
            stage_bracket = "Established (10-20 yrs)"
        else:
            stage_bracket = "Veteran (20+ yrs)"

        # Address fields
        post_town = row.get("RegAddress.PostTown", "").strip().title()
        county    = row.get("RegAddress.County", "").strip().title()
        country   = row.get("RegAddress.Country", "").strip().title()

        # Country of origin (for overseas-registered companies)
        country_of_origin = row.get("CountryOfOrigin", "").strip().title()
        is_overseas = bool(country_of_origin and country_of_origin.lower() not in (
            "", "united kingdom", "england", "wales", "scotland", "northern ireland", "not specified"
        ))

        # Confirmation statement overdue
        conf_stmt_due = row.get("ConfStmtNextDueDate", "").strip()
        conf_stmt_overdue = is_overdue(conf_stmt_due)

        # Additional mortgage details
        num_mort_satisfied = 0
        try:
            num_mort_satisfied = int(row.get("Mortgages.NumMortSatisfied", "0").strip() or "0")
        except ValueError:
            pass

        num_mort_part_satisfied = 0
        try:
            num_mort_part_satisfied = int(row.get("Mortgages.NumMortPartSatisfied", "0").strip() or "0")
        except ValueError:
            pass

        # Previous name — has company rebranded?
        prev_name = (row.get(" PreviousName_1.CompanyName") or row.get("PreviousName_1.CompanyName") or "").strip()
        has_prev_name = bool(prev_name)

        # Limited partnership data
        num_gen_partners = 0
        try:
            num_gen_partners = int(row.get("LimitedPartnerships.NumGenPartners", "0").strip() or "0")
        except ValueError:
            pass

        num_lim_partners = 0
        try:
            num_lim_partners = int(row.get("LimitedPartnerships.NumLimPartners", "0").strip() or "0")
        except ValueError:
            pass

        is_lp = num_gen_partners > 0 or num_lim_partners > 0

        company = {
            "name":                   row.get("CompanyName", "").strip().title(),
            "number":                 (row.get(" CompanyNumber") or row.get("CompanyNumber") or "").strip(),
            "postcode":               postcode,
            "postTown":               post_town,
            "county":                 county,
            "country":                country,
            "countryOfOrigin":        country_of_origin,
            "isOverseas":             is_overseas,
            "status":                 status,
            "incorporated":           inc_date,
            "ageYears":               age,
            "ageBracket":             stage_bracket,
            "sizeBracket":            stage_bracket,
            "sizeClassification":     size_classification,
            "companyType":            company_type,
            "accountsOverdue":        accounts_overdue,
            "returnsOverdue":         returns_overdue,
            "confStmtOverdue":        conf_stmt_overdue,
            "isDormant":              is_dormant,
            "accountsLastMadeUp":     accounts_made,
            "numMortgages":           num_mortgages,
            "outstandingMortgages":   outstanding_mortgages,
            "numMortSatisfied":       num_mort_satisfied,
            "numMortPartSatisfied":   num_mort_part_satisfied,
            "hasPreviousName":        has_prev_name,
            "previousName":           prev_name,
            "accountsCategory":       accounts_cat,
            "isLP":                   is_lp,
            "numGenPartners":         num_gen_partners,
            "numLimPartners":         num_lim_partners,
        }

        grouped[industry_slug][region].append(company)
        matched += 1

    print(f"✅  Processed {total:,} total rows. {matched:,} companies matched.")
    return grouped


def compute_stats(companies: list) -> dict:
    ages = [c["ageYears"] for c in companies if c["ageYears"] is not None]
    statuses            = defaultdict(int)
    age_brackets        = defaultdict(int)
    size_classifications= defaultdict(int)
    company_types       = defaultdict(int)
    post_towns          = defaultdict(int)
    counties            = defaultdict(int)
    countries           = defaultdict(int)
    countries_of_origin = defaultdict(int)

    accounts_overdue_count   = 0
    returns_overdue_count    = 0
    conf_stmt_overdue_count  = 0
    dormant_count            = 0
    with_mortgages           = 0
    with_satisfied_charges   = 0
    overseas_count           = 0
    rebranded_count          = 0
    lp_count                 = 0

    for c in companies:
        statuses[c["status"]] += 1
        age_brackets[c.get("ageBracket", "Unknown")] += 1
        size_classifications[c.get("sizeClassification", "Unknown")] += 1
        if c.get("companyType"):
            company_types[c["companyType"]] += 1
        if c.get("postTown"):
            post_towns[c["postTown"]] += 1
        if c.get("county"):
            counties[c["county"]] += 1
        if c.get("country"):
            countries[c["country"]] += 1
        if c.get("countryOfOrigin"):
            countries_of_origin[c["countryOfOrigin"]] += 1
        if c.get("accountsOverdue"):   accounts_overdue_count  += 1
        if c.get("returnsOverdue"):    returns_overdue_count   += 1
        if c.get("confStmtOverdue"):   conf_stmt_overdue_count += 1
        if c.get("isDormant"):         dormant_count           += 1
        if c.get("numMortgages", 0) > 0:       with_mortgages         += 1
        if c.get("numMortSatisfied", 0) > 0:   with_satisfied_charges += 1
        if c.get("isOverseas"):        overseas_count          += 1
        if c.get("hasPreviousName"):   rebranded_count         += 1
        if c.get("isLP"):              lp_count                += 1

    young       = sum(1 for a in ages if a < 3)
    established = sum(1 for a in ages if a >= 10)

    # Top towns by count (limit to top 30 for UI)
    top_towns = dict(sorted(post_towns.items(), key=lambda x: x[1], reverse=True)[:30])

    return {
        "averageAgeYears":        round(sum(ages) / len(ages), 1) if ages else None,
        "youngCompanies":         young,
        "establishedCompanies":   established,
        "statusBreakdown":        dict(statuses),
        "ageBrackets":            dict(age_brackets),
        "sizeClassifications":    dict(size_classifications),
        "companyTypes":           dict(company_types),
        "topTowns":               top_towns,
        "counties":               dict(counties),
        "countries":              dict(countries),
        "countriesOfOrigin":      dict(countries_of_origin),
        "accountsOverdueCount":   accounts_overdue_count,
        "returnsOverdueCount":    returns_overdue_count,
        "confStmtOverdueCount":   conf_stmt_overdue_count,
        "dormantCount":           dormant_count,
        "withMortgagesCount":     with_mortgages,
        "withSatisfiedCharges":   with_satisfied_charges,
        "overseasCount":          overseas_count,
        "rebrandedCount":         rebranded_count,
        "lpCount":                lp_count,
    }


def generate_json_files(grouped: dict, out_dir: Path):
    """Generate all JSON data files consumed by Next.js."""
    out_dir.mkdir(parents=True, exist_ok=True)
    ir_dir = out_dir / "ir"
    ir_dir.mkdir(exist_ok=True)

    industries_index = []
    all_regions_set = set()
    total_pages_generated = 0

    for industry_slug, regions in grouped.items():
        industry_name = None
        # Find name from map
        for _, (slug, name) in INDUSTRY_MAP.items():
            if slug == industry_slug:
                industry_name = name
                break
        if not industry_name:
            continue

        industry_total = sum(len(v) for v in regions.values())
        top_regions = sorted(regions.keys(), key=lambda r: len(regions[r]), reverse=True)[:5]

        industries_index.append({
            "slug":          industry_slug,
            "name":          industry_name,
            "totalCompanies": industry_total,
            "topRegions":    top_regions,
            "affiliates":    INDUSTRY_AFFILIATES.get(industry_slug, ["business-insurance", "accounting-software"]),
        })

        for region_slug, companies in regions.items():
            if len(companies) < MIN_COMPANIES_TO_INCLUDE:
                continue
            all_regions_set.add(region_slug)

            # Sort: newest first
            companies_sorted = sorted(
                companies,
                key=lambda c: c.get("incorporated", "") or "",
                reverse=True
            )

            page_data = {
                "industry":     industry_slug,
                "industryName": industry_name,
                "region":       region_slug,
                "regionName":   REGION_NAMES.get(region_slug, region_slug.title()),
                "count":        len(companies),
                "companies":    companies_sorted if MAX_COMPANIES_PER_PAGE is None else companies_sorted[:MAX_COMPANIES_PER_PAGE],
                "stats":        compute_stats(companies),
                "affiliates": [
                    AFFILIATE_DETAILS[a]
                    for a in INDUSTRY_AFFILIATES.get(industry_slug, ["business-insurance", "accounting-software"])
                    if a in AFFILIATE_DETAILS
                ],
                "updated":      "2 March 2026",
            }

            fname = ir_dir / f"{industry_slug}__{region_slug}.json"
            with open(fname, "w", encoding="utf-8") as fp:
                json.dump(page_data, fp, ensure_ascii=False)
            total_pages_generated += 1

    # industries.json
    industries_index_sorted = sorted(industries_index, key=lambda x: x["totalCompanies"], reverse=True)
    with open(out_dir / "industries.json", "w", encoding="utf-8") as fp:
        json.dump(industries_index_sorted, fp, ensure_ascii=False, indent=2)

    # regions.json
    regions_list = [
        {"slug": slug, "name": REGION_NAMES.get(slug, slug)}
        for slug in sorted(all_regions_set)
    ]
    with open(out_dir / "regions.json", "w", encoding="utf-8") as fp:
        json.dump(regions_list, fp, ensure_ascii=False, indent=2)

    # manifest.json  — list of all generated [industry, region] pairs
    manifest = []
    for industry_slug, regions in grouped.items():
        for region_slug, companies in regions.items():
            if len(companies) >= MIN_COMPANIES_TO_INCLUDE:
                industry_name = next(
                    (name for _, (slug, name) in INDUSTRY_MAP.items() if slug == industry_slug),
                    industry_slug
                )
                manifest.append({
                    "industry":     industry_slug,
                    "industryName": industry_name,
                    "region":       region_slug,
                    "regionName":   REGION_NAMES.get(region_slug, region_slug),
                    "count":        len(companies),
                })
    with open(out_dir / "manifest.json", "w", encoding="utf-8") as fp:
        json.dump(manifest, fp, ensure_ascii=False, indent=2)

    print(f"✅  Generated {total_pages_generated:,} industry+region data files.")
    print(f"    {len(industries_index):,} industries | {len(all_regions_set):,} regions")
    print(f"    Output: {out_dir.resolve()}")

    return total_pages_generated


def main():
    print("=" * 60)
    print("  UK Business Intelligence Pipeline")
    print("=" * 60)

    out_dir = Path(__file__).parent.parent / "web" / "public" / "data"

    import io
    csv_path = Path(__file__).parent / "companies.csv"
    if not csv_path.exists():
        print("❌  companies.csv not found in the pipeline folder.")
        print("    Please download the latest Companies House bulk data file,")
        print("    rename it to companies.csv, and place it in this folder.")
        print("    Download from: https://download.companieshouse.gov.uk/en_output.html")
        return
    print(f"📂  Reading local file: {csv_path} ({csv_path.stat().st_size // (1024*1024)} MB)")
    buf = io.BytesIO(csv_path.read_bytes())
    grouped = process_data(buf)
    pages = generate_json_files(grouped, out_dir)

    print()
    print("🎉  Pipeline complete!")
    print(f"    {pages:,} pages of data ready for the site.")
    print()
    print("Next step: cd ../web && npm run build")


if __name__ == "__main__":
    main()
