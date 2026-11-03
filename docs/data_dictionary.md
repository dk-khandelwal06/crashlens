# CrashLens Data Dictionary & STATS19 Schema

## 1. Field Mapping Reference

| STATS19 Raw Field | CrashLens Field | Type | Description |
|-------------------|-----------------|------|-------------|
| `collision_reference` / `accident_index` | `id` | String | Unique statutory collision identifier. |
| `latitude` | `lat` | Float | Decimal latitude in WGS84 (EPSG:4326). |
| `longitude` | `lon` | Float | Decimal longitude in WGS84 (EPSG:4326). |
| `collision_severity` | `sev` | Integer | Injury outcome: 1 = Fatal, 2 = Serious, 3 = Slight. |
| `date` | `date` | Date | Incident date (DD/MM/YYYY). |
| `time` | `time` | String | Incident time in 24-hour format (HH:MM). |
| `road_type` | `road` | String | Categorical road classification: Single/Dual carriageway, Roundabout, Slip road. |
| `weather_conditions` | `weather` | String | Atmospheric condition: Fine, Raining, Snowing, Fog/Mist, High winds. |
| `light_conditions` | `light` | String | Ambient illumination: Daylight, Darkness (lights lit/unlit/none). |
| `number_of_casualties` | `casualties` | Integer | Total individuals sustaining injuries. |
| `number_of_vehicles` | `vehicles` | Integer | Total motorized vehicles, cycles, or conveyances involved. |

## 2. Derived Clustering Fields

| Field Name | Type | Description |
|------------|------|-------------|
| `dbscan_cluster` | Integer | Cluster ID assigned by Haversine DBSCAN. -1 denotes noise; >=0 denotes cluster ID. |
| `kmeans_cluster` | Integer | Cluster partition assigned by baseline KMeans (0 to K-1). |
| `severity_score` | Float | Weighted risk score: (10 × Fatal) + (4 × Serious) + (1 × Slight). |
| `risk_tier` | String | Categorical priority: Critical, High, Moderate, Emerging. |

