import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore, sessionHistoryHelpers } from "@repo/store";
import { apiClient } from "../lib/api";
import { ROUTES } from "../router/index";
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
  const navigate = useNavigate();

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

      // Navigate to session
      navigate(ROUTES.SESSION(response.sessionId));
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
      navigate(ROUTES.SESSION(sessionId));
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
    navigate(ROUTES.SESSION(session.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            3D Collaboration Studio
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Create, collaborate, and build amazing 3D experiences together
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Main Action Cards */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Your Profile
                </h2>
                <p className="text-blue-100 mt-1">
                  Let others know who you are
                </p>
              </div>
              <div className="p-8">
                <div className="relative">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your display name"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {!userName.trim() && (
                  <p className="text-amber-600 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Please enter your name to continue
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Create Session Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create New Session
              </h2>
              <p className="text-green-100 mt-1">
                Start a new collaborative 3D workspace
              </p>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                    placeholder="Session name (e.g., 'My 3D House Project')"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleCreateSession}
                  disabled={
                    !newSessionName.trim() || !userName.trim() || isLoading
                  }
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create Session
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Join Session Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Join Session
              </h2>
              <p className="text-blue-100 mt-1">
                Connect to an existing workspace
              </p>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={joinSessionUrl}
                    onChange={(e) => setJoinSessionUrl(e.target.value)}
                    placeholder="Paste session URL or ID"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleJoinByUrl}
                  disabled={
                    !joinSessionUrl.trim() || !userName.trim() || isLoading
                  }
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Joining...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM12 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM12 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Join Session
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Session History */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Created Sessions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clipRule="evenodd"
                  />
                </svg>
                My Created Sessions
              </h2>
              <p className="text-purple-100 mt-1">
                Sessions you've created and own
              </p>
            </div>
            <div className="p-8">
              {sessionHistory.createdSessions.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">
                    No sessions created yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Create your first session to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionHistory.createdSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="group p-6 border-2 border-gray-100 rounded-xl hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-700 transition-colors">
                            {session.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Last visited:{" "}
                            {formatLastVisited(session.lastVisited)}
                          </p>
                          <p className="text-xs text-purple-600 font-mono mt-2 bg-purple-100 px-2 py-1 rounded">
                            {session.url}
                          </p>
                        </div>
                        <div className="ml-4">
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Joined Sessions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Sessions I've Joined
              </h2>
              <p className="text-orange-100 mt-1">
                Collaborative workspaces you're part of
              </p>
            </div>
            <div className="p-8">
              {sessionHistory.joinedSessions.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">
                    No sessions joined yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Join a session using a link or ID
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionHistory.joinedSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="group p-6 border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-700 transition-colors">
                            {session.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Last visited:{" "}
                            {formatLastVisited(session.lastVisited)}
                          </p>
                          <p className="text-xs text-orange-600 font-mono mt-2 bg-orange-100 px-2 py-1 rounded">
                            {session.url}
                          </p>
                        </div>
                        <div className="ml-4">
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
