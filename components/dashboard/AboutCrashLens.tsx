"use client";

import React from "react";
import {
  ShieldAlert,
  Cpu,
  Github,
  Globe,
  CheckCircle2,
  Layers,
  Terminal,
  Zap,
} from "lucide-react";

export const AboutCrashLens: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-xs font-mono font-medium mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>PROJECT IDENTITY & SPECIFICATIONS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          About CrashLens
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Road accident hotspot detection and geospatial transportation intelligence.
        </p>
      </div>

      {/* Main Identity Box */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-[10px] font-mono uppercase text-brand-orange font-bold">
              PROJECT #004
            </span>
            <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
              Crash<span className="text-brand-orange">Lens</span>
            </h3>
            <p className="text-xs font-mono text-[var(--text-secondary)] mt-0.5">
              &quot;Finding where accidents cluster, not just where they happen.&quot;
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-success/15 text-brand-success border border-brand-success/30 font-semibold">
              PRODUCTION READY
            </span>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Individual accident records are not sufficient to identify dangerous road stretches.
          CrashLens analyzes geographical accident distributions to discover locations where accidents
          occur in concentrated patterns. It bridges unsupervised machine learning and municipal
          transportation policy to guide evidence-based highway engineering.
        </p>
      </div>

      {/* Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-3">
          <div className="p-2.5 rounded-xl bg-brand-orange/15 text-brand-orange w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-[var(--text-primary)]">Python ML Core</h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            scikit-learn DBSCAN with Great-Circle Haversine angular distance. Complete schema
            validation and reproducible JSON/GeoJSON serialization.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-3">
          <div className="p-2.5 rounded-xl bg-brand-amber/15 text-brand-orange w-fit">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-[var(--text-primary)]">Next.js & Leaflet</h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Next.js App Router, React 19, TypeScript, and dynamic Leaflet mapping with multi-criteria
            real-time filtering.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-3">
          <div className="p-2.5 rounded-xl bg-brand-success/15 text-brand-success w-fit">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-base text-[var(--text-primary)]">Zero Serverless Lag</h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Clean architectural separation: offline Python clustering pre-computes deterministic
            compact analytical models, enabling instant Vercel load times with zero serverless cold starts.
          </p>
        </div>
      </div>

      {/* Deployment & Technology Stack Specs */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <h4 className="font-bold text-base text-[var(--text-primary)]">
          Full Technology Stack Specifications
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] block">FRONTEND</span>
            <p className="font-bold text-[var(--text-primary)]">Next.js 15 App Router</p>
            <p className="text-[11px] text-[var(--text-secondary)]">React 19, TypeScript</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] block">STYLING & THEMES</span>
            <p className="font-bold text-[var(--text-primary)]">Tailwind CSS</p>
            <p className="text-[11px] text-[var(--text-secondary)]">Light, Comfort, Dark Modes</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] block">MAPPING & CHARTS</span>
            <p className="font-bold text-[var(--text-primary)]">Leaflet & Recharts</p>
            <p className="text-[11px] text-[var(--text-secondary)]">CARTO & OpenStreetMap Tiles</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] block">MACHINE LEARNING</span>
            <p className="font-bold text-[var(--text-primary)]">Python 3.13</p>
            <p className="text-[11px] text-[var(--text-secondary)]">scikit-learn, Pandas, NumPy</p>
          </div>
        </div>
      </div>
    </div>
  );
};
