# DesignForge Studio - Complete System Architecture

## 1. PROJECT OVERVIEW & PHILOSOPHY

### Vision
Premium interactive design customization platform enabling users to explore, customize, and request professionally-crafted design templates through an immersive, glassmorphic interface.

### User Journey Flow
```
Landing (3D Hero) 
  → Browse Templates 
  → Select Template 
  → 3D Preview + Customize 
  → Customize Panel (Text/Color/Font) 
  → Submit Request 
  → Confirmation Email
  → Admin Dashboard (Future)
```

### Design Language Principles
- **Glassmorphism**: Main UI containers with backdrop blur, semi-transparency
- **Watermorphism**: Buttons with fluid, smooth interactions
- **Lightmorphism**: Subtle background glows and depth layers
- **Motion**: Framer Motion for micro-interactions and page transitions
- **3D Integration**: Limited to hero and template preview—not every element

---

## 2. SYSTEM ARCHITECTURE LAYERS

### 2.1 Frontend Architecture (Next.js App Router)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  (Pages, Components, Animations, 3D Scenes)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT LAYER                   │
│  (React Context + Zustand for theme, customization state)  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA FETCHING LAYER                      │
│  (SWR/React Query for templates, async operations)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API INTEGRATION LAYER                    │
│  (Next.js API Routes, Resend Email Service)                │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Backend Architecture (Next.js API Routes)

```
┌─────────────────────────────────────────────────────────────┐
│                    API ROUTES LAYER                         │
│  /api/templates                                             │
│  /api/customize                                             │
│  /api/submit-request                                        │
│  /api/admin/requests (Future)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                     │
│  (Validation, Email formatting, Request processing)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE INTEGRATION LAYER                │
│  (Resend, Future: Database, Image Processing)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. PAGE STRUCTURE & ROUTING

### 3.1 App Router Layout

```
app/
├── layout.tsx                    # Root layout (theme provider, fonts)
├── page.tsx                      # Landing page (hero with 3D)
├── browse/
│   └── page.tsx                 # Browse templates grid
├── customize/
│   ├── [templateId]/
│   │   └── page.tsx             # Customization page (3D + controls)
│   └── layout.tsx               # Customization layout wrapper
├── confirmation/
│   └── page.tsx                 # Success confirmation
└── api/
    ├── templates/
    │   ├── route.ts             # GET /api/templates
    │   └── [id]/route.ts        # GET /api/templates/:id
    ├── customize/
    │   └── route.ts             # POST /api/customize (validation)
    ├── submit-request/
    │   └── route.ts             # POST /api/submit-request (email)
    └── health/
        └── route.ts             # GET /api/health (ping)
```

### 3.2 Page Responsibilities

| Page | Purpose | Key Features | Data Source |
|------|---------|--------------|-------------|
| `/` (Landing) | Hero showcase | 3D rotating model, value prop, CTA | Static/Config |
| `/browse` | Template gallery | Grid, filtering, preview thumbnail | API: /templates |
| `/customize/[id]` | Main interaction hub | 3D preview, customization panel, form | API: /templates/:id |
| `/confirmation` | Success state | Order summary, next steps, email confirm | URL params/Context |

---

## 4. STATE MANAGEMENT STRATEGY

### 4.1 State Hierarchy & Tool Selection

#### **Global State (Zustand)**
Persistent across all pages, relatively small, doesn't require re-renders on every change.

```
Store: ThemeStore
├── theme: 'light' | 'dark'
├── setTheme: (theme) => void
├── toggleTheme: () => void

Store: CustomizationStore (per-session, not persisted)
├── selectedTemplateId: string
├── customizations: {
│   ├── texts: { [key]: string }
│   ├── colors: { [key]: string }
│   └── fonts: { [key]: string }
├── setCustomization: (key, value) => void
├── resetCustomization: () => void
└── getCustomizationState: () => CustomState
```

**Persistence**: Only theme stored in localStorage.
**Rationale**: Small, single-source-of-truth for toggling; customization is session-scoped.

#### **Local State (React useState)**
Component-level state for UI control and short-lived interactions.

```
Component: 3DPreviewScene
├── rotationX: number
├── rotationY: number
├── zoom: number
├── isLoading: boolean

Component: CustomizationPanel
├── activeTab: 'text' | 'color' | 'font'
├── isSubmitting: boolean
├── errorMessage: string | null
```

#### **Server State (SWR or React Query)**
Template data, cached and revalidated.

```
Hook: useTemplates()
├── data: Template[]
├── isLoading: boolean
├── error: Error | null

Hook: useTemplate(id)
├── data: Template
├── isLoading: boolean
├── error: Error | null
```

**Rationale**: Separates UI state (Zustand) from server state (SWR).
**Revalidation**: On-demand, stale-while-revalidate for template list.

### 4.2 Data Flow Diagram

```
User Action (Select Template)
        ↓
    Component State (useState)
        ↓
    Zustand CustomizationStore (global custom state)
        ↓
    API Call (SWR/Query) to /api/templates/:id
        ↓
    3D Scene Re-renders with new data
        ↓
    User Modifies Text/Color/Font
        ↓
    Zustand CustomizationStore updates
        ↓
    3D Preview updates in real-time
        ↓
    User Submits
        ↓
    POST /api/submit-request (with Zustand state)
        ↓
    Email via Resend
        ↓
    Redirect to /confirmation
```

---

## 5. COMPONENT ARCHITECTURE

### 5.1 Component Tree Structure

```
Root (layout.tsx)
├── ThemeProvider (Zustand context)
├── Navbar (theme toggle, logo, nav links)
└── Outlet (page content)

Landing Page (/)
├── HeroSection
│   ├── 3DScene (React Three Fiber)
│   │   ├── Model (rotating poster/card)
│   │   ├── Camera
│   │   ├── Lights
│   │   └── Controls (OrbitControls)
│   └── HeroText (glassmorphism overlay)
└── CTA Button

Browse Page (/browse)
├── Header (title, filters)
├── TemplateGrid
│   ├── TemplateCard (x12)
│   │   ├── Preview Image
│   │   ├── Title
│   │   ├── Category Badge
│   │   └── CTA Button
│   └── EmptyState
└── Pagination/Infinite Scroll

Customize Page (/customize/[id])
├── PageHeader (breadcrumb, template title)
├── MainGrid
│   ├── Left Panel (60%)
│   │   ├── 3DPreviewScene (React Three Fiber)
│   │   │   ├── Model (interactive)
│   │   │   ├── Rotation Controls
│   │   │   └── Zoom Slider
│   │   └── Preview Stats (resolution, format)
│   │
│   └── Right Panel (40%)
│       ├── CustomizationPanel
│       │   ├── TabNav (Text | Color | Font)
│       │   ├── TabContent
│       │   │   ├── TextEditor (dynamic fields)
│       │   │   ├── ColorPicker (per-element)
│       │   │   └── FontSelector (dropdown)
│       │   ├── Divider
│       │   ├── PreviewToggle (2D/3D)
│       │   └── SubmitButton
│       └── SideInfo (specs, delivery, pricing)
└── ConfirmModal (on submit)

Confirmation Page (/confirmation)
├── SuccessIcon
├── OrderSummary
├── EmailConfirmation
└── NextStepsCallout
```

### 5.2 Component Categories

#### **Layout Components**
- `Navbar`: Top navigation with theme toggle
- `Container`: Constrained width wrapper
- `Grid`: Responsive grid system helper

#### **UI Components (Reusable, styled)**
- `Button`: Watermorphism buttons (primary, secondary, outline)
- `Card`: Glassmorphism card container
- `Input`: Text input with glass style
- `Select`: Dropdown with custom styling
- `ColorPicker`: Custom color selection UI
- `Tabs`: Tabbed interface for customization
- `Badge`: Category/status indicator
- `Divider`: Visual separator

#### **Feature Components**
- `HeroSection`: Landing 3D showcase
- `TemplateGrid`: Browse template cards
- `TemplateCard`: Individual template preview
- `3DPreviewScene`: React Three Fiber preview with interaction
- `CustomizationPanel`: Text/color/font controls
- `ThemeToggle`: Light/dark switcher

#### **Page/Container Components**
- `LandingPage`: `/` route
- `BrowsePage`: `/browse` route
- `CustomizePage`: `/customize/[id]` route
- `ConfirmationPage`: `/confirmation` route

---

## 6. 3D INTEGRATION STRATEGY

### 6.1 Where 3D Lives

**3D Used:**
- ✅ Landing hero (hero carousel of rotating templates)
- ✅ Customize page (interactive 3D preview with rotation/zoom)

**3D NOT Used:**
- ❌ Browse grid (static thumbnails for performance)
- ❌ General UI elements (overkill, kills performance)

### 6.2 React Three Fiber Integration

#### **HeroScene Component**
```
Purpose: Landing page 3D showcase
├── Canvas (Three.js scene)
│   ├── Camera (perspective, auto-positioned)
│   ├── Lighting (3-point setup: key, fill, back)
│   ├── Model (gltf/glb, auto-rotating)
│   ├── Background (gradient or dark solid)
│   └── Effects (optional: bloom, glow)
├── Controls (disabled; auto-rotation only)
└── Loading Fallback (skeleton or spinner)
```

**Interaction Model**: AUTO-ROTATE only, no user interaction
**Performance**: Preload model, use LOD (Level of Detail) if available

#### **PreviewScene Component**
```
Purpose: Customize page interactive 3D
├── Canvas (Three.js scene)
│   ├── Camera (orbiting, controlled)
│   ├── Lighting (same 3-point, but tuned for detail)
│   ├── Model (gltf/glb, loaded from template data)
│   ├── Background (theme-aware: dark/light)
│   └── Effects (bloom if dark, subtle glow if light)
├── Controls (OrbitControls: rotation + zoom)
├── HUD Overlay (rotation indicator, zoom level)
└── Reset Button (return to default view)
```

**Interaction Model**: 
- Mouse drag to rotate (X, Y axes only)
- Scroll/pinch to zoom
- Reset button to default pose

**State Sync**:
```
User rotates → useState (rotationX, rotationY)
  ↓
3D Scene updates
  ↓
HUD updates
  ↓
Customization panel responsive to changes (subtle feedback)
```

### 6.3 Model Assets Strategy

#### **Asset Format**: glTF 2.0 (.glb or .gltf)
- Industry standard for web 3D
- Bake colors/materials into model if possible
- Single texture atlas for efficiency

#### **Model Per Template**
- Each template has its own 3D model
- Models stored in `/public/models/[templateId].glb`
- Preload on template selection

#### **Performance Optimization**
```
Loading Strategy:
├── Hero scene: preload on page load
├── Preview scene: lazy load on route change
└── Browser cache: leverage Next.js static optimization

Rendering Strategy:
├── Render only visible canvas
├── Disable canvas when off-screen (tabs, minimize)
├── Use requestAnimationFrame for animations
└── Cull back faces, optimize geometry
```

### 6.4 3D-to-UI Communication

```
3D Preview Updates
├── Rotation values → HUD display
├── Zoom level → Slider feedback
└── Model loaded → Show/hide spinner

UI Controls Update 3D
├── Text change → Model updates if possible*
├── Color change → Material updates**
└── Font change → 2D label updates (not 3D)

* Limited: Only if model supports text texture swapping
** Always: Materials stored in Three.js Material objects
```

---

## 7. THEME & STYLING STRATEGY

### 7.1 Theme Architecture

**Provider**: `ThemeProvider` (Zustand-based)
```
ThemeContext
├── theme: 'light' | 'dark'
├── toggleTheme: () => void
└── setTheme: (mode) => void
```

**Persistence**: localStorage key `designforge-theme`

**Root Element**: `<html data-theme="light" | "dark">`

### 7.2 Tailwind CSS Configuration

```
tailwind.config.ts
├── extend colors
│   ├── glassmorphism shades
│   ├── watermorphism tints
│   └── lightmorphism highlights
├── extend opacity
│   └── custom opacity scales
├── extend blur
│   └── backdrop-blur variants
├── darkMode: class
└── plugins
    ├── Custom glass effect
    ├── Custom water effect
    └── Custom light effect
```

### 7.3 Design Token System

**CSS Variables** in global stylesheet (light + dark):
```
Light Theme:
--glass-bg: rgba(255, 255, 255, 0.7)
--glass-border: rgba(255, 255, 255, 0.3)
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
--water-primary: #3B82F6
--light-glow: rgba(59, 130, 246, 0.2)

Dark Theme:
--glass-bg: rgba(30, 30, 46, 0.8)
--glass-border: rgba(100, 100, 150, 0.2)
--glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)
--water-primary: #60A5FA
--light-glow: rgba(96, 165, 250, 0.15)
```

### 7.4 Animation System (Framer Motion)

**Global Motion Config**:
```
variants:
├── pageEnter: fade-in + slide-up (200ms)
├── pageExit: fade-out + slide-down (150ms)
├── cardHover: scale 1.02 + shadow (300ms)
├── buttonTap: scale 0.95 (100ms)
├── glassHover: backdrop blur increase (200ms)
└── waterFlow: continuous subtle shift (4s, loop)

Transition Defaults:
├── duration: 300ms
├── ease: easeInOut / easeOut for exits
└── staggerChildren for lists
```

---

## 8. API ROUTES & BACKEND LOGIC

### 8.1 API Endpoints

#### **GET /api/templates**
```
Purpose: Fetch all templates for browse page
Query Params:
├── ?category=poster|invitation|menu|business-card (optional)
├── ?limit=12 (pagination)
└── ?offset=0 (pagination)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "Modern Poster",
      "category": "poster",
      "description": "...",
      "thumbnail": "/images/poster-thumb.jpg",
      "preview3d": "/models/poster-1.glb",
      "customizableFields": {
        "text": ["title", "subtitle", "cta"],
        "colors": ["accent", "background"],
        "fonts": ["title", "body"]
      },
      "specifications": {
        "dimensions": "1024x1024px",
        "format": "PNG",
        "deliveryTime": "24 hours"
      }
    }
  ],
  "total": 42,
  "hasMore": true
}

Errors (400, 500): Standard error responses
```

#### **GET /api/templates/:id**
```
Purpose: Fetch single template details for customize page
Response (200):
{
  "id": "uuid",
  "name": "Modern Poster",
  "category": "poster",
  ... (same as above, + additional fields)
  "defaults": {
    "texts": {
      "title": "Your Title Here",
      "subtitle": "Add your subtitle",
      "cta": "Click Here"
    },
    "colors": {
      "accent": "#3B82F6",
      "background": "#1F2937"
    },
    "fonts": {
      "title": "Inter",
      "body": "Roboto"
    }
  },
  "availableFonts": [
    "Inter", "Roboto", "Playfair Display", "Poppins"
  ]
}
```

#### **POST /api/customize**
```
Purpose: Validate customizations (optional real-time feedback)
Request Body:
{
  "templateId": "uuid",
  "customizations": {
    "texts": { "title": "My Design", ... },
    "colors": { "accent": "#FF0000", ... },
    "fonts": { "title": "Poppins", ... }
  }
}

Response (200):
{
  "valid": true,
  "warnings": ["title exceeds recommended length"]
}

Errors (400): Validation failures
```

#### **POST /api/submit-request**
```
Purpose: Submit customized design request (trigger email)
Request Body:
{
  "templateId": "uuid",
  "customizations": {
    "texts": { ... },
    "colors": { ... },
    "fonts": { ... }
  },
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "additionalNotes": "Please add extra..."
}

Response (200):
{
  "success": true,
  "requestId": "req-uuid",
  "message": "Request submitted successfully",
  "emailSent": true
}

Side Effects:
├── Send admin notification email (Resend)
├── Send user confirmation email (Resend)
└── Log to database/service (future)

Errors (400, 500): Handle gracefully, suggest retry
```

### 8.2 Backend Business Logic

**Route: /api/submit-request**
```
1. Input Validation
   ├── Validate template exists
   ├── Validate customization keys
   ├── Validate email format
   └── Sanitize text inputs (XSS protection)

2. Data Processing
   ├── Merge defaults with user customizations
   ├── Format HTML email template
   ├── Generate request summary
   └── Create requestId (uuid)

3. Email Dispatch (Resend)
   ├── Admin email: Full request details + JSON preview
   ├── User email: Confirmation + next steps
   └── Retry logic on failure (3 attempts)

4. Response
   ├── Return success + requestId
   ├── Client redirects to /confirmation?requestId=...
   └── Log event (analytics/future)

Error Handling:
├── Missing template → 400 Bad Request
├── Invalid email → 400 Bad Request
├── Resend failure → 500 Internal Server Error (after retries)
└── Unknown error → 500 + detailed server log
```

### 8.3 Email Templates (Resend)

**Admin Notification Email**:
```
Subject: New Design Request - [Template Name]
Body:
- Request ID
- Customer name + email
- Template name + category
- Full customizations (text/color/font values)
- Delivery deadline (current time + 24h)
- Link to admin dashboard (future)
- Call-to-action: "Start designing"
```

**User Confirmation Email**:
```
Subject: Your Design Request is Confirmed!
Body:
- Request ID
- Template preview thumbnail
- Customizations summary (readable format)
- Next steps: "We'll email you within 24 hours"
- Tracking link (future)
- Support contact
```

---

## 9. DATA MODELS & TYPES

### 9.1 TypeScript Definitions

```typescript
// Template
interface Template {
  id: string;
  name: string;
  category: 'poster' | 'invitation' | 'menu' | 'business-card';
  description: string;
  thumbnail: string; // static image path
  preview3d: string; // GLB model path
  customizableFields: CustomizableFields;
  specifications: Specifications;
  defaults: DefaultCustomizations;
  availableFonts: string[];
}

// Customizable Fields (schema)
interface CustomizableFields {
  text: string[]; // field keys like ["title", "subtitle"]
  colors: string[]; // field keys like ["accent", "background"]
  fonts: string[]; // field keys like ["title", "body"]
}

// User Customizations (actual values)
interface Customization {
  texts: Record<string, string>;
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

// Request (submitted to backend)
interface DesignRequest {
  templateId: string;
  customizations: Customization;
  userEmail: string;
  userName: string;
  additionalNotes?: string;
}

// Request Response
interface DesignRequestResponse {
  success: boolean;
  requestId: string;
  message: string;
  emailSent: boolean;
}

// Theme State
type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

// Customization State
interface CustomizationState {
  selectedTemplateId: string | null;
  customizations: Customization;
  setCustomization: (field: string, key: string, value: string) => void;
  resetCustomization: () => void;
}
```

---

## 10. PERFORMANCE STRATEGY

### 10.1 Frontend Performance

#### **Code Splitting**
```
Next.js App Router: Automatic per-page splitting
├── Landing chunk: small (hero content only)
├── Browse chunk: medium (grid + cards)
├── Customize chunk: large (3D libs + preview)
└── Confirmation chunk: tiny

Dynamic Imports:
├── React Three Fiber: loaded only on pages using 3D
├── Color picker library: loaded on demand
└── Email validator: loaded on demand
```

#### **Image Optimization**
```
Next.js Image Component:
├── Hero image: 1200x800, WebP + fallback
├── Template thumbnails: 300x300, AVIF + WebP
├── Model preview textures: AVIF, optimized atlasing

Lazy Loading:
├── Browse page: scroll-based lazy loading
├── Customize page: preload next template model
└── Confirmation page: no images (text-heavy)
```

#### **Bundle Size Targets**
```
JavaScript:
├── Landing: ~150KB (vendor + page)
├── Browse: ~250KB (vendor + grid + cards)
├── Customize: ~800KB (vendor + 3D libs + scene)
└── Confirmation: ~100KB (vendor + page)

CSS:
├── Global: ~40KB (Tailwind purged)
├── Per-page: ~10KB (additional scoped)
```

#### **3D Performance**
```
Rendering:
├── Canvas resolution: clamp to screen density (not 4K)
├── Model LOD: Use simplified geometry if available
├── Lights: Optimize shadow maps (512x512, not 2K)
├── Effects: Bloom disabled on low-end devices

Loading:
├── Model preload: Start on route change, not mount
├── Suspend fallback: Show skeleton while loading
├── Cache: Use browser cache headers + service worker
```

### 10.2 Backend Performance

#### **Request Optimization**
```
/api/templates:
├── Response caching: 1 hour (ISR friendly)
├── Pagination: Default 12 items
├── Compression: GZIP enabled
└── HTTP/2 Server Push: Templates list on landing

/api/submit-request:
├── Async email dispatch (don't await Resend)
├── Database write (future): optimized indexes
├── Rate limiting: 5 requests per IP per hour
└── Timeout: 30 seconds (cover email retry logic)
```

#### **Email Service (Resend)**
```
Batching:
├── Admin emails: bundled per hour (future)
├── User emails: individual, immediate

Retry Logic:
├── On failure: retry up to 3 times
├── Exponential backoff: 2s, 4s, 8s
├── Alert admin if all retries fail

Queue (future):
├── Bull Queue for high-volume scenarios
├── Fallback to in-memory queue during outages
```

### 10.3 SEO & Accessibility

#### **Next.js SEO**
```
Metadata:
├── Root: title, description, OG tags
├── Pages: unique title + description per route
└── JSON-LD: structured data for templates

Sitemap:
├── Dynamic generation: /sitemap.xml
├── Include: all templates, browse, confirmation

Robots:
├── Allow crawling of browse + landing
├── Disallow: /customize (dynamic, user-specific)
└── Disallow: /api routes
```

#### **Accessibility (a11y)**
```
ARIA:
├── Landmarks: <nav>, <main>, <footer>
├── Headings: h1 per page, proper hierarchy
├── Buttons: aria-label for icon buttons
├── Forms: associated labels, aria-required
└── Live regions: aria-live for loading states

Color Contrast:
├── WCAG AA: minimum 4.5:1 for text
├── Dark theme: recalculate contrast per theme

Keyboard Navigation:
├── Tab order: logical flow
├── Focus visible: always shown
├── Escape key: close modals
└── Enter key: submit forms

Screen Readers:
├── Skip links: to main content
├── Image alt: meaningful descriptions
└── Lists: semantic markup, not divs
```

---

## 11. SECURITY & VALIDATION

### 11.1 Frontend Security

```
Input Sanitization:
├── Text inputs: trim, max length enforcement
├── Email: built-in HTML5 validation + library
├── Colors: regex validation (#RGB or #RRGGBB)
└── Fonts: whitelist dropdown (no free-form input)

XSS Prevention:
├── React auto-escapes content (safe by default)
├── No dangerouslySetInnerHTML usage
├── DOMPurify for any HTML rendering (future)

CSRF:
├── Next.js handles CSRF via SameSite cookies
└── No sensitive GET requests (all via POST + validation)
```

### 11.2 Backend Security

```
API Route Security:
├── Rate limiting: 5 requests per IP per hour
├── Request size limit: 100KB max body
├── Timeout: 30 seconds per request
└── CORS: configured for same-origin only

Data Validation:
├── Zod/Yup schema validation on all inputs
├── Template ID: verify exists in database
├── Email: RFC 5322 compliant validation
├── Text length: 1-255 characters per field
├── Colors: #RGB or #RRGGBB format only
└── Fonts: against whitelist

Secrets Management:
├── Resend API key: environment variable
├── Admin email: environment variable
├── No secrets in client code (use middleware)

Logging & Monitoring:
├── Log all API errors (not sensitive data)
├── Alert on: rate limit breaches, email failures
└── Audit trail: request submissions (future)
```

---

## 12. DEVELOPMENT & DEPLOYMENT WORKFLOW

### 12.1 Development Environment

```
Local Setup:
├── Node.js 18+
├── Next.js dev server (next dev)
├── Tailwind CSS: JIT mode
├── Environment variables: .env.local (git-ignored)
└── 3D models: symlink or copy to /public

Testing:
├── Unit: Jest + React Testing Library
├── E2E: Playwright (future, for customize flow)
├── 3D: Manual inspection (Three.js is hard to test)
└── a11y: axe-core automated checks

Browser Support:
├── Chrome/Edge 90+
├── Firefox 88+
├── Safari 14+
└── Graceful degradation: no 3D → fallback to images
```

### 12.2 Deployment

```
Platform: Vercel (native Next.js support)

Pre-deployment:
├── Build: next build (static export where possible)
├── Lint: eslint, prettier
├── Type check: tsc --noEmit
└── Security: npm audit

Environment Configuration:
├── Production: Resend API key (production)
├── Staging: Resend API key (sandbox)
└── Database: (future) connection pooling

CI/CD Pipeline:
├── Push to main → Run tests
├── Tests pass → Build
├── Build succeeds → Deploy to Vercel
├── Monitor: error tracking (Sentry, future)
└── Rollback: Vercel deployment history
```

### 12.3 Monitoring & Analytics

```
Error Tracking:
├── Sentry (future): frontend + backend errors
├── Custom logging: API route errors to file/DB
└── Alerts: email on critical failures

Performance Monitoring:
├── Web Vitals: CLS, FID, LCP (via Vercel Analytics)
├── Custom metrics: 3D scene load time
├── Database queries: query duration (future)

Analytics (future):
├── Page views: Plausible (privacy-friendly)
├── User funnels: landing → browse → customize → submit
├── Template popularity: most customized
└── Submission rate: conversion tracking
```

---

## 13. FUTURE ENHANCEMENTS & SCALABILITY

### 13.1 Phase 2 Features

```
User Accounts:
├── Sign up / Login (NextAuth.js)
├── Save customizations
├── Order history
└── Saved templates / favorites

Admin Dashboard:
├── View pending requests
├── Mark as completed
├── Send delivery email
├── Analytics dashboard

Design Delivery:
├── File upload interface (admin)
├── Email delivery to user
├── Download link + expiration
└── Revision requests

Extended Customization:
├── More templates
├── Layout adjustments (not just text/color/font)
├── Image uploads (for user-provided graphics)
└── Preview download (PNG/PDF)
```

### 13.2 Scalability Considerations

```
Database (when added):
├── Use relational DB (PostgreSQL + Prisma)
├── Indexes on: templateId, userId, status
├── Archive old requests (historical data)
└── Backup strategy: daily snapshots

Caching Strategy:
├── CDN: Vercel Edge Network for static content
├── API caching: Redis (future) for templates
├── Browser cache: Service Worker for models
└── Database query cache: Prisma caching

High Volume Readiness:
├── Async email queue: Bull or Inngest
├── Database connection pooling
├── Load testing: k6 or Artillery
└── Monitoring: Grafana for infrastructure

3D Assets:
├── S3 or Cloudflare R2 for model distribution
├── CDN delivery for .glb files
├── Model compression: gltf-pipeline
└── Variant management: LOD per template
```

---

## 14. FILE STRUCTURE SUMMARY

```
designforge-studio/
├── app/
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing
│   ├── browse/
│   │   └── page.tsx                # Browse
│   ├── customize/
│   │   ├── [templateId]/
│   │   │   └── page.tsx            # Customize (dynamic)
│   │   └── layout.tsx              # Layout wrapper
│   ├── confirmation/
│   │   └── page.tsx                # Confirmation
│   ├── api/
│   │   ├── templates/
│   │   │   ├── route.ts            # GET all
│   │   │   └── [id]/
│   │   │       └── route.ts        # GET single
│   │   ├── customize/
│   │   │   └── route.ts            # POST validate
│   │   ├── submit-request/
│   │   │   └── route.ts            # POST submit
│   │   └── health/
│   │       └── route.ts            # Health check
│   └── globals.css                 # Global styles
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── Tabs.tsx
│   │   └── Badge.tsx
│   ├── features/
│   │   ├── HeroSection.tsx
│   │   ├── HeroScene.tsx
│   │   ├── TemplateGrid.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── PreviewScene.tsx
│   │   ├── CustomizationPanel.tsx
│   │   └── ConfirmationCard.tsx
│   └── providers/
│       ├── ThemeProvider.tsx
│       └── RootProvider.tsx
├── lib/
│   ├── store/
│   │   ├── themeStore.ts           # Zustand theme
│   │   └── customizationStore.ts   # Zustand customization
│   ├── hooks/
│   │   ├── useTheme.ts
│   │   ├── useCustomization.ts
│   │   ├── useTemplates.ts
│   │   ├── useTemplate.ts
│   │   └── use3DScene.ts
│   ├── api/
│   │   ├── templates.ts            # API client
│   │   └── requests.ts             # API client
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   ├── cn.ts (classnames utility)
│   │   └── constants.ts
│   └── types/
│       ├── index.ts
│       ├── template.ts
│       ├── customization.ts
│       └── request.ts
├── public/
│   ├── models/
│   │   ├── poster-1.glb
│   │   ├── invitation-1.glb
│   │   ├── menu-1.glb
│   │   └── ...
│   ├── images/
│   │   ├── hero-banner.jpg
│   │   ├── template-thumbs/
│   │   └── ...
│   └── fonts/
│       └── (if using custom fonts)
├── config/
│   ├── fonts.ts                    # Font families
│   ├── colors.ts                   # Brand colors
│   ├── templates.ts                # Template data
│   └── tailwind.ts                 # Tailwind extensions
├── styles/
│   ├── globals.css                 # Global styles
│   ├── themes.css                  # Theme CSS vars
│   ├── animations.css              # Framer Motion utils
│   └── glass.css                   # Glassmorphism utilities
├── middleware.ts                   # Next.js middleware (auth, redirects)
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
├── .env.local.example              # Environment template
└── README.md                        # Documentation
```

---

## 15. DEPENDENCY LIST (PLANNED)

### Core
- next@14+
- react@18+
- typescript

### Styling & Animation
- tailwindcss@3+
- framer-motion@10+
- clsx

### 3D
- @react-three/fiber@8+
- @react-three/drei@9+
- three@r156+

### State Management
- zustand@4+

### Data Fetching
- swr@2+ or react-query@5+

### Forms & Validation
- zod@3+

### Email
- resend@1+

### Utilities
- date-fns (for date formatting, optional)
- uuid (for ID generation)

### Development
- eslint
- prettier
- @types/react
- @types/node

### Testing (Future)
- jest
- @testing-library/react
- playwright

---

## 16. KEY ARCHITECTURAL DECISIONS & RATIONALE

| Decision | Why |
|----------|-----|
| **Zustand for theme** | Lightweight, single source of truth, localStorage-friendly |
| **SWR for templates** | Built-in caching, revalidation, simpler than React Query |
| **Next.js API Routes** | Serverless, type-safe with TypeScript, zero additional setup |
| **Resend for email** | Simple API, good deliverability, React component support |
| **3D limited to hero + preview** | Maximize performance; static thumbnails for browse |
| **React Three Fiber only** | Abstraction over Three.js, React-friendly, easier state sync |
| **Glassmorphism as main theme** | Modern, trendy, pairs well with dark mode |
| **Watermorphism for buttons** | Smooth, fluid feel; differentiates from standard buttons |
| **No database initially** | MVP simplicity; scalability added in Phase 2 |
| **Vercel deployment** | Native Next.js support, edge functions, analytics |

---

## 17. SUMMARY & NEXT STEPS

### What's Covered
✅ Full system architecture (frontend, backend, 3D, state, styling)
✅ Page structure & routing
✅ Component hierarchy
✅ State management strategy (Zustand + SWR)
✅ 3D integration boundaries & performance
✅ API endpoints & business logic
✅ Type definitions
✅ Performance & security strategy
✅ Deployment & monitoring
✅ File structure & dependencies
✅ Future scalability roadmap

### Ready to Code
This architecture document is a **comprehensive blueprint**. Code should follow this structure exactly:
- Pages: As defined in section 3
- Components: As defined in section 5
- Stores: As defined in section 4
- API routes: As defined in section 8
- Types: As defined in section 9
- Styling: As defined in section 7

### NO CODE yet—foundation is set.
