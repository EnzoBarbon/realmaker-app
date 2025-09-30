# Realmaker App

Universal Expo app (iOS, Android, Web) using React Native, Expo Router, and TypeScript.

## Quick start

```bash
npm install
npm run start           # Dev server (press a / i / w)
npm run android         # Open on Android
npm run ios             # Open on iOS
npm run web             # Open in browser
```

## Lint, format, types

```bash
npm run lint
npm run format
npm run typecheck
```

## Build

- Mobile (EAS):
  - Dev/internal: `npm run dev:android` | `npm run dev:ios`
  - Production: `npm run build:android` | `npm run build:ios`
  - Submit: `npm run submit:android` | `npm run submit:ios`
- Web (static export):
  - `npm run build:web` → output in `dist/`

## Technologies

- Expo SDK
- Expo Router (file-based routing)
- React Native + React Native Web
- TypeScript
- ESLint + Prettier

## Docs

- Expo overview: https://docs.expo.dev/
- Create app: https://docs.expo.dev/get-started/create-a-project/
- Expo Router: https://docs.expo.dev/router/introduction/
- Web & PWA: https://docs.expo.dev/workflow/web/
- EAS Build: https://docs.expo.dev/build/introduction/
- TypeScript: https://docs.expo.dev/guides/typescript/
- ESLint config for RN: https://github.com/facebook/react-native/tree/main/packages/eslint-config-react-native-community
