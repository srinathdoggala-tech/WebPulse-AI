"""Dashboard API endpoints."""

from fastapi import APIRouter
from typing import Dict, Any, List
from datetime import datetime, timedelta
import random

router = APIRouter()


@router.get("/summary")
async def get_dashboard_summary() -> Dict[str, Any]:
    """Get dashboard summary statistics."""
    return {
        "total_trends": 127,
        "active_sources": 5,
        "total_items_collected": 2340,
        "avg_sentiment": 0.42,
        "rising_topics_count": 23,
        "categories_distribution": {
            "technology": 45,
            "business": 22,
            "science": 18,
            "design": 15,
            "product": 12,
            "jobs": 8,
            "community": 10,
            "general": 37
        },
        "last_update": datetime.now().isoformat()
    }


@router.get("/trends/by-category/{category}")
async def get_trends_by_category(category: str) -> List[Dict[str, Any]]:
    """Get trends grouped by category."""
    return [
        {
            "category": category,
            "trends": _generate_category_trends(category)
        }
        for category in ["technology", "business", "science", "design", "product"]
    ]


@router.get("/trends/timeline")
async def get_trends_timeline(hours: int = 24) -> List[Dict[str, Any]]:
    """Get trend timeline data."""
    timeline = []
    for i in range(hours, 0, -1):
        timeline.append({
            "timestamp": (datetime.now() - timedelta(hours=i)).isoformat(),
            "total_volume": random.randint(50, 200),
            "unique_topics": random.randint(5, 25),
            "sentiment": round(random.uniform(-0.2, 0.6), 2)
        })
    return timeline


def _generate_category_trends(category: str) -> List[Dict[str, Any]]:
    """Generate mock trends for a category."""
    categories = {
        "technology": ["AI", "Cloud Computing", "Cybersecurity", "AR/VR"],
        "business": ["Productivity", "Automation", "Remote Work", "E-commerce"],
        "science": ["Research", "Innovation", "Discovery", "Experiments"],
        "design": ["UX", "UI", "Design Systems", "Prototypes"],
        "product": ["Launch", "Features", "User Experience", "Market Fit"]
    }
    topics = categories.get(category, [])
    return [
        {
            "topic": topic,
            "volume": random.randint(30, 150),
            "velocity": round(random.uniform(0.1, 2.0), 2),
            "sentiment": round(random.uniform(-0.3, 0.7), 2)
        }
        for topic in topics
    ]