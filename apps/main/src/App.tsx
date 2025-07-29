import React from 'react';
import ErrorBoundary from './ErrorBoundary'; // Make sure this path is correct

// Lazily import both remote components
const RemoteToolbar = React.lazy(() => import('mfe_toolbar/Toolbar'));
const RemoteScene = React.lazy(() => import('mfe_canvas/Scene'));

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Toolbar */}
      <aside className="w-64 bg-white p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Toolbar MFE</h2>
        <ErrorBoundary>
          <React.Suspense fallback={<div className="text-gray-500">Loading Toolbar...</div>}>
            <RemoteToolbar />
          </React.Suspense>
        </ErrorBoundary>
      </aside>

      {/* Main content area for the 3D Canvas */}
      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b bg-white">
          <h1 className="text-2xl font-bold">3D Collaborative Studio</h1>
        </header>
        <div className="flex-1 bg-gray-800">
          <ErrorBoundary>
            <React.Suspense fallback={<div className="text-white p-4">Loading 3D Canvas...</div>}>
              <RemoteScene />
            </React.Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;