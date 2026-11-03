# CrashLens 🚨🛰️

> **"Finding where accidents cluster, not just where they happen."**

**Project Number:** 004  
**Domain:** Public Safety / Transportation Intelligence  
**Core Technologies:** Unsupervised Machine Learning (Haversine DBSCAN & KMeans), Geospatial Analytics, Next.js 15, React 19, TypeScript, Tailwind CSS, Leaflet, Recharts, Python 3.13, scikit-learn.

---

## 1. Project Overview

**CrashLens** is a full-stack road safety intelligence platform designed to analyze empirical collision distributions and identify dangerous road segments. Rather than treating accidents as isolated pinpoints on a spreadsheet, CrashLens uses unsupervised density-based clustering to isolate high-risk corridors, roundabout complexes, and intersection hazards from background noise.

### Key Capabilities
- **Primary Detector:** DBSCAN with Great-Circle Haversine angular distance metric ($R = 6,371.0088\text{ km}$).
- **Baseline Comparison:** Centroid-based KMeans with within-cluster sum of squares (WCSS / Inertia) and Silhouette score analysis.
- **Severity-Weighted Ranking:** Multi-attribute risk index ($10 \times \text{Fatal} + 4 \times \text{Serious} + 1 \times \text{Slight}$) prioritizing civil interventions.
- **Interactive Geospatial Map:** Leaflet GIS explorer with algorithm layer toggling (DBSCAN vs KMeans vs Incident Points), noise exclusion, and cluster inspector drawer.
- **8 Dynamic Statistical Visualizations:** Diurnal 24h curves, weekday vs weekend patterns, monthly seasonality, road type classifications, and lighting breakdowns.
- **Audio Briefing:** Native Web Speech API integration ("Listen to CrashLens") for voice-narrated situational awareness.
- **Triple Theme Appearance:** Dedicated **Light** (safety orange / warm off-white), **Comfort** (balanced neutral stone), and **Dark** (tactical graphite).

---

## 2. Dataset Provenance & Scope

- **Official Source:** UK Department for Transport (DfT) STATS19 Road Casualty Statistics.
- **Source Portal:** [UK Government Road Safety Open Data](https://www.gov.uk/government/statistical-data-sets/road-safety-open-data)
- **Licensing:** Open Government Licence (OGL v3.0).
- **Study Area:** Greater London ($51.28^\circ\text{N}$ to $51.69^\circ\text{N}$, $-0.51^\circ\text{W}$ to $0.33^\circ\text{E}$).
- **Validation Audit:**
  - Raw records loaded: **106,004**
  - Invalid/missing coordinates rejected: **22**
  - Outside London boundary: **79,952**
  - Retained & clustered: **26,030**

*Geographical Scope Notice:* This release analyzes official UK STATS19 data. It does not represent traffic data for Jaipur, Rajasthan, or India.

---

## 3. Getting Started & Local Development

### Prerequisites
- **Node.js:** v18.18+ (tested on v26.13)
- **npm:** v10+ (tested on v11.20)
- **Python:** 3.10+ (tested on 3.13)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/crashlens.git
cd crashlens
```

#### 2. Install Frontend Dependencies
```bash
npm install
```

#### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

---

## 4. Running the Machine Learning Pipeline

The offline Python pipeline cleans the dataset, converts coordinates to radians, runs Haversine DBSCAN and KMeans, and serializes compact static JSON/GeoJSON models to `public/data/` for zero-latency web rendering.

```bash
# Execute end-to-end data pipeline
python python/src/run_pipeline.py
```

### Running Unit Tests
```bash
# Run full pytest suite for geo math, DBSCAN, KMeans, and data validation
python -m pytest python/tests -v
```

---

## 5. Running the Web Application

```bash
# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Production Build & Verification

```bash
# Compile and build production-optimized static bundles
npm run build

# Start production server locally
npm start
```

---

## 7. Deployment Instructions

### A. Publishing to GitHub
1. Ensure `.env` and `data/raw/` are excluded by `.gitignore`.
2. Stage and commit all source code and pre-rendered `public/data/` artifacts:
   ```bash
   git init
   git add .
   git commit -m "feat: complete production release of CrashLens"
   git branch -M main
   git remote add origin https://github.com/<your-username>/crashlens.git
   git push -u origin main
   ```

### B. Deploying to Vercel
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New Project** and import the `crashlens` GitHub repository.
3. Vercel automatically detects **Next.js**.
4. Confirm build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
5. Click **Deploy**.
6. The site will deploy in ~1 minute as static pages pre-hydrated with real STATS19 machine learning outputs—with **zero Python backend runtime overhead**.

---

## 8. Repository Structure

```
crashlens/
├── app/
│   ├── globals.css              # Custom themes (light/comfort/dark) & Leaflet overrides
│   ├── layout.tsx               # Root layout & ThemeProvider
│   └── page.tsx                 # Static Server Component hydrating data
├── components/
│   ├── analytics/
│   │   ├── RoadSafetyInsights.tsx
│   │   ├── SeverityIntelligence.tsx
│   │   └── TemporalAnalytics.tsx
│   ├── clustering/
│   │   ├── ClusteringLaboratory.tsx
│   │   └── MethodologySection.tsx
│   ├── dashboard/
│   │   ├── AboutCrashLens.tsx
│   │   ├── DataTransparency.tsx
│   │   ├── IntelligenceDashboard.tsx
│   │   └── LandingHero.tsx
│   ├── layout/
│   │   ├── CrashLensAppShell.tsx
│   │   └── Footer.tsx
│   ├── maps/
│   │   ├── HotspotExplorer.tsx
│   │   └── LeafletMapInner.tsx
│   ├── navigation/
│   │   └── Navbar.tsx
│   ├── radar/
│   │   └── CrashLensRadar.tsx   # Signature animated SVG/Canvas radar
│   ├── shared/
│   │   └── VoiceNarrationPlayer.tsx
│   └── theme/
│       └── ThemeToggle.tsx
├── data/
│   ├── raw/                     # Raw STATS19 CSV (git ignored)
│   └── processed/               # Compact reproducible analytical JSONs
├── docs/
│   ├── architecture.md
│   ├── data_dictionary.md
│   ├── findings.md
│   └── methodology.md
├── public/
│   └── data/                    # Production JSON & GeoJSON data models
├── python/
│   ├── practice/
│   │   ├── folium_sandbox.py
│   │   └── kmeans_dbscan_sandbox.py
│   ├── src/
│   │   ├── analytics.py
│   │   ├── clustering.py
│   │   ├── data_cleaner.py
│   │   ├── data_loader.py
│   │   ├── evaluation.py
│   │   ├── export_data.py
│   │   ├── geo_utils.py
│   │   ├── hotspot_ranking.py
│   │   └── run_pipeline.py
│   └── tests/
│       ├── test_clustering.py
│       ├── test_data_cleaner.py
│       ├── test_geo_utils.py
│       └── test_hotspot_ranking.py
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── pytest.ini
├── requirements.txt
├── tailwind.config.ts
└── tsconfig.json
```

---

## 9. Security & Safety

- **No Hardcoded Secrets:** No third-party API keys or sensitive credentials are embedded in client code.
- **Static Artifact Delivery:** Eliminates remote code execution risks and server-side request forgery by serving validated static JSONs.
- **Dependency Hygiene:** All dependencies are locked in `package.json` and audited with zero high-severity vulnerabilities.

---

## 10. License

This project is licensed under the MIT License. STATS19 data is provided under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).
