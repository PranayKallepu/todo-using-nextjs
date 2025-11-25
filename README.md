# ToDo-Task

A simple ToDo application with a Next.js frontend and an Express + TypeScript backend using Prisma for the database layer.

## Repository Structure

- `backend/` — Express + TypeScript API, Prisma ORM
- `frontend/` — Next.js React app

## Prerequisites

- Node.js v18+ (recommended)
- npm (or pnpm/yarn)
- A database supported by Prisma (set `DATABASE_URL` in the backend `.env`)

## Setup

1. Backend

```bash
cd backend
npm install
# create a `.env` file with at least `DATABASE_URL` and any API keys the app requires
# generate Prisma client and run migrations (development):
npx prisma generate
npx prisma migrate dev
npm run dev
```

The backend server runs on `http://localhost:5000` by default.

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js app runs on `http://localhost:3000` by default.

## Running the App

Start the backend and frontend in separate terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Frontend requests the API under `/api/*` — adjust the API base URL if you change backend port or deploy separately.

## Database / Prisma

- Prisma is used for schema and migrations. See `prisma/schema.prisma` and `prisma/migrations/` in the `backend` folder.
- For production, use `npx prisma migrate deploy` after setting `DATABASE_URL`.

## Helpful Scripts

- Backend: `npm run dev` (development), `npm run build`, `npm run start`
- Frontend: `npm run dev`, `npm run build`, `npm run start`

## Notes

- Ensure environment variables (database URL, any API keys) are set in `backend/.env` before starting.
- If the backend uses services like OpenAI, set those API keys in the `.env` as well.

## License

Specify license here (e.g., MIT) or remove this section if not applicable.

---

If you'd like, I can also create a `backend/.env.example` file, add a short contributor section, or wire up a single-command dev script to run both apps concurrently.
