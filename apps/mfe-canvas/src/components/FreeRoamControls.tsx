import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Spherical, Vector3 } from "@repo/three-wrapper";

interface FreeRoamControlsProps {
  enabled?: boolean;
  rotateSpeed?: number;
  zoomSpeed?: number;
  dampingFactor?: number;
  target?: [number, number, number];
}

export default function FreeRoamControls({
  enabled = true,
  rotateSpeed = 0.5,
  zoomSpeed = 1,
  dampingFactor = 0.05,
  target: targetProp = [0, 0, 0],
}: FreeRoamControlsProps) {
  const { camera, gl } = useThree();
  const spherical = useRef(new Spherical());
  const target = useRef(new Vector3(0, 0, 0));
  const previousTarget = useRef(new Vector3(0, 0, 0));
  const isMouseDown = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  // Update target when targetProp changes
  useEffect(() => {
    const newTarget = new Vector3(...targetProp);

    // If target changed, smoothly transition
    if (!target.current.equals(newTarget)) {
      previousTarget.current.copy(target.current);
      target.current.copy(newTarget);

      // Recalculate spherical coordinates relative to new target
      const vector = new Vector3();
      vector.subVectors(camera.position, target.current);
      spherical.current.setFromVector3(vector);

      // Ensure minimum distance to new target
      if (spherical.current.radius < 3) {
        spherical.current.radius = 8;
      }
    }
  }, [targetProp, camera.position]);

  // Initialize spherical coordinates from camera position
  useEffect(() => {
    const vector = new Vector3();
    vector.subVectors(camera.position, target.current);
    spherical.current.setFromVector3(vector);
  }, [camera]);

  useEffect(() => {
    if (!enabled) return;

    const domElement = gl.domElement;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left mouse button
        isMouseDown.current = true;
        lastMouse.current = { x: event.clientX, y: event.clientY };
        domElement.style.cursor = "grabbing";
      }
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
      domElement.style.cursor = "grab";
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isMouseDown.current) return;

      const deltaX = event.clientX - lastMouse.current.x;
      const deltaY = event.clientY - lastMouse.current.y;

      // Update spherical coordinates for rotation (only Y inverted for more intuitive feel)
      spherical.current.theta -= deltaX * rotateSpeed * 0.01; // Normal X (left/right)
      spherical.current.phi -= deltaY * rotateSpeed * 0.01; // Inverted Y (up/down)

      // Constrain phi to prevent camera flipping
      spherical.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, spherical.current.phi)
      );

      lastMouse.current = { x: event.clientX, y: event.clientY };
    };

    const onWheel = (event: WheelEvent) => {
      // event.preventDefault();

      // Zoom in/out by changing the radius
      spherical.current.radius += event.deltaY * zoomSpeed * 0.01;
      spherical.current.radius = Math.max(
        1,
        Math.min(100, spherical.current.radius)
      );
    };

    const onMouseEnter = () => {
      domElement.style.cursor = "grab";
    };

    const onMouseLeave = () => {
      isMouseDown.current = false;
      domElement.style.cursor = "default";
    };

    // Add event listeners
    domElement.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    domElement.addEventListener("wheel", onWheel, { passive: true });
    domElement.addEventListener("mouseenter", onMouseEnter);
    domElement.addEventListener("mouseleave", onMouseLeave);

    // Set initial cursor
    domElement.style.cursor = "grab";

    return () => {
      domElement.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      domElement.removeEventListener("wheel", onWheel);
      domElement.removeEventListener("mouseenter", onMouseEnter);
      domElement.removeEventListener("mouseleave", onMouseLeave);
      domElement.style.cursor = "default";
    };
  }, [enabled, camera, gl.domElement, rotateSpeed, zoomSpeed]);

  useFrame(() => {
    if (!enabled) return;

    // Update camera position based on spherical coordinates
    const position = new Vector3();
    position.setFromSpherical(spherical.current);
    position.add(target.current);

    // Smoothly move camera to new position
    camera.position.lerp(position, dampingFactor);
    camera.lookAt(target.current);
  });

  return null;
}
