import React, { Suspense } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, PenTool } from 'lucide-react';
import SafeCanvas from '@/components/3d/SafeCanvas';

const HeroScene = React.lazy(() => import('@/components/3d/HeroScene'));

export default function Home() {
  return (
    <div className="flex-grow flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center w-full px-6">
        {/* 3D Background */}
        <div className="absolute inset-0 z-0 opacity-80 dark:opacity-60">
          <SafeCanvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-violet-900/30 via-indigo-900/20 to-purple-900/30 animate-pulse" />
            }
          >
            <HeroScene />
          </SafeCanvas>
        </div>

        {/* Hero Content */}
        <div className="z-10 max-w-4xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-black/20 border border-white/20 mb-6 text-sm font-medium"
            >
              <Sparkles size={14} className="text-violet-500" />
              <span>The New Standard in Creative Customization</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6"
            >
              Design Without <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-400">
                Boundaries
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10"
            >
              Step into the immersive studio. Personalize premium templates in real-time 3D and order bespoke designs that elevate your brand.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="group relative">
                <div className="light-glow" />
                <Link href="/browse" className="water-btn px-8 py-4 rounded-xl font-semibold flex items-center gap-2 text-lg">
                  Explore Templates
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white/30 dark:bg-black/20 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "Curated Library", desc: "Access exclusively crafted templates designed by top-tier professionals." },
              { icon: PenTool, title: "Tactile Editing", desc: "Adjust typography, colorways, and layouts in a fluid, responsive interface." },
              { icon: Sparkles, title: "Real-time 3D", desc: "Visualize your customizations instantly on premium 3D product models." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass p-8 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
