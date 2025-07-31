import Box from "../shapes/Box";
import Sphere from "../shapes/Sphere";
import Cylinder from "../shapes/Cylinder";
import Cone from "../shapes/Cone";
import Torus from "../shapes/Torus";
import type { SceneObject, ShapeType } from "@repo/types";
import type { Mesh } from "@repo/three-wrapper";

interface SceneObjectsProps {
  objects: Record<string, SceneObject>;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  objectRefs: React.RefObject<{ [id: string]: Mesh }>;
}

const ShapeComponents = {
  box: Box,
  sphere: Sphere,
  cylinder: Cylinder,
  cone: Cone,
  torus: Torus,
} as const;

export default function SceneObjects({
  objects,
  selectedObjectId,
  setSelectedObjectId,
  objectRefs,
}: SceneObjectsProps) {
  const renderShape = (id: string, obj: SceneObject) => {
    const ShapeComponent = ShapeComponents[obj.type as ShapeType];

    if (!ShapeComponent) {
      console.warn(`Unknown shape type: ${obj.type}`);
      return null;
    }

    const commonProps = {
      key: id,
      ref: (mesh: Mesh | null) => {
        if (mesh) {
          objectRefs.current[id] = mesh;
        } else {
          delete objectRefs.current[id];
        }
      },
      position: obj.position,
      scale: obj.scale,
      rotation: obj.rotation,
      color: obj.color,
      isSelected: selectedObjectId === id,
      onSelect: () => {
        console.log("Selected object:", obj);
        setSelectedObjectId(selectedObjectId === id ? null : obj.id);
      },
    };

    return <ShapeComponent {...commonProps} />;
  };

  return (
    <>{Object.entries(objects).map(([id, obj]) => renderShape(id, obj))}</>
  );
}
