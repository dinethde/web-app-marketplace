# CLAUDE.md

This file provides context for Claude Code when working in this repository.

## Project Overview

**WSO2 App Store** is an open-source platform under the [wso2-open-operations](https://github.com/wso2-open-operations) organization for publishing, browsing, and managing internal web applications. It has a React frontend and a Ballerina backend service. Maintained by the **WSO2 Digital Team** (wso2-digital-team@wso2.com).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.8, Vite 7 |
| UI | Material-UI (MUI) 7, Emotion |
| State | Redux Toolkit 2.8 |
| Auth | Asgardeo (React SDK + SPA SDK) |
| Forms | Formik + Yup |
| HTTP | Axios + retry-axios |
| Routing | React Router DOM 7 |
| Backend | Ballerina 2201.10.4 |

## Repository Structure

```
web-app-marketplace/
├── backend/                  # Ballerina HTTP service (port 9090)
│   ├── modules/
│   │   ├── authorization/    # JWT/auth interceptors
│   │   ├── database/         # DB operations
│   │   └── people/           # User management
│   ├── service.bal            # Main service entry point
│   └── types.bal              # Shared type definitions
└── webapp/                   # React frontend (port 3000)
    └── src/
        ├── app/               # App-level handlers
        ├── component/         # Reusable components (common, layout, panel, ui)
        ├── layout/            # Page layout components
        ├── slices/            # Redux slices
        ├── services/          # API service layer
        ├── context/           # React contexts (AuthContext, DialogContext)
        ├── config/            # App configuration
        ├── utils/             # Utility functions
        ├── types/             # TypeScript type definitions
        ├── route.ts           # Route definitions
        └── theme.ts           # MUI theme
```

## Development Commands

All frontend commands run from the `webapp/` directory:

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint
npm run format       # Prettier formatting
npm run preview      # Preview production build
```

## Code Conventions

### Naming
- Components: PascalCase files in feature-based folders (`common/`, `panel/`, `ui/`)
- Redux slices: camelCase with "Slice" suffix (e.g., `appSlice`, `authSlice`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `INTERNAL_APPS_THEME`)
- Utilities/services: camelCase

### Formatting (enforced by Prettier)
- Double quotes, no single quotes
- 2-space indentation
- 100 character print width
- Trailing commas always
- Semicolons required
- Imports sorted: third-party → React → project (`@src/`, `@component/`) → relative

### TypeScript
- Strict mode enabled
- No unused locals or parameters
- Path aliases: `@src/`, `@component/`, etc. (see `webapp/tsconfig.json`)

### React Patterns
- Context for auth state (`AuthContext`)
- Redux for global app state
- Asgardeo for SSO/OIDC authentication
- Custom Axios interceptors for JWT and error handling

## License

Apache License 2.0 — WSO2 LLC (2025–2026). Add the Apache license header to new source files.
