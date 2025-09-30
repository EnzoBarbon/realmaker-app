# Railway Deployment Guide

This guide will help you deploy both the client (web) and server components of RealMaker to Railway.

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. Railway CLI installed and logged in:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

## Architecture

Your deployment will consist of three Railway services:

1. **PostgreSQL Database** - Managed PostgreSQL instance
2. **Backend Server** - Deno application
3. **Frontend Client** - Static Expo web build

## Step 1: Create Railway Project

```bash
cd /Users/enzobl/repos/realmaker/realmaker-app
railway init
```

Follow the prompts to create a new project.

## Step 2: Add PostgreSQL Database

In the Railway dashboard or CLI:

```bash
railway add
# Select "PostgreSQL" from the list
```

Railway will automatically provision a PostgreSQL database and set the `DATABASE_URL` environment variable.

## Step 3: Deploy Backend Server

```bash
cd server
railway link  # Link to your project
railway up    # Deploy the server
```

### Environment Variables for Backend

The server needs these environment variables (set in Railway dashboard):

**Required:**

- `DATABASE_URL` - Automatically set by Railway when you add PostgreSQL
- `PORT` - Automatically set by Railway (defaults to 8000 in development)

**Optional (add as needed):**

- `OPENROUTER_API_KEY` - If using OpenRouter for LLM services
- `JWT_SECRET` - For authentication
- Any other API keys or secrets your server requires

## Step 4: Deploy Frontend Client

```bash
cd ../client
railway link  # Link to the same project
railway up    # Deploy the client
```

### Environment Variables for Frontend

If your client needs to connect to the backend, set:

- `EXPO_PUBLIC_API_URL` - URL of your deployed backend (e.g., https://your-backend.railway.app)

**Important:** Only variables prefixed with `EXPO_PUBLIC_` are available in the Expo web build.

You can add this to Railway's environment variables for the client service.

After adding environment variables, redeploy:

```bash
railway up --detach
```

## Step 5: Run Database Migrations

After the backend is deployed, run Prisma migrations:

```bash
cd server
railway run deno task prisma:push
# Or for production migrations:
railway run deno task prisma:migrate
```

## Step 6: Generate Domains

Railway will automatically generate domains for your services. You can:

1. View them in the Railway dashboard
2. Add custom domains if you have one

Your services will be available at:

- Frontend: `https://your-frontend-service.up.railway.app`
- Backend: `https://your-backend-service.up.railway.app`

## Configuration Files Created

- `client/nixpacks.toml` - Builds the Expo web app and serves it
- `server/nixpacks.toml` - Configures Deno runtime and Prisma
- `client/.railwayignore` - Files to exclude from client deployment
- `server/.railwayignore` - Files to exclude from server deployment

## Updating Your Deployment

To deploy updates:

```bash
# For backend changes:
cd server
railway up

# For frontend changes:
cd client
railway up
```

Railway will automatically:

- Build your application
- Run migrations (if configured)
- Deploy to production
- Generate new URLs if needed

## Connecting Frontend to Backend

Update your frontend code to use the backend URL. In your client code, you can access it via:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
```

Set `EXPO_PUBLIC_API_URL` in Railway's environment variables for the client service.

## Troubleshooting

### View Logs

```bash
railway logs
```

### Check Service Status

```bash
railway status
```

### Access Database

```bash
railway connect postgres
```

### Common Issues

1. **Build failures**: Check the logs with `railway logs --deployment`
2. **Database connection issues**: Verify `DATABASE_URL` is set correctly
3. **Port issues**: Railway sets `PORT` automatically, ensure your app uses it
4. **Environment variables**: Double-check all required env vars are set

## Production Checklist

- [ ] Database migrations run successfully
- [ ] Backend health check endpoint working
- [ ] Frontend loads and displays correctly
- [ ] Frontend can communicate with backend
- [ ] All environment variables configured
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled (automatic on Railway)
- [ ] Error logging/monitoring set up (optional)

## Cost Considerations

Railway offers:

- Free tier: $5 credit per month
- Hobby plan: $5/month + usage
- Pro plan: Starting at $20/month

Monitor your usage in the Railway dashboard.

## Support

- Railway Docs: https://docs.railway.com
- Railway Discord: https://discord.gg/railway
- Railway Status: https://status.railway.app
