import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { socket } from "./socket";
import { nanoid } from "nanoid";
import type { SceneObject, TransformChangeData } from "@repo/types";
import Box from "./shapes/Box";
import DragDropCanvas from "./components/CanvasWrapper";
import FreeRoamControls from "./components/FreeRoamControls";
import type { Mesh } from "@repo/three-wrapper";
import { useGlobalStore } from "@repo/store";

export default function Scene() {
  // State to hold all objects in the scene
  const objectRefs = useRef<{ [id: string]: Mesh }>({});
  const {
    objects,
    addObject,
    updateObject,
    selectedObjectId,
    setSelectedObjectId,
    transformMode,
  } = useGlobalStore();
  const [isTransforming, setIsTransforming] = useState(false);

  // Socket Listener Setup
  useEffect(() => {
    const onColorChange = (data: { id: string; color: string }) => {
      updateObject(data.id, { color: data.color });
    };

    const onTransformChange = (data: TransformChangeData) => {
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

    const onAddObject = (objectData: SceneObject) => {
      addObject(objectData);
    };

    socket.on("object:color_change", onColorChange);
    socket.on("object:transform_change", onTransformChange);
    socket.on("scene:add_object", onAddObject);

    return () => {
      socket.off("object:color_change", onColorChange);
      socket.off("object:transform_change", onTransformChange);
      socket.off("scene:add_object", onAddObject);
    };
  }, [selectedObjectId, addObject, updateObject]);

  // Handle drag and drop from external elements
  const handleObjectDrop = (
    objectType: string,
    worldPosition: [number, number, number]
  ) => {
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
  };

  return (
    <DragDropCanvas onObjectDrop={handleObjectDrop}>
      <Canvas
        camera={{ position: [10, 10, 10], fov: 50 }}
        onPointerMissed={() => setSelectedObjectId(null)}
      >
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Ground plane for visual reference */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#f0f0f0" transparent opacity={0.3} />
        </mesh>

        {/* Grid helper for better spatial awareness */}
        <gridHelper args={[50, 50, "#cccccc", "#eeeeee"]} />

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
              setSelectedObjectId(selectedObjectId === id ? null : obj.id); // Toggle selection
            }}
          />
        ))}

        {selectedObjectId && objectRefs.current[selectedObjectId] && (
          <TransformControls
            object={objectRefs.current[selectedObjectId]}
            mode={transformMode} // Use mode from the store
            onMouseUp={() => setIsTransforming(false)}
            onMouseDown={() => setIsTransforming(true)}
            onObjectChange={() => {
              const mesh = objectRefs.current[selectedObjectId!];
              if (mesh) {
                const transformData: TransformChangeData = {
                  id: selectedObjectId!,
                  position: mesh.position.toArray() as [number, number, number],
                  rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
                  scale: mesh.scale.toArray() as [number, number, number],
                };

                // Update local state first
                updateObject(transformData.id, transformData);
                // Emit the new generic event to the server
                socket.emit("object:transform_change", transformData);
              }
            }}
          />
        )}

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
