"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Hotspot, CrashPoint } from "@/src/types";

interface LeafletMapInnerProps {
  hotspots: Hotspot[];
  crashPoints: CrashPoint[];
  selectedClusterId: number | null;
  onSelectCluster: (hotspot: Hotspot) => void;
  activeLayer: "dbscan" | "kmeans" | "points";
  showNoise: boolean;
  filterSeverity: string;
  filterTime: string;
}

// Controller to smoothly pan to selected hotspot
const MapCenterController: React.FC<{ selectedHotspot: Hotspot | null }> = ({
  selectedHotspot,
}) => {
  const map = useMap();
  useEffect(() => {
    if (selectedHotspot) {
      map.flyTo(
        [selectedHotspot.centroid.latitude, selectedHotspot.centroid.longitude],
        14,
        { duration: 1.2 }
      );
    }
  }, [selectedHotspot, map]);
  return null;
};

export const LeafletMapInner: React.FC<LeafletMapInnerProps> = ({
  hotspots,
  crashPoints,
  selectedClusterId,
  onSelectCluster,
  activeLayer,
  showNoise,
  filterSeverity,
  filterTime,
}) => {
  // Greater London center
  const defaultCenter: [number, number] = [51.5074, -0.1278];
  const defaultZoom = 11;

  const selectedHotspot =
    selectedClusterId !== null
      ? hotspots.find((h) => h.cluster_id === selectedClusterId) || null
      : null;

  // Filter crash points
  const filteredPoints = crashPoints.filter((pt) => {
    if (filterSeverity !== "all") {
      if (filterSeverity === "fatal" && pt.sev !== 1) return false;
      if (filterSeverity === "serious" && pt.sev !== 2) return false;
      if (filterSeverity === "slight" && pt.sev !== 3) return false;
    }
    if (filterTime !== "all") {
      if (filterTime === "morning" && (pt.hour < 7 || pt.hour > 9)) return false;
      if (filterTime === "evening" && (pt.hour < 16 || pt.hour > 19)) return false;
      if (filterTime === "night" && (pt.hour >= 6 && pt.hour < 20)) return false;
    }
    if (!showNoise && pt.db_cluster === -1) return false;
    return true;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Critical":
        return "#ef4444";
      case "High":
        return "#ea580c";
      case "Moderate":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };

  const getKMeansColor = (k: number) => {
    const palette = [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#10b981",
      "#06b6d4",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ];
    return palette[k % palette.length];
  };

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden border border-[var(--border-color)]">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: "550px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapCenterController selectedHotspot={selectedHotspot} />

        {/* 1. DBSCAN Hotspots Layer */}
        {activeLayer === "dbscan" &&
          hotspots.map((hotspot) => {
            const isSelected = selectedClusterId === hotspot.cluster_id;
            const color = getTierColor(hotspot.risk_tier);
            const radius = Math.min(Math.max(hotspot.collision_count / 30, 8), 35);

            return (
              <CircleMarker
                key={`hotspot-${hotspot.cluster_id}`}
                center={[hotspot.centroid.latitude, hotspot.centroid.longitude]}
                radius={isSelected ? radius + 6 : radius}
                pathOptions={{
                  color: isSelected ? "#ffffff" : color,
                  weight: isSelected ? 3 : 1.5,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.9 : 0.65,
                }}
                eventHandlers={{
                  click: () => onSelectCluster(hotspot),
                }}
              >
                <Popup>
                  <div className="p-1 text-xs font-sans text-zinc-900 leading-tight">
                    <p className="font-bold text-sm text-amber-700">{hotspot.name}</p>
                    <p className="font-semibold text-zinc-700">Rank: #{hotspot.rank}</p>
                    <hr className="my-1 border-zinc-200" />
                    <p>Total Collisions: <b>{hotspot.collision_count.toLocaleString()}</b></p>
                    <p className="text-red-600">Fatal: {hotspot.fatal_count}</p>
                    <p className="text-amber-600">Serious: {hotspot.serious_count}</p>
                    <p>Risk Score: <b>{hotspot.severity_score.toLocaleString()}</b></p>
                    <p className="text-[10px] text-zinc-500 mt-1">Click circle to view complete profile</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* 2. Individual Crash Points Layer */}
        {activeLayer === "points" &&
          filteredPoints.map((pt) => {
            const isNoise = pt.db_cluster === -1;
            const ptColor = isNoise
              ? "#71717a"
              : pt.sev === 1
              ? "#ef4444"
              : pt.sev === 2
              ? "#f59e0b"
              : "#10b981";

            return (
              <CircleMarker
                key={`point-${pt.id}`}
                center={[pt.lat, pt.lon]}
                radius={isNoise ? 3 : pt.sev === 1 ? 5.5 : 4}
                pathOptions={{
                  color: isNoise ? "#52525b" : ptColor,
                  weight: 1,
                  fillColor: ptColor,
                  fillOpacity: isNoise ? 0.4 : 0.75,
                }}
              >
                <Popup>
                  <div className="p-1 text-xs text-zinc-900">
                    <p className="font-bold">{pt.id}</p>
                    <p>Severity: <b className={pt.sev === 1 ? "text-red-600" : pt.sev === 2 ? "text-amber-600" : "text-emerald-600"}>{pt.sev_label}</b></p>
                    <p>Road: {pt.road}</p>
                    <p>Time: {pt.hour}:00</p>
                    <p>Status: {isNoise ? "Noise (Unclustered)" : `Assigned Cluster #${pt.db_cluster}`}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* 3. KMeans Baseline Clusters Layer */}
        {activeLayer === "kmeans" &&
          filteredPoints.map((pt) => {
            const kmColor = getKMeansColor(pt.km_cluster);
            return (
              <CircleMarker
                key={`km-point-${pt.id}`}
                center={[pt.lat, pt.lon]}
                radius={3.5}
                pathOptions={{
                  color: kmColor,
                  weight: 1,
                  fillColor: kmColor,
                  fillOpacity: 0.65,
                }}
              >
                <Popup>
                  <div className="p-1 text-xs text-zinc-900">
                    <p className="font-bold">KMeans Partition #{pt.km_cluster + 1}</p>
                    <p>Severity: {pt.sev_label}</p>
                    <p>Centroid-based Voronoi allocation</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
};
