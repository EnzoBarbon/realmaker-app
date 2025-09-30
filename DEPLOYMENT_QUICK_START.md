# 🚀 Railway Deployment - Quick Start

## Prerequisites

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login
```

## One-Command Deployment

```bash
./deploy-railway.sh
```

Choose option **1** for full deployment (database + backend + frontend).

## Manual Deployment Steps

### 1️⃣ Create Project & Add Database

```bash
railway init
railway add  # Select PostgreSQL
```

### 2️⃣ Deploy Backend

```bash
cd server
railway link
railway up
railway run deno task prisma:push
```

### 3️⃣ Deploy Frontend

```bash
cd ../client
railway link
railway up
```

### 4️⃣ Configure Environment Variables

In Railway dashboard, set for **client service**:

- `EXPO_PUBLIC_API_URL` = Your backend URL (e.g., `https://your-backend.up.railway.app`)

Backend automatically gets:

- `DATABASE_URL` (from PostgreSQL service)
- `PORT` (Railway default)

### 5️⃣ Access Your Apps

Railway generates URLs automatically:

- Frontend: `https://your-client.up.railway.app`
- Backend: `https://your-backend.up.railway.app`

## Update Deployments

```bash
# Update backend
cd server && railway up

# Update frontend
cd client && railway up
```

## Useful Commands

```bash
railway logs              # View logs
railway status            # Check status
railway open              # Open in browser
railway connect postgres  # Connect to database
railway variables         # View environment variables
```

## Troubleshooting

| Issue                      | Solution                                      |
| -------------------------- | --------------------------------------------- |
| Build fails                | Check `railway logs` for errors               |
| Client can't reach backend | Set `EXPO_PUBLIC_API_URL` in client env vars  |
| Database connection fails  | Verify `DATABASE_URL` is set in backend       |
| Port issues                | Railway auto-sets `PORT` - ensure app uses it |

## Architecture

```
┌─────────────────┐
│   PostgreSQL    │
│   (Railway)     │
└────────┬────────┘
         │
         │ DATABASE_URL
         │
┌────────┴────────┐
│  Deno Backend   │
│  (Railway)      │
└────────┬────────┘
         │
         │ EXPO_PUBLIC_API_URL
         │
┌────────┴────────┐
│  Expo Web App   │
│  (Railway)      │
└─────────────────┘
```

## Files Created

- ✅ `client/nixpacks.toml` - Client build config
- ✅ `server/nixpacks.toml` - Server build config
- ✅ `client/.railwayignore` - Client exclusions
- ✅ `server/.railwayignore` - Server exclusions
- ✅ `deploy-railway.sh` - Deployment helper script

## Next Steps

1. ✅ Deploy your apps
2. ⚙️ Configure environment variables
3. 🔐 Add custom domain (optional)
4. 📊 Monitor logs and metrics
5. 🎉 Share your app!

---

📖 **Full Guide:** [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)  
📚 **Project Docs:** [README.md](./README.md)
