import json
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.database import get_db_connection
from app.models.schema import JobPosting, ResumeMatchRequest, ResumeAnalysisResponse
from app.tracking.job_matcher import JobMatcher

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobPosting])
def get_jobs(
    role: Optional[str] = None,
    skill: Optional[str] = None,
    limit: int = Query(20, ge=1, le=50)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM jobs WHERE 1=1"
    params = []

    if role:
        query += " AND title LIKE ?"
        params.append(f"%{role}%")

    if skill:
        query += " AND skills LIKE ?"
        params.append(f"%{skill}%")

    query += " ORDER BY posted_at DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        results.append(JobPosting(
            id=r["id"],
            title=r["title"],
            company=r["company"],
            location=r["location"],
            type=r["type"],
            salary=r["salary"] or "Competitive",
            experience_level=r["experience_level"] or "Mid-Senior",
            skills=json.loads(r["skills"]) if r["skills"] else [],
            url=r["url"],
            source=r["source"],
            description=r["description"] or "",
            posted_at=r["posted_at"]
        ))
    return results

@router.post("/match", response_model=ResumeAnalysisResponse)
def match_resume(payload: ResumeMatchRequest):
    if not payload.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs")
    rows = cursor.fetchall()
    conn.close()

    available_jobs = [
        JobPosting(
            id=r["id"],
            title=r["title"],
            company=r["company"],
            location=r["location"],
            type=r["type"],
            salary=r["salary"],
            experience_level=r["experience_level"],
            skills=json.loads(r["skills"]) if r["skills"] else [],
            url=r["url"],
            source=r["source"],
            description=r["description"] or "",
            posted_at=r["posted_at"]
        )
        for r in rows
    ]

    analysis = JobMatcher.analyze_resume(payload.resume_text, available_jobs)
    return analysis

@router.get("/skills/in-demand")
def get_in_demand_skills():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT skills FROM jobs")
    rows = cursor.fetchall()
    conn.close()

    skill_counts: Dict[str, int] = {}
    for r in rows:
        if r["skills"]:
            skills = json.loads(r["skills"])
            for s in skills:
                skill_counts[s] = skill_counts.get(s, 0) + 1

    sorted_skills = [
        {"skill": k, "count": v}
        for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)
    ]
    return sorted_skills
