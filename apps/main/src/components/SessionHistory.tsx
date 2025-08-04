import React, { useState } from "react";
import { useGlobalStore, sessionHistoryHelpers } from "@repo/store";
import { apiClient } from "../lib/api";
import type { SessionHistoryItem } from "@repo/types";

// Utility functions moved to component level
const extractSessionId = (urlOrId: string): string => {
  if (urlOrId.includes("/session/")) {
    return urlOrId.split("/session/")[1].split("?")[0];
  }
  return urlOrId.trim();
};

const formatLastVisited = (lastVisited: Date): string => {
  const date =
    lastVisited instanceof Date ? lastVisited : new Date(lastVisited);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export const SessionHistory: React.FC = () => {
  const [newSessionName, setNewSessionName] = useState("");
  const [joinSessionUrl, setJoinSessionUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    sessionHistory,
    setCurrentUser,
    addToCreatedSessions,
    addToJoinedSessions,
    updateSessionLastVisited,
  } = useGlobalStore();

  const handleCreateSession = async () => {
    if (!newSessionName.trim() || !userName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.createSession({
        name: newSessionName,
        userName: userName,
      });

      // Update store with new session history
      const historyItem = sessionHistoryHelpers.createHistoryItem(
        response.sessionId,
        newSessionName
      );
      addToCreatedSessions(historyItem);

      // Set current user
      setCurrentUser("temp_" + Date.now(), userName);

      // Navigate to session (in real app, use router)
      window.location.href = `/session/${response.sessionId}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create session";
      setError(errorMessage);
      console.error("Failed to create session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinByUrl = async () => {
    if (!joinSessionUrl.trim() || !userName.trim()) return;

    setIsLoading(true);
    setError(null);

    // Extract session ID from URL using utility function
    const sessionId = extractSessionId(joinSessionUrl);

    try {
      const response = await apiClient.joinSession({
        sessionId,
        userName,
      });

      // Update store with new session history
      const historyItem = sessionHistoryHelpers.createHistoryItem(
        sessionId,
        response.session.name
      );
      addToJoinedSessions(historyItem);

      // Set current user
      setCurrentUser("temp_" + Date.now(), userName);

      // Navigate to session
      window.location.href = `/session/${sessionId}`;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to join session";
      setError(errorMessage);
      console.error("Failed to join session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionClick = (session: SessionHistoryItem) => {
    // Update last visited time
    updateSessionLastVisited(session.id);

    // Navigate to session
    window.location.href = session.url;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        3D Collaboration Studio
      </h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* User Name Input */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Name</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 border border-gray-300 rounded-lg"
          disabled={isLoading}
        />
      </div>

      {/* Create New Session */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Session</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            placeholder="Session name (e.g., 'My 3D House')"
            className="flex-1 p-3 border border-gray-300 rounded-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleCreateSession}
            disabled={!newSessionName.trim() || !userName.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* Join Session by URL */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Join Session by URL</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={joinSessionUrl}
            onChange={(e) => setJoinSessionUrl(e.target.value)}
            placeholder="Paste session URL or ID"
            className="flex-1 p-3 border border-gray-300 rounded-lg"
            disabled={isLoading}
          />
          <button
            onClick={handleJoinByUrl}
            disabled={!joinSessionUrl.trim() || !userName.trim() || isLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>

      {/* Session History */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* My Created Sessions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">My Created Sessions</h2>

          {sessionHistory.createdSessions.length === 0 ? (
            <p className="text-gray-500 italic">No sessions created yet</p>
          ) : (
            <div className="space-y-3">
              {sessionHistory.createdSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{session.name}</div>
                  <div className="text-sm text-gray-500">
                    Last visited: {formatLastVisited(session.lastVisited)}
                  </div>
                  <div className="text-xs text-blue-600 font-mono">
                    {session.url}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Joined Sessions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Sessions I've Joined</h2>

          {sessionHistory.joinedSessions.length === 0 ? (
            <p className="text-gray-500 italic">No sessions joined yet</p>
          ) : (
            <div className="space-y-3">
              {sessionHistory.joinedSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{session.name}</div>
                  <div className="text-sm text-gray-500">
                    Last visited: {formatLastVisited(session.lastVisited)}
                  </div>
                  <div className="text-xs text-blue-600 font-mono">
                    {session.url}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Debug Info - Only in development */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug - Session History:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(sessionHistory, null, 2)}
        </pre>
      </div>
    </div>
  );
};
