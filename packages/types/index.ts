// TYPES FOR ALL COMMON OBJECTS IN MONOREPO APP

// Supported shape types
export type ShapeType = "cube" | "sphere" | "cylinder" | "cone" | "torus";

// Core Scene Types
export interface SceneObject {
  id: string;
  type: ShapeType;
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

// Session Types - SIMPLIFIED
export interface SessionUser {
  id: string;
  name: string;
}

// Model Type
export interface CustomModel {
  name: string;
  appwriteId: string;
  id: string;
  sessionId: string;
}

export interface CollaborativeSession {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Scene data stored as JSON
  sceneData: Record<string, any>;
}

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

// Socket Event Data Types
export interface ColorChangeData {
  id: string;
  color: string;
}

// Socket Event Interface Types
export interface ServerToClientEvents {
  // Existing object events
  "object:color_change": (data: ColorChangeData) => void;
  "object:transform_change": (data: TransformChangeData) => void;
  "scene:add_object": (data: SceneObject) => void;
  "object:remove": (data: { id: string }) => void;

  // New session events
  "session:state": (data: CollaborativeSession) => void;
  "session:user_joined": (data: { users: SessionUser[] }) => void;
  "session:user_left": (data: { userId: string; users: SessionUser[] }) => void;
  "session:user_cursor_update": (data: {
    userId: string;
    cursor: { x: number; y: number; z: number };
  }) => void;
  "session:user_selection_update": (data: {
    userId: string;
    selectedObjectId: string | null;
  }) => void;
  "session:error": (data: { message: string }) => void;
  "session:model_added": (data: CustomModel) => void;
}

export interface ClientToServerEvents {
  // Existing object events
  "object:color_change": (
    data: ColorChangeData & { sessionId: string }
  ) => void;
  "object:transform_change": (
    data: TransformChangeData & { sessionId: string }
  ) => void;
  "scene:add_object": (data: SceneObject & { sessionId: string }) => void;
  "object:remove": (data: { id: string; sessionId: string }) => void;

  // New session events
  "session:join": (data: {
    sessionId: string;
    id: string;
    name: string;
  }) => void;
  // "session:leave": () => void;
  "session:cursor_update": (data: {
    sessionId: string;
    userId: string;
    cursor: { x: number; y: number; z: number };
  }) => void;
  "session:selection_update": (data: {
    sessionId: string;
    userId: string;
    selectedObjectId: string | null;
  }) => void;
}

// API Response Types
// Session History Types
export interface SessionHistoryItem {
  id: string;
  name: string;
  lastVisited: Date;
  url: string;
  user?: SessionUser;
}

export interface SessionHistory {
  createdSessions: SessionHistoryItem[];
  joinedSessions: SessionHistoryItem[];
}

// API Types - SIMPLIFIED
export interface CreateSessionRequest {
  name: string;
  userName: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  session: CollaborativeSession;
  owner: SessionUser;
}

export interface JoinSessionRequest {
  sessionId: string;
  userName: string;
}

export interface JoinSessionResponse {
  session: CollaborativeSession;
  userId: string; // Assigned user ID for this session
  participant: SessionUser;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
