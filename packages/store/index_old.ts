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
  setSessionUsers: (users: SessionUser[]) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
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

      // Session State (default values)
      sessionId: null,
      sessionName: null,
      isSessionOwner: false,
      sessionUsers: [],
      userPermissions: null,
      connectionStatus: "disconnected",
      currentUserId: null,
      currentUserName: null,

      // Session Actions (placeholder implementations)
      createSession: async (name: string, isPublic: boolean = false) => {
        // TODO: Implement API call to create session
        console.log("Creating session:", name, "Public:", isPublic);
        throw new Error("createSession not implemented yet");
      },

      joinSession: async (sessionId: string) => {
        // TODO: Implement API call to join session
        console.log("Joining session:", sessionId);
        throw new Error("joinSession not implemented yet");
      },

      leaveSession: () => {
        // TODO: Implement session leave logic
        console.log("Leaving session");
        set({
          sessionId: null,
          sessionName: null,
          isSessionOwner: false,
          sessionUsers: [],
          userPermissions: null,
          connectionStatus: "disconnected",
        });
      },

      updateUserCursor: (cursor: { x: number; y: number; z: number }) => {
        // TODO: Implement cursor update via socket
        console.log("Updating cursor:", cursor);
      },

      updateUserSelection: (objectId: string | null) => {
        // TODO: Implement selection update via socket
        console.log("Updating selection:", objectId);
      },

      setCurrentUser: (userId: string, userName: string) => {
        set({ currentUserId: userId, currentUserName: userName });
      },

      // Session State Setters (for socket updates)
      setSessionState: (
        sessionId: string,
        sessionName: string,
        objects: { [id: string]: SceneObject },
        permissions: SessionPermissions
      ) => {
        set({
          sessionId,
          sessionName,
          objects,
          userPermissions: permissions,
          connectionStatus: "connected",
        });
      },

      setSessionUsers: (users: SessionUser[]) => {
        set({ sessionUsers: users });
      },

      setConnectionStatus: (status: ConnectionStatus) => {
        set({ connectionStatus: status });
      },
    }),
    {
      name: "3d-studio-storage",
      // Only persist certain fields, not session-specific data
      partialize: (state) => ({
        transformMode: state.transformMode,
        currentUserId: state.currentUserId,
        currentUserName: state.currentUserName,
        // Note: Don't persist objects anymore - they're session-specific
        // Note: Don't persist session state - it should be fetched fresh
      }),
    }
  )
);
