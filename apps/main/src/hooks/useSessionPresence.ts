import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useGlobalStore } from "@repo/store";
import type { SessionUser, CollaborativeSession } from "@repo/types";
import { logger } from "../lib/dev";

export function useSessionPresence() {
  const {
    setSessionUsers,
    setSessionState,
    currentUserId,
    currentUserName,
    sessionId,
  } = useGlobalStore();

  useEffect(() => {
    if (!sessionId) return;

    let didEmit = false;

    const emitJoin = () => {
      if (!didEmit) {
        socket.emit("session:join", {
          sessionId,
          id: currentUserId,
          name: currentUserName,
        });
        logger.info("Emitted session:join", {
          sessionId,
          id: currentUserId,
          name: currentUserName,
        });
        didEmit = true;
      }
    };

    if (socket.connected) {
      emitJoin();
    } else {
      socket.once("connect", emitJoin);
    }

    // Clean up the listener on unmount or session change
    return () => {
      socket.off("connect", emitJoin);
    };
  }, [sessionId, currentUserName]);

  // Listen for participant and session state events
  useEffect(() => {
    const onUserJoined = (data: { users: SessionUser[] }) => {
      // Ensure current user is always in the list
      let users = data.users;
      if (
        currentUserId &&
        currentUserName &&
        !users.some((u) => u.id === currentUserId)
      ) {
        users = [...users, { id: currentUserId, name: currentUserName }];
      }
      setSessionUsers(users);
      console.log("[session:user_joined] received", users);
    };
    const onUserLeft = (data: { userId: string; users: SessionUser[] }) => {
      setSessionUsers(data.users);
      console.log("[session:user_left] received", data.users);
    };
    const onSessionState = (session: CollaborativeSession) => {
      setSessionState(session);
      console.log("[session:state] received", session);
    };
    socket.on("session:user_joined", onUserJoined);
    socket.on("session:user_left", onUserLeft);
    socket.on("session:state", onSessionState);
    return () => {
      socket.off("session:user_joined", onUserJoined);
      socket.off("session:user_left", onUserLeft);
      socket.off("session:state", onSessionState);
    };
  }, [setSessionUsers, setSessionState, currentUserId, currentUserName]);
}
