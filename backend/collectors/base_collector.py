"""Base collector class."""

from abc import ABC, abstractmethod
from backend.models import RawItem, SourceType
from typing import List, Dict, Any


class BaseCollector(ABC):
    """Abstract base class for all data collectors."""

    def __init__(self, source_type: SourceType, source_name: str):
        self.source_type = source_type
        self.source_name = source_name

    @abstractmethod
    async def collect(self) -> List[RawItem]:
        """Collect items from the source."""
        pass

    @abstractmethod
    async def validate(self) -> bool:
        """Validate collector configuration."""
        pass

    def normalize_item(self, raw: Dict[str, Any]) -> RawItem:
        """Normalize raw data to RawItem."""
        return RawItem(
            id=raw.get("id", f"{self.source_type.value}_{hash(raw.get('title', ''))}"),
            source_type=self.source_type,
            source_name=self.source_name,
            title=raw.get("title", ""),
            content=raw.get("content", ""),
            url=raw.get("url", ""),
            author=raw.get("author"),
            score=raw.get("score"),
            created_utc=raw.get("created_utc"),
            raw_data=raw
        )