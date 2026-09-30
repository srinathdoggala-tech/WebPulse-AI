from fastapi import APIRouter
from app.database import get_db_connection
from app.models.schema import StatsOverview

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("", response_model=StatsOverview)
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM items")
    total_items = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM trends")
    total_trends = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM jobs")
    total_jobs = cursor.fetchone()[0]

    # Source breakdown
    cursor.execute("SELECT source, COUNT(*) as c FROM items GROUP BY source")
    sources_breakdown = {r["source"]: r["c"] for r in cursor.fetchall()}

    # Category breakdown
    cursor.execute("SELECT category, COUNT(*) as c FROM trends GROUP BY category")
    category_distribution = {r["category"]: r["c"] for r in cursor.fetchall()}

    # Sentiment distribution
    cursor.execute("SELECT sentiment, COUNT(*) as c FROM trends GROUP BY sentiment")
    sentiment_distribution = {r["sentiment"]: r["c"] for r in cursor.fetchall()}

    # Last timestamp
    cursor.execute("SELECT MAX(timestamp) FROM items")
    last_item = cursor.fetchone()[0]

    conn.close()

    return StatsOverview(
        total_items_collected=total_items,
        total_trends_active=total_trends,
        total_jobs_tracked=total_jobs,
        sources_breakdown=sources_breakdown,
        category_distribution=category_distribution,
        sentiment_distribution=sentiment_distribution,
        last_collection_time=last_item
    )
