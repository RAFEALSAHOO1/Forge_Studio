export const mockTemplates = [
  {
    id: "poster-minimal-01",
    title: "Minimal Poster",
    description: "Clean, typographic poster design perfect for events, exhibitions, and announcements. Bold hierarchy with generous white space.",
    category: "Poster",
    
    deliveryTime: "24 hours",
    price: "$49",
    specifications: [
      "A2 / A3 / A4 formats",
      "300 DPI print-ready",
      "CMYK color profile",
      "PDF + PNG delivery"
    ],
    customizableFields: [
      { key: "headline", label: "Headline", type: "text" as const, defaultValue: "Design Speaks", maxLength: 40 },
      { key: "subheadline", label: "Subheadline", type: "text" as const, defaultValue: "Where vision meets craft", maxLength: 80 },
      { key: "date", label: "Date / Tagline", type: "text" as const, defaultValue: "April 2026", maxLength: 30 },
      { key: "primaryColor", label: "Primary Color", type: "color" as const, defaultValue: "#1a1a2e" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#7c3aed" },
      { key: "headlineFont", label: "Headline Font", type: "font" as const, defaultValue: "Inter", options: ["Inter", "Playfair Display", "Space Grotesk", "DM Serif Display", "Neue Haas Grotesk"] }
    ],
    availableFonts: ["Inter", "Playfair Display", "Space Grotesk", "DM Serif Display", "Neue Haas Grotesk", "Cormorant Garamond"]
  },
  {
    id: "invitation-luxury-02",
    title: "Luxury Invitation",
    description: "Elegant wedding or event invitation with refined typography, gold accents, and bespoke detailing that leaves a lasting impression.",
    category: "Invitation",
    
    deliveryTime: "48 hours",
    price: "$79",
    specifications: [
      "5x7 inch standard",
      "350gsm textured paper ready",
      "Digital + print format",
      "Custom monogram option"
    ],
    customizableFields: [
      { key: "names", label: "Names", type: "text" as const, defaultValue: "Alexandra & James", maxLength: 50 },
      { key: "date", label: "Date", type: "text" as const, defaultValue: "June 14, 2026", maxLength: 30 },
      { key: "venue", label: "Venue", type: "text" as const, defaultValue: "The Grand Atelier, Paris", maxLength: 60 },
      { key: "rsvpDetails", label: "RSVP Details", type: "text" as const, defaultValue: "RSVP by May 1st", maxLength: 60 },
      { key: "backgroundColor", label: "Background", type: "color" as const, defaultValue: "#faf8f5" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#2c2417" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#c9a227" },
      { key: "primaryFont", label: "Primary Font", type: "font" as const, defaultValue: "Cormorant Garamond", options: ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville"] }
    ],
    availableFonts: ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville", "Lora"]
  },
  {
    id: "business-card-03",
    title: "Premium Business Card",
    description: "Distinctive business card with tactile design sensibility. Multiple layout variations with room for personality and brand identity.",
    category: "Business Card",
    
    deliveryTime: "24 hours",
    price: "$35",
    specifications: [
      "3.5x2 inch standard",
      "400 DPI print-ready",
      "Bleed + crop marks included",
      "Front & back design"
    ],
    customizableFields: [
      { key: "fullName", label: "Full Name", type: "text" as const, defaultValue: "Jordan Chen", maxLength: 40 },
      { key: "jobTitle", label: "Job Title", type: "text" as const, defaultValue: "Creative Director", maxLength: 50 },
      { key: "email", label: "Email", type: "text" as const, defaultValue: "jordan@studio.co", maxLength: 60 },
      { key: "phone", label: "Phone", type: "text" as const, defaultValue: "+1 (555) 000-0000", maxLength: 20 },
      { key: "website", label: "Website", type: "text" as const, defaultValue: "studio.co", maxLength: 40 },
      { key: "primaryColor", label: "Card Color", type: "color" as const, defaultValue: "#0f0f1a" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#ffffff" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#6d28d9" },
      { key: "font", label: "Font", type: "font" as const, defaultValue: "Space Grotesk", options: ["Space Grotesk", "Inter", "DM Sans", "Sora", "Satoshi"] }
    ],
    availableFonts: ["Space Grotesk", "Inter", "DM Sans", "Sora", "Satoshi", "Outfit"]
  },
  {
    id: "menu-restaurant-04",
    title: "Restaurant Menu",
    description: "Sophisticated restaurant menu design with seasonal elegance. Works for fine dining, bistros, or modern eateries with distinctive character.",
    category: "Menu",
    
    deliveryTime: "72 hours",
    price: "$129",
    specifications: [
      "A5 folded menu standard",
      "Cover + 4 inside pages",
      "RGB + CMYK versions",
      "Editable PDF format"
    ],
    customizableFields: [
      { key: "restaurantName", label: "Restaurant Name", type: "text" as const, defaultValue: "Maison Noir", maxLength: 40 },
      { key: "tagline", label: "Tagline", type: "text" as const, defaultValue: "Modern French Cuisine", maxLength: 60 },
      { key: "season", label: "Season / Edition", type: "text" as const, defaultValue: "Spring 2026", maxLength: 30 },
      { key: "backgroundColor", label: "Background", type: "color" as const, defaultValue: "#0a0a0a" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#e8d5b7" },
      { key: "accentColor", label: "Accent", type: "color" as const, defaultValue: "#c2963c" },
      { key: "headingFont", label: "Heading Font", type: "font" as const, defaultValue: "Playfair Display", options: ["Playfair Display", "Cormorant Garamond", "Libre Baskerville", "DM Serif Display"] }
    ],
    availableFonts: ["Playfair Display", "Cormorant Garamond", "Libre Baskerville", "DM Serif Display", "Lora"]
  },
  {
    id: "brand-identity-05",
    title: "Brand Identity Kit",
    description: "Comprehensive brand identity system: logo lockups, color palette, typography guidelines, and usage examples — all in one cohesive package.",
    category: "Branding",
    
    deliveryTime: "5 days",
    price: "$299",
    specifications: [
      "Logo in SVG + PNG + PDF",
      "Brand guidelines document",
      "Color palette swatches",
      "Typography specimens"
    ],
    customizableFields: [
      { key: "brandName", label: "Brand Name", type: "text" as const, defaultValue: "Atelier Studio", maxLength: 30 },
      { key: "tagline", label: "Brand Tagline", type: "text" as const, defaultValue: "Crafted with intention", maxLength: 60 },
      { key: "industry", label: "Industry / Niche", type: "text" as const, defaultValue: "Creative Agency", maxLength: 40 },
      { key: "primaryColor", label: "Primary Brand Color", type: "color" as const, defaultValue: "#2d1b69" },
      { key: "secondaryColor", label: "Secondary Color", type: "color" as const, defaultValue: "#e11d48" },
      { key: "neutralColor", label: "Neutral Color", type: "color" as const, defaultValue: "#f1f0ed" },
      { key: "font", label: "Brand Font", type: "font" as const, defaultValue: "Inter", options: ["Inter", "Space Grotesk", "DM Sans", "Sora", "Neue Haas Grotesk"] }
    ],
    availableFonts: ["Inter", "Space Grotesk", "DM Sans", "Sora", "Neue Haas Grotesk", "Satoshi"]
  },
  {
    id: "social-media-pack-06",
    title: "Social Media Pack",
    description: "Cohesive set of social media templates across Instagram, LinkedIn, and Stories formats. Designed for consistent brand presence.",
    category: "Social Media",
    
    deliveryTime: "48 hours",
    price: "$89",
    specifications: [
      "Instagram Post (1080x1080)",
      "Instagram Story (1080x1920)",
      "LinkedIn Banner (1584x396)",
      "10 template variations"
    ],
    customizableFields: [
      { key: "brandName", label: "Brand / Handle", type: "text" as const, defaultValue: "@yourname", maxLength: 30 },
      { key: "tagline", label: "Bio Tagline", type: "text" as const, defaultValue: "Design that moves people", maxLength: 80 },
      { key: "primaryColor", label: "Brand Color", type: "color" as const, defaultValue: "#4f46e5" },
      { key: "secondaryColor", label: "Secondary Color", type: "color" as const, defaultValue: "#06b6d4" },
      { key: "font", label: "Font", type: "font" as const, defaultValue: "Inter", options: ["Inter", "Space Grotesk", "DM Sans", "Outfit", "Poppins"] }
    ],
    availableFonts: ["Inter", "Space Grotesk", "DM Sans", "Outfit", "Poppins", "Nunito"]
  },
  {
    id: "editorial-magazine-07",
    title: "Editorial Spread",
    description: "Magazine-quality editorial spread design. Perfect for lookbooks, portfolio presentations, or feature articles with striking visual impact.",
    category: "Editorial",
    
    deliveryTime: "48 hours",
    price: "$99",
    specifications: [
      "A4 double-page spread",
      "Print + digital formats",
      "InDesign source included",
      "High-res image placeholders"
    ],
    customizableFields: [
      { key: "title", label: "Article Title", type: "text" as const, defaultValue: "The New Aesthetic", maxLength: 50 },
      { key: "subtitle", label: "Subtitle", type: "text" as const, defaultValue: "How design is reshaping culture", maxLength: 80 },
      { key: "issueNumber", label: "Issue / Date", type: "text" as const, defaultValue: "Vol. 12 — Spring 2026", maxLength: 40 },
      { key: "backgroundColor", label: "Background", type: "color" as const, defaultValue: "#fefefe" },
      { key: "textColor", label: "Body Text", type: "color" as const, defaultValue: "#111111" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#dc2626" },
      { key: "headingFont", label: "Heading Font", type: "font" as const, defaultValue: "DM Serif Display", options: ["DM Serif Display", "Playfair Display", "Libre Baskerville", "Cormorant Garamond"] }
    ],
    availableFonts: ["DM Serif Display", "Playfair Display", "Libre Baskerville", "Cormorant Garamond", "EB Garamond"]
  },
  {
    id: "packaging-label-08",
    title: "Product Label",
    description: "Artisan product label design for food, beverage, cosmetic, or lifestyle brands. Balances shelf appeal with clear informational hierarchy.",
    category: "Packaging",
    
    deliveryTime: "48 hours",
    price: "$69",
    specifications: [
      "Custom dimensions",
      "Dieline provided",
      "Barcode-ready area",
      "RGB + CMYK delivery"
    ],
    customizableFields: [
      { key: "productName", label: "Product Name", type: "text" as const, defaultValue: "Cold Brew Reserve", maxLength: 30 },
      { key: "brandName", label: "Brand Name", type: "text" as const, defaultValue: "Grounds & Co.", maxLength: 30 },
      { key: "descriptor", label: "Product Descriptor", type: "text" as const, defaultValue: "Small Batch — Single Origin", maxLength: 50 },
      { key: "weight", label: "Weight / Volume", type: "text" as const, defaultValue: "250ml", maxLength: 20 },
      { key: "labelColor", label: "Label Color", type: "color" as const, defaultValue: "#1c1917" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#faf7f2" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#d97706" },
      { key: "font", label: "Label Font", type: "font" as const, defaultValue: "Space Grotesk", options: ["Space Grotesk", "Neue Haas Grotesk", "DM Mono", "Courier Prime", "Inter"] }
    ],
    availableFonts: ["Space Grotesk", "Neue Haas Grotesk", "DM Mono", "Courier Prime", "Inter", "IBM Plex Mono"]
  },
  {
    id: "logo-wordmark-09",
    title: "Logo & Wordmark",
    description: "Custom wordmark logo with icon mark variation. Clean, memorable, and scalable from favicon to billboard.",
    category: "Branding",
    
    deliveryTime: "72 hours",
    price: "$149",
    specifications: [
      "Full logo + icon mark",
      "Light + dark versions",
      "SVG + PNG + EPS",
      "Favicon ready"
    ],
    customizableFields: [
      { key: "brandName", label: "Brand Name", type: "text" as const, defaultValue: "Forma", maxLength: 20 },
      { key: "descriptor", label: "Descriptor (optional)", type: "text" as const, defaultValue: "Studio", maxLength: 20 },
      { key: "primaryColor", label: "Logo Color", type: "color" as const, defaultValue: "#111827" },
      { key: "accentColor", label: "Icon Accent", type: "color" as const, defaultValue: "#7c3aed" },
      { key: "font", label: "Wordmark Font", type: "font" as const, defaultValue: "Space Grotesk", options: ["Space Grotesk", "Inter", "Sora", "Outfit", "DM Sans"] }
    ],
    availableFonts: ["Space Grotesk", "Inter", "Sora", "Outfit", "DM Sans", "Nunito"]
  },
  {
    id: "presentation-deck-10",
    title: "Pitch Deck",
    description: "Investor-grade pitch deck with clear narrative structure, compelling data visualization, and premium visual identity throughout.",
    category: "Presentation",
    
    deliveryTime: "5 days",
    price: "$199",
    specifications: [
      "20-slide template",
      "16:9 widescreen format",
      "PowerPoint + Google Slides",
      "Chart & graph templates"
    ],
    customizableFields: [
      { key: "companyName", label: "Company Name", type: "text" as const, defaultValue: "Forma AI", maxLength: 30 },
      { key: "tagline", label: "One-Line Pitch", type: "text" as const, defaultValue: "The future of design intelligence", maxLength: 80 },
      { key: "fundingRound", label: "Round", type: "text" as const, defaultValue: "Series A", maxLength: 20 },
      { key: "primaryColor", label: "Brand Color", type: "color" as const, defaultValue: "#0f172a" },
      { key: "accentColor", label: "Highlight Color", type: "color" as const, defaultValue: "#6d28d9" },
      { key: "font", label: "Deck Font", type: "font" as const, defaultValue: "Inter", options: ["Inter", "Space Grotesk", "DM Sans", "Sora", "Outfit"] }
    ],
    availableFonts: ["Inter", "Space Grotesk", "DM Sans", "Sora", "Outfit", "Poppins"]
  },
  {
    id: "event-flyer-11",
    title: "Event Flyer",
    description: "High-energy event flyer for concerts, parties, workshops, or pop-ups. Bold, attention-grabbing design that cuts through the noise.",
    category: "Poster",
    
    deliveryTime: "24 hours",
    price: "$45",
    specifications: [
      "A4 / US Letter",
      "Print + digital ready",
      "High contrast layout",
      "Social media crop included"
    ],
    customizableFields: [
      { key: "eventName", label: "Event Name", type: "text" as const, defaultValue: "NEON / NIGHT", maxLength: 30 },
      { key: "eventDate", label: "Date & Time", type: "text" as const, defaultValue: "SAT 15 APRIL — 8PM", maxLength: 40 },
      { key: "venue", label: "Venue", type: "text" as const, defaultValue: "The Warehouse, Brooklyn", maxLength: 50 },
      { key: "ticketInfo", label: "Ticket Info", type: "text" as const, defaultValue: "Doors 8PM / $25 adv / 18+", maxLength: 50 },
      { key: "backgroundColor", label: "Background", type: "color" as const, defaultValue: "#050510" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#ffffff" },
      { key: "accentColor", label: "Neon Accent", type: "color" as const, defaultValue: "#a855f7" },
      { key: "font", label: "Font", type: "font" as const, defaultValue: "Space Grotesk", options: ["Space Grotesk", "Inter", "Sora", "Outfit", "Poppins"] }
    ],
    availableFonts: ["Space Grotesk", "Inter", "Sora", "Outfit", "Poppins", "Russo One"]
  },
  {
    id: "certificate-12",
    title: "Award Certificate",
    description: "Dignified award certificate or diploma template with classical elegance. Perfect for professional recognitions, graduations, or achievements.",
    category: "Certificate",
    
    deliveryTime: "24 hours",
    price: "$39",
    specifications: [
      "A4 landscape format",
      "Portrait option included",
      "Signature area included",
      "Premium print-ready"
    ],
    customizableFields: [
      { key: "organizationName", label: "Organization Name", type: "text" as const, defaultValue: "Design Academy", maxLength: 40 },
      { key: "recipientName", label: "Recipient Name", type: "text" as const, defaultValue: "[Recipient Name]", maxLength: 40 },
      { key: "awardTitle", label: "Award Title", type: "text" as const, defaultValue: "Certificate of Excellence", maxLength: 50 },
      { key: "description", label: "Description", type: "text" as const, defaultValue: "In recognition of outstanding creative achievement", maxLength: 100 },
      { key: "date", label: "Date", type: "text" as const, defaultValue: "April 2026", maxLength: 20 },
      { key: "borderColor", label: "Border Color", type: "color" as const, defaultValue: "#b45309" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#1c1917" },
      { key: "font", label: "Font", type: "font" as const, defaultValue: "Cormorant Garamond", options: ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville"] }
    ],
    availableFonts: ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville", "Cinzel"]
  }
];
