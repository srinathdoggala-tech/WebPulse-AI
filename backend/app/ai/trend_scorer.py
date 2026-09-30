import math
from typing import List, Dict, Any
from datetime import datetime
from app.models.schema import CollectedItem, TrendTopic
from app.ai.sentiment import SentimentAnalyzer

OPPORTUNITY_SIGNALS = {
    "Model Context Protocol (MCP)": "Surging enterprise demand for engineers building secure LLM tool integrations, agent gateways, and IDE plugins.",
    "Reasoning Models & Test-Time Compute": "High hiring premium for engineers implementing inference verification, MCTS search, and test-time compute scaling.",
    "vLLM & High-Performance Inference": "Strong market demand for GPU kernel optimization (CUDA, Triton, FP8 quantization) and high-throughput model serving.",
    "Rust-Powered Developer Tooling": "Ecosystem-wide migration rewriting Python/JavaScript tooling in Rust for orders-of-magnitude faster build speeds.",
    "Multi-Agent Orchestration & Human-in-the-Loop": "Rapid commercialization of deterministic state graphs (LangGraph, AutoGen) for business-critical automations.",
    "Local Open-Weights LLMs & Private Serving": "Growing enterprise adoption of quantized local models (DeepSeek, Qwen) for cost containment and data privacy.",
    "React 19 & Next.js Server Components": "Active demand for full-stack developers combining modern React 19 server actions with low-latency AI backends."
}

class TrendScorer:
    """
    Statistical Trend Engine:
    Combines LLM/NLP understanding (topics, entities, sentiment) with quantitative rigor:
    Trend Score = (Engagement * Recency_Decay) * Cross_Source_Diversity_Factor
    Velocity = Rate of volume acceleration relative to historical baseline
    """
    @staticmethod
    def calculate_topic_metrics(
        topic_name: str,
        items: List[CollectedItem],
        previous_velocity: float = 0.0
    ) -> TrendTopic:
        now = datetime.utcnow()
        total_score = 0.0
        sources = set()
        categories = []
        texts = []

        for item in items:
            sources.add(item.source)
            categories.append(item.category)
            texts.append(f"{item.title} {item.content}")

            # Quantitative Engagement: weighted upvotes + comments
            engagement = item.score + (item.comments_count * 1.5)
            # Recency Exponential Decay (half-life: 24 hours)
            hours_old = max(0.5, (now - item.timestamp).total_seconds() / 3600.0)
            recency_decay = math.exp(-0.03 * hours_old)
            total_score += engagement * recency_decay

        # Cross-source diversity bonus: multi-platform appearance amplifies signal
        diversity_factor = 1.0 + (len(sources) - 1) * 0.35
        final_score = round(min(100.0, (math.log10(max(10, total_score)) * 24.0) * diversity_factor), 1)

        # Primary category
        primary_category = max(set(categories), key=categories.count) if categories else "Tech"

        # Sentiment analysis
        sentiment = SentimentAnalyzer.aggregate_sentiment(texts)

        # Statistical Velocity calculation
        mention_count = len(items)
        velocity = round(min(500.0, max(15.0, (mention_count * 35.0) + (final_score * 0.8) + (previous_velocity * 0.2))), 1)
        is_rising = velocity > 120.0 or len(sources) >= 3

        summary = f"High interest across {len(sources)} sources ({', '.join(list(sources)[:3])}) with {mention_count} active discussions."

        # Opportunity Signal
        opportunity = OPPORTUNITY_SIGNALS.get(
            topic_name,
            f"Strong opportunity in {primary_category}: rising corporate demand for engineers with hands-on implementation experience."
        )

        topic_id = f"trend_{abs(hash(topic_name)) % 100000}"

        return TrendTopic(
            id=topic_id,
            topic=topic_name,
            category=primary_category,
            score=final_score,
            velocity=velocity,
            sentiment=sentiment,
            mention_count=mention_count,
            sources=list(sources),
            summary=summary,
            opportunity_signal=opportunity,
            is_rising=is_rising,
            related_items=[{"title": i.title, "url": i.url, "source": i.source, "score": i.score} for i in items[:4]],
            updated_at=now
        )
