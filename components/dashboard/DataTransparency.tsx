"use client";

import React from "react";
import {
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Database,
  Layers,
  Info,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { TransparencyData } from "@/src/types";

interface DataTransparencyProps {
  transparency: TransparencyData;
}

export const DataTransparency: React.FC<DataTransparencyProps> = ({ transparency }) => {
  const { audit_log, bounding_box, severity_code_mapping } = transparency;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-xs font-mono font-medium mb-1">
          <FileText className="w-3.5 h-3.5" />
          <span>PROVENANCE & AUDIT TRAIL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Data & Transparency
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Full data provenance, filtering audit trail, codebook mappings, licensing, and analytical
          scope limitations.
        </p>
      </div>

      {/* Provenance Card */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <span className="text-[10px] font-mono uppercase text-brand-orange font-bold">
              OFFICIAL DATA SOURCE
            </span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {transparency.dataset_name} ({transparency.dataset_year})
            </h3>
          </div>
          <a
            href={transparency.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-brand-orange hover:text-white border border-[var(--border-color)] text-xs font-medium transition-colors"
          >
            <span>DfT Portal Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">PROVIDER</span>
            <span className="font-bold text-[var(--text-primary)]">{transparency.provider}</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">STUDY REGION</span>
            <span className="font-bold text-[var(--text-primary)]">{transparency.study_area}</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">LICENSING</span>
            <span className="font-bold text-brand-success">{transparency.licensing}</span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">
              COORDINATE SYSTEM
            </span>
            <span className="font-bold text-[var(--text-primary)]">
              {transparency.geographic_crs}
            </span>
          </div>
        </div>
      </div>

      {/* Record Ingestion Audit Trail */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          Record Ingestion & Filtering Audit Trail
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Verifiable counts of collision records ingested, cleaned, boundary-checked, and retained.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">
              1. RAW RECORDS INGESTED
            </span>
            <p className="text-xl font-mono font-black text-[var(--text-primary)] mt-1">
              {audit_log.raw_record_count.toLocaleString()}
            </p>
            <span className="text-[10px] text-[var(--text-muted)]">National UK Collision File</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">
              2. INVALID COORDINATES
            </span>
            <p className="text-xl font-mono font-black text-brand-danger mt-1">
              {(
                audit_log.missing_coordinate_count + audit_log.invalid_coordinate_count
              ).toLocaleString()}
            </p>
            <span className="text-[10px] text-[var(--text-muted)]">Null or NaN coordinates</span>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block">
              3. OUTSIDE STUDY BOUNDARY
            </span>
            <p className="text-xl font-mono font-black text-zinc-500 mt-1">
              {audit_log.outside_boundary_count.toLocaleString()}
            </p>
            <span className="text-[10px] text-[var(--text-muted)]">Outside London bounding box</span>
          </div>

          <div className="p-4 rounded-xl bg-brand-orange/10 border border-brand-orange/30">
            <span className="text-[10px] font-mono text-brand-orange block font-bold">
              4. RETAINED FOR ANALYSIS
            </span>
            <p className="text-xl font-mono font-black text-brand-orange mt-1">
              {audit_log.retained_record_count.toLocaleString()}
            </p>
            <span className="text-[10px] text-brand-orange font-semibold">100% Validated Crashes</span>
          </div>
        </div>

        {/* Study Area Bounding Box */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-mono space-y-1">
          <p className="font-bold text-brand-orange">Study Area Spatial Envelope (WGS84):</p>
          <p className="text-[var(--text-secondary)]">
            Latitude: {bounding_box.min_lat}°N to {bounding_box.max_lat}°N | Longitude:{" "}
            {bounding_box.min_lon}°W to {bounding_box.max_lon}°E
          </p>
        </div>
      </div>

      {/* Codebook Mapping & Official Definitions */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">
          Official STATS19 Severity Codebook
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-brand-danger/10 border border-brand-danger/30 space-y-1">
            <span className="font-mono text-brand-danger font-bold text-[11px]">CODE 1: FATAL</span>
            <p className="font-semibold text-[var(--text-primary)]">Injuries Resulting in Death</p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Casualties who sustained injuries resulting in death within 30 days of the collision.
              Weighted 10× in severity index.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-brand-amber/10 border border-brand-amber/30 space-y-1">
            <span className="font-mono text-brand-amber font-bold text-[11px]">
              CODE 2: SERIOUS
            </span>
            <p className="font-semibold text-[var(--text-primary)]">Severe Hospitalization</p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Fractures, severe concussion, internal injuries, crushing, or detention in hospital as
              an in-patient. Weighted 4×.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-brand-success/10 border border-brand-success/30 space-y-1">
            <span className="font-mono text-brand-success font-bold text-[11px]">
              CODE 3: SLIGHT
            </span>
            <p className="font-semibold text-[var(--text-primary)]">Minor Injuries</p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Sprains, neck whiplash, minor cuts, shallow lacerations, or bruises not requiring
              extended hospital admission. Weighted 1×.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Geographic Scope & Limitations Disclosure */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-danger/30 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-brand-danger font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Mandatory Analytical Scope & Geographical Disclosure</span>
        </div>
        <div className="space-y-2 text-xs text-[var(--text-secondary)] leading-relaxed">
          <p>
            <b>1. Geographical Coverage:</b> This dataset strictly covers the United Kingdom (specifically
            filtered to Greater London). It does <b>NOT</b> represent traffic collision data for Jaipur,
            Rajasthan, or India.
          </p>
          <p>
            <b>2. Police-Reported Only:</b> STATS19 records personal injury collisions reported to police.
            Damage-only collisions (where no personal injury occurred) are not legally reportable and are
            not present in this dataset.
          </p>
          <p>
            <b>3. Non-Causal & Retrospective:</b> Hotspot clustering identifies historical geographic
            concentrations. It does not predict future accident probabilities, nor does it establish
            individual driver fault or liability.
          </p>
        </div>
      </div>
    </div>
  );
};
