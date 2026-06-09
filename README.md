# 🧵 Bracelet Generator

A web app for designing friendship bracelet knot patterns. Choose thread count, colors, and pattern type — then generate a step-by-step knot guide with a visual preview. All your designs are saved to a local history so you can revisit and reuse them.

> Built with the help of [Claude Code](https://claude.ai/code) by Anthropic.

---

## Features

- 4 pattern types: **Chevron**, **Stripe**, **Diamond**, **X-Pattern**
- 4–12 threads with individual color selection (9 colors available)
- Step-by-step knot instructions per row
- Visual bracelet preview
- SQLite history — all generated patterns are saved automatically
- Load or delete any previous pattern from history

---

## Project Structure

```
bracelet-generator/
├── backend/
│   ├── app.py                  # Flask API
│   ├── database.py             # SQLite helpers
│   ├── pattern_generator.py    # Pattern logic
│   ├── pattern_state.py        # Thread state tracker
│   ├── patterns.db             # SQLite database (auto-created)
│   └── venv/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── PatternPreview.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |

No database setup needed — SQLite is built into Python and the `patterns.db` file is created automatically on first run.

---

## Setup & Running

You need **two terminal windows** running simultaneously.

### Terminal 1 — Backend

#### Linux / macOS
```bash
cd bracelet-generator/backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install flask flask-cors

# Start the server
python app.py
```

#### Windows
```cmd
cd bracelet-generator\backend

python -m venv venv
venv\Scripts\activate

pip install flask flask-cors

python app.py
```

The API will be available at `http://127.0.0.1:5000`

---

### Terminal 2 — Frontend

#### Linux / macOS
```bash
cd bracelet-generator/frontend

npm install
npm run dev
```

#### Windows
```cmd
cd bracelet-generator\frontend

npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## How to Use

1. **Choose threads** — select how many threads your bracelet will have (4, 6, 8, 10, or 12)
2. **Choose a pattern** — Chevron, Stripe, Diamond, or X-Pattern
3. **Pick colors** — click a color swatch for each thread
4. **Generate** — click "Generate Pattern" to see:
   - Row-by-row knot instructions (which threads to knot together and in which direction)
   - A visual preview of the resulting bracelet
5. **History** — every generated pattern is saved automatically. Click any history entry to reload it, or click × to delete it.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate` | Generate a pattern and save it |
| GET | `/patterns` | Get all saved patterns |
| GET | `/patterns/<id>` | Get a single pattern |
| DELETE | `/patterns/<id>` | Delete a pattern |

---

## Troubleshooting

**`flask` or `flask-cors` not found:**
```bash
pip install flask flask-cors
```

**Port 5000 already in use on macOS** (AirPlay receiver uses 5000):
```bash
# Disable AirPlay Receiver in System Settings → General → AirDrop & Handoff
# or change the port in app.py:
app.run(debug=True, port=5001)
# and update API url in frontend/src/App.jsx:
const API = "http://127.0.0.1:5001";
```

**Port 5000 already in use on Linux/Windows:**
```bash
# Linux/macOS
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**`npm run dev` fails — Node version too old:**
```bash
node --version   # should be 18+

# Update via nvm (Linux/macOS):
nvm install 18
nvm use 18
```
