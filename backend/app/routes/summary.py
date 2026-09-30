import json
from fastapi import APIRouter
from app.database import get_db_connection
from app.models.schema import TrendTopic, AIReportSummary
from app.ai.summarizer import AISummarizer

router = APIRouter(prefix="/summary", tags=["Summary"])

@router.get("", response_model=AIReportSummary)
def get_ai_summary():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM trends ORDER BY score DESC")
    rows = cursor.fetchall()
    conn.close()

    trends = [
        TrendTopic(
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
        )
        for r in rows
    ]

    return AISummarizer.generate_digest(trends)
