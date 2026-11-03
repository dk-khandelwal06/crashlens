"""
CrashLens Sandbox: Interactive KMeans and DBSCAN Experimentation Script.
Can be executed standalone to test parameter tweaks directly in Python.
"""

import sys
from pathlib import Path

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

import numpy as np
import pandas as pd
from clustering import SpatialClusterEngine
from geo_utils import LONDON_BOUNDS


def main():
    print("[Sandbox] Generating test spatial cluster distribution...")
    np.random.seed(42)

    # Hotspot 1: Elephant & Castle roundabout (51.4952, -0.1005)
    lats1 = np.random.normal(51.4952, 0.0015, 40)
    lons1 = np.random.normal(-0.1005, 0.0015, 40)

    # Hotspot 2: Kings Cross St. Pancras (51.5308, -0.1238)
    lats2 = np.random.normal(51.5308, 0.002, 35)
    lons2 = np.random.normal(-0.1238, 0.002, 35)

    # Random noise across London
    noise_lats = np.random.uniform(51.30, 51.65, 25)
    noise_lons = np.random.uniform(-0.45, 0.25, 25)

    df = pd.DataFrame({
        "latitude": np.concatenate([lats1, lats2, noise_lats]),
        "longitude": np.concatenate([lons1, lons2, noise_lons]),
    })

    engine = SpatialClusterEngine()
    print(f"[Sandbox] Running DBSCAN with eps=0.25 km, min_samples=6...")
    labels, summary = engine.run_dbscan(df, eps_km=0.25, min_samples=6)
    print(f"  Clusters identified: {summary['n_clusters']}")
    print(f"  Noise points flagged: {summary['n_noise_points']} ({summary['noise_percentage']}%)")

    print(f"[Sandbox] Running KMeans with K=3...")
    km_labels, km_centers, km_summary = engine.run_kmeans(df, n_clusters=3)
    print(f"  KMeans inertia: {km_summary['inertia']:.4f}")
    print(f"  KMeans centers:\n{km_centers}")


if __name__ == "__main__":
    main()
