import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "patterns.db")


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pattern_type TEXT NOT NULL,
            threads INTEGER NOT NULL,
            colors TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    return conn


def init_db():
    conn = _connect()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS patterns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pattern_type TEXT NOT NULL,
            threads INTEGER NOT NULL,
            colors TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def save_pattern(pattern_type, threads, colors):
    conn = _connect()
    cursor = conn.execute(
        "INSERT INTO patterns (pattern_type, threads, colors) VALUES (?, ?, ?)",
        (pattern_type, threads, json.dumps(colors)),
    )
    pattern_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return pattern_id


def get_patterns():
    conn = _connect()
    rows = conn.execute(
        "SELECT id, pattern_type, threads, colors, created_at FROM patterns ORDER BY created_at DESC"
    ).fetchall()
    conn.close()
    return [
        {
            "id": row["id"],
            "pattern_type": row["pattern_type"],
            "threads": row["threads"],
            "colors": json.loads(row["colors"]),
            "created_at": row["created_at"],
        }
        for row in rows
    ]


def get_pattern(pattern_id):
    conn = _connect()
    row = conn.execute(
        "SELECT id, pattern_type, threads, colors, created_at FROM patterns WHERE id = ?",
        (pattern_id,),
    ).fetchone()
    conn.close()
    if not row:
        return None
    return {
        "id": row["id"],
        "pattern_type": row["pattern_type"],
        "threads": row["threads"],
        "colors": json.loads(row["colors"]),
        "created_at": row["created_at"],
    }


def delete_pattern(pattern_id):
    conn = _connect()
    conn.execute("DELETE FROM patterns WHERE id = ?", (pattern_id,))
    conn.commit()
    conn.close()
