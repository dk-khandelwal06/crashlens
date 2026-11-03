"""
Geospatial calculation utilities for CrashLens.
Implements the Haversine spherical distance formula, coordinate transformations,
and geographical bounding filters for road collision analysis.
"""

from typing import Tuple, Union
import numpy as np

# WGS84 spherical mean radius of the Earth in kilometers
EARTH_RADIUS_KM: float = 6371.0088

# Greater London bounding box (approximate envelope for regional filtering)
# Latitude: ~51.28° N to 51.69° N
# Longitude: ~-0.51° W to 0.33° E
LONDON_BOUNDS = {
    "min_lat": 51.28,
    "max_lat": 51.69,
    "min_lon": -0.51,
    "max_lon": 0.33,
}

# United Kingdom general mainland bounding box
UK_BOUNDS = {
    "min_lat": 49.8,
    "max_lat": 60.9,
    "min_lon": -8.6,
    "max_lon": 1.8,
}


def to_radians(coords_deg: Union[float, np.ndarray]) -> Union[float, np.ndarray]:
    """Convert decimal degrees to radians for spherical trigonometry."""
    return np.radians(coords_deg)


def eps_km_to_radians(eps_km: float, earth_radius_km: float = EARTH_RADIUS_KM) -> float:
    """
    Convert an epsilon distance in kilometers to radians for scikit-learn DBSCAN (metric='haversine').

    Parameters:
        eps_km: Neighborhood distance in kilometers (e.g. 0.25 km = 250 meters).
        earth_radius_km: Earth radius in kilometers (default 6371.0088 km).

    Returns:
        Angular distance in radians: eps_km / earth_radius_km
    """
    if eps_km <= 0:
        raise ValueError("eps_km must be strictly positive.")
    return eps_km / earth_radius_km


def radians_to_km(radians: float, earth_radius_km: float = EARTH_RADIUS_KM) -> float:
    """Convert angular distance in radians to kilometers."""
    return radians * earth_radius_km


def haversine_distance(
    lat1: float, lon1: float, lat2: float, lon2: float, earth_radius_km: float = EARTH_RADIUS_KM
) -> float:
    """
    Compute the great-circle distance between two geographical points on a sphere
    given their decimal latitude and longitude.

    Uses the Haversine formula:
        a = sin^2(dlat/2) + cos(lat1) * cos(lat2) * sin^2(dlon/2)
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        d = R * c

    Returns:
        Distance in kilometers.
    """
    phi1 = np.radians(lat1)
    phi2 = np.radians(lat2)
    delta_phi = np.radians(lat2 - lat1)
    delta_lambda = np.radians(lon2 - lon1)

    a = (np.sin(delta_phi / 2.0) ** 2) + (
        np.cos(phi1) * np.cos(phi2) * (np.sin(delta_lambda / 2.0) ** 2)
    )
    c = 2.0 * np.arctan2(np.sqrt(a), np.sqrt(1.0 - a))
    return earth_radius_km * c


def is_valid_coordinate(lat: float, lon: float) -> bool:
    """Verify that latitude and longitude are valid non-null floating numbers within globe limits."""
    if lat is None or lon is None or np.isnan(lat) or np.isnan(lon):
        return False
    if not (-90.0 <= lat <= 90.0):
        return False
    if not (-180.0 <= lon <= 180.0):
        return False
    # Check for unlocated zero coordinates (0.0, 0.0 off coast of Africa)
    if abs(lat) < 1e-5 and abs(lon) < 1e-5:
        return False
    return True


def is_within_bounds(lat: float, lon: float, bounds: dict = LONDON_BOUNDS) -> bool:
    """Check whether a coordinate falls inside the given bounding box."""
    if not is_valid_coordinate(lat, lon):
        return False
    return (
        bounds["min_lat"] <= lat <= bounds["max_lat"]
        and bounds["min_lon"] <= lon <= bounds["max_lon"]
    )
