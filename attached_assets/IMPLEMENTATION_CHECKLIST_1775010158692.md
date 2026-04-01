# DesignForge Studio - Implementation Checklist & Quick Reference

---

## PHASE 1: FOUNDATION (Weeks 1-2)

### Project Setup
- [ ] Create Next.js 14 project with App Router
- [ ] Configure TypeScript (strict mode)
- [ ] Setup Tailwind CSS with custom config (glass, water, light effects)
- [ ] Install dependencies (see dependency list in main architecture)
- [ ] Configure ESLint + Prettier
- [ ] Setup environment variables (.env.local)
- [ ] Create initial folder structure (as per file structure section)
- [ ] Setup git repository + .gitignore

### Theme System
- [ ] Create Zustand theme store (themeStore.ts)
- [ ] Create ThemeProvider component
- [ ] Add CSS variables file (themes.css: light + dark modes)
- [ ] Add theme toggle to Navbar component
- [ ] Test theme persistence (localStorage)
- [ ] Test theme switching on all pages

### Core Styling
- [ ] Configure Tailwind colors (extend config)
- [ ] Create glass effect utilities (Tailwind plugins)
- [ ] Create water effect utilities (animations + Tailwind)
- [ ] Create lightmorphism utilities (glow backgrounds)
- [ ] Define animation variants (Framer Motion)
- [ ] Test all effects on sample components

### Layout Components
- [ ] Create Navbar component
  - [ ] Logo
  - [ ] Nav links (Home, Browse, About)
  - [ ] Theme toggle button
- [ ] Create Footer component
- [ ] Create Container component (responsive width)
- [ ] Create responsive grid system helper

### Base UI Components
- [ ] Button component (variants: primary, secondary, glass, outline)
- [ ] Card component (glass styling)
- [ ] Input component (text field with label)
- [ ] Select component (dropdown)
- [ ] Badge component (category indicator)
- [ ] Tabs component (tabbed interface)
- [ ] Divider component
- [ ] Spinner component (loading fallback)

---

## PHASE 2: PAGES & ROUTING (Weeks 2-3)

### Landing Page (/)
- [ ] Create HeroSection component
- [ ] Create static HeroText (no 3D yet—placeholder)
- [ ] Create CTA button → links to /browse
- [ ] Style with glassmorphism + lightmorphism
- [ ] Add Framer Motion page transitions
- [ ] Mobile responsive layout

### Browse Page (/browse)
- [ ] Create TemplateGrid component
- [ ] Create TemplateCard component
  - [ ] Static thumbnail image
  - [ ] Title, description
  - [ ] Category badge
  - [ ] "Customize" button → /customize/[id]
- [ ] Add basic filtering (optional: by category)
- [ ] Add pagination or infinite scroll
- [ ] Create /api/templates route
  - [ ] Return mock template data (hardcoded or JSON)
  - [ ] Implement query params (?category, ?limit, ?offset)
  - [ ] Add response caching headers
- [ ] Wire up TemplateGrid to fetch /api/templates
- [ ] Test: SWR loading state, error state, data display
- [ ] Mobile responsive layout

### Customize Page (/customize/[id])
- [ ] Create page structure (left panel + right panel layout)
- [ ] Create PageHeader (breadcrumb, title)

**Left Panel (60%):**
- [ ] Create PreviewScene (3D placeholder for now)
- [ ] Create ControlsHUD (rotation/zoom display)
- [ ] Create reset button
- [ ] Style with glassmorphism card

**Right Panel (40%):**
- [ ] Create CustomizationPanel component
- [ ] Create Tabs (Text | Color | Font)
- [ ] Create TextEditorTab
  - [ ] Dynamic text inputs based on customizableFields
  - [ ] Validate text length
- [ ] Create ColorPickerTab
  - [ ] Color picker component (custom or library)
  - [ ] Color preview swatch
- [ ] Create FontSelectorTab
  - [ ] Font dropdown (whitelist from availableFonts)
  - [ ] Font preview
- [ ] Create SubmitButton
  - [ ] Loading state
  - [ ] Success/error toast feedback
- [ ] Create side info card (specs, delivery time, pricing)

- [ ] Create Zustand customization store
  - [ ] State: selectedTemplateId, customizations
  - [ ] Actions: setCustomization, reset
- [ ] Create /api/templates/:id route
  - [ ] Return single template with defaults
  - [ ] Include availableFonts list
- [ ] Wire up CustomizationPanel to store
- [ ] Test: real-time customization updates
- [ ] Mobile responsive (stack panels vertically)

### Confirmation Page (/confirmation)
- [ ] Create SuccessIcon (animated)
- [ ] Create OrderSummary section
  - [ ] Template name
  - [ ] Request ID
  - [ ] Customizations summary (readable format)
  - [ ] Timestamp
- [ ] Create EmailConfirmation section
  - [ ] "Confirmation email sent to: user@email.com"
- [ ] Create NextStepsCallout
  - [ ] "You'll receive your design within 24 hours"
  - [ ] Support contact info
- [ ] Add "Back to Browse" button
- [ ] Extract requestId from URL query params
- [ ] Mobile responsive

---

## PHASE 3: 3D INTEGRATION (Week 3-4)

### Models & Assets
- [ ] Obtain/create 3D models for templates (.glb format)
  - [ ] Poster model (for hero)
  - [ ] Invitation model
  - [ ] Menu card model
  - [ ] Business card model
- [ ] Compress models using gltf-pipeline
- [ ] Place in /public/models/ directory
- [ ] Test model loading (check file sizes)

### Hero 3D Scene
- [ ] Install React Three Fiber + Drei
- [ ] Create HeroScene component (R3F Canvas)
  - [ ] Canvas setup (responsive size)
  - [ ] Camera (perspective, auto-positioned)
  - [ ] Lighting (3-point: key, fill, back)
  - [ ] Load .glb model (gltf loader)
  - [ ] Auto-rotation animation (useFrame)
  - [ ] Background (dark gradient or solid)
  - [ ] Optional: Bloom effect (postprocessing)
- [ ] Add Suspense fallback (spinner/skeleton)
- [ ] Add error boundary (fallback to static image)
- [ ] Test: model loads, rotates smoothly
- [ ] Optimize: clamp canvas resolution, cull faces
- [ ] Mobile: disable bloom on low-end devices (optional)

### Preview 3D Scene (Customize Page)
- [ ] Create PreviewScene component (R3F Canvas)
  - [ ] Canvas setup (responsive, larger than hero)
  - [ ] Camera (orbiting, controlled by OrbitControls)
  - [ ] Lighting (same 3-point, tuned for detail)
  - [ ] Load template-specific .glb model (from route params)
  - [ ] Material updates based on customization store colors*
- [ ] Setup OrbitControls (Drei)
  - [ ] Mouse drag to rotate (X, Y axes)
  - [ ] Scroll/pinch to zoom
  - [ ] Auto-rotate disabled
  - [ ] Reset button calls camera.reset()
- [ ] Create HUD overlay (non-canvas div)
  - [ ] Real-time rotation angle display (from camera)
  - [ ] Zoom percentage display (from camera.zoom)
- [ ] Wire up to Zustand store
  - [ ] Color changes → update materials
  - [ ] Text changes → (limited, for now just visual feedback)
- [ ] Suspense fallback
- [ ] Error boundary
- [ ] Test: rotation, zoom, material updates
- [ ] Performance: monitor render time, optimize LOD if needed

*Note: Material updates only work if models support them. Prioritize rotation/zoom interaction over material updates initially.

### 3D-Store Integration
- [ ] Pass Zustand color state to 3D materials
- [ ] Update material colors on store change
- [ ] Test real-time preview updates on color change
- [ ] Add loading skeleton while model loads

---

## PHASE 4: STATE MANAGEMENT (Week 4)

### Zustand Stores
- [ ] Complete themeStore (already partially done)
- [ ] Create customizationStore
  - [ ] State: selectedTemplateId, customizations{texts, colors, fonts}
  - [ ] Actions: setCustomization, resetCustomization, getState
  - [ ] Hooks: useCustomization
- [ ] Test store persistence (non-persisted, cleared on navigate)
- [ ] Test store actions and state updates

### SWR / React Query
- [ ] Create hooks/useTemplates.ts
  - [ ] Fetches /api/templates
  - [ ] Caching + revalidation strategy
  - [ ] Error handling
- [ ] Create hooks/useTemplate.ts
  - [ ] Fetches /api/templates/:id
  - [ ] Triggered on customize page load
  - [ ] Revalidation on demand
- [ ] Test: loading states, error states, data display
- [ ] Test: cache behavior (no duplicate requests)

### Data Flow
- [ ] Wire templates to BrowseGrid
- [ ] Wire single template to CustomizePage
- [ ] Wire customization store to CustomizationPanel
- [ ] Test end-to-end: select → customize → see updates

---

## PHASE 5: FORM & SUBMISSION (Week 4-5)

### Form Validation (Client)
- [ ] Create validation utility (Zod schemas)
  - [ ] Email validation
  - [ ] Text field validation (length, required)
  - [ ] Color validation (#RGB format)
  - [ ] Font validation (whitelist)
- [ ] Add validation to CustomizationPanel inputs
  - [ ] Show error messages inline
  - [ ] Disable submit if invalid
- [ ] Test validation on all fields

### Submit Handler
- [ ] Create submit handler in CustomizationPanel
  - [ ] Gather form data + store customizations
  - [ ] Validate locally
  - [ ] Show loading state
  - [ ] Call /api/submit-request (POST)
  - [ ] Handle success: show toast + redirect to /confirmation
  - [ ] Handle error: show error toast + suggest retry

### API Route: /api/submit-request
- [ ] POST handler
  - [ ] Validate request body (Zod)
  - [ ] Verify template exists (check hardcoded data)
  - [ ] Sanitize text inputs (trim, encode)
  - [ ] Format request summary (HTML for email)
  - [ ] Generate unique requestId (uuid)
  - [ ] Return success response { success, requestId }

- [ ] Email Integration (Resend)
  - [ ] Setup Resend API key (environment variable)
  - [ ] Create admin email template
    - [ ] Request ID, customer info, customizations, deadline
  - [ ] Create user confirmation email template
    - [ ] Request ID, template preview, next steps
  - [ ] Implement async email dispatch (no await)
  - [ ] Implement retry logic (3 attempts, exponential backoff)
  - [ ] Test: emails sent successfully (use Resend sandbox)

- [ ] Error handling
  - [ ] Invalid request → 400 Bad Request
  - [ ] Template not found → 400
  - [ ] Email service down → 500 (retry + alert)
  - [ ] Unknown error → 500 + log

### Confirmation Page
- [ ] Extract requestId from URL query
- [ ] Display success message with requestId
- [ ] Show customizations summary
- [ ] Test: redirect after submit, display correct data

---

## PHASE 6: PERFORMANCE & OPTIMIZATION (Week 5)

### Code Splitting
- [ ] Dynamic imports for React Three Fiber
  - [ ] Load only on pages using 3D
  - [ ] Test: bundle size reduction
- [ ] Code splitting per-page (automatic with Next.js)
- [ ] Analyze bundle size (next/bundle-analyzer)

### Image Optimization
- [ ] Optimize hero image (WebP + fallback)
- [ ] Optimize template thumbnails (AVIF + WebP)
- [ ] Use next/image component
- [ ] Test: lazy loading on browse page
- [ ] Measure: LCP, image load time

### 3D Performance
- [ ] Clamp canvas resolution (devicePixelRatio)
- [ ] Disable bloom on low-end devices (optional)
- [ ] Optimize model files (check .glb sizes)
- [ ] Preload next model on template switch
- [ ] Measure 3D scene load time
- [ ] Test on mobile + low-end devices

### Caching Strategy
- [ ] Configure response caching headers (/api/templates)
- [ ] Test: browser caches templates
- [ ] Setup Service Worker for model caching (optional, Phase 2)
- [ ] Monitor cache hit rates

### Monitoring
- [ ] Setup Web Vitals tracking (Vercel Analytics)
- [ ] Create custom metrics (3D load time, API response time)
- [ ] Test: measure actual metrics
- [ ] Set alerts for degradation

---

## PHASE 7: SECURITY & VALIDATION (Week 5-6)

### Input Security
- [ ] Validate all API inputs (Zod)
- [ ] Sanitize user text (trim, length check)
- [ ] Validate email format (RFC 5322)
- [ ] Validate color format (#RGB)
- [ ] Test: malicious inputs rejected

### API Security
- [ ] Implement rate limiting (/api/submit-request: 5 per IP/hour)
- [ ] Set request size limit (100KB)
- [ ] Set timeout (30 seconds)
- [ ] Test: rate limiting works
- [ ] Test: oversized requests rejected

### CORS
- [ ] Configure CORS (same-origin only)
- [ ] Exception: Resend (external service)
- [ ] Test: cross-origin requests blocked

### Secrets Management
- [ ] Store Resend API key in .env.local
- [ ] Store admin email in .env.local
- [ ] Never commit .env.local
- [ ] Verify: no secrets in code
- [ ] Setup Vercel environment variables (production)

### Logging
- [ ] Log API errors (not sensitive data)
- [ ] Log email failures
- [ ] Do NOT log: user emails, API keys, customizations
- [ ] Setup Sentry (optional, Phase 2)

---

## PHASE 8: TESTING & QA (Week 6)

### Manual Testing
- [ ] Test all pages (responsive on mobile, tablet, desktop)
- [ ] Test theme toggle (light ↔ dark, persistence)
- [ ] Test 3D scenes (hero scene rotates, preview scene interactive)
- [ ] Test customize flow (select template → edit → submit → confirm)
- [ ] Test form validation (errors show, submit disabled)
- [ ] Test email (check inbox, verify content)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile browsers (iOS Safari, Chrome Android)
- [ ] Test offline (graceful degradation)
- [ ] Test slow network (3G simulation, measure load time)
- [ ] Test with keyboard (tab navigation, enter to submit)
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)

### Automated Testing (Basic)
- [ ] Unit: Theme store
- [ ] Unit: Validation utilities
- [ ] Integration: API routes
- [ ] E2E: Customize flow (Playwright, optional)

### Performance Testing
- [ ] Measure Core Web Vitals (LCP, FID, CLS)
- [ ] Target: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Test on low-end devices (Lighthouse)
- [ ] 3D load time: target <2s

### Accessibility (a11y)
- [ ] Run axe-core on all pages
- [ ] Check color contrast (WCAG AA 4.5:1)
- [ ] Verify keyboard navigation (tab order)
- [ ] Test with screen reader (all content readable)
- [ ] Check form labels (associated)
- [ ] Check alt text on images
- [ ] Verify focus visible (always shown)

---

## PHASE 9: DEPLOYMENT & MONITORING (Week 6-7)

### Pre-Deployment
- [ ] Run full linting (eslint, prettier)
- [ ] Run type checking (tsc --noEmit)
- [ ] Run security audit (npm audit)
- [ ] Test production build locally (next build + next start)
- [ ] Verify all environment variables set
- [ ] Create .env.local.example file
- [ ] Update README with setup instructions

### Deploy to Vercel
- [ ] Connect GitHub repo to Vercel
- [ ] Configure environment variables (Resend API key, admin email)
- [ ] Deploy main branch
- [ ] Verify: all pages load
- [ ] Verify: theme works
- [ ] Verify: 3D scenes work
- [ ] Verify: submit works (test email sends)
- [ ] Test: production URLs work
- [ ] Setup custom domain (optional)

### Post-Deployment Monitoring
- [ ] Monitor Vercel Analytics (Core Web Vitals)
- [ ] Monitor error logs (Vercel dashboard)
- [ ] Monitor API usage (request count, response time)
- [ ] Monitor email delivery (Resend dashboard)
- [ ] Set alerts for:
  - [ ] High error rates (>5%)
  - [ ] Slow API responses (>1s)
  - [ ] Email delivery failures
- [ ] Check logs daily for first week

### Rollback Plan
- [ ] Keep previous deployment
- [ ] Document: how to rollback (Vercel history)
- [ ] Test: rollback procedure
- [ ] Monitor: no regressions post-rollback

---

## PHASE 10: DOCUMENTATION & HANDOFF (Week 7)

### Code Documentation
- [ ] JSDoc comments on all exported functions
- [ ] README with setup, development, deployment instructions
- [ ] Architecture notes (reference: architecture doc)
- [ ] API documentation (endpoint specs, request/response)
- [ ] Component documentation (props, usage examples)

### User Documentation (Optional)
- [ ] FAQ page (how to customize, submit request)
- [ ] Terms & Conditions
- [ ] Privacy Policy
- [ ] Support contact info

### Monitoring Runbook
- [ ] How to monitor Vercel Analytics
- [ ] How to check email delivery (Resend)
- [ ] How to interpret error logs
- [ ] Alert escalation (who to contact)
- [ ] Common issues + fixes

### Handoff to Admin (You)
- [ ] Teach: how to receive requests
- [ ] Teach: how to deliver designs
- [ ] Teach: how to manage templates (Phase 2)
- [ ] Teach: how to monitor uptime/errors
- [ ] Setup: admin notifications (email forwarding)

---

## PHASE 11: OPTIONAL ENHANCEMENTS (After MVP)

### Phase 2 Features
- [ ] User accounts (NextAuth.js)
- [ ] Save templates to favorites
- [ ] Order history
- [ ] Admin dashboard (view requests, mark complete)
- [ ] Design delivery (upload + email)
- [ ] Revision requests

### Phase 3 Scaling
- [ ] Database (PostgreSQL + Prisma)
- [ ] User authentication
- [ ] Async queue (Bull, Inngest)
- [ ] Advanced analytics
- [ ] CDN for 3D models (S3 + CloudFront)
- [ ] Load testing (k6)

---

## QUICK REFERENCE: KEY COMMANDS

```bash
# Setup
npm create next-app@latest designforge-studio --typescript --tailwind
cd designforge-studio
npm install zustand swr framer-motion @react-three/fiber @react-three/drei three resend zod

# Development
npm run dev                    # Run dev server on localhost:3000

# Testing
npm run lint                   # ESLint
npm run type-check             # TypeScript (or: tsc --noEmit)
npm audit                      # Security audit

# Building
npm run build                  # Production build
npm start                      # Start production server

# Deployment (Vercel)
# git push origin main         # Vercel auto-deploys on push
```

---

## QUICK REFERENCE: COMPONENT CHECKLIST

```
✅ LAYOUT
  ├── Navbar
  ├── Footer
  ├── Container
  └── RootProvider

✅ UI PRIMITIVES
  ├── Button
  ├── Card
  ├── Input
  ├── Select
  ├── Tabs
  ├── Badge
  ├── Divider
  ├── ColorPicker
  └── Spinner

✅ PAGES
  ├── Landing (/)
  ├── Browse (/browse)
  ├── Customize (/customize/[id])
  └── Confirmation (/confirmation)

✅ FEATURES
  ├── HeroSection
  ├── HeroScene (3D)
  ├── TemplateGrid
  ├── TemplateCard
  ├── PreviewScene (3D)
  ├── CustomizationPanel
  └── ConfirmationCard

✅ STORES
  ├── themeStore
  └── customizationStore

✅ HOOKS
  ├── useTheme
  ├── useCustomization
  ├── useTemplates
  ├── useTemplate
  └── use3DScene

✅ UTILS
  ├── validation.ts
  ├── formatting.ts
  ├── cn.ts (classnames)
  └── constants.ts

✅ API ROUTES
  ├── /api/templates
  ├── /api/templates/:id
  ├── /api/customize (optional)
  ├── /api/submit-request
  └── /api/health
```

---

## QUICK REFERENCE: TAILWIND CUSTOM CONFIG

```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        glass: 'rgb(var(--glass-bg) / <alpha-value>)',
        water: 'rgb(var(--water-primary) / <alpha-value>)',
      },
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        glass: 'var(--glass-shadow)',
      },
    },
  },
  plugins: [
    // Custom glass effect plugin
    // Custom water effect plugin
    // Custom lightmorphism plugin
  ],
};
```

---

## QUICK REFERENCE: ENVIRONMENT VARIABLES

```bash
# .env.local (git-ignored)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Backend
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=admin@designforge.studio

# Optional (Phase 2)
# DATABASE_URL=postgresql://...
# NEXTAUTH_SECRET=...
```

---

## QUICK REFERENCE: TIMELINE

| Phase | Duration | Focus |
|-------|----------|-------|
| 1 | Week 1-2 | Foundation (setup, theme, UI components) |
| 2 | Week 2-3 | Pages & Routing (landing, browse, customize) |
| 3 | Week 3-4 | 3D Integration (React Three Fiber) |
| 4 | Week 4 | State Management (Zustand, SWR) |
| 5 | Week 4-5 | Forms & Submission (validation, email) |
| 6 | Week 5 | Performance & Optimization |
| 7 | Week 5-6 | Security & Validation |
| 8 | Week 6 | Testing & QA |
| 9 | Week 6-7 | Deployment & Monitoring |
| 10 | Week 7 | Documentation & Handoff |
| **Total** | **~6-7 weeks** | **MVP ready for production** |

---

## QUICK REFERENCE: CRITICAL SUCCESS FACTORS

✅ **Must-Haves:**
- [ ] 3D preview renders smoothly
- [ ] Form validation works
- [ ] Emails send reliably
- [ ] Theme toggle persists
- [ ] Mobile responsive
- [ ] <2.5s LCP on landing

❌ **Nice-to-Haves (Phase 2):**
- [ ] User accounts
- [ ] Admin dashboard
- [ ] Advanced filtering
- [ ] Design revisions

⚠️ **Watch Out For:**
- [ ] 3D models too large → slow load
- [ ] Missing rate limiting → abuse
- [ ] Unhandled email failures → user confusion
- [ ] No mobile testing → broken on phones
- [ ] No keyboard navigation → accessibility issues
- [ ] Hardcoded secrets → security breach

---

END OF IMPLEMENTATION CHECKLIST
