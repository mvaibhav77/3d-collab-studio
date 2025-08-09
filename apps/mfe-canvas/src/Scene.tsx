import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import type { Mesh } from "@repo/three-wrapper";
import { useGlobalStore } from "@repo/store";

// Components
import DragDropCanvas from "./components/CanvasWrapper";
import FreeRoamControls from "./components/FreeRoamControls";
import SceneEnvironment from "./components/SceneEnvironment";
import SceneObjects from "./components/SceneObjects";
import SceneTransformControls from "./components/SceneTransformControls";

// Hooks
import { useSocketEvents } from "./hooks/useSocketEvents";
import { useKeyboardEvents } from "./hooks/useKeyboardEvents";
import { useObjectCreation } from "./hooks/useObjectCreation";

export default function Scene() {
  const objectRefs = useRef<{ [id: string]: Mesh }>({});
  const [isTransforming, setIsTransforming] = useState(false);

  const {
    objects,
    addObject,
    updateObject,
    removeObject,
    selectedObjectId,
    setSelectedObjectId,
    transformMode,
    setObjects,
    sceneData,
  } = useGlobalStore();

  // Hydrate canvas state from sceneData on mount or when sceneData changes
  useEffect(() => {
    if (sceneData) {
      // Removed console.log for production cleanup
      setObjects(
        sceneData as { [id: string]: import("@repo/types").SceneObject }
      );
    }
  }, [sceneData, setObjects]);

  // Socket event handling
  useSocketEvents({
    selectedObjectId,
    objectRefs,
    addObject,
    updateObject,
    removeObject,
  });

  // Keyboard event handling
  useKeyboardEvents({ selectedObjectId });

  const { handleObjectDrop } = useObjectCreation({ addObject });

  return (
    <DragDropCanvas onObjectDrop={handleObjectDrop}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        onPointerMissed={() => setSelectedObjectId(null)}
      >
        <SceneEnvironment />

        <SceneObjects
          objects={objects}
          selectedObjectId={selectedObjectId}
          setSelectedObjectId={setSelectedObjectId}
          objectRefs={objectRefs}
        />

        <SceneTransformControls
          selectedObjectId={selectedObjectId}
          objectRefs={objectRefs}
          transformMode={transformMode}
          updateObject={updateObject}
          setIsTransforming={setIsTransforming}
        />

        <FreeRoamControls
          enabled={!isTransforming}
          rotateSpeed={1.5}
          zoomSpeed={2}
          dampingFactor={0.1}
          target={
            selectedObjectId && objects[selectedObjectId]
              ? objects[selectedObjectId].position
              : [0, 0, 0]
          }
        />
      </Canvas>
    </DragDropCanvas>
  );
}
