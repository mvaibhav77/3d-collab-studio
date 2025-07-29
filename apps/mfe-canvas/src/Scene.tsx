import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { socket } from "./socket";
import type { Mesh } from "@repo/three-wrapper";

// The Box component is now simpler. It receives its color and click handler as props.
function Box(props: {
  position: [number, number, number];
  color: string;
  onClick: () => void;
}) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={hovered ? 1.1 : 1}
      onClick={props.onClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

// The Scene component now manages the state and socket events.
export default function Scene() {
  // State to hold all objects in the scene. For now, just our one box.
  const [objects, setObjects] = useState<{ [id: string]: { color: string } }>({
    "box-1": { color: "orange" },
  });

  // This effect runs once to set up the socket listener.
  useEffect(() => {
    // The handler function to update state when an event is received.
    const onColorChange = (data: { id: string; color: string }) => {
      setObjects((prevObjects) => ({
        ...prevObjects,
        [data.id]: { color: data.color },
      }));
    };

    // Listen for events from the server.
    socket.on("object:color_change", onColorChange);

    // Clean up the listener when the component unmounts.
    return () => {
      socket.off("object:color_change", onColorChange);
    };
  }, []);

  // This function handles a local click on the box.
  const handleBoxClick = (id: string) => {
    const newColor = objects[id].color === "orange" ? "hotpink" : "orange";
    const updatedObject = { id, color: newColor };

    // 1. Update the local state immediately for a responsive feel.
    setObjects((prevObjects) => ({
      ...prevObjects,
      [id]: { color: newColor },
    }));

    // 2. Emit the change to the server to notify other clients.
    socket.emit("object:color_change", updatedObject);
  };

  return (
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {Object.entries(objects).map(([id, props]) => (
        <Box
          key={id}
          position={[0, 0, 0]}
          color={props.color}
          onClick={() => handleBoxClick(id)}
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
}
