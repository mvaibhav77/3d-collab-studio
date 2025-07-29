import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import type { SceneObject, TransformMode } from "@repo/types";

// Define the shape of our store's state and actions
interface GlobalState {
  transformMode: TransformMode;
  setTransformMode: (mode: TransformMode) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  objects: { [id: string]: SceneObject };
  setObjects: (objects: { [id: string]: SceneObject }) => void;
  addObject: (object: SceneObject) => void; // To add one
  updateObject: (id: string, partialObject: Partial<SceneObject>) => void;
  removeObject: (id: string) => void; // To remove one
}

// Create the store
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // UI State
      transformMode: "translate",
      setTransformMode: (mode) => set({ transformMode: mode }),
      selectedObjectId: null,
      setSelectedObjectId: (id) => set({ selectedObjectId: id }),

      // Scene State
      objects: {}, // Default to an empty scene
      setObjects: (objects) => set({ objects }),
      addObject: (object) =>
        set(
          produce((state) => {
            state.objects[object.id] = object;
          })
        ),
      updateObject: (id, partialObject) =>
        set(
          produce((state) => {
            if (state.objects[id]) {
              Object.assign(state.objects[id], partialObject);
            }
          })
        ),
      removeObject: (id) =>
        set(
          produce((state) => {
            delete state.objects[id];
            // If the deleted object was the selected one, de-select it
            if (state.selectedObjectId === id) {
              state.selectedObjectId = null;
            }
          })
        ),
    }),
    {
      name: "3d-studio-storage", // Name for the localStorage item
    }
  )
);
