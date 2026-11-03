# CrashLens System Architecture

## 1. Overview & Architectural Philosophy

CrashLens separates the computationally intensive offline Machine Learning & Spatial Data Pipeline from the production Web Visualization Platform.

```
+-------------------------------------------------------------------------+
|                          OFFLINE PYTHON PIPELINE                         |
|                                                                         |
|  [UK DfT STATS19 CSV]                                                    |
|           │ (20.1 MB raw collision records)                              |
|           ▼                                                             |
|  [data_loader.py & data_cleaner.py]                                      |
|           │ Schema normalization, London boundary (51.28°-51.69°N),      |
|           │ coordinate verification (26,030 retained collisions)         |
|           ▼                                                             |
|  [geo_utils.py & clustering.py]                                          |
|           │ Great-Circle Haversine angular metric (Earth R=6371.0088 km) |
|           │ scikit-learn DBSCAN (eps=250m, min_samples=8)                |
|           │ KMeans baseline (K=8, Elbow & Silhouette evaluation)         |
|           ▼                                                             |
|  [hotspot_ranking.py & analytics.py]                                     |
|           │ Severity weighting: Score = 10*Fatal + 4*Serious + 1*Slight  |
|           │ Temporal curves, environmental distributions, insights       |
|           ▼                                                             |
|  [export_data.py]                                                        |
|           │ Serializes deterministic, compact JSON and GeoJSON outputs   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                  NEXT.JS PRODUCTION APPLICATION (VERCEL)                |
|                                                                         |
|  [public/data/*.json & *.geojson]                                       |
|           │ Pre-rendered at build time with zero serverless cold starts  |
|           ▼                                                             |
|  [App Router Page (Server Component)]                                   |
|           │ Fast filesystem read / static generation                    |
|           ▼                                                             |
|  [CrashLensAppShell (Interactive Client Engine)]                         |
|           ├── Navbar & Responsive Mobile Drawer                          |
|           ├── Theme Engine (Light, Comfort, Dark)                        |
|           ├── Voice Narration Player (Web Speech API)                   |
|           ├── CrashLens Animated Radar Scanner                          |
|           ├── Intelligence Dashboard (9 KPIs, 8 Recharts charts)        |
|           ├── Interactive Hotspot Explorer (Leaflet GIS map)             |
|           ├── Clustering Laboratory (KMeans vs DBSCAN sandbox)          |
|           ├── Severity Intelligence (Ranked hotspots leaderboard)        |
|           ├── Temporal Analytics (24h diurnal curve, rush hours)        |
|           ├── Road Safety Insights (Deterministic empirical findings)   |
|           ├── Methodology & Learning Centre (Math & trigonometry)       |
|           ├── Data & Transparency (Audit trail & OGL licensing)         |
|           └── About & Specifications                                    |
+-------------------------------------------------------------------------+
```

## 2. Key Technology Choices

- **Next.js 15 App Router**: Server-side pre-rendering with static export capability for maximal performance and zero server maintenance on Vercel.
- **Leaflet & CartoDB Voyager**: Fast, lightweight, standards-compliant slippy map client without paid API keys.
- **Recharts**: Responsive SVG charting for statistical distributions.
- **scikit-learn with Haversine Metric**: Exact spherical distance calculations without planar Euclidean distortions.
- **Web Speech API**: Zero-dependency browser-native text-to-speech briefing.
