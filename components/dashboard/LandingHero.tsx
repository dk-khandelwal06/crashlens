"use client";

import React from "react";
import { ArrowRight, ShieldCheck, MapPin, Sparkles, Database, Layers, Brain, Crosshair } from "lucide-react";
import { CrashLensRadar } from "@/components/radar/CrashLensRadar";
import { SummaryData, NavSection } from "@/src/types";

interface LandingHeroProps {
  summary: SummaryData;
  onNavigate: (section: NavSection) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ summary, onNavigate }) => {
  const steps = [
    {
      num: "01",
      icon: <Database className="w-5 h-5 text-brand-amber" />,
      title: "Accident Records",
      desc: "Ingests police-reported STATS19 collision records with cleaned coordinates and verified casualty outcomes.",
    },
    {
      num: "02",
      icon: <Crosshair className="w-5 h-5 text-brand-orange" />,
      title: "Spatial Haversine",
      desc: "Projects coordinates onto spherical Earth geometry, correcting for longitudinal convergence at 51.5°N.",
    },
    {
      num: "03",
      icon: <Brain className="w-5 h-5 text-brand-amber" />,
      title: "Unsupervised ML",
      desc: "Executes DBSCAN to isolate density-connected crash clusters from solitary background noise.",
    },
    {
      num: "04",
      icon: <MapPin className="w-5 h-5 text-brand-danger" />,
      title: "Identified Hotspots",
      desc: "Discovers irregular danger corridors, roundabout clusters, and high-frequency collision segments.",
    },
    {
      num: "05",
      icon: <ShieldCheck className="w-5 h-5 text-brand-success" />,
      title: "Safety Intelligence",
      desc: "Ranks clusters with transparent severity weighting to direct empirical road safety engineering.",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)]">
      {/* Subtle road line background watermark */}
      <div className="absolute inset-0 bg-road-pattern opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission Narrative & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-orange text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              <span>PUBLIC SAFETY INTELLIGENCE PLATFORM • {summary.region.toUpperCase()}</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1]">
              See the Danger. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber via-brand-orange to-brand-danger">
                Find the Pattern.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              CrashLens transforms individual road accident records into geographical intelligence,
              revealing where collisions concentrate and where road safety interventions deserve
              attention.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("explorer")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--accent-orange)] hover:bg-brand-orange-dark text-white font-semibold text-sm shadow-lg shadow-brand-orange/25 transition-all transform active:scale-95"
              >
                <span>Explore Hotspots</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("laboratory")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold text-sm transition-all shadow-sm"
              >
                <span>Clustering Laboratory</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-mono text-[var(--text-muted)] hover:text-brand-orange transition-colors"
              >
                View Analytics &rarr;
              </button>
            </div>

            {/* Live KPI Ticker from Processed Dataset */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[var(--border-subtle)]">
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] block">ANALYZED CRASHES</span>
                <span className="text-xl font-bold text-[var(--text-primary)]">
                  {summary.kpis.total_collisions.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] block">DBSCAN HOTSPOTS</span>
                <span className="text-xl font-bold text-brand-orange">
                  {summary.dbscan.n_clusters}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] block">ISOLATED NOISE</span>
                <span className="text-xl font-bold text-zinc-500">
                  {summary.dbscan.noise_percentage}%
                </span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                <span className="text-[11px] font-mono text-[var(--text-muted)] block">PEAK RISK SCORE</span>
                <span className="text-xl font-bold text-brand-danger">
                  {summary.top_hotspot ? summary.top_hotspot.severity_score.toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Signature CrashLens Radar Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl relative w-full flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping" />
                  <span className="text-xs font-mono font-bold tracking-wider text-[var(--text-primary)]">
                    CRASHLENS RADAR SCANNER
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-amber/15 text-brand-orange">
                  EPS: 250M
                </span>
              </div>

              <CrashLensRadar
                hotspotCount={summary.dbscan.n_clusters}
                criticalCount={32}
                statusLabel="GREATER LONDON SCAN ACTIVE"
                size="md"
              />

              <p className="mt-4 text-[11px] font-mono text-center text-[var(--text-muted)]">
                Autonomous density clustering scans spatial point concentrations across 1,572 km²
              </p>
            </div>
          </div>
        </div>

        {/* 5-Step Visual Methodology Pipeline */}
        <div className="mt-16 pt-10 border-t border-[var(--border-color)]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-mono font-semibold text-brand-orange uppercase tracking-wider">
              DATA PIPELINE ARCHITECTURE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
              How CrashLens Finds Dangerous Clusters
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className="relative p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-brand-amber/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-brand-orange">{st.num}</span>
                    <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">{st.icon}</div>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">{st.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
