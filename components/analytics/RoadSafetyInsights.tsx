"use client";

import React from "react";
import {
  Compass,
  Lightbulb,
  CloudSun,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  Gauge,
  SunMedium,
} from "lucide-react";
import { AnalyticsData } from "@/src/types";

interface RoadSafetyInsightsProps {
  analytics: AnalyticsData;
}

export const RoadSafetyInsights: React.FC<RoadSafetyInsightsProps> = ({ analytics }) => {
  const { insights, road_type_distribution, weather_distribution, light_distribution } = analytics;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-xs font-mono font-medium mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>OBJECTIVE STATISTICAL FINDINGS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Road Safety Insights
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Deterministic empirical correlations across infrastructure design, weather, and lighting
          conditions.
        </p>
      </div>

      {/* Insight Cards Generated from Real Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm hover:border-brand-amber/50 transition-all space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/15 text-brand-orange font-bold uppercase tracking-wider">
                  {insight.category}
                </span>
                <Lightbulb className="w-4 h-4 text-brand-amber" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{insight.title}</h3>
              <p className="text-sm font-mono font-bold text-brand-orange my-1">{insight.stat}</p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                {insight.description}
              </p>
            </div>

            {/* Non-Causation Caveat */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2 text-[11px] text-[var(--text-muted)] italic">
              <Info className="w-3.5 h-3.5 text-brand-amber shrink-0 mt-0.5" />
              <span>{insight.caveat}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Environmental & Infrastructure Matrix */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Environmental Context Distribution
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Aggregated exposure variables recorded in official STATS19 collision forms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Roads */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-orange" />
              <span>Carriageway Classification</span>
            </h4>
            <div className="space-y-1.5">
              {road_type_distribution.slice(0, 4).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-secondary)] text-xs"
                >
                  <span className="truncate max-w-[150px] text-[var(--text-secondary)]">
                    {r.road_type}
                  </span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">
                    {r.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-blue-500" />
              <span>Weather Conditions</span>
            </h4>
            <div className="space-y-1.5">
              {weather_distribution.slice(0, 4).map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-secondary)] text-xs"
                >
                  <span className="truncate max-w-[150px] text-[var(--text-secondary)]">
                    {w.weather}
                  </span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">
                    {w.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Lighting Conditions */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold text-[var(--text-muted)] uppercase flex items-center gap-1.5">
              <SunMedium className="w-3.5 h-3.5 text-purple-500" />
              <span>Lighting Ambient State</span>
            </h4>
            <div className="space-y-1.5">
              {light_distribution.slice(0, 4).map((l, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-secondary)] text-xs"
                >
                  <span className="truncate max-w-[150px] text-[var(--text-secondary)]">
                    {l.light_condition}
                  </span>
                  <span className="font-mono font-bold text-[var(--text-primary)]">
                    {l.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
