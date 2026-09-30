"""Job board collector."""

from typing import List
from datetime import datetime
from backend.models import RawItem, SourceType
from backend.collectors.base_collector import BaseCollector


class JobsCollector(BaseCollector):
    """Collector for job postings from various job boards."""

    def __init__(self):
        super().__init__(SourceType.JOBS, "Job Boards")
        self.boards = ["indeed", "linkedin", "stackoverflow"]
        self.search_terms = ["AI", "Machine Learning", "Software Engineer", "Data Scientist"]

    async def collect(self) -> List[RawItem]:
        """Collect job postings."""
        items = []
        try:
            for board in self.boards:
                board_items = await self._collect_board(board)
                items.extend(board_items)
        except Exception as e:
            print(f"Error collecting from Job Boards: {e}")
        return items

    async def _collect_board(self, board: str) -> List[RawItem]:
        """Collect job postings from a specific board."""
        items = []
        try:
            import aiohttp

            if board == "linkedin":
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        "https://api.linkedin-jobs.xyz/search?query=AI&remote=true",
                        timeout=15
                    ) as response:
                        if response.status == 200:
                            data = await response.json()
                            for job in data.get("jobs", [])[:10]:
                                item = self.normalize_item({
                                    "id": job.get("id", ""),
                                    "title": job.get("title", ""),
                                    "content": job.get("description", ""),
                                    "url": job.get("url", ""),
                                    "author": job.get("companyName"),
                                    "score": None,
                                    "created_utc": datetime.fromisoformat(
                                        job.get("datePosted", "").replace("Z", "+00:00")
                                    ) if job.get("datePosted") else None
                                })
                                items.append(item)

            elif board == "stackoverflow":
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        "https://api.stackexchange.com/2.3/jobs?order=desc&sort=activity&site=stackoverflow",
                        timeout=15
                    ) as response:
                        if response.status == 200:
                            data = await response.json()
                            for job in data.get("items", [])[:10]:
                                item = self.normalize_item({
                                    "id": str(job.get("job_id", "")),
                                    "title": job.get("title", ""),
                                    "content": job.get("body", ""),
                                    "url": job.get("link", ""),
                                    "author": job.get("company"),
                                    "score": None,
                                    "created_utc": datetime.fromisoformat(
                                        str(job.get("creation_date", ""))
                                    ) if job.get("creation_date") else None
                                })
                                items.append(item)

            elif board == "indeed":
                async with aiohttp.ClientSession() as session:
                    async with session.get(
                        "https://api.indeed.com/v2/jobs?publisher=api&q=AI&format=json",
                        timeout=15
                    ) as response:
                        if response.status == 200:
                            data = await response.json()
                            for job in data.get("results", [])[:10]:
                                item = self.normalize_item({
                                    "id": job.get("jobkey", ""),
                                    "title": job.get("jobtitle", ""),
                                    "content": job.get("snippet", ""),
                                    "url": job.get("url", ""),
                                    "author": job.get("company"),
                                    "score": None,
                                    "created_utc": datetime.fromisoformat(
                                        job.get("date", "").replace("Z", "+00:00")
                                    ) if job.get("date") else None
                                })
                                items.append(item)

        except Exception as e:
            print(f"Error collecting from {board}: {e}")

        return items

    async def validate(self) -> bool:
        """Validate job collector configuration."""
        return True