import React, { useState } from "react";
import { useGlobalStore } from "@repo/store";
import { extractSessionId, formatLastVisited } from "@repo/store/sessionUtils";
import type { SessionHistoryItem } from "@repo/types";

export const SessionHistory: React.FC = () => {
  const [newSessionName, setNewSessionName] = useState("");
  const [joinSessionUrl, setJoinSessionUrl] = useState("");
  const [userName, setUserName] = useState("");

  const { sessionHistory, createSession, joinSession, setCurrentUser } =
    useGlobalStore();

  const handleCreateSession = async () => {
    if (!newSessionName.trim() || !userName.trim()) return;

    try {
      const sessionId = await createSession(newSessionName, userName);
      setCurrentUser("temp_" + Date.now(), userName);

      // Navigate to session (in real app, use router)
      window.location.href = `/session/${sessionId}`;
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleJoinByUrl = async () => {
    if (!joinSessionUrl.trim() || !userName.trim()) return;

    // Extract session ID from URL using utility function
    const sessionId = extractSessionId(joinSessionUrl);

    try {
      await joinSession(sessionId, userName);
      setCurrentUser("temp_" + Date.now(), userName);

      // Navigate to session
      window.location.href = `/session/${sessionId}`;
    } catch (error) {
      console.error("Failed to join session:", error);
    }
  };

  const handleSessionClick = (session: SessionHistoryItem) => {
    // Update last visited time
    const { updateSessionLastVisited } = useGlobalStore.getState();
    updateSessionLastVisited(session.id);

    // Navigate to session
    window.location.href = session.url;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        3D Collaboration Studio
      </h1>

      {/* User Name Input */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Name</h2>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 border border-gray-300 rounded-lg"
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
          />
          <button
            onClick={handleCreateSession}
            disabled={!newSessionName.trim() || !userName.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Create
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
          />
          <button
            onClick={handleJoinByUrl}
            disabled={!joinSessionUrl.trim() || !userName.trim()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Join
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
