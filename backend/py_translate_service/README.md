Python Translate v3 microservice

Usage

1. Install dependencies in a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure Google credentials and project id. Set one of:

- `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service account JSON file, and
- `GCP_PROJECT_ID` to your GCP project id.

3. Run the service:

```bash
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 5001
```

The service exposes `POST /v1/translate` with JSON body `{ q?: string | string[], html?: string, target: 'hi', source?: 'en' }`.

Torouter fallback

If you prefer to route translation through Torouter instead of Google Cloud Translate, set the backend env vars:

- `TOROUTER_API_URL=https://portal.torouter.ai/api/v1/chat/completions`
- `TOROUTER_API_KEY=...`
- `TOROUTER_MODEL=gpt-4o-mini` (optional)

The Node backend will use Torouter first when `TOROUTER_API_KEY` is present.
