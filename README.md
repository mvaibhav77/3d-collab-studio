### **Project Documentation: 3D Collaboration Studio**

This document outlines the core architecture, key concepts, and performance optimizations implemented in the application.

---

### ## Architectural Overview 🏛️

The application is built as a **monorepo** using Turborepo, which helps manage the dependencies and build processes for multiple applications and shared packages efficiently. It employs a **Micro-Frontend (MFE) architecture** to keep concerns separate and allow for independent development and deployment of different parts of the UI.

- **Host Application (`apps/main`)**: The main shell application that provides the core layout, routing, and state management. It dynamically loads the micro-frontends.
- **Toolbar MFE (`apps/mfe-toolbar`)**: A remote React application responsible for the UI that allows users to add shapes, upload models, and transform objects.
- **Canvas MFE (`apps/mfe-canvas`)**: The core 3D rendering environment where all the interaction happens. It's built with React Three Fiber (`@react-three/fiber`).
- **API Server (`apps/api`)**: A Node.js backend built with Express that handles HTTP requests for session management and facilitates real-time communication via WebSockets (Socket.IO).

---

### ## ⚡ Real-Time Collaboration and Communication

Real-time functionality is the heart of the application, powered by **Socket.IO**.

- **Event-Driven Communication**: The client and server communicate through a series of defined events, such as adding, moving, or deleting an object.
- **Backend Socket Handling**: The API server listens for incoming connections and registers handlers for various events. When an event is received (e.g., an object is moved), the server processes it and broadcasts the update to all other clients in the same session.
- **Client-Side Event Handling**: The canvas frontend uses the `useSocketEvents` hook to listen for broadcasts from the server and updates the 3D scene accordingly, ensuring all users see the same state.
- **User Presence**: The application manages user presence by having each client emit a `session:join` event. The server maintains a list of participants for each session and broadcasts updates when users join or leave.

---

### ## 🚀 Performance and Optimization Strategies

Several key optimizations are in place to ensure the application is fast and responsive, especially when dealing with frequent updates and large 3D models.

### **1. Throttling Socket Events**

To prevent the server from being overwhelmed by a flood of events (e.g., when a user is dragging an object), high-frequency events like transform and color changes are throttled on the backend.

- **Mechanism**: When an `object:transform_change` or `object:color_change` event is received, the server doesn't immediately broadcast it. Instead, it sets a short `setTimeout` timer. If another event for the same object comes in before the timer fires, the old timer is cleared and a new one is set. This ensures that updates are only sent after the user has stopped making changes for a brief period (e.g., 30ms).
- **Configuration**: The specific delay for this throttling is configured via environment variables, providing flexibility between development and production environments.

### **2. Asynchronous Loading for Large 3D Models**

Directly loading a 100+ MB model would freeze the UI. The application uses an asynchronous, non-blocking strategy to handle this.

- **Instant Placeholders**: When a custom model is dropped onto the canvas, a simple wireframe cube (`ModelPlaceholder`) is rendered instantly. This provides immediate visual feedback to the user.
- **Background Fetching**: While the placeholder is visible, the actual `.glb` file is fetched from Appwrite storage in the background using the `fetch` API.
- **React Suspense**: The `CustomModel` component uses `<Suspense>`, which declaratively handles the loading state. It shows the `fallback` (the placeholder) while the `ModelContent` component is waiting for the `useLoader` hook to finish loading the model.

### **3. Client-Side Caching with IndexedDB**

To avoid re-downloading large models every time a session is loaded, the application uses **IndexedDB** for persistent client-side caching.

- **Mechanism**: When a custom model is loaded for the first time, its binary data (`ArrayBuffer`) is fetched from Appwrite and then stored in an IndexedDB database on the user's machine. The `appwriteId` is used as the key.
- **Cache-First Strategy**: On subsequent loads, the `CustomModel` component first checks if the model exists in IndexedDB. If it does, the model is loaded directly from the cache, which is significantly faster than a network request. If not, it's fetched from the network and then stored in the cache for future use.

### **4. Lazy Loading Micro-Frontends**

The main application does not load the code for the toolbar and canvas immediately. It uses **lazy loading** to defer loading these JavaScript bundles until they are actually needed.

- **Mechanism**: The `SessionLayout` component uses `React.lazy()` to import the `RemoteToolbar` and `RemoteScene` components. This creates separate JavaScript chunks that are only downloaded when the user navigates to the session page, resulting in a faster initial page load for the home/landing pages.
- **Fallback UI**: While these components are being loaded, a fallback UI (`ToolbarFallback`, `CanvasFallback`) is displayed to the user, improving the perceived performance.

---

### ## 🗄️ State Management and Data Flow

- **Global State (Zustand)**: The application uses **Zustand** for global state management. It's a lightweight and simple solution that avoids the boilerplate of other state management libraries. The state is divided into logical "slices" (`uiSlice`, `sceneSlice`, `sessionSlice`) to keep concerns separated.
- **State Persistence**: To improve the user experience, a small part of the global state (session history and user info) is persisted to `localStorage`. This allows the application to remember sessions a user has created or joined across browser refreshes.
- **Database (Prisma & PostgreSQL)**: The backend uses **Prisma** as its Object-Relational Mapper (ORM) to interact with a PostgreSQL database. The schema is straightforward, with tables for `sessions` and `custom_models`. Scene data, which is a collection of all objects and their properties, is stored as a JSONB blob in the `sessions` table for flexibility.
