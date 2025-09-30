# Docker Deployment Guide

This project uses Docker for both client and server deployments, providing full control over the build process and runtime environment.

## Architecture

### Client (Frontend)
- **Build Stage**: Node.js 20 Alpine - Builds Expo web app to static files
- **Runtime Stage**: Nginx Alpine - Serves static files with optimized configuration
- **Port**: 80 (Railway will map to their $PORT)

### Server (Backend)
- **Runtime**: Deno 2.1.4 Alpine - Runs Deno with Prisma
- **Database**: PostgreSQL (managed by Railway)
- **Port**: 8000 (Railway will override with $PORT)

## Dockerfiles Overview

### Client Dockerfile (`client/Dockerfile`)

```dockerfile
# Multi-stage build:
# 1. Build Expo web app with Node.js
# 2. Serve static files with nginx
```

**What it does:**
1. Installs Node.js dependencies
2. Builds Expo web to `dist/` directory
3. Copies static files to nginx
4. Serves with optimized nginx configuration
5. Includes health check endpoint at `/health`

**Features:**
- ✅ Gzip compression
- ✅ Static asset caching (1 year)
- ✅ SPA routing support (Expo Router)
- ✅ Security headers
- ✅ Health check endpoint

### Server Dockerfile (`server/Dockerfile`)

```dockerfile
# Single-stage build:
# Deno runtime with Prisma client generation
```

**What it does:**
1. Installs Deno runtime
2. Generates Prisma client
3. Caches all dependencies
4. Starts Deno server

**Features:**
- ✅ Prisma ORM with PostgreSQL
- ✅ Dependency caching for faster rebuilds
- ✅ Health check endpoint
- ✅ Production-optimized

## Local Development with Docker

### Build and Run Locally

**Client:**
```bash
cd client
docker build -t realmaker-client .
docker run -p 3000:80 realmaker-client
# Visit: http://localhost:3000
```

**Server:**
```bash
cd server
docker build -t realmaker-server .
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  realmaker-server
# Visit: http://localhost:8000
```

### Using Docker Compose (Development)

Create a `docker-compose.dev.yml` at project root:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: realmaker
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build: ./server
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/realmaker
      PORT: 8000
    depends_on:
      - postgres

  client:
    build: ./client
    ports:
      - "3000:80"
    environment:
      EXPO_PUBLIC_API_URL: http://localhost:8000

volumes:
  postgres_data:
```

Run with:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Railway Deployment

Railway automatically detects and uses Dockerfiles when present.

### Initial Setup

1. **Connect GitHub Repo to Railway Services**
   - Go to your [Railway project](https://railway.com/project/1662a2ba-6328-43a6-906d-d8b16f913a5a)
   - For each service (server, client), connect to `EnzoBarbon/realmaker-app`
   - Set root directories:
     - Server service → Root: `server`
     - Client service → Root: `client`

2. **Railway will automatically:**
   - Detect the Dockerfile in each directory
   - Build the Docker image
   - Deploy to Railway's infrastructure
   - Map Railway's $PORT to the container

3. **Set Environment Variables**

   **Server:**
   - `DATABASE_URL` - Auto-set by Railway when Postgres is linked
   - `PORT` - Auto-set by Railway

   **Client:**
   - Build-time variables are baked into the static build
   - Set `EXPO_PUBLIC_API_URL` before building

### Deploy Updates

Push to main branch:
```bash
git add .
git commit -m "your changes"
git push origin main
```

Railway automatically rebuilds and redeploys both services.

## Environment Variables

### Client (Build-time)

Set in Railway dashboard **before building**:
```bash
EXPO_PUBLIC_API_URL=https://your-backend.up.railway.app
```

These are embedded into the static build during `npm run build:web`.

### Server (Runtime)

Set in Railway dashboard:
```bash
DATABASE_URL=postgresql://...  # Auto-set by Railway
PORT=8000                       # Auto-set by Railway
```

Optional (add as needed):
```bash
OPENROUTER_API_KEY=your_key
JWT_SECRET=your_secret
```

## Health Checks

Both services include health check endpoints:

**Client:**
```bash
curl http://your-client-url/health
# Returns: healthy
```

**Server:**
```bash
curl http://your-server-url/health
# Returns: API health status
```

Railway uses these for monitoring and zero-downtime deployments.

## Nginx Configuration

The client uses a custom nginx configuration (`client/nginx.conf`) that includes:

- **SPA Routing**: All routes fall back to `index.html`
- **Gzip Compression**: Reduces bundle sizes
- **Caching**: Static assets cached for 1 year
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Health Check**: `/health` endpoint for monitoring

To customize, edit `client/nginx.conf` and redeploy.

## Troubleshooting

### Client Issues

**Build fails:**
```bash
# Check if dist/ is being generated
docker build --progress=plain -t test-client ./client
```

**Nginx issues:**
```bash
# Test nginx config locally
docker run -it --entrypoint sh test-client
nginx -t
```

**Routes not working:**
- Verify `try_files $uri $uri/ /index.html;` is in nginx.conf
- Check Expo Router is properly configured

### Server Issues

**Prisma generation fails:**
```bash
# Check Prisma schema
docker build --progress=plain -t test-server ./server
```

**Database connection issues:**
- Verify DATABASE_URL is set correctly
- Ensure Postgres service is running
- Check network connectivity between services

**Port issues:**
- Deno listens on the port from Deno.env.get('PORT') || '8000'
- Railway injects $PORT automatically

### View Logs

In Railway dashboard or CLI:
```bash
railway logs --service server
railway logs --service client
```

## Production Optimization

### Client
- ✅ Multi-stage build (small final image ~50MB)
- ✅ Nginx Alpine (minimal footprint)
- ✅ Static asset caching
- ✅ Gzip compression
- ✅ Security headers

### Server
- ✅ Deno Alpine (lightweight)
- ✅ Dependency caching
- ✅ Prisma client pre-generated
- ✅ Health checks

## Comparison: Docker vs Nixpacks

| Feature | Docker | Nixpacks |
|---------|--------|----------|
| **Control** | Full control over build | Limited configuration |
| **Caching** | Multi-stage, layer caching | Basic caching |
| **Web Server** | nginx (production-ready) | serve (dev tool) |
| **Optimization** | Custom optimizations | Auto-detected |
| **Debugging** | Can run locally easily | Railway-specific |
| **Flexibility** | Highly customizable | Convention-based |

**Why Docker for this project:**
- ✅ Nginx is production-grade vs serve (development tool)
- ✅ Full control over build process
- ✅ Can run identical builds locally
- ✅ Better caching strategies
- ✅ Industry standard

## Files Created

```
client/
├── Dockerfile          # Multi-stage: Node build + nginx serve
├── nginx.conf         # Production nginx configuration
└── .dockerignore      # Files to exclude from build

server/
├── Dockerfile         # Deno runtime + Prisma
└── .dockerignore     # Files to exclude from build
```

## Migration from Nixpacks

If you were using nixpacks before:
1. ✅ Dockerfiles created
2. ✅ nixpacks.toml removed
3. ✅ Railway auto-detects Dockerfiles
4. ✅ Next push will use Docker

No additional configuration needed!

---

**Your Live Deployment:**
- Backend: https://server-production-a343.up.railway.app
- Frontend: https://client-production-06cf.up.railway.app
- Dashboard: https://railway.com/project/1662a2ba-6328-43a6-906d-d8b16f913a5a
