from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class CollectedItem(BaseModel):
    id: str
    title: str
    url: str
    content: Optional[str] = ""
    source: str  # "HackerNews", "GitHub", "Reddit", "ArXiv", "TechNews", "JobBoards"
    author: Optional[str] = "Anonymous"
    score: int = 0
    comments_count: int = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    category: str = "General Tech"
    tags: List[str] = []
    content_hash: Optional[str] = None

class TrendTopic(BaseModel):
    id: str
    topic: str
    category: str
    score: float
    velocity: float  # e.g., +145.2%
    sentiment: str  # "Positive", "Neutral", "Controversial", "Negative"
    mention_count: int
    sources: List[str]
    summary: str
    opportunity_signal: Optional[str] = ""
    is_rising: bool = False
    related_items: List[Dict[str, Any]] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    location: str
    type: str  # "Full-Time", "Remote", "Hybrid", "Contract"
    salary: Optional[str] = "Competitive"
    experience_level: str = "Mid-Senior"
    skills: List[str] = []
    url: str
    source: str
    description: str
    posted_at: datetime = Field(default_factory=datetime.utcnow)

class ResumeMatchRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = None
    target_skills: Optional[List[str]] = None

class JobMatchResult(BaseModel):
    job: JobPosting
    match_score: int  # 0 to 100%
    matched_skills: List[str]
    missing_skills: List[str]
    recommendation: str

class ResumeAnalysisResponse(BaseModel):
    extracted_skills: List[str]
    seniority_estimate: str
    overall_market_fit: int
    top_matches: List[JobMatchResult]
    skill_gap_summary: List[Dict[str, Any]]

class AIReportSummary(BaseModel):
    headline: str
    executive_summary: str
    key_breakthroughs: List[str]
    emerging_developer_tools: List[str]
    market_signals: List[str]
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class StatsOverview(BaseModel):
    total_items_collected: int
    total_trends_active: int
    total_jobs_tracked: int
    sources_breakdown: Dict[str, int]
    category_distribution: Dict[str, int]
    sentiment_distribution: Dict[str, int]
    last_collection_time: Optional[datetime] = None
