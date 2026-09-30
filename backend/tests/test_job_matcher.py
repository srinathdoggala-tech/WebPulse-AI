import pytest
from app.models.schema import JobPosting
from app.tracking.job_matcher import JobMatcher

def test_resume_skill_extraction():
    resume_text = """
    Senior Software Engineer with 6 years experience.
    Proficient in Python, FastAPI, Docker, and PostgreSQL.
    Built LLM agent systems using LangGraph, PyTorch, and MCP.
    Deploys microservices on AWS and Kubernetes.
    """
    skills = JobMatcher.extract_skills_from_text(resume_text)
    assert "Python" in skills
    assert "FastAPI" in skills
    assert "Docker" in skills
    assert "Kubernetes" in skills
    assert "MCP" in skills
    assert "PyTorch" in skills

def test_job_match_analysis():
    jobs = [
        JobPosting(
            id="j1",
            title="AI Systems Engineer",
            company="Anthropic",
            location="Remote",
            type="Full-Time",
            skills=["Python", "FastAPI", "Docker", "Kubernetes", "CUDA"],
            url="https://example.com",
            source="Greenhouse",
            description="Build platform"
        ),
        JobPosting(
            id="j2",
            title="Frontend Specialist",
            company="Vercel",
            location="Remote",
            type="Full-Time",
            skills=["React", "Next.js", "Tailwind", "CSS"],
            url="https://example.com",
            source="Lever",
            description="Frontend platform"
        )
    ]
    resume = "Python engineer with strong FastAPI, Docker, and Kubernetes deployment experience."
    analysis = JobMatcher.analyze_resume(resume, jobs)

    assert len(analysis.extracted_skills) >= 4
    top_match = analysis.top_matches[0]
    assert top_match.job.id == "j1"
    assert top_match.match_score > 60
    assert "CUDA" in top_match.missing_skills
