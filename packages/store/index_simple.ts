import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import type {
  SceneObject,
  TransformMode,
  SessionUser,
  ConnectionStatus,
  CollaborativeSession,
} from "@repo/types";

// Simplified store interface
interface GlobalState {
  // UI State
  transformMode: TransformMode;
  setTransformMode: (mode: TransformMode) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  // Scene State
  objects: { [id: string]: SceneObject };
  setObjects: (objects: { [id: string]: SceneObject }) => void;
  addObject: (object: SceneObject) => void;
  updateObject: (id: string, partialObject: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;

  // Session State - SIMPLIFIED
  sessionId: string | null;
  sessionName: string | null;
  sessionUsers: SessionUser[]; // Online users managed by Socket.IO
  connectionStatus: ConnectionStatus;
  currentUserId: string | null;
  currentUserName: string | null;

  // Session Actions - SIMPLIFIED
  createSession: (name: string, userName: string) => Promise<string>;
  joinSession: (sessionId: string, userName: string) => Promise<void>;
  leaveSession: () => void;
  setCurrentUser: (userId: string, userName: string) => void;

  // Session State Setters (for socket updates)
  setSessionState: (session: CollaborativeSession) => void;
  addSessionUser: (user: SessionUser) => void;
  removeSessionUser: (userId: string) => void;
  updateSessionUser: (userId: string, updates: Partial<SessionUser>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

// Create the simplified store
export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      // UI State
      transformMode: "translate",
      setTransformMode: (mode) => set({ transformMode: mode }),
      selectedObjectId: null,
      setSelectedObjectId: (id) => set({ selectedObjectId: id }),

      // Scene State
      objects: {},
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
            if (state.selectedObjectId === id) {
              state.selectedObjectId = null;
            }
          })
        ),

      // Session State - SIMPLIFIED
      sessionId: null,
      sessionName: null,
      sessionUsers: [],
      connectionStatus: "disconnected",
      currentUserId: null,
      currentUserName: null,

      // Session Actions - SIMPLIFIED (placeholder implementations)
      createSession: async (
        name: string,
        userName: string
      ): Promise<string> => {
        console.log("Creating session:", name, "for user:", userName);
        throw new Error("createSession not implemented yet");
      },

      joinSession: async (
        sessionId: string,
        userName: string
      ): Promise<void> => {
        console.log("Joining session:", sessionId, "as:", userName);
        throw new Error("joinSession not implemented yet");
      },

      leaveSession: () => {
        set({
          sessionId: null,
          sessionName: null,
          sessionUsers: [],
          connectionStatus: "disconnected",
        });
      },

      setCurrentUser: (userId: string, userName: string) => {
        set({ currentUserId: userId, currentUserName: userName });
      },

      // Session State Setters (for socket updates)
      setSessionState: (session: CollaborativeSession) => {
        set({
          sessionId: session.id,
          sessionName: session.name,
          objects: session.sceneData?.objects || {},
        });
      },

      addSessionUser: (user: SessionUser) => {
        set(
          produce((state) => {
            const existingIndex = state.sessionUsers.findIndex(
              (u) => u.id === user.id
            );
            if (existingIndex >= 0) {
              state.sessionUsers[existingIndex] = user;
            } else {
              state.sessionUsers.push(user);
            }
          })
        );
      },

      removeSessionUser: (userId: string) => {
        set(
          produce((state) => {
            state.sessionUsers = state.sessionUsers.filter(
              (u) => u.id !== userId
            );
          })
        );
      },

      updateSessionUser: (userId: string, updates: Partial<SessionUser>) => {
        set(
          produce((state) => {
            const user = state.sessionUsers.find((u) => u.id === userId);
            if (user) {
              Object.assign(user, updates);
            }
          })
        );
      },

      setConnectionStatus: (status: ConnectionStatus) => {
        set({ connectionStatus: status });
      },
    }),
    {
      name: "global-store",
      partialize: (state) => ({
        // Only persist basic session info, not full state
        sessionId: state.sessionId,
        currentUserName: state.currentUserName,
      }),
    }
  )
);

// Export types for convenience
export type { GlobalState };
