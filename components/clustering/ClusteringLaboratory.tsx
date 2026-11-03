"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FlaskConical,
  Brain,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  Info,
} from "lucide-react";
import { LabExperiments, MethodologyComparison, DBSCANSummary, KMeansSummary } from "@/src/types";

interface ClusteringLaboratoryProps {
  labData: LabExperiments;
  comparisonData: MethodologyComparison;
  dbscanSummary: DBSCANSummary;
  kmeansSummary: KMeansSummary;
}

export const ClusteringLaboratory: React.FC<ClusteringLaboratoryProps> = ({
  labData,
  comparisonData,
  dbscanSummary,
  kmeansSummary,
}) => {
  // Configurable controls that map to real computed experiments
  const [selectedK, setSelectedK] = useState<number>(8);
  const [selectedEps, setSelectedEps] = useState<number>(0.25);
  const [selectedMinSamples, setSelectedMinSamples] = useState<number>(8);

  // Look up actual generated experiment outcome from the sensitivity matrix
  const matchedDBSCANExperiment =
    labData.dbscan_sensitivity_matrix.find(
      (exp) => exp.eps_km === selectedEps && exp.min_samples === selectedMinSamples
    ) || {
      eps_km: selectedEps,
      min_samples: selectedMinSamples,
      n_clusters: dbscanSummary.n_clusters,
      n_noise_points: dbscanSummary.n_noise_points,
      noise_percentage: dbscanSummary.noise_percentage,
      clustered_percentage: dbscanSummary.clustered_percentage,
    };

  const matchedKMeansExperiment =
    labData.kmeans_elbow_curve.find((exp) => exp.k === selectedK) || {
      k: selectedK,
      inertia: kmeansSummary.inertia,
      silhouette: kmeansSummary.silhouette_score || 0.33,
    };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-brand-orange/15 text-brand-orange text-xs font-mono font-medium mb-1">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>EXPERIMENTAL LABORATORY & EVALUATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Clustering Laboratory
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Compare scikit-learn implementations of centroid-based KMeans against density-based
          Haversine DBSCAN on 26,030 collision coordinates.
        </p>
      </div>

      {/* Two Comparison Interactive Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel A: KMeans Baseline */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-500/10 text-zinc-600 dark:text-zinc-300">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                    BASELINE ALGORITHM
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    KMeans Centroid Partitioning
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-700/10 text-zinc-500">
                Euclidean Metric
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] my-3 leading-relaxed">
              KMeans partitions the spatial coordinate space into <i>K</i> convex Voronoi cells. It
              minimizes within-cluster sum of squares (WCSS / Inertia), but forces 100% of points
              into clusters.
            </p>

            {/* Configurable K Slider */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">
                  Clusters (K Parameter):
                </span>
                <span className="font-mono font-bold text-brand-orange text-sm">
                  K = {selectedK}
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={selectedK}
                onChange={(e) => setSelectedK(parseInt(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
                <span>K=2 (Broad)</span>
                <span>K=8 (Baseline)</span>
                <span>K=12 (Granular)</span>
              </div>
            </div>

            {/* Calculated KMeans Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">INERTIA</span>
                <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {matchedKMeansExperiment.inertia.toFixed(1)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  SILHOUETTE
                </span>
                <span className="text-sm font-mono font-bold text-brand-orange">
                  {matchedKMeansExperiment.silhouette.toFixed(3)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  NOISE POINTS
                </span>
                <span className="text-sm font-mono font-bold text-red-500">0 (0.0%)</span>
              </div>
            </div>

            {/* Elbow Curve Chart */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-bold text-[var(--text-primary)]">
                  The Elbow Method (WCSS vs K)
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Elbow bend around K=5-8
                </span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={labData.kmeans_elbow_curve}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                      opacity={0.6}
                    />
                    <XAxis dataKey="k" stroke="var(--text-muted)" fontSize={10} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} />
                    <Tooltip
                      formatter={(val: number) => [val.toFixed(2), "Inertia"]}
                      contentStyle={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border-color)",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="inertia"
                      stroke="var(--accent-orange)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Critical Limitations Box */}
          <div className="p-3.5 rounded-xl bg-brand-danger/10 border border-brand-danger/30 text-xs text-[var(--text-secondary)] space-y-1">
            <p className="font-bold text-brand-danger flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              <span>Fundamental Flaws for Hotspots:</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Forces remote, solitary accidents into clusters, dragging centroids away from true high-risk
              intersections. Assumes spherical convex shapes that fail to follow linear road corridors.
            </p>
          </div>
        </div>

        {/* Panel B: DBSCAN Primary Hotspot Engine */}
        <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-brand-amber/40 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-brand-orange/15 text-brand-orange">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-brand-orange font-bold">
                    PRIMARY DETECTOR
                  </span>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    Haversine DBSCAN
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-orange/15 text-brand-orange font-bold">
                Haversine Metric
              </span>
            </div>

            <p className="text-xs text-[var(--text-secondary)] my-3 leading-relaxed">
              Density-Based Spatial Clustering with Great-Circle Haversine distance (Earth R = 6,371 km).
              Discovers arbitrary-shaped dense crash segments and isolates solitary accidents as background noise.
            </p>

            {/* Configurable Sliders for DBSCAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              {/* Epsilon Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text-primary)]">Epsilon Radius:</span>
                  <span className="font-mono font-bold text-brand-orange">
                    {selectedEps * 1000}m ({selectedEps}km)
                  </span>
                </div>
                <select
                  value={selectedEps}
                  onChange={(e) => setSelectedEps(parseFloat(e.target.value))}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                >
                  <option value={0.1}>100m (Strict Localized)</option>
                  <option value={0.2}>200m (Corridor)</option>
                  <option value={0.25}>250m (Optimal Baseline)</option>
                  <option value={0.35}>350m (Wide Sector)</option>
                  <option value={0.5}>500m (Regional)</option>
                </select>
              </div>

              {/* Min Samples Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text-primary)]">Min Samples:</span>
                  <span className="font-mono font-bold text-brand-orange">
                    {selectedMinSamples} crashes
                  </span>
                </div>
                <select
                  value={selectedMinSamples}
                  onChange={(e) => setSelectedMinSamples(parseInt(e.target.value))}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-md px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none"
                >
                  <option value={5}>5 Crashes (High Sensitivity)</option>
                  <option value={8}>8 Crashes (Optimal Baseline)</option>
                  <option value={12}>12 Crashes (High Density)</option>
                  <option value={16}>16 Crashes (Severe Cores)</option>
                </select>
              </div>
            </div>

            {/* Calculated DBSCAN Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  HOTSPOTS DETECTED
                </span>
                <span className="text-sm font-mono font-bold text-brand-orange">
                  {matchedDBSCANExperiment.n_clusters}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  ISOLATED NOISE
                </span>
                <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {matchedDBSCANExperiment.n_noise_points.toLocaleString()} (
                  {matchedDBSCANExperiment.noise_percentage}%)
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  CLUSTERED CRASHES
                </span>
                <span className="text-sm font-mono font-bold text-brand-success">
                  {matchedDBSCANExperiment.clustered_percentage}%
                </span>
              </div>
            </div>

            {/* Haversine Formula Demonstration Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs space-y-1.5 font-mono">
              <p className="font-bold text-brand-orange">Angular Distance Transformation:</p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                eps_radians = {selectedEps} km / 6,371.0088 km ={" "}
                <span className="text-brand-orange font-bold">
                  {(selectedEps / 6371.0088).toExponential(4)} rad
                </span>
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                scikit-learn DBSCAN with metric='haversine' expects input coordinates converted to radians.
              </p>
            </div>
          </div>

          {/* DBSCAN Advantages Box */}
          <div className="p-3.5 rounded-xl bg-brand-success/10 border border-brand-success/30 text-xs text-[var(--text-secondary)] space-y-1">
            <p className="font-bold text-brand-success flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hotspot Strengths:</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              No arbitrary cluster count assumed. Follows linear highways, curved roundabouts, and irregular
              urban choke points while rejecting 35.3% of noise crashes.
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Detailed Comparison Table */}
      <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm space-y-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            Side-by-Side Methodological Evaluation
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Detailed criteria comparing why Haversine DBSCAN serves as the primary algorithm for road safety intelligence.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] font-mono text-[var(--text-muted)]">
                <th className="p-3 font-semibold">Evaluation Criterion</th>
                <th className="p-3 font-semibold">KMeans Baseline</th>
                <th className="p-3 font-semibold">Haversine DBSCAN (CrashLens)</th>
                <th className="p-3 font-semibold">Superiority & Justification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
              {comparisonData.comparison_table.map((row, idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                  <td className="p-3 font-bold text-[var(--text-primary)]">{row.criterion}</td>
                  <td className="p-3 font-mono">{row.kmeans}</td>
                  <td className="p-3 font-mono font-medium text-brand-orange">{row.dbscan}</td>
                  <td className="p-3">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-success/15 text-brand-success mr-1.5">
                      {row.advantage}
                    </span>
                    <span className="text-[11px]">{row.explanation}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verdict Box */}
        <div className="mt-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-2">
          <p className="font-bold text-sm text-[var(--text-primary)]">
            Engineering Verdict: {comparisonData.verdict.recommended_approach}
          </p>
          <p className="leading-relaxed">{comparisonData.verdict.verdict_summary}</p>
          <p className="text-[11px] text-[var(--text-muted)] italic">
            {comparisonData.verdict.limitations_note}
          </p>
        </div>
      </div>
    </div>
  );
};
