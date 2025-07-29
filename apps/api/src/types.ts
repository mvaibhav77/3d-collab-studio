// Shared types for socket events

export interface SceneObject {
  id: string;
  type: string;
  position: [number, number, number];
  color: string;
}

export interface ColorChangeData {
  id: string;
  color: string;
}

export interface PositionChangeData {
  id: string;
  position: [number, number, number];
}

// Socket event types
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
