# DesignForge Studio

A premium interactive design customization platform where creative professionals discover, customize, and commission bespoke design templates.

## Architecture

### Monorepo Structure (pnpm workspaces)
- `artifacts/designforge/` — React + Vite frontend (served at `/`)
- `artifacts/api-server/` — Express.js backend API
- `lib/api-spec/` — OpenAPI 3.1 spec (source of truth)
- `lib/api-client-react/` — Generated React Query hooks (from codegen)
- `lib/api-zod/` — Generated Zod schemas (from codegen)

### Frontend Stack
- **React 19** + **Vite 7** + **TypeScript**
- **Tailwind CSS v4** — Glassmorphism design system (`.glass`, `.glass-panel`, `.water-btn`)
- **Framer Motion** — Page transitions, staggered animations, micro-interactions
- **Zustand** — Theme store (dark/light, persisted to localStorage), Customization store
- **Wouter** — Client-side routing
- **React Query** — API data fetching via generated hooks
- **@react-three/fiber 9.5.0** + **@react-three/drei** — 3D scenes with WebGL fallback

### Theme System
- Dark mode default, toggled via Zustand `themeStore`
- `.dark` class applied to `<html>` element
- Custom CSS variables for violet/indigo primary palette

### Pages
- `/` — Hero landing with animated gradient background, features section
- `/browse` — Template gallery with category filter pills (12 templates, 8 categories)
- `/customize/:id` — Live customization studio with preview panel + tabbed controls
- `/confirmation` — Order success page

### Backend Stack
- **Express.js** + **TypeScript**
- **In-memory template data** — 12 templates across 8 categories (no database needed)
- **Resend email integration** — Sends notifications when `RESEND_API_KEY` + `ADMIN_EMAIL` are set
- **Rate limiting** — 5 requests/IP/hour for submission endpoint

### API Endpoints
- `GET /api/healthz` — Health check
- `GET /api/templates` — List templates (supports `category`, `limit`, `offset` query params)
- `GET /api/templates/:id` — Get single template
- `POST /api/submit-request` — Submit design customization request

### Code Generation
After any change to `lib/api-spec/openapi.yaml`, run:
```
pnpm --filter @workspace/api-spec run codegen
```

### Environment Variables
- `RESEND_API_KEY` — Optional: enables email notifications on submissions
- `ADMIN_EMAIL` — Optional: admin email for order notifications
- `SESSION_SECRET` — Session secret

### 3D / WebGL
- `SafeCanvas` component (`src/components/3d/SafeCanvas.tsx`) detects WebGL availability
- Falls back to CSS gradient when WebGL is unavailable (e.g., in Replit preview)
- Uses `@react-three/fiber 9.5.0` which supports React 19
