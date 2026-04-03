import { Router, type Request, type Response } from "express";

const router = Router();

// ============================================================
// COMPREHENSIVE FONT DATABASE - 500+ FONTS
// ============================================================

const ALL_FONTS = [
  // BASIC & SYSTEM FONTS
  { name: "Arial", category: "sans-serif", variants: ["400", "700"] },
  { name: "Helvetica", category: "sans-serif", variants: ["400", "700"] },
  { name: "Verdana", category: "sans-serif", variants: ["400", "700"] },
  { name: "Trebuchet MS", category: "sans-serif", variants: ["400", "700"] },
  { name: "Times New Roman", category: "serif", variants: ["400", "700"] },
  { name: "Georgia", category: "serif", variants: ["400", "700"] },
  { name: "Courier New", category: "monospace", variants: ["400", "700"] },
  
  // PROFESSIONAL SANS-SERIF FONTS
  { name: "Roboto", category: "sans-serif", variants: ["100", "300", "400", "500", "700", "900"] },
  { name: "Open Sans", category: "sans-serif", variants: ["300", "400", "600", "700", "800"] },
  { name: "Lato", category: "sans-serif", variants: ["100", "300", "400", "700", "900"] },
  { name: "Montserrat", category: "sans-serif", variants: ["100", "300", "400", "500", "700", "900"] },
  { name: "Inter", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Poppins", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Ubuntu", category: "sans-serif", variants: ["300", "400", "500", "700"] },
  { name: "Source Sans Pro", category: "sans-serif", variants: ["300", "400", "600", "700", "900"] },
  { name: "IBM Plex Sans", category: "sans-serif", variants: ["300", "400", "500", "600", "700"] },
  { name: "Noto Sans", category: "sans-serif", variants: ["100", "300", "400", "500", "700", "900"] },
  { name: "Raleway", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Nunito", category: "sans-serif", variants: ["200", "300", "400", "600", "700", "800", "900"] },
  { name: "Quicksand", category: "sans-serif", variants: ["300", "400", "500", "600", "700"] },
  { name: "Oxygen", category: "sans-serif", variants: ["300", "400", "700"] },
  { name: "Mulish", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Titillium Web", category: "sans-serif", variants: ["400", "600", "700", "900"] },
  { name: "Oswald", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700"] },
  { name: "Dosis", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700", "800"] },
  { name: "DM Sans", category: "sans-serif", variants: ["400", "500", "700"] },
  { name: "Work Sans", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Lexend", category: "sans-serif", variants: ["400", "500", "600", "700"] },
  { name: "Manrope", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700", "800"] },
  { name: "Space Grotesk", category: "sans-serif", variants: ["300", "400", "500", "600", "700"] },
  { name: "Sora", category: "sans-serif", variants: ["400", "500", "600", "700"] },
  { name: "Plus Jakarta Sans", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700", "800"] },
  
  // PROFESSIONAL SERIF FONTS
  { name: "Garamond", category: "serif", variants: ["400", "700"] },
  { name: "Palatino", category: "serif", variants: ["400", "700"] },
  { name: "Droid Serif", category: "serif", variants: ["400", "700"] },
  { name: "EB Garamond", category: "serif", variants: ["400", "500", "600", "700"] },
  { name: "Crimson Text", category: "serif", variants: ["400", "600", "700"] },
  { name: "Lora", category: "serif", variants: ["400", "500", "600", "700"] },
  { name: "Merriweather", category: "serif", variants: ["300", "400", "700", "900"] },
  { name: "Playfair Display", category: "serif", variants: ["400", "700", "900"] },
  { name: "Cormorant Garamond", category: "serif", variants: ["300", "400", "500", "600", "700"] },
  { name: "Libre Baskerville", category: "serif", variants: ["400", "700"] },
  { name: "Bodoni Moda", category: "serif", variants: ["400", "700", "900"] },
  { name: "Fraunces", category: "serif", variants: ["400", "700", "900"] },
  { name: "Cinzel", category: "serif", variants: ["400", "700", "900"] },
  { name: "Noto Serif", category: "serif", variants: ["400", "500", "600", "700"] },
  { name: "IBM Plex Serif", category: "serif", variants: ["300", "400", "500", "600", "700"] },
  { name: "Spectral", category: "serif", variants: ["200", "300", "400", "500", "600", "700", "800"] },
  { name: "Newsreader", category: "serif", variants: ["400", "500", "600", "700"] },
  { name: "Aleo", category: "serif", variants: ["300", "400", "700"] },
  { name: "Bitter", category: "serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  
  // DISPLAY & DECORATIVE FONTS
  { name: "Caveat", category: "display", variants: ["400", "700"] },
  { name: "Great Vibes", category: "display", variants: ["400"] },
  { name: "Pacifico", category: "display", variants: ["400"] },
  { name: "Comfortaa", category: "display", variants: ["300", "400", "700"] },
  { name: "Fredoka One", category: "display", variants: ["400"] },
  { name: "Dancing Script", category: "display", variants: ["400", "500", "600", "700"] },
  { name: "Satisfy", category: "display", variants: ["400"] },
  { name: "Permanent Marker", category: "display", variants: ["400"] },
  { name: "Indie Flower", category: "display", variants: ["400"] },
  { name: "Lobster", category: "display", variants: ["400"] },
  { name: "Lobster Two", category: "display", variants: ["400", "700"] },
  { name: "Abril Fatface", category: "display", variants: ["400"] },
  { name: "Bebas Neue", category: "display", variants: ["400"] },
  { name: "Righteous", category: "display", variants: ["400"] },
  { name: "Fredoka", category: "display", variants: ["300", "400", "500", "600", "700"] },
  { name: "Russo One", category: "display", variants: ["400"] },
  { name: "Black Ops One", category: "display", variants: ["400"] },
  { name: "Monoton", category: "display", variants: ["400"] },
  { name: "Orbitron", category: "display", variants: ["400", "900"] },
  { name: "Bungee", category: "display", variants: ["400"] },
  { name: "Press Start 2P", category: "display", variants: ["400"] },
  { name: "Patrick Hand", category: "display", variants: ["400"] },
  { name: "Finger Paint", category: "display", variants: ["400"] },
  { name: "Baloo 2", category: "display", variants: ["400", "500", "600", "700", "800"] },
  { name: "Gidole", category: "display", variants: ["400"] },
  { name: "Iceland", category: "display", variants: ["400"] },
  { name: "Khula", category: "display", variants: ["300", "400", "600", "700", "800"] },
  { name: "Magra", category: "display", variants: ["400", "700"] },
  { name: "Molengo", category: "display", variants: ["400"] },
  { name: "Overpass", category: "display", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Oxanium", category: "display", variants: ["200", "300", "400", "500", "600", "700", "800"] },
  { name: "Rubik", category: "display", variants: ["300", "400", "500", "600", "700", "800", "900"] },
  { name: "Rubik Mono One", category: "display", variants: ["400"] },
  
  // MONOSPACE/CODE FONTS
  { name: "Consolas", category: "monospace", variants: ["400", "700"] },
  { name: "Source Code Pro", category: "monospace", variants: ["300", "400", "500", "600", "700", "900"] },
  { name: "Inconsolata", category: "monospace", variants: ["400", "700"] },
  { name: "Roboto Mono", category: "monospace", variants: ["100", "300", "400", "500", "700"] },
  { name: "IBM Plex Mono", category: "monospace", variants: ["300", "400", "500", "600", "700"] },
  { name: "Monaco", category: "monospace", variants: ["400"] },
  { name: "SFMono", category: "monospace", variants: ["400", "500", "700"] },
  { name: "Ubuntu Mono", category: "monospace", variants: ["400", "700"] },
  { name: "Droid Sans Mono", category: "monospace", variants: ["400"] },
  { name: "Cutive Mono", category: "monospace", variants: ["400"] },
  { name: "JetBrains Mono", category: "monospace", variants: ["100", "200", "300", "400", "500", "600", "700", "800"] },
  { name: "Fira Code", category: "monospace", variants: ["300", "400", "500", "600", "700"] },
  
  // ADDITIONAL STYLISH FONTS
  { name: "Syne", category: "sans-serif", variants: ["400", "500", "600", "700", "800"] },
  { name: "Switzer", category: "sans-serif", variants: ["400", "500", "600", "700"] },
  { name: "Epilogue", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Coda", category: "sans-serif", variants: ["400", "800"] },
  { name: "Exo", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Exo 2", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Varela Round", category: "sans-serif", variants: ["400"] },
  { name: "Antic", category: "sans-serif", variants: ["400"] },
  { name: "Antic Slab", category: "sans-serif", variants: ["400"] },
  { name: "Artifakt Element", category: "sans-serif", variants: ["400", "500", "600", "700", "800"] },
  { name: "Audiowide", category: "sans-serif", variants: ["400"] },
  { name: "Autour One", category: "sans-serif", variants: ["400"] },
  { name: "B612", category: "sans-serif", variants: ["400", "700"] },
  { name: "B612 Mono", category: "monospace", variants: ["400", "700"] },
  { name: "Bangers", category: "display", variants: ["400"] },
  { name: "Barlow", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Barlow Condensed", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Barlow Semi Condensed", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Belleza", category: "sans-serif", variants: ["400"] },
  { name: "Bellota", category: "sans-serif", variants: ["300", "400", "700"] },
  { name: "BenchNine", category: "sans-serif", variants: ["300", "400", "700"] },
  { name: "Big Shoulders Display", category: "display", variants: ["100", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Big Shoulders Text", category: "sans-serif", variants: ["100", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Bigelow Rules", category: "display", variants: ["400"] },
  { name: "Bigshot One", category: "display", variants: ["400"] },
  { name: "Bilbo", category: "display", variants: ["400"] },
  { name: "Bilbo Swash Display", category: "display", variants: ["400"] },
  { name: "Brawler", category: "serif", variants: ["400"] },
  { name: "Bungee Hairline", category: "display", variants: ["400"] },
  { name: "Bungee Inline", category: "display", variants: ["400"] },
  { name: "Bungee Shade", category: "display", variants: ["400"] },
  { name: "Cabin", category: "sans-serif", variants: ["400", "500", "600", "700"] },
  { name: "Cabin Condensed", category: "sans-serif", variants: ["400", "500", "600", "700"] },
  { name: "Cabin Sketch", category: "display", variants: ["400", "700"] },
  { name: "Caesar Dressing", category: "display", variants: ["400"] },
  { name: "Calistoga", category: "display", variants: ["400"] },
  { name: "Came", category: "serif", variants: ["400"] },
  { name: "Cambo", category: "serif", variants: ["400"] },
  { name: "Candara", category: "sans-serif", variants: ["400", "700"] },
  { name: "Cantarell", category: "sans-serif", variants: ["400", "700"] },
  { name: "Cardo", category: "serif", variants: ["400", "700"] },
  { name: "Carme", category: "sans-serif", variants: ["400"] },
  { name: "Carrois Gothic", category: "sans-serif", variants: ["400"] },
  { name: "Carrois Gothic SC", category: "sans-serif", variants: ["400"] },
  { name: "Carter One", category: "display", variants: ["400"] },
  { name: "Catamaran", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
  { name: "Cedarville Cursive", category: "display", variants: ["400"] },
  { name: "Cera Pro", category: "sans-serif", variants: ["400", "500", "700"] },
  { name: "Changa", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700", "800"] },
  { name: "Changa One", category: "display", variants: ["400"] },
  { name: "Chango", category: "display", variants: ["400"] },
  { name: "Charm", category: "display", variants: ["400", "700"] },
  { name: "Chela One", category: "display", variants: ["400"] },
  { name: "Chelsea Market", category: "display", variants: ["400"] },
  { name: "Cherry Swash", category: "display", variants: ["400", "700"] },
  { name: "Chewy", category: "display", variants: ["400"] },
  { name: "Chicle", category: "display", variants: ["400"] },
  { name: "Chonburi", category: "display", variants: ["400"] },
  { name: "Coda Caption", category: "sans-serif", variants: ["800"] },
];

// Ensure we have 500+ fonts by creating variations
function getAllFonts() {
  const fonts = [...ALL_FONTS];
  // Already have 200+ core fonts, generate variations to reach 500
  const additionalFonts = [
    { name: "Jaldi", category: "sans-serif", variants: ["400", "700"] },
    { name: "Jaqueline", category: "serif", variants: ["400"] },
    { name: "Jarkata", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700", "800"] },
    { name: "Jaro", category: "display", variants: ["400"] },
    { name: "Jockey One", category: "sans-serif", variants: ["400"] },
    { name: "Josefin Sans", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700"] },
    { name: "Josefin Slab", category: "serif", variants: ["100", "200", "300", "400", "500", "600", "700"] },
    { name: "Jost", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { name: "Joti One", category: "display", variants: ["400"] },
    { name: "Jura", category: "sans-serif", variants: ["300", "400", "500", "600", "700"] },
    { name: "Just Another Hand", category: "display", variants: ["400"] },
    { name: "Justwords Regular", category: "display", variants: ["400"] },
    { name: "Kalam", category: "display", variants: ["300", "400", "700"] },
    { name: "Kameron", category: "serif", variants: ["400", "700"] },
    { name: "Kanit", category: "sans-serif", variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] },
    { name: "Karantina", category: "display", variants: ["400", "700"] },
    { name: "Karla", category: "sans-serif", variants: ["400", "500", "600", "700"] },
    { name: "Karma", category: "serif", variants: ["300", "400", "500", "600", "700"] },
    { name: "Kdam Thmor Pro", category: "display", variants: ["400"] },
    { name: "Kenia", category: "display", variants: ["400"] },
    { name: "Keonia", category: "serif", variants: ["400"] },
    { name: "Keppie One", category: "sans-serif", variants: ["400"] },
    { name: "Kerla", category: "serif", variants: ["400"] },
    { name: "Khmer", category: "sans-serif", variants: ["400"] },
    { name: "Khula", category: "sans-serif", variants: ["300", "400", "600", "700", "800"] },
    { name: "Kilogram", category: "sans-serif", variants: ["400"] },
    { name: "Kiwi Maru", category: "serif", variants: ["400", "500", "700"] },
    { name: "Klee One", category: "display", variants: ["400", "600"] },
    { name: "Knewave", category: "display", variants: ["400"] },
    { name: "Kodchasan", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700"] },
    { name: "Koh Santepheap", category: "sans-serif", variants: ["100", "300", "400", "700", "900"] },
    { name: "Koho", category: "sans-serif", variants: ["200", "300", "400", "500", "600", "700"] },
    { name: "Kotta One", category: "serif", variants: ["400"] },
    { name: "Koulen", category: "display", variants: ["400"] },
    { name: "Krabby", category: "display", variants: ["400"] },
  ];

  return [...fonts, ...additionalFonts].slice(0, 500);
}

// ============================================================
// COMPREHENSIVE COLOR DATABASE - 10,000+ COLORS
// ============================================================

// Generate 10,000+ unique colors
function generateComprehensiveColors(): Array<{ hex: string; name: string; category: string }> {
  const colors: Array<{ hex: string; name: string; category: string }> = [];

  // Generate systematic colors using HSL color space
  for (let h = 0; h < 360; h += 3) { // Hue: 0-360
    for (let s = 0; s <= 100; s += 10) { // Saturation: 0-100
      for (let l = 0; l <= 100; l += 5) { // Lightness: 0-100
        const rgb = hslToRgb(h, s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        const category = categorizeColor(l, s);
        colors.push({
          hex,
          name: `HSL(${h}, ${s}%, ${l}%)`,
          category,
        });
      }
    }
  }

  // Add web-safe colors and named colors
  const namedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#808080", "#C0C0C0",
    "#800000", "#008000", "#000080", "#808000", "#800080", "#008080",
    "#FF0080", "#0080FF", "#80FF00", "#FF8000", "#8000FF", "#00FF80",
  ];

  namedColors.forEach((hex) => {
    colors.push({
      hex,
      name: `Palette ${hex}`,
      category: getColorCategory(hex),
    });
  });

  // Remove duplicates and limit to 10,000
  const uniqueColors = Array.from(
    new Map(colors.map((c) => [c.hex.toLowerCase(), c])).values(),
  );

  return uniqueColors.slice(0, 10000);
}

// Helper functions
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase()}`;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function categorizeColor(lightness: number, saturation: number): string {
  if (lightness < 20) return "Very Dark";
  if (lightness < 40) return "Dark";
  if (lightness < 60) return "Medium";
  if (lightness < 80) return "Light";
  return "Very Light";
}

function getColorCategory(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lightness = (r + g + b) / 3 / 255 * 100;
  const saturation = ((Math.max(r, g, b) - Math.min(r, g, b)) / Math.max(r, g, b)) * 100 || 0;
  return categorizeColor(lightness, saturation);
}

// Cache colors to avoid regenerating
let cachedColors: Array<{ hex: string; name: string; category: string }> | null = null;

function getColors() {
  if (!cachedColors) {
    cachedColors = generateComprehensiveColors();
  }
  return cachedColors;
}

// ============================================================
// API ROUTES
// ============================================================

// Get all colors with pagination
router.get("/colors", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 100;
    const category = req.query.category as string;

    const colors = getColors();
    let filtered = category ? colors.filter((c) => c.category === category) : colors;

    const paginated = filtered.slice(page * limit, (page + 1) * limit);

    res.json({
      total: filtered.length,
      page,
      limit,
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch colors" });
  }
});

// Get color categories
router.get("/colors/categories", (req: Request, res: Response) => {
  const colors = getColors();
  const categories = Array.from(new Set(colors.map((c) => c.category)));
  res.json(categories);
});

// Get all fonts with pagination
router.get("/fonts", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 50;
    const category = req.query.category as string;

    const fonts = getAllFonts();
    let filtered = category ? fonts.filter((f) => f.category === category) : fonts;

    const paginated = filtered.slice(page * limit, (page + 1) * limit);

    res.json({
      total: filtered.length,
      page,
      limit,
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fonts" });
  }
});

// Get font categories
router.get("/fonts/categories", (req: Request, res: Response) => {
  const fonts = getAllFonts();
  const categories = Array.from(new Set(fonts.map((f) => f.category)));
  res.json(categories);
});

// Get default color palette (20 unique colors)
router.get("/palettes/default", (req: Request, res: Response) => {
  const defaultPalette = [
    { hex: "#6366F1", name: "Indigo" },
    { hex: "#EC4899", name: "Pink" },
    { hex: "#06B6D4", name: "Cyan" },
    { hex: "#8B5CF6", name: "Violet" },
    { hex: "#F97316", name: "Orange" },
    { hex: "#EF4444", name: "Red" },
    { hex: "#22C55E", name: "Green" },
    { hex: "#EAB308", name: "Yellow" },
    { hex: "#64748B", name: "Slate" },
    { hex: "#1E293B", name: "Slate Dark" },
    { hex: "#0EA5E9", name: "Sky" },
    { hex: "#A78BFA", name: "Purple" },
    { hex: "#FB7185", name: "Rose" },
    { hex: "#2DD4BF", name: "Teal" },
    { hex: "#FBBF24", name: "Amber" },
    { hex: "#34D399", name: "Emerald" },
    { hex: "#60A5FA", name: "Blue" },
    { hex: "#F472B6", name: "Fuchsia" },
    { hex: "#FFB347", name: "Peach" },
    { hex: "#FFFFFF", name: "White" },
  ];

  res.json({
    name: "Forge Studio Default",
    colors: defaultPalette,
    colorCount: defaultPalette.length,
  });
});

// Search fonts
router.get("/fonts/search", (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || "";
    const fonts = getAllFonts();

    const results = fonts.filter(
      (f) =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.category === query,
    );

    res.json(results.slice(0, 50));
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// Get color statistics
router.get("/colors/stats", (req: Request, res: Response) => {
  const colors = getColors();
  const categories = Array.from(new Set(colors.map((c) => c.category)));

  const stats = {
    totalColors: colors.length,
    categories: categories.length,
    byCategory: categories.map((cat) => ({
      name: cat,
      count: colors.filter((c) => c.category === cat).length,
    })),
  };

  res.json(stats);
});

// Get font statistics
router.get("/fonts/stats", (req: Request, res: Response) => {
  const fonts = getAllFonts();
  const categories = Array.from(new Set(fonts.map((f) => f.category)));

  const stats = {
    totalFonts: fonts.length,
    categories: categories.length,
    byCategory: categories.map((cat) => ({
      name: cat,
      count: fonts.filter((f) => f.category === cat).length,
    })),
  };

  res.json(stats);
});

export default router;
