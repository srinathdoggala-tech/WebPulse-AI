"""RSS feed collector."""

from typing import List
from datetime import datetime
from backend.models import RawItem, SourceType
from backend.collectors.base_collector import BaseCollector


class RSSCollector(BaseCollector):
    """Collector for RSS feeds."""

    def __init__(self):
        super().__init__(SourceType.RSS, "RSS Feeds")
        self.feeds = [
            "https://hnrss.org/frontpage",
            "https://feeds.feedburner.com/oreilly/radar",
            "https://techcrunch.com/feed/",
            "https://feeds.arxiv.org/new/recent/cs.AI",
            "https://feeds.arxiv.org/new/recent/cs.CL",
        ]

    async def collect(self) -> List[RawItem]:
        """Collect items from RSS feeds."""
        items = []
        try:
            for feed_url in self.feeds:
                feed_items = await self._collect_feed(feed_url)
                items.extend(feed_items)
        except Exception as e:
            print(f"Error collecting from RSS feeds: {e}")
        return items

    async def _collect_feed(self, feed_url: str) -> List[RawItem]:
        """Collect items from a specific RSS feed."""
        items = []
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(feed_url, timeout=15) as response:
                    if response.status == 200:
                        xml_data = await response.text()
                        items = self._parse_feed(xml_data, feed_url)
        except Exception as e:
            print(f"Error collecting RSS feed {feed_url}: {e}")
        return items

    def _parse_feed(self, xml_data: str, feed_url: str) -> List[RawItem]:
        """Parse RSS feed XML data."""
        items = []
        try:
            from xml.etree import ElementTree as ET
            root = ET.fromstring(xml_data)

            # Try to find items in different feed formats
            for item_elem in root.iter("item"):
                title_elem = item_elem.find("title")
                link_elem = item_elem.find("link")
                desc_elem = item_elem.find("description")
                author_elem = item_elem.find("author")
                pubdate_elem = item_elem.find("pubDate")

                if title_elem is not None and link_elem is not None:
                    title = title_elem.text or ""
                    link = link_elem.text or ""
                    content = desc_elem.text if desc_elem is not None else ""
                    author = author_elem.text if author_elem is not None else None
                    pubdate = pubdate_elem.text if pubdate_elem is not None else None

                    # Parse date
                    created_utc = None
                    if pubdate:
                        try:
                            from email.utils import parsedate_to_datetime
                            created_utc = parsedate_to_datetime(pubdate)
                        except Exception:
                            pass

                    item = self.normalize_item({
                        "id": link,
                        "title": title,
                        "content": content,
                        "url": link,
                        "author": author,
                        "score": None,
                        "created_utc": created_utc
                    })
                    items.append(item)

            # Also try Atom format
            for entry_elem in root.iter("{http://www.w3.org/2005/Atom}entry"):
                title_elem = entry_elem.find("{http://www.w3.org/2005/Atom}title")
                link_elem = entry_elem.find("{http://www.w3.org/2005/Atom}link")
                summary_elem = entry_elem.find("{http://www.w3.org/2005/Atom}summary")
                published_elem = entry_elem.find("{http://www.w3.org/2005/Atom}published")

                if title_elem is not None and link_elem is not None:
                    title = title_elem.text or ""
                    link = link_elem.get("href", "")
                    content = summary_elem.text if summary_elem is not None else ""
                    published = published_elem.text if published_elem is not None else None

                    created_utc = None
                    if published:
                        try:
                            created_utc = datetime.fromisoformat(published.replace("Z", "+00:00"))
                        except Exception:
                            pass

                    item = self.normalize_item({
                        "id": link,
                        "title": title,
                        "content": content,
                        "url": link,
                        "author": None,
                        "score": None,
                        "created_utc": created_utc
                    })
                    items.append(item)

        except Exception as e:
            print(f"Error parsing RSS feed {feed_url}: {e}")

        return items

    async def validate(self) -> bool:
        """Validate RSS collector configuration."""
        try:
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(self.feeds[0], timeout=5) as response:
                    return response.status == 200
        except Exception:
            return False