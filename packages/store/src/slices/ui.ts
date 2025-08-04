import type { StateCreator } from "zustand";
import type { TransformMode } from "@repo/types";

// UI State Slice
export interface UiSlice {
  // UI State
  transformMode: TransformMode;
  selectedObjectId: string | null;
  isLoading: boolean;
  error: string | null;

  // UI Actions
  setTransformMode: (mode: TransformMode) => void;
  setSelectedObjectId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  // State
  transformMode: "translate",
  selectedObjectId: null,
  isLoading: false,
  error: null,

  // Actions
  setTransformMode: (mode) => set({ transformMode: mode }),
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
});
