// apps/mfe-canvas/src/Scene.tsx

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Mesh } from "three";

// This component represents our single spinning box
function Box() {
  // useRef gives us a direct reference to the mesh object
  const meshRef = useRef<Mesh>(null!);

  // useFrame runs on every rendered frame
  useFrame((state, delta) => {
    // Animate the rotation on the x and y axes
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;
  });

  return (
    // This is the object itself
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} /> {/* The Shape */}
      <meshStandardMaterial color={"orange"} /> {/* The Skin */}
    </mesh>
  );
}

// This is the main component we will export
export default function Scene() {
  return (
    <div style={{ width: "100%", height: "500px", background: "#222" }}>
      <Canvas>
        {/* Ambient light provides soft, even lighting to the whole scene */}
        <ambientLight intensity={Math.PI / 2} />
        {/* Directional light is like a sun, casting shadows */}
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* Our spinning box component */}
        <Box />
        {/* This helper lets you control the camera with your mouse */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
