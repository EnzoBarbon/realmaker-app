# 🚀 Deploy RealMaker to Railway - Do This Now

Your Railway dashboard should be open. Follow these steps:

## ✅ You've Already Done:
- ✓ Railway CLI installed
- ✓ Logged in to Railway
- ✓ Project created: `realmaker-app`
- ✓ PostgreSQL database added

## 📋 Next Steps in Railway Dashboard:

### Step 1: Create Backend Service

1. In your Railway dashboard, click **"+ New"**
2. Select **"Empty Service"**
3. Name it: **`backend`**
4. Click on the **`backend`** service
5. Go to **"Settings"** tab
6. Under **"Source"**, click **"Connect Repo"** (or you can deploy directly from local)

**OR deploy from local CLI:**
```bash
cd server
railway link --service backend
railway up
```

### Step 2: Wait for Backend to Deploy

The backend will:
- Install Deno
- Generate Prisma client
- Start the server
- Be assigned a URL like: `https://backend-production-xxxx.up.railway.app`

### Step 3: Run Database Migrations

Once backend is deployed:
```bash
cd /Users/enzobl/repos/realmaker/realmaker-app/server
railway run --service backend deno task prisma:push
```

### Step 4: Create Frontend Service

1. In Railway dashboard, click **"+ New"** again
2. Select **"Empty Service"**
3. Name it: **`frontend`** or **`client`**
4. Deploy from local:

```bash
cd /Users/enzobl/repos/realmaker/realmaker-app/client
railway link --service frontend
railway up
```

### Step 5: Connect Frontend to Backend

1. Get your backend URL:
```bash
cd /Users/enzobl/repos/realmaker/realmaker-app/server
railway domain --service backend
```

2. Set it in frontend environment:
   - In Railway dashboard, go to **frontend service**
   - Click **"Variables"** tab
   - Add: `EXPO_PUBLIC_API_URL` = `<your-backend-url>`

3. Redeploy frontend:
```bash
cd /Users/enzobl/repos/realmaker/realmaker-app/client
railway up --service frontend
```

### Step 6: Generate Domains

Get your URLs:
```bash
# Backend URL
cd /Users/enzobl/repos/realmaker/realmaker-app/server
railway domain --service backend

# Frontend URL
cd /Users/enzobl/repos/realmaker/realmaker-app/client
railway domain --service frontend
```

## 🎯 Alternative: Quick CLI Deploy

If services are already created in dashboard, use these commands:

```bash
# Deploy Backend
cd /Users/enzobl/repos/realmaker/realmaker-app/server
railway link --service backend
railway up
railway run deno task prisma:push

# Deploy Frontend
cd /Users/enzobl/repos/realmaker/realmaker-app/client
railway link --service frontend
railway variables --service frontend set EXPO_PUBLIC_API_URL=<backend-url>
railway up
```

## 📊 Verify Deployment

Check logs:
```bash
railway logs --service backend
railway logs --service frontend
```

Check status:
```bash
railway status
```

## 🎉 You're Done!

Your apps will be live at:
- Frontend: `https://frontend-production-xxxx.up.railway.app`
- Backend: `https://backend-production-xxxx.up.railway.app`

---

**Current Status:** Dashboard is open - create the services there, then come back to run the deploy commands!
