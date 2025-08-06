import { forwardRef } from "react";
import type { Mesh } from "@repo/three-wrapper";

interface CylinderProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Cylinder = forwardRef<Mesh, CylinderProps>(
  ({ position, rotation, scale, color, isSelected, onSelect }, ref) => {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onSelect}
      >
        <cylinderGeometry args={[1, 1, 2, 32]} />
        <meshStandardMaterial
          color={color}
          wireframe={isSelected}
          transparent={isSelected}
          opacity={isSelected ? 0.8 : 1}
        />
      </mesh>
    );
  },
);

Cylinder.displayName = "Cylinder";

export default Cylinder;
