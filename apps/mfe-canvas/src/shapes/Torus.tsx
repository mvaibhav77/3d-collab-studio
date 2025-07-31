import { forwardRef } from "react";
import type { Mesh } from "@repo/three-wrapper";

interface TorusProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Torus = forwardRef<Mesh, TorusProps>(
  ({ position, rotation, scale, color, isSelected, onSelect }, ref) => {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onSelect}
      >
        <torusGeometry args={[1, 0.4, 16, 100]} />
        <meshStandardMaterial
          color={color}
          wireframe={isSelected}
          transparent={isSelected}
          opacity={isSelected ? 0.8 : 1}
        />
      </mesh>
    );
  }
);

Torus.displayName = "Torus";

export default Torus;
