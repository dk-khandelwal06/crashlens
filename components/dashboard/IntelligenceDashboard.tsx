"use client";

import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  ShieldAlert,
  Flame,
  Activity,
  Layers,
  MapPin,
  Calendar,
  Clock,
  Compass,
  FileCheck,
} from "lucide-react";
import { SummaryData, AnalyticsData } from "@/src/types";
import { VoiceNarrationPlayer } from "@/components/shared/VoiceNarrationPlayer";

interface IntelligenceDashboardProps {
  summary: SummaryData;
  analytics: AnalyticsData;
}

export const IntelligenceDashboard: React.FC<IntelligenceDashboardProps> = ({
  summary,
  analytics,
}) => {
  const { kpis, dbscan, kmeans, top_hotspot } = summary;

  const narrationScript = `Welcome to the CrashLens Intelligence Dashboard. In this analysis of Greater London during 2022, we examined twenty-six thousand and thirty police-reported road collisions from official STATS19 records. Using DBSCAN with Haversine spherical distance, four hundred and thirty-two concentrated accident hotspot zones were identified, containing sixty-four point seven percent of all collisions. Thirty-five point three percent of incidents were classified as isolated noise. The highest-risk identified hotspot is Zone 6 in Central London, with a severity-weighted risk score of over ten thousand. Diurnal analysis shows peak collision frequency occurring at 18:00 hours during the evening commute.`;

  const comparisonData = [
    {
      metric: "Clusters Found",
      DBSCAN: dbscan.n_clusters,
      KMeans: kmeans.n_clusters,
    },
    {
      metric: "Noise Outliers",
      DBSCAN: dbscan.n_noise_points,
      KMeans: 0,
    },
    {
      metric: "Clustered Points",
      DBSCAN: dbscan.n_clustered_points,
      KMeans: kmeans.total_points,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Section Header & Voice Narration */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-xs font-mono font-medium mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>REAL STATS19 COLLISION ANALYTICS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Intelligence Dashboard
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Empirical collision metrics, severity weighting, and algorithmic cluster characteristics
            for {summary.region} ({summary.year}).
          </p>
        </div>

        <div className="w-full md:w-auto">
          <VoiceNarrationPlayer
            title="Intelligence Briefing"
            narrationText={narrationScript}
            sectionTag="Audio Overview"
          />
        </div>
      </div>

      {/* 9 Calculated KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Collisions */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              Total Collisions
            </span>
            <FileCheck className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            {kpis.total_collisions.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            STATS19 Personal Injury
          </span>
        </div>

        {/* Fatal Collisions */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-brand-danger/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-brand-danger font-semibold">
              Fatal Collisions
            </span>
            <AlertTriangle className="w-4 h-4 text-brand-danger" />
          </div>
          <p className="text-2xl font-black text-brand-danger">
            {kpis.fatal_collisions.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {kpis.fatal_percentage}% of total (weight 10x)
          </span>
        </div>

        {/* Serious Collisions */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-brand-amber/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-brand-amber font-semibold">
              Serious Collisions
            </span>
            <Flame className="w-4 h-4 text-brand-amber" />
          </div>
          <p className="text-2xl font-black text-brand-amber">
            {kpis.serious_collisions.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {kpis.serious_percentage}% of total (weight 4x)
          </span>
        </div>

        {/* Slight Collisions */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-brand-success/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-brand-success font-semibold">
              Slight Collisions
            </span>
            <ShieldAlert className="w-4 h-4 text-brand-success" />
          </div>
          <p className="text-2xl font-black text-brand-success">
            {kpis.slight_collisions.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {kpis.slight_percentage}% of total (weight 1x)
          </span>
        </div>

        {/* DBSCAN Hotspots */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              DBSCAN Hotspots
            </span>
            <MapPin className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="text-2xl font-black text-brand-orange">{dbscan.n_clusters}</p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            Eps: 250m, Min: 8 crashes
          </span>
        </div>

        {/* Noise Outliers */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              Noise Outliers
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-700/10 text-zinc-500">
              Noise
            </span>
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            {dbscan.n_noise_points.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {dbscan.noise_percentage}% isolated incidents
          </span>
        </div>

        {/* Clustered Percentage */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              Clustered Share
            </span>
            <Layers className="w-4 h-4 text-brand-amber" />
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            {dbscan.clustered_percentage}%
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {dbscan.n_clustered_points.toLocaleString()} in danger zones
          </span>
        </div>

        {/* Highest Risk Hotspot */}
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-brand-danger/40 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-brand-danger font-semibold">
              Highest-Risk Hotspot
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-danger/15 text-brand-danger font-bold">
              RANK #1
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-extrabold text-[var(--text-primary)]">
              {top_hotspot ? top_hotspot.name : "N/A"}
            </p>
            <span className="text-sm font-mono font-bold text-brand-danger">
              Score: {top_hotspot ? top_hotspot.severity_score.toLocaleString() : 0}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-1">
            {top_hotspot ? top_hotspot.collision_count.toLocaleString() : 0} crashes (
            {top_hotspot ? top_hotspot.fatal_count : 0} fatal,{" "}
            {top_hotspot ? top_hotspot.serious_count : 0} serious)
          </span>
        </div>
      </div>

      {/* 8 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Collision Severity Distribution (Pie) */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                1. Collision Severity Distribution
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">DfT STATS19</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Breakdown of personal-injury crash consequences categorized by official UK definitions.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.severity_distribution}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name || ""} (${((percent || 0) * 100).toFixed(1)}%)`
                  }
                >
                  {analytics.severity_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} crashes`, "Count"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Monthly Accident Trend (Bar) */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                2. Monthly Accident Distribution
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Annual Seasonality</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Monthly variation in recorded collisions across January through December 2022.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthly_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} crashes`, "Total"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="total" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Hourly Diurnal Curve (Area with Rush-hour indicator) */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                3. Hourly Accident Frequency
              </h3>
              <span className="text-xs font-mono text-brand-orange font-semibold">Peak: 18:00</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Diurnal 24-hour crash frequency highlighting morning (07-09) and evening (16-19) rush
              periods.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.hourly_distribution}>
                <defs>
                  <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-amber)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--accent-amber)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={10} interval={2} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} collisions`, "Count"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--accent-orange)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#hourGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Weekday vs Weekend Comparison */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                4. Day-of-Week Distribution
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Monday - Sunday</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Comparison of daily collision counts across business weekdays versus weekend days.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.day_of_week_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} crashes`, "Count"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="total"
                  radius={[4, 4, 0, 0]}
                  fill="var(--accent-amber)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Road Type Distribution */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                5. Road Infrastructure Type
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Carriageway Types</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Incidents classified by highway geometry: single vs dual carriageways, roundabouts,
              slip roads.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={analytics.road_type_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={10} />
                <YAxis
                  type="category"
                  dataKey="road_type"
                  stroke="var(--text-muted)"
                  fontSize={10}
                  width={110}
                />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} crashes`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="var(--accent-orange)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Weather Conditions Distribution */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                6. Weather Conditions
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Atmospheric State</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Proportion of collisions occurring during fine weather, rainfall, snow, fog, and high
              winds.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weather_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="weather" stroke="var(--text-muted)" fontSize={9} interval={0} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} crashes`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Light Conditions */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                7. Ambient Lighting Conditions
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">Daylight vs Night</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Incidents recorded under daylight versus dark conditions with streetlights lit, unlit,
              or missing.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.light_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="light_condition" stroke="var(--text-muted)" fontSize={9} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [`${val.toLocaleString()} crashes`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. KMeans vs DBSCAN Summary Comparison */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base text-[var(--text-primary)]">
                8. Algorithm Output Comparison
              </h3>
              <span className="text-xs font-mono text-brand-orange font-semibold">
                DBSCAN vs KMeans
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              DBSCAN isolates 9,191 noise points and detects 432 hotspots, whereas KMeans forces all
              points into 8 clusters.
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="metric" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  formatter={(val: number) => [val.toLocaleString(), ""]}
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Bar dataKey="DBSCAN" fill="var(--accent-orange)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="KMeans" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

