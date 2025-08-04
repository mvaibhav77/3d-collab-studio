/**
 * Session Page Component
 * Main collaborative session interface
 */

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalStore } from "@repo/store";
import { apiClient } from "../lib/api";
import { logger } from "../lib/dev";

const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { setSessionState, setConnectionStatus, updateSessionLastVisited } =
    useGlobalStore();

  useEffect(() => {
    if (!sessionId) {
      logger.warn("SessionPage: No sessionId provided, redirecting to home");
      navigate("/", { replace: true });
      return;
    }

    const loadSession = async () => {
      try {
        logger.info("SessionPage: Loading session", sessionId);
        setConnectionStatus("connecting");

        const session = await apiClient.getSession(sessionId);

        if (!session) {
          logger.error("SessionPage: Session not found", sessionId);
          navigate("/", { replace: true });
          return;
        }

        setSessionState(session);
        setConnectionStatus("connected");
        updateSessionLastVisited(sessionId);

        logger.info("SessionPage: Session loaded successfully", session);
      } catch (error) {
        logger.error("SessionPage: Failed to load session", error);
        setConnectionStatus("disconnected");
        navigate("/", { replace: true });
      }
    };

    loadSession();
  }, [
    sessionId,
    navigate,
    setSessionState,
    setConnectionStatus,
    updateSessionLastVisited,
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
