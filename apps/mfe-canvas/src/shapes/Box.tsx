import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "@repo/three-wrapper";

// The Box component is now simpler. It receives its color and click handler as props.
export default function Box(props: {
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
