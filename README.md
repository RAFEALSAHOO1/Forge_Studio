# Forge Studio

## Project Status

- ✅ Repository sync confirmed with GitHub: `https://github.com/RAFEALSAHOO1/Forge_Studio`
- ✅ All local project files from `Forge_Studio` workspace pushed to remote `main` branch.
- ✅ Build fix focus done (TypeScript type config, CSS validity, `mockup-sandbox` config, API routes, admin dashboard wiring).

## Overview

Forge Studio is a modern app that includes:
- Owner panel + analytics dashboard
- Payment tracking with Stripe-compatible transaction logging
- User management + role-based access control
- 3D design preview pipelines for design templates
- Real-time analytics and business metrics
- Full admin capabilities: user management, growth analysis, profit & loss, order tracking

## Repo Structure

- `/artifacts/api-server` - backend API (Express-like with auth, dashboard routes)
- `/artifacts/designforge` - React frontend app with admin panels
- `/artifacts/mockup-sandbox` - design mockup playground app
- `/lib/db/src/schema` - Drizzle ORM schema definitions
- `/scripts` - helper tasks and analysis scripts
- Root docs: `ARCHITECTURE.md`, `IMPLEMENTATION_CHECKLIST.md`, etc.

## Quick Setup (Local)

```bash
cd Forge_Studio
pnpm install
pnpm run build
```

### Environment Variables

Copy dotenv files, then set values:

- `artifacts/api-server/.env`:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - etc

- `artifacts/designforge/.env`:
  - `VITE_API_BASE_URL=http://localhost:3000/api`

### Start servers

Backend:
```bash
cd artifacts/api-server
pnpm run dev
```

Frontend:
```bash
cd artifacts/designforge
pnpm run dev
```

Mockup sandbox:
```bash
cd artifacts/mockup-sandbox
pnpm run dev
```

## Build and Test

1. Run `pnpm run build` at root (includes typecheck and all workspaces).
2. If `mockup-sandbox` fails due env config, set `PORT` and `BASE_PATH` or use `npm run dev`.

## Known Current Places to Complete

- `artifacts/mockup-sandbox` still may require tailwind/ postcss validation and direct fixes for `@import`/`@apply` semantics.
- `artifacts/designforge/src/pages/VerifyEmail.tsx` imports CSS side effects; verify your Vite style pipeline.

## “Real models only” plan

Make sure any hardcoded `mock` arrays in components are replaced by API fetch calls in `hooks/api.ts` and backend routes in `api-server/src/routes`

## Contributions

- `git checkout -b <feature>` for new changes
- `git commit -am "feat: ..."`
- `git push origin <feature>`
- Create PR to main
