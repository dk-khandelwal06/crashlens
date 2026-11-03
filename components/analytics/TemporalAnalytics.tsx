"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Clock, Sun, Moon, Briefcase, Coffee, CalendarDays } from "lucide-react";
import { AnalyticsData } from "@/src/types";

interface TemporalAnalyticsProps {
  analytics: AnalyticsData;
}

export const TemporalAnalytics: React.FC<TemporalAnalyticsProps> = ({ analytics }) => {
  const [activeFilter, setActiveFilter] = useState<"all" | "rush" | "night">("all");

  const hourlyData = analytics.hourly_distribution.map((h) => ({
    ...h,
    highlight:
      activeFilter === "all"
        ? true
        : activeFilter === "rush"
        ? h.is_morning_rush || h.is_evening_rush
        : h.is_night,
  }));

  // Aggregate stats
  const totalCrashes = analytics.summary_kpis.total_collisions;
  const morningRush = analytics.hourly_distribution
    .filter((h) => h.is_morning_rush)
    .reduce((acc, curr) => acc + curr.total, 0);
  const eveningRush = analytics.hourly_distribution
    .filter((h) => h.is_evening_rush)
    .reduce((acc, curr) => acc + curr.total, 0);
  const nightCrashes = analytics.hourly_distribution
    .filter((h) => h.is_night)
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-amber/15 text-brand-orange text-xs font-mono font-medium mb-1">
          <Clock className="w-3.5 h-3.5" />
          <span>DIURNAL & SEASONAL ACCIDENT PATTERNS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Temporal Analytics
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Empirical distribution of collisions across hourly commuter rhythms, weekend spikes, and
          monthly seasonal trends.
        </p>
      </div>

      {/* Temporal KPI Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              Morning Rush (07-09)
            </span>
            <Coffee className="w-4 h-4 text-brand-amber" />
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            {morningRush.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {((morningRush / totalCrashes) * 100).toFixed(1)}% of all crashes
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-brand-orange/30 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-brand-orange font-semibold">
              Evening Rush (16-19)
            </span>
            <Briefcase className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="text-2xl font-black text-brand-orange">
            {eveningRush.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {((eveningRush / totalCrashes) * 100).toFixed(1)}% (Peak Traffic Choke)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase text-[var(--text-muted)]">
              Night Hours (20-05)
            </span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-[var(--text-primary)]">
            {nightCrashes.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">
            {((nightCrashes / totalCrashes) * 100).toFixed(1)}% under darkness
          </span>
        </div>
      </div>

      {/* Hourly Diurnal Curve with Time Window Buttons */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-[var(--text-primary)]">
              24-Hour Diurnal Collision Curve
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Hourly frequency of collisions categorized by injury severity level.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === "all"
                  ? "bg-brand-orange text-white font-semibold shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All Hours
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("rush")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === "rush"
                  ? "bg-brand-orange text-white font-semibold shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Commuter Peaks
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("night")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === "night"
                  ? "bg-brand-orange text-white font-semibold shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Night Periods
            </button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="fatalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="seriousGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="slightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
              <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} interval={1} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                formatter={(val: number) => [`${val.toLocaleString()} crashes`, ""]}
                contentStyle={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="fatal"
                name="Fatal"
                stroke="#ef4444"
                fill="url(#fatalGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="serious"
                name="Serious"
                stroke="#f59e0b"
                fill="url(#seriousGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="slight"
                name="Slight"
                stroke="#10b981"
                fill="url(#slightGrad)"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonality and Weekly Comparison Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day of Week */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Weekday vs Weekend Crashes
            </h4>
            <span className="text-xs font-mono text-[var(--text-muted)]">Monday - Sunday</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.day_of_week_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.6} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={11} />
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
                <Bar dataKey="total" fill="var(--accent-amber)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Seasonality */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Monthly Seasonality Trend
            </h4>
            <span className="text-xs font-mono text-[var(--text-muted)]">Jan - Dec 2022</span>
          </div>
          <div className="h-56 w-full">
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
      </div>
    </div>
  );
};
