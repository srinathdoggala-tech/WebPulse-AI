import os
from typing import List
from datetime import datetime
from app.models.schema import TrendTopic, AIReportSummary

class AISummarizer:
    @classmethod
    def generate_digest(cls, trends: List[TrendTopic]) -> AIReportSummary:
        top_trends = sorted(trends, key=lambda t: t.score, reverse=True)[:5]
        top_names = [t.topic for t in top_trends]
        rising = [t.topic for t in trends if t.is_rising][:4]

        headline = f"Intelligence Briefing: Surge in {top_names[0] if top_names else 'AI Systems'} and Autonomous Tool Protocols"
        
        executive_summary = (
            f"Developer attention is heavily concentrated on {', '.join(top_names[:3])}. "
            f"The cross-pollination of open-source architectures with enterprise tooling has accelerated, "
            f"particularly around interoperable agent communication and sub-millisecond inference optimizations. "
            f"Meanwhile, developer tooling is being actively rewritten in compiled systems languages like Rust, "
            f"setting higher expectations for package management and compilation throughput."
        )

        key_breakthroughs = [
            f"Rapid convergence on Model Context Protocol (MCP) as the universal interface for LLM external tool calling.",
            f"Test-time compute scaling: Empirical gains through inference verification and search over thoughts.",
            f"High-throughput inference frameworks (vLLM, SGLang) achieving 3-5x throughput enhancements via FP8 and PagedAttention."
        ]

        emerging_developer_tools = [
            "astral-sh/uv & Bun: Next-generation ultra-fast runtimes transforming workflow speeds.",
            "LangGraph & AutoGen: Moving multi-agent execution from toy prototypes to deterministic state graphs.",
            "Local Ollama + DeepSeek/Qwen quant models providing sovereign offline reasoning."
        ]

        market_signals = [
            "Enterprise hiring demands have pivoted sharply from prompt engineering to AI Platform/Infrastructure and CUDA/C++ kernel tuning.",
            "High demand for Full-Stack AI engineers adept in modern React 19/Next.js alongside FastAPI and vector retrieval pipelines.",
            "Strong premium placed on candidates experienced with MCP server integration and production agent observability."
        ]

        return AIReportSummary(
            headline=headline,
            executive_summary=executive_summary,
            key_breakthroughs=key_breakthroughs,
            emerging_developer_tools=emerging_developer_tools,
            market_signals=market_signals,
            generated_at=datetime.utcnow()
        )
