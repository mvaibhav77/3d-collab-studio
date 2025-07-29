import { create } from "zustand";

type TransformMode = "translate" | "rotate" | "scale";

// Define the shape of our store's state and actions
interface UIState {
  transformMode: TransformMode;
  setTransformMode: (mode: TransformMode) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
}

// Create the store
export const useUIStore = create<UIState>((set) => ({
  transformMode: "translate",
  setTransformMode: (mode) => set({ transformMode: mode }),
  selectedObjectId: null, // Default to nothing selected
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
}));
