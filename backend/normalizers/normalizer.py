"""Data normalizer for cleaning and standardizing collected items."""

from typing import List
from datetime import datetime
from backend.models import RawItem, NormalizedItem, SourceType, ItemCategory


class DataNormalizer:
    """Normalize raw items into consistent format."""

    def __init__(self):
        self.deduplication_cache = set()
        self.source_tagging = {
            SourceType.HACKER_NEWS: "tech_news",
            SourceType.REDDIT: "community",
            SourceType.GITHUB: "open_source",
            SourceType.JOBS: "jobs",
            SourceType.RSS: "news"
        }

    async def normalize(self, raw_items: List[RawItem]) -> List[NormalizedItem]:
        """Normalize a list of raw items."""
        normalized = []
        for raw in raw_items:
            # Deduplication
            if self._is_duplicate(raw):
                continue

            # Source tagging
            tag = self.source_tagging.get(raw.source_type, "general")

            # Category classification
            categories = self._classify_categories(raw)

            normalized_item = NormalizedItem(
                id=raw.id,
                source_type=raw.source_type,
                source_name=raw.source_name,
                title=self._clean_text(raw.title),
                content=self._clean_text(raw.content),
                url=raw.url,
                author=raw.author,
                score=raw.score,
                created_utc=raw.created_utc or datetime.now(),
                timestamp=datetime.now(),
                tags=[tag],
                categories=categories
            )
            normalized.append(normalized_item)

        return normalized

    def _is_duplicate(self, item: RawItem) -> bool:
        """Check if item is a duplicate."""
        content_hash = hash(item.title.lower().strip())
        if content_hash in self.deduplication_cache:
            return True
        self.deduplication_cache.add(content_hash)
        return False

    def _clean_text(self, text: str) -> str:
        """Clean and normalize text."""
        if not text:
            return ""
        # Remove extra whitespace
        text = " ".join(text.split())
        return text.strip()

    def _classify_categories(self, item: RawItem) -> List[ItemCategory]:
        """Classify item into categories based on content."""
        categories = []
        text = (item.title + " " + item.content).lower()

        if any(keyword in text for keyword in ["ai", "machine learning", "llm", "artificial intelligence"]):
            categories.append(ItemCategory.TECHNOLOGY)
        if any(keyword in text for keyword in ["job", "hiring", "salary", "remote"]):
            categories.append(ItemCategory.JOBS)
        if any(keyword in text for keyword in ["research", "paper", "arxiv", "scientific"]):
            categories.append(ItemCategory.SCIENCE)
        if any(keyword in text for keyword in ["design", "ux", "ui"]):
            categories.append(ItemCategory.DESIGN)
        if any(keyword in text for keyword in ["product", "launch", "startup"]):
            categories.append(ItemCategory.PRODUCT)
        if any(keyword in text for keyword in ["open source", "github", "repository"]):
            categories.append(ItemCategory.TECHNOLOGY)

        if not categories:
            categories.append(ItemCategory.GENERAL)

        return categories