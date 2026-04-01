# DesignForge Studio - Visual Architecture Diagrams

## DIAGRAM 1: User Journey Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   Landing Page      │
│   (Route: /)        │
│                     │
│  • 3D Hero Scene    │
│  • Value Prop       │
│  • CTA Button       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│   Browse Templates      │   ◄─────────────┐
│   (Route: /browse)      │                 │
│                         │                 │
│  • Grid of 12           │                 │
│  • Filter by category   │        (Back to browse)
│  • Pagination           │                 │
└──────────┬──────────────┘                 │
           │                                │
           ├─► Select Template ─┐           │
           │                    │           │
           │                    ▼           │
           │         ┌─────────────────────────────┐
           │         │ Customize Page              │
           │         │ (Route: /customize/[id])    │
           │         │                             │
           │         │ Left (60%): 3D Preview      │
           │         │ - Interactive model         │
           │         │ - Rotation/Zoom controls    │
           │         │                             │
           │         │ Right (40%): Customize      │
           │         │ - Text editor               │
           │         │ - Color picker              │
           │         │ - Font selector             │
           │         │ - Submit button             │
           │         └────────────┬────────────────┘
           │                      │
           │                      ├─► Edit ─┐ (stays on page)
           │                      │          │
           │                      └──────────┘
           │
           │                      │
           │                      ▼
           │         ┌─────────────────────────────┐
           │         │ Confirmation Page           │
           │         │ (Route: /confirmation)      │
           │         │                             │
           │         │ • Success icon              │
           │         │ • Order summary             │
           │         │ • Email confirmation        │
           │         │ • Next steps info           │
           │         └────────────┬────────────────┘
           │                      │
           │                      ▼
           │         ┌─────────────────────────────┐
           │         │ Email Received (User)       │
           │         │                             │
           │         │ + Admin Email               │
           │         └─────────────────────────────┘
           │
           └─────────────────────────────────────────────► (Browse again)
```

---

## DIAGRAM 2: State Management Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT HIERARCHY                                 │
└──────────────────────────────────────────────────────────────────────────────┘

                           GLOBAL PERSISTENT STATE
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
        │ Theme Store  │    │Customization │   │  Server      │
        │  (Zustand)   │    │   Store      │   │  State (SWR) │
        │              │    │  (Zustand)   │   │              │
        ├──────────────┤    ├──────────────┤   ├──────────────┤
        │ theme: light │    │selectedTemplate  │ Templates[]  │
        │ dark         │    │Id: string    │   │              │
        │              │    │              │   │ Cached from: │
        │ Persisted:   │    │customizations│   │ /api/        │
        │ localStorage │    │ {            │   │ templates    │
        │              │    │   texts: {}  │   │              │
        │ Scope: Global│    │   colors: {} │   │ Auto         │
        │              │    │   fonts: {}  │   │ revalidate   │
        │ Listeners:   │    │ }            │   │              │
        │ Root Layout  │    │              │   │ Listeners:   │
        │              │    │ NOT persisted│   │ Browse,      │
        │              │    │ (per-session)│   │ Customize    │
        │              │    │              │   │ pages        │
        │              │    │ Listeners:   │   │              │
        │              │    │ Customize    │   │              │
        │              │    │ Panel        │   │              │
        └──────────────┘    └──────────────┘   └──────────────┘
                 │
                 │ (On theme toggle)
                 ▼
        Update <html data-theme>
        Trigger CSS var re-computation
        Update all consuming components


                          LOCAL COMPONENT STATE
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌──────────────┐    ┌──────────────┐   ┌──────────────┐
        │ 3D Scene UI  │    │Customization │   │ Form Submit  │
        │  (useState)  │    │  Tabs        │   │   (useState) │
        │              │    │  (useState)  │   │              │
        ├──────────────┤    ├──────────────┤   ├──────────────┤
        │ rotationX    │    │ activeTab:   │   │ isSubmitting │
        │ rotationY    │    │ 'text'|'color│   │              │
        │ zoom         │    │ '|'font'     │   │ errorMsg     │
        │ isLoading    │    │              │   │              │
        │              │    │ isEditing    │   │ successMsg   │
        │ Scope:       │    │              │   │              │
        │ 3DScene      │    │ Scope:       │   │ Scope:       │
        │ component    │    │ Customize    │   │ Form/Modal   │
        │              │    │ Panel comp   │   │ component    │
        │ Triggers:    │    │              │   │              │
        │ Canvas       │    │ Triggers:    │   │ Triggers:    │
        │ re-render    │    │ Tab switch   │   │ Submit click │
        └──────────────┘    └──────────────┘   └──────────────┘
```

---

## DIAGRAM 3: 3D Integration Points

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       3D SCENES IN THE APP                                    │
└──────────────────────────────────────────────────────────────────────────────┘

                    LANDING PAGE (/)
                          │
                    ┌─────▼─────┐
                    │HeroSection │
                    └─────┬─────┘
                          │
                    ┌─────▼──────────────────┐
                    │   HeroScene (R3F)      │
                    │                        │
                    │  ┌────────────────┐   │
                    │  │ Canvas         │   │
                    │  │  ├─ Camera     │   │
                    │  │  ├─ Lights     │   │
                    │  │  ├─ Model      │   │
                    │  │  │  (auto-rotate) │
                    │  │  └─ Bloom FX   │   │
                    │  └────────────────┘   │
                    │                        │
                    │  Controls: DISABLED    │
                    │  (auto-rotation only)  │
                    │                        │
                    │  Performance:          │
                    │  • Preload on init     │
                    │  • 60 FPS target       │
                    │  • Clamp resolution    │
                    └────────────────────────┘
                                │
                                │ Model: /public/models/
                                │        hero-poster.glb
                                │


                    CUSTOMIZE PAGE (/customize/[id])
                          │
                          ├─ Left Panel (60%)
                          │       │
                          │   ┌───▼──────────────────┐
                          │   │ PreviewScene (R3F)   │
                          │   │                      │
                          │   │ ┌────────────────┐   │
                          │   │ │ Canvas         │   │
                          │   │ │  ├─ Camera     │   │
                          │   │ │  ├─ Lights     │   │
                          │   │ │  ├─ Model      │   │
                          │   │ │  │  (interactive) │
                          │   │ │  └─ Effects    │   │
                          │   │ └────────────────┘   │
                          │   │                      │
                          │   │ Controls: ENABLED    │
                          │   │ • Orbit rotate       │
                          │   │ • Zoom (scroll)      │
                          │   │ • Reset button       │
                          │   │                      │
                          │   │ HUD Overlay:         │
                          │   │ • Rotation angle     │
                          │   │ • Zoom level %       │
                          │   │                      │
                          │   └────────────────────┘
                          │
                          └─ Right Panel (40%)
                                  │
                              ┌───▼──────────────┐
                              │CustomizationPanel│
                              │                  │
                              │ Tabs:            │
                              │ • Text Input     │
                              │ • Color Picker   │
                              │ • Font Select    │
                              │                  │
                              │ NOT 3D           │
                              │ (2D controls)    │
                              └──────────────────┘

                    BROWSE PAGE (/browse)
                          │
                          │ NOT 3D
                          │
                    ┌─────▼──────────────────┐
                    │   TemplateGrid         │
                    │                        │
                    │  Static thumbnail      │
                    │  images (no 3D)        │
                    │  for performance       │
                    │                        │
                    └────────────────────────┘

─────────────────────────────────────────────────────────────────────────────

                    3D ↔ STATE SYNC

PreviewScene                           Zustand Store
(Local 3D state)                       (Global customization)
        │                                      │
        ├─ rotationX ◄────────────────────────┤
        ├─ rotationY ◄────────────────────────┤
        ├─ zoom      ◄────────────────────────┤
        │                                      │
        └─ Color material update ◄────────────┤ (colors.accent)
           (if model supports)


User interacts with                    Customization Panel
CustomizationPanel                     (2D controls)
        │                                      │
        └──────────────────────────────────────┤
                                               │
                                    Zustand update
                                               │
                                    ┌──────────▼──────────┐
                                    │ Re-render 3D Scene  │
                                    │ with new materials  │
                                    └─────────────────────┘
```

---

## DIAGRAM 4: Data Flow - From Selection to Submission

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    DATA FLOW: SELECTION TO SUBMISSION                         │
└──────────────────────────────────────────────────────────────────────────────┘

USER CLICKS "CUSTOMIZE" ON TEMPLATE CARD
        │
        ▼
Navigate to /customize/[templateId]
        │
        ├─────────────────────────┬──────────────────────────┐
        │                         │                          │
        ▼                         ▼                          ▼
Fetch from SWR          Store templateId in     Load 3D model
/api/templates/:id      Zustand store           in PreviewScene
        │                         │                          │
        │                    ┌────▼────┐                     │
        │                    │Customize │                    │
        │                    │Store     │                    │
        │                    │{         │                    │
        │                    │ selected │                    │
        │                    │ TplId    │                    │
        │                    │}         │                    │
        │                    └────┬────┘                     │
        │                         │                          │
        ▼                         │                          ▼
┌──────────────────┐              │              ┌────────────────────┐
│ Template object  │              │              │ 3D Scene rendered  │
│ {                │              │              │ with model         │
│   name: "...",   │              │              │ auto-loaded        │
│   defaults: {    │              │              └────────────────────┘
│     texts: {},   │              │
│     colors: {},  │              │
│     fonts: {}    │              │
│   },             │              │
│   availableFonts:│              │
│   [...]          │              │
│ }                │              │
│                  │              │
│ ▼ Initialize     │              │
│    customization │              │
└────────┬─────────┘              │
         │                        │
         ▼                        │
Zustand customization            │
.setCustomization()              │
         │                        │
    ┌────▼────┐                   │
    │Store    │                   │
    │{        │                   │
    │ texts   │                   │
    │ colors  │◄──────────────────┘
    │ fonts   │
    │}        │
    └────┬────┘
         │
         ▼
CustomizationPanel renders with values

─────────────────────────────────────────────────────────────

USER EDITS TEXT / CHANGES COLOR / PICKS FONT
         │
    ┌────┴───┐
    │         │
    ▼         ▼
Local state Canvas HUD
update      updates
    │         │
    └────┬────┘
         │
         ▼
Zustand.setCustomization() called
         │
    ┌────▼────────────────────┐
    │ Store updated           │
    │ {                       │
    │   texts: { edited },    │
    │   colors: { changed },  │
    │   fonts: { selected }   │
    │ }                       │
    └────┬─────────────────────┘
         │
    ┌────┴─────────────────┬────────────────┐
    │                      │                │
    ▼                      ▼                ▼
Re-render         Update material       Update HUD
Custom Panel      (if applicable)       labels
    │                     │                │
    └─────────┬───────────┴───────────────┘
              │
              ▼
     Real-time preview
     (no server calls yet)

─────────────────────────────────────────────────────────────

USER CLICKS "SUBMIT"
         │
         ▼
Form validation
(local)
         │
    ├─ Check all fields filled
    ├─ Validate email format
    └─ Validate text lengths
         │
         ▼ (if valid)
Show loading state
setIsSubmitting(true)
         │
         ▼
POST /api/submit-request
{
  templateId: "...",
  customizations: Zustand.getState(),
  userEmail: "...",
  userName: "..."
}
         │
         ▼
API Route Handler
         │
    ├─ Validate inputs (Zod)
    ├─ Verify template exists
    ├─ Sanitize text (XSS)
    ├─ Format email template
    └─ Generate requestId
         │
         ▼
Dispatch Emails (Resend)
         │
    ├─ Admin notification
    └─ User confirmation
         │
         ▼
Return {
  success: true,
  requestId: "req-uuid"
}
         │
         ▼
Client handles response
         │
    ├─ Stop loading
    ├─ Show success toast
    └─ Redirect to /confirmation?requestId=...
         │
         ▼
Confirmation Page
         │
    ├─ Display order summary
    ├─ Show email confirmation
    └─ Next steps info
```

---

## DIAGRAM 5: API Routes & Request/Response

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         API ARCHITECTURE                                      │
└──────────────────────────────────────────────────────────────────────────────┘

CLIENT                              API ROUTE                    SERVICE
(Next.js Page)                    (Route Handler)              (Resend / DB)

                           ┌─────────────────────┐
GET /api/templates ───────►│ /api/templates/     │
(Browse page init)         │ route.ts            │
                           │                     │
                           │ GET handler:        │
                           │ • Validate query    │
                           │ • Fetch templates   │
                           │ • Return JSON       │
                           └──────────┬──────────┘
                                      │
                    Response ◄────────┘
{                                   
  data: [Templates[]],          
  total: 42,                    
  hasMore: true                 
}


GET /api/templates/:id ────►│ /api/templates/    │
(Customize page init)       │ [id]/route.ts      │
                            │                    │
                            │ GET handler:       │
                            │ • Validate ID      │
                            │ • Fetch template   │
                            │ • Include defaults │
                            │ • Return JSON      │
                            └────────┬───────────┘
                                     │
                    Response ◄───────┘
{
  id: "...",
  name: "...",
  defaults: { ... },
  availableFonts: [...]
}


POST /api/submit-request ───►│ /api/submit-        │     ┌──────────────┐
{                            │ request/route.ts    │────►│ Resend API   │
  templateId,                │                     │     │              │
  customizations,            │ POST handler:       │     │ Send email   │
  userEmail,                 │ • Validate inputs   │     │ (admin +     │
  userName                   │ • Check template    │     │  user)       │
}                            │ • Sanitize text     │     └──────────────┘
                             │ • Format emails     │
                             │ • Call Resend       │
                             │ • Return response   │
                             └────────┬────────────┘
                                      │
                    Response ◄────────┘
{
  success: true,
  requestId: "req-uuid"
}

                           ┌──────────────────┐
GET /api/health ──────────►│ /api/health/      │
(Status check)             │ route.ts          │
                           │                   │
                           │ Simple check      │
                           └────────┬──────────┘
                                    │
                    Response ◄──────┘
{ status: "ok" }


─────────────────────────────────────────────────────────────────────────────

CACHING STRATEGY

GET /api/templates          SWR Cache:
├─ Response: 200            ├─ Revalidate: 3600s (1 hour)
├─ Cache-Control: public    ├─ Stale-while-revalidate: 86400s
├─ max-age: 3600           └─ Browser: 1 hour
└─ immutable if no changes


GET /api/templates/:id      SWR Cache:
├─ Response: 200            ├─ Revalidate: 3600s
├─ Cache-Control: public    └─ On-demand revalidate possible
└─ max-age: 3600


POST /api/submit-request    NO CACHING
├─ Response: 200 / 400      (Each submit is unique)
├─ Cache-Control: no-cache
└─ Rate-limit: 5 per IP/hour


─────────────────────────────────────────────────────────────────────────────

ERROR HANDLING

API Error ──────► Handler catches ──────► Return error response
                                                │
                            ┌──────────────────┴──────────┐
                            │                             │
                      Validation Error              Server Error
                      (4xx status)                  (5xx status)
                            │                             │
                      ┌─────▼────┐               ┌────────▼───────┐
                      │ 400 Bad   │               │ 500 Internal   │
                      │ Request   │               │ Server Error   │
                      │           │               │                │
                      │ {         │               │ {              │
                      │  error:   │               │  error:        │
                      │  "Invalid │               │  "Server error"│
                      │   email"  │               │  retry: true   │
                      │ }         │               │ }              │
                      └───────────┘               └────────────────┘
                            │                             │
                      Handled on              Logged to Sentry
                      client w/               Alert admin
                      toast                   Offer retry
```

---

## DIAGRAM 6: Theme System & CSS Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       THEME & STYLING SYSTEM                                  │
└──────────────────────────────────────────────────────────────────────────────┘

ROOT COMPONENT (layout.tsx)
        │
        ├─ Zustand ThemeStore
        │  theme: 'light' | 'dark'
        │
        └─ useEffect(() => {
              document.documentElement.dataset.theme = theme
              localStorage.setItem('designforge-theme', theme)
           })
              │
              ▼
        <html data-theme="light">


GLOBAL STYLES (styles/themes.css)
        │
    ┌───┴─────────────┬───────────────────┐
    │                 │                   │
    ▼                 ▼                   ▼
[data-theme="light"] │               [data-theme="dark"]
                     │
CSS Variables:       │                CSS Variables:
--glass-bg:         │                --glass-bg:
  rgba(255,255,255  │                  rgba(30,30,46
  ,0.7)             │                  ,0.8)
                     │
--glass-border:      │                --glass-border:
  rgba(255,255,255  │                  rgba(100,100,150
  ,0.3)             │                  ,0.2)
                     │
--water-primary:     │                --water-primary:
  #3B82F6           │                  #60A5FA
                     │
--light-glow:        │                --light-glow:
  rgba(59,130,246    │                  rgba(96,165,250
  ,0.2)             │                  ,0.15)
                     │
...more vars         │                ...more vars


TAILWIND CONFIG (tailwind.config.ts)
        │
    ┌───┴──────────────────────┐
    │                          │
    ▼                          ▼
extend colors             extend plugins
    │                          │
  [names]:                Custom CSS classes:
  "from-var(--glass-bg)"  .glass
                          .water
  Allows:                 .lightmorphism
  bg-[--glass-bg]         (defined as Tailwind
                          plugins using CSS vars)


COMPONENT STYLING (Button.tsx example)
        │
    ┌───┴──────────────────┐
    │                      │
    ▼                      ▼
Base classes        Variant classes
    │                      │
className="        ├─ primary: bg-[--water-primary]
  px-4 py-2        ├─ secondary: border-[--glass-border]
  rounded-lg       └─ glass: bg-[--glass-bg]
                          │
                          ▼
                      CSS computed:
                      At runtime, browser
                      resolves CSS vars based on
                      data-theme attribute

                          │
                          ▼
                    Light button (white bg)
                    OR
                    Dark button (semi-dark bg)


ANIMATION CONFIG (Framer Motion)
        │
    ┌───┴───────────────────────────┐
    │                               │
    ▼                               ▼
Variants object              Transition defaults
(animations.ts)              (motion/constants.ts)
    │                               │
    ├─ pageEnter                   ├─ duration: 300ms
    ├─ pageExit                    ├─ ease: easeInOut
    ├─ cardHover                   └─ stagger: 0.05s
    ├─ waterFlow                      (for children)
    └─ glassHover
              │
              ▼
        Used in components:
        <motion.div
          initial="pageEnter"
          animate="pageEnter"
          exit="pageExit"
          variants={pageVariants}
        />


GLASS EFFECT UTILITY (styles/glass.css)
        │
        ├─ .glass-container
        │  ├─ background: var(--glass-bg)
        │  ├─ backdrop-filter: blur(20px)
        │  ├─ border: 1px solid var(--glass-border)
        │  ├─ box-shadow: var(--glass-shadow)
        │  └─ border-radius: 1rem
        │
        ├─ .glass-button
        │  ├─ (inherits .glass-container)
        │  ├─ cursor: pointer
        │  └─ transition: all 300ms
        │
        └─ .glass-card
           ├─ (inherits .glass-container)
           └─ padding: 1.5rem


WATER EFFECT (via Tailwind + CSS vars)
        │
        ├─ Button primary:
        │  ├─ background: var(--water-primary)
        │  ├─ transition: all 300ms
        │  └─ hover: scale(1.02), blur-shadow
        │
        └─ Animation:
           ├─ @keyframes waterFlow
           │  ├─ 0%: transform translateY(0)
           │  ├─ 50%: transform translateY(-2px)
           │  └─ 100%: transform translateY(0)


LIGHTMORPHISM EFFECT (via CSS vars + Tailwind)
        │
        ├─ Background elements:
        │  ├─ radial-gradient(var(--light-glow))
        │  ├─ opacity: 0.5
        │  └─ blur: blur(40px)
        │
        └─ Used for:
           ├─ Hero background
           ├─ Card backgrounds
           └─ Focus highlights
```

---

## DIAGRAM 7: Component Dependency Tree

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT DEPENDENCY TREE                                  │
└──────────────────────────────────────────────────────────────────────────────┘

ROOT
│
├── RootProvider (layout.tsx)
│   │
│   ├── ThemeProvider (Zustand context)
│   │
│   └── Navbar
│       ├── Logo
│       ├── NavLinks
│       └── ThemeToggle (Button)
│
├── PAGE: Landing (/)
│   │
│   └── HeroSection
│       ├── HeroScene (R3F Canvas)
│       │   ├── Model (gltf loader)
│       │   ├── Camera
│       │   ├── Lights
│       │   ├── Background
│       │   └── Loading Suspense
│       │
│       └── HeroText (Overlay)
│           ├── Heading (h1)
│           ├── Subheading (p)
│           └── CTA Button
│
├── PAGE: Browse (/browse)
│   │
│   ├── PageHeader
│   │   ├── Title
│   │   ├── Subtitle
│   │   └── FilterBar (future)
│   │
│   └── TemplateGrid
│       │
│       └── TemplateCard (x12)
│           ├── Image (static thumbnail)
│           ├── Badge
│           ├── Title
│           ├── Description
│           └── Button ("Customize")
│
├── PAGE: Customize (/customize/[id])
│   │
│   ├── PageHeader
│   │   ├── Breadcrumb
│   │   └── Title
│   │
│   └── MainGrid
│       │
│       ├── Left Panel (60%)
│       │   │
│       │   ├── PreviewScene (R3F Canvas)
│       │   │   ├── Model (dynamic)
│       │   │   ├── Camera (controlled)
│       │   │   ├── Lights
│       │   │   ├── Effects
│       │   │   └── OrbitControls
│       │   │
│       │   └── ControlsHUD
│       │       ├── RotationDisplay
│       │       ├── ZoomSlider
│       │       └── ResetButton
│       │
│       └── Right Panel (40%)
│           │
│           └── CustomizationPanel
│               │
│               ├── TabNav
│               │   ├── TextTab
│               │   ├── ColorTab
│               │   └── FontTab
│               │
│               ├── TabContent
│               │   │
│               │   ├── TextEditorTab
│               │   │   └── DynamicTextInputs (map customizableFields)
│               │   │       └── Input (per field)
│               │   │
│               │   ├── ColorPickerTab
│               │   │   └── ColorPicker (per field)
│               │   │
│               │   └── FontSelectorTab
│               │       └── Select (per field)
│               │
│               ├── Divider
│               │
│               ├── PreviewToggle (2D/3D switch)
│               │
│               └── SubmitButton
│                   └── Loads loading state
│                       Shows success/error
│                       Triggers submit handler
│
├── PAGE: Confirmation (/confirmation)
│   │
│   ├── SuccessIcon (animated)
│   │
│   ├── OrderSummary
│   │   ├── Template name
│   │   ├── Request ID
│   │   └── Date/Time
│   │
│   ├── EmailConfirmation
│   │   ├── Icon
│   │   └── "Confirmation sent to..."
│   │
│   └── NextStepsCallout
│       └── "You'll receive your design..."
│
├── SHARED COMPONENTS (UI)
│   │
│   ├── Button (variants: primary, secondary, glass)
│   ├── Card (glass styling)
│   ├── Input (text field with validation)
│   ├── Select (dropdown with custom styling)
│   ├── ColorPicker (custom component)
│   ├── Tabs (tabbed interface)
│   ├── Badge (category/status indicator)
│   ├── Divider (visual separator)
│   └── Loading Spinner (Suspense fallback)
│
└── PROVIDERS (Root Wrapper)
    │
    ├── ThemeProvider (Zustand hook)
    └── RootProvider (Next.js Suspense + Providers)


HOOKS USED THROUGHOUT
│
├── useTheme() 
│   └── Used in: Navbar, CustomizationPanel, PreviewScene
│
├── useCustomization()
│   └── Used in: CustomizationPanel, PreviewScene, Form
│
├── useTemplates()
│   └── Used in: Browse page
│
├── useTemplate(id)
│   └── Used in: Customize page
│
├── use3DScene()
│   └── Used in: HeroScene, PreviewScene
│
├── useState()
│   └── Local state in all feature components
│
└── useCallback() / useMemo()
    └── For optimization in heavy components
```

---

## DIAGRAM 8: Performance Optimization Strategy

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                   PERFORMANCE OPTIMIZATION LAYERS                             │
└──────────────────────────────────────────────────────────────────────────────┘

CLIENT-SIDE OPTIMIZATION

Bundling
  │
  ├─ next/dynamic
  │  ├─ Load R3F only on pages using 3D
  │  ├─ Load ColorPicker on demand
  │  └─ Load validators on demand
  │
  ├─ Tree shaking
  │  ├─ Import specific from libraries
  │  └─ Remove dead code
  │
  └─ Minification
     └─ Next.js handles automatically


Image Optimization
  │
  ├─ next/image
  │  ├─ Hero: 1200x800 WebP + fallback
  │  ├─ Thumbnails: 300x300 AVIF + WebP
  │  └─ Auto-responsive sizing
  │
  └─ Lazy loading
     ├─ Browse: scroll-based
     └─ Preload: next template on customize


3D Optimization
  │
  ├─ Model Loading
  │  ├─ Preload on route change (not mount)
  │  ├─ Compress .glb files (gltf-pipeline)
  │  └─ Browser cache (Service Worker)
  │
  ├─ Rendering
  │  ├─ Canvas resolution: screen density only
  │  ├─ LOD (Level of Detail): simplified geo if available
  │  ├─ Lights: optimized shadows (512x512)
  │  └─ Cull: back-face culling enabled
  │
  └─ Performance Monitoring
     ├─ Measure: 3D scene load time
     ├─ Alert: if >2 seconds
     └─ Fallback: show static image


CSS Optimization
  │
  ├─ Tailwind Purging
  │  ├─ Remove unused classes
  │  ├─ Global: ~40KB
  │  └─ Per-page: ~10KB additional
  │
  └─ Critical CSS
     ├─ Inline above-the-fold styles
     └─ Defer non-critical

─────────────────────────────────────────────────────────────────────────────

SERVER-SIDE OPTIMIZATION

API Response Caching
  │
  ├─ /api/templates
  │  ├─ ISR: Revalidate every 1 hour
  │  ├─ SWR: Browser cache 1 hour
  │  └─ Response: ~50KB (12 items)
  │
  └─ /api/templates/:id
     ├─ On-demand revalidation
     └─ Response: ~10KB per template


Database Queries (Future)
  │
  ├─ Indexing
  │  ├─ Index on templateId
  │  ├─ Index on userId
  │  └─ Index on status
  │
  ├─ Connection Pooling
  │  └─ PrismaClient with pooling
  │
  └─ Query Optimization
     ├─ Select only needed fields
     └─ Eager load relations


Email Dispatch
  │
  ├─ Async
  │  ├─ Don't await Resend call
  │  └─ Return response immediately
  │
  └─ Retry Logic
     ├─ 3 retries with exponential backoff
     └─ Alert on all failures


─────────────────────────────────────────────────────────────────────────────

METRICS & MONITORING

Web Vitals (Vercel Analytics)
  │
  ├─ LCP (Largest Contentful Paint)
  │  └─ Target: <2.5s
  │
  ├─ FID (First Input Delay)
  │  └─ Target: <100ms
  │
  └─ CLS (Cumulative Layout Shift)
     └─ Target: <0.1


Custom Metrics
  │
  ├─ 3D Scene Load Time
  │  ├─ Measure: from route change to first render
  │  └─ Alert: if >2s
  │
  ├─ API Response Time
  │  ├─ Measure: per endpoint
  │  └─ Alert: if >1s
  │
  └─ Email Delivery
     ├─ Measure: time to send (with retries)
     └─ Alert: if >30s


Error Tracking (Sentry - Future)
  │
  ├─ Frontend Errors
  │  ├─ Runtime exceptions
  │  ├─ API failures
  │  └─ 3D scene crashes
  │
  └─ Backend Errors
     ├─ API route errors
     ├─ Email service failures
     └─ Unhandled promises
```

---

## DIAGRAM 9: Security Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                       SECURITY ARCHITECTURE                                   │
└──────────────────────────────────────────────────────────────────────────────┘

INPUT SECURITY

Client-Side Validation
  │
  ├─ HTML5 built-in
  │  ├─ type="email"
  │  ├─ required
  │  └─ maxLength
  │
  ├─ Custom validators (Zod/Yup)
  │  ├─ Email: RFC 5322
  │  ├─ Text: 1-255 chars
  │  ├─ Colors: #RGB or #RRGGBB
  │  └─ Fonts: whitelist dropdown
  │
  └─ React escaping
     ├─ Auto-escapes content
     └─ No dangerouslySetInnerHTML


Server-Side Validation (CRITICAL)
  │
  ├─ Zod Schema
  │  ├─ Validate all fields
  │  ├─ Reject invalid data
  │  └─ Return 400 Bad Request
  │
  ├─ Business Logic
  │  ├─ Template exists? (query DB or cache)
  │  ├─ Email format valid?
  │  └─ Text length within bounds?
  │
  └─ Sanitization
     ├─ Trim whitespace
     ├─ HTML encode (no HTML allowed)
     └─ SQL injection: Use parameterized queries (Prisma)


API SECURITY

Rate Limiting
  │
  ├─ Per-IP limits
  │  ├─ /api/templates: unlimited (public)
  │  ├─ /api/submit-request: 5 per IP per hour
  │  └─ Enforce with middleware
  │
  └─ Backoff
     ├─ Return 429 Too Many Requests
     └─ Retry-After header


Request Security
  │
  ├─ Size limit: 100KB max body
  ├─ Timeout: 30 seconds per request
  ├─ CORS: same-origin only
  └─ CSRF: Next.js handles via SameSite


AUTHENTICATION (Phase 2)
  │
  ├─ NextAuth.js
  │  ├─ OAuth providers
  │  ├─ Credential flow
  │  └─ Session management
  │
  └─ Protected routes
     ├─ Admin panel: require auth
     └─ User account: require auth


DATA PROTECTION

Secrets Management
  │
  ├─ Environment variables
  │  ├─ Resend API key
  │  ├─ Admin email
  │  └─ Database credentials (Phase 2)
  │
  └─ Never in code
     ├─ No hardcoded secrets
     ├─ .env.local in .gitignore
     └─ Vercel Secrets for production


HTTPS & TLS
  │
  ├─ Vercel: automatic HTTPS
  ├─ Redirect HTTP → HTTPS
  └─ Strict-Transport-Security header


DATABASE (Phase 2)
  │
  ├─ Encrypted at rest
  ├─ Encrypted in transit
  ├─ Access control (least privilege)
  └─ Regular backups


CROSS-ORIGIN SECURITY

CORS
  │
  ├─ Allow: same-origin only
  ├─ Deny: cross-origin API calls
  └─ Exception: Resend (configured)


CSP (Content Security Policy)
  │
  ├─ Script: self + trusted CDNs
  ├─ Style: self + Tailwind CDN
  └─ Img: self + CDNs


DEPENDENCY SECURITY

Vulnerable Dependencies
  │
  ├─ npm audit
  │  ├─ Check on install
  │  ├─ Check on CI/CD
  │  └─ Auto-fix where possible
  │
  └─ Keep updated
     ├─ Dependabot (GitHub)
     └─ Regular upgrades


LOGGING & AUDITING

Error Logs
  │
  ├─ Do NOT log
  │  ├─ User emails
  │  ├─ Passwords
  │  └─ API keys
  │
  ├─ DO log
  │  ├─ Error messages
  │  ├─ Stack traces
  │  └─ API error codes
  │
  └─ Stored in
     ├─ Vercel logs (1 week)
     └─ Sentry (long-term)


COMPLIANCE (Future)

GDPR (if EU users)
  │
  ├─ Privacy policy
  ├─ User consent
  ├─ Data retention policy
  └─ Right to deletion


CCPA (if CA users)
  │
  ├─ Privacy notice
  ├─ Data disclosure
  └─ Opt-out mechanism
```

---

END OF VISUAL ARCHITECTURE DIAGRAMS
