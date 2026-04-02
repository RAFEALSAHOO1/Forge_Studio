import { create } from 'zustand';

interface Customizations {
  texts: Record<string, string>;
  colors: Record<string, string>;
  fonts: Record<string, string>;
}

interface CustomizationState {
  templateId: string | null;
  customizations: Customizations;
  setTemplateId: (id: string) => void;
  setCustomization: (type: keyof Customizations, key: string, value: string) => void;
  resetCustomization: () => void;
}

export const useCustomizationStore = create<CustomizationState>((set) => ({
  templateId: null,
  customizations: { texts: {}, colors: {}, fonts: {} },
  setTemplateId: (id) => set({ templateId: id }),
  setCustomization: (type, key, value) => set((state) => ({
    customizations: {
      ...state.customizations,
      [type]: {
        ...state.customizations[type],
        [key]: value
      }
    }
  })),
  resetCustomization: () => set({ customizations: { texts: {}, colors: {}, fonts: {} } })
}));
