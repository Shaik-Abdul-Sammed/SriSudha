# Sri Sudha Backend

Express + PostgreSQL backend for persistent app data.

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

3. Create database schema:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

4. Start server:

```bash
npm run dev
```

## Request example

```bash
curl -X POST http://localhost:4000/api/search/recent \
  -H "Content-Type: application/json" \
  -d '{"role":"student","query":"Attendance Overview","routePath":"/student-dashboard/attendance-overview"}'
```
