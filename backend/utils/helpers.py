"""Helper functions for TrendRadar-AI."""

from typing import Any, Dict, List
from datetime import datetime, timedelta
import hashlib


def generate_id(data: str) -> str:
    """Generate a unique ID from data."""
    return hashlib.md5(data.encode()).hexdigest()[:12]


def parse_datetime(date_str: str) -> datetime:
    """Parse datetime string with multiple format support."""
    formats = [
        "%Y-%m-%dT%H:%M:%S",
        "%Y-%m-%dT%H:%M:%S.%f",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
        "%a, %d %b %Y %H:%M:%S %Z"
    ]

    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return datetime.now()


def filter_duplicates(items: List[Dict[str, Any]], key: str = "title") -> List[Dict[str, Any]]:
    """Filter duplicate items based on a key."""
    seen = set()
    filtered = []
    for item in items:
        value = item.get(key, "")
        if value and value not in seen:
            seen.add(value)
            filtered.append(item)
    return filtered


def batch_process(items: List[Any], batch_size: int) -> List[List[Any]]:
    """Split list into batches."""
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]


def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between old and new values."""
    if old_value == 0:
        return 100.0 if new_value > 0 else 0.0
    return ((new_value - old_value) / old_value) * 100