Overview

This client is an Expo Router app targeting iOS/Android + Web. It uses:

- Expo Router for navigation and platform-specific routing files
- React Native + React Native Web for UI primitives
- NativeWind (Tailwind) for styling in both native and web
- TypeScript with path alias `@/*` to the project root

Key Directories

- `app/` — Expo Router pages. Web and native can diverge via platform files:
  - `_layout.tsx` — Native stack + tabs (mobile)
  - `_layout.web.tsx` — Web shell with sidebar + topbar
  - `(tabs)/` — Mobile tabs: `dashboard`, `conversations`, `leads`
  - `index.web.tsx` — Web entry shows Dashboard
  - `conversations.tsx`, `leads.tsx` — Web pages for those routes
- `components/`
  - `layout/` — `Shell`, `Sidebar(.web)`, `Topbar(.web)`, `BottomBar`
  - `ui/` — UI primitives: `Card`, `Badge`, `Progress`, `Typography`
  - `animation/` — `AnimatedElement` (web/native) for consistent enter animations
- `features/`
  - `dashboard/` — Dashboard screen and related UI
- `models/` — Application data types (see below)
- `constants/`, `assets/`, etc. — Standard Expo app structure

Routing Model

- Web: `app/_layout.web.tsx` wraps pages with `Shell` (sidebar + topbar). Scrolling is inside the main content area (body scroll is disabled on web).
- Native: `app/_layout.tsx` uses a stack plus a tab group `(tabs)` for `dashboard`, `conversations`, and `leads`.

Styling

- Tailwind via NativeWind (configured in `babel.config.js` and `metro.config.js`).
- Light mode only by design. No `dark:` classes in components.
- Global CSS (`global.css`) includes scrollbar styles for web, base resets, and sets `color-scheme: light`.

Scroll Behavior

- Web body scroll is disabled (`ScrollViewStyleReset`), so pages must scroll within the content container (managed by `Shell` on web).
- Native uses `SafeAreaView` + `ScrollView` per tab screen for proper padding and scroll.

Animations

- Use `AnimatedElement` for consistent fade-up enter animations.
- Web implementation uses CSS transitions; native uses Reanimated under the hood (no extra work required by callers).

Models (Domain Types)

- Located in `models/` and imported via `@/models`.
- Keep all app-facing data contracts here (conversations, leads, etc). Map network responses into these types at the edge of the app.

Example Types

```
// models/conversation.ts
export interface Conversation {
  id: string;
  channel: 'phone' | 'whatsapp' | 'web' | 'email';
  name: string;
  phone: string;
  property?: string;
  note?: string;
  timeAgo?: string;
  duration?: string;
  status: 'Completada' | 'Perdida' | 'En curso' | 'Rechazada' | 'Transferida';
  score?: number; // 0..100
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// models/lead.ts
export type LeadStage = 'new' | 'contacted' | 'qualified' | 'appointment' | 'proposal' | 'won' | 'lost';
export type LeadSource = 'phone' | 'whatsapp' | 'web' | 'email' | 'referral' | 'ads' | 'other';

export interface Lead {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  interestedProperty?: string;
  notes?: string;
  tags?: string[];
  stage: LeadStage;
  source?: LeadSource;
  score?: number; // 0..100
  assignedTo?: string;
  lastActivityAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
```

Conventions

- Prefer string literal unions for statuses and enums.
- Keep API transport types and view models separate when needed; adapt at the boundary.
- Optional timestamps are `string | Date`; parse to `Date` if/when needed by logic.
- Avoid coupling feature components directly to network response shapes — import domain types from `models/` instead.

Adding Data Types

1. Create a file in `models/` (e.g., `appointment.ts`).
2. Export the interface(s) and any string literal unions.
3. Re-export from `models/index.ts` for convenient `@/models` imports.

Notes for Agents

- When adding features that display lists (e.g., conversations, leads), build with types from `models/` and keep mock data local to the feature or a `mocks/` folder.
- Web vs native implementation differences belong in `.web.tsx` / `.tsx` files with the same import path.
- If scroll issues appear on web, ensure containers have concrete heights and avoid body scrolling.
