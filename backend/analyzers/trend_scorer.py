"""Trend scorer for calculating trend scores."""

from datetime import datetime, timedelta
from typing import List, Dict, Any
import re


class TrendScorer:
    """Calculate trend scores for topics."""

    def __init__(self):
        # Weights for different factors
        self.weights = {
            "volume": 0.3,
            "velocity": 0.3,
            "recency": 0.2,
            "sentiment": 0.1,
            "diversity": 0.1
        }

    async def score(
        self,
        topic: str,
        items: List[Dict[str, Any]],
        historical_volume: float = 0
    ) -> float:
        """Calculate trend score for a topic.

        Args:
            topic: Topic name
            items: List of items containing this topic
            historical_volume: Average volume in past 7 days

        Returns:
            Trend score between 0.0 and 1.0
        """
        if not items:
            return 0.0

        # Volume score (current vs historical)
        volume_score = self._calculate_volume_score(len(items), historical_volume)

        # Velocity score (rate of change)
        velocity_score = self._calculate_velocity_score(items)

        # Recency score (how recent the items are)
        recency_score = self._calculate_recency_score(items)

        # Sentiment score
        sentiment_score = self._calculate_sentiment_score(items)

        # Diversity score (variety of sources)
        diversity_score = self._calculate_diversity_score(items)

        # Weighted sum
        score = (
            self.weights["volume"] * volume_score +
            self.weights["velocity"] * velocity_score +
            self.weights["recency"] * recency_score +
            self.weights["sentiment"] * sentiment_score +
            self.weights["diversity"] * diversity_score
        )

        # Normalize to 0.0-1.0
        return min(max(score, 0.0), 1.0)

    def _calculate_volume_score(self, current_volume: int, historical_volume: float) -> float:
        """Calculate volume score based on current vs historical volume."""
        if historical_volume <= 0:
            # New topic
            return min(current_volume / 10.0, 1.0)
        ratio = current_volume / historical_volume
        # Cap at 3x historical volume
        return min(ratio / 3.0, 1.0)

    def _calculate_velocity_score(self, items: List[Dict[str, Any]]) -> float:
        """Calculate velocity score based on rate of item creation."""
        if len(items) < 2:
            return 0.0

        # Get timestamps
        timestamps = [
            item.get("timestamp") for item in items
            if item.get("timestamp")
        ]
        timestamps.sort()

        if len(timestamps) < 2:
            return 0.0

        # Items in last hour
        one_hour_ago = datetime.now() - timedelta(hours=1)
        recent_items = sum(1 for t in timestamps if t >= one_hour_ago)

        # Items in last 24 hours
        day_ago = datetime.now() - timedelta(hours=24)
        daily_items = sum(1 for t in timestamps if t >= day_ago)

        # Normalize
        hourly_rate = recent_items
        daily_rate = daily_items / 24.0

        # Higher hourly rate relative to daily means increasing trend
        if daily_rate <= 0:
            return 0.5

        ratio = hourly_rate / daily_rate
        return min(ratio / 2.0, 1.0)  # Cap at 2x daily rate

    def _calculate_recency_score(self, items: List[Dict[str, Any]]) -> float:
        """Calculate recency score based on how recent the items are."""
        if not items:
            return 0.0

        recent_count = 0
        for item in items:
            timestamp = item.get("timestamp")
            if timestamp:
                age = (datetime.now() - timestamp).total_seconds()
                # Items from last 30 minutes get full score
                if age < 30 * 60:
                    recent_count += 1

        return recent_count / len(items)

    def _calculate_sentiment_score(self, items: List[Dict[str, Any]]) -> float:
        """Calculate sentiment score from item sentiment scores."""
        scores = [
            item.get("sentiment_score", 0)
            for item in items
            if item.get("sentiment_score") is not None
        ]
        if not scores:
            return 0.5  # Neutral

        avg = sum(scores) / len(scores)
        # Convert -1 to 1 into 0 to 1
        return (avg + 1) / 2

    def _calculate_diversity_score(self, items: List[Dict[str, Any]]) -> float:
        """Calculate diversity score based on source variety."""
        sources = set(
            item.get("source_type")
            for item in items
            if item.get("source_type")
        )
        # More diverse sources = higher score
        # 4+ sources = full score
        return min(len(sources) / 4.0, 1.0)