# Railway GitHub Deployment Setup

## Quick Setup Steps

### 1. Connect Server to GitHub

1. Open [Railway Project](https://railway.com/project/1662a2ba-6328-43a6-906d-d8b16f913a5a)
2. Click **"server"** service
3. Settings → Source → **"Connect Repo"**
4. Select: `EnzoBarbon/realmaker-app`
5. Root Directory: `server`
6. Branch: `main`
7. Click **"Deploy"**

### 2. Connect Client to GitHub

1. Click **"client"** service
2. Settings → Source → **"Connect Repo"**
3. Select: `EnzoBarbon/realmaker-app`
4. Root Directory: `client`
5. Branch: `main`
6. Click **"Deploy"**

### 3. Verify Environment Variables

#### Client Service:
- ✅ `EXPO_PUBLIC_API_URL` = `https://server-production-a343.up.railway.app`

#### Server Service:
- ✅ `DATABASE_URL` (auto-set by Railway from Postgres service)
- ✅ `PORT` (auto-set by Railway)

### 4. Run Database Migrations (After Server Deploys)

```bash
cd /Users/enzobl/repos/realmaker/realmaker-app/server
railway run --service server deno task prisma:push
```

## What Happens Next

1. **Server builds** → Railway detects `nixpacks.toml`:
   - Installs Deno
   - Generates Prisma client
   - Starts server on Railway's PORT

2. **Client builds** → Railway detects `nixpacks.toml`:
   - Installs Node.js
   - Runs `npm ci`
   - Builds Expo web with `npm run build:web`
   - Serves static files from `dist/`

3. **Auto-deploy on push** → Every push to `main` triggers rebuild

## Troubleshooting

### Check Build Logs
In Railway dashboard → Service → "Deployments" tab → Click deployment → View logs

### Service Not Building?
- Verify GitHub connection is active
- Check root directory is set correctly (`server` or `client`)
- Ensure `nixpacks.toml` exists in the root directory

### Database Connection Issues
- Verify `DATABASE_URL` is in server environment variables
- Check Postgres service is running
- Run migrations after first deploy

### Frontend Can't Reach Backend
- Verify `EXPO_PUBLIC_API_URL` is set in client variables
- Check backend URL is accessible (visit in browser)
- Redeploy client after setting env variable

## Your Live URLs

- **Backend API**: https://server-production-a343.up.railway.app
- **Frontend App**: https://client-production-06cf.up.railway.app
- **Dashboard**: https://railway.com/project/1662a2ba-6328-43a6-906d-d8b16f913a5a

## Deployment Architecture

```
GitHub (main branch)
    ↓ (push triggers)
    ↓
Railway Project
    ├─→ Postgres (managed database)
    │
    ├─→ Server (server/ directory)
    │   └─→ nixpacks.toml → Deno + Prisma
    │   └─→ https://server-production-a343.up.railway.app
    │
    └─→ Client (client/ directory)
        └─→ nixpacks.toml → Node + Expo
        └─→ https://client-production-06cf.up.railway.app
```
