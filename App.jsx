import { useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,400;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --border: #1e1e2e;
    --accent: #00ffa3;
    --accent2: #ff6b6b;
    --accent3: #6b8cff;
    --text: #e8e8f0;
    --muted: #6b6b80;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
    position: relative;
  }

  .header::before {
    content: '';
    position: absolute;
    top: -40px; left: 50%;
    transform: translateX(-50%);
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(0,255,163,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid rgba(0,255,163,0.3);
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: clamp(32px, 6vw, 56px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -2px;
    background: linear-gradient(135deg, #fff 0%, #888 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: var(--muted);
    margin-top: 12px;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
  }

  .tabs {
    display: flex;
    gap: 4px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 4px;
    margin-bottom: 28px;
  }

  .tab {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.3px;
    transition: all 0.2s;
    background: transparent;
    color: var(--muted);
  }

  .tab.active {
    background: var(--border);
    color: var(--text);
  }

  .tab.detect.active { color: var(--accent); }
  .tab.humanize.active { color: var(--accent3); }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0,255,163,0.3), transparent);
  }

  .card.humanize-card::before {
    background: linear-gradient(90deg, transparent, rgba(107,140,255,0.3), transparent);
  }

  textarea {
    width: 100%;
    min-height: 200px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    line-height: 1.7;
    padding: 16px;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
  }

  textarea:focus { border-color: rgba(0,255,163,0.4); }
  textarea.humanize-focus:focus { border-color: rgba(107,140,255,0.4); }

  .word-count {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    margin-top: 8px;
    text-align: right;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    margin-top: 20px;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }

  .btn-detect {
    background: rgba(0,255,163,0.12);
    color: var(--accent);
    border: 1px solid rgba(0,255,163,0.25);
  }
  .btn-detect:hover { background: rgba(0,255,163,0.2); }

  .btn-humanize {
    background: rgba(107,140,255,0.12);
    color: var(--accent3);
    border: 1px solid rgba(107,140,255,0.25);
  }
  .btn-humanize:hover { background: rgba(107,140,255,0.2); }

  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .result-section { margin-top: 28px; }

  .result-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }

  /* Detection result */
  .detect-result {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
  }

  .score-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .score-label { font-size: 14px; color: var(--muted); font-weight: 700; }

  .score-value {
    font-size: 42px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
  }

  .score-bar {
    height: 6px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .score-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  .verdict {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
  }

  .verdict.ai { background: rgba(255,107,107,0.1); color: var(--accent2); border: 1px solid rgba(255,107,107,0.2); }
  .verdict.human { background: rgba(0,255,163,0.08); color: var(--accent); border: 1px solid rgba(0,255,163,0.2); }
  .verdict.mixed { background: rgba(255,200,0,0.08); color: #ffc800; border: 1px solid rgba(255,200,0,0.2); }

  .signals {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .signal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
    font-size: 12px;
    line-height: 1.5;
    color: var(--muted);
  }

  .signal strong {
    display: block;
    color: var(--text);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
    font-family: 'DM Mono', monospace;
  }

  /* Humanize result */
  .humanize-output {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    line-height: 1.8;
    color: var(--text);
    white-space: pre-wrap;
    position: relative;
  }

  .copy-btn {
    position: absolute;
    top: 12px; right: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .copy-btn:hover { color: var(--text); border-color: var(--accent3); }

  .changes-list {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .change-tag {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(107,140,255,0.1);
    color: var(--accent3);
    border: 1px solid rgba(107,140,255,0.2);
  }

  .credits {
    margin-top: 56px;
    text-align: center;
    position: relative;
  }

  .credits::before {
    content: '';
    display: block;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin-bottom: 32px;
  }

  .credits-inner {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .credits-made {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
  }

  .credits-brand {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #fff 0%, var(--muted) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
  }

  .credits-brand::after {
    content: '';
    display: block;
    height: 2px;
    margin-top: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent3));
    opacity: 0.7;
  }

  .credits-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent3));
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .error-msg {
    color: var(--accent2);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 16px;
    background: rgba(255,107,107,0.08);
    border: 1px solid rgba(255,107,107,0.2);
    border-radius: 10px;
    margin-top: 16px;
  }

  .tone-select {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .tone-btn {
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tone-btn.active {
    background: rgba(107,140,255,0.15);
    color: var(--accent3);
    border-color: rgba(107,140,255,0.3);
  }
`;

async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

export default function App() {
  const [tab, setTab] = useState("detect");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectResult, setDetectResult] = useState(null);
  const [humanResult, setHumanResult] = useState(null);
  const [error, setError] = useState("");
  const [tone, setTone] = useState("casual");
  const [copied, setCopied] = useState(false);

  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const detect = async () => {
    if (!text.trim() || words < 20) return;
    setLoading(true); setError(""); setDetectResult(null);
    try {
      const system = `You are an AI text detection expert. Analyze the given text and return ONLY valid JSON with this exact shape:
{
  "score": <0-100 integer, 0=definitely human, 100=definitely AI>,
  "verdict": "AI" | "Human" | "Mixed",
  "signals": [
    { "label": "...", "description": "..." },
    { "label": "...", "description": "..." },
    { "label": "...", "description": "..." },
    { "label": "...", "description": "..." }
  ],
  "reasoning": "One sentence summary"
}
Be accurate and nuanced. Consider: sentence uniformity, vocabulary diversity, hedging language, topic transitions, emotional depth, errors/typos, personal anecdotes.`;
      const raw = await callClaude([{ role: "user", content: text }], system);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setDetectResult(parsed);
    } catch (e) {
      setError("Analysis failed. Please try again.");
    }
    setLoading(false);
  };

  const humanize = async () => {
    if (!text.trim() || words < 10) return;
    setLoading(true); setError(""); setHumanResult(null);
    try {
      const system = `You are an expert at rewriting AI-generated text to sound authentically human. 
Rewrite the text in a ${tone} tone. Make it sound natural, imperfect, and genuine.
Return ONLY valid JSON:
{
  "rewritten": "...the rewritten text...",
  "changes": ["Change 1 made", "Change 2 made", "Change 3 made", "Change 4 made"]
}
Guidelines: Add natural sentence variety, occasional contractions, remove formulaic phrases, add minor imperfections, use active voice, include authentic transitions.`;
      const raw = await callClaude([{ role: "user", content: `Rewrite this text:\n\n${text}` }], system);
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setHumanResult(parsed);
    } catch (e) {
      setError("Rewriting failed. Please try again.");
    }
    setLoading(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(humanResult.rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "#ff6b6b";
    if (score >= 40) return "#ffc800";
    return "#00ffa3";
  };

  const tones = ["casual", "professional", "friendly", "academic"];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="header">
          <div className="badge">✦ Powered by Claude AI</div>
          <h1>AI Text<br />Intelligence</h1>
          <p className="subtitle">Detect AI-generated content · Rewrite it to sound human</p>
        </div>

        <div className="tabs">
          <button className={`tab detect ${tab === "detect" ? "active" : ""}`} onClick={() => { setTab("detect"); setError(""); }}>
            🔍 AI Detector
          </button>
          <button className={`tab humanize ${tab === "humanize" ? "active" : ""}`} onClick={() => { setTab("humanize"); setError(""); }}>
            ✍️ AI → Human
          </button>
        </div>

        <div className={`card ${tab === "humanize" ? "humanize-card" : ""}`}>
          <textarea
            className={tab === "humanize" ? "humanize-focus" : ""}
            placeholder={tab === "detect"
              ? "Paste any text here to analyze if it was written by AI... (min 20 words)"
              : "Paste AI-generated text here to rewrite it as human... (min 10 words)"}
            value={text}
            onChange={e => { setText(e.target.value); setDetectResult(null); setHumanResult(null); setError(""); }}
          />
          <div className="word-count">{words} words</div>

          {tab === "humanize" && (
            <div>
              <div className="result-label" style={{ marginTop: 16 }}>Output Tone</div>
              <div className="tone-select">
                {tones.map(t => (
                  <button key={t} className={`tone-btn ${tone === t ? "active" : ""}`} onClick={() => setTone(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            className={`btn ${tab === "detect" ? "btn-detect" : "btn-humanize"}`}
            disabled={loading || (tab === "detect" ? words < 20 : words < 10)}
            onClick={tab === "detect" ? detect : humanize}
          >
            {loading ? <><span className="spinner" /> {tab === "detect" ? "Analyzing..." : "Rewriting..."}</> :
              tab === "detect" ? "→ Analyze Text" : "→ Humanize Text"}
          </button>

          {error && <div className="error-msg">⚠ {error}</div>}

          {/* DETECT RESULTS */}
          {tab === "detect" && detectResult && (
            <div className="result-section">
              <div className="result-label">Analysis Result</div>
              <div className="detect-result">
                <div className="score-row">
                  <div>
                    <div className="score-label">AI Probability</div>
                    <div className="score-value" style={{ color: getScoreColor(detectResult.score) }}>
                      {detectResult.score}%
                    </div>
                  </div>
                  <div className={`verdict ${detectResult.verdict.toLowerCase()}`}>
                    {detectResult.verdict === "AI" ? "🤖" : detectResult.verdict === "Human" ? "👤" : "⚡"}
                    {detectResult.verdict} Written
                  </div>
                </div>
                <div className="score-bar">
                  <div className="score-fill" style={{ width: `${detectResult.score}%`, background: getScoreColor(detectResult.score) }} />
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
                  {detectResult.reasoning}
                </p>
                {detectResult.signals?.length > 0 && (
                  <div className="signals">
                    {detectResult.signals.map((s, i) => (
                      <div key={i} className="signal">
                        <strong>{s.label}</strong>
                        {s.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HUMANIZE RESULTS */}
          {tab === "humanize" && humanResult && (
            <div className="result-section">
              <div className="result-label">Humanized Output</div>
              <div style={{ position: "relative" }}>
                <div className="humanize-output">
                  {humanResult.rewritten}
                  <button className="copy-btn" onClick={copyText}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>
              {humanResult.changes?.length > 0 && (
                <>
                  <div className="result-label" style={{ marginTop: 16 }}>Changes Made</div>
                  <div className="changes-list">
                    {humanResult.changes.map((c, i) => (
                      <span key={i} className="change-tag">{c}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {/* CREDITS */}
        <div className="credits">
          <div className="credits-inner">
            <span className="credits-made">Made by</span>
            <span className="credits-brand">VMG Development</span>
            <div className="credits-dot" />
          </div>
        </div>

      </div>
    </>
  );
}
