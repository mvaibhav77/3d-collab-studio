import React from "react";
import Header from "./components/Header";
import ResizableSidebar from "./components/ResizableSidebar";
import ToolbarFallback from "./components/ToolbarFallback";
import CanvasFallback from "./components/CanvasFallback";
import SafeAsyncComponent from "./components/SafeAsyncComponent";

// Lazily import both remote components
const RemoteToolbar = React.lazy(() => import("mfe_toolbar/Toolbar"));
const RemoteScene = React.lazy(() => import("mfe_canvas/Scene"));

function App() {
  return (
    <div className="flex flex-col h-screen bg-surface-100 overflow-hidden">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Resizable Sidebar for Toolbar */}
        <ResizableSidebar minWidth={200} maxWidth={600} defaultWidth={320}>
          <SafeAsyncComponent fallback={<ToolbarFallback />}>
            <RemoteToolbar />
          </SafeAsyncComponent>
        </ResizableSidebar>

        {/* Main content area for the 3D Canvas */}
        <main className="flex-1 bg-surface-50 relative">
          <SafeAsyncComponent fallback={<CanvasFallback />}>
            <RemoteScene />
          </SafeAsyncComponent>
        </main>
      </div>
    </div>
  );
}

export default App;
