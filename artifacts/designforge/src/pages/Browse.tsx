import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useListTemplates } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Poster", "Invitation", "Business Card", "Menu", "Branding", "Social Media", "Editorial", "Packaging", "Presentation", "Certificate"];

export default function Browse() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data, isLoading } = useListTemplates({
    category: activeCategory !== "All" ? activeCategory : undefined
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Template Gallery</h1>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(124,58,237,0.3)]" 
                  : "glass hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="glass border-none overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.templates?.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="glass border-none overflow-hidden h-full flex flex-col group hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-300">
                <div className="h-48 bg-muted/50 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative placeholder for template thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="w-24 h-32 bg-background shadow-xl rotate-[-5deg] rounded-md transition-transform group-hover:rotate-0 group-hover:scale-110" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {template.category}
                    </Badge>
                    <span className="font-bold text-lg">{template.price}</span>
                  </div>
                  <CardTitle className="text-xl">{template.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-muted-foreground text-sm">
                  {template.description}
                </CardContent>
                <CardFooter>
                  <Link href={`/customize/${template.id}`} className="w-full">
                    <Button className="w-full water-btn border-0">Customize</Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
          {data?.templates?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No templates found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
