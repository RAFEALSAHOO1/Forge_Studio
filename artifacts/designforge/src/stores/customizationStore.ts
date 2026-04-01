import { create } from 'zustand';
import type { CustomizationData } from '@workspace/api-client-react/src/generated/api.schemas';

interface CustomizationState {
  selectedTemplateId: string | null;
  customizations: CustomizationData;
  setTemplateId: (id: string) => void;
  setCustomization: (type: keyof CustomizationData, key: string, value: string) => void;
  resetCustomization: () => void;
}

const initialCustomizations: CustomizationData = {
  texts: {},
  colors: {},
  fonts: {}
};

export const useCustomizationStore = create<CustomizationState>((set) => ({
  selectedTemplateId: null,
  customizations: initialCustomizations,
  setTemplateId: (id) => set({ selectedTemplateId: id }),
  setCustomization: (type, key, value) => set((state) => ({
    customizations: {
      ...state.customizations,
      [type]: {
        ...state.customizations[type],
        [key]: value
      }
    }
  })),
  resetCustomization: () => set({ customizations: initialCustomizations, selectedTemplateId: null })
}));
