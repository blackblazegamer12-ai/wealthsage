# WealthSage Preview Server

## How to reproduce uncommitted artifacts
- Copy `.env.local` from the main checkout (`C:\Users\JH2712\Downloads\wealthsage\frontend\.env.local`) to `frontend/.env.local` if missing.
- Ensure `NEXT_PUBLIC_API_URL` in `.env.local` points to the Python backend port (currently `http://localhost:3000`).
- `cd frontend && npm install` (already present in this workspace).

## How to run the servers

### Python Backend (port 3000)
```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 3000
```
- Backend uses `ALLOWED_ORIGINS=*` in development mode for any frontend port.

### Next.js Frontend (dynamic port)
```powershell
cd C:\Users\JH2712\Downloads\wealthsage\frontend
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\JH2712\Downloads\wealthsage\frontend' -RedirectStandardOutput 'C:\Users\JH2712\Downloads\wealthsage\.freebuff\preview-91c43e66-27ff-4666-b50a-6b35466b83c1.log' -RedirectStandardError 'C:\Users\JH2712\Downloads\wealthsage\.freebuff\preview-91c43e66-27ff-4666-b50a-6b35466b83c1.log.err' -WindowStyle Hidden -PassThru).Id"
```
- Port: dynamically assigned by Next.js (currently 60701).
- Logs: `.freebuff/preview-91c43e66-27ff-4666-b50a-6b35466b83c1.log` (stdout) and `.log.err` (stderr).
- `next.config.ts` includes `turbopack: {}` to fix Next.js 16 Turbopack/webpack conflict.
- `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3000` matching the Python backend.

## Notes
- Supabase is configured with real credentials in `.env.local`.
- Demo mode works without backend (client-side fallback AI in `/api/chat`).
- Full CRUD: transactions, goals, subscriptions, notes, chat — all persist to Supabase.
- Full ledger reset clears all 5 tables via `/api/reset`.
