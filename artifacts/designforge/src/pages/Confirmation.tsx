import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package, Mail } from 'lucide-react';
import { Link } from 'wouter';

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    // Basic param extraction since wouter doesn't have a built-in hook for search params in v3
    const params = new URLSearchParams(window.location.search);
    const id = params.get('requestId');
    if (!id) {
      setLocation('/');
    } else {
      setRequestId(id);
    }
  }, [setLocation]);

  if (!requestId) return null;

  return (
    <div className="flex-grow flex items-center justify-center p-6 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass-panel max-w-lg w-full rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500"
        >
          <CheckCircle size={48} />
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Request Confirmed</h1>
        <p className="text-foreground/70 mb-8">
          Your bespoke design request has been received by our studio. Our artisans will review your customizations shortly.
        </p>

        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 text-left mb-8 border border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3 mb-4 text-sm font-medium text-foreground/60 uppercase tracking-wider">
            <Package size={16} />
            Order Summary
          </div>
          <div className="flex justify-between items-end border-b border-black/10 dark:border-white/10 pb-4 mb-4">
            <span className="text-foreground/70">Request ID</span>
            <span className="font-mono font-semibold">{requestId}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-foreground/80">
            <Mail size={16} className="mt-1 flex-shrink-0 text-primary" />
            <p>A confirmation email has been sent with further details and an estimated delivery timeline.</p>
          </div>
        </div>

        <Link href="/browse" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-foreground text-background font-medium hover:scale-[1.02] transition-transform">
          Back to Gallery <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
}
