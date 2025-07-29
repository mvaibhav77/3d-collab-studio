// TYPES FOR ALL COMMON OBJECTS IN MONOREPO APP

// Core Scene Types
export interface SceneObject {
  id: string;
  type: string;
  position: [number, number, number];
  color: string;
  rotation: [number, number, number];
  scale: [number, number, number];
}

// Transform Change Data
export interface TransformChangeData {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

// UI and Transform Types
export type TransformMode = "translate" | "rotate" | "scale";

// Socket Event Data Types
export interface ColorChangeData {
  id: string;
  color: string;
}

// Socket Event Interface Types
export interface ServerToClientEvents {
  "object:color_change": (data: ColorChangeData) => void;
  "object:transform_change": (data: TransformChangeData) => void;
  "scene:add_object": (data: SceneObject) => void;
  "object:remove": (data: { id: string }) => void;
}

export interface ClientToServerEvents {
  "object:color_change": (data: ColorChangeData) => void;
  "object:transform_change": (data: TransformChangeData) => void;
  "scene:add_object": (data: SceneObject) => void;
  "object:remove": (data: { id: string }) => void;
}
