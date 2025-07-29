// TYPES FOR ALL COMMON OBJECTS IN MONOREPO APP

// Core Scene Types
export interface SceneObject {
  id: string;
  type: string; // e.g., "cube", "sphere"
  position: [number, number, number];
  color: string; // e.g., "orange", "purple"
  // We can add rotation and scale here later
}

// UI and Transform Types
export type TransformMode = "translate" | "rotate" | "scale";

// Socket Event Data Types
export interface ColorChangeData {
  id: string;
  color: string;
}

export interface PositionChangeData {
  id: string;
  position: [number, number, number];
}

// Socket Event Interface Types
export interface ServerToClientEvents {
  "object:color_change": (data: ColorChangeData) => void;
  "object:position_change": (data: PositionChangeData) => void;
  "scene:add_object": (data: SceneObject) => void;
}

export interface ClientToServerEvents {
  "object:color_change": (data: ColorChangeData) => void;
  "object:position_change": (data: PositionChangeData) => void;
  "scene:add_object": (data: SceneObject) => void;
}
