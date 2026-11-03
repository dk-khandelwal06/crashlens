"""
Unit tests for hotspot severity ranking formula and risk classification.
"""

import pytest
import pandas as pd
from hotspot_ranking import compute_severity_score, determine_risk_tier, HotspotRanker


def test_severity_scoring_formula():
    # 2 fatal (10 each) + 3 serious (4 each) + 5 slight (1 each) = 20 + 12 + 5 = 37.0
    score = compute_severity_score(fatal_count=2, serious_count=3, slight_count=5)
    assert score == 37.0


def test_risk_tier_classification():
    assert determine_risk_tier(severity_score=45.0, collision_count=10) == "Critical"
    assert determine_risk_tier(severity_score=25.0, collision_count=12) == "High"
    assert determine_risk_tier(severity_score=15.0, collision_count=8) == "Moderate"
    assert determine_risk_tier(severity_score=5.0, collision_count=3) == "Emerging"


def test_hotspot_ranker_ordering():
    df = pd.DataFrame({
        "latitude": [51.50, 51.50, 51.51, 51.52, 51.52],
        "longitude": [-0.12, -0.12, -0.12, -0.10, -0.10],
        "collision_severity": [1, 2, 3, 3, 3],
        "dbscan_cluster": [0, 0, 0, 1, 1],
        "road_type_label": ["Roundabout", "Roundabout", "Roundabout", "Single carriageway", "Single carriageway"],
        "weather_label": ["Fine", "Fine", "Fine", "Raining", "Raining"],
        "hour": [17, 17, 18, 9, 9],
        "is_weekend": [False, False, False, True, True],
        "casualties": [1, 1, 1, 1, 1],
        "vehicles": [2, 2, 2, 2, 2],
    })

    ranker = HotspotRanker()
    ranked = ranker.rank_clusters(df, cluster_col="dbscan_cluster")

    assert len(ranked) == 2
    # Cluster 0 has 1 fatal (10) + 1 serious (4) + 1 slight (1) = 15.0 score
    # Cluster 1 has 2 slight (1) = 2.0 score
    # Cluster 0 must rank #1
    assert ranked[0]["cluster_id"] == 0
    assert ranked[0]["rank"] == 1
    assert ranked[0]["severity_score"] == 15.0
    assert ranked[1]["cluster_id"] == 1
    assert ranked[1]["rank"] == 2
    assert ranked[1]["severity_score"] == 2.0

