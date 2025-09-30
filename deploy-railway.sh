#!/bin/bash

# Railway Deployment Helper Script for RealMaker
# This script helps deploy both client and server to Railway

set -e

echo "🚂 RealMaker Railway Deployment Helper"
echo "========================================"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed."
    echo "Install it with: npm i -g @railway/cli"
    exit 1
fi

# Check if logged in to Railway
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway."
    echo "Please run: railway login"
    exit 1
fi

echo "✅ Railway CLI is installed and you're logged in"
echo ""

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to deploy server
deploy_server() {
    echo "📦 Deploying Backend Server..."
    cd "$ROOT_DIR/server"
    
    # Check if already linked
    if [ ! -f ".railway/railway.toml" ]; then
        echo "🔗 Linking server to Railway project..."
        railway link
    fi
    
    echo "🚀 Deploying server..."
    railway up --detach
    
    echo "✅ Backend deployed!"
    echo ""
}

# Function to deploy client
deploy_client() {
    echo "🌐 Deploying Frontend Client..."
    cd "$ROOT_DIR/client"
    
    # Check if already linked
    if [ ! -f ".railway/railway.toml" ]; then
        echo "🔗 Linking client to Railway project..."
        railway link
    fi
    
    echo "🚀 Deploying client..."
    railway up --detach
    
    echo "✅ Frontend deployed!"
    echo ""
}

# Function to add PostgreSQL
add_postgres() {
    echo "🐘 Adding PostgreSQL Database..."
    cd "$ROOT_DIR/server"
    railway add --database postgres
    echo "✅ PostgreSQL added!"
    echo ""
}

# Function to run migrations
run_migrations() {
    echo "🔄 Running database migrations..."
    cd "$ROOT_DIR/server"
    railway run deno task prisma:push
    echo "✅ Migrations completed!"
    echo ""
}

# Main menu
echo "What would you like to do?"
echo "1) Full deployment (database + backend + frontend)"
echo "2) Deploy backend only"
echo "3) Deploy frontend only"
echo "4) Add PostgreSQL database"
echo "5) Run database migrations"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting full deployment..."
        echo ""
        add_postgres
        deploy_server
        echo "⏳ Waiting 10 seconds for backend to initialize..."
        sleep 10
        run_migrations
        deploy_client
        echo ""
        echo "🎉 Full deployment complete!"
        echo "📝 Remember to set EXPO_PUBLIC_API_URL in the client service environment variables"
        echo "   to point to your backend URL."
        ;;
    2)
        echo ""
        deploy_server
        echo "🎉 Backend deployment complete!"
        ;;
    3)
        echo ""
        deploy_client
        echo "🎉 Frontend deployment complete!"
        ;;
    4)
        echo ""
        add_postgres
        echo "🎉 Database added!"
        ;;
    5)
        echo ""
        run_migrations
        echo "🎉 Migrations complete!"
        ;;
    6)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📊 View your deployment at: https://railway.app"
echo "📖 For more details, see: RAILWAY_DEPLOYMENT.md"
