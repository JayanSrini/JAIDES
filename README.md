# JAIDES LLC

Standalone FastAPI + React project for a clean, professional JAIDES LLC marketing site.

## Structure

- `backend/` FastAPI API serving placeholder company profile data
- `frontend/` React + Vite frontend with a jade-toned multi-view experience
- `render.yaml` Render deployment config for the backend
- `frontend/vercel.json` Vercel deployment config for the frontend

## Run locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will run at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The site will run at `http://127.0.0.1:5173`.

## Deploy for a real link

### Backend on Render

1. Push this project to GitHub.
2. In Render, create a new Blueprint or Web Service from the repo.
3. Point Render at `render.yaml` in the project root.
4. Set `FRONTEND_ORIGINS` to your future Vercel URL, for example:

```text
https://jaides-llc.vercel.app
```

5. Deploy the service and copy the backend URL, which will look like:

```text
https://jaides-llc-api.onrender.com
```

### Frontend on Vercel

1. Import the same GitHub repo into Vercel.
2. Set the Vercel root directory to `frontend`.
3. Add an environment variable named `VITE_API_BASE_URL`.
4. Set it to your Render backend URL, for example:

```text
https://jaides-llc-api.onrender.com
```

5. Deploy the site.

### Final connection step

After Vercel gives you the public frontend URL, add that exact URL back into Render as `FRONTEND_ORIGINS` and redeploy the backend once more.

That gives you a real public frontend link and a real public backend API.
