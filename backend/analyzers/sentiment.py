"""Sentiment analyzer for analyzing text sentiment."""

from typing import Tuple
import re


class SentimentAnalyzer:
    """Analyze sentiment of text using keyword-based approach."""

    def __init__(self):
        # Positive and negative word lists
        self.positive_words = {
            "good", "great", "excellent", "amazing", "awesome", "fantastic",
            "love", "best", "better", "perfect", "innovative", "breakthrough",
            "success", "win", "growth", "opportunity", "exciting", "promising",
            "advanced", "powerful", "efficient", "impressive", "notable"
        }
        self.negative_words = {
            "bad", "poor", "terrible", "awful", "worst", "hate", "broken",
            "fail", "failure", "problem", "issue", "bug", "error", "crash",
            "risk", "danger", "concern", "challenge", "difficult", "struggle",
            "disappointing", "limited", "expensive", "slow"
        }
        self.intensifiers = {
            "very", "extremely", "really", "quite", "incredibly", "absolutely",
            "highly", "particularly", "especially", "remarkably"
        }

    async def analyze(self, text: str) -> Tuple[float, str]:
        """Analyze sentiment of text.

        Returns:
            Tuple of (score, label) where score is -1.0 to 1.0
        """
        if not text:
            return 0.0, "neutral"

        words = re.findall(r'\b\w+\b', text.lower())
        positive_score = 0
        negative_score = 0

        for i, word in enumerate(words):
            # Check for intensifiers
            intensifier = 1.0
            if i > 0 and words[i - 1] in self.intensifiers:
                intensifier = 1.5

            if word in self.positive_words:
                positive_score += 1.0 * intensifier
            elif word in self.negative_words:
                negative_score += 1.0 * intensifier

        total = positive_score + negative_score
        if total == 0:
            return 0.0, "neutral"

        score = (positive_score - negative_score) / total

        # Normalize to -1.0 to 1.0
        if score > 0.3:
            label = "positive"
        elif score < -0.3:
            label = "negative"
        else:
            label = "neutral"

        return score, label