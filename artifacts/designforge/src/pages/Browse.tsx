import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListTemplates } from "@workspace/api-client-react";
import { LuxuryColorPicker } from "@/components/LuxuryColorPicker";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Poster", "Invitation", "Business Card", "Menu", "Branding", "Social Media", "Editorial", "Packaging", "Presentation", "Certificate"];

export default function Browse() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  const { data, isLoading } = useListTemplates({
    category: activeCategory !== "All" ? activeCategory : undefined
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800">
      {/* Header Section */}
      <div className="glass-container sticky top-16 z-40 border-b border-white/10 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold light-gradient-text mb-3">
                Template Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our collection of premium design templates and customize with 5000+ luxury colors
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeCategory === cat
                      ? "btn-water-primary shadow-lg"
                      : "glass hover:glass-frosted"
                  )}
                >
                  {cat}
                </motion.button>
              ))}
            </div>

            {/* Color Palette Toggle */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowColorPalette(!showColorPalette)}
                className="flex items-center gap-2 btn-glass px-4 py-2 rounded-lg font-medium"
              >
                <span className="text-xl">🎨</span>
                {showColorPalette ? "Hide" : "Show"} Luxury Color Palette
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Section */}
      {showColorPalette && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="morphism-glass-light mx-6 my-6 rounded-xl p-4 max-w-7xl mx-auto lg:mx-auto"
        >
          <LuxuryColorPicker
            onSelectColor={(hex) => setSelectedColor(hex)}
            maxSelections={1}
            displayMode="grid"
          />
        </motion.div>
      )}

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass border-none overflow-hidden animate-pulse">
                <Skeleton className="h-48 w-full rounded-none" />
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(data as any)?.templates?.length > 0 && (data as any).templates.map((template: any) => (
              <motion.div key={template.id} variants={item}>
                <Card
                  className={cn(
                    "glass border-none overflow-hidden group cursor-pointer transition-all hover:shadow-xl",
                    selectedColor && "hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                  )}
                  style={selectedColor ? { borderColor: `${selectedColor}40` } : {}}
                >
                  {/* Image Container */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-600 overflow-hidden">
                    {template.previewUrl && (
                      <img
                        src={template.previewUrl}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                    {!template.previewUrl && (
                      <div className="w-full h-full flex items-center justify-center text-white/80 text-center p-4">
                        <div>
                          <div className="text-4xl mb-2">✨</div>
                          <p className="font-medium">{template.title}</p>
                        </div>
                      </div>
                    )}

                    {/* Overlay with category badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="morphism-glass-light">
                        {template.category}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Price & Delivery Info */}
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Commission</p>
                          <p className="text-xl font-bold text-indigo-600">
                            {template.price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-600 dark:text-gray-400">Delivery</p>
                          <p className="font-semibold">{template.deliveryTime}</p>
                        </div>
                      </div>

                      {/* Customizable Fields Info */}
                      {template.customizableFields && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                          {Array.from(
                            new Set(template.customizableFields.map((f: any) => f.type))
                          ).map((type: any) => (
                            <Badge
                              key={type}
                              variant="outline"
                              className="text-xs"
                            >
                              {type === "text"
                                ? "🔤 Text"
                                : type === "color"
                                  ? "🎨 Color"
                                  : "✍️ Font"}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Link href={`/customize/${template.id}`}>
                      <Button className="w-full water-btn rounded-lg font-semibold">
                        Customize Template
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && (!(data as any)?.templates?.length || (data as any)?.templates?.length === 0) && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-2">No templates found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or browse all categories
            </p>
            <Button
              onClick={() => setActiveCategory("All")}
              className="water-btn"
            >
              View All Templates
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
