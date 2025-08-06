/**
 * Session Page Component
 * Main collaborative session interface
 */

import React, { useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalStore } from "@repo/store";
import { apiClient } from "../lib/api";
import { ROUTES } from "../router/index";
import { logger } from "../lib/dev";
import type { SessionUser } from "@repo/types";

const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const {
    sessionHistory,
    setSessionState,
    setConnectionStatus,
    updateSessionLastVisited,
    setCurrentUser,
  } = useGlobalStore();

  // Memoize session IDs for stable dependencies
  const createdSessionIds = useMemo(
    () => sessionHistory.createdSessions.map((s) => s.id).join(","),
    [sessionHistory.createdSessions],
  );
  const joinedSessionIds = useMemo(
    () => sessionHistory.joinedSessions.map((s) => s.id).join(","),
    [sessionHistory.joinedSessions],
  );

  const loadSession = useCallback(
    async (sessionId: string) => {
      try {
        logger.info("SessionPage: Loading session", sessionId);
        setConnectionStatus("connecting");

        const session = await apiClient.getSession(sessionId);

        if (!session) {
          logger.error("SessionPage: Session not found", sessionId);
          // If session doesn't exist, redirect to join page with error context
          navigate(ROUTES.JOIN_SESSION(sessionId), { replace: true });
          return;
        }

        setSessionState(session);
        setConnectionStatus("connected");
        updateSessionLastVisited(sessionId);

        logger.info("SessionPage: Session loaded successfully", session);
      } catch (error) {
        logger.error("SessionPage: Failed to load session", error);
        setConnectionStatus("disconnected");
        // On error, redirect to join page instead of home
        navigate(ROUTES.JOIN_SESSION(sessionId), { replace: true });
      }
    },
    [setConnectionStatus, setSessionState, updateSessionLastVisited, navigate],
  );

  useEffect(() => {
    if (!sessionId) {
      logger.warn("SessionPage: No sessionId provided, redirecting to home");
      navigate("/", { replace: true });
      return;
    }

    // Check if user has access to this session (is in created or joined sessions)
    const hasAccess =
      createdSessionIds.split(",").includes(sessionId) ||
      joinedSessionIds.split(",").includes(sessionId);

    if (!hasAccess) {
      logger.info(
        "SessionPage: User has no access to session, redirecting to join page",
        sessionId,
      );
      navigate(ROUTES.JOIN_SESSION(sessionId), { replace: true });
      return;
    }

    const currentSession =
      sessionHistory.createdSessions.find((s) => s.id === sessionId) ||
      sessionHistory.joinedSessions.find((s) => s.id === sessionId);

    setCurrentUser(currentSession?.user as SessionUser);

    loadSession(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionId,
    navigate,
    createdSessionIds,
    joinedSessionIds,
    setSessionState,
    setConnectionStatus,
    updateSessionLastVisited,
    loadSession,
  ]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Session overlay content can go here */}
      {/* The actual 3D canvas and toolbar are rendered by SessionLayout */}
    </div>
  );
};

export default SessionPage;
