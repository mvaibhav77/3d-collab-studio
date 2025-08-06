import type { StateCreator } from "zustand";
import type { SceneObject } from "@repo/types";
import { produce } from "immer";
import type { GlobalState } from "../store";

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

export const createSceneSlice: StateCreator<GlobalState, [], [], SceneSlice> = (
  set,
  get,
) => ({
  // State
  objects: {},
  setObjects: (objects) => set({ objects }),
  addObject: (object) =>
    set(
      produce((state) => {
        state.objects[object.id] = object;
      }),
    ),
  updateObject: (id, partialObject) =>
    set(
      produce((state) => {
        if (state.objects[id]) {
          Object.assign(state.objects[id], partialObject);
        }
      }),
    ),

  // Corrected removeObject implementation
  removeObject: (id) =>
    set(
      produce((state) => {
        // First, check if the object being removed is the currently selected one.
        // We also need to import `selectedObjectId` into this slice's type
        // and have the combined store handle it. For now, we assume it's available.
        if (get().selectedObjectId === id) {
          state.selectedObjectId = null; // De-select the object
        }
        delete state.objects[id]; // Then, remove it from the scene
      }),
    ),
});
