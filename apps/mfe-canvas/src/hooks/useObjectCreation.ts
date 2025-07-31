import { useCallback } from "react";
import { nanoid } from "nanoid";
import { socket } from "../socket";
import type { SceneObject, ShapeType } from "@repo/types";

interface UseObjectCreationProps {
  addObject: (object: SceneObject) => void;
}

export const useObjectCreation = ({ addObject }: UseObjectCreationProps) => {
  const handleObjectDrop = useCallback(
    (objectType: string, worldPosition: [number, number, number]) => {
      const newObject: SceneObject = {
        id: nanoid(),
        type: objectType as ShapeType,
        position: worldPosition,
        rotation: [0, 0, 0], // Start with no rotation
        scale: [1, 1, 1],
        color: getDefaultColorForShape(objectType as ShapeType),
      };

      // Add to local state immediately
      addObject(newObject);

      // Emit to server
      socket.emit("scene:add_object", newObject);
    },
    [addObject]
  );

  return { handleObjectDrop };
};

// Helper function to get default colors for different shapes
function getDefaultColorForShape(shapeType: ShapeType): string {
  const defaultColors: Record<ShapeType, string> = {
    box: "#8b5cf6", // purple
    sphere: "#ef4444", // red
    cylinder: "#3b82f6", // blue
    cone: "#f59e0b", // amber
    torus: "#10b981", // emerald
  };

  return defaultColors[shapeType] || "#8b5cf6";
}
