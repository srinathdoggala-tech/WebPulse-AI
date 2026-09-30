"""Reddit collector."""

import asyncio
from typing import List, Dict, Any
from datetime import datetime
from backend.models import RawItem, SourceType
from backend.collectors.base_collector import BaseCollector


class RedditCollector(BaseCollector):
    """Collector for Reddit subreddits."""

    def __init__(self):
        super().__init__(SourceType.REDDIT, "Reddit")
        self.subreddits = ["technology", "programming", "MachineLearning", "artificial"]

    async def collect(self) -> List[RawItem]:
        """Collect items from Reddit."""
        items = []
        try:
            for subreddit in self.subreddits:
                subreddit_items = await self._collect_subreddit(subreddit)
                items.extend(subreddit_items)
        except Exception as e:
            print(f"Error collecting from Reddit: {e}")
        return items

    async def _collect_subreddit(self, subreddit: str) -> List[RawItem]:
        """Collect items from a specific subreddit."""
        items = []
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"https://www.reddit.com/r/{subreddit}/hot.json?limit=10",
                    headers={"User-Agent": "TrendRadar-AI/1.0"},
                    timeout=15
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        for child in data.get("data", {}).get("children", []):
                            post = child.get("data", {})
                            item = self.normalize_item({
                                "id": post.get("id", ""),
                                "title": post.get("title", ""),
                                "content": post.get("selftext", ""),
                                "url": f"https://www.reddit.com{post.get('permalink', '')}",
                                "author": post.get("author"),
                                "score": post.get("score", 0),
                                "created_utc": datetime.utcfromtimestamp(post.get("created_utc", 0)) if post.get("created_utc") else None
                            })
                            items.append(item)
        except Exception as e:
            print(f"Error collecting from Reddit r/{subreddit}: {e}")
        return items

    async def validate(self) -> bool:
        """Validate Reddit collector configuration."""
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://www.reddit.com/r/technology/hot.json?limit=1",
                    headers={"User-Agent": "TrendRadar-AI/1.0"},
                    timeout=5
                ) as response:
                    return response.status == 200
        except Exception:
            return False