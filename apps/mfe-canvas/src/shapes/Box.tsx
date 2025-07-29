import { forwardRef } from "react";
import type { Mesh } from "@repo/three-wrapper";

// The Box component is now simpler. It receives its color and click handler as props.
const Box = forwardRef<
  Mesh,
  {
    position: [number, number, number];
    color: string;
    onSelect: () => void;
    isSelected?: boolean;
  }
>((props, ref) => {
  return (
    <mesh {...props} ref={ref} onClick={props.onSelect}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={props.color} wireframe={props.isSelected} />
    </mesh>
  );
});

Box.displayName = "Box";

export default Box;
