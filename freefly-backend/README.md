# Freefly Backend (FastAPI + MongoDB)

Backend API for the Freefly Tourism & Travels website. As of this update,
the backend runs on **MongoDB via PyMongo** (previously PostgreSQL/SQLAlchemy
in Steps 2–3). This document covers setup, running, seeding, and testing
the currently-implemented **Destinations** module.

## Project structure

```
freefly-backend/
├── app/
│   ├── main.py                     # FastAPI app, CORS, health check
│   ├── config.py                   # Settings loaded from .env
│   ├── database/
│   │   ├── connection.py           # PyMongo MongoClient, db, get_collection()
│   │   └── seed_destinations.py    # Seed script for the destinations collection
│   ├── models/                     # No ORM models — MongoDB is schemaless
│   ├── schemas/
│   │   └── destination.py          # Pydantic request/response schemas
│   ├── routes/
│   │   └── destinations.py         # GET /api/destinations, GET /api/destinations/{id}
│   └── services/
│       └── destination_service.py  # PyMongo query/filter logic
├── .env                            # local secrets — gitignored, not committed
├── .env.example                    # template for .env, safe to commit
├── requirements.txt
└── README.md
```

## 1. Prerequisites

- Python 3.11+
- A running MongoDB server (local install, Docker, or MongoDB Atlas)

### macOS / Linux — local MongoDB via Docker

```bash
docker run --name freefly-mongo -p 27017:27017 -d mongo:7
```

### Windows PowerShell — local MongoDB via Docker

```powershell
docker run --name freefly-mongo -p 27017:27017 -d mongo:7
```

If you'd rather use MongoDB Atlas or a company-hosted cluster, you don't
need Docker at all — just put the connection string in `.env` (see below).

## 2. Set up the Python environment

macOS / Linux:
```bash
cd freefly-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Windows PowerShell:
```powershell
cd freefly-backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 3. Configure environment variables

A `.env` file is already present with placeholder values matching local
Docker MongoDB above (`mongodb://localhost:27017`). To point at Atlas or a
company-hosted cluster later, only this file changes — no code changes
required:

```
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-host>/?retryWrites=true&w=majority
MONGODB_DB=freefly_db
```

`.env.example` is the committable template; `.env` itself is gitignored
and must never be committed.

## 4. Seed the destinations collection

macOS / Linux:
```bash
python -m app.database.seed_destinations
```

Windows PowerShell:
```powershell
python -m app.database.seed_destinations
```

This inserts the 6 destinations already in the frontend's `src/data.js`
(Paris, Maldives, Dubai, Switzerland, Bali, Singapore) into the
`destinations` collection, and creates indexes on `(name, country)`,
`category`, and `status`. Safe to re-run — it checks `(name, country)`
before each insert and reports how many were skipped as already present.

## 5. Run the backend

macOS / Linux:
```bash
uvicorn app.main:app --reload
```

Windows PowerShell:
```powershell
uvicorn app.main:app --reload
```

- API root: http://127.0.0.1:8000/
- Interactive docs (Swagger UI): http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## 6. Verify the MongoDB connection

```bash
curl http://127.0.0.1:8000/health
```

Expected response when MongoDB is reachable:

```json
{ "api": "ok", "database": "connected" }
```

If it instead returns `"database": "unreachable"`, check:
1. Is MongoDB actually running (`docker ps`, or your Atlas cluster status)?
2. Does `MONGODB_URL` in `.env` match where MongoDB is actually listening?
3. For Atlas: has your current IP been allow-listed in Network Access?

## 7. Test the Destinations API

```bash
curl http://127.0.0.1:8000/api/destinations
curl http://127.0.0.1:8000/api/destinations/<id-from-previous-response>
curl "http://127.0.0.1:8000/api/destinations?category=Beach"
curl "http://127.0.0.1:8000/api/destinations?search=Dubai"
curl "http://127.0.0.1:8000/api/destinations?category=Beach&search=Maldives"
curl -i http://127.0.0.1:8000/api/destinations/not-a-real-id   # expect 400
curl -i http://127.0.0.1:8000/api/destinations/64f0000000000000000000ff  # valid format, expect 404
```

You can also do all of this from Swagger UI at `/docs` without curl.

## 8. Start the frontend

```bash
cd Freefly-Travel-Portfolio
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000` (configured
in `vite.config.js`), so the Destinations page's existing
`fetch('/api/destinations?...')` calls work unchanged against the new
MongoDB-backed API.

## What's intentionally NOT here yet

- No Packages, Enquiries, admin dashboard, authentication, gallery, or
  services backend — those are separate future steps
- No admin create/update/delete routes — the service functions exist in
  `destination_service.py` for future use, but nothing calls them yet
