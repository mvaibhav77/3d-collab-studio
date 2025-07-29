import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { socket } from "./socket";
import { nanoid } from "nanoid";
import type { SceneObject } from "./types";
import Box from "./shapes/Box";
import DragDropCanvas from "./components/CanvasWrapper";

export default function Scene() {
  // State to hold all objects in the scene
  const [objects, setObjects] = useState<{ [id: string]: SceneObject }>({
    "box-1": {
      id: "box-1",
      type: "cube",
      position: [0, 0, 0],
      color: "orange",
    },
  });

  // Socket Listener Setup
  useEffect(() => {
    const onColorChange = (data: { id: string; color: string }) => {
      setObjects((prevObjects) => ({
        ...prevObjects,
        [data.id]: { ...prevObjects[data.id], color: data.color },
      }));
    };

    const onAddObject = (objectData: SceneObject) => {
      setObjects((prevObjects) => ({
        ...prevObjects,
        [objectData.id]: objectData,
      }));
    };

    socket.on("object:color_change", onColorChange);
    socket.on("scene:add_object", onAddObject);

    return () => {
      socket.off("object:color_change", onColorChange);
      socket.off("scene:add_object", onAddObject);
    };
  }, []);

  // This function handles a local click on the box.
  const handleBoxClick = (id: string) => {
    const currentObject = objects[id];
    const newColor = currentObject.color === "orange" ? "hotpink" : "orange";

    const updatedObject = {
      ...currentObject,
      color: newColor,
    };

    // Update the local state immediately for a responsive feel.
    setObjects((prevObjects) => ({
      ...prevObjects,
      [id]: updatedObject,
    }));

    // Emit the change to the server to notify other clients.
    socket.emit("object:color_change", { id, color: newColor });
  };

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
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* This is our invisible ground plane to catch clicks */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]} // Rotate it to be flat
          position={[0, -2, 0]} // Position it slightly below the center
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="white" visible={false} />
        </mesh>

        {Object.entries(objects).map(([id, obj]) => (
          <Box
            key={id}
            position={obj.position}
            color={obj.color}
            onClick={() => handleBoxClick(id)}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </DragDropCanvas>
  );
}
