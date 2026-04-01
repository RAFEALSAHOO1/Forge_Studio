import React, { Suspense, useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetTemplate, useSubmitDesignRequest } from '@workspace/api-client-react';
import { useCustomizationStore } from '@/stores/customizationStore';
import { useToast } from '@/hooks/use-toast';
import { Type, Palette, Type as FontIcon, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'wouter';
import SafeCanvas from '@/components/3d/SafeCanvas';

const CustomizeScene = React.lazy(() => import('@/components/3d/CustomizeScene'));

export default function Customize() {
  const [, params] = useRoute('/customize/:id');
  const id = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: template, isLoading, isError } = useGetTemplate(id!, {
    query: { enabled: !!id }
  });
  
  const submitMutation = useSubmitDesignRequest();
  
  const { 
    customizations, 
    setCustomization, 
    resetCustomization,
    setTemplateId
  } = useCustomizationStore();

  const [activeTab, setActiveTab] = useState<'text' | 'color' | 'font'>('text');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Initialize store and defaults
  useEffect(() => {
    if (template) {
      setTemplateId(template.id);
      
      // Set defaults if store is empty
      template.customizableFields.forEach(field => {
        if (!customizations[`${field.type}s` as any]?.[field.key]) {
          setCustomization(`${field.type}s` as any, field.key, field.defaultValue);
        }
      });
      
      if (template.availableFonts.length > 0 && !customizations.fonts['primary']) {
        setCustomization('fonts', 'primary', template.availableFonts[0]);
      }
    }
  }, [template, setTemplateId, setCustomization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || !id) return;
    
    if (!customerName || !customerEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await submitMutation.mutateAsync({
        data: {
          templateId: id,
          customerName,
          customerEmail,
          customizations,
        }
      });
      
      resetCustomization();
      setLocation(`/confirmation?requestId=${response.requestId}`);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Template not found</h2>
        <Link href="/browse" className="text-primary hover:underline">Return to Gallery</Link>
      </div>
    );
  }

  const textFields = template.customizableFields.filter(f => f.type === 'text');
  const colorFields = template.customizableFields.filter(f => f.type === 'color');

  return (
    <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      {/* Left: 3D Preview (60%) */}
      <div className="w-full md:w-[60%] h-[50vh] md:h-full relative bg-black/5 dark:bg-white/5">
        <div className="absolute top-6 left-6 z-10">
          <Link href="/browse" className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/50 dark:hover:bg-black/50 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
        
        <div className="absolute bottom-6 right-6 z-10 flex gap-2">
          <button 
            onClick={() => {
              // Trigger a scene reset somehow, or just refresh the page component state
              toast({ title: "View reset" });
            }}
            className="p-3 rounded-full glass hover:bg-white/50 dark:hover:bg-black/50 transition-colors"
            title="Reset View"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <SafeCanvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/80 to-indigo-950/80">
              <div className="text-center space-y-3 opacity-60">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-4xl">
                  ✦
                </div>
                <p className="text-white/70 text-sm">3D Preview</p>
              </div>
            </div>
          }
        >
          <CustomizeScene />
        </SafeCanvas>
      </div>

      {/* Right: Customization Panel (40%) */}
      <div className="w-full md:w-[40%] h-full glass-panel border-l border-white/10 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20 overflow-hidden">
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-primary/10 text-primary">
              {template.category}
            </span>
            <span className="font-mono text-sm">{template.price}</span>
          </div>
          <h2 className="text-2xl font-bold">{template.title}</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 shrink-0 px-6 pt-2">
          {[
            { id: 'text', icon: Type, label: 'Content' },
            { id: 'color', icon: Palette, label: 'Colors' },
            { id: 'font', icon: FontIcon, label: 'Typography' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'text-foreground' : 'text-foreground/50 hover:text-foreground/80'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'text' && (
                <div className="space-y-4">
                  {textFields.length === 0 ? (
                    <p className="text-foreground/50 text-sm">No text customizations available.</p>
                  ) : (
                    textFields.map(field => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-sm font-medium">{field.label}</label>
                        <input 
                          type="text" 
                          value={customizations.texts[field.key] || ''}
                          onChange={(e) => setCustomization('texts', field.key, e.target.value)}
                          maxLength={field.maxLength}
                          className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'color' && (
                <div className="space-y-4">
                  {colorFields.length === 0 ? (
                    <p className="text-foreground/50 text-sm">No color customizations available.</p>
                  ) : (
                    colorFields.map(field => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-sm font-medium flex justify-between">
                          {field.label}
                          <span className="text-foreground/50 uppercase">{customizations.colors[field.key] || field.defaultValue}</span>
                        </label>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            value={customizations.colors[field.key] || field.defaultValue}
                            onChange={(e) => setCustomization('colors', field.key, e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent p-0"
                          />
                          <div className="flex-grow flex gap-2 flex-wrap">
                            {/* Predefined color swatches could go here if in API */}
                            {['#ffffff', '#000000', '#6d28d9', '#4f46e5', '#ec4899', '#10b981'].map(preset => (
                              <button
                                key={preset}
                                onClick={() => setCustomization('colors', field.key, preset)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                  customizations.colors[field.key] === preset ? 'border-primary' : 'border-white/20'
                                }`}
                                style={{ backgroundColor: preset }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'font' && (
                <div className="space-y-4">
                  {template.availableFonts.length === 0 ? (
                    <p className="text-foreground/50 text-sm">No font options available.</p>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Typography</label>
                      <div className="grid gap-3">
                        {template.availableFonts.map(font => (
                          <button
                            key={font}
                            onClick={() => setCustomization('fonts', 'primary', font)}
                            className={`p-4 rounded-xl text-left border transition-all ${
                              customizations.fonts['primary'] === font 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-white/10 bg-background/50 hover:border-white/20'
                            }`}
                            style={{ fontFamily: font }}
                          >
                            <span className="text-lg block mb-1">Ag</span>
                            <span className="text-sm font-sans">{font}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer / Submit Form */}
        <div className="p-6 border-t border-white/10 bg-background/30 backdrop-blur-md shrink-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full water-btn py-3 rounded-xl font-bold flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100"
            >
              {submitMutation.isPending ? (
                <><Loader2 size={18} className="animate-spin mr-2" /> Finalizing...</>
              ) : (
                'Place Request'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
