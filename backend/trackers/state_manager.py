"""State manager for maintaining current application state."""

from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio


class StateManager:
    """Manage current application state."""

    def __init__(self):
        self.state: Dict[str, Any] = {
            "last_updated": datetime.now(),
            "total_items_processed": 0,
            "active_sources": set(),
            "trending_topics": {},
            "collection_stats": {
                "last_run": None,
                "errors": [],
                "items_by_source": {}
            }
        }
        self._lock = asyncio.Lock()

    async def update_items_processed(self, count: int):
        """Update the count of processed items."""
        async with self._lock:
            self.state["total_items_processed"] += count
            self.state["last_updated"] = datetime.now()

    async def set_active_sources(self, sources: List[str]):
        """Set currently active sources."""
        async with self._lock:
            self.state["active_sources"] = set(sources)
            self.state["last_updated"] = datetime.now()

    async def update_trending_topics(self, topics: Dict[str, Dict[str, Any]]):
        """Update trending topics."""
        async with self._lock:
            self.state["trending_topics"] = topics
            self.state["last_updated"] = datetime.now()

    async def update_collection_stats(self, stats: Dict[str, Any]):
        """Update collection statistics."""
        async with self._lock:
            self.state["collection_stats"] = {
                **self.state["collection_stats"],
                **stats,
                "last_run": datetime.now().isoformat()
            }
            self.state["last_updated"] = datetime.now()

    async def get_state(self) -> Dict[str, Any]:
        """Get current state."""
        async with self._lock:
            return {
                **self.state,
                "active_sources": list(self.state["active_sources"]),
                "last_updated": self.state["last_updated"].isoformat()
            }

    async def reset(self):
        """Reset state to initial values."""
        async with self._lock:
            self.state = {
                "last_updated": datetime.now(),
                "total_items_processed": 0,
                "active_sources": set(),
                "trending_topics": {},
                "collection_stats": {
                    "last_run": None,
                    "errors": [],
                    "items_by_source": {}
                }
            }