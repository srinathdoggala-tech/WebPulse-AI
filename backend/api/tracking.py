"""Tracking API endpoints for historical comparisons."""

from fastapi import APIRouter
from typing import Dict, Any, List
from datetime import datetime, timedelta
import random

router = APIRouter()


@router.get("/topic/{topic}/history")
async def get_topic_history(topic: str, days: int = 30) -> Dict[str, Any]:
    """Get historical data for a specific topic."""
    history = []
    for i in range(days, 0, -1):
        date = datetime.now() - timedelta(days=i)
        history.append({
            "date": date.isoformat(),
            "volume": random.randint(0, 100),
            "sentiment": round(random.uniform(-0.5, 0.8), 2),
            "velocity": round(random.uniform(-0.5, 1.5), 2)
        })

    return {
        "topic": topic,
        "history": history,
        "summary": {
            "total_mentions": sum(h["volume"] for h in history),
            "avg_sentiment": round(sum(h["sentiment"] for h in history) / len(history), 2),
            "peak_volume": max(h["volume"] for h in history),
            "peak_date": max(history, key=lambda x: x["volume"])["date"]
        }
    }


@router.get("/comparison")
async def get_comparison(
    topics: str,  # comma-separated
    period: str = "7d"  # 1d, 7d, 30d
) -> Dict[str, Any]:
    """Compare multiple topics over time."""
    topic_list = topics.split(",")
    days = {"1d": 1, "7d": 7, "30d": 30}.get(period, 7)

    comparison = {}
    for topic in topic_list:
        comparison[topic.strip()] = _generate_topic_comparison(topic.strip(), days)

    return {
        "topics": topic_list,
        "period": period,
        "comparison": comparison
    }


@router.get("/new-topics")
async def get_new_topics(hours: int = 24) -> List[Dict[str, Any]]:
    """Get topics that appeared recently (new vs recurring)."""
    return [
        {
            "topic": topic,
            "first_seen": (datetime.now() - timedelta(hours=random.randint(1, hours))).isoformat(),
            "initial_volume": random.randint(1, 20),
            "source": random.choice(["hacker_news", "reddit", "github", "rss"]),
            "is_recurring": random.choice([True, False])
        }
        for topic in [
            "Quantum Computing Breakthrough", "New Rust Web Framework",
            "AI Video Generation", "Decentralized Identity",
            "Edge ML Optimization", "WebAssembly Components"
        ]
    ]


def _generate_topic_comparison(topic: str, days: int) -> List[Dict[str, Any]]:
    """Generate comparison data for a topic."""
    return [
        {
            "date": (datetime.now() - timedelta(days=i)).isoformat(),
            "volume": random.randint(0, 100)
        }
        for i in range(days, 0, -1)
    ]