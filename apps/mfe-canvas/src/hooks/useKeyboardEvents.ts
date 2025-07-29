import { useEffect } from "react";
import { socket } from "../socket";

interface UseKeyboardEventsProps {
  selectedObjectId: string | null;
}

export const useKeyboardEvents = ({
  selectedObjectId,
}: UseKeyboardEventsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" && selectedObjectId) {
        // Emit the remove event to the server
        socket.emit("object:remove", { id: selectedObjectId });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedObjectId]);
};
