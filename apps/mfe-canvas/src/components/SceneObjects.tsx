import Box from "../shapes/Box";
import type { SceneObject } from "@repo/types";
import type { Mesh } from "@repo/three-wrapper";

interface SceneObjectsProps {
  objects: Record<string, SceneObject>;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  objectRefs: React.MutableRefObject<{ [id: string]: Mesh }>;
}

export default function SceneObjects({
  objects,
  selectedObjectId,
  setSelectedObjectId,
  objectRefs,
}: SceneObjectsProps) {
  return (
    <>
      {Object.entries(objects).map(([id, obj]) => (
        <Box
          key={id}
          ref={(mesh) => {
            if (mesh) {
              objectRefs.current[id] = mesh;
            } else {
              delete objectRefs.current[id];
            }
          }}
          position={obj.position}
          scale={obj.scale}
          rotation={obj.rotation}
          color={obj.color}
          isSelected={selectedObjectId === id}
          onSelect={() => {
            console.log("Selected object:", obj);
            setSelectedObjectId(selectedObjectId === id ? null : obj.id);
          }}
        />
      ))}
    </>
  );
}
