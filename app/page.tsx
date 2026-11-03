import fs from "fs";
import path from "path";
import { CrashLensAppShell } from "@/components/layout/CrashLensAppShell";
import {
  SummaryData,
  Hotspot,
  CrashPoint,
  AnalyticsData,
  LabExperiments,
  MethodologyComparison,
  TransparencyData,
} from "@/src/types";

function loadDataFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "public", "data", filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Required data artifact not found: ${filePath}. Please execute 'python python/src/run_pipeline.py' first.`
    );
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as T;
}

export default function HomePage() {
  try {
    const summary = loadDataFile<SummaryData>("summary.json");
    const hotspots = loadDataFile<Hotspot[]>("hotspots.json");
    const analytics = loadDataFile<AnalyticsData>("analytics.json");
    const labExperiments = loadDataFile<LabExperiments>("lab_experiments.json");
    const comparison = loadDataFile<MethodologyComparison>("comparison.json");
    const transparency = loadDataFile<TransparencyData>("transparency.json");
    const crashPoints = loadDataFile<CrashPoint[]>("crashes_sample.json");

    return (
      <CrashLensAppShell
        summary={summary}
        hotspots={hotspots}
        crashPoints={crashPoints}
        analytics={analytics}
        labExperiments={labExperiments}
        comparison={comparison}
        transparency={transparency}
      />
    );
  } catch (error: any) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f1115] text-zinc-100">
        <div className="max-w-md w-full p-6 rounded-2xl bg-[#181b20] border border-red-500/30 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold">Data Pipeline Required</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {error?.message || "Could not load pre-processed ML clustering dataset artifacts."}
          </p>
          <div className="p-3 rounded-lg bg-black text-amber-400 font-mono text-xs text-left">
            python python/src/run_pipeline.py
          </div>
          <p className="text-[11px] text-zinc-500">
            Execute the command above to download DfT STATS19, calculate Haversine DBSCAN clusters,
            and export static production JSONs.
          </p>
        </div>
      </div>
    );
  }
}
