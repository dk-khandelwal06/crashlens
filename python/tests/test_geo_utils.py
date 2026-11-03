"""
Unit tests for geospatial mathematics and coordinate transformations.
"""

import pytest
import numpy as np
from geo_utils import (
    haversine_distance,
    eps_km_to_radians,
    radians_to_km,
    is_valid_coordinate,
    is_within_bounds,
    EARTH_RADIUS_KM,
    LONDON_BOUNDS,
)


def test_haversine_known_london_landmarks():
    # Trafalgar Square: (51.5080, -0.1281)
    # Tower Bridge: (51.5055, -0.0754)
    # Expected distance is ~3.66 km
    dist = haversine_distance(51.5080, -0.1281, 51.5055, -0.0754)
    assert 3.5 <= dist <= 3.8, f"Unexpected distance: {dist} km"


def test_haversine_zero_distance():
    dist = haversine_distance(51.5074, -0.1278, 51.5074, -0.1278)
    assert abs(dist) < 1e-9


def test_eps_conversion_roundtrip():
    original_km = 0.35  # 350 meters
    radians = eps_km_to_radians(original_km, EARTH_RADIUS_KM)
    reconstructed_km = radians_to_km(radians, EARTH_RADIUS_KM)
    assert abs(original_km - reconstructed_km) < 1e-7


def test_eps_negative_raises_error():
    with pytest.raises(ValueError):
        eps_km_to_radians(-0.5)


def test_coordinate_validity():
    assert is_valid_coordinate(51.5074, -0.1278) is True
    assert is_valid_coordinate(0.0, 0.0) is False  # Null island rejected
    assert is_valid_coordinate(95.0, 0.0) is False  # Lat > 90
    assert is_valid_coordinate(51.5, 200.0) is False  # Lon > 180
    assert is_valid_coordinate(None, -0.12) is False
    assert is_valid_coordinate(np.nan, -0.12) is False


def test_bounds_checking():
    # Central London (within bounds)
    assert is_within_bounds(51.5074, -0.1278, LONDON_BOUNDS) is True
    # Edinburgh, Scotland (outside London bounds)
    assert is_within_bounds(55.9533, -3.1883, LONDON_BOUNDS) is False

