# RunningAwayWithIt 🏃

A personal running tracker built to learn modern full-stack development — Node.js, React, PostgreSQL, and AWS.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL (Docker) + Knex |
| Auth | JWT |
| Maps | Leaflet |
| GPS | Strava API |

---

## Running Locally

### Prerequisites
- Docker (I am using via WSL)
- Node.js (via NVM)

### 1. Start the database
```bash
# From WSL Ubuntu
cd /mnt/g/Personal/RunningAwayWithit
docker compose up -d
```

### 2. Run migrations and seed data
```bash
cd server
npx knex migrate:latest
npx knex seed:run
```

### 3. Start the server
```bash
cd server
npm run dev
# Runs on http://localhost:3085
```

### 4. Start the client
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables

Create `server/.env`:

```
DATABASE_URL=postgres://...
JWT_SECRET=your_secret
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REDIRECT_URI=http://localhost:3085/auth/strava/callback
CLIENT_URL=http://localhost:5173
```

---

## Roadmap

- [x] Express server scaffold
- [x] React + Vite client scaffold
- [x] PostgreSQL via Docker
- [x] JWT authentication
- [x] Runs CRUD
- [x] Stat summary
- [x] TypeScript migration
- [x] Multi-relational schema (shoes, routes, goals)
- [ ] GPS integration via Strava OAuth ← *in progress*
- [ ] Map visualisation with Leaflet
- [ ] Elevation profiles
- [ ] Route comparison (same course, different times)
- [ ] Strava webhook (auto-import new runs)
- [ ] Jest test suite (service layer and auth, post-MVP)
- [ ] AWS deployment
- [ ] CI/CD with GitHub Actions
- [ ] Deck.gl migration (if 3D/terrain viz needed later)

---

## Notes

- Seed credentials: `test@test.com` / `password123`
- Port 3000 is excluded on dev machine — server runs on 3085
