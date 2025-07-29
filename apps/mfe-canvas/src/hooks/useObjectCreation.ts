import { useCallback } from "react";
import { nanoid } from "nanoid";
import { socket } from "../socket";
import type { SceneObject } from "@repo/types";

interface UseObjectCreationProps {
  addObject: (object: SceneObject) => void;
}

export const useObjectCreation = ({ addObject }: UseObjectCreationProps) => {
  const handleObjectDrop = useCallback(
    (objectType: string, worldPosition: [number, number, number]) => {
      if (objectType === "cube") {
        const newObject: SceneObject = {
          id: nanoid(),
          type: "cube",
          position: worldPosition,
          rotation: [1, 1, 1],
          scale: [1, 1, 1],
          color: "purple",
        };

        // Add to local state immediately
        addObject(newObject);

        // Emit to server
        socket.emit("scene:add_object", newObject);
      }
    },
    [addObject]
  );

  return { handleObjectDrop };
};
