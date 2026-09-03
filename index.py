"""
Vercel entry point.

Vercel's Python runtime looks for an ASGI `app` object inside api/index.py.
This file does not duplicate any logic — it just re-exports the exact same
FastAPI app object from app.py at the repo root, so app.py itself stays
identical to the version running on every other doorway.
"""

import os
import sys

# app.py and prompt.py live one folder up from here (the repo root).
# Vercel runs this file directly, so Python doesn't automatically know
# to look there — this line tells it to.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import app  # noqa: E402,F401  (re-exported for Vercel to find)
