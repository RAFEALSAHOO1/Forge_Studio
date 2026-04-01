import React, { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '@/stores/themeStore';
import { Moon, Sun, Layers } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useThemeStore();
  const [location] = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 dark:bg-violet-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 dark:bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
              <Layers size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">DesignForge</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/browse" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Templates
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow z-10 flex flex-col pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
