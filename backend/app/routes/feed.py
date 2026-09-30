import json
from fastapi import APIRouter, Query
from typing import List, Optional
from datetime import datetime
from app.database import get_db_connection
from app.models.schema import CollectedItem

router = APIRouter(prefix="/feed", tags=["Feed"])

@router.get("", response_model=List[CollectedItem])
def get_feed(
    source: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM items WHERE 1=1"
    params = []

    if source and source != "All":
        query += " AND source = ?"
        params.append(source)

    if category and category != "All":
        query += " AND category = ?"
        params.append(category)

    if search:
        query += " AND (title LIKE ? OR content LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])

    query += " ORDER BY timestamp DESC, score DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(CollectedItem(
            id=r["id"],
            title=r["title"],
            url=r["url"],
            content=r["content"] or "",
            source=r["source"],
            author=r["author"] or "Unknown",
            score=r["score"],
            comments_count=r["comments_count"],
            timestamp=r["timestamp"],
            category=r["category"],
            tags=json.loads(r["tags"]) if r["tags"] else [],
            content_hash=r["content_hash"]
        ))
    return results
