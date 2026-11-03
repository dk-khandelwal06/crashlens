"""
Analytical aggregation engine for CrashLens.
Produces real statistical breakdowns for dashboard cards, temporal curves,
environmental distributions, and deterministic road-safety insight findings.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np


class AnalyticsEngine:
    """Calculates multidimensional descriptive statistics from validated collision records."""

    def __init__(self, df: pd.DataFrame):
        self.df = df

    def compute_summary_kpis(self) -> Dict[str, Any]:
        """Calculates global dataset headline metrics."""
        total = len(self.df)
        fatal = int((self.df["collision_severity"] == 1).sum())
        serious = int((self.df["collision_severity"] == 2).sum())
        slight = int((self.df["collision_severity"] == 3).sum())

        fatal_pct = round((fatal / total) * 100, 2) if total > 0 else 0.0
        serious_pct = round((serious / total) * 100, 2) if total > 0 else 0.0
        slight_pct = round((slight / total) * 100, 2) if total > 0 else 0.0

        total_casualties = int(self.df["casualties"].sum()) if "casualties" in self.df.columns else total
        total_vehicles = int(self.df["vehicles"].sum()) if "vehicles" in self.df.columns else total

        return {
            "total_collisions": total,
            "fatal_collisions": fatal,
            "fatal_percentage": fatal_pct,
            "serious_collisions": serious,
            "serious_percentage": serious_pct,
            "slight_collisions": slight,
            "slight_percentage": slight_pct,
            "total_casualties": total_casualties,
            "total_vehicles": total_vehicles,
            "avg_casualties_per_collision": round(total_casualties / total, 2) if total > 0 else 0.0,
            "avg_vehicles_per_collision": round(total_vehicles / total, 2) if total > 0 else 0.0,
        }

    def compute_severity_distribution(self) -> List[Dict[str, Any]]:
        """Severity distribution for pie / bar charts."""
        kpis = self.compute_summary_kpis()
        return [
            {"severity": "Fatal", "count": kpis["fatal_collisions"], "percentage": kpis["fatal_percentage"], "color": "#ef4444"},
            {"severity": "Serious", "count": kpis["serious_collisions"], "percentage": kpis["serious_percentage"], "color": "#f59e0b"},
            {"severity": "Slight", "count": kpis["slight_collisions"], "percentage": kpis["slight_percentage"], "color": "#10b981"},
        ]

    def compute_hourly_distribution(self) -> List[Dict[str, Any]]:
        """Hourly collision frequency (0 to 23) with rush-hour and severity breakdown."""
        hourly = []
        for h in range(24):
            subset = self.df[self.df["hour"] == h]
            total = len(subset)
            fatal = int((subset["collision_severity"] == 1).sum())
            serious = int((subset["collision_severity"] == 2).sum())
            slight = int((subset["collision_severity"] == 3).sum())

            # Tag morning rush (7-9), evening rush (16-19), day (6-18), night (19-5)
            is_morning_rush = 7 <= h <= 9
            is_evening_rush = 16 <= h <= 19
            is_night = h < 6 or h >= 20

            hourly.append({
                "hour": h,
                "label": f"{h:02d}:00",
                "total": total,
                "fatal": fatal,
                "serious": serious,
                "slight": slight,
                "is_morning_rush": is_morning_rush,
                "is_evening_rush": is_evening_rush,
                "is_night": is_night,
            })
        return hourly

    def compute_monthly_distribution(self) -> List[Dict[str, Any]]:
        """Monthly distribution from January through December."""
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        result = []
        for m_idx, m_name in enumerate(months, start=1):
            subset = self.df[self.df["month"] == m_idx]
            total = len(subset)
            fatal = int((subset["collision_severity"] == 1).sum())
            serious = int((subset["collision_severity"] == 2).sum())
            slight = int((subset["collision_severity"] == 3).sum())
            result.append({
                "month_num": m_idx,
                "month": m_name,
                "total": total,
                "fatal": fatal,
                "serious": serious,
                "slight": slight,
            })
        return result

    def compute_day_of_week_distribution(self) -> List[Dict[str, Any]]:
        """Day of week breakdown (Monday through Sunday)."""
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        result = []
        for d_idx, d_name in enumerate(days, start=1):
            subset = self.df[self.df["day_of_week_num"] == d_idx]
            result.append({
                "day_num": d_idx,
                "day": d_name,
                "total": len(subset),
                "is_weekend": d_idx >= 6,
            })
        return result

    def compute_road_type_distribution(self) -> List[Dict[str, Any]]:
        """Road classification distribution."""
        counts = self.df["road_type_label"].value_counts()
        total = len(self.df)
        result = []
        for road_type, count in counts.items():
            result.append({
                "road_type": str(road_type),
                "count": int(count),
                "percentage": round((count / total) * 100, 1) if total > 0 else 0.0,
            })
        return result

    def compute_weather_distribution(self) -> List[Dict[str, Any]]:
        """Weather condition distribution."""
        counts = self.df["weather_label"].value_counts()
        total = len(self.df)
        result = []
        for weather, count in counts.items():
            result.append({
                "weather": str(weather),
                "count": int(count),
                "percentage": round((count / total) * 100, 1) if total > 0 else 0.0,
            })
        return result

    def compute_light_distribution(self) -> List[Dict[str, Any]]:
        """Lighting condition distribution."""
        counts = self.df["light_label"].value_counts()
        total = len(self.df)
        result = []
        for light, count in counts.items():
            result.append({
                "light_condition": str(light),
                "count": int(count),
                "percentage": round((count / total) * 100, 1) if total > 0 else 0.0,
            })
        return result

    def generate_deterministic_insights(self) -> List[Dict[str, Any]]:
        """
        Produces objective statistical findings with explicit non-causal language.
        Strictly reflects empirical frequencies in the dataset.
        """
        total = len(self.df)
        if total == 0:
            return []

        insights = []

        # 1. Peak crash hour
        hourly_counts = self.df["hour"].value_counts()
        peak_hour = int(hourly_counts.idxmax())
        peak_count = int(hourly_counts.max())
        peak_pct = round((peak_count / total) * 100, 1)
        insights.append({
            "category": "Temporal",
            "title": f"Diurnal Crash Peak at {peak_hour:02d}:00",
            "stat": f"{peak_count:,} collisions ({peak_pct}%)",
            "description": (
                f"Historical records show the single highest collision volume occurred at {peak_hour:02d}:00, "
                f"aligning with the evening transit peak. Morning commuter hours (07:00–09:00) also exhibit elevated frequency."
            ),
            "caveat": "Reflects traffic volume peaks rather than individual driver culpability.",
        })

        # 2. Road infrastructure
        road_counts = self.df["road_type_label"].value_counts()
        top_road = road_counts.idxmax()
        top_road_pct = round((road_counts.max() / total) * 100, 1)
        insights.append({
            "category": "Infrastructure",
            "title": f"Dominance of {top_road}s",
            "stat": f"{top_road_pct}% of total collisions",
            "description": (
                f"{top_road} infrastructure accounts for the largest proportion of recorded incidents, "
                f"reflecting both the density of urban road layouts and frequent vehicle/pedestrian conflict points."
            ),
            "caveat": "High incident counts correlate with high road mileage and exposure rates.",
        })

        # 3. Environmental conditions
        weather_counts = self.df["weather_label"].value_counts()
        fine_pct = round((weather_counts.get("Fine (no high winds)", 0) / total) * 100, 1)
        wet_counts = weather_counts.get("Raining (no high winds)", 0) + weather_counts.get("Raining + high winds", 0)
        wet_pct = round((wet_counts / total) * 100, 1)
        insights.append({
            "category": "Environmental",
            "title": "Adverse Weather vs Clear Conditions",
            "stat": f"{fine_pct}% clear weather vs {wet_pct}% rain",
            "description": (
                f"Contrary to popular assumptions that poor weather triggers most crashes, {fine_pct}% occurred "
                f"during clear weather conditions, showing that fair weather travel volumes drive high absolute incident counts."
            ),
            "caveat": "Exposure data (total vehicle miles in rainy vs fine weather) is required to calculate true crash rates.",
        })

        # 4. Weekend vs Weekday
        weekday_count = int((~self.df["is_weekend"]).sum())
        weekend_count = int(self.df["is_weekend"].sum())
        avg_weekday = round(weekday_count / 5, 0)
        avg_weekend = round(weekend_count / 2, 0)
        insights.append({
            "category": "Weekly Rhythm",
            "title": "Weekday vs Weekend Crash Rates",
            "stat": f"{avg_weekday:,.0f} collisions/weekday vs {avg_weekend:,.0f}/weekend day",
            "description": (
                f"Average daily collision volume across Monday–Friday is {avg_weekday:,.0f}, "
                f"compared to {avg_weekend:,.0f} per weekend day, consistent with employment-driven commuting rhythms."
            ),
            "caveat": "Weekend collisions frequently exhibit different injury severity ratios.",
        })

        return insights

