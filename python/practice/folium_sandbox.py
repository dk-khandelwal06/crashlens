"""
CrashLens Sandbox: Folium Interactive Map Generator.
Generates a standalone HTML map file from real detected hotspots for desktop GIS verification.
"""

import sys
from pathlib import Path
import json

SRC_DIR = Path(__file__).resolve().parent.parent / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

PUBLIC_DATA = Path(__file__).resolve().parent.parent.parent / "public" / "data"


def generate_folium_map():
    try:
        import folium
        from folium.plugins import MarkerCluster
    except ImportError:
        print("[Folium Sandbox] folium is not installed. Run `pip install folium` if desired.")
        return

    hotspots_file = PUBLIC_DATA / "hotspots.json"
    if not hotspots_file.exists():
        print(f"[Folium Sandbox] {hotspots_file} not found. Run pipeline first.")
        return

    with open(hotspots_file, "r", encoding="utf-8") as f:
        hotspots = json.load(f)

    # London center
    m = folium.Map(location=[51.5074, -0.1278], zoom_start=11, tiles="CartoDB positron")

    for h in hotspots[:50]:  # Top 50 hotspots
        color = "red" if h["risk_tier"] == "Critical" else "orange" if h["risk_tier"] == "High" else "blue"
        folium.CircleMarker(
            location=[h["centroid"]["latitude"], h["centroid"]["longitude"]],
            radius=min(max(h["collision_count"] // 2, 6), 25),
            popup=f"<b>{h['name']}</b><br>Rank: #{h['rank']}<br>Crashes: {h['collision_count']}<br>Score: {h['severity_score']}",
            color=color,
            fill=True,
            fill_color=color,
            fill_opacity=0.6,
        ).add_to(m)

    output_html = Path(__file__).parent / "london_hotspots_map.html"
    m.save(str(output_html))
    print(f"[Folium Sandbox] Generated interactive map at: {output_html}")


if __name__ == "__main__":
    generate_folium_map()
