import { useCallback } from "react";
import { nanoid } from "nanoid";
import { socket } from "../socket";
import { useGlobalStore } from "@repo/store";
import type { CustomModel, SceneObject, ShapeType } from "@repo/types";

interface UseObjectCreationProps {
  addObject: (object: SceneObject) => void;
}

export const useObjectCreation = ({ addObject }: UseObjectCreationProps) => {
  const sessionId = useGlobalStore((state) => state.sessionId);
  const handleObjectDrop = useCallback(
    (data: string, worldPosition: [number, number, number]) => {
      let newObject: SceneObject | null = null;

      // Check if the data is JSON (for custom models) or plain text (for shapes)
      try {
        const parsedData = JSON.parse(data);
        console.log("Tryintg to parse data:", parsedData);
        if (parsedData.type === "customModel") {
          newObject = {
            id: nanoid(),
            type: "customModel",
            position: worldPosition,
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: "#ffffff",
            model: parsedData.model as CustomModel,
            loading: true,
          };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_err) {
        // If JSON.parse fails, it's a primitive shape (plain text)
        console.log("Creating shape from data:", data);
        const objectType = data as ShapeType;
        newObject = {
          id: nanoid(),
          type: objectType,
          position: worldPosition,
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          color: getDefaultColorForShape(objectType),
        };
      }

      if (newObject) {
        addObject(newObject);
        if (sessionId) {
          socket.emit("scene:add_object", { ...newObject, sessionId });
        }
      }
    },
    [addObject, sessionId]
  );
  return { handleObjectDrop };
};

// Helper function to get default colors for different shapes
function getDefaultColorForShape(shapeType: ShapeType): string {
  const defaultColors: Record<ShapeType, string> = {
    cube: "#8b5cf6",
    sphere: "#ef4444",
    cylinder: "#3b82f6",
    cone: "#f59e0b",
    torus: "#10b981",
    customModel: "#ffffff", // Default color, though not directly used
  };

  return defaultColors[shapeType] || "#8b5cf6";
}
