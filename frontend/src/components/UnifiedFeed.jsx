import React, { useState } from 'react';
import { 
  Rss, 
  ExternalLink, 
  ThumbsUp, 
  MessageSquare, 
  Search, 
  Filter, 
  Clock 
} from 'lucide-react';

export default function UnifiedFeed({ feedItems }) {
  const [selectedSource, setSelectedSource] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const sources = ['All', 'HackerNews', 'GitHub', 'Reddit', 'ArXiv/TechNews'];

  const filteredItems = feedItems.filter((item) => {
    const matchesSource = selectedSource === 'All' || item.source === selectedSource;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSource && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          Unified Ingestion Stream
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Normalized, deduplicated, and timestamped feed continuously scraped across Hacker News, GitHub repositories, Reddit communities, and technical research pre-prints.
        </p>
      </div>

      <div className="filter-bar">
        <div className="category-pills">
          {sources.map((src) => (
            <button
              key={src}
              className={`cat-pill ${selectedSource === src ? 'active' : ''}`}
              onClick={() => setSelectedSource(src)}
            >
              {src}
            </button>
          ))}
        </div>

        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search normalized feed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="feed-list">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-card feed-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="source-tag" style={{ color: '#06b6d4', borderColor: 'rgba(6,182,212,0.3)' }}>
                    {item.source}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="feed-title"
                >
                  {item.title}
                </a>

                {item.content && (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {item.content}
                  </p>
                )}
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Open Source Link"
              >
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="feed-footer">
              <div style={{ display: 'flex', gap: '6px' }}>
                {item.tags && item.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '11px', color: 'var(--text-faint)' }}>#{t}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp size={12} color="#06b6d4" /> {item.score}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} /> {item.comments_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
