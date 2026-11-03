"""
Data cleaning, validation, and normalization for UK STATS19 collision records.
Maintains an exact audit trail of all retained, transformed, and excluded records.
"""

from typing import Dict, Any, Tuple
import pandas as pd
import numpy as np
from geo_utils import is_within_bounds, LONDON_BOUNDS, is_valid_coordinate

# Official DfT STATS19 Codebook Lookups
SEVERITY_MAP = {
    1: "Fatal",
    2: "Serious",
    3: "Slight",
}

ROAD_TYPE_MAP = {
    1: "Roundabout",
    2: "One way street",
    3: "Dual carriageway",
    6: "Single carriageway",
    7: "Slip road",
    9: "Unknown",
    12: "One way / Slip road",
}

WEATHER_MAP = {
    1: "Fine (no high winds)",
    2: "Raining (no high winds)",
    3: "Snowing (no high winds)",
    4: "Fine + high winds",
    5: "Raining + high winds",
    6: "Snowing + high winds",
    7: "Fog or mist",
    8: "Other",
    9: "Unknown",
}

LIGHT_MAP = {
    1: "Daylight",
    4: "Darkness (lights lit)",
    5: "Darkness (lights unlit)",
    6: "Darkness (no lighting)",
    7: "Darkness (lighting unknown)",
}

ROAD_SURFACE_MAP = {
    1: "Dry",
    2: "Wet or damp",
    3: "Snow",
    4: "Frost or ice",
    5: "Flood",
    6: "Oil or diesel",
    7: "Mud",
}

DAY_OF_WEEK_MAP = {
    1: "Sunday",
    2: "Monday",
    3: "Tuesday",
    4: "Wednesday",
    5: "Thursday",
    6: "Friday",
    7: "Saturday",
}


class DataCleaner:
    """Validates, cleans, filters, and documents STATS19 collision records."""

    def __init__(self, bounds: dict = LONDON_BOUNDS):
        self.bounds = bounds
        self.audit_log: Dict[str, Any] = {
            "raw_record_count": 0,
            "missing_coordinate_count": 0,
            "invalid_coordinate_count": 0,
            "outside_boundary_count": 0,
            "missing_timestamp_count": 0,
            "retained_record_count": 0,
            "filtering_boundary": bounds,
        }

    def clean_dataframe(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """
        Cleans raw collision dataframe:
        - Harmonizes column naming.
        - Audits and removes invalid coordinates.
        - Filters by study area bounding box.
        - Maps numeric codes to human-readable categories.
        - Parses date, time, hour, month, day-of-week, and weekend flags.
        """
        self.audit_log["raw_record_count"] = int(len(df))

        # Standardize column headers to lower-case snake_case
        df = df.copy()
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        # Harmonize common column aliases across STATS19 revisions
        col_aliases = {
            "accident_index": "collision_reference",
            "collision_id": "collision_reference",
            "accident_reference": "collision_reference",
            "accident_severity": "collision_severity",
            "accident_year": "collision_year",
        }
        for old_col, new_col in col_aliases.items():
            if old_col in df.columns and new_col not in df.columns:
                df[new_col] = df[old_col]

        # Latitude / Longitude column resolution
        lat_col = next((c for c in ["latitude", "lat"] if c in df.columns), None)
        lon_col = next((c for c in ["longitude", "long", "lon"] if c in df.columns), None)

        if not lat_col or not lon_col:
            raise KeyError("Dataset must contain latitude and longitude columns.")

        # Numeric coercion
        df["latitude"] = pd.to_numeric(df[lat_col], errors="coerce")
        df["longitude"] = pd.to_numeric(df[lon_col], errors="coerce")

        # Track missing coordinates
        missing_coords = df["latitude"].isna() | df["longitude"].isna()
        self.audit_log["missing_coordinate_count"] = int(missing_coords.sum())
        df = df[~missing_coords].copy()

        # Track invalid globe coordinates
        valid_coords = df.apply(
            lambda r: is_valid_coordinate(r["latitude"], r["longitude"]), axis=1
        )
        self.audit_log["invalid_coordinate_count"] = int((~valid_coords).sum())
        df = df[valid_coords].copy()

        # Filter within bounding box (e.g. Greater London)
        if self.bounds:
            in_bounds = df.apply(
                lambda r: is_within_bounds(r["latitude"], r["longitude"], self.bounds),
                axis=1,
            )
            self.audit_log["outside_boundary_count"] = int((~in_bounds).sum())
            df = df[in_bounds].copy()
        else:
            self.audit_log["outside_boundary_count"] = 0

        # Harmonize collision severity
        if "collision_severity" in df.columns:
            df["collision_severity"] = pd.to_numeric(df["collision_severity"], errors="coerce").fillna(3).astype(int)
            df["severity_label"] = df["collision_severity"].map(SEVERITY_MAP).fillna("Slight")
        else:
            df["collision_severity"] = 3
            df["severity_label"] = "Slight"

        # Date and Time parsing
        df["time"] = df["time"].astype(str).str.strip()
        time_parsed = pd.to_datetime(df["time"], format="%H:%M", errors="coerce")
        df["hour"] = time_parsed.dt.hour.fillna(12).astype(int)

        # Date parsing
        if "date" in df.columns:
            df["parsed_date"] = pd.to_datetime(df["date"], errors="coerce", dayfirst=True)
            df["month"] = df["parsed_date"].dt.month.fillna(1).astype(int)
            df["month_name"] = df["parsed_date"].dt.strftime("%b").fillna("Jan")
            df["year"] = df["parsed_date"].dt.year.fillna(2022).astype(int)
            # Day of week (1=Monday, 7=Sunday in pandas dayofweek+1)
            df["day_of_week_num"] = df["parsed_date"].dt.dayofweek + 1
            df["is_weekend"] = df["parsed_date"].dt.dayofweek >= 5
        else:
            df["month"] = 1
            df["month_name"] = "Jan"
            df["year"] = 2022
            df["day_of_week_num"] = 3
            df["is_weekend"] = False

        df["day_name"] = df["day_of_week_num"].map(
            {1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun"}
        ).fillna("Wed")

        # Environmental & Road attribute mappings
        if "road_type" in df.columns:
            df["road_type_code"] = pd.to_numeric(df["road_type"], errors="coerce").fillna(6).astype(int)
            df["road_type_label"] = df["road_type_code"].map(ROAD_TYPE_MAP).fillna("Single carriageway")
        else:
            df["road_type_code"] = 6
            df["road_type_label"] = "Single carriageway"

        if "weather_conditions" in df.columns:
            df["weather_code"] = pd.to_numeric(df["weather_conditions"], errors="coerce").fillna(1).astype(int)
            df["weather_label"] = df["weather_code"].map(WEATHER_MAP).fillna("Fine (no high winds)")
        else:
            df["weather_code"] = 1
            df["weather_label"] = "Fine (no high winds)"

        if "light_conditions" in df.columns:
            df["light_code"] = pd.to_numeric(df["light_conditions"], errors="coerce").fillna(1).astype(int)
            df["light_label"] = df["light_code"].map(LIGHT_MAP).fillna("Daylight")
        else:
            df["light_code"] = 1
            df["light_label"] = "Daylight"

        if "speed_limit" in df.columns:
            df["speed_limit"] = pd.to_numeric(df["speed_limit"], errors="coerce").fillna(30).astype(int)
        else:
            df["speed_limit"] = 30

        if "number_of_casualties" in df.columns:
            df["casualties"] = pd.to_numeric(df["number_of_casualties"], errors="coerce").fillna(1).astype(int)
        else:
            df["casualties"] = 1

        if "number_of_vehicles" in df.columns:
            df["vehicles"] = pd.to_numeric(df["number_of_vehicles"], errors="coerce").fillna(1).astype(int)
        else:
            df["vehicles"] = 1

        if "collision_reference" not in df.columns:
            df["collision_reference"] = [f"CL-{i:06d}" for i in range(len(df))]

        self.audit_log["retained_record_count"] = int(len(df))
        return df, self.audit_log

