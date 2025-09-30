#!/bin/bash

echo "🚀 Deploying RealMaker to Railway"
echo "=================================="
echo ""
echo "⚠️  FIRST: Make sure you've created 'backend' and 'frontend' services in Railway dashboard"
echo ""
read -p "Have you created both services? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please create the services first, then run this script again."
    echo "1. Open Railway dashboard"
    echo "2. Click '+ New' → 'Empty Service' → Name: 'backend'"
    echo "3. Click '+ New' → 'Empty Service' → Name: 'frontend'"
    exit 1
fi

echo ""
echo "📦 Deploying Backend..."
cd "$(dirname "$0")/server"
railway link --service backend || exit 1
railway up || exit 1

echo ""
echo "⏳ Waiting for backend to be ready..."
sleep 5

echo ""
echo "🗄️  Running database migrations..."
railway run --service backend deno task prisma:push || exit 1

echo ""
echo "🌐 Getting backend URL..."
BACKEND_URL=$(railway domain --service backend 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Could not get backend URL automatically"
    echo "Please get it manually with: cd server && railway domain --service backend"
    read -p "Enter your backend URL: " BACKEND_URL
fi

echo "Backend URL: $BACKEND_URL"

echo ""
echo "📦 Deploying Frontend..."
cd "$(dirname "$0")/client"
railway link --service frontend || exit 1

echo ""
echo "Setting frontend environment variable..."
railway variables --service frontend set EXPO_PUBLIC_API_URL="$BACKEND_URL" || exit 1

echo ""
echo "Deploying frontend..."
railway up || exit 1

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📊 Your apps are available at:"
echo "Backend:  $BACKEND_URL"
echo "Frontend: $(railway domain --service frontend 2>&1 | grep -o 'https://[^[:space:]]*' | head -1)"
echo ""
echo "View logs: railway logs --service backend (or frontend)"
echo "Dashboard: https://railway.com/project/1662a2ba-6328-43a6-906d-d8b16f913a5a"
