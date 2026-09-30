"""GitHub collector."""

from typing import List
from datetime import datetime
from backend.models import RawItem, SourceType
from backend.collectors.base_collector import BaseCollector


class GitHubCollector(BaseCollector):
    """Collector for GitHub trending repositories."""

    def __init__(self):
        super().__init__(SourceType.GITHUB, "GitHub")
        self.token = None  # Set via environment variable GITHUB_TOKEN
        self.languages = ["Python", "JavaScript", "TypeScript", "Rust", "Go"]

    async def collect(self) -> List[RawItem]:
        """Collect trending repositories from GitHub."""
        items = []
        try:
            for lang in self.languages:
                lang_items = await self._collect_language(lang)
                items.extend(lang_items)
        except Exception as e:
            print(f"Error collecting from GitHub: {e}")
        return items

    async def _collect_language(self, language: str) -> List[RawItem]:
        """Collect trending repositories for a specific language."""
        items = []
        try:
            import aiohttp
            headers = {"Accept": "application/vnd.github.v3+json"}
            if self.token:
                headers["Authorization"] = f"token {self.token}"

            async with aiohttp.ClientSession() as session:
                # Search for trending repositories (sorted by stars, created in last 30 days)
                url = (
                    f"https://api.github.com/search/repositories"
                    f"?q=language:{language}+created:>2024-01-01"
                    f"&sort=stars&order=desc&per_page=10"
                )
                async with session.get(url, headers=headers, timeout=15) as response:
                    if response.status == 200:
                        data = await response.json()
                        for repo in data.get("items", []):
                            item = self.normalize_item({
                                "id": str(repo["id"]),
                                "title": repo.get("full_name", ""),
                                "content": repo.get("description", ""),
                                "url": repo.get("html_url", ""),
                                "author": repo.get("owner", {}).get("login"),
                                "score": repo.get("stargazers_count", 0),
                                "created_utc": datetime.fromisoformat(
                                    repo.get("created_at", "").replace("Z", "+00:00")
                                ) if repo.get("created_at") else None
                            })
                            items.append(item)
        except Exception as e:
            print(f"Error collecting GitHub for {language}: {e}")
        return items

    async def validate(self) -> bool:
        """Validate GitHub collector configuration."""
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                headers = {"Accept": "application/vnd.github.v3+json"}
                if self.token:
                    headers["Authorization"] = f"token {self.token}"
                async with session.get("https://api.github.com/rate_limit", headers=headers, timeout=5) as response:
                    return response.status == 200
        except Exception:
            return False