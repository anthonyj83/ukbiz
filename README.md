# UK Business Finder — Complete Launch Guide

## What You're Building

A programmatic SEO site that auto-generates **thousands of pages** from Companies House
data. Each page covers a specific industry + region combination (e.g. "Cleaning Companies
in London", "Accountants in Scotland"). The site earns via:

- **Google AdSense** — display ads on every page
- **Affiliate commissions** — business insurance (Simply Business ~£50/policy),
  accounting software (Xero ~£20/referral), business banking (Tide ~£100/account)

Estimated pages generated: **800–1,500** industry+region combinations.
Each page targets unique, high-intent long-tail keywords.

---

## Tech Stack

| Layer       | Tool          | Cost      |
|-------------|---------------|-----------|
| Data        | Python script | Free      |
| Framework   | Next.js 14    | Free      |
| Hosting     | Vercel        | Free tier |
| Domain      | Namecheap/GoDaddy | ~£10/yr |
| Database    | None (static JSON) | Free |

---

## Step 1 — Register Your Domain (Day 1, 10 minutes)

1. Go to [Namecheap](https://www.namecheap.com) or [123-reg](https://www.123-reg.co.uk)
2. Search for your domain. Options:
   - `ukbizfinder.co.uk` ← recommended
   - `ukcompanysearch.co.uk`
   - `britishbizdata.co.uk`
3. Buy it. ~£8–12/year.
4. You'll point it at Vercel in Step 5.

---

## Step 2 — Set Up Your Computer (Day 1, 30 minutes)

You need: **Python 3.10+**, **Node.js 18+**, **Git**

### Check if already installed:
```bash
python --version    # needs 3.10+
node --version      # needs 18+
git --version
```

### Install if missing:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org (download LTS)
- Git: https://git-scm.com/downloads

---

## Step 3 — Run the Data Pipeline (Day 1–2)

This downloads Companies House data and generates the JSON files the site uses.

```bash
# Navigate to the pipeline folder
cd ukbiz/pipeline

# Install Python dependencies
pip install -r requirements.txt

# Run the pipeline
# ⚠️  This downloads ~500MB and takes 20-40 minutes total
python pipeline.py
```

### What it does:
1. Downloads `BasicCompanyDataAsOneFile.zip` from Companies House (~500MB)
2. Parses ~5 million company records
3. Filters to active companies with known SIC codes + UK postcodes
4. Groups by industry + region
5. Outputs JSON files to `web/public/data/`

### Expected output:
```
✅  Download complete.
✅  Processed 5,200,000 total rows. 890,000 companies matched.
✅  Generated 1,247 industry+region data files.
    68 industries | 13 regions
🎉  Pipeline complete!
```

---

## Step 4 — Run the Site Locally (Day 2, 15 minutes)

```bash
# Navigate to the web folder
cd ../web

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

You should see the homepage with industry grid and region grid populated with real data.

### Test key pages:
- http://localhost:3000 — homepage
- http://localhost:3000/cleaning — all cleaning companies by region
- http://localhost:3000/cleaning/london — cleaning companies in London (main money page)
- http://localhost:3000/industries — all industries

---

## Step 5 — Deploy to Vercel (Day 2–3, 1 hour)

### 5a. Create a GitHub repository

1. Go to https://github.com and create a free account (if you don't have one)
2. Create a new repository called `ukbiz`
3. Push your code:

```bash
cd ukbiz          # top-level project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ukbiz.git
git push -u origin main
```

### 5b. Deploy on Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project"
3. Import your `ukbiz` repository
4. Set the **Root Directory** to `web`
5. Framework: **Next.js** (auto-detected)
6. Click **Deploy**

First deploy takes 3–8 minutes (building all static pages).

### 5c. Connect your domain

1. In Vercel → your project → Settings → Domains
2. Add your domain: `ukbizfinder.co.uk`
3. Follow Vercel's instructions to update your DNS at Namecheap/123-reg
4. Wait 10–30 minutes for DNS to propagate

Your site is now live at your domain. 🎉

---

## Step 6 — Set Up Google AdSense (Day 3–5)

1. Go to https://adsense.google.com
2. Sign up with a Google account
3. Add your site URL
4. **Verify ownership**: paste the meta tag they give you into `web/app/layout.tsx`
5. Wait for approval (usually 1–7 days for new sites — you need some content indexed first)

### Once approved:

In `web/app/layout.tsx`, uncomment and update the AdSense script:

```tsx
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ID"
  crossOrigin="anonymous"
/>
```

Replace the "Advertisement" placeholder divs in the page files with real AdSense ad units:

```tsx
<ins
  className="adsbygoogle"
  style={{ display: "block" }}
  data-ad-client="ca-pub-YOUR_ID"
  data-ad-slot="YOUR_SLOT_ID"
  data-ad-format="auto"
  data-full-width-responsive="true"
/>
```

---

## Step 7 — Set Up Affiliate Links (Day 3)

### Simply Business (business insurance) — ~£50 per policy
1. Go to https://www.simplybusiness.co.uk/partners/
2. Apply to their affiliate programme
3. Replace the `url` in `pipeline/pipeline.py` → `AFFILIATE_DETAILS` with your affiliate URL

### Xero (accounting software) — ~£20 per referral
1. Go to https://www.xero.com/uk/accountants-bookkeepers/partner-programme/
2. Apply as a referral partner
3. Update the Xero URL in `AFFILIATE_DETAILS`

### Tide (business banking) — ~£100 per account
1. Go to https://www.tide.co/partners/refer/
2. Sign up as a referral partner
3. Update the Tide URL in `AFFILIATE_DETAILS`

### Alternative: Use Awin affiliate network
Awin (https://www.awin.com) covers all major UK business brands in one place.
Apply once, get affiliate links for Simply Business, Xero, Sage, and hundreds more.

---

## Step 8 — Monthly Data Refresh (Ongoing, 30 minutes/month)

Companies House updates their bulk data monthly. To refresh your site:

```bash
cd ukbiz/pipeline
python pipeline.py        # re-downloads + reprocesses

cd ../web
npm run build             # rebuild the site

git add .
git commit -m "Monthly data refresh - $(date +%B %Y)"
git push
```

Vercel auto-deploys when you push to GitHub. Done.

---

## Step 9 — SEO Setup (Week 1–2)

### Submit to Google Search Console
1. Go to https://search.google.com/search-console
2. Add your domain
3. Verify ownership (Vercel makes this easy via DNS)
4. Submit your sitemap: `https://ukbizfinder.co.uk/sitemap.xml`

### Submit to Bing Webmaster Tools
1. https://www.bing.com/webmasters
2. Add your site + submit sitemap

### Google will begin crawling within days.
With 1,000+ unique pages of real Companies House data, you should see:
- First rankings: 4–8 weeks
- Meaningful traffic: 3–6 months
- £500–£2,000+/month: 6–12 months (ad revenue + affiliate)

---

## Revenue Projection

| Traffic (monthly) | AdSense RPM | Ad Revenue | Affiliate (1% CVR) | Total |
|-------------------|-------------|------------|---------------------|-------|
| 5,000 visits | £3 | £15 | £100 | £115 |
| 20,000 visits | £4 | £80 | £400 | £480 |
| 50,000 visits | £5 | £250 | £1,000 | £1,250 |
| 100,000 visits | £6 | £600 | £2,000 | £2,600 |
| 500,000 visits | £7 | £3,500 | £10,000 | £13,500 |

*RPM = Revenue per 1,000 page views. Figures are estimates.*

---

## Scaling Ideas (Month 2+)

1. **Add city-level pages** — `/cleaning/london/camden/` — 10x the pages, 10x the traffic
2. **Add SIC code detail pages** — deeper content = better E-E-A-T
3. **Add a "for sale" filter** — companies with directors aged 60+ flagged as potential acquisitions
4. **Email list** — "Get monthly SME sector reports" → build a list → promote affiliate products
5. **Sell the site** — at 5–7x annual revenue once established (£50k–£100k+ exit)

---

## Folder Structure Reference

```
ukbiz/
├── pipeline/
│   ├── pipeline.py        ← Run this first (downloads + processes data)
│   └── requirements.txt
└── web/
    ├── app/
    │   ├── layout.tsx     ← Add AdSense code here
    │   ├── page.tsx       ← Homepage
    │   ├── [industry]/
    │   │   ├── page.tsx   ← Industry hub (e.g. /cleaning)
    │   │   └── [region]/
    │   │       └── page.tsx ← MONEY PAGE (e.g. /cleaning/london)
    │   ├── industries/
    │   │   └── page.tsx   ← All industries listing
    │   ├── about/page.tsx
    │   ├── sitemap.ts     ← Auto-generates XML sitemap
    │   └── robots.ts
    ├── public/
    │   └── data/          ← Generated by pipeline.py (don't edit manually)
    │       ├── industries.json
    │       ├── regions.json
    │       ├── manifest.json
    │       └── ir/
    │           └── cleaning__london.json (one per page)
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Questions / Next Steps

1. Change your domain name: find/replace `ukbizfinder.co.uk` in `layout.tsx`, `sitemap.ts`, `robots.ts`
2. Change your contact email: find/replace `hello@ukbizfinder.co.uk` in `about/page.tsx`
3. Add more SIC codes: edit `INDUSTRY_MAP` in `pipeline.py` and re-run
4. Add more affiliate products: edit `AFFILIATE_DETAILS` in `pipeline.py` and re-run

Good luck. This is a real, scalable business. Execute fast.
