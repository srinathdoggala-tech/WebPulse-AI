import React, { useState } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  DollarSign, 
  MapPin, 
  Target 
} from 'lucide-react';
import { matchResume } from '../services/api';

const PRESETS = [
  {
    label: "Full-Stack AI Engineer",
    text: "Experienced Full-Stack AI Engineer with 4 years building web apps with React, Next.js, TypeScript, Python, FastAPI, and PostgreSQL. Integrated OpenAI, Anthropic, LangChain, and Docker for deployed agent workflows."
  },
  {
    label: "AI Platform & Inference (CUDA/C++)",
    text: "Systems and Infrastructure Engineer with deep expertise in Python, PyTorch, CUDA, C++, vLLM, Linux, and Kubernetes. Scaled distributed model inference and optimized low-latency GPU kernels."
  },
  {
    label: "Core Backend Systems (Rust/Go)",
    text: "Senior Backend Engineer with 6+ years in Rust, Go, PostgreSQL, Docker, Kubernetes, Linux, and Kafka. Built high-throughput microservices and distributed replication pipelines on AWS."
  }
];

export default function JobMatcher({ initialJobs = [] }) {
  const [resumeText, setResumeText] = useState(PRESETS[0].text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleRunMatch = async () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await matchResume(resumeText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          Job Opportunity & Resume Skill Matcher
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Autonomous ATS matcher (Greenhouse, Lever, Ashby, LinkedIn). Analyze your technical profile against active market roles, compute match scores, and identify critical skill gaps.
        </p>
      </div>

      <div className="matcher-container">
        {/* Left Panel: Resume Input */}
        <div className="glass-card resume-input-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} color="#06b6d4" />
              Candidate Profile / Resume Skills
            </label>
            <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Paste text or pick preset</span>
          </div>

          <div className="preset-pills">
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                className="preset-pill"
                onClick={() => setResumeText(p.text)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <textarea
            className="resume-textarea"
            placeholder="Paste your resume summary, technical skills, or work experience here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <button
            className="action-btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            onClick={handleRunMatch}
            disabled={isAnalyzing}
          >
            <Sparkles size={16} />
            <span>{isAnalyzing ? 'Analyzing Alignment & ATS Gaps...' : 'Compute Match & Gap Analysis'}</span>
          </button>

          {analysisResult && (
            <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Detected Skills in Profile:
              </div>
              <div className="skills-cloud">
                {analysisResult.extracted_skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag-active">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Results & Matching Jobs */}
        <div className="match-results-panel">
          {analysisResult ? (
            <>
              {/* Overall Fit Banner */}
              <div className="glass-card fit-card">
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Overall Market Alignment
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                    Level: {analysisResult.seniority_estimate}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="fit-percentage">{analysisResult.overall_market_fit}%</div>
                  <div style={{ fontSize: '12px', color: '#34d399' }}>ATS Target Score</div>
                </div>
              </div>

              {/* Matched Jobs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {analysisResult.top_matches.map((item, idx) => (
                  <div key={idx} className="glass-card job-item-card">
                    <div className="job-header">
                      <div>
                        <h3 className="job-title">{item.job.title}</h3>
                        <div className="job-company">{item.job.company} • {item.job.location}</div>
                      </div>
                      <span className="score-badge" style={{ fontSize: '14px', borderColor: item.match_score >= 65 ? '#10b981' : '#f59e0b' }}>
                        {item.match_score}% MATCH
                      </span>
                    </div>

                    <div className="match-bar-wrap">
                      <div className="match-bar-fill" style={{ width: `${item.match_score}%` }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={13} color="#10b981" /> {item.job.salary}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={13} /> {item.job.type} ({item.job.source})
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                      {item.job.description}
                    </p>

                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginBottom: '6px' }}>Matched Skills:</div>
                      <div className="skills-cloud">
                        {item.matched_skills.map((s, i) => (
                          <span key={i} className="skill-tag-active">✓ {s}</span>
                        ))}
                        {item.missing_skills.map((s, i) => (
                          <span key={i} className="skill-tag-missing">✕ {s}</span>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '12px', color: item.match_score >= 60 ? '#34d399' : '#fbbf24' }}>
                        {item.recommendation}
                      </span>
                      <a 
                        href={item.job.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="action-btn"
                        style={{ padding: '6px 12px', background: 'rgba(6,182,212,0.15)', color: '#06b6d4', textDecoration: 'none' }}
                      >
                        Apply <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <Briefcase size={40} color="#06b6d4" style={{ margin: '0 auto 16px auto', opacity: 0.8 }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
                Run Resume & Opportunity Matcher
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                Click "Compute Match & Gap Analysis" to parse your technical skills and match against high-velocity engineering positions.
              </p>
              <button 
                className="action-btn btn-primary" 
                style={{ margin: '0 auto' }} 
                onClick={handleRunMatch}
              >
                Compute Immediate Alignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
