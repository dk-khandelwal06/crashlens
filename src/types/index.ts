export type ThemeMode = "light" | "comfort" | "dark";

export type NavSection =
  | "overview"
  | "dashboard"
  | "explorer"
  | "laboratory"
  | "severity"
  | "temporal"
  | "insights"
  | "methodology"
  | "transparency"
  | "about";

export interface KPIs {
  total_collisions: number;
  fatal_collisions: number;
  fatal_percentage: number;
  serious_collisions: number;
  serious_percentage: number;
  slight_collisions: number;
  slight_percentage: number;
  total_casualties: number;
  total_vehicles: number;
  avg_casualties_per_collision: number;
  avg_vehicles_per_collision: number;
}

export interface DBSCANSummary {
  algorithm: "DBSCAN";
  metric: "haversine";
  eps_km: number;
  eps_radians: number;
  min_samples: number;
  total_points: number;
  n_clusters: number;
  n_noise_points: number;
  noise_percentage: number;
  n_clustered_points: number;
  clustered_percentage: number;
}

export interface KMeansSummary {
  algorithm: "KMeans";
  n_clusters: number;
  inertia: number;
  silhouette_score: number | null;
  random_state: number;
  total_points: number;
}

export interface Hotspot {
  cluster_id: number;
  rank: number;
  name: string;
  collision_count: number;
  fatal_count: number;
  serious_count: number;
  slight_count: number;
  casualties: number;
  vehicles: number;
  severity_score: number;
  risk_tier: "Critical" | "High" | "Moderate" | "Emerging";
  centroid: {
    latitude: number;
    longitude: number;
  };
  radius_meters: number;
  dominant_road_type: string;
  dominant_weather: string;
  peak_hour: number;
  rush_hour_percentage: number;
  weekend_percentage: number;
  scoring_formula: string;
  methodological_note: string;
}

export interface CrashPoint {
  id: string;
  lat: number;
  lon: number;
  sev: number;
  sev_label: string;
  road: string;
  weather: string;
  light: string;
  hour: number;
  is_wknd: boolean;
  db_cluster: number;
  km_cluster: number;
}

export interface SummaryData {
  region: string;
  year: number;
  kpis: KPIs;
  dbscan: DBSCANSummary;
  kmeans: KMeansSummary;
  top_hotspot: Hotspot | null;
  total_hotspots: number;
  audit: {
    raw_record_count: number;
    missing_coordinate_count: number;
    invalid_coordinate_count: number;
    outside_boundary_count: number;
    missing_timestamp_count: number;
    retained_record_count: number;
    filtering_boundary: {
      min_lat: number;
      max_lat: number;
      min_lon: number;
      max_lon: number;
    };
  };
}

export interface AnalyticsData {
  summary_kpis: KPIs;
  severity_distribution: Array<{
    severity: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  hourly_distribution: Array<{
    hour: number;
    label: string;
    total: number;
    fatal: number;
    serious: number;
    slight: number;
    is_morning_rush: boolean;
    is_evening_rush: boolean;
    is_night: boolean;
  }>;
  monthly_distribution: Array<{
    month_num: number;
    month: string;
    total: number;
    fatal: number;
    serious: number;
    slight: number;
  }>;
  day_of_week_distribution: Array<{
    day_num: number;
    day: string;
    total: number;
    is_weekend: boolean;
  }>;
  road_type_distribution: Array<{
    road_type: string;
    count: number;
    percentage: number;
  }>;
  weather_distribution: Array<{
    weather: string;
    count: number;
    percentage: number;
  }>;
  light_distribution: Array<{
    light_condition: string;
    count: number;
    percentage: number;
  }>;
  insights: Array<{
    category: string;
    title: string;
    stat: string;
    description: string;
    caveat: string;
  }>;
}

export interface LabExperiments {
  kmeans_elbow_curve: Array<{
    k: number;
    inertia: number;
    silhouette: number;
  }>;
  dbscan_sensitivity_matrix: Array<{
    eps_km: number;
    min_samples: number;
    n_clusters: number;
    n_noise_points: number;
    noise_percentage: number;
    clustered_percentage: number;
  }>;
  current_dbscan_params: {
    eps_km: number;
    min_samples: number;
  };
  current_kmeans_params: {
    k: number;
  };
}

export interface MethodologyComparison {
  kmeans_summary: KMeansSummary;
  dbscan_summary: DBSCANSummary;
  comparison_table: Array<{
    criterion: string;
    kmeans: string;
    dbscan: string;
    advantage: "DBSCAN" | "KMeans" | "Neutral";
    explanation: string;
  }>;
  verdict: {
    recommended_approach: string;
    verdict_summary: string;
    limitations_note: string;
  };
}

export interface TransparencyData {
  dataset_name: string;
  provider: string;
  source_url: string;
  dataset_year: number;
  study_area: string;
  bounding_box: {
    min_lat: number;
    max_lat: number;
    min_lon: number;
    max_lon: number;
  };
  licensing: string;
  audit_log: SummaryData["audit"];
  geographic_crs: string;
  distance_metric: string;
  severity_code_mapping: Record<string, string>;
  limitations_statement: string;
}

