import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import Header from "./components/Header";
import ResizableSidebar from "./components/ResizableSidebar";

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
          <ErrorBoundary>
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <div className="text-neutral-500 text-sm">
                      Loading Toolbar...
                    </div>
                  </div>
                </div>
              }
            >
              <RemoteToolbar />
            </React.Suspense>
          </ErrorBoundary>
        </ResizableSidebar>

        {/* Main content area for the 3D Canvas */}
        <main className="flex-1 bg-surface-50 relative">
          <ErrorBoundary>
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <div className="text-neutral-700 text-lg font-medium">
                      Loading 3D Canvas...
                    </div>
                    <div className="text-neutral-500 text-sm mt-2">
                      Preparing your collaborative workspace
                    </div>
                  </div>
                </div>
              }
            >
              <RemoteScene />
            </React.Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
