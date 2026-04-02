import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Palette, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-background z-[-2]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sm text-primary mb-4 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Premium Design Atelier</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Design Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">Boundaries</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover, customize, and commission bespoke design templates crafted for creative professionals.
            Experience the future of interactive design delivery.
          </p>

          <div className="pt-8">
            <Link href="/browse" className="water-btn inline-flex items-center justify-center h-14 px-8 text-lg font-medium rounded-full">
              Explore Gallery
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32">
          {[
            { icon: Palette, title: "Live Customization", desc: "Tweak colors, typography, and content with real-time visual feedback." },
            { icon: Zap, title: "Instant Previews", desc: "See your modifications instantly on our interactive mockup engine." },
            { icon: Sparkles, title: "Bespoke Delivery", desc: "Commission final high-resolution assets crafted to your exact specifications." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass p-8 rounded-2xl text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
