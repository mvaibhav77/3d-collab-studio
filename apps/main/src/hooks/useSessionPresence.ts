import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useGlobalStore } from "@repo/store";
import type { SessionUser, CollaborativeSession } from "@repo/types";

/**
 * useSessionPresence
 * Keeps sessionUsers in sync with real-time socket events and emits join on connect.
 */
export function useSessionPresence() {
  const {
    setSessionUsers,
    setSessionState,
    sessionId,
    currentUserId,
    sessionUsers,
  } = useGlobalStore();

  // Emit join event on socket connect
  useEffect(() => {
    if (!sessionId || !currentUserId) return;
    const handleConnect = () => {
      const currentUser = sessionUsers.find((u) => u.id === currentUserId);
      const name = currentUser?.name || "Unknown";
      socket.emit("session:join", { sessionId, id: currentUserId, name });
    };
    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [sessionId, currentUserId, sessionUsers]);

  // Listen for participant and session state events
  useEffect(() => {
    const onUserJoined = (data: { users: SessionUser[] }) => {
      setSessionUsers(data.users);
    };
    const onUserLeft = (data: { userId: string; users: SessionUser[] }) => {
      setSessionUsers(data.users);
    };
    const onSessionState = (session: CollaborativeSession) => {
      setSessionState(session);
    };
    socket.on("session:user_joined", onUserJoined);
    socket.on("session:user_left", onUserLeft);
    socket.on("session:state", onSessionState);
    return () => {
      socket.off("session:user_joined", onUserJoined);
      socket.off("session:user_left", onUserLeft);
      socket.off("session:state", onSessionState);
    };
  }, [setSessionUsers, setSessionState]);
}
