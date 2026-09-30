"""Sources API endpoints."""

from fastapi import APIRouter
from typing import List, Dict, Any
from backend.models import SourceType

router = APIRouter()


@router.get("/")
async def list_sources() -> Dict[str, Any]:
    """List all available data sources."""
    return {
        "sources": [
            {
                "type": SourceType.HACKER_NEWS.value,
                "name": "Hacker News",
                "description": "Technology news and discussions",
                "enabled": True,
                "frequency_minutes": 5
            },
            {
                "type": SourceType.REDDIT.value,
                "name": "Reddit",
                "description": "Tech and programming subreddits",
                "enabled": True,
                "frequency_minutes": 10
            },
            {
                "type": SourceType.GITHUB.value,
                "name": "GitHub",
                "description": "Trending repositories and topics",
                "enabled": True,
                "frequency_minutes": 30
            },
            {
                "type": SourceType.JOBS.value,
                "name": "Job Boards",
                "description": "Tech job postings from various boards",
                "enabled": True,
                "frequency_minutes": 60
            },
            {
                "type": SourceType.RSS.value,
                "name": "RSS Feeds",
                "description": "Tech and AI news RSS feeds",
                "enabled": True,
                "frequency_minutes": 15
            }
        ]
    }


@router.get("/{source_type}")
async def get_source_config(source_type: SourceType) -> Dict[str, Any]:
    """Get configuration for a specific source."""
    configs = {
        SourceType.HACKER_NEWS: {
            "endpoints": ["top", "new", "ask", "show"],
            "update_frequency": 300,  # 5 minutes
            "max_items": 100
        },
        SourceType.REDDIT: {
            "subreddits": ["technology", "programming", "MachineLearning", "artificial"],
            "update_frequency": 600,  # 10 minutes
            "max_items": 50
        },
        SourceType.GITHUB: {
            "languages": ["Python", "JavaScript", "TypeScript", "Rust", "Go"],
            "update_frequency": 1800,  # 30 minutes
            "max_items": 30
        },
        SourceType.JOBS: {
            "boards": ["indeed", "linkedin", "stackoverflow", "angel.co"],
            "update_frequency": 3600,  # 1 hour
            "max_items": 100
        },
        SourceType.RSS: {
            "feeds": [
                "https://hnrss.org/frontpage",
                "https://feeds.feedburner.com/oreilly/radar",
                "https://techcrunch.com/feed/"
            ],
            "update_frequency": 900,  # 15 minutes
            "max_items": 50
        }
    }
    return configs.get(source_type, {})


@router.post("/{source_type}/toggle")
async def toggle_source(source_type: SourceType) -> Dict[str, Any]:
    """Enable or disable a data source."""
    return {
        "source_type": source_type.value,
        "enabled": True,  # TODO: actually toggle
        "message": f"{source_type.value} source toggled"
    }