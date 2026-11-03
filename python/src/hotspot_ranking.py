"""
Hotspot Severity Ranking and Statistical Scoring Engine for CrashLens.
Calculates transparent severity-weighted scores for identified DBSCAN clusters.
"""

from typing import Dict, Any, List
import numpy as np
import pandas as pd
from geo_utils import haversine_distance

# Default transparent severity weights
# Fatal accidents carry highest societal and physical impact weight (10)
# Serious injury collisions carry high weight (4)
# Slight injury collisions carry standard baseline weight (1)
DEFAULT_WEIGHTS = {
    "fatal": 10.0,
    "serious": 4.0,
    "slight": 1.0,
}


def compute_severity_score(
    fatal_count: int,
    serious_count: int,
    slight_count: int,
    weights: dict = DEFAULT_WEIGHTS,
) -> float:
    """
    Computes transparent severity-weighted risk score:
    Score = (W_fatal * C_fatal) + (W_serious * C_serious) + (W_slight * C_slight)
    """
    return (
        weights["fatal"] * fatal_count
        + weights["serious"] * serious_count
        + weights["slight"] * slight_count
    )


def determine_risk_tier(severity_score: float, collision_count: int) -> str:
    """Classifies clusters into actionable road safety priority tiers."""
    if severity_score >= 40 or collision_count >= 25:
        return "Critical"
    elif severity_score >= 20 or collision_count >= 14:
        return "High"
    elif severity_score >= 10 or collision_count >= 7:
        return "Moderate"
    else:
        return "Emerging"


class HotspotRanker:
    """Ranks and computes detailed geospatial profile for each detected cluster."""

    def __init__(self, weights: dict = DEFAULT_WEIGHTS):
        self.weights = weights

    def rank_clusters(
        self,
        df: pd.DataFrame,
        cluster_col: str = "dbscan_cluster",
    ) -> List[Dict[str, Any]]:
        """
        Calculates comprehensive summary for each non-noise cluster and ranks them.
        Noise points (-1) are excluded from hotspot ranking.
        """
        # Filter out noise points
        clustered_df = df[df[cluster_col] >= 0].copy()
        if clustered_df.empty:
            return []

        hotspots = []
        grouped = clustered_df.groupby(cluster_col)

        for cluster_id, group in grouped:
            total_collisions = len(group)
            fatal_count = int((group["collision_severity"] == 1).sum())
            serious_count = int((group["collision_severity"] == 2).sum())
            slight_count = int((group["collision_severity"] == 3).sum())

            total_casualties = int(group["casualties"].sum()) if "casualties" in group.columns else total_collisions
            total_vehicles = int(group["vehicles"].sum()) if "vehicles" in group.columns else total_collisions

            centroid_lat = float(group["latitude"].mean())
            centroid_lon = float(group["longitude"].mean())

            # Geographical spread: max haversine distance from centroid in meters
            distances = [
                haversine_distance(centroid_lat, centroid_lon, r["latitude"], r["longitude"]) * 1000.0
                for _, r in group.iterrows()
            ]
            radius_meters = round(float(np.max(distances)), 1) if distances else 0.0

            severity_score = compute_severity_score(
                fatal_count, serious_count, slight_count, self.weights
            )

            # Dominant road type
            dominant_road_type = (
                group["road_type_label"].mode().iloc[0]
                if "road_type_label" in group.columns and not group["road_type_label"].empty
                else "Single carriageway"
            )

            # Dominant weather
            dominant_weather = (
                group["weather_label"].mode().iloc[0]
                if "weather_label" in group.columns and not group["weather_label"].empty
                else "Fine (no high winds)"
            )

            # Peak hour
            peak_hour = int(group["hour"].mode().iloc[0]) if "hour" in group.columns else 17

            # Rush hour proportion (Morning: 7-9 AM, Evening: 16-19 PM)
            rush_hour_crashes = group["hour"].isin([7, 8, 9, 16, 17, 18, 19]).sum() if "hour" in group.columns else 0
            rush_hour_pct = round((rush_hour_crashes / total_collisions) * 100, 1)

            # Weekend proportion
            weekend_crashes = int(group["is_weekend"].sum()) if "is_weekend" in group.columns else 0
            weekend_pct = round((weekend_crashes / total_collisions) * 100, 1)

            hotspot_profile = {
                "cluster_id": int(cluster_id),
                "name": f"Hotspot Zone #{int(cluster_id) + 1}",
                "collision_count": int(total_collisions),
                "fatal_count": fatal_count,
                "serious_count": serious_count,
                "slight_count": slight_count,
                "casualties": total_casualties,
                "vehicles": total_vehicles,
                "severity_score": round(float(severity_score), 2),
                "risk_tier": determine_risk_tier(severity_score, total_collisions),
                "centroid": {
                    "latitude": round(centroid_lat, 6),
                    "longitude": round(centroid_lon, 6),
                },
                "radius_meters": radius_meters,
                "dominant_road_type": dominant_road_type,
                "dominant_weather": dominant_weather,
                "peak_hour": peak_hour,
                "rush_hour_percentage": rush_hour_pct,
                "weekend_percentage": weekend_pct,
                "scoring_formula": "Score = (10 * Fatal) + (4 * Serious) + (1 * Slight)",
                "methodological_note": (
                    "Ranks historical spatial concentration intensity. "
                    "Does not predict future crash likelihood or imply causation."
                ),
            }
            hotspots.append(hotspot_profile)

        # Sort descending by severity score, secondary by total collision count
        hotspots.sort(
            key=lambda x: (x["severity_score"], x["collision_count"]), reverse=True
        )

        # Assign ordinal rank
        for idx, hotspot in enumerate(hotspots):
            hotspot["rank"] = idx + 1

        return hotspots

