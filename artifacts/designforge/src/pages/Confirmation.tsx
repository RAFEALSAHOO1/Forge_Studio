import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, FileText, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderDetails {
  requestId: string;
  templateName?: string;
  message: string;
  estimatedDelivery: string;
}

export default function Confirmation() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (stored) {
      setOrder(JSON.parse(stored));
    } else {
      // If no order found, redirect to browse
      setLocation("/browse");
    }
  }, [setLocation]);

  const copyRequestId = () => {
    if (order?.requestId) {
      navigator.clipboard.writeText(order.requestId);
      toast.success("Request ID copied to clipboard");
    }
  };

  if (!order) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="max-w-md w-full glass p-8 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-indigo-500 to-primary" />
        
        <div className="flex flex-col items-center text-center mb-8 pt-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 text-primary"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Request Received</h1>
          <p className="text-muted-foreground">{order.message}</p>
        </div>

        <div className="space-y-4 bg-background/50 rounded-2xl p-6 border border-border/50 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template</p>
              <p className="font-medium">{order.templateName || "Custom Template"}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-medium">{order.estimatedDelivery}</p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-border/50 flex flex-col">
            <p className="text-sm text-muted-foreground mb-2">Request ID</p>
            <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-border/50">
              <code className="font-mono text-primary text-sm font-bold">{order.requestId}</code>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={copyRequestId}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="w-full h-12 rounded-xl group" onClick={() => setLocation("/browse")}>
            Browse More Templates
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
