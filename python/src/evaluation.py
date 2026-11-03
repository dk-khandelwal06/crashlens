"""
Evaluation and Methodology Comparison Engine for CrashLens.
Compares KMeans baseline versus DBSCAN spatial hotspot detection across
mathematical, spatial, and practical road-safety intelligence criteria.
"""

from typing import Dict, Any, List


def compare_clustering_methods(
    kmeans_summary: Dict[str, Any],
    dbscan_summary: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Produces a detailed comparative evaluation between KMeans and DBSCAN
    using both empirical metrics and theoretical geospatial characteristics.
    """
    comparison_table: List[Dict[str, Any]] = [
        {
            "criterion": "Primary Metric",
            "kmeans": "Euclidean Coordinate Distance (flat projection)",
            "dbscan": "Haversine Great-Circle Angular Distance (spherical Earth)",
            "advantage": "DBSCAN",
            "explanation": "Haversine distance accounts for Earth curvature and longitude convergence at 51.5°N.",
        },
        {
            "criterion": "Cluster Count Determination",
            "kmeans": f"Fixed pre-specified K ({kmeans_summary.get('n_clusters', 8)})",
            "dbscan": f"Discovered dynamically by density ({dbscan_summary.get('n_clusters', 0)})",
            "advantage": "DBSCAN",
            "explanation": "Transportation analysts rarely know in advance how many genuine accident hotspots exist.",
        },
        {
            "criterion": "Noise & Outlier Handling",
            "kmeans": "0 noise points (100% of accidents forced into clusters)",
            "dbscan": (
                f"{dbscan_summary.get('n_noise_points', 0):,} noise points "
                f"({dbscan_summary.get('noise_percentage', 0.0)}%)"
            ),
            "advantage": "DBSCAN",
            "explanation": "Solitary, isolated crashes are true noise and should not distort high-risk hotspot priorities.",
        },
        {
            "criterion": "Spatial Geometry Assumption",
            "kmeans": "Convex, spherical Voronoi partitions around centroids",
            "dbscan": "Arbitrary shapes (curved corridors, highway bends, intersection complexes)",
            "advantage": "DBSCAN",
            "explanation": "Dangerous road segments follow linear corridors and irregular infrastructure.",
        },
        {
            "criterion": "Parameter Interpretability",
            "kmeans": "Abstract K value (requires Elbow / Silhouette heuristics)",
            "dbscan": f"Physical radius ({dbscan_summary.get('eps_km', 0.25)} km) and crash density threshold ({dbscan_summary.get('min_samples', 8)} crashes)",
            "advantage": "DBSCAN",
            "explanation": "Highway engineers can directly specify meaningful physical distances (e.g. 250 meters).",
        },
        {
            "criterion": "Sensitivity to Scale & Outliers",
            "kmeans": "Centroids pulled toward distant outliers, distorting boundaries",
            "dbscan": "Robust to sparse outliers; dense cores remain unaffected",
            "advantage": "DBSCAN",
            "explanation": "Single rural crashes do not displace urban high-frequency cluster locations.",
        },
    ]

    methodology_verdict = {
        "recommended_approach": "DBSCAN with Haversine Distance",
        "verdict_summary": (
            "DBSCAN is the mathematically and operationally superior clustering algorithm for road accident hotspot detection. "
            "Unlike KMeans, which imposes artificial spherical clusters across the entire region and forces isolated accidents into clusters, "
            "DBSCAN separates true spatial concentrations from random background noise using physically meaningful geographic distances."
        ),
        "limitations_note": (
            "While DBSCAN excels at identifying spatial concentrations, it does not account for variable traffic flow exposure. "
            "Neither algorithm predicts future crash causation; both provide retrospective descriptive spatial intelligence."
        ),
    }

    return {
        "kmeans_summary": kmeans_summary,
        "dbscan_summary": dbscan_summary,
        "comparison_table": comparison_table,
        "verdict": methodology_verdict,
    }

