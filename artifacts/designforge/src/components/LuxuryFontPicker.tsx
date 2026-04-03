import React, { useState, useMemo } from "react";
import {
  useFonts,
  useFontCategories,
  useSearchFonts,
} from "@/hooks/api";

interface FontPickerProps {
  onSelectFont?: (fontFamily: string) => void;
  maxSelections?: number;
  displayMode?: "grid" | "list";
}

export function LuxuryFontPicker({
  onSelectFont,
  maxSelections = 5,
  displayMode = "list",
}: FontPickerProps) {
  const [selectedFonts, setSelectedFonts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  // Queries
  const { data: categoriesData } = useFontCategories();
  const { data: searchData } = useSearchFonts(searchQuery);
  const { data: fontData } = useFonts(page, 50, selectedCategory);

  // Memoize displayed fonts
  const displayedFonts = useMemo(() => {
    if (searchQuery) {
      return searchData?.fonts || [];
    }
    return fontData?.data || [];
  }, [searchQuery, searchData, fontData]);

  const handleSelectFont = (fontFamily: string) => {
    if (selectedFonts.has(fontFamily)) {
      selectedFonts.delete(fontFamily);
    } else if (selectedFonts.size < maxSelections) {
      selectedFonts.add(fontFamily);
    }
    setSelectedFonts(new Set(selectedFonts));
    onSelectFont?.(fontFamily);
  };

  const handleClearSelection = () => {
    setSelectedFonts(new Set());
  };

  return (
    <div className="morphism-glass-light w-full rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold light-gradient-text">Luxury Font Collection</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            500+ premium typefaces for your designs
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Selected: <span className="font-bold">{selectedFonts.size}</span> / {maxSelections}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-3 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search fonts by name (e.g., 'Garamond', 'Helvetica')..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category Filter */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => {
              setSelectedCategory("");
              setPage(0);
            }}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === ""
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
            }`}
          >
            All Fonts
          </button>
          {categoriesData?.map((category: string) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Font Display */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {displayedFonts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            No fonts found. Try a different search or category.
          </div>
        ) : (
          <>
            {displayedFonts.map((font: any, idx: number) => (
              <div
                key={`${font.family}-${idx}`}
                onClick={() => handleSelectFont(font.family)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedFonts.has(font.family)
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {displayMode === "list" ? (
                      <>
                        <div
                          className="text-xl font-medium mb-2"
                          style={{ fontFamily: font.family }}
                        >
                          {font.family}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>Category: {font.category}</span>
                          {font.variants && (
                            <span>{font.variants.length} variant{font.variants.length !== 1 ? "s" : ""}</span>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {font.description && (
                            <p>{font.description}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div
                        className="text-2xl font-medium"
                        style={{ fontFamily: font.family }}
                      >
                        {font.family}
                      </div>
                    )}
                  </div>
                  {selectedFonts.has(font.family) && (
                    <svg
                      className="w-6 h-6 text-indigo-600 flex-shrink-0 ml-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </div>

                {/* Font Preview */}
                {font.variants && font.variants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Available Weights:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {font.variants.map((variant: string) => (
                        <span
                          key={variant}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded"
                        >
                          {variant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {!searchQuery && fontData && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {Math.ceil(fontData.total / 50)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!fontData.hasMore}
            className="px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Next
          </button>
        </div>
      )}

      {/* Selected Fonts Preview */}
      {selectedFonts.size > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Selected Fonts ({selectedFonts.size})</h3>
            <button
              onClick={handleClearSelection}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {Array.from(selectedFonts).map((fontFamily) => (
              <div
                key={fontFamily}
                className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700"
              >
                <div
                  className="font-medium flex-1"
                  style={{ fontFamily }}
                >
                  {fontFamily}
                </div>
                <button
                  onClick={() => {
                    selectedFonts.delete(fontFamily);
                    setSelectedFonts(new Set(selectedFonts));
                  }}
                  className="text-red-600 hover:text-red-700 font-bold"
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

export default LuxuryFontPicker;
