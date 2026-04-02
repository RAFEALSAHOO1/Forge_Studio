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
    ],
    availableFonts: ["Inter", "Playfair Display", "Space Grotesk", "DM Serif Display", "Cormorant Garamond"]
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
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#c9a227" },
    ],
    availableFonts: ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville", "Lora"]
  },
  {
    id: "business-card-premium-03",
    title: "Premium Business Card",
    description: "Distinctive business card with tactile design, spot UV options, and a layout that commands attention in any networking context.",
    category: "Business Card",
    deliveryTime: "24 hours",
    price: "$39",
    specifications: [
      "3.5 x 2 inch standard",
      "Spot UV coating support",
      "300gsm card stock ready",
      "Front + back designs"
    ],
    customizableFields: [
      { key: "name", label: "Full Name", type: "text" as const, defaultValue: "Jordan Blake", maxLength: 40 },
      { key: "title", label: "Title / Role", type: "text" as const, defaultValue: "Creative Director", maxLength: 50 },
      { key: "company", label: "Company", type: "text" as const, defaultValue: "Atelier Studio", maxLength: 40 },
      { key: "contact", label: "Contact Info", type: "text" as const, defaultValue: "hello@atelier.co", maxLength: 60 },
      { key: "primaryColor", label: "Card Color", type: "color" as const, defaultValue: "#0f0f0f" },
      { key: "textColor", label: "Text Color", type: "color" as const, defaultValue: "#ffffff" },
    ],
    availableFonts: ["Inter", "Space Grotesk", "IBM Plex Sans", "Neue Haas Grotesk", "Helvetica Neue"]
  },
  {
    id: "menu-restaurant-04",
    title: "Artisan Restaurant Menu",
    description: "Sophisticated multi-page restaurant menu with elegant typographic hierarchy, seasonal design motifs, and premium material finishes.",
    category: "Menu",
    deliveryTime: "72 hours",
    price: "$129",
    specifications: [
      "A4 / Letter format",
      "Multi-page layout",
      "Seasonal design variants",
      "Print + digital PDF"
    ],
    customizableFields: [
      { key: "restaurantName", label: "Restaurant Name", type: "text" as const, defaultValue: "Maison Celeste", maxLength: 40 },
      { key: "tagline", label: "Tagline", type: "text" as const, defaultValue: "Farm to table, season to plate", maxLength: 80 },
      { key: "primaryColor", label: "Primary Color", type: "color" as const, defaultValue: "#2d1b0e" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#c17d3c" },
    ],
    availableFonts: ["Playfair Display", "Cormorant Garamond", "Lora", "EB Garamond", "Libre Baskerville"]
  },
  {
    id: "branding-identity-05",
    title: "Brand Identity System",
    description: "Complete visual identity package including logo mark, wordmark, color palette guidelines, and typography system for emerging brands.",
    category: "Branding",
    deliveryTime: "5 days",
    price: "$299",
    specifications: [
      "Full brand guidelines PDF",
      "SVG + PNG logo files",
      "Color palette with codes",
      "Typography specimen"
    ],
    customizableFields: [
      { key: "brandName", label: "Brand Name", type: "text" as const, defaultValue: "Luminary Co.", maxLength: 30 },
      { key: "tagline", label: "Brand Tagline", type: "text" as const, defaultValue: "Illuminate Your Vision", maxLength: 60 },
      { key: "industry", label: "Industry / Category", type: "text" as const, defaultValue: "Creative Agency", maxLength: 40 },
      { key: "primaryColor", label: "Primary Brand Color", type: "color" as const, defaultValue: "#6d28d9" },
      { key: "secondaryColor", label: "Secondary Color", type: "color" as const, defaultValue: "#f59e0b" },
    ],
    availableFonts: ["Inter", "Space Grotesk", "Playfair Display", "DM Serif Display", "Neue Haas Grotesk"]
  },
  {
    id: "social-media-06",
    title: "Social Media Pack",
    description: "Cohesive social media template set with Instagram, LinkedIn, and Twitter formats. Built for consistent brand storytelling across channels.",
    category: "Social Media",
    deliveryTime: "24 hours",
    price: "$59",
    specifications: [
      "Instagram square + story",
      "LinkedIn post + cover",
      "Twitter / X header",
      "Facebook event cover"
    ],
    customizableFields: [
      { key: "brandName", label: "Brand Name", type: "text" as const, defaultValue: "The Studio", maxLength: 30 },
      { key: "tagline", label: "Content Tagline", type: "text" as const, defaultValue: "Bold ideas. Precise execution.", maxLength: 60 },
      { key: "primaryColor", label: "Brand Color", type: "color" as const, defaultValue: "#ec4899" },
      { key: "backgroundColor", label: "Background", type: "color" as const, defaultValue: "#fdf2f8" },
    ],
    availableFonts: ["Inter", "Space Grotesk", "Poppins", "DM Sans", "Nunito Sans"]
  },
  {
    id: "editorial-magazine-07",
    title: "Editorial Magazine Spread",
    description: "Immersive magazine-style editorial layout with dramatic full-bleed imagery, dynamic column grids, and editorial typography that commands the page.",
    category: "Editorial",
    deliveryTime: "72 hours",
    price: "$149",
    specifications: [
      "Double-page spread",
      "300 DPI print-ready",
      "InDesign source included",
      "PDF + digital edition"
    ],
    customizableFields: [
      { key: "coverLine", label: "Cover Line", type: "text" as const, defaultValue: "The Future of Form", maxLength: 40 },
      { key: "standfirst", label: "Standfirst", type: "text" as const, defaultValue: "Inside the studios reshaping visual culture", maxLength: 100 },
      { key: "primaryColor", label: "Accent Color", type: "color" as const, defaultValue: "#dc2626" },
    ],
    availableFonts: ["Playfair Display", "DM Serif Display", "Cormorant Garamond", "EB Garamond", "Freight Text"]
  },
  {
    id: "packaging-luxury-08",
    title: "Luxury Packaging Design",
    description: "Premium product packaging design with structural dieline, embossing guides, and finish specifications for high-end retail and gifting products.",
    category: "Packaging",
    deliveryTime: "5 days",
    price: "$199",
    specifications: [
      "Custom dieline included",
      "Emboss / deboss guides",
      "Spot color support",
      "Print-ready AI + PDF"
    ],
    customizableFields: [
      { key: "productName", label: "Product Name", type: "text" as const, defaultValue: "L'Essence Noir", maxLength: 30 },
      { key: "brandName", label: "Brand", type: "text" as const, defaultValue: "Maison Celeste", maxLength: 30 },
      { key: "productType", label: "Product Category", type: "text" as const, defaultValue: "Eau de Parfum", maxLength: 40 },
      { key: "primaryColor", label: "Box Color", type: "color" as const, defaultValue: "#1a1a1a" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#c9a227" },
    ],
    availableFonts: ["Cormorant Garamond", "Playfair Display", "Didot", "Libre Baskerville", "EB Garamond"]
  },
  {
    id: "logo-modern-09",
    title: "Modern Logo Design",
    description: "Contemporary logo mark with geometric precision, balanced negative space, and files optimized for every use case from favicon to billboard.",
    category: "Branding",
    deliveryTime: "48 hours",
    price: "$89",
    specifications: [
      "Full vector source (AI, SVG)",
      "PNG at multiple sizes",
      "Dark + light variants",
      "Favicon set included"
    ],
    customizableFields: [
      { key: "brandName", label: "Brand Name", type: "text" as const, defaultValue: "Nova Systems", maxLength: 25 },
      { key: "industry", label: "Industry", type: "text" as const, defaultValue: "Technology", maxLength: 30 },
      { key: "primaryColor", label: "Logo Color", type: "color" as const, defaultValue: "#3b82f6" },
      { key: "secondaryColor", label: "Secondary Color", type: "color" as const, defaultValue: "#1e3a5f" },
    ],
    availableFonts: ["Inter", "Space Grotesk", "IBM Plex Sans", "Geist", "Neue Haas Grotesk"]
  },
  {
    id: "presentation-deck-10",
    title: "Investor Presentation Deck",
    description: "Polished pitch deck template with data visualization slides, narrative flow, and the visual confidence that makes investors lean forward.",
    category: "Presentation",
    deliveryTime: "48 hours",
    price: "$119",
    specifications: [
      "16:9 widescreen format",
      "PowerPoint + Keynote",
      "Google Slides version",
      "20 slide templates"
    ],
    customizableFields: [
      { key: "companyName", label: "Company Name", type: "text" as const, defaultValue: "Vertex Capital", maxLength: 30 },
      { key: "tagline", label: "Company Tagline", type: "text" as const, defaultValue: "Building the infrastructure of tomorrow", maxLength: 70 },
      { key: "primaryColor", label: "Brand Color", type: "color" as const, defaultValue: "#2563eb" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#7c3aed" },
    ],
    availableFonts: ["Inter", "Space Grotesk", "DM Sans", "IBM Plex Sans", "Geist"]
  },
  {
    id: "certificate-award-11",
    title: "Award Certificate",
    description: "Distinguished certificate design with formal border treatments, seal placement guides, and dignified typography fit for recognition and achievement.",
    category: "Certificate",
    deliveryTime: "24 hours",
    price: "$45",
    specifications: [
      "A4 / Letter landscape",
      "300 DPI print-ready",
      "Editable PDF form",
      "Digital + print formats"
    ],
    customizableFields: [
      { key: "recipientName", label: "Recipient Name", type: "text" as const, defaultValue: "Samara Chen", maxLength: 50 },
      { key: "awardTitle", label: "Award Title", type: "text" as const, defaultValue: "Excellence in Design Leadership", maxLength: 60 },
      { key: "organization", label: "Issuing Organization", type: "text" as const, defaultValue: "The Design Institute", maxLength: 50 },
      { key: "primaryColor", label: "Border Color", type: "color" as const, defaultValue: "#1e3a5f" },
      { key: "accentColor", label: "Accent Color", type: "color" as const, defaultValue: "#c9a227" },
    ],
    availableFonts: ["Cormorant Garamond", "Playfair Display", "EB Garamond", "Libre Baskerville", "Cinzel"]
  },
  {
    id: "poster-event-12",
    title: "Event Gig Poster",
    description: "Bold, expressive event poster with dynamic typography and vibrant composition — built for music, art, and cultural events that demand attention.",
    category: "Poster",
    deliveryTime: "24 hours",
    price: "$55",
    specifications: [
      "A2 / A3 formats",
      "RGB + CMYK files",
      "300 DPI print-ready",
      "Digital social crop"
    ],
    customizableFields: [
      { key: "eventName", label: "Event Name", type: "text" as const, defaultValue: "SIGNAL Festival 2026", maxLength: 40 },
      { key: "artists", label: "Artists / Lineup", type: "text" as const, defaultValue: "Bonobo · Four Tet · Floating Points", maxLength: 80 },
      { key: "dateVenue", label: "Date & Venue", type: "text" as const, defaultValue: "July 12 — Printworks London", maxLength: 60 },
      { key: "primaryColor", label: "Primary Color", type: "color" as const, defaultValue: "#f97316" },
      { key: "backgroundColor", label: "Background", type: "color" as const, defaultValue: "#0a0a0a" },
    ],
    availableFonts: ["Space Grotesk", "Inter", "DM Serif Display", "Bebas Neue", "Barlow Condensed"]
  }
];
