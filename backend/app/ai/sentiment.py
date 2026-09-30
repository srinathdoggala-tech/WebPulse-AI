import re
from typing import List, Dict

POSITIVE_WORDS = {
    "breakthrough", "fast", "faster", "efficient", "powerful", "revolution", "improved",
    "superior", "exciting", "scalable", "benchmark", "optimal", "clean", "production",
    "success", "high-throughput", "game-changer", "elegant", "recommended", "frontier"
}

NEGATIVE_WORDS = {
    "broken", "slow", "vulnerability", "leak", "bottleneck", "failing", "expensive",
    "bloat", "deprecated", "regret", "outage", "security", "flaw", "bug", "crash",
    "frustrating", "abandoned", "risk", "hazard", "controversial"
}

class SentimentAnalyzer:
    @staticmethod
    def analyze_text(text: str) -> Dict[str, any]:
        words = set(re.findall(r"\b\w+\b", text.lower()))
        pos_count = len(words.intersection(POSITIVE_WORDS))
        neg_count = len(words.intersection(NEGATIVE_WORDS))

        if pos_count > neg_count:
            sentiment = "Positive"
            score = round(min(1.0, 0.5 + (pos_count - neg_count) * 0.15), 2)
        elif neg_count > pos_count:
            sentiment = "Controversial" if pos_count > 0 else "Negative"
            score = round(max(-1.0, -0.4 - (neg_count - pos_count) * 0.15), 2)
        else:
            sentiment = "Neutral"
            score = 0.0

        return {
            "sentiment": sentiment,
            "polarity_score": score,
            "positive_signals": pos_count,
            "negative_signals": neg_count
        }

    @classmethod
    def aggregate_sentiment(cls, texts: List[str]) -> str:
        if not texts:
            return "Neutral"
        results = [cls.analyze_text(t) for t in texts]
        pos = sum(1 for r in results if r["sentiment"] == "Positive")
        neg = sum(1 for r in results if r["sentiment"] in ("Negative", "Controversial"))
        
        if pos > neg * 1.5:
            return "Positive"
        elif neg > pos:
            return "Controversial"
        return "Neutral"
