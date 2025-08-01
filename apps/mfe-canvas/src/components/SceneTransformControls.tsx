import { TransformControls } from "@react-three/drei";
import { socket } from "../socket";
import type { TransformChangeData, SceneObject } from "@repo/types";
import type { Mesh } from "@repo/three-wrapper";

interface SceneTransformControlsProps {
  selectedObjectId: string | null;
  objectRefs: React.RefObject<{ [id: string]: Mesh }>;
  transformMode: "translate" | "rotate" | "scale";
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  setIsTransforming: (isTransforming: boolean) => void;
}

export default function SceneTransformControls({
  selectedObjectId,
  objectRefs,
  transformMode,
  updateObject,
  setIsTransforming,
}: SceneTransformControlsProps) {
  if (!selectedObjectId || !objectRefs.current[selectedObjectId]) {
    return null;
  }

  const handleObjectChange = () => {
    const mesh = objectRefs.current[selectedObjectId];
    if (mesh) {
      const transformData: TransformChangeData = {
        id: selectedObjectId,
        position: mesh.position.toArray() as [number, number, number],
        rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
        scale: mesh.scale.toArray() as [number, number, number],
      };

      // Update local state first
      updateObject(transformData.id, transformData);
      // Emit the new generic event to the server
      socket.emit("object:transform_change", transformData);
    }
  };

  return (
    <TransformControls
      object={objectRefs.current[selectedObjectId]}
      mode={transformMode}
      onMouseUp={() => setIsTransforming(false)}
      onMouseDown={() => setIsTransforming(true)}
      onObjectChange={handleObjectChange}
    />
  );
}
