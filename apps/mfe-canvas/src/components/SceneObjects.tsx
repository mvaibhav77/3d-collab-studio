import React from "react"; // Import React for RefObject
import Sphere from "../shapes/Sphere";
import Cylinder from "../shapes/Cylinder";
import Cone from "../shapes/Cone";
import Torus from "../shapes/Torus";
import type { SceneObject } from "@repo/types";
import type { Mesh, Group } from "@repo/three-wrapper"; // Import Group for the ref
import Cube from "../shapes/Cube";
import CustomModel from "../shapes/CustomModel";

interface SceneObjectsProps {
  objects: Record<string, SceneObject>;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  // FIX 1: Broaden the ref type to accept either a Mesh or a Group
  objectRefs: React.RefObject<{ [id: string]: Mesh | Group }>;
}

const ShapeComponents = {
  cube: Cube,
  sphere: Sphere,
  cylinder: Cylinder,
  cone: Cone,
  torus: Torus,
  customModel: CustomModel,
} as const;

export default function SceneObjects({
  objects,
  selectedObjectId,
  setSelectedObjectId,
  objectRefs,
}: SceneObjectsProps) {
  const renderShape = (id: string, obj: SceneObject): React.ReactNode => {
    const ShapeComponent =
      ShapeComponents[obj.type as keyof typeof ShapeComponents];

    if (!ShapeComponent) {
      console.warn(`Unknown shape type: ${obj.type}`);
      return null;
    }

    // Base props shared by all components
    const commonProps = {
      key: id,
      position: obj.position,
      scale: obj.scale,
      rotation: obj.rotation,
      isSelected: selectedObjectId === id,
      onSelect: () => {
        setSelectedObjectId(selectedObjectId === id ? null : obj.id);
      },
    };

    if (obj.type === "customModel" && obj.model) {
      // CustomModel expects id (string) and model
      return (
        <CustomModel
          {...commonProps}
          id={id}
          model={obj.model}
          ref={(el: Group | null) => {
            if (el) objectRefs.current[id] = el;
            else delete objectRefs.current[id];
          }}
        />
      );
    } else if (obj.type !== "customModel") {
      // Primitive shapes expect color and Mesh ref
      return (
        <ShapeComponent
          id={""}
          model={{
            appwriteId: "",
          }}
          {...commonProps}
          color={obj.color}
          ref={(el: Mesh | Group | null) => {
            if (el) objectRefs.current[id] = el;
            else delete objectRefs.current[id];
          }}
        />
      );
    }
    return null;
  };

  return (
    <>{Object.entries(objects).map(([id, obj]) => renderShape(id, obj))}</>
  );
}
