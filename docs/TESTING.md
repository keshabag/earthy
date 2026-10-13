# Testing Guide

## Prerequisites

- Python and the backend virtual environment
- Backend dependencies installed
- Development dependencies installed

## Run the automated tests

From the project root:

```bash
source backend/.venv/bin/activate
pip install -r backend/requirements-dev.txt
python -m pytest backend/tests -v
```

If the backend's regular dependencies are not installed yet, install them using:

```bash
pip install -r backend/requirements.txt
```

## Current test coverage

The automated tests cover:

- Health endpoint response
- Listing foods and retrieving a known food
- Handling unknown food IDs
- Nutrition calculations for a 100-gram portion
- Rejecting empty ingredient lists
- Rejecting zero and negative portion sizes
- Rejecting non-image and empty photo uploads

The automated tests do not require a live Gemini API call.

## Manual photo-analysis testing

1. Configure `GEMINI_API_KEY` in `backend/.env`.
2. Start the backend server.
3. Open `http://127.0.0.1:8000/docs`.
4. Test `POST /meals/analyze-photo` with a valid food image.
5. Verify the returned food estimates and confirm the portions before relying on the nutrition calculation.

## Limitations

Passing automated tests confirms the tested API behavior; it does not establish clinical accuracy of nutrition estimates or guarantee that every possible input is handled correctly.
