import json
import logging
from fastapi import APIRouter, BackgroundTasks
from typing import Dict, Any
from app.database import get_db_connection
from app.collectors.hackernews import HackerNewsCollector
from app.collectors.github import GitHubCollector
from app.collectors.reddit import RedditCollector
from app.collectors.rss_news import RssNewsCollector
from app.collectors.jobs import JobBoardCollector
from app.pipeline.normalizer import PipelineNormalizer
from app.pipeline.deduplicator import PipelineDeduplicator
from app.ai.topic_extractor import TopicExtractor
from app.ai.trend_scorer import TrendScorer
from app.tracking.velocity import VelocityTracker

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/collect", tags=["Collection Engine"])

def execute_pipeline() -> Dict[str, Any]:
    logger.info("Executing collection and AI trend pipeline...")
    raw_items = []
    
    # Run Collectors
    hn_collector = HackerNewsCollector()
    gh_collector = GitHubCollector()
    rd_collector = RedditCollector()
    rss_collector = RssNewsCollector()
    job_collector = JobBoardCollector()

    raw_items.extend(hn_collector.collect())
    raw_items.extend(gh_collector.collect())
    raw_items.extend(rd_collector.collect())
    raw_items.extend(rss_collector.collect())
    new_jobs = job_collector.collect()

    # Normalization
    normalized_items = [PipelineNormalizer.normalize_item(i) for i in raw_items]

    # Database insertion and deduplication
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT content_hash FROM items")
    existing_hashes = {r[0] for r in cursor.fetchall() if r[0]}

    deduped_items = PipelineDeduplicator.deduplicate(normalized_items, existing_hashes)

    for item in deduped_items:
        cursor.execute("""
        INSERT OR IGNORE INTO items (id, title, url, content, source, author, score, comments_count, timestamp, category, tags, content_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item.id, item.title, item.url, item.content, item.source, item.author,
            item.score, item.comments_count, item.timestamp.isoformat(), item.category,
            json.dumps(item.tags), item.content_hash
        ))

    # Insert or update jobs
    for job in new_jobs:
        cursor.execute("""
        INSERT OR REPLACE INTO jobs (id, title, company, location, type, salary, experience_level, skills, url, source, description, posted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job.id, job.title, job.company, job.location, job.type, job.salary,
            job.experience_level, json.dumps(job.skills), job.url, job.source,
            job.description, job.posted_at.isoformat()
        ))

    # Fetch all recent items to recompute topic clusters
    cursor.execute("SELECT * FROM items ORDER BY timestamp DESC LIMIT 200")
    all_recent_rows = cursor.fetchall()
    
    recent_items = []
    for r in all_recent_rows:
        from app.models.schema import CollectedItem
        recent_items.append(CollectedItem(
            id=r["id"],
            title=r["title"],
            url=r["url"],
            content=r["content"] or "",
            source=r["source"],
            author=r["author"] or "",
            score=r["score"],
            comments_count=r["comments_count"],
            timestamp=r["timestamp"],
            category=r["category"],
            tags=json.loads(r["tags"]) if r["tags"] else [],
            content_hash=r["content_hash"]
        ))

    clusters = TopicExtractor.extract_entity_clusters(recent_items)
    
    updated_trends_count = 0
    for topic_name, cluster_items in clusters.items():
        if len(cluster_items) >= 1:
            trend = TrendScorer.calculate_topic_metrics(topic_name, cluster_items)
            cursor.execute("""
            INSERT OR REPLACE INTO trends (id, topic, category, score, velocity, sentiment, mention_count, sources, summary, is_rising, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                trend.id, trend.topic, trend.category, trend.score, trend.velocity,
                trend.sentiment, trend.mention_count, json.dumps(trend.sources),
                trend.summary, 1 if trend.is_rising else 0, trend.updated_at.isoformat()
            ))
            updated_trends_count += 1

    conn.commit()
    conn.close()

    # Record snapshot
    VelocityTracker.record_snapshot("pipeline_run", len(deduped_items), {"updated_trends": updated_trends_count})

    return {
        "status": "success",
        "collected_items_count": len(raw_items),
        "new_unique_items_stored": len(deduped_items),
        "jobs_updated": len(new_jobs),
        "active_trends_calculated": updated_trends_count
    }

@router.post("/trigger")
def trigger_collection(background_tasks: BackgroundTasks):
    result = execute_pipeline()
    return result
