import { forwardRef } from "react";
import type { Mesh } from "@repo/three-wrapper";

const Cube = forwardRef<
  Mesh,
  {
    position: [number, number, number];
    color: string;
    rotation: [number, number, number];
    scale: [number, number, number];
    onSelect: () => void;
    isSelected?: boolean;
  }
>((props, ref) => {
  return (
    <mesh
      ref={ref}
      position={props.position}
      rotation={props.rotation}
      scale={props.scale}
      onClick={props.onSelect}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={props.color} wireframe={props.isSelected} />
    </mesh>
  );
});

Cube.displayName = "Cube";

export default Cube;
