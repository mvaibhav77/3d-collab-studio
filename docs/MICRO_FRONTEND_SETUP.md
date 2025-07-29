# 3D Collaboration Studio - Micro-Frontend Setup

This project uses a micro-frontend architecture with Next.js as the host application and Vite-based micro-frontends.

## Architecture

- **Host Application (`apps/main`)**: Next.js application that consumes micro-frontends
- **Micro-Frontend (`apps/mfe-toolbar`)**: Vite-based React application exposing a Toolbar component

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended package manager)

### Installation

```bash
# Install dependencies for all packages
pnpm install
```

### Development

To run both the host and micro-frontend applications concurrently:

```bash
# Run all applications in development mode
pnpm dev
```

This will start:

- Main Next.js app on `http://localhost:3000`
- Toolbar MFE on `http://localhost:5001`

### Individual Application Commands

```bash
# Run only the main Next.js app
cd apps/main && pnpm dev

# Run only the toolbar micro-frontend
cd apps/mfe-toolbar && pnpm dev
```

### Build

```bash
# Build all applications
pnpm build
```

## Micro-Frontend Configuration

### Host Application (Next.js)

The Next.js configuration (`apps/main/next.config.ts`) includes:

- Module Federation setup with `@module-federation/nextjs-mf`
- Remote configuration pointing to the toolbar MFE
- Shared dependencies (React, React DOM) for singleton behavior
- Client-side only federation to avoid SSR issues

### Micro-Frontend (Vite)

The Vite configuration (`apps/mfe-toolbar/vite.config.ts`) includes:

- Module Federation with `@originjs/vite-plugin-federation`
- Exposed components (Toolbar)
- Shared dependencies matching the host
- CORS enabled for cross-origin requests

## Key Features

- **Dynamic Loading**: Micro-frontends are loaded dynamically with fallback UI
- **Error Handling**: Graceful fallbacks when MFEs are unavailable
- **Type Safety**: TypeScript declarations for remote modules
- **Development Experience**: Hot reloading works across both host and MFEs

## Troubleshooting

### Common Issues

1. **"Module not found" errors**: Ensure the micro-frontend is running on the correct port (5001)
2. **CORS issues**: The Vite config includes CORS headers, but browser security may still block requests
3. **Shared dependency conflicts**: Check that React versions match between host and MFEs

### Debugging

- Check browser console for federation loading errors
- Verify remote entry points are accessible (e.g., `http://localhost:5001/remoteEntry.js`)
- Ensure all applications are running simultaneously during development

## Adding New Micro-Frontends

1. Create a new Vite-based application in `apps/`
2. Configure module federation in `vite.config.ts`
3. Add the remote configuration to the Next.js config
4. Create TypeScript declarations for the new remote modules
5. Update Turbo configuration if needed
