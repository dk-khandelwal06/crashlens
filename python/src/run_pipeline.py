"""
End-to-End Orchestration Pipeline for CrashLens.
Executes data ingestion, spatial validation, KMeans baseline, Haversine DBSCAN,
cluster ranking, exploratory analytics, and production JSON/GeoJSON serialization.
"""

import sys
import os
from pathlib import Path
import pandas as pd

# Ensure python/src is in sys.path
SRC_DIR = Path(__file__).resolve().parent
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from geo_utils import LONDON_BOUNDS, EARTH_RADIUS_KM
from data_cleaner import DataCleaner
from clustering import SpatialClusterEngine
from hotspot_ranking import HotspotRanker
from analytics import AnalyticsEngine
from evaluation import compare_clustering_methods
from export_data import DataExporter
from data_loader import download_stats19_dataset, load_raw_dataset, RAW_DATA_DIR, PROCESSED_DATA_DIR

PUBLIC_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "public" / "data"


def execute_full_pipeline(
    raw_csv_path: Path = None,
    region_name: str = "Greater London",
    dataset_year: int = 2022,
    dbscan_eps_km: float = 0.25,
    dbscan_min_samples: int = 8,
    kmeans_k: int = 8,
):
    print("================================================================")
    print("   CRASHLENS: Geospatial Road Accident Hotspot Detection Pipeline")
    print("================================================================")

    # 1. Load raw data
    if raw_csv_path is None or not raw_csv_path.exists():
        raw_csv_path = RAW_DATA_DIR / "dft-road-casualty-statistics-collision-2022.csv"
        if not raw_csv_path.exists():
            print(f"[Pipeline] Downloading STATS19 dataset from official DfT repository...")
            raw_csv_path = download_stats19_dataset(target_filename=raw_csv_path.name)

    df_raw = load_raw_dataset(raw_csv_path)

    # 2. Clean, validate, and filter to Greater London study area
    print(f"\n[Pipeline] Validating schema and filtering to {region_name} bounds...")
    cleaner = DataCleaner(bounds=LONDON_BOUNDS)
    df_clean, audit_log = cleaner.clean_dataframe(df_raw)
    print(f"[Pipeline] Raw records: {audit_log['raw_record_count']:,}")
    print(f"[Pipeline] Missing/invalid coordinates removed: {audit_log['missing_coordinate_count'] + audit_log['invalid_coordinate_count']:,}")
    print(f"[Pipeline] Outside study boundary: {audit_log['outside_boundary_count']:,}")
    print(f"[Pipeline] Retained records for analysis: {audit_log['retained_record_count']:,}")

    # 3. Spatial Clustering
    cluster_engine = SpatialClusterEngine(earth_radius_km=EARTH_RADIUS_KM)

    print(f"\n[Pipeline] Running primary DBSCAN (metric=haversine, eps={dbscan_eps_km} km, min_samples={dbscan_min_samples})...")
    db_labels, db_summary = cluster_engine.run_dbscan(
        df_clean, eps_km=dbscan_eps_km, min_samples=dbscan_min_samples
    )
    df_clean["dbscan_cluster"] = db_labels
    print(f"[Pipeline] DBSCAN found {db_summary['n_clusters']} clusters and {db_summary['n_noise_points']} noise points ({db_summary['noise_percentage']}%).")

    print(f"\n[Pipeline] Running baseline KMeans (k={kmeans_k}, random_state=42)...")
    km_labels, km_centers, km_summary = cluster_engine.run_kmeans(
        df_clean, n_clusters=kmeans_k, random_state=42
    )
    df_clean["kmeans_cluster"] = km_labels
    print(f"[Pipeline] KMeans inertia: {km_summary['inertia']:.2f}, silhouette: {km_summary['silhouette_score']}")

    # 4. Hotspot Ranking
    print("\n[Pipeline] Ranking identified DBSCAN clusters using severity weighting...")
    ranker = HotspotRanker()
    ranked_hotspots = ranker.rank_clusters(df_clean, cluster_col="dbscan_cluster")
    print(f"[Pipeline] Ranked {len(ranked_hotspots)} hotspot zones.")
    if ranked_hotspots:
        top1 = ranked_hotspots[0]
        print(f"[Pipeline] #1 Ranked Hotspot: {top1['name']} with {top1['collision_count']} crashes, score {top1['severity_score']}")

    # 5. Exploratory Analytics
    print("\n[Pipeline] Computing descriptive statistics, temporal curves, and insight findings...")
    analytics_engine = AnalyticsEngine(df_clean)
    kpis = analytics_engine.compute_summary_kpis()
    severity_dist = analytics_engine.compute_severity_distribution()
    hourly_dist = analytics_engine.compute_hourly_distribution()
    monthly_dist = analytics_engine.compute_monthly_distribution()
    weekly_dist = analytics_engine.compute_day_of_week_distribution()
    road_dist = analytics_engine.compute_road_type_distribution()
    weather_dist = analytics_engine.compute_weather_distribution()
    light_dist = analytics_engine.compute_light_distribution()
    insights = analytics_engine.generate_deterministic_insights()

    # 6. Clustering Laboratory Experiments
    print("\n[Pipeline] Computing laboratory elbow curve and parameter sensitivity matrix...")
    elbow_curve = cluster_engine.generate_kmeans_elbow_curve(df_clean, k_min=2, k_max=12)
    sensitivity_matrix = cluster_engine.generate_dbscan_sensitivity_matrix(
        df_clean,
        eps_values_km=[0.1, 0.2, 0.25, 0.35, 0.5],
        min_samples_values=[5, 8, 12, 16],
    )

    # 7. Methodology Comparison
    comparison = compare_clustering_methods(km_summary, db_summary)

    # 8. Data Transparency Metadata
    transparency_metadata = {
        "dataset_name": "DfT STATS19 Road Safety Open Data (Collisions)",
        "provider": "Department for Transport (UK Government)",
        "source_url": "https://www.gov.uk/government/statistical-data-sets/road-safety-open-data",
        "dataset_year": dataset_year,
        "study_area": region_name,
        "bounding_box": LONDON_BOUNDS,
        "licensing": "Open Government Licence v3.0 (OGL)",
        "audit_log": audit_log,
        "geographic_crs": "WGS84 (EPSG:4326)",
        "distance_metric": f"Haversine Spherical Great-Circle (Earth Radius = {EARTH_RADIUS_KM} km)",
        "severity_code_mapping": {
            "1": "Fatal (injuries resulting in death within 30 days)",
            "2": "Serious (severe injuries requiring hospital admission or permanent disability)",
            "3": "Slight (minor injuries, whiplash, minor cuts, bruising)",
        },
        "limitations_statement": (
            "STATS19 records personal injury collisions reported to police forces. "
            "Damage-only collisions are not recorded. Furthermore, this dataset covers the United Kingdom "
            "(focused on Greater London) and does not represent traffic conditions in India or Jaipur. "
            "Clustering identifies historical spatial concentrations and does not imply direct individual causation."
        ),
    }

    # 9. Global Summary
    summary_data = {
        "region": region_name,
        "year": dataset_year,
        "kpis": kpis,
        "dbscan": db_summary,
        "kmeans": km_summary,
        "top_hotspot": ranked_hotspots[0] if ranked_hotspots else None,
        "total_hotspots": len(ranked_hotspots),
        "audit": audit_log,
    }

    analytics_data = {
        "summary_kpis": kpis,
        "severity_distribution": severity_dist,
        "hourly_distribution": hourly_dist,
        "monthly_distribution": monthly_dist,
        "day_of_week_distribution": weekly_dist,
        "road_type_distribution": road_dist,
        "weather_distribution": weather_dist,
        "light_distribution": light_dist,
        "insights": insights,
    }

    lab_data = {
        "kmeans_elbow_curve": elbow_curve,
        "dbscan_sensitivity_matrix": sensitivity_matrix,
        "current_dbscan_params": {"eps_km": dbscan_eps_km, "min_samples": dbscan_min_samples},
        "current_kmeans_params": {"k": kmeans_k},
    }

    # 10. Export to data/processed/ and public/data/
    print("\n[Pipeline] Serializing outputs to data/processed/ and public/data/...")
    exporter = DataExporter(output_dirs=[PROCESSED_DATA_DIR, PUBLIC_DATA_DIR])
    exporter.export_summary(summary_data)
    exporter.export_hotspots(ranked_hotspots)
    exporter.export_analytics(analytics_data)
    exporter.export_lab_experiments(lab_data)
    exporter.export_methodology_comparison(comparison)
    exporter.export_transparency(transparency_metadata)
    exporter.export_crashes_sample(df_clean, max_samples=3500)

    print("\n[Pipeline] Data pipeline successfully completed!")
    return summary_data


if __name__ == "__main__":
    execute_full_pipeline()

