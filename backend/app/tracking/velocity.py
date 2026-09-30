import sqlite3
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.database import get_db_connection

class VelocityTracker:
    @staticmethod
    def record_snapshot(metric: str, value: float, meta: Dict[str, Any] = None):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO snapshots (timestamp, metric, value, meta)
        VALUES (?, ?, ?, ?)
        """, (datetime.utcnow().isoformat(), metric, value, json.dumps(meta or {})))
        conn.commit()
        conn.close()

    @staticmethod
    def get_velocity_history(days: int = 7) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        since = (datetime.utcnow() - timedelta(days=days)).isoformat()
        cursor.execute("""
        SELECT timestamp, metric, value, meta FROM snapshots
        WHERE timestamp >= ? ORDER BY timestamp ASC
        """, (since,))
        rows = cursor.fetchall()
        conn.close()

        history = []
        for r in rows:
            history.append({
                "timestamp": r["timestamp"],
                "metric": r["metric"],
                "value": r["value"],
                "meta": json.loads(r["meta"]) if r["meta"] else {}
            })
        return history
