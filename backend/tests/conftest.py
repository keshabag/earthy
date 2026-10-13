
import os
import sys
from pathlib import Path

# Prevent tests from needing a real Gemini API key.
os.environ.setdefault("GEMINI_API_KEY", "test-key-not-used")

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
