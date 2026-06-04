# Sri Venkateswara Backend

Express backend for educational ERP data with optional PostgreSQL persistence.

## Features
- Health endpoint: `GET /api/health`
- Search recent persistence:
  - `GET /api/search/recent?role=student`
  - `POST /api/search/recent`

## Setup
1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env
```

3. Create database schema only if you are using PostgreSQL:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

4. Start server:

```bash
npm run dev
```

If `DATABASE_URL` is unset, the backend uses the in-memory fallback for recent search and backup routes, so no local Postgres instance is required.

## Request example

```bash
curl -X POST http://localhost:4000/api/search/recent \
  -H "Content-Type: application/json" \
  -d '{"role":"student","query":"Attendance Overview","routePath":"/student-dashboard/attendance-overview"}'
```
