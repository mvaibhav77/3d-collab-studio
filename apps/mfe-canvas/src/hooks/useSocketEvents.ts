import { useEffect } from "react";
import { socket } from "../socket";
import type { SceneObject, TransformChangeData } from "@repo/types";
import type { Mesh } from "@repo/three-wrapper";

interface UseSocketEventsProps {
  selectedObjectId: string | null;
  objectRefs: React.RefObject<{ [id: string]: Mesh }>;
  addObject: (object: SceneObject) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
}

export const useSocketEvents = ({
  selectedObjectId,
  objectRefs,
  addObject,
  updateObject,
  removeObject,
}: UseSocketEventsProps) => {
  useEffect(() => {
    const onColorChange = (data: { id: string; color: string }) => {
      updateObject(data.id, { color: data.color });
    };

    const onTransformChange = (data: TransformChangeData) => {
      // Only apply changes if it's not the currently selected object (avoid conflicts)
      if (selectedObjectId !== data.id) {
        const mesh = objectRefs.current[data.id];
        if (mesh) {
          mesh.position.set(...data.position);
          mesh.rotation.set(...data.rotation);
          mesh.scale.set(...data.scale);
        }
        updateObject(data.id, {
          position: data.position,
          rotation: data.rotation,
          scale: data.scale,
        });
      }
    };

    const onRemoveObject = (data: { id: string }) => {
      removeObject(data.id);
    };

    const onAddObject = (objectData: SceneObject) => {
      addObject(objectData);
    };

    // Register event listeners
    socket.on("object:color_change", onColorChange);
    socket.on("object:transform_change", onTransformChange);
    socket.on("scene:add_object", onAddObject);
    socket.on("object:remove", onRemoveObject);

    // Cleanup function
    return () => {
      socket.off("object:color_change", onColorChange);
      socket.off("object:transform_change", onTransformChange);
      socket.off("scene:add_object", onAddObject);
      socket.off("object:remove", onRemoveObject);
    };
  }, [selectedObjectId, addObject, updateObject, removeObject, objectRefs]);
};
