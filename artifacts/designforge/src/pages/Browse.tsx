import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useListTemplates } from '@workspace/api-client-react';
import { Palette, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Browse() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Use real API hook
  const { data: listResponse, isLoading } = useListTemplates(
    activeCategory !== 'All' ? { category: activeCategory } : {}
  );

  const categories = ['All', ...(listResponse?.categories || [])];
  const templates = listResponse?.templates || [];

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12 flex-grow">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Template Gallery</h1>
          <p className="text-foreground/60 text-lg">Select a foundation for your next masterpiece.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={18} className="text-foreground/40 mr-2 flex-shrink-0" />
          {isLoading && categories.length === 1 ? (
            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
          ) : (
            categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-foreground text-background shadow-md' 
                    : 'glass hover:bg-white/40 dark:hover:bg-black/40'
                }`}
              >
                {cat}
              </button>
            ))
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <Skeleton className="w-full aspect-[4/3]" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="pt-4 flex justify-between">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <Palette size={48} className="text-foreground/20 mb-4" />
          <h3 className="text-2xl font-semibold mb-2">No templates found</h3>
          <p className="text-foreground/60">Try selecting a different category.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
              }}
              className="group glass rounded-2xl overflow-hidden flex flex-col hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-violet-900/20"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-black/5 dark:bg-white/5">
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Palette size={40} className="text-foreground/20" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-black/80 backdrop-blur-md border border-white/20 text-foreground">
                    {template.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2">{template.title}</h3>
                <p className="text-foreground/60 text-sm line-clamp-2 mb-6 flex-grow">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-mono text-sm font-medium text-foreground/80">{template.price}</span>
                  <Link 
                    href={`/customize/${template.id}`}
                    className="px-5 py-2 rounded-lg bg-foreground text-background font-medium text-sm hover:scale-105 transition-transform"
                  >
                    Customize
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
