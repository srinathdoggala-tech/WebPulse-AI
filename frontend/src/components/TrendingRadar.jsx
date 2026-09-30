import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  ExternalLink, 
  MessageSquare, 
  Layers, 
  ArrowUpRight, 
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function TrendingRadar({ trends, onSelectTrend }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [activeModalTrend, setActiveModalTrend] = useState(null);

  const categories = [
    'All',
    'AI & Agents',
    'LLMs & Architecture',
    'AI Infrastructure',
    'Developer Tools',
    'Web Development'
  ];

  const filteredTrends = trends.filter((trend) => {
    const matchesCategory = selectedCategory === 'All' || trend.category === selectedCategory;
    const matchesSearch = 
      trend.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'velocity') return b.velocity - a.velocity;
    return b.score - a.score;
  });

  return (
    <div>
      {/* Metric Overview Banner */}
      <div className="stats-banner">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-num">{trends.length}</div>
            <div className="stat-label">Active Trends Tracked</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-num">+194.8%</div>
            <div className="stat-label">Mean 24h Velocity</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-num">5</div>
            <div className="stat-label">Live Ingestion Feeds</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <ArrowUpRight size={24} />
          </div>
          <div>
            <div className="stat-num">AI & Agents</div>
            <div className="stat-label">Dominant Sector</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tech, protocols, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className="action-btn"
            style={{ 
              background: 'rgba(255,255,255,0.06)', 
              color: '#cbd5e1', 
              border: '1px solid var(--border-subtle)' 
            }}
            onClick={() => setSortBy(sortBy === 'score' ? 'velocity' : 'score')}
            title="Toggle Sort by Score / Velocity"
          >
            <SlidersHorizontal size={14} />
            <span>Sort: {sortBy === 'score' ? 'Top Score' : 'Top Velocity'}</span>
          </button>
        </div>
      </div>

      {/* Trends Grid */}
      <div className="trends-grid">
        {filteredTrends.map((trend) => (
          <div 
            key={trend.id} 
            className="glass-card trend-card"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveModalTrend(trend)}
          >
            <div>
              <div className="trend-card-top">
                <span className="score-badge">SCORE {trend.score}</span>
                <span className="velocity-badge">
                  <Flame size={13} color="#10b981" />
                  +{trend.velocity}% / 24h
                </span>
              </div>

              <h2 className="trend-title">{trend.topic}</h2>
              <p className="trend-desc">{trend.summary}</p>
            </div>

            <div>
              <div className="trend-meta-row">
                <div className="source-badges">
                  {trend.sources.map((src, i) => (
                    <span key={i} className="source-tag">{src}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`sentiment-chip sentiment-${trend.sentiment}`}>
                    {trend.sentiment}
                  </span>
                  <span style={{ color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MessageSquare size={12} /> {trend.mention_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive Modal */}
      {activeModalTrend && (
        <div className="modal-overlay" onClick={() => setActiveModalTrend(null)}>
          <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span className="score-badge" style={{ marginRight: '10px' }}>RADAR SCORE {activeModalTrend.score}</span>
                <span className="velocity-badge" style={{ display: 'inline-flex' }}>
                  +{activeModalTrend.velocity}% 24h Acceleration
                </span>
              </div>
              <button 
                onClick={() => setActiveModalTrend(null)} 
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{activeModalTrend.topic}</h2>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '14px', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
              Category: {activeModalTrend.category}
            </div>

            <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px', fontSize: '15px' }}>
              {activeModalTrend.summary}
            </p>

            <h3 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '12px' }}>
              Linked Real-World Sources & Discussions
            </h3>

            {activeModalTrend.related_items && activeModalTrend.related_items.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeModalTrend.related_items.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'rgba(8, 12, 20, 0.6)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: 'var(--text-main)',
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{item.title}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
                      <span className="source-tag">{item.source}</span>
                      <ExternalLink size={14} />
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-faint)', fontSize: '13px' }}>
                Consolidated cross-source intelligence from HackerNews, GitHub, and Tech Feeds.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
