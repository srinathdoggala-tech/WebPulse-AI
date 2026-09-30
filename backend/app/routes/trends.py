import json
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.database import get_db_connection
from app.models.schema import TrendTopic

router = APIRouter(prefix="/trends", tags=["Trends"])

@router.get("", response_model=List[TrendTopic])
def get_trends(
    category: Optional[str] = None,
    sort_by: Optional[str] = "score",  # "score", "velocity", "mention_count"
    limit: int = Query(20, ge=1, le=100)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM trends"
    params = []

    if category and category != "All":
        query += " WHERE category = ?"
        params.append(category)

    if sort_by == "velocity":
        query += " ORDER BY velocity DESC LIMIT ?"
    elif sort_by == "mentions":
        query += " ORDER BY mention_count DESC LIMIT ?"
    else:
        query += " ORDER BY score DESC LIMIT ?"
    
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(TrendTopic(
            id=r["id"],
            topic=r["topic"],
            category=r["category"],
            score=r["score"],
            velocity=r["velocity"],
            sentiment=r["sentiment"],
            mention_count=r["mention_count"],
            sources=json.loads(r["sources"]) if r["sources"] else [],
            summary=r["summary"] or "",
            is_rising=bool(r["is_rising"]),
            updated_at=r["updated_at"]
        ))
    return results

@router.get("/rising", response_model=List[TrendTopic])
def get_rising_trends(limit: int = 10):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trends WHERE is_rising = 1 ORDER BY velocity DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(TrendTopic(
            id=r["id"],
            topic=r["topic"],
            category=r["category"],
            score=r["score"],
            velocity=r["velocity"],
            sentiment=r["sentiment"],
            mention_count=r["mention_count"],
            sources=json.loads(r["sources"]) if r["sources"] else [],
            summary=r["summary"] or "",
            is_rising=True,
            updated_at=r["updated_at"]
        ))
    return results

@router.get("/{trend_id}", response_model=TrendTopic)
def get_trend_detail(trend_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trends WHERE id = ?", (trend_id,))
    r = cursor.fetchone()
    if not r:
        conn.close()
        raise HTTPException(status_code=404, detail="Trend not found")

    # Fetch associated items with matching keywords
    topic_clean = r["topic"].split("(")[0].strip()
    cursor.execute(
        "SELECT title, url, source, score FROM items WHERE title LIKE ? OR content LIKE ? LIMIT 5",
        (f"%{topic_clean}%", f"%{topic_clean}%")
    )
    related_rows = cursor.fetchall()
    conn.close()

    related_items = [
        {"title": row["title"], "url": row["url"], "source": row["source"], "score": row["score"]}
        for row in related_rows
    ]

    return TrendTopic(
        id=r["id"],
        topic=r["topic"],
        category=r["category"],
        score=r["score"],
        velocity=r["velocity"],
        sentiment=r["sentiment"],
        mention_count=r["mention_count"],
        sources=json.loads(r["sources"]) if r["sources"] else [],
        summary=r["summary"] or "",
        is_rising=bool(r["is_rising"]),
        related_items=related_items,
        updated_at=r["updated_at"]
    )
