"""Factory for creating collectors for different data sources."""

from typing import Dict, Any
from backend.models import SourceType

# Lazy imports to avoid loading all collectors at startup
_collectors = {}


async def get_all_sources() -> Dict[str, Any]:
    """Get all configured source collectors."""
    if not _collectors:
        # Lazy load collectors
        from backend.collectors.hn_collector import HackerNewsCollector
        from backend.collectors.reddit_collector import RedditCollector
        from backend.collectors.github_collector import GitHubCollector
        from backend.collectors.jobs_collector import JobsCollector
        from backend.collectors.rss_collector import RSSCollector

        _collectors[SourceType.HACKER_NEWS.value] = HackerNewsCollector()
        _collectors[SourceType.REDDIT.value] = RedditCollector()
        _collectors[SourceType.GITHUB.value] = GitHubCollector()
        _collectors[SourceType.JOBS.value] = JobsCollector()
        _collectors[SourceType.RSS.value] = RSSCollector()

    return _collectors


def get_collector(source_type: SourceType):
    """Get a specific collector by source type."""
    return _collectors.get(source_type.value)


class CollectorFactory:
    """Factory class for creating collectors."""

    @staticmethod
    async def create(source_type: SourceType):
        """Create a collector for a given source type."""
        creators = {
            SourceType.HACKER_NEWS: lambda: __import__(
                "backend.collectors.hn_collector", fromlist=["HackerNewsCollector"]
            ).HackerNewsCollector(),
            SourceType.REDDIT: lambda: __import__(
                "backend.collectors.reddit_collector", fromlist=["RedditCollector"]
            ).RedditCollector(),
            SourceType.GITHUB: lambda: __import__(
                "backend.collectors.github_collector", fromlist=["GitHubCollector"]
            ).GitHubCollector(),
            SourceType.JOBS: lambda: __import__(
                "backend.collectors.jobs_collector", fromlist=["JobsCollector"]
            ).JobsCollector(),
            SourceType.RSS: lambda: __import__(
                "backend.collectors.rss_collector", fromlist=["RSSCollector"]
            ).RSSCollector(),
        }
        return creators[source_type]()