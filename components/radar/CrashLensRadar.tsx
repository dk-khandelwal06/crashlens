"use client";

import React, { useState, useEffect } from "react";
import { Radio, Crosshair, AlertTriangle, ShieldCheck } from "lucide-react";

interface CrashLensRadarProps {
  hotspotCount?: number;
  criticalCount?: number;
  statusLabel?: string;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export const CrashLensRadar: React.FC<CrashLensRadarProps> = ({
  hotspotCount = 432,
  criticalCount = 28,
  statusLabel = "GEOSPATIAL SWEEP ACTIVE",
  size = "md",
  interactive = true,
}) => {
  const [sweepAngle, setSweepAngle] = useState(0);

  // Targets simulating high-risk cluster coordinates on radar screen
  const targets = [
    { x: 42, y: 35, tier: "critical", label: "Zone #6 (Central)", score: 10675 },
    { x: 68, y: 58, tier: "critical", label: "Zone #12 (East Corridor)", score: 4820 },
    { x: 30, y: 70, tier: "high", label: "Zone #24 (South Circular)", score: 2190 },
    { x: 75, y: 28, tier: "high", label: "Zone #31 (North Orbital)", score: 1840 },
    { x: 55, y: 48, tier: "moderate", label: "Zone #45 (Inner Bypass)", score: 940 },
    { x: 22, y: 40, tier: "moderate", label: "Zone #89 (A40 Flyover)", score: 620 },
    { x: 62, y: 78, tier: "emerging", label: "Zone #104 (A2 Junction)", score: 410 },
  ];

  const dimensions = {
    sm: "w-48 h-48",
    md: "w-72 h-72 sm:w-80 sm:h-80",
    lg: "w-96 h-96",
  }[size];

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer Tactical Frame */}
      <div
        className={`relative ${dimensions} rounded-full border border-brand-amber/30 bg-[#0c1017] p-2 shadow-2xl shadow-brand-amber/10 overflow-hidden select-none`}
      >
        {/* Radial Range Rings */}
        <div className="absolute inset-4 rounded-full border border-brand-amber/20" />
        <div className="absolute inset-10 rounded-full border border-brand-amber/25" />
        <div className="absolute inset-16 rounded-full border border-brand-amber/15 border-dashed" />
        <div className="absolute inset-24 rounded-full border border-brand-amber/30" />

        {/* Crosshair Grid Lines */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-brand-amber/25" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-brand-amber/25" />
        <div className="absolute inset-0 rotate-45">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-brand-amber/15" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-brand-amber/15" />
        </div>

        {/* Range Distance Labels */}
        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-brand-amber/60">
          10 KM
        </span>
        <span className="absolute top-11 left-1/2 -translate-x-1/2 text-[9px] font-mono text-brand-amber/60">
          5 KM
        </span>
        <span className="absolute top-17 left-1/2 -translate-x-1/2 text-[8px] font-mono text-brand-amber/40">
          2.5 KM
        </span>

        {/* Rotating Radar Sweep Cone */}
        <div className="absolute inset-0 rounded-full radar-sweep-beam pointer-events-none">
          <div
            className="w-1/2 h-1/2 origin-bottom-right"
            style={{
              background:
                "conic-gradient(from 180deg at 100% 100%, rgba(245, 158, 11, 0.35) 0deg, rgba(234, 88, 12, 0.1) 40deg, transparent 75deg)",
            }}
          />
        </div>

        {/* Radar Center Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-brand-amber/30 border border-brand-amber flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-ping" />
        </div>

        {/* Simulated Clustered Target Pings */}
        {targets.map((tgt, idx) => (
          <div
            key={idx}
            className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${tgt.x}%`, top: `${tgt.y}%` }}
          >
            {/* Ping Marker */}
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                tgt.tier === "critical"
                  ? "bg-brand-danger shadow-[0_0_8px_#ef4444]"
                  : tgt.tier === "high"
                  ? "bg-brand-orange shadow-[0_0_8px_#ea580c]"
                  : "bg-brand-amber shadow-[0_0_8px_#f59e0b]"
              }`}
            />
            <div
              className={`absolute -inset-1 rounded-full animate-ping opacity-75 ${
                tgt.tier === "critical" ? "bg-brand-danger" : "bg-brand-amber"
              }`}
            />

            {/* Target Tooltip */}
            {interactive && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#181d26] text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg border border-brand-amber/40 whitespace-nowrap pointer-events-none z-20">
                <p className="font-semibold text-brand-amber">{tgt.label}</p>
                <p className="text-zinc-300">Risk Score: {tgt.score.toLocaleString()}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Radar Status Bar & Tactical Readout */}
      <div className="mt-3 flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181d26] border border-brand-amber/30 text-zinc-300">
          <Radio className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
          <span className="text-[11px] text-brand-amber tracking-wider">{statusLabel}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#181d26] border border-zinc-700/50 text-zinc-400">
          <Crosshair className="w-3 h-3 text-brand-orange" />
          <span className="text-[11px]">LON: 51.5074°N, 0.1278°W</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-danger/10 border border-brand-danger/40 text-brand-danger">
          <AlertTriangle className="w-3 h-3" />
          <span className="text-[11px] font-semibold">{criticalCount} Critical</span>
        </div>
      </div>
    </div>
  );
};

