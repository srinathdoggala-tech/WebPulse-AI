"""Trends API endpoints."""

from fastapi import APIRouter, Query
from typing import Optional
from datetime import datetime, timedelta
import random

from backend.models import ItemCategory, AnalyzedItem

router = APIRouter()


@router.get("/")
async def get_trends(
    category: Optional[ItemCategory] = None,
    limit: int = Query(20, ge=1, le=100),
    hours: int = Query(24, ge=1, le=168)
):
    """Get trending topics."""
    # TODO: Replace with actual data from storage/analysis
    return _generate_mock_trends(category, limit, hours)


@router.get("/rising")
async def get_rising_trends(
    limit: int = Query(20, ge=1, le=100),
    hours: int = Query(24, ge=1, le=168)
):
    """Get rising topics (fastest growing)."""
    trends = _generate_mock_trends(None, limit, hours)
    # Sort by velocity
    trends.sort(key=lambda x: x.get("velocity", 0), reverse=True)
    return trends[:limit]


@router.get("/topics/{topic}")
async def get_topic_details(topic: str):
    """Get detailed analysis for a specific topic."""
    return {
        "topic": topic,
        "current_volume": random.randint(50, 500),
        "velocity": round(random.uniform(0.1, 5.0), 2),
        "sentiment": round(random.uniform(-0.5, 0.8), 2),
        "sources": ["hacker_news", "reddit", "github"],
        "related_topics": ["AI", "LLM", "Machine Learning"],
        "timeline": [
            {"timestamp": (datetime.now() - timedelta(hours=i)).isoformat(), "volume": random.randint(10, 100)}
            for i in range(24, 0, -1)
        ]
    }


def _generate_mock_trends(category: Optional[ItemCategory], limit: int, hours: int) -> list[dict]:
    """Generate mock trend data for development."""
    topics = [
        "Large Language Models", "Vector Databases", "RAG Architecture",
        "AI Agents", "Prompt Engineering", "Fine-tuning",
        "Multimodal AI", "AI Safety", "Open Source LLMs",
        "GPU Optimization", "Inference Optimization", "AI Coding Assistants",
        "Autonomous Agents", "Knowledge Graphs", "Semantic Search"
    ]

    results = []
    for i, topic in enumerate(topics[:limit]):
        if category and category.value not in topic.lower():
            continue
        results.append({
            "topic": topic,
            "category": category.value if category else "technology",
            "volume": random.randint(50, 500),
            "velocity": round(random.uniform(-0.5, 3.0), 2),
            "sentiment": round(random.uniform(-0.3, 0.8), 2),
            "trend_score": round(random.uniform(0.3, 1.0), 2),
            "sources": random.sample(["hacker_news", "reddit", "github", "rss", "youtube"], 3),
            "first_seen": (datetime.now() - timedelta(hours=random.randint(1, hours))).isoformat(),
            "last_seen": datetime.now().isoformat()
        })
    return results