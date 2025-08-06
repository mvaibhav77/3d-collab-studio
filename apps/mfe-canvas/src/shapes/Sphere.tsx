import { forwardRef } from "react";
import type { Mesh } from "@repo/three-wrapper";

interface SphereProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Sphere = forwardRef<Mesh, SphereProps>(
  ({ position, rotation, scale, color, isSelected, onSelect }, ref) => {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={onSelect}
      >
        <sphereGeometry args={[1, 32, 32]} />
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

Sphere.displayName = "Sphere";

export default Sphere;
