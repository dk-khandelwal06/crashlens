"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Globe2,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Brain,
  HelpCircle,
  Binary,
  Code2,
} from "lucide-react";

export const MethodologySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"haversine" | "dbscan" | "kmeans" | "metrics">("haversine");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-amber/15 text-brand-orange text-xs font-mono font-medium mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>DATA SCIENCE & GEOSPATIAL THEORY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Methodology & Learning Centre
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Mathematical principles of unsupervised machine learning, spherical trigonometry, and
          spatial density reachability.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("haversine")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
            activeTab === "haversine"
              ? "bg-brand-orange text-white font-semibold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>1. Haversine vs Euclidean</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dbscan")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
            activeTab === "dbscan"
              ? "bg-brand-orange text-white font-semibold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>2. DBSCAN Density Reachability</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("kmeans")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
            activeTab === "kmeans"
              ? "bg-brand-orange text-white font-semibold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>3. KMeans & Centroid Flaws</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
            activeTab === "metrics"
              ? "bg-brand-orange text-white font-semibold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
          }`}
        >
          <Binary className="w-4 h-4" />
          <span>4. Evaluation Metrics</span>
        </button>
      </div>

      {/* Tab 1: Haversine vs Euclidean */}
      {activeTab === "haversine" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Why Raw Latitude and Longitude Are NOT Euclidean
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              A common mistake in beginner geospatial machine learning is treating decimal latitude
              and longitude as ordinary Cartesian coordinates (x, y) with standard flat Euclidean
              distance formula &radic;(&Delta;x&sup2; + &Delta;y&sup2;).
            </p>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-orange font-mono">
                The Longitudinal Convergence Problem at London (51.5°N):
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="font-mono text-brand-orange block font-bold">1° Latitude</span>
                  <p className="text-lg font-black text-[var(--text-primary)]">≈ 111.2 km</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Remains constant globally</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                  <span className="font-mono text-brand-orange block font-bold">1° Longitude</span>
                  <p className="text-lg font-black text-brand-danger">≈ 69.3 km</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Converges as \(\cos(51.5^\circ) \approx 0.6225\)
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              If an algorithm uses standard Euclidean distance directly on (lat, lon), circular
              cluster search neighborhoods become severely stretched into vertical ellipses,
              distorting east-west spatial relationships by over 60%!
            </p>
          </div>

          {/* Haversine Mathematical Formula */}
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              The Spherical Haversine Distance Formula
            </h4>
            <div className="p-4 rounded-xl bg-[#0d1117] text-zinc-100 font-mono text-xs leading-relaxed overflow-x-auto border border-zinc-800">
              <p className="text-amber-400">// Great-circle spherical distance on Earth (R = 6371.0088 km)</p>
              <p className="mt-2 text-zinc-300">
                a = sin²(Δlat / 2) + cos(lat₁) · cos(lat₂) · sin²(Δlon / 2)
              </p>
              <p className="text-zinc-300">c = 2 · atan2(√a, √(1 − a))</p>
              <p className="text-emerald-400 font-bold mt-1">Distance = R · c</p>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              CrashLens converts coordinates to radians prior to scikit-learn DBSCAN execution,
              scaling the epsilon radius to angular distance: eps_rad = eps_km / 6371.0088.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: DBSCAN Density Reachability */}
      {activeTab === "dbscan" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              How DBSCAN Discovers Arbitrary Road Danger Corridors
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              DBSCAN (Density-Based Spatial Clustering of Applications with Noise) groups points that
              are closely packed together and marks points that lie alone in low-density regions as
              noise outliers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-mono text-brand-orange font-bold text-[11px]">
                  1. CORE POINT
                </span>
                <p className="font-bold text-sm text-[var(--text-primary)]">High Density Hub</p>
                <p className="text-[var(--text-secondary)]">
                  Contains at least <i>min_samples</i> (e.g. 8 crashes) within radius <i>eps</i> (250
                  meters).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-mono text-brand-amber font-bold text-[11px]">
                  2. BORDER POINT
                </span>
                <p className="font-bold text-sm text-[var(--text-primary)]">Cluster Periphery</p>
                <p className="text-[var(--text-secondary)]">
                  Within <i>eps</i> of a core point, but has fewer than <i>min_samples</i> neighbors.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                <span className="font-mono text-zinc-400 font-bold text-[11px]">
                  3. NOISE POINT (-1)
                </span>
                <p className="font-bold text-sm text-[var(--text-primary)]">Solitary Crash</p>
                <p className="text-[var(--text-secondary)]">
                  Neither core nor border. Isolated incidents that do not belong to any concentrated
                  hotspot corridor.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Why Arbitrary Shapes Matter in Transportation
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Unlike spherical clusters, dangerous roads are linear corridors, curved bypasses, or
              complex multi-approach roundabouts. DBSCAN discovers arbitrary density shapes through
              density-connected chains of core points.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: KMeans & Centroid Flaws */}
      {activeTab === "kmeans" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              KMeans Centroid Partitioning & Its Inherent Limitations
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              KMeans partitions data into <i>K</i> clusters by iteratively updating cluster centroids
              to minimize within-cluster sum of squares (WCSS / Inertia):
            </p>

            <div className="p-4 rounded-xl bg-[#0d1117] text-zinc-100 font-mono text-xs text-center border border-zinc-800">
              <span className="text-amber-400">Objective:</span> min ∑ ∑ || xᵢ − μⱼ ||²
            </div>

            <div className="space-y-2 mt-4 text-xs">
              <h4 className="font-bold text-brand-danger">Three Fundamental Flaws for Hotspot Detection:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
                <li>
                  <b>No Concept of Noise:</b> Every solitary rural crash is forced into the nearest
                  cluster, pulling cluster centers kilometers away from actual intersection hazard
                  zones.
                </li>
                <li>
                  <b>Rigid Voronoi Shapes:</b> KMeans imposes convex spherical partitions. It cannot
                  follow a 10 km curved highway corridor without slicing it artificially into separate
                  blobs.
                </li>
                <li>
                  <b>Pre-Specified K:</b> Highway authorities cannot know in advance how many genuine
                  hotspot zones exist in a metropolitan area.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Evaluation Metrics */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              Understanding Clustering Evaluation Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="font-mono text-brand-orange font-bold text-[11px]">
                  ELBOW METHOD (WCSS)
                </span>
                <p className="font-bold text-sm text-[var(--text-primary)]">Within-Cluster Sum of Squares</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Measures cluster compactness. As K increases, inertia decreases monotonically. The
                  optimal K is located at the &quot;elbow&quot; bend where marginal decrease plateaus.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                <span className="font-mono text-brand-amber font-bold text-[11px]">
                  SILHOUETTE SCORE
                </span>
                <p className="font-bold text-sm text-[var(--text-primary)]">Cohesion vs Separation</p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Ranges from -1 to +1. Measures how similar a point is to its own cluster compared to
                  neighboring clusters. In our dataset, KMeans achieves ~0.33 at K=8.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-danger/10 border border-brand-danger/30 text-xs text-[var(--text-secondary)] space-y-1">
              <p className="font-bold text-brand-danger">Why Silhouette Fails for DBSCAN:</p>
              <p className="text-[11px] leading-relaxed">
                Silhouette assumes convex spherical geometry. For long linear corridors or irregular
                choke points detected by DBSCAN, distant points within the same corridor naturally have
                large Euclidean distances, yielding deceptively low silhouette scores despite being
                ideal road safety clusters.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
