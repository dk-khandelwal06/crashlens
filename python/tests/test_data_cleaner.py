"""
Unit tests for data cleaning and schema validation.
"""

import pytest
import pandas as pd
import numpy as np
from data_cleaner import DataCleaner, SEVERITY_MAP
from geo_utils import LONDON_BOUNDS


def test_cleaner_audit_log_and_filtering():
    raw_data = pd.DataFrame({
        "accident_index": ["ACC001", "ACC002", "ACC003", "ACC004", "ACC005"],
        "latitude": [51.5074, np.nan, 55.9533, 0.0, 51.5100],  # 2nd is NaN, 3rd is Scotland, 4th is (0,0)
        "longitude": [-0.1278, -0.12, -3.1883, 0.0, -0.1400],
        "accident_severity": [1, 2, 3, 3, 2],
        "date": ["15/05/2022", "16/05/2022", "17/05/2022", "18/05/2022", "19/05/2022"],
        "time": ["08:30", "12:00", "17:45", "22:15", "14:10"],
        "road_type": [6, 1, 3, 6, 2],
    })

    cleaner = DataCleaner(bounds=LONDON_BOUNDS)
    df_clean, audit = cleaner.clean_dataframe(raw_data)

    assert audit["raw_record_count"] == 5
    assert audit["missing_coordinate_count"] == 1  # ACC002
    assert audit["invalid_coordinate_count"] == 1  # ACC004 (0,0)
    assert audit["outside_boundary_count"] == 1    # ACC003 (Scotland)
    assert audit["retained_record_count"] == 2     # ACC001 and ACC005
    assert len(df_clean) == 2

    # Check mapped columns
    assert "severity_label" in df_clean.columns
    assert "road_type_label" in df_clean.columns
    assert df_clean.iloc[0]["severity_label"] == "Fatal"
    assert df_clean.iloc[1]["severity_label"] == "Serious"
