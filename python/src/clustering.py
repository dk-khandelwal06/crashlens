"""
Machine Learning Clustering Engine for CrashLens.
Implements:
1. DBSCAN with Haversine spherical distance metric (primary hotspot detector).
2. KMeans centroid-based partitioning (baseline comparison).
3. Parameter sensitivity exploration and evaluation metrics (inertia, silhouette).
"""

from typing import Dict, Any, List, Tuple, Optional
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN, KMeans
from sklearn.metrics import silhouette_score
from geo_utils import eps_km_to_radians, EARTH_RADIUS_KM, radians_to_km


class SpatialClusterEngine:
    """Manages geospatial clustering workflows for road collision coordinates."""

    def __init__(self, earth_radius_km: float = EARTH_RADIUS_KM):
        self.earth_radius_km = earth_radius_km

    def run_dbscan(
        self,
        df: pd.DataFrame,
        eps_km: float = 0.25,  # 250 meters
        min_samples: int = 8,
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Executes DBSCAN using Haversine distance.

        Requirements:
        - Converts coordinates (lat, lon) to radians.
        - Converts eps_km to angular distance in radians: eps_km / earth_radius_km.
        - Preserves cluster labels (-1 for noise, >=0 for clusters).

        Returns:
            (labels array, summary dictionary)
        """
        coords_deg = df[["latitude", "longitude"]].to_numpy()
        coords_rad = np.radians(coords_deg)

        eps_rad = eps_km_to_radians(eps_km, self.earth_radius_km)

        db = DBSCAN(
            eps=eps_rad,
            min_samples=min_samples,
            metric="haversine",
            algorithm="ball_tree",
        )
        labels = db.fit_predict(coords_rad)

        unique_labels = set(labels)
        is_noise = labels == -1
        n_clusters = len(unique_labels - {-1})
        n_noise = int(np.sum(is_noise))
        n_total = len(labels)
        n_clustered = n_total - n_noise
        noise_pct = round((n_noise / n_total) * 100, 2) if n_total > 0 else 0.0
        clustered_pct = round((n_clustered / n_total) * 100, 2) if n_total > 0 else 0.0

        summary = {
            "algorithm": "DBSCAN",
            "metric": "haversine",
            "eps_km": float(eps_km),
            "eps_radians": float(eps_rad),
            "min_samples": int(min_samples),
            "total_points": int(n_total),
            "n_clusters": int(n_clusters),
            "n_noise_points": int(n_noise),
            "noise_percentage": float(noise_pct),
            "n_clustered_points": int(n_clustered),
            "clustered_percentage": float(clustered_pct),
        }

        return labels, summary

    def run_kmeans(
        self,
        df: pd.DataFrame,
        n_clusters: int = 8,
        random_state: int = 42,
    ) -> Tuple[np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Executes KMeans centroid-based clustering as a baseline.

        Returns:
            (labels array, cluster centers, summary dictionary)
        """
        coords = df[["latitude", "longitude"]].to_numpy()

        km = KMeans(
            n_clusters=n_clusters,
            random_state=random_state,
            n_init=10,
        )
        labels = km.fit_predict(coords)
        centers = km.cluster_centers_

        # Silhouette score computed on sample if dataset is large for efficiency
        silhouette = None
        if len(coords) > n_clusters and n_clusters > 1:
            sample_size = min(len(coords), 5000)
            sample_idx = np.random.RandomState(random_state).choice(
                len(coords), size=sample_size, replace=False
            )
            try:
                silhouette = float(
                    silhouette_score(coords[sample_idx], labels[sample_idx])
                )
            except Exception:
                silhouette = None

        summary = {
            "algorithm": "KMeans",
            "n_clusters": int(n_clusters),
            "inertia": float(km.inertia_),
            "silhouette_score": round(silhouette, 4) if silhouette is not None else None,
            "random_state": random_state,
            "total_points": int(len(coords)),
        }

        return labels, centers, summary

    def generate_kmeans_elbow_curve(
        self,
        df: pd.DataFrame,
        k_min: int = 2,
        k_max: int = 12,
        random_state: int = 42,
    ) -> List[Dict[str, Any]]:
        """Computes inertia and silhouette scores over a range of K for the Elbow Method."""
        coords = df[["latitude", "longitude"]].to_numpy()
        results = []
        sample_size = min(len(coords), 3000)
        sample_idx = np.random.RandomState(random_state).choice(
            len(coords), size=sample_size, replace=False
        )

        for k in range(k_min, k_max + 1):
            km = KMeans(n_clusters=k, random_state=random_state, n_init=5)
            labels = km.fit_predict(coords)
            try:
                sil = float(silhouette_score(coords[sample_idx], labels[sample_idx]))
            except Exception:
                sil = 0.0

            results.append({
                "k": k,
                "inertia": round(float(km.inertia_), 4),
                "silhouette": round(sil, 4),
            })

        return results

    def generate_dbscan_sensitivity_matrix(
        self,
        df: pd.DataFrame,
        eps_values_km: List[float] = [0.1, 0.2, 0.25, 0.35, 0.5],
        min_samples_values: List[int] = [5, 8, 12, 16],
    ) -> List[Dict[str, Any]]:
        """Calculates DBSCAN behavior across multiple parameter pairs for lab exploration."""
        results = []
        for eps in eps_values_km:
            for ms in min_samples_values:
                _, summary = self.run_dbscan(df, eps_km=eps, min_samples=ms)
                results.append({
                    "eps_km": eps,
                    "min_samples": ms,
                    "n_clusters": summary["n_clusters"],
                    "n_noise_points": summary["n_noise_points"],
                    "noise_percentage": summary["noise_percentage"],
                    "clustered_percentage": summary["clustered_percentage"],
                })
        return results
