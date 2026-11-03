"""
Unit tests for KMeans baseline and Haversine DBSCAN clustering algorithms.
"""

import pytest
import pandas as pd
import numpy as np
from clustering import SpatialClusterEngine


def generate_synthetic_spatial_data():
    """Creates synthetic collision dataset with 2 dense spatial clusters + isolated noise."""
    np.random.seed(42)
    # Cluster 1: Around Oxford Circus (51.5152, -0.1419)
    c1_lat = np.random.normal(51.5152, 0.001, 20)
    c1_lon = np.random.normal(-0.1419, 0.001, 20)

    # Cluster 2: Around Elephant & Castle (51.4952, -0.1005)
    c2_lat = np.random.normal(51.4952, 0.001, 15)
    c2_lon = np.random.normal(-0.1005, 0.001, 15)

    # Outliers / Noise: Distant single points
    noise_lat = [51.35, 51.65, 51.40]
    noise_lon = [-0.40, 0.25, -0.30]

    all_lat = np.concatenate([c1_lat, c2_lat, noise_lat])
    all_lon = np.concatenate([c1_lon, c2_lon, noise_lon])

    return pd.DataFrame({
        "latitude": all_lat,
        "longitude": all_lon,
        "collision_severity": np.random.choice([1, 2, 3], size=len(all_lat), p=[0.05, 0.25, 0.70]),
    })


def test_dbscan_haversine_clustering():
    df = generate_synthetic_spatial_data()
    engine = SpatialClusterEngine()

    labels, summary = engine.run_dbscan(df, eps_km=0.3, min_samples=5)

    assert summary["n_clusters"] >= 2, "Expected at least 2 dense clusters"
    assert summary["n_noise_points"] >= 3, "Expected noise points to be identified"
    assert -1 in labels, "Expected noise label -1 in results"
    assert summary["noise_percentage"] > 0.0


def test_kmeans_clustering():
    df = generate_synthetic_spatial_data()
    engine = SpatialClusterEngine()

    labels, centers, summary = engine.run_kmeans(df, n_clusters=2, random_state=42)

    assert summary["n_clusters"] == 2
    assert len(centers) == 2
    assert centers.shape == (2, 2)
    assert len(labels) == len(df)
    assert summary["inertia"] > 0
