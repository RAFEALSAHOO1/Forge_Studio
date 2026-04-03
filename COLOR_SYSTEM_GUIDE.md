# Luxury Color & Font System Guide

## Overview

The Forge Studio Luxury Design System provides access to **5000+ premium colors** organized by category, subcategory, and undertone, along with **500+ professional typefaces**. This guide explains how to use these components throughout the application.

## Architecture

### Color System Components

#### 1. **LuxuryColorPicker Component** (`designforge/src/components/LuxuryColorPicker.tsx`)

A comprehensive color selection component with multiple display modes and advanced filtering.

**Props:**
```typescript
interface ColorPickerProps {
  onSelectColor?: (hex: string) => void;  // Callback when color selected
  maxSelections?: number;                  // Max colors to select (default: 10)
  displayMode?: "grid" | "list" | "showcase";  // Display style
}
```

**Usage:**
```tsx
import { LuxuryColorPicker } from "@/components/LuxuryColorPicker";

function MyComponent() {
  return (
    <LuxuryColorPicker
      onSelectColor={(hex) => console.log(hex)}
      maxSelections={5}
      displayMode="grid"
    />
  );
}
```

**Features:**
- 🎨 **Browse Mode**: Browse all colors with category, subcategory, and undertone filters
- 💎 **Luxury Showcase**: View 20 curated luxury colors
- 📂 **Category Browse**: Browse colors by category (Metallics, Jewel Tones, etc.)
- 🔍 **Search**: Search colors by name or hex code
- 📊 **Pagination**: Browse large color sets efficiently
- ✅ **Selection**: Select up to configured maximum colors
- 📋 **Preview**: See selected colors with copy-to-clipboard

**Display Modes:**
- `grid`: Compact color swatches in grid layout (8-10 per row)
- `list`: Detailed list with color info and description
- `showcase`: Large preview cards with full color details

---

#### 2. **LuxuryFontPicker Component** (`designforge/src/components/LuxuryFontPicker.tsx`)

Professional font selection component with search and filtering.

**Props:**
```typescript
interface FontPickerProps {
  onSelectFont?: (fontFamily: string) => void;
  maxSelections?: number;  // Max fonts to select (default: 5)
  displayMode?: "grid" | "list";
}
```

**Usage:**
```tsx
import { LuxuryFontPicker } from "@/components/LuxuryFontPicker";

function MyComponent() {
  return (
    <LuxuryFontPicker
      onSelectFont={(family) => console.log(family)}
      maxSelections={5}
      displayMode="list"
    />
  );
}
```

**Features:**
- 🔤 **Font Browser**: Browse 500+ professional typefaces
- 📑 **Category Filtering**: Filter by font family (Serif, Sans-serif, Display, Monospace)
- 🔍 **Search**: Find fonts by name
- 👁️ **Live Preview**: See actual font rendering
- ⚖️ **Weight Display**: Show available font weights (Regular, Bold, etc.)
- ✅ **Selection Tracking**: Select multiple fonts

---

### Color Organization

The luxury color system is organized into 6 major categories:

#### **1. Metallics** (Precious Metal Finishes)
- **Gold**: Classic Gold, Rolls Royce Gold, Vintage Gold, Champagne Gold, Bright Gold, Antique Gold
- **Silver**: Bright Silver, Matte Silver, Sterling Silver, Antique Silver
- **Platinum**: Bright Platinum, Matte Platinum
- **Bronze**: Bright Bronze, Antique Bronze, Copper
- **Copper**: Bright Copper, Antique Copper

#### **2. Jewel Tones** (Precious Gemstones)
- **Sapphire**: Royal Sapphire, Deep Sapphire
- **Emerald**: Dark Emerald, Teal Emerald
- **Ruby**: Deep Ruby, Dark Ruby
- **Amethyst**: Bright Amethyst, Deep Amethyst
- **Topaz**: Golden Topaz
- **Opal**: Opal White
- **Other**: Garnet, Jade, Tourmaline

#### **3. Elegant Neutrals** (Sophisticated Grays and Beiges)
- **Charcoal**: Charcoal Noir, Slate
- **Cream**: Ivory, Champagne, Pale Gold
- **Taupe**: Light Taupe, Deep Taupe
- **Gray**: Warm Gray, Cool Gray, Silver Gray
- **Brown**: Espresso, Saddle Brown, Sienna

#### **4. Soft Pastels** (Delicate Tints)
- Pastel Pink, Pastel Cyan, Pastel Green, Pastel Yellow, Pastel Orange

#### **5. Deep Rich** (Sophisticated Darks)
- Pure Black, Midnight Purple, Deep Indigo, Burgundy, Chocolate, Forest Green

#### **6. Vibrant** (Bold Energy)
- Neon Pink, Neon Yellow, Neon Orange, Neon Cyan, Neon Green, Hot Pink

### Undertone Classification

Colors are classified by undertone for design harmony:

- **Cool**: Blues, purples, cool greens - creates calm, serene feel
- **Warm**: Yellows, oranges, reds - creates energy, warmth
- **Neutral**: Balanced undertones - versatile, professional

---

## API Integration

### Backend Endpoints

**Color Endpoints:**

```bash
# Get paginated colors with filters
GET /colors-fonts/colors?page=0&limit=100&category=Metallics&subcategory=Gold&undertone=warm

# Get all color categories
GET /colors-fonts/colors/categories

# Get subcategories for a category
GET /colors-fonts/colors/subcategories?category=Metallics

# Get available undertones
GET /colors-fonts/colors/undertones

# Look up specific color by hex
GET /colors-fonts/colors/hex/D4AF37

# Search colors
GET /colors-fonts/colors/search?q=sapphire&limit=50

# Get featured luxury palette
GET /colors-fonts/palettes/luxury-default

# Get all colors in category
GET /colors-fonts/palettes/category/Jewelw%20Tones
```

**Font Endpoints:**

```bash
# Get paginated fonts
GET /colors-fonts/fonts?page=0&limit=50&category=serif

# Get font categories
GET /colors-fonts/fonts/categories

# Search fonts
GET /colors-fonts/fonts/search?q=garamond&limit=50
```

### Frontend Hooks

React Query hooks for seamless API integration:

```typescript
// Color Hooks
import {
  useColors,
  useColorCategories,
  useColorSubcategories,
  useColorUndertones,
  useColorByHex,
  useSearchColors,
  useLuxuryPalette,
  usePaletteByCategory,
  useFonts,
  useFontCategories,
  useSearchFonts,
} from "@/hooks/api";

// Usage examples:
const { data: colors } = useColors(0, 100, { category: "Metallics" });
const { data: categories } = useColorCategories();
const { data: color } = useColorByHex("D4AF37");
const { data: palette } = useLuxuryPalette();
const { data: fonts } = useFonts(0, 50, "serif");
```

---

## Integration Examples

### Example 1: Browse Page with Color Palette

```typescript
// designforge/src/pages/Browse.tsx
import { LuxuryColorPicker } from "@/components/LuxuryColorPicker";
import { useState } from "react";

export function Browse() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showColorPalette, setShowColorPalette] = useState(false);

  return (
    <div>
      <button onClick={() => setShowColorPalette(!showColorPalette)}>
        Toggle Color Palette
      </button>

      {showColorPalette && (
        <LuxuryColorPicker
          onSelectColor={setSelectedColor}
          maxSelections={1}
          displayMode="grid"
        />
      )}

      {selectedColor && (
        <div>
          Selected: 
          <div
            style={{ backgroundColor: selectedColor }}
            className="w-12 h-12"
          />
        </div>
      )}
    </div>
  );
}
```

### Example 2: Customize Page with Color & Font Pickers

```typescript
// designforge/src/pages/Customize.tsx
import { LuxuryColorPicker } from "@/components/LuxuryColorPicker";
import { LuxuryFontPicker } from "@/components/LuxuryFontPicker";
import { useCustomizationStore } from "@/stores/customizationStore";

export function Customize() {
  const { customization, updateCustomization } = useCustomizationStore();

  return (
    <div>
      <h2>Choose Colors</h2>
      <LuxuryColorPicker
        onSelectColor={(hex) => {
          updateCustomization({
            ...customization,
            colors: [...(customization.colors || []), hex],
          });
        }}
        maxSelections={5}
        displayMode="grid"
      />

      <h2>Choose Fonts</h2>
      <LuxuryFontPicker
        onSelectFont={(family) => {
          updateCustomization({
            ...customization,
            fonts: [...(customization.fonts || []), family],
          });
        }}
        maxSelections={5}
      />
    </div>
  );
}
```

### Example 3: Color Preview Component

```typescript
function ColorPreview({ hexColors }: { hexColors: string[] }) {
  return (
    <div className="flex gap-4">
      {hexColors.map((hex) => (
        <div
          key={hex}
          className="w-16 h-16 rounded-lg shadow-lg cursor-pointer hover:scale-110"
          style={{ backgroundColor: hex }}
          title={hex}
        />
      ))}
    </div>
  );
}
```

---

## Morphism Effects with Colors

Use the luxury colors with morphism classes:

```typescript
// Glassmorphism with luxury color accent
<div
  className="glass p-6 rounded-xl"
  style={{ borderColor: selectedColor }}
>
  Content
</div>

// Watermorphism with luxury color gradient
<div
  className="water p-6 rounded-xl"
  style={{
    background: `linear-gradient(135deg, ${selectedColor} 0%, rgba(255,255,255,0.1) 100%)`
  }}
>
  Content
</div>

// Lightmorphism with luxury color glow
<div
  className="light p-6 rounded-xl"
  style={{
    boxShadow: `0 0 30px ${selectedColor}40`
  }}
>
  Content
</div>
```

---

## Data Structure

### Color Object

```typescript
interface ColorDefinition {
  hex: string;           // Hex code (e.g., "#D4AF37")
  rgb: string;           // RGB format
  hsl: string;           // HSL format
  name: string;          // Display name (e.g., "Rolls Royce Gold")
  category: string;      // Major category
  subcategory: string;   // Specific type
  undertone: "cool" | "warm" | "neutral";
  isPremium?: boolean;
}
```

### Font Object

```typescript
interface FontDefinition {
  family: string;        // Font family name
  category: "serif" | "sans-serif" | "display" | "monospace";
  variants: string[];    // Available weights/styles
  description?: string;  // Font description
  isPremium?: boolean;
}
```

### API Response

```typescript
interface ColorResponse {
  data: ColorDefinition[];
  total: number;
  hasMore: boolean;
  page: number;
}

interface FontResponse {
  fonts: FontDefinition[];
  total: number;
  hasMore: boolean;
  page: number;
}
```

---

## Performance Considerations

### Pagination

Colors are paginated (default 100 per page):
- Use pagination for large color browsing
- Each page fetches 100 colors
- Frontend caches via React Query

### Search Optimization

- Search by color name for exact matches
- Search by hex code for color lookup
- Results are cached and deduplicated

### Component Rendering

- Grid mode: O(n) where n = colors displayed
- List mode: Scrollable container with max-height
- Showcase mode: Limited to 10 items for performance

### Recommendations

1. Use `grid` mode for colorblind-friendly display
2. Use `list` mode for detailed exploration
3. Use `showcase` mode for feature highlights
4. Limit maxSelections to what's needed
5. Implement proper error boundaries

---

## Future Enhancements

- [ ] Color harmony suggestions
- [ ] Custom palette creation
- [ ] Color blind accessibility modes
- [ ] Brand color matching
- [ ] Historical color usage tracking
- [ ] AI-powered color recommendations
- [ ] Export color palettes as CSS/JSON
- [ ] Color mood boards
- [ ] 3D color visualization

---

## Troubleshooting

**Issue**: Colors not loading
- **Solution**: Check network tab, verify API endpoint
- **Debug**: Log API response in browser console

**Issue**: Font not rendering
- **Solution**: Check if font is supported in browser
- **Debug**: Try Arial fallback first

**Issue**: Selection not persisting
- **Solution**: Ensure Zustand store is properly initialized
- **Debug**: Check browser localStorage

**Issue**: Slow color picker performance
- **Solution**: Use pagination, reduce displayMode complexity
- **Debug**: Profile React components in DevTools

---

## Resources

- [Color Science](https://www.interactions.acm.org/content/color-science)
- [Web Typography](https://www.typewolf.com/)
- [Luxury Brand Colors](https://www.colorhexa.com/)
- [Undertone Theory](https://www.colorpsychology.org/)

---

## Support

For issues or feature requests, contact the design system team.
