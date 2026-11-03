"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Layers,
  Filter,
  RotateCcw,
  MapPin,
  Flame,
  AlertTriangle,
  Info,
  Clock,
  Navigation,
  Compass,
} from "lucide-react";
import { Hotspot, CrashPoint } from "@/src/types";

// Dynamic import with SSR disabled for Leaflet container
const LeafletMapInner = dynamic(
  () => import("./LeafletMapInner").then((mod) => mod.LeafletMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin mb-3" />
        <p className="font-semibold text-sm text-[var(--text-primary)]">Loading Geospatial Engine...</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">Initializing Leaflet Tile Pipeline & Coordinates</p>
      </div>
    ),
  }
);

interface HotspotExplorerProps {
  hotspots: Hotspot[];
  crashPoints: CrashPoint[];
}

export const HotspotExplorer: React.FC<HotspotExplorerProps> = ({ hotspots, crashPoints }) => {
  const [activeLayer, setActiveLayer] = useState<"dbscan" | "kmeans" | "points">("dbscan");
  const [showNoise, setShowNoise] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterTime, setFilterTime] = useState("all");
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(
    hotspots.length > 0 ? hotspots[0] : null
  );

  const resetFilters = () => {
    setActiveLayer("dbscan");
    setShowNoise(true);
    setFilterSeverity("all");
    setFilterTime("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-xs font-mono font-medium mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>INTERACTIVE GEOSPATIAL MAP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Hotspot Explorer
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Explore 432 spatial accident clusters, individual incidents, and isolated noise points
            across Greater London.
          </p>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-medium self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveLayer("dbscan")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayer === "dbscan"
                ? "bg-brand-orange text-white font-semibold shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            DBSCAN Hotspots
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("points")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayer === "points"
                ? "bg-brand-orange text-white font-semibold shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Incident Points
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("kmeans")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeLayer === "kmeans"
                ? "bg-brand-orange text-white font-semibold shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            KMeans Baseline
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            <Filter className="w-3.5 h-3.5 text-brand-orange" />
            <span>Filters:</span>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-muted)]">Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="fatal">Fatal Only</option>
              <option value="serious">Serious Only</option>
              <option value="slight">Slight Only</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-muted)]">Time Period:</span>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Hours</option>
              <option value="morning">Morning Commute (07:00-09:00)</option>
              <option value="evening">Evening Commute (16:00-19:00)</option>
              <option value="night">Night Hours (20:00-05:00)</option>
            </select>
          </div>

          {/* Noise Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)] select-none">
            <input
              type="checkbox"
              checked={showNoise}
              onChange={(e) => setShowNoise(e.target.checked)}
              className="rounded border-[var(--border-color)] text-brand-orange focus:ring-0"
            />
            <span>Include Noise Outliers</span>
          </label>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 h-[600px] relative">
          <LeafletMapInner
            hotspots={hotspots}
            crashPoints={crashPoints}
            selectedClusterId={selectedHotspot ? selectedHotspot.cluster_id : null}
            onSelectCluster={(h) => setSelectedHotspot(h)}
            activeLayer={activeLayer}
            showNoise={showNoise}
            filterSeverity={filterSeverity}
            filterTime={filterTime}
          />

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[1000] p-2.5 rounded-xl bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border-color)] shadow-md text-[11px] font-mono space-y-1 select-none pointer-events-auto">
            <p className="font-bold text-[var(--text-primary)] text-xs mb-1">Hotspot Legend</p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-danger inline-block" />
              <span>Critical (Score ≥ 40)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-orange inline-block" />
              <span>High Priority (Score ≥ 20)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-amber inline-block" />
              <span>Moderate (Score ≥ 10)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span>Emerging Hotspot</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-[var(--border-subtle)]">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 inline-block" />
              <span>Noise Outlier (35.3%)</span>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Inspector Panel */}
        <div className="lg:col-span-4 space-y-4">
          {selectedHotspot ? (
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange font-bold">
                      RANK #{selectedHotspot.rank}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        selectedHotspot.risk_tier === "Critical"
                          ? "bg-brand-danger/15 text-brand-danger"
                          : selectedHotspot.risk_tier === "High"
                          ? "bg-brand-orange/15 text-brand-orange"
                          : "bg-brand-amber/15 text-brand-amber"
                      }`}
                    >
                      {selectedHotspot.risk_tier.toUpperCase()} TIER
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[var(--text-primary)] mt-1">
                    {selectedHotspot.name}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                    SEVERITY SCORE
                  </span>
                  <span className="text-xl font-black text-brand-danger">
                    {selectedHotspot.severity_score.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Crash Count Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">FATAL</span>
                  <span className="text-base font-bold text-brand-danger">
                    {selectedHotspot.fatal_count}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">SERIOUS</span>
                  <span className="text-base font-bold text-brand-amber">
                    {selectedHotspot.serious_count}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">SLIGHT</span>
                  <span className="text-base font-bold text-brand-success">
                    {selectedHotspot.slight_count}
                  </span>
                </div>
              </div>

              {/* Hotspot Geography & Infrastructure Details */}
              <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
                <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Centroid Coordinates:</span>
                  </span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">
                    {selectedHotspot.centroid.latitude.toFixed(4)}°N,{" "}
                    {selectedHotspot.centroid.longitude.toFixed(4)}°W
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Compass className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Cluster Spatial Radius:</span>
                  </span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">
                    {selectedHotspot.radius_meters > 1000
                      ? `${(selectedHotspot.radius_meters / 1000).toFixed(2)} km`
                      : `${selectedHotspot.radius_meters.toFixed(0)} meters`}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Layers className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Dominant Road Type:</span>
                  </span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {selectedHotspot.dominant_road_type}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Diurnal Peak Hour:</span>
                  </span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">
                    {selectedHotspot.peak_hour}:00 ({selectedHotspot.rush_hour_percentage}% in rush)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
                  <span className="text-[var(--text-muted)]">Vehicles Involved:</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]">
                    {selectedHotspot.vehicles.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Scoring Formula Box */}
              <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-muted)]">
                <p className="font-semibold text-brand-orange mb-0.5">Scoring Formula:</p>
                <p>{selectedHotspot.scoring_formula}</p>
              </div>

              {/* Limitations Notice */}
              <p className="text-[10px] text-[var(--text-muted)] leading-tight italic">
                {selectedHotspot.methodological_note}
              </p>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
              Click any cluster marker on the map to inspect its spatial and casualty profile.
            </div>
          )}

          {/* Quick List of Top 5 Hotspots */}
          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2.5">
              Priority Hotspots Top 5
            </h4>
            <div className="space-y-1.5">
              {hotspots.slice(0, 5).map((h) => {
                const isSelected = selectedHotspot?.cluster_id === h.cluster_id;
                return (
                  <button
                    key={h.cluster_id}
                    type="button"
                    onClick={() => setSelectedHotspot(h)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-brand-orange/15 text-brand-orange font-bold border border-brand-orange/30"
                        : "hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold text-[var(--text-muted)]">
                        #{h.rank}
                      </span>
                      <span className="font-medium truncate max-w-[140px]">{h.name}</span>
                    </div>
                    <span className="font-mono font-bold text-brand-danger">
                      {h.severity_score.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
