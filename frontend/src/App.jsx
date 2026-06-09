import { useState, useEffect } from "react";
import PatternPreview from "./components/PatternPreview";
import "./App.css";

const API = "http://127.0.0.1:5000";

const AVAILABLE_COLORS = [
  { name: "Red", value: "#c0392b" },
  { name: "Blue", value: "#2e86c1" },
  { name: "White", value: "#f0ece3" },
  { name: "Green", value: "#27ae60" },
  { name: "Yellow", value: "#f1c40f" },
  { name: "Black", value: "#2c3e50" },
  { name: "Orange", value: "#e67e22" },
  { name: "Pink", value: "#e91e8a" },
  { name: "Purple", value: "#8e44ad" },
];

const PATTERN_LABELS = {
  chevron: "Chevron",
  stripe: "Stripe",
  diamond: "Diamond",
  x_pattern: "X-Pattern",
};

const DEFAULT_COLORS = ["#c0392b", "#2e86c1", "#f0ece3", "#27ae60", "#f1c40f", "#2c3e50", "#e67e22", "#8e44ad"];

function App() {
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [threads, setThreads] = useState(8);
  const [pattern, setPattern] = useState("chevron");
  const [rows, setRows] = useState([]);
  const [states, setStates] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const res = await fetch(`${API}/patterns`);
    const data = await res.json();
    setHistory(data);
  }

  async function generate() {
    const response = await fetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threads, pattern, colors: colors.slice(0, threads) }),
    });
    const data = await response.json();
    setRows(data.rows);
    setStates(data.states);
    fetchHistory();
  }

  async function loadFromHistory(entry) {
    setThreads(entry.threads);
    setPattern(entry.pattern_type);
    setColors(entry.colors.concat(DEFAULT_COLORS.slice(entry.colors.length)));

    const response = await fetch(`${API}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        threads: entry.threads,
        pattern: entry.pattern_type,
        colors: entry.colors,
      }),
    });
    const data = await response.json();
    setRows(data.rows);
    setStates(data.states);
    fetchHistory();
  }

  async function deleteFromHistory(id, e) {
    e.stopPropagation();
    await fetch(`${API}/patterns/${id}`, { method: "DELETE" });
    fetchHistory();
  }

  function updateColor(index, value) {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "Z");
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="header">
        <h1>Bracelet Generator</h1>
        <p className="subtitle">Design your own friendship bracelet patterns</p>
      </div>

      <div className="card">
        <h2><span className="icon">🧵</span> Settings</h2>

        <div className="control-row">
          <label>Threads</label>
          <select
            value={threads}
            onChange={(e) => setThreads(Number(e.target.value))}
          >
            <option value={4}>4</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={12}>12</option>
          </select>
        </div>

        <div className="control-row">
          <label>Pattern</label>
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          >
            <option value="chevron">Chevron</option>
            <option value="stripe">Stripe</option>
            <option value="diamond">Diamond</option>
            <option value="x_pattern">X-Pattern</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h2><span className="icon">🎨</span> Thread Colors</h2>
        <div className="thread-grid">
          {Array.from({ length: threads }).map((_, index) => (
            <div key={index} className="thread-item">
              <span className="thread-label">#{index + 1}</span>
              <div className="color-swatches">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`color-swatch${colors[index] === c.value ? " selected" : ""}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => updateColor(index, c.value)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="generate-btn" onClick={generate}>
        Generate Pattern
      </button>

      {rows.length > 0 && (
        <>
          <div className="card" style={{ marginTop: 20 }}>
            <h2><span className="icon">📋</span> Knot Instructions</h2>
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="knot-row">
                <b>Row {rowIndex + 1}</b>
                {row.map((knot, knotIndex) => (
                  <span key={knotIndex} className="knot-pair">
                    {knot.left} ↔ {knot.right}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="card">
            <h2><span className="icon">👁️</span> Preview</h2>
            <div className="thread-preview">
              {colors.slice(0, threads).map((color, index) => (
                <div
                  key={index}
                  className="thread-strand"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <PatternPreview
              threads={threads}
              rows={rows}
              states={states}
              colors={colors}
            />
          </div>
        </>
      )}

      {rows.length === 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <p className="empty-state">Click "Generate Pattern" to see your bracelet design</p>
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <h2><span className="icon">🕒</span> History</h2>
        {history.length === 0 && (
          <p className="empty-state">No saved patterns yet</p>
        )}
        <div className="history-list">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="history-card"
              onClick={() => loadFromHistory(entry)}
            >
              <div className="history-colors">
                {entry.colors.map((c, i) => (
                  <span
                    key={i}
                    className="history-dot"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="history-meta">
                <span className="history-type">
                  {PATTERN_LABELS[entry.pattern_type] || entry.pattern_type}
                </span>
                <span className="history-threads">{entry.threads} threads</span>
                <span className="history-date">{formatDate(entry.created_at)}</span>
              </div>
              <div className="history-actions">
                <button
                  className="history-delete"
                  onClick={(e) => deleteFromHistory(entry.id, e)}
                  title="Delete"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
