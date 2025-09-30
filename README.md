# RealMaker App

A full-stack real estate management application built with Expo (React Native + Web) and Deno.

## 🏗️ Project Structure

```
realmaker-app/
├── client/          # Expo app (iOS, Android, Web)
│   ├── app/        # Expo Router pages
│   ├── components/ # Reusable UI components
│   ├── features/   # Feature-specific components
│   └── models/     # TypeScript domain models
│
├── server/         # Deno backend
│   ├── src/        # Source code
│   ├── prisma/     # Database schema and migrations
│   └── docker/     # Docker configuration
│
└── deploy-railway.sh  # Railway deployment helper
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (for client)
- Deno 2+ (for server)
- PostgreSQL 17+ (for database)

### Client Development

```bash
cd client
npm install
npm run web        # Start web development server
npm run ios        # Start iOS development
npm run android    # Start Android development
```

The client uses:

- **Expo Router** for navigation
- **NativeWind** (Tailwind CSS) for styling
- **React Native Web** for web support
- Responsive design with sidebar (web) and bottom tabs (mobile)

### Server Development

```bash
cd server
deno task dev      # Start development server with hot reload
```

The server uses:

- **Deno 2** runtime
- **Prisma** for database ORM
- **PostgreSQL** database
- Edge function architecture

### Database Setup

1. Start PostgreSQL with Docker:

```bash
cd server
docker-compose up -d
```

2. Run migrations:

```bash
deno task prisma:push
```

3. (Optional) Open Prisma Studio:

```bash
deno task prisma:studio
```

## 📦 Deployment

### Deploy to Railway

1. Install Railway CLI:

```bash
npm i -g @railway/cli
```

2. Log in to Railway:

```bash
railway login
```

3. Run the deployment helper:

```bash
./deploy-railway.sh
```

Or follow the manual steps in [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md).

The deployment will create:

- PostgreSQL database
- Backend API service (Deno)
- Frontend web app (Expo static build)

## 🛠️ Technology Stack

### Frontend

- **Expo SDK 54** - Cross-platform app framework
- **React 19** - UI library
- **React Native 0.81** - Native components
- **Expo Router 6** - File-based routing
- **NativeWind 4** - Tailwind CSS for React Native
- **TypeScript 5.9** - Type safety

### Backend

- **Deno 2** - Modern JavaScript/TypeScript runtime
- **Prisma** - Database ORM
- **PostgreSQL 17** - Database

### Key Features

- 📱 **Responsive Design** - Sidebar on web, bottom tabs on mobile
- 🎨 **Modern UI** - Beautiful, consistent design system
- 🔒 **Type-Safe** - Full TypeScript coverage
- 🚀 **Fast** - Optimized for performance
- 📊 **Dashboard** - Real-time metrics and analytics
- 💬 **Conversations** - Communication tracking
- 📞 **Leads** - Lead management
- 📅 **Calendar** - Appointment scheduling
- 🤖 **AI Assistants** - Configurable AI agents

## 📱 Platform Support

- ✅ **Web** - Progressive Web App with responsive design
- ✅ **iOS** - Native iOS app (via Expo)
- ✅ **Android** - Native Android app (via Expo)

## 🧪 Development Scripts

### Client

```bash
npm run start          # Start Expo dev server
npm run web            # Start web development
npm run ios            # Start iOS development
npm run android        # Start Android development
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run typecheck      # Run TypeScript type checking
npm run build:web      # Build for web (static)
```

### Server

```bash
deno task dev              # Development with hot reload
deno task start            # Production server
deno task prisma:generate  # Generate Prisma client
deno task prisma:push      # Push schema to database
deno task prisma:migrate   # Run migrations
deno task prisma:studio    # Open Prisma Studio
deno task fmt              # Format code
deno task lint             # Lint code
```

## 📝 Environment Variables

### Client (.env)

```bash
EXPO_PUBLIC_API_URL=http://localhost:8000
```

### Server (.env)

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/realmaker
PORT=8000
```

See `.env.example` files in each directory for full list.

## 📚 Documentation

- [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md) - Deployment instructions
- [Client AGENTS Guide](./client/AGENTS.md) - Client architecture and conventions
- [Server README](./server/README.md) - Server documentation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on both web and mobile
4. Submit a pull request

## 📄 License

Private project - All rights reserved

## 🆘 Support

For issues or questions:

1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

Built with ❤️ using Expo and Deno
