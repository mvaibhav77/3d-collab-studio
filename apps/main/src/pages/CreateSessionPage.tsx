/**
 * Create Session Page Component
 * Page for creating new sessions with session history
 */

import React, { useState } from "react";
import { MoveLeft, FileText } from "@repo/ui/icons";
import SessionForm from "../components/session/SessionForm";
import SessionHistoryCard from "../components/session/SessionHistoryCard";
import ErrorAlert from "../components/session/ErrorAlert";
import { useNavigate } from "react-router-dom";
import { useGlobalStore, sessionHistoryHelpers } from "@repo/store";
import { apiClient } from "../lib/api";
import { ROUTES } from "../router/index";
import type { SessionHistoryItem } from "@repo/types";

// Utility function for formatting dates
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

const CreateSessionPage: React.FC = () => {
  const [sessionName, setSessionName] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    sessionHistory,
    setCurrentUser,
    addToCreatedSessions,
    updateSessionLastVisited,
  } = useGlobalStore();

  const sessionsPerPage = 5;
  const totalPages = Math.ceil(
    sessionHistory.createdSessions.length / sessionsPerPage
  );
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const currentSessions = sessionHistory.createdSessions.slice(
    startIndex,
    startIndex + sessionsPerPage
  );

  const handleCreateSession = async () => {
    if (!sessionName.trim() || !userName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.createSession({
        name: sessionName,
        userName: userName,
      });

      // Update store with new session history
      const historyItem = sessionHistoryHelpers.createHistoryItem(
        response.sessionId,
        sessionName
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create New Session
            </h1>
            <p className="text-gray-600 mt-2">
              Start a new collaborative 3D workspace
            </p>
          </div>
        </div>

        {/* Error Display */}
        <ErrorAlert error={error} />

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Session Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                {/* Custom SVG for card header (kept as per user request) */}
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
                Session Details
              </h2>
              <p className="text-green-100 mt-1">
                Fill in the details to create your workspace
              </p>
            </div>
            <div className="p-8">
              <SessionForm
                userName={userName}
                setUserName={setUserName}
                sessionName={sessionName}
                setSessionName={setSessionName}
                isLoading={isLoading}
                onSubmit={handleCreateSession}
                submitLabel="Create Session"
              />
            </div>
          </div>

          {/* Session History */}
          <SessionHistoryCard
            title="My Created Sessions"
            subtitle="Sessions you've created and own"
            sessions={currentSessions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSessionClick={handleSessionClick}
            emptyIcon={<FileText className="w-6 h-6 text-gray-300 mr-3" />}
            emptyTitle="No sessions created yet"
            emptySubtitle="Create your first session to get started"
            formatLastVisited={formatLastVisited}
            sessionNameClass="group-hover:text-purple-700"
            sessionHoverClass="hover:border-purple-300 hover:bg-purple-50"
            paginationColorClass=""
          />
        </div>
      </div>
    </div>
  );
};

export default CreateSessionPage;
