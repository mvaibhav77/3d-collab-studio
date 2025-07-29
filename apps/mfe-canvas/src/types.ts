interface SceneObject {
  id: string;
  type: string; // e.g., "cube", "sphere"
  position: [number, number, number];
  color: string; // e.g., "orange", "purple"
}

export type { SceneObject };
