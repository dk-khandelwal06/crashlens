"""
Data Export and Serialization Engine for CrashLens.
Saves compact, high-performance JSON and GeoJSON artifacts to data/processed/
and public/data/ for direct zero-latency consumption by Next.js on Vercel.
"""

import json
from pathlib import Path
from typing import Dict, Any, List
import pandas as pd
import numpy as np


class DataExporter:
    """Serializes geospatial clustering results and statistical summaries into optimized JSONs."""

    def __init__(self, output_dirs: List[Path]):
        self.output_dirs = output_dirs
        for d in self.output_dirs:
            d.mkdir(parents=True, exist_ok=True)

    def _write_json(self, filename: str, data: Any):
        """Writes JSON to all designated destination directories."""
        for d in self.output_dirs:
            filepath = d / filename
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"[DataExporter] Exported: {filepath}")

    def export_summary(self, summary_data: Dict[str, Any]):
        """Exports global headline KPIs and audit trail."""
        self._write_json("summary.json", summary_data)

    def export_hotspots(self, hotspots: List[Dict[str, Any]]):
        """Exports ranked hotspot cluster profiles."""
        self._write_json("hotspots.json", hotspots)

        # Also export as valid GeoJSON FeatureCollection
        features = []
        for h in hotspots:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [h["centroid"]["longitude"], h["centroid"]["latitude"]],
                },
                "properties": {
                    "cluster_id": h["cluster_id"],
                    "rank": h["rank"],
                    "name": h["name"],
                    "collision_count": h["collision_count"],
                    "fatal_count": h["fatal_count"],
                    "serious_count": h["serious_count"],
                    "slight_count": h["slight_count"],
                    "severity_score": h["severity_score"],
                    "risk_tier": h["risk_tier"],
                    "radius_meters": h["radius_meters"],
                    "dominant_road_type": h["dominant_road_type"],
                    "peak_hour": h["peak_hour"],
                },
            }
            features.append(feature)

        geojson_doc = {
            "type": "FeatureCollection",
            "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
            "features": features,
        }
        self._write_json("hotspots.geojson", geojson_doc)

    def export_analytics(self, analytics_data: Dict[str, Any]):
        """Exports hourly, monthly, weekly, weather, road type, and lighting distributions."""
        self._write_json("analytics.json", analytics_data)

    def export_lab_experiments(self, lab_data: Dict[str, Any]):
        """Exports KMeans elbow curve and DBSCAN parameter sensitivity matrix."""
        self._write_json("lab_experiments.json", lab_data)

    def export_methodology_comparison(self, comparison_data: Dict[str, Any]):
        """Exports KMeans vs DBSCAN side-by-side comparison."""
        self._write_json("comparison.json", comparison_data)

    def export_transparency(self, transparency_data: Dict[str, Any]):
        """Exports dataset provenance, licensing, filtering audit, and limitations."""
        self._write_json("transparency.json", transparency_data)

    def export_crashes_sample(self, df: pd.DataFrame, max_samples: int = 3500):
        """
        Exports a representative sample of individual collision records
        with assigned cluster IDs for map rendering and client-side filtering.
        """
        sample_df = df.sample(n=min(len(df), max_samples), random_state=42) if len(df) > max_samples else df

        records = []
        for _, row in sample_df.iterrows():
            record = {
                "id": str(row.get("collision_reference", f"CL-{_}")),
                "lat": round(float(row["latitude"]), 5),
                "lon": round(float(row["longitude"]), 5),
                "sev": int(row.get("collision_severity", 3)),
                "sev_label": str(row.get("severity_label", "Slight")),
                "road": str(row.get("road_type_label", "Single carriageway")),
                "weather": str(row.get("weather_label", "Fine")),
                "light": str(row.get("light_label", "Daylight")),
                "hour": int(row.get("hour", 12)),
                "is_wknd": bool(row.get("is_weekend", False)),
                "db_cluster": int(row.get("dbscan_cluster", -1)),
                "km_cluster": int(row.get("kmeans_cluster", 0)),
            }
            records.append(record)

        self._write_json("crashes_sample.json", records)
