import { useEffect } from "react";
import { socket } from "../socket";
import { useGlobalStore } from "@repo/store";

interface UseKeyboardEventsProps {
  selectedObjectId: string | null;
}

export const useKeyboardEvents = ({
  selectedObjectId,
}: UseKeyboardEventsProps) => {
  const sessionId = useGlobalStore((state) => state.sessionId);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && selectedObjectId && sessionId) {
        socket.emit("object:remove", { id: selectedObjectId, sessionId });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObjectId, sessionId]);
};
