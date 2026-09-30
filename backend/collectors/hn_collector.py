"""Hacker News collector."""

import asyncio
from typing import List, Dict, Any
from datetime import datetime
from backend.models import RawItem, SourceType, ItemCategory
from backend.collectors.base_collector import BaseCollector


class HackerNewsCollector(BaseCollector):
    """Collector for Hacker News."""

    def __init__(self):
        super().__init__(SourceType.HACKER_NEWS, "Hacker News")

    async def collect(self) -> List[RawItem]:
        """Collect items from Hacker News."""
        try:
            # Fetch Hacker News top stories
            items = []
            # Get top story IDs
            top_ids_response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self._fetch_url("https://hacker-news.firebaseio.com/v0/topstories.json")
            )
            if top_ids_response:
                top_ids = top_ids_response[:30]  # Limit to 30 stories
                for story_id in top_ids:
                    story_data = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda sid=story_id: self._fetch_url(
                            f"https://hacker-news.firebaseio.com/v0/item/{sid}.json"
                        )
                    )
                    if story_data:
                        item = self.normalize_item({
                            "id": str(story_id),
                            "title": story_data.get("title", ""),
                            "url": story_data.get("url", f"https://news.ycombinator.com/item?id={story_id}"),
                            "author": story_data.get("by"),
                            "score": story_data.get("score", 0),
                            "created_utc": datetime.utcfromtimestamp(story_data.get("time", 0)) if story_data.get("time") else None,
                            "content": story_data.get("text", "")
                        })
                        items.append(item)
            return items
        except Exception as e:
            print(f"Error collecting from Hacker News: {e}")
            return []

    @staticmethod
    async def _fetch_url(url: str) -> Dict[str, Any] | None:
        """Fetch URL and return JSON data."""
        import aiohttp
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=15) as response:
                if response.status == 200:
                    return await response.json()
                return None

    async def validate(self) -> bool:
        """Validate Hacker News collector configuration."""
        try:
            # Simple validation - check API connectivity
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get("https://hacker-news.firebaseio.com/v0/topstories.json", timeout=5) as response:
                    return response.status == 200
        except Exception:
            return False