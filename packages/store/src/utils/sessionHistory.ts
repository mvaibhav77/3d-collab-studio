import type { SessionHistoryItem } from "@repo/types";

// Helper functions for session history management
export const sessionHistoryHelpers = {
  createHistoryItem(sessionId: string, name: string): SessionHistoryItem {
    return {
      id: sessionId,
      name,
      lastVisited: new Date(),
      url: `/session/${sessionId}`,
    };
  },

  removeDuplicates(
    sessions: SessionHistoryItem[],
    newSession: SessionHistoryItem
  ): SessionHistoryItem[] {
    return sessions.filter((s) => s.id !== newSession.id);
  },

  addToBeginning(
    sessions: SessionHistoryItem[],
    newSession: SessionHistoryItem
  ): SessionHistoryItem[] {
    const filtered = this.removeDuplicates(sessions, newSession);
    return [newSession, ...filtered];
  },

  updateLastVisited(
    sessions: SessionHistoryItem[],
    sessionId: string
  ): SessionHistoryItem[] {
    return sessions.map((session) =>
      session.id === sessionId
        ? { ...session, lastVisited: new Date() }
        : session
    );
  },
};
