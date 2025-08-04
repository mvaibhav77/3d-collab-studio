import type { StateCreator } from "zustand";
import type { SceneObject } from "@repo/types";

// Scene State Slice
export interface SceneSlice {
  // Scene State
  objects: { [id: string]: SceneObject };

  // Scene Actions
  setObjects: (objects: { [id: string]: SceneObject }) => void;
  addObject: (object: SceneObject) => void;
  updateObject: (id: string, partialObject: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
}

export const createSceneSlice: StateCreator<SceneSlice, [], [], SceneSlice> = (
  set
) => ({
  // State
  objects: {},

  // Actions
  setObjects: (objects) => set({ objects }),

  addObject: (object) =>
    set((state) => ({
      objects: {
        ...state.objects,
        [object.id]: object,
      },
    })),

  updateObject: (id, partialObject) =>
    set((state) => ({
      objects: {
        ...state.objects,
        [id]: state.objects[id]
          ? { ...state.objects[id], ...partialObject }
          : state.objects[id],
      },
    })),

  removeObject: (id) =>
    set((state) => {
      const newObjects = { ...state.objects };
      delete newObjects[id];
      return { objects: newObjects };
    }),
});
