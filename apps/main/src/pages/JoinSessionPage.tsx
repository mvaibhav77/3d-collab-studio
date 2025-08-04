/**
 * Join Session Page Component
 * Page for joining sessions via URL or ID
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useGlobalStore, sessionHistoryHelpers } from "@repo/store";
import { apiClient } from "../lib/api";
import { logger } from "../lib/dev";

const JoinSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToJoinedSessions, setCurrentUser } = useGlobalStore();

  // Extract session ID from URL params or search params
  const targetSessionId = sessionId || searchParams.get("id") || "";

  useEffect(() => {
    if (!targetSessionId) {
      logger.info(
        "JoinSessionPage: No session ID provided, staying on join page"
      );
    }
  }, [targetSessionId]);

  const handleJoinSession = async () => {
    if (!targetSessionId.trim() || !userName.trim()) {
      setError("Please provide both session ID and your name");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      logger.info(
        "JoinSessionPage: Attempting to join session",
        targetSessionId
      );

      const response = await apiClient.joinSession({
        sessionId: targetSessionId,
        userName: userName.trim(),
      });

      // Update store with new session history
      const historyItem = sessionHistoryHelpers.createHistoryItem(
        targetSessionId,
        response.session.name
      );
      addToJoinedSessions(historyItem);

      // Set current user
      setCurrentUser(response.userId || "temp_" + Date.now(), userName.trim());

      logger.info("JoinSessionPage: Successfully joined session", response);

      // Navigate to session
      navigate(`/session/${targetSessionId}`, { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to join session";
      setError(errorMessage);
      logger.error("JoinSessionPage: Failed to join session", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join Session</h1>
          <p className="text-gray-600 mt-2">
            {targetSessionId
              ? `Joining session: ${targetSessionId}`
              : "Enter session details to join"}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Session ID Input (if not provided in URL) */}
          {!targetSessionId && (
            <div>
              <label
                htmlFor="sessionId"
                className="block text-sm font-medium mb-2"
              >
                Session ID or URL
              </label>
              <input
                id="sessionId"
                type="text"
                placeholder="Enter session ID or paste URL"
                className="w-full p-3 border border-gray-300 rounded-lg"
                disabled={isLoading}
              />
            </div>
          )}

          {/* User Name Input */}
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium mb-2"
            >
              Your Name
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg"
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleJoinSession()}
            />
          </div>

          {/* Join Button */}
          <button
            onClick={handleJoinSession}
            disabled={!targetSessionId.trim() || !userName.trim() || isLoading}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? "Joining..." : "Join Session"}
          </button>

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={isLoading}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinSessionPage;
