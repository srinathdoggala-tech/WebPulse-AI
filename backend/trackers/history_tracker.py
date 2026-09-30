"""History tracker for maintaining historical state."""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import json
import os


class HistoryTracker:
    """Track historical data for trends and comparisons."""

    def __init__(self, storage_path: str = "data/history.json"):
        self.storage_path = storage_path
        self.history: Dict[str, List[Dict[str, Any]]] = {}
        self._ensure_storage()

    def _ensure_storage(self):
        """Ensure storage directory exists."""
        os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
        if not os.path.exists(self.storage_path):
            self._save()

    def _load(self):
        """Load history from storage."""
        try:
            if os.path.exists(self.storage_path):
                with open(self.storage_path, "r") as f:
                    self.history = json.load(f)
        except Exception as e:
            print(f"Error loading history: {e}")
            self.history = {}

    def _save(self):
        """Save history to storage."""
        try:
            with open(self.storage_path, "w") as f:
                json.dump(self.history, f, default=str, indent=2)
        except Exception as e:
            print(f"Error saving history: {e}")

    async def record_trend(
        self,
        topic: str,
        volume: int,
        sentiment_score: float,
        sources: List[str],
        timestamp: Optional[datetime] = None
    ):
        """Record a trend point."""
        self._load()

        if topic not in self.history:
            self.history[topic] = []

        self.history[topic].append({
            "timestamp": (timestamp or datetime.now()).isoformat(),
            "volume": volume,
            "sentiment_score": sentiment_score,
            "sources": sources
        })

        self._save()

    async def get_topic_history(self, topic: str, days: int = 30) -> List[Dict[str, Any]]:
        """Get historical data for a topic."""
        self._load()

        if topic not in self.history:
            return []

        # Filter to requested days
        cutoff = datetime.now() - timedelta(days=days)
        history = [
            h for h in self.history[topic]
            if datetime.fromisoformat(h["timestamp"]) >= cutoff
        ]

        return history

    async def get_velocity(self, topic: str, hours: int = 24) -> float:
        """Calculate velocity for a topic."""
        history = await self.get_topic_history(topic, hours)

        if len(history) < 2:
            return 0.0

        # Sort by timestamp
        history.sort(key=lambda x: x["timestamp"])

        # Calculate rate of change
        first_volume = history[0].get("volume", 0)
        last_volume = history[-1].get("volume", 0)
        time_hours = hours

        if time_hours <= 0:
            return 0.0

        velocity = (last_volume - first_volume) / time_hours
        return velocity

    async def get_new_topics(self, hours: int = 24) -> List[Dict[str, Any]]:
        """Get topics that appeared recently."""
        self._load()

        cutoff = datetime.now() - timedelta(hours=hours)
        new_topics = []

        for topic, entries in self.history.items():
            if not entries:
                continue

            first_entry = min(entries, key=lambda x: x["timestamp"])
            first_time = datetime.fromisoformat(first_entry["timestamp"])

            if first_time >= cutoff:
                new_topics.append({
                    "topic": topic,
                    "first_seen": first_entry["timestamp"],
                    "initial_volume": first_entry.get("volume", 0),
                    "velocity": await self.get_velocity(topic)
                })

        return new_topics

    async def cleanup_old_history(self, days: int = 90):
        """Remove history older than specified days."""
        self._load()

        cutoff = datetime.now() - timedelta(days=days)

        for topic in list(self.history.keys()):
            self.history[topic] = [
                h for h in self.history[topic]
                if datetime.fromisoformat(h["timestamp"]) >= cutoff
            ]
            if not self.history[topic]:
                del self.history[topic]

        self._save()