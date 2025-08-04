# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 3D Collab Studio - Development Setup

## Environment Configuration

This app supports multiple environments with proper configuration management.

### Environment Files

- `.env.development` - Development environment (default)
- `.env.staging` - Staging environment
- `.env.production` - Production environment
- `.env.local` - Local overrides (gitignored)

### Available Scripts

#### Development

```bash
# Start main app only
pnpm dev:main

# Start API server only
pnpm dev:api

# Start toolbar MFE only
pnpm dev:toolbar

# Start all services concurrently
pnpm dev:all

# Start with different environments
pnpm --filter=main dev:production
```

#### Building

```bash
# Build for development
pnpm build

# Build for staging
pnpm build:staging

# Build for production
pnpm build:production
```

#### Preview Built Apps

```bash
# Preview development build
pnpm preview

# Preview staging build
pnpm preview:staging

# Preview production build
pnpm preview:production
```

#### Other Utilities

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint
pnpm lint:fix

# Clean build artifacts
pnpm clean
```

## Configuration

### Environment Variables

All environment variables are prefixed with `VITE_` and are available at build time.

#### Required Variables

- `VITE_API_BASE_URL` - API server URL
- `VITE_MFE_TOOLBAR_URL` - Toolbar micro-frontend URL
- `VITE_MFE_CANVAS_URL` - Canvas micro-frontend URL
- `VITE_WEBSOCKET_URL` - WebSocket server URL

#### Optional Variables

- `VITE_APP_TITLE` - Application title (default: "3D Collab Studio")
- `VITE_LOG_LEVEL` - Logging level: debug|info|warn|error (default: "info")
- `VITE_ENABLE_DEV_TOOLS` - Enable dev tools (default: false)
- `VITE_DEV_FEATURES` - Comma-separated list of dev features

### Development Features

The app includes development utilities for debugging:

- **Structured Logging**: Configurable log levels with formatted output
- **Performance Monitoring**: Built-in performance measurement tools
- **Hot Reload**: Fast refresh with state preservation
- **Environment Validation**: Automatic validation of required env vars
- **Type Safety**: Full TypeScript support with environment variable types

### Path Aliases

The following path aliases are configured:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@lib/` → `src/lib/`
- `@hooks/` → `src/hooks/`
- `@utils/` → `src/utils/`
- `@types/` → `src/types/`

## Architecture

The main app follows a micro-frontend architecture:

- **Host App** (this app) - Main container and routing
- **Toolbar MFE** - Tools and controls (port 5001)
- **Canvas MFE** - 3D rendering canvas (port 5002)
- **API Server** - Backend services (port 3001)

All configuration is environment-aware and deployment-ready.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
