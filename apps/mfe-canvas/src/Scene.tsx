import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Mesh } from "@repo/three-wrapper";

function Box() {
  // ... (Box component code remains the same)
  const meshRef = useRef<Mesh>(null!);
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.y += delta;
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
}

// Add a wrapper div with proper dimensions so the Canvas is visible
export default function Scene() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas>
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Box />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
