"use client";

import React, { useState, useMemo } from "react";
import {
  Flame,
  Search,
  ArrowUpDown,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Info,
  ChevronRight,
  Calculator,
} from "lucide-react";
import { Hotspot, NavSection } from "@/src/types";

interface SeverityIntelligenceProps {
  hotspots: Hotspot[];
  onNavigateToMap: (hotspot: Hotspot) => void;
}

export const SeverityIntelligence: React.FC<SeverityIntelligenceProps> = ({
  hotspots,
  onNavigateToMap,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [sortField, setSortField] = useState<"severity_score" | "collision_count" | "fatal_count">(
    "severity_score"
  );
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const filteredHotspots = useMemo(() => {
    return hotspots
      .filter((h) => {
        if (tierFilter !== "all" && h.risk_tier.toLowerCase() !== tierFilter.toLowerCase()) {
          return false;
        }
        if (
          searchTerm &&
          !h.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !h.dominant_road_type.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [hotspots, searchTerm, tierFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredHotspots.length / pageSize);
  const paginatedHotspots = filteredHotspots.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: "severity_score" | "collision_count" | "fatal_count") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-danger/15 text-brand-danger text-xs font-mono font-medium mb-1">
          <Flame className="w-3.5 h-3.5" />
          <span>MULTI-ATTRIBUTE RISK RANKING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Severity Intelligence & Ranking
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Empirical severity-weighted scoring separating high-casualty corridors from high-volume
          minor incident clusters.
        </p>
      </div>

      {/* Formula Explanation Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-brand-amber/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-brand-amber/15 text-brand-orange mt-0.5">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              Documented Severity Weighting Model
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Fatal collisions carry a 10× weighting factor, serious injuries 4×, and slight
              collisions 1×.
            </p>
            <p className="text-xs font-mono font-bold text-brand-orange mt-1.5">
              Severity Score = (10 × Fatal) + (4 × Serious) + (1 × Slight)
            </p>
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)] max-w-xs font-mono border-l md:border-l border-[var(--border-subtle)] pl-4">
          Non-predictive historical intensity index for prioritizing civil highway audits.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search zone or road type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none w-56"
            />
          </div>

          {/* Risk Tier Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--text-muted)]">Risk Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-2 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Tiers ({hotspots.length})</option>
              <option value="critical">Critical (Score ≥ 40)</option>
              <option value="high">High Priority</option>
              <option value="moderate">Moderate</option>
              <option value="emerging">Emerging</option>
            </select>
          </div>
        </div>

        <span className="font-mono text-[var(--text-muted)] text-[11px]">
          Showing {filteredHotspots.length} matching hotspot zones
        </span>
      </div>

      {/* Hotspots Ranked Leaderboard Table */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] font-mono text-[var(--text-muted)]">
                <th className="p-3.5 font-semibold">Rank</th>
                <th className="p-3.5 font-semibold">Hotspot Zone</th>
                <th className="p-3.5 font-semibold">Risk Tier</th>
                <th
                  onClick={() => toggleSort("severity_score")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-brand-orange"
                >
                  <span className="inline-flex items-center gap-1">
                    Severity Score <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("collision_count")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-brand-orange"
                >
                  <span className="inline-flex items-center gap-1">
                    Total Crashes <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => toggleSort("fatal_count")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-brand-orange"
                >
                  <span className="inline-flex items-center gap-1">
                    Casualty Breakdown <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="p-3.5 font-semibold">Dominant Road</th>
                <th className="p-3.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
              {paginatedHotspots.map((hotspot) => (
                <tr
                  key={hotspot.cluster_id}
                  className="hover:bg-[var(--bg-secondary)]/50 transition-colors"
                >
                  <td className="p-3.5 font-mono font-bold text-brand-orange">#{hotspot.rank}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-[var(--text-primary)]">{hotspot.name}</p>
                    <p className="text-[10px] font-mono text-[var(--text-muted)]">
                      {hotspot.centroid.latitude.toFixed(4)}°N,{" "}
                      {hotspot.centroid.longitude.toFixed(4)}°W
                    </p>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        hotspot.risk_tier === "Critical"
                          ? "bg-brand-danger/15 text-brand-danger border border-brand-danger/30"
                          : hotspot.risk_tier === "High"
                          ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/30"
                          : "bg-brand-amber/15 text-brand-amber border border-brand-amber/30"
                      }`}
                    >
                      {hotspot.risk_tier}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-black text-brand-danger text-sm">
                    {hotspot.severity_score.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[var(--text-primary)]">
                    {hotspot.collision_count.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono text-[11px]">
                    <span className="text-brand-danger font-semibold">{hotspot.fatal_count}F</span>{" "}
                    /{" "}
                    <span className="text-brand-amber font-semibold">
                      {hotspot.serious_count}S
                    </span>{" "}
                    /{" "}
                    <span className="text-brand-success font-semibold">
                      {hotspot.slight_count}Sl
                    </span>
                  </td>
                  <td className="p-3.5 text-xs">{hotspot.dominant_road_type}</td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onNavigateToMap(hotspot)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--bg-secondary)] hover:bg-brand-orange hover:text-white border border-[var(--border-color)] text-xs font-medium transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Locate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/30 flex items-center justify-between text-xs font-mono">
          <span className="text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2.5 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2.5 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
