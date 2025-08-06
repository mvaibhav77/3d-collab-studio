import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createUiSlice,
  createSceneSlice,
  createSessionSlice,
  type UiSlice,
  type SceneSlice,
  type SessionSlice,
} from "./slices";

// Combined store type
export type GlobalState = UiSlice & SceneSlice & SessionSlice;

// Create the combined store with persistence
export const useGlobalStore = create<GlobalState>()(
  persist(
    (...args) => ({
      ...createUiSlice(...args),
      ...createSceneSlice(...args),
      ...createSessionSlice(...args),
    }),
    {
      name: "global-store",
      partialize: (state) => ({
        // Persist only session history and basic user info
        sessionHistory: state.sessionHistory,
        currentUserName: state.currentUserName,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

// Export individual slice types for convenience
export type { UiSlice, SceneSlice, SessionSlice };
