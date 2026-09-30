# TrendRadar AI (WebPulse)
> **Autonomous Community Intelligence & Opportunity Radar**: Multi-source web scraping, real-time topic velocity tracking, AI sentiment & categorization, and ATS resume skill-gap matching.

---

## 🌟 Overview & Emergent Demonstration Signals

**TrendRadar AI** is a full-stack, production-grade intelligence platform engineered to track, analyze, and synthesize emerging technology shifts and job opportunities across the developer ecosystem.

Rather than a simple proof-of-concept, this project demonstrates end-to-end engineering excellence across critical resume capabilities:

| Emergent Signal | Implementation in TrendRadar AI |
| :--- | :--- |
| **Python Scraper & Collectors** | Multi-source asynchronous collectors for **Hacker News (Firebase API)**, **GitHub (Search API)**, **Reddit (JSON feeds)**, **ArXiv / Tech News (RSS)**, and **ATS Job Boards (Greenhouse/Lever/Ashby)**. |
| **Tracker & Historical State** | Topic velocity calculus (`% 24h acceleration`), breakout novelty detection, historical database snapshots, and SQLite persistence. |
| **Real-World Data Ingestion** | Robust normalization pipeline with title sanitization, HTML stripping, category classification, and SHA-256 content deduplication. |
| **AI & NLP Analysis** | Technical entity clustering, sentiment polarity scoring, dynamic trend scoring algorithm (`engagement * recency * cross-source factor`), and executive AI intelligence digest. |
| **Job & Opportunity Intelligence** | Automated ATS job parser, candidate skill extractor, weighted match scorer, and interactive skill-gap analysis (missing skills highlight). |
| **Full-Stack & APIs** | FastAPI backend with modular REST routers (`/api/trends`, `/api/feed`, `/api/jobs`, `/api/stats`, `/api/summary`, `/api/collect`) + React frontend with glassmorphism, responsive grid, and live collector triggers. |

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Sources [External Web & Community Sources]
        HN[Hacker News API]
        GH[GitHub Trending API]
        RD[Reddit Tech Subreddits]
        RSS[ArXiv & Tech News RSS]
        JOB[ATS Feeds Greenhouse / Lever]
    end

    subgraph Collectors [Python Collectors Engine]
        C1[HackerNewsCollector]
        C2[GitHubCollector]
        C3[RedditCollector]
        C4[RssNewsCollector]
        C5[JobBoardCollector]
    end

    subgraph Pipeline [Normalization & Deduplication]
        NORM[PipelineNormalizer]
        DEDUP[PipelineDeduplicator SHA-256]
    end

    subgraph AI [AI & Tracking Engine]
        EXTR[Topic & Entity Extractor]
        SENT[Sentiment Analyzer]
        SCORE[Trend Velocity Scorer]
        SUMM[AI Executive Summarizer]
        MATCH[Resume Skill & Gap Matcher]
    end

    subgraph Storage [Persistence Layer]
        DB[(SQLite trendradar.db)]
    end

    subgraph API [FastAPI Service]
        R1[/api/trends & /rising]
        R2[/api/feed]
        R3[/api/jobs & /match]
        R4[/api/stats & /summary]
        R5[/api/collect/trigger]
    end

    subgraph UI [React Dashboard]
        V1[Trending Radar View]
        V2[Velocity Spikes View]
        V3[Interactive Resume Matcher]
        V4[Unified Live Feed]
        V5[Executive AI Digest]
        V6[Source Analytics]
    end

    HN --> C1
    GH --> C2
    RD --> C3
    RSS --> C4
    JOB --> C5

    C1 & C2 & C3 & C4 --> NORM --> DEDUP --> DB
    C5 --> DB

    DB --> EXTR --> SCORE --> DB
    DB --> SENT --> SCORE
    DB --> SUMM
    DB --> MATCH

    DB --> API
    API --> UI
```

---

## 📁 Repository Structure

```
TrendRadar-AI/
├── backend/
│   ├── app/
│   │   ├── collectors/        # Scrapers for HN, GitHub, Reddit, RSS, Jobs
│   │   │   ├── base.py
│   │   │   ├── hackernews.py
│   │   │   ├── github.py
│   │   │   ├── reddit.py
│   │   │   ├── rss_news.py
│   │   │   └── jobs.py
│   │   ├── pipeline/          # Normalization & deduplication
│   │   │   ├── normalizer.py
│   │   │   └── deduplicator.py
│   │   ├── ai/                # Topic clustering, sentiment, velocity scoring
│   │   │   ├── topic_extractor.py
│   │   │   ├── sentiment.py
│   │   │   ├── trend_scorer.py
│   │   │   └── summarizer.py
│   │   ├── tracking/          # Job matcher, resume gap analysis, history
│   │   │   ├── job_matcher.py
│   │   │   └── velocity.py
│   │   ├── routes/            # REST API endpoints
│   │   │   ├── trends.py
│   │   │   ├── feed.py
│   │   │   ├── jobs.py
│   │   │   ├── stats.py
│   │   │   ├── summary.py
│   │   │   └── collect.py
│   │   ├── models/            # Pydantic schemas
│   │   │   └── schema.py
│   │   ├── config.py          # App settings & CORS
│   │   ├── database.py        # SQLite initialization & demo seeding
│   │   └── main.py            # FastAPI entry point
│   ├── tests/                 # Pytest test suite
│   │   ├── test_normalizer.py
│   │   └── test_job_matcher.py
│   ├── requirements.txt
│   ├── run.py                 # Uvicorn server runner
│   └── pytest.ini
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Brand logo, pulse badge, navigation
│   │   │   ├── TrendingRadar.jsx    # Trending grid, category filters, detail modal
│   │   │   ├── RisingTopics.jsx     # Breakout acceleration (>120% velocity)
│   │   │   ├── JobMatcher.jsx       # Interactive resume analyzer & gap visualizer
│   │   │   ├── UnifiedFeed.jsx      # Multi-source stream with direct search
│   │   │   ├── AIDigest.jsx         # Executive tech briefing & breakthroughs
│   │   │   └── AnalyticsView.jsx    # Source volume, category, & sentiment charts
│   │   ├── services/
│   │   │   └── api.js               # Client API connector with fallback support
│   │   ├── App.jsx                  # Main application state & notification toast
│   │   ├── index.css                # Dark glassmorphic design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
> The API will be live at `http://localhost:8000` with interactive Swagger docs at `http://localhost:8000/docs`.

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
> Open your browser to `http://localhost:5173` to explore the TrendRadar interface.

### 3. Running Unit Tests

```bash
cd backend
pytest
```

---

## 🎯 Key Capabilities & Screen Highlights

1. **Live Trend Radar**:
   - Cross-source radar score (`0-100`) computed via engagement intensity, recency half-life, and platform diversity multiplier.
   - Filter by tech sectors: `AI & Agents`, `LLMs & Architecture`, `AI Infrastructure`, `Developer Tools`, `Web Development`.
   - Click any card for a deep-dive modal revealing linked discussions and original sources.

2. **Velocity Spikes & Novelty Detection**:
   - Isolates breakthrough topics surging above `+120% 24h velocity` (e.g., Model Context Protocol MCP, Test-Time Compute, DeepSeek MoE).

3. **Interactive ATS Job & Skill Gap Matcher**:
   - Paste candidate resume text or click instant presets (*Full-Stack AI*, *CUDA/Inference*, *Rust/Go Systems*).
   - Generates match score %, matched skills (green badges), missing skills (red badges), and tailored recommendation for high-paying roles.

4. **Multi-Source Unified Feed**:
   - Filter by source (*HackerNews*, *GitHub*, *Reddit*, *ArXiv/TechNews*), live search keywords, view upvotes and community responses.

5. **AI Intelligence Digest**:
   - Consolidated executive brief synthesizing narrative shifts, emerging tooling, and enterprise hiring demands.
