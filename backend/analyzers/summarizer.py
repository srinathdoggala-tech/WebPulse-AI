"""Summarizer for generating text summaries."""

from typing import List
import re


class Summarizer:
    """Generate summaries of text content using extractive summarization."""

    def __init__(self):
        self.stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
            "for", "of", "with", "by", "from", "is", "are", "was", "were",
            "be", "been", "has", "have", "had", "will", "would", "could",
            "can", "may", "might", "shall", "should", "do", "does", "did",
            "this", "that", "these", "those", "i", "you", "he", "she", "it",
            "we", "they", "them", "their", "our", "your", "my", "his", "her",
            "its", "as", "by", "not", "no", "so", "if", "then", "than",
            "there", "here", "what", "which", "when", "where", "how", "why"
        }

    async def summarize(self, text: str, max_length: int = 200) -> str:
        """Generate a summary of the text."""
        if not text or len(text) <= max_length:
            return text

        # Split into sentences
        sentences = self._split_sentences(text)
        if len(sentences) <= 2:
            return text[:max_length]

        # Score sentences
        sentence_scores = self._score_sentences(sentences)

        # Select top sentences
        sorted_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        selected_sentences = [s for s, _ in sorted_sentences[:3]]

        # Reorder by original position
        selected_sentences.sort(key=lambda s: sentences.index(s))

        # Combine and truncate
        summary = " ".join(selected_sentences)
        if len(summary) > max_length:
            summary = summary[:max_length].rsplit(".", 1)[0] + "."

        return summary

    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences."""
        # Simple sentence splitting
        text = text.strip()
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]

    def _score_sentences(self, sentences: List[str]) -> dict:
        """Score sentences based on word frequency."""
        # Build word frequency table
        word_freq = {}
        for sentence in sentences:
            words = re.findall(r'\b\w+\b', sentence.lower())
            for word in words:
                if word not in self.stop_words:
                    word_freq[word] = word_freq.get(word, 0) + 1

        # Score sentences
        sentence_scores = {}
        for sentence in sentences:
            score = 0
            words = re.findall(r'\b\w+\b', sentence.lower())
            for word in words:
                score += word_freq.get(word, 0)
            # Normalize by sentence length
            if words:
                score = score / len(words)
            sentence_scores[sentence] = score

        return sentence_scores