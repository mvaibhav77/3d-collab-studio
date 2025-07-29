import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { TransformControls, OrbitControls } from "@react-three/drei";
import { socket } from "./socket";
import { nanoid } from "nanoid";
import type { SceneObject } from "./types";
import Box from "./shapes/Box";
import DragDropCanvas from "./components/CanvasWrapper";
import type { Mesh } from "@repo/three-wrapper";

export default function Scene() {
  // State to hold all objects in the scene
  const objectRefs = useRef<{ [id: string]: Mesh }>({});
  const [objects, setObjects] = useState<{ [id: string]: SceneObject }>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);

  // Socket Listener Setup
  useEffect(() => {
    const onColorChange = (data: { id: string; color: string }) => {
      setObjects((prevObjects) => ({
        ...prevObjects,
        [data.id]: { ...prevObjects[data.id], color: data.color },
      }));
    };

    const onPositionChange = (data: {
      id: string;
      position: [number, number, number];
    }) => {
      setObjects((prevObjects) => {
        // Only update if this object isn't currently being transformed by us
        const currentSelected = selected;
        if (currentSelected !== data.id) {
          // Also update the mesh position directly for smoother real-time updates
          const mesh = objectRefs.current[data.id];
          if (mesh) {
            mesh.position.set(
              data.position[0],
              data.position[1],
              data.position[2]
            );
          }

          return {
            ...prevObjects,
            [data.id]: { ...prevObjects[data.id], position: data.position },
          };
        }
        return prevObjects;
      });
    };

    const onAddObject = (objectData: SceneObject) => {
      setObjects((prevObjects) => ({
        ...prevObjects,
        [objectData.id]: objectData,
      }));
    };

    socket.on("object:color_change", onColorChange);
    socket.on("object:position_change", onPositionChange);
    socket.on("scene:add_object", onAddObject);

    return () => {
      socket.off("object:color_change", onColorChange);
      socket.off("object:position_change", onPositionChange);
      socket.off("scene:add_object", onAddObject);
    };
  }, [selected]);

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
        color: "purple",
      };

      // Add to local state immediately
      setObjects((prevObjects) => ({
        ...prevObjects,
        [newObject.id]: newObject,
      }));

      // Emit to server
      socket.emit("scene:add_object", newObject);
    }
  };

  return (
    <DragDropCanvas onObjectDrop={handleObjectDrop}>
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
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
            color={obj.color}
            isSelected={selected === id}
            onSelect={() => {
              console.log("Selected object:", obj);
              setSelected(selected === id ? null : obj.id); // Toggle selection
            }}
          />
        ))}

        {selected && objectRefs.current[selected] && (
          <TransformControls
            object={objectRefs.current[selected]}
            mode="translate"
            onMouseDown={() => setIsTransforming(true)}
            onMouseUp={() => setIsTransforming(false)}
            onObjectChange={() => {
              // Update local state when object is transformed
              const mesh = objectRefs.current[selected];
              if (mesh && selected) {
                const newPosition: [number, number, number] = [
                  mesh.position.x,
                  mesh.position.y,
                  mesh.position.z,
                ];

                setObjects((prevObjects) => ({
                  ...prevObjects,
                  [selected]: {
                    ...prevObjects[selected],
                    position: newPosition,
                  },
                }));

                // Emit to server for real-time collaboration
                socket.emit("object:position_change", {
                  id: selected,
                  position: newPosition,
                });
              }
            }}
          />
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enabled={!isTransforming}
          makeDefault
        />
      </Canvas>
    </DragDropCanvas>
  );
}
