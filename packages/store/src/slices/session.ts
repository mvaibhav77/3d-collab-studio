import type { StateCreator } from "zustand";
import type {
  SessionUser,
  ConnectionStatus,
  CollaborativeSession,
  SessionHistoryItem,
  SessionHistory,
} from "@repo/types";
import { sessionHistoryHelpers } from "../utils";

// Session State Slice - Pure state management, no API calls
export interface SessionSlice {
  // Session State
  sessionId: string | null;
  sessionName: string | null;
  sessionUsers: SessionUser[];
  connectionStatus: ConnectionStatus;
  currentUserId: string | null;
  currentUserName: string | null;
  sceneData: Record<string, any> | null;

  // Session History
  sessionHistory: SessionHistory;

  // Pure State Actions (no API calls)
  setCurrentUser: (user: SessionUser) => void;
  leaveSession: () => void;

  // Session History Actions
  addToCreatedSessions: (session: SessionHistoryItem) => void;
  addToJoinedSessions: (session: SessionHistoryItem) => void;
  updateSessionLastVisited: (sessionId: string) => void;
  clearSessionHistory: () => void;

  // Session State Setters (for external updates like API responses, socket events)
  setSessionState: (session: CollaborativeSession) => void;
  setSessionUsers: (users: SessionUser[]) => void;
  removeSessionUser: (userId: string) => void;
  updateSessionUser: (userId: string, updates: Partial<SessionUser>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

export const createSessionSlice: StateCreator<
  SessionSlice,
  [],
  [],
  SessionSlice
> = (set) => ({
  // State
  sessionId: null,
  sessionName: null,
  sessionUsers: [],
  connectionStatus: "disconnected",
  currentUserId: null,
  currentUserName: null,
  sceneData: null,
  sessionHistory: {
    createdSessions: [],
    joinedSessions: [],
  },

  // Pure State Actions
  setCurrentUser: (user: SessionUser) => {
    set({ currentUserId: user.id, currentUserName: user.name });
  },

  leaveSession: () => {
    set({
      sessionId: null,
      sessionName: null,
      sessionUsers: [],
      connectionStatus: "disconnected",
    });
  },

  // Session History Actions
  addToCreatedSessions: (session: SessionHistoryItem) => {
    set((state) => ({
      sessionHistory: {
        ...state.sessionHistory,
        createdSessions: sessionHistoryHelpers.addToBeginning(
          state.sessionHistory.createdSessions,
          session,
        ),
      },
    }));
  },

  addToJoinedSessions: (session: SessionHistoryItem) => {
    set((state) => ({
      sessionHistory: {
        ...state.sessionHistory,
        joinedSessions: sessionHistoryHelpers.addToBeginning(
          state.sessionHistory.joinedSessions,
          session,
        ),
      },
    }));
  },

  updateSessionLastVisited: (sessionId: string) => {
    set((state) => ({
      sessionHistory: {
        createdSessions: sessionHistoryHelpers.updateLastVisited(
          state.sessionHistory.createdSessions,
          sessionId,
        ),
        joinedSessions: sessionHistoryHelpers.updateLastVisited(
          state.sessionHistory.joinedSessions,
          sessionId,
        ),
      },
    }));
  },

  clearSessionHistory: () => {
    set({
      sessionHistory: {
        createdSessions: [],
        joinedSessions: [],
      },
    });
  },

  // Session State Setters (for external updates)
  setSessionState: (session: CollaborativeSession) => {
    set({
      sessionId: session.id,
      sessionName: session.name,
      sceneData: session.sceneData,
    });
  },

  setSessionUsers: (users: SessionUser[]) => {
    set({ sessionUsers: users });
  },

  removeSessionUser: (userId: string) => {
    set((state) => ({
      sessionUsers: state.sessionUsers.filter((u) => u.id !== userId),
    }));
  },

  updateSessionUser: (userId: string, updates: Partial<SessionUser>) => {
    set((state) => ({
      sessionUsers: state.sessionUsers.map((user) =>
        user.id === userId ? { ...user, ...updates } : user,
      ),
    }));
  },

  setConnectionStatus: (status: ConnectionStatus) => {
    set({ connectionStatus: status });
  },
});
