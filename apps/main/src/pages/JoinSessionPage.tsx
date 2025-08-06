/**
 * Join Session Page Component
 * Page for joining sessions with session history
 */

import React, { useEffect, useState } from "react";
import { MoveLeft, User } from "@repo/ui/icons";
import SessionForm from "../components/session/SessionForm";
import SessionHistoryCard from "../components/session/SessionHistoryCard";
import ErrorAlert from "../components/session/ErrorAlert";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalStore, sessionHistoryHelpers } from "@repo/store";
import { apiClient } from "../lib/api";
import { ROUTES } from "../router/index";
import { logger } from "../lib/dev";
import type { SessionHistoryItem } from "@repo/types";

// Utility functions
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

const JoinSessionPage: React.FC = () => {
  const { sessionId: urlSessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

  const [sessionInput, setSessionInput] = useState(urlSessionId || "");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    sessionHistory,
    setCurrentUser,
    addToJoinedSessions,
    updateSessionLastVisited,
  } = useGlobalStore();

  const sessionsPerPage = 5;
  const totalPages = Math.ceil(
    sessionHistory.joinedSessions.length / sessionsPerPage,
  );
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const currentSessions = sessionHistory.joinedSessions.slice(
    startIndex,
    startIndex + sessionsPerPage,
  );

  // Set session ID from URL if provided
  useEffect(() => {
    if (urlSessionId) {
      setSessionInput(urlSessionId);
      logger.info(
        "JoinSessionPage: Pre-filled session ID from URL",
        urlSessionId,
      );
    }
  }, [urlSessionId]);

  const handleJoinSession = async () => {
    if (!sessionInput.trim() || !userName.trim()) return;

    setIsLoading(true);
    setError(null);

    // Extract session ID from URL using utility function
    const sessionId = extractSessionId(sessionInput);

    try {
      logger.info("JoinSessionPage: Attempting to join session", sessionId);

      const response = await apiClient.joinSession({
        sessionId,
        userName: userName.trim(),
      });

      const user = {
        id: "temp_" + Date.now(),
        name: userName.trim(),
      };

      // Update store with new session history
      const historyItem = sessionHistoryHelpers.createHistoryItem(
        sessionId,
        response.session.name,
      );

      // Set current user
      setCurrentUser(user);

      // Add to joined sessions in store with user info
      addToJoinedSessions({
        ...historyItem,
        user,
      });

      logger.info("JoinSessionPage: Successfully joined session", response);

      // Navigate to session
      navigate(ROUTES.SESSION(sessionId));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to join session";
      setError(errorMessage);
      logger.error("JoinSessionPage: Failed to join session", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionClick = (session: SessionHistoryItem) => {
    updateSessionLastVisited(session.id);
    navigate(ROUTES.SESSION(session.id));
  };

  const handleBackHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col gap-12 max-w-6xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <button
            onClick={handleBackHome}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors pt-2"
            aria-label="Back to Home"
          >
            <MoveLeft className="w-6 h-6 mr-2" />
          </button>
          <div className="">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Join Session
            </h1>
            <p className="text-gray-600 mt-2">
              Connect to an existing workspace
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>

        {/* Error Display */}
        <ErrorAlert error={error} />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Join Session Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {/* Custom SVG for card header (kept as per user request) */}
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
                Join Details
              </h2>
              <p className="text-blue-100 mt-1">
                Enter your details to join the workspace
              </p>
            </div>
            <div className="p-8">
              <SessionForm
                userName={userName}
                setUserName={setUserName}
                sessionInput={sessionInput}
                setSessionInput={setSessionInput}
                isLoading={isLoading}
                onSubmit={handleJoinSession}
                submitLabel="Join Session"
                urlSessionId={urlSessionId}
              />
            </div>
          </div>

          {/* Joined Sessions History */}
          <SessionHistoryCard
            title="My Joined Sessions"
            subtitle="Collaborative workspaces you're part of"
            sessions={currentSessions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSessionClick={handleSessionClick}
            emptyIcon={<User className="w-6 h-6 text-gray-300 mr-3" />}
            emptyTitle="No sessions joined yet"
            emptySubtitle="Join your first session to get started"
            formatLastVisited={formatLastVisited}
            sessionNameClass="group-hover:text-orange-700"
            sessionHoverClass="hover:border-orange-300 hover:bg-orange-50"
            paginationColorClass=""
          />
        </div>
      </div>
    </div>
  );
};

export default JoinSessionPage;
