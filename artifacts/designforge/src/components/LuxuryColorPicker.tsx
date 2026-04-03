import React, { useState, useMemo } from "react";
import {
  useColors,
  useColorCategories,
  useColorSubcategories,
  useColorUndertones,
  useLuxuryPalette,
  usePaletteByCategory,
  useSearchColors,
} from "@/hooks/api";

interface ColorPickerProps {
  onSelectColor?: (hex: string) => void;
  maxSelections?: number;
  displayMode?: "grid" | "list" | "showcase";
}

export function LuxuryColorPicker({
  onSelectColor,
  maxSelections = 10,
  displayMode = "grid",
}: ColorPickerProps) {
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"browse" | "luxury" | "category">("luxury");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedUndertone, setSelectedUndertone] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  // Queries
  const { data: categoryData } = useColorCategories();
  const { data: subcategoryData } = useColorSubcategories(selectedCategory);
  const { data: undertoneData } = useColorUndertones();
  const { data: luxuryData } = useLuxuryPalette();
  const { data: categoryPaletteData } = usePaletteByCategory(selectedCategory);
  const { data: searchData } = useSearchColors(searchQuery);

  const filters = {
    category: selectedCategory,
    subcategory: selectedSubcategory,
    undertone: selectedUndertone,
  };

  const { data: colorData } = useColors(page, 100, filters);

  // Memoize displayed colors based on active tab
  const displayedColors = useMemo(() => {
    switch (activeTab) {
      case "luxury":
        return luxuryData?.colors || [];
      case "category":
        return categoryPaletteData?.colors || [];
      case "browse":
        return searchQuery ? searchData : colorData?.data || [];
      default:
        return [];
    }
  }, [activeTab, luxuryData, categoryPaletteData, searchData, colorData, searchQuery]);

  const handleSelectColor = (hex: string) => {
    if (selectedColors.has(hex)) {
      selectedColors.delete(hex);
    } else if (selectedColors.size < maxSelections) {
      selectedColors.add(hex);
    }
    setSelectedColors(new Set(selectedColors));
    onSelectColor?.(hex);
  };

  const handleClearSelection = () => {
    setSelectedColors(new Set());
  };

  return (
    <div className="morphism-glass-light w-full rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold light-gradient-text">Luxury Color Palette</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            5000+ premium colors inspired by Rolls Royce
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Selected: <span className="font-bold">{selectedColors.size}</span> / {maxSelections}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {["luxury", "category", "browse"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setPage(0);
            }}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === tab
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      {activeTab === "browse" && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search colors by name or hex (e.g., 'Sapphire' or '#FFD700')..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Filters */}
      {activeTab === "browse" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("");
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="">All Categories</option>
              {categoryData?.map((cat: string) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          {selectedCategory && (
            <div>
              <label className="block text-sm font-medium mb-2">Subcategory</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="">All</option>
                {subcategoryData?.map((subcat: string) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Undertone Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Undertone</label>
            <select
              value={selectedUndertone}
              onChange={(e) => setSelectedUndertone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="">All Undertones</option>
              {undertoneData?.map((tone: string) => (
                <option key={tone} value={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Color Grid */}
      <div className="space-y-4">
        {displayMode === "grid" && (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {displayedColors.map((color: any, idx: number) => (
              <button
                key={`${color.hex}-${idx}`}
                onClick={() => handleSelectColor(color.hex)}
                className="group relative aspect-square rounded-lg overflow-hidden transition-all hover:scale-110"
                title={color.name}
              >
                <div
                  className="w-full h-full transition-all"
                  style={{ backgroundColor: color.hex }}
                />
                {selectedColors.has(color.hex) && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {color.name}
                </div>
              </button>
            ))}
          </div>
        )}

        {displayMode === "list" && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {displayedColors.map((color: any, idx: number) => (
              <div
                key={`${color.hex}-${idx}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleSelectColor(color.hex)}
              >
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="flex-1">
                  <div className="font-medium">{color.name}</div>
                  <div className="text-sm text-gray-500">
                    {color.category}
                    {color.subcategory && ` • ${color.subcategory}`}
                  </div>
                </div>
                <div className="font-mono text-sm font-bold">{color.hex}</div>
                {selectedColors.has(color.hex) && (
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        )}

        {displayMode === "showcase" && (
          <div className="space-y-4">
            {displayedColors.map((color: any, idx: number) => (
              <div
                key={`${color.hex}-${idx}`}
                className="relative h-24 rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => handleSelectColor(color.hex)}
              >
                <div
                  className="absolute inset-0 transition-all group-hover:shadow-lg"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/0 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-between px-4 py-3 text-white">
                  <div>
                    <div className="font-bold text-lg">{color.name}</div>
                    <div className="text-sm opacity-90">
                      {color.category}
                      {color.subcategory && ` • ${color.subcategory}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">{color.hex}</div>
                    {selectedColors.has(color.hex) && (
                      <svg
                        className="w-6 h-6 text-green-400 mt-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === "browse" && !searchQuery && colorData && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {Math.ceil(colorData.total / 100)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!colorData.hasMore}
            className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Selected Colors Preview */}
      {selectedColors.size > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Selected Colors ({selectedColors.size})</h3>
            <button
              onClick={handleClearSelection}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {Array.from(selectedColors).map((hex) => (
              <div
                key={hex}
                className="relative group"
              >
                <div
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-lg transition-all"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
                <button
                  onClick={() => {
                    selectedColors.delete(hex);
                    setSelectedColors(new Set(selectedColors));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LuxuryColorPicker;
