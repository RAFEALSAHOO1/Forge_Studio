import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetTemplate, useSubmitDesignRequest } from "@workspace/api-client-react";
import { useCustomizationStore } from "@/stores/customizationStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Type, Palette, LayoutTemplate } from "lucide-react";

export default function Customize() {
  const [, params] = useRoute("/customize/:id");
  const id = params?.id;
  const [, setLocation] = useLocation();
  
  const { data: template, isLoading, error } = useGetTemplate(id || "", {
    query: { enabled: !!id }
  });

  const { customizations, setCustomization, setTemplateId, resetCustomization } = useCustomizationStore();
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const submitRequest = useSubmitDesignRequest();

  // Initialize store when template loads
  useEffect(() => {
    if (template) {
      setTemplateId(template.id);
      // Only set default values if store is empty to prevent overriding user changes
      const hasCustomizations = Object.keys(customizations.texts).length > 0 || 
                                Object.keys(customizations.colors).length > 0 || 
                                Object.keys(customizations.fonts).length > 0;
      
      if (!hasCustomizations) {
        template.customizableFields.forEach(field => {
          setCustomization(field.type + "s" as any, field.key, field.defaultValue);
        });
      }
    }
  }, [template, setTemplateId, setCustomization]); // Excluded customizations from deps intentionally

  // Cleanup on unmount if needed, but we might want to keep it
  
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Failed to load template</h2>
          <Button variant="outline" onClick={() => setLocation("/browse")}>Back to Gallery</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!id || !customerName || !customerEmail) {
      toast.error("Please fill in your name and email.");
      return;
    }

    try {
      const response = await submitRequest.mutateAsync({
        data: {
          templateId: id,
          customerName,
          customerEmail,
          customizations: {
            texts: customizations.texts,
            colors: customizations.colors,
            fonts: customizations.fonts
          }
        }
      });
      
      resetCustomization();
      // Store in session storage or pass via state to confirmation
      sessionStorage.setItem('lastOrder', JSON.stringify({
        requestId: response.requestId,
        templateName: template?.title,
        message: response.message,
        estimatedDelivery: response.estimatedDelivery
      }));
      
      setLocation("/confirmation");
    } catch (err) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const textFields = template?.customizableFields.filter(f => f.type === "text") || [];
  const colorFields = template?.customizableFields.filter(f => f.type === "color") || [];
  const fontFields = template?.customizableFields.filter(f => f.type === "font") || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel - Live Preview */}
      <div className="flex-[3] bg-muted/20 relative flex items-center justify-center p-8 border-r border-border/50">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/browse")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Gallery
          </Button>
        </div>
        
        {isLoading ? (
          <Skeleton className="w-full max-w-lg aspect-[4/5] rounded-xl" />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg aspect-[4/5] glass-panel rounded-2xl shadow-2xl relative overflow-hidden flex flex-col p-12 transition-all duration-500"
            style={{
              backgroundColor: customizations.colors.background || template?.customizableFields.find(f => f.key === 'background')?.defaultValue || 'var(--card)',
              color: customizations.colors.text || template?.customizableFields.find(f => f.key === 'text')?.defaultValue || 'var(--foreground)',
              fontFamily: customizations.fonts.heading || template?.customizableFields.find(f => f.key === 'heading')?.defaultValue || 'sans-serif'
            }}
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 mix-blend-overlay" />
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight" style={{ color: customizations.colors.primary || 'inherit' }}>
                  {customizations.texts.title || template?.customizableFields.find(f => f.key === 'title')?.defaultValue || template?.title}
                </h2>
                <p className="text-lg opacity-80" style={{ fontFamily: customizations.fonts.body || 'sans-serif' }}>
                  {customizations.texts.subtitle || template?.customizableFields.find(f => f.key === 'subtitle')?.defaultValue || 'Add your subtitle here'}
                </p>
              </div>
              
              <div className="mt-auto glass p-6 rounded-xl border border-white/10">
                <p className="text-sm opacity-90 leading-relaxed" style={{ fontFamily: customizations.fonts.body || 'sans-serif' }}>
                  {customizations.texts.description || template?.customizableFields.find(f => f.key === 'description')?.defaultValue || template?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Panel - Controls */}
      <div className="flex-[2] flex flex-col bg-background/95 backdrop-blur-xl border-l h-[calc(100vh-4rem)]">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Studio Editor</h2>
          <p className="text-muted-foreground text-sm mt-1">{template?.title}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><LayoutTemplate className="w-4 h-4 mr-2" /> Content</TabsTrigger>
                <TabsTrigger value="colors" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><Palette className="w-4 h-4 mr-2" /> Colors</TabsTrigger>
                <TabsTrigger value="typography" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"><Type className="w-4 h-4 mr-2" /> Typography</TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                <TabsContent value="content" className="space-y-6 mt-0 outline-none">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {textFields.map(field => (
                      <div key={field.key} className="space-y-2 mb-4">
                        <Label htmlFor={`field-${field.key}`}>{field.label}</Label>
                        <Input 
                          id={`field-${field.key}`}
                          value={customizations.texts[field.key] || ''}
                          onChange={(e) => setCustomization('texts', field.key, e.target.value)}
                          maxLength={field.maxLength}
                          className="bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary"
                        />
                      </div>
                    ))}
                    {textFields.length === 0 && <p className="text-muted-foreground text-sm italic">No text fields available for this template.</p>}
                  </motion.div>
                </TabsContent>

                <TabsContent value="colors" className="space-y-6 mt-0 outline-none">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div className="grid grid-cols-2 gap-4">
                      {colorFields.map(field => (
                        <div key={field.key} className="space-y-2">
                          <Label htmlFor={`color-${field.key}`}>{field.label}</Label>
                          <div className="flex gap-2 items-center">
                            <div className="relative w-10 h-10 rounded-md border border-border overflow-hidden shrink-0">
                              <input 
                                type="color" 
                                id={`color-${field.key}`}
                                value={customizations.colors[field.key] || '#ffffff'}
                                onChange={(e) => setCustomization('colors', field.key, e.target.value)}
                                className="absolute inset-[-10px] w-20 h-20 cursor-pointer"
                              />
                            </div>
                            <Input 
                              value={customizations.colors[field.key] || ''}
                              onChange={(e) => setCustomization('colors', field.key, e.target.value)}
                              className="font-mono text-xs bg-muted/30 border-muted-foreground/20 uppercase"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {colorFields.length === 0 && <p className="text-muted-foreground text-sm italic">No color fields available for this template.</p>}
                  </motion.div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6 mt-0 outline-none">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    {fontFields.map(field => (
                      <div key={field.key} className="space-y-2 mb-4">
                        <Label>{field.label}</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {field.options?.map(font => (
                            <button
                              key={font}
                              onClick={() => setCustomization('fonts', field.key, font)}
                              className={`p-3 text-left rounded-lg border transition-all ${customizations.fonts[field.key] === font ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-border/50 bg-muted/20 hover:bg-muted/50'}`}
                              style={{ fontFamily: font }}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    {fontFields.length === 0 && <p className="text-muted-foreground text-sm italic">No font fields available for this template.</p>}
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          )}
        </div>

        {/* Checkout Form */}
        <div className="p-6 bg-muted/10 border-t border-border/50">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  placeholder="Jane Doe" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="jane@example.com" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="bg-background border-border/50"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Commission</p>
              <p className="text-2xl font-bold">{template?.price || "$0"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Est. Delivery</p>
              <p className="font-medium">{template?.deliveryTime || "2-3 days"}</p>
            </div>
          </div>

          <Button 
            className="w-full h-12 water-btn rounded-xl text-lg font-medium shadow-lg"
            onClick={handleSubmit}
            disabled={submitRequest.isPending || !id}
          >
            {submitRequest.isPending ? (
              <span className="flex items-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Processing...</span>
            ) : (
              <span className="flex items-center"><CheckCircle2 className="w-5 h-5 mr-2" /> Place Request</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
