import { forwardRef } from "react";
import type { Mesh } from "@repo/three-wrapper";

interface ConeProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Cone = forwardRef<Mesh, ConeProps>(
  ({ position, rotation, scale, color, isSelected, onSelect }, ref) => {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onSelect}
      >
        <coneGeometry args={[1, 2, 32]} />
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

Cone.displayName = "Cone";

export default Cone;
