import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/src/context/ThemeContext";

export const metadata: Metadata = {
  title: "CrashLens — Geospatial Road Accident Hotspot Detection",
  description:
    "Finding where accidents cluster, not just where they happen. Unsupervised machine learning (Haversine DBSCAN & KMeans) and geospatial intelligence platform.",
  keywords: [
    "road safety",
    "accident hotspots",
    "DBSCAN",
    "KMeans",
    "machine learning",
    "geospatial analytics",
    "STATS19",
    "London collisions",
  ],
  authors: [{ name: "CrashLens Research Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

