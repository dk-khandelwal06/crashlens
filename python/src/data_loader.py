"""
Data acquisition and schema validation module for UK STATS19 Road Safety Open Data.
Source: UK Department for Transport (DfT) STATS19 Road Casualty Statistics.
Official Portal: https://www.gov.uk/government/statistical-data-sets/road-safety-open-data
"""

import os
import urllib.request
from pathlib import Path
from typing import Optional
import pandas as pd

DFT_STATS19_URL_2022 = (
    "https://data.dft.gov.uk/road-accidents-safety-data/"
    "dft-road-casualty-statistics-collision-2022.csv"
)

RAW_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "raw"
PROCESSED_DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "processed"


def ensure_directories():
    """Ensure data directories exist."""
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)


def download_stats19_dataset(
    url: str = DFT_STATS19_URL_2022,
    target_filename: str = "dft-road-casualty-statistics-collision-2022.csv",
    force_download: bool = False,
) -> Path:
    """
    Downloads official DfT STATS19 collision CSV dataset into data/raw/.
    If the file already exists and force_download is False, skips download.
    """
    ensure_directories()
    dest_path = RAW_DATA_DIR / target_filename

    if dest_path.exists() and not force_download:
        print(f"[DataLoader] Using existing raw dataset at: {dest_path}")
        return dest_path

    print(f"[DataLoader] Fetching STATS19 collision dataset from: {url}")
    headers = {"User-Agent": "CrashLens-Research-Bot/1.0 (Public Safety Analytics)"}
    req = urllib.request.Request(url, headers=headers)

    with urllib.request.urlopen(req, timeout=60) as response, open(dest_path, "wb") as out_file:
        chunk_size = 64 * 1024
        total_bytes = 0
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            total_bytes += len(chunk)
            if total_bytes % (1024 * 1024 * 5) == 0:
                print(f"[DataLoader] Downloaded {total_bytes // (1024 * 1024)} MB...")

    print(f"[DataLoader] Successfully saved {total_bytes} bytes to {dest_path}")
    return dest_path


def load_raw_dataset(file_path: Optional[Path] = None) -> pd.DataFrame:
    """Loads STATS19 collision dataset from raw folder."""
    if file_path is None:
        file_path = RAW_DATA_DIR / "dft-road-casualty-statistics-collision-2022.csv"

    if not file_path.exists():
        raise FileNotFoundError(
            f"Raw dataset not found at {file_path}. Please run download_stats19_dataset() first."
        )

    print(f"[DataLoader] Reading CSV from {file_path}...")
    df = pd.read_csv(file_path, low_memory=False)
    print(f"[DataLoader] Loaded {len(df):,} records with columns: {list(df.columns[:8])}...")
    return df

