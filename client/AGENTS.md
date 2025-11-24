# Client Architecture

This client is a cross-platform mobile and web application built with Expo and React Native.

## Core Stack

- **Expo Router**: File-based routing for both mobile (stack/tabs) and web.
- **React Native + React Native Web**: Single codebase for UI primitives.
- **NativeWind**: Tailwind CSS styling for React Native components.
- **i18next**: Internationalization with separate locale files.
- **Expo Secure Store**: Secure storage for authentication tokens.

## Directory Structure

- `app/`: Contains all route files.
  - `(tabs)`: Tab-based navigation layout.
  - `login.tsx`: Authentication screen.
  - `_layout.tsx`: Main layout configuration.
- `components/`: Reusable UI components.
  - `ui/`: Generic primitives (Card, Button, Input, etc.).
  - `layout/`: Structure components (Shell, Sidebar).
- `lib/`: Utilities and helpers.
  - `httpClient.ts`: Wrapper around fetch with auth token handling.
  - `i18n.ts`: Internationalization configuration.
- `store/`: State management (e.g., `auth.tsx` context).
- `locales/`: Translation files (es, en, it).

## Key Patterns

- **Authentication**: Managed via `auth.tsx` context, persisting tokens in `SecureStore`.
- **Styling**: Utility-first CSS using NativeWind classes directly on components.
- **Platform Specifics**: Uses `.web.tsx` extensions or `Platform.OS` checks where native/web behavior diverges.
- **API Communication**: Centralized `httpClient` handles headers and base URLs.
