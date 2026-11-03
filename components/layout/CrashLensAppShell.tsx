"use client";

import React, { useState } from "react";
import {
  SummaryData,
  Hotspot,
  CrashPoint,
  AnalyticsData,
  LabExperiments,
  MethodologyComparison,
  TransparencyData,
  NavSection,
} from "@/src/types";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingHero } from "@/components/dashboard/LandingHero";
import { IntelligenceDashboard } from "@/components/dashboard/IntelligenceDashboard";
import { HotspotExplorer } from "@/components/maps/HotspotExplorer";
import { ClusteringLaboratory } from "@/components/clustering/ClusteringLaboratory";
import { SeverityIntelligence } from "@/components/analytics/SeverityIntelligence";
import { TemporalAnalytics } from "@/components/analytics/TemporalAnalytics";
import { RoadSafetyInsights } from "@/components/analytics/RoadSafetyInsights";
import { MethodologySection } from "@/components/clustering/MethodologySection";
import { DataTransparency } from "@/components/dashboard/DataTransparency";
import { AboutCrashLens } from "@/components/dashboard/AboutCrashLens";

interface CrashLensAppShellProps {
  summary: SummaryData;
  hotspots: Hotspot[];
  crashPoints: CrashPoint[];
  analytics: AnalyticsData;
  labExperiments: LabExperiments;
  comparison: MethodologyComparison;
  transparency: TransparencyData;
}

export const CrashLensAppShell: React.FC<CrashLensAppShellProps> = ({
  summary,
  hotspots,
  crashPoints,
  analytics,
  labExperiments,
  comparison,
  transparency,
}) => {
  const [activeSection, setActiveSection] = useState<NavSection>("overview");

  const handleNavigateToMap = (hotspot: Hotspot) => {
    setActiveSection("explorer");
    // Scroll to top of explorer view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {activeSection === "overview" && (
          <div className="space-y-12">
            <LandingHero summary={summary} onNavigate={setActiveSection} />
            <IntelligenceDashboard summary={summary} analytics={analytics} />
            <HotspotExplorer hotspots={hotspots} crashPoints={crashPoints} />
          </div>
        )}

        {activeSection === "dashboard" && (
          <IntelligenceDashboard summary={summary} analytics={analytics} />
        )}

        {activeSection === "explorer" && (
          <HotspotExplorer hotspots={hotspots} crashPoints={crashPoints} />
        )}

        {activeSection === "laboratory" && (
          <ClusteringLaboratory
            labData={labExperiments}
            comparisonData={comparison}
            dbscanSummary={summary.dbscan}
            kmeansSummary={summary.kmeans}
          />
        )}

        {activeSection === "severity" && (
          <SeverityIntelligence hotspots={hotspots} onNavigateToMap={handleNavigateToMap} />
        )}

        {activeSection === "temporal" && <TemporalAnalytics analytics={analytics} />}

        {activeSection === "insights" && <RoadSafetyInsights analytics={analytics} />}

        {activeSection === "methodology" && <MethodologySection />}

        {activeSection === "transparency" && <DataTransparency transparency={transparency} />}

        {activeSection === "about" && <AboutCrashLens />}
      </main>

      <Footer onNavigate={setActiveSection} />
    </div>
  );
};

