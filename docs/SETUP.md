# Earthy — Local Setup Guide

This guide explains how to download, configure, run, and test Earthy on your local computer.

## 1. Prerequisites

Install the following software before proceeding:

- **Git** — to clone the repository.
- **Python** — to run the FastAPI backend.
- **Node.js (LTS)** — to run the Next.js frontend. npm is included with Node.js.
- **Gemini API key** — required for AI-powered food photo analysis. Other features may work without it, depending on their implementation.

Verify your installations:

```bash
git --version
python --version
node --version
npm --version
```

On systems where Python is exposed as `python3`, use `python3` instead of `python`.

## 2. Clone the repository

Open a terminal and run:

```bash
git clone https://github.com/keshabag/earthy.git
cd earthy
```

## 3. Set up the backend

Move into the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate it on Linux or macOS:

```bash
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a local environment configuration file:

```bash
cp .env.example .env
```

Open `.env` in a text editor and replace the placeholder API key with your own Gemini API key.

Example configuration:

```dotenv
GEMINI_API_KEY=your_own_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

Use the model name supported by the project's configuration and your Gemini API access. Never commit `.env` or share your API key publicly.

For Windows, create the environment file using:

```powershell
Copy-Item .env.example .env
```

## 4. Start the backend server

From the `backend` directory, run:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:

- API base URL: `http://127.0.0.1:8000`
- Interactive API documentation: `http://127.0.0.1:8000/docs`

Keep this terminal open while using Earthy.

## 5. Set up the frontend

Open a second terminal. From the repository root, run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

`http://localhost:3000`

Keep both the backend and frontend terminals running.

## 6. Verify the installation

Open the website in your browser and check that the pages load correctly.

Verify the backend health endpoint:

```bash
curl http://127.0.0.1:8000/health
```

The expected response is:

```json
{"status":"healthy"}
```

You can also open `http://127.0.0.1:8000/docs` to inspect and try the available API endpoints.

Test the main features:

- Create or update a user profile.
- Log a meal and inspect its nutrition information.
- Review meal history.
- Upload a food photo and verify the detected foods and portion estimates.

Photo analysis requires a valid Gemini API configuration and internet access.

## 7. Run the automated backend tests

Open a third terminal:

```bash
cd backend
```

Activate the virtual environment if necessary:

```bash
source .venv/bin/activate
```

Install development dependencies:

```bash
pip install -r requirements-dev.txt
```

Run the tests:

```bash
python -m pytest tests -v
```

The tests cover API health, food lookup, nutrition calculations, invalid portions, and invalid photo uploads. They should not require a live Gemini API call.

## 8. Troubleshooting

### `uvicorn: command not found`

Ensure the backend virtual environment is activated and install the backend dependencies.

### Frontend cannot connect to the backend

Confirm that the backend is running on port `8000` and the frontend is running on port `3000`. Check the browser console and backend terminal for errors.

### Photo analysis fails

Check that your `.env` contains a valid Gemini API key, the configured model is available to your account, and your internet connection works. Restart the backend after changing `.env`.

### Port already in use

Stop the process using the port or configure the application to use another port. If you change the backend port, ensure the frontend is configured to use the new address.

### Dependency installation fails

Check your Python and Node.js versions, verify your internet connection, and review the terminal error before retrying.

## 9. Data storage and privacy

Earthy currently stores profile and meal-history data in browser local storage. This data is browser-specific and is not automatically synchronized across devices.

Food photo analysis sends the uploaded image to Google's Gemini service for processing. Do not upload sensitive personal images or information.

Nutrition values and AI-generated portion estimates are approximate and should not be treated as medical advice.

## 10. Project documentation

- [README](../README.md) — overview, features, and quick start.
- [Architecture](ARCHITECTURE.md) — system design and data flow.
- [Testing Guide](TESTING.md) — automated tests and manual testing.

For bugs or suggestions, open an issue in the GitHub repository.
