import re
from typing import List, Dict, Any, Set
from app.models.schema import JobPosting, JobMatchResult, ResumeAnalysisResponse

TECH_TAXONOMY = {
    "languages": ["python", "rust", "typescript", "javascript", "c++", "go", "sql", "html", "css", "c#", "java"],
    "ai_ml": ["pytorch", "tensorflow", "cuda", "triton", "llms", "vllm", "langchain", "langgraph", "mcp", "ollama", "transformers", "hugging face", "rag", "fine-tuning", "deepseek"],
    "backend_cloud": ["fastapi", "docker", "kubernetes", "postgresql", "redis", "aws", "gcp", "linux", "kafka", "rest apis", "graphql", "microservices"],
    "frontend": ["react", "next.js", "tailwind", "vue", "svelte", "redux", "vite"]
}

ALL_KNOWN_SKILLS = [skill for sublist in TECH_TAXONOMY.values() for skill in sublist]

class JobMatcher:
    @classmethod
    def extract_skills_from_text(cls, text: str) -> List[str]:
        found_skills = set()
        clean_text = text.lower()

        # Direct token and regex matching
        for skill in ALL_KNOWN_SKILLS:
            pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
            if re.search(pattern, clean_text):
                # Format skill nicely
                found_skills.add(cls._format_skill_name(skill))

        # Check for special acronyms
        if "llm" in clean_text or "large language model" in clean_text:
            found_skills.add("LLMs")
        if "mcp" in clean_text or "model context protocol" in clean_text:
            found_skills.add("MCP")
        if "cuda" in clean_text:
            found_skills.add("CUDA")

        return sorted(list(found_skills))

    @staticmethod
    def _format_skill_name(skill: str) -> str:
        special_cases = {
            "c++": "C++", "sql": "SQL", "html": "HTML", "css": "CSS", "aws": "AWS",
            "gcp": "GCP", "mcp": "MCP", "llms": "LLMs", "vllm": "vLLM", "rest apis": "REST APIs",
            "next.js": "Next.js", "graphql": "GraphQL"
        }
        if skill in special_cases:
            return special_cases[skill]
        return skill.title()

    @classmethod
    def analyze_resume(cls, resume_text: str, available_jobs: List[JobPosting]) -> ResumeAnalysisResponse:
        candidate_skills = cls.extract_skills_from_text(resume_text)
        candidate_skills_lower = {s.lower() for s in candidate_skills}

        # Estimate seniority from text
        lower_text = resume_text.lower()
        if any(w in lower_text for w in ["staff", "principal", "director", "head of", "architect", "10+ years", "8+ years"]):
            seniority = "Staff / Principal"
        elif any(w in lower_text for w in ["senior", "lead", "5+ years", "6 years", "4+ years"]):
            seniority = "Senior"
        elif any(w in lower_text for w in ["intern", "junior", "graduate", "entry"]):
            seniority = "Junior / Associate"
        else:
            seniority = "Mid-Level"

        job_results: List[JobMatchResult] = []

        for job in available_jobs:
            job_skills_lower = {s.lower() for s in job.skills}
            if not job_skills_lower:
                continue

            matched = [s for s in job.skills if s.lower() in candidate_skills_lower]
            missing = [s for s in job.skills if s.lower() not in candidate_skills_lower]

            # Match calculation: weighted overlap
            overlap_ratio = len(matched) / len(job_skills_lower)
            score = int(round(overlap_ratio * 100))

            if score >= 75:
                recommendation = "Strong candidate match. Prioritize immediate application!"
            elif score >= 50:
                recommendation = f"Good foundational alignment. Bridge {len(missing)} missing skills ({', '.join(missing[:2])})."
            else:
                recommendation = f"Significant skill gap in required stack ({', '.join(missing[:3])})."

            job_results.append(JobMatchResult(
                job=job,
                match_score=score,
                matched_skills=matched,
                missing_skills=missing,
                recommendation=recommendation
            ))

        # Sort jobs by highest match score
        job_results.sort(key=lambda r: r.match_score, reverse=True)

        # Calculate overall market fit score
        top_scores = [r.match_score for r in job_results[:3]]
        overall_fit = int(sum(top_scores) / max(1, len(top_scores))) if top_scores else 50

        # High-demand missing skills across all jobs
        missing_counts: Dict[str, int] = {}
        for r in job_results:
            for m in r.missing_skills:
                missing_counts[m] = missing_counts.get(m, 0) + 1

        top_missing_gaps = [
            {"skill": k, "demand_frequency": v, "impact": "High" if v >= 3 else "Medium"}
            for k, v in sorted(missing_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]

        return ResumeAnalysisResponse(
            extracted_skills=candidate_skills,
            seniority_estimate=seniority,
            overall_market_fit=overall_fit,
            top_matches=job_results,
            skill_gap_summary=top_missing_gaps
        )
