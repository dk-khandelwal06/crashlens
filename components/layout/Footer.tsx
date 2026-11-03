"use client";

import React from "react";
import { ShieldAlert, ExternalLink, Heart, Radio } from "lucide-react";
import { NavSection } from "@/src/types";

interface FooterProps {
  onNavigate: (section: NavSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] text-xs text-[var(--text-secondary)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-amber to-brand-orange text-white flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
                Crash<span className="text-brand-orange">Lens</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              &quot;Finding where accidents cluster, not just where they happen.&quot; Unsupervised
              machine learning and geospatial intelligence platform for public safety and highway
              engineering.
            </p>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              UK DfT STATS19 Road Safety Open Data • Greater London Study Area (2022)
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-mono text-[11px] font-bold uppercase text-[var(--text-primary)] tracking-wider">
              Intelligence Modules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("dashboard")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Intelligence Dashboard
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("explorer")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Hotspot Explorer (Map)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("laboratory")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Clustering Laboratory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("severity")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Severity Ranking
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("temporal")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Temporal Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Transparency & Legal */}
          <div className="space-y-2">
            <h4 className="font-mono text-[11px] font-bold uppercase text-[var(--text-primary)] tracking-wider">
              Methodology & Legal
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("methodology")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Haversine DBSCAN Math
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("transparency")}
                  className="hover:text-brand-orange transition-colors"
                >
                  Data Provenance & Audit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate("about")}
                  className="hover:text-brand-orange transition-colors"
                >
                  System Architecture
                </button>
              </li>
              <li>
                <a
                  href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-brand-orange transition-colors"
                >
                  <span>Open Government Licence (OGL)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <p>
            © {new Date().getFullYear()} CrashLens Intelligence. Built with Next.js, scikit-learn &
            Leaflet.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-brand-orange">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>PRODUCTION BUILD 1.0</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

