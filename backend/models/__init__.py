"""Data models for TrendRadar-AI."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from enum import Enum


class SourceType(str, Enum):
    """Supported data source types."""
    HACKER_NEWS = "hacker_news"
    REDDIT = "reddit"
    GITHUB = "github"
    JOBS = "jobs"
    RSS = "rss"
    YOUTUBE = "youtube"
    LINKEDIN = "linkedin"
    PRODUCTHUNT = "producthunt"


class ItemCategory(str, Enum):
    """Categories for classified items."""
    TECHNOLOGY = "technology"
    BUSINESS = "business"
    SCIENCE = "science"
    DESIGN = "design"
    PRODUCT = "product"
    JOBS = "jobs"
    COMMUNITY = "community"
    GENERAL = "general"


@dataclass
class RawItem:
    """Raw item collected from a source before normalization."""
    id: str
    source_type: SourceType
    source_name: str
    title: str
    content: str
    url: str
    author: Optional[str] = None
    score: Optional[int] = None
    created_utc: Optional[datetime] = None
    raw_data: dict = field(default_factory=dict)


@dataclass
class NormalizedItem:
    """Normalized item after processing."""
    id: str
    source_type: SourceType
    source_name: str
    title: str
    content: str
    url: str
    author: Optional[str]
    score: Optional[int]
    created_utc: datetime
    timestamp: datetime
    tags: list[str] = field(default_factory=list)
    categories: list[ItemCategory] = field(default_factory=list)


@dataclass
class AnalyzedItem:
    """Item after AI analysis."""
    item: NormalizedItem
    topics: list[str]
    sentiment_score: float  # -1.0 to 1.0
    sentiment_label: str  # "positive", "neutral", "negative"
    summary: str
    category_scores: dict[str, float]
    trend_score: float  # 0 to 1


@dataclass
class TrendPoint:
    """A single trend data point at a point in time."""
    topic: str
    timestamp: datetime
    velocity: float  # change rate
    volume: int  # mentions count
    sentiment_score: float
    category: str
    sources: list[str]