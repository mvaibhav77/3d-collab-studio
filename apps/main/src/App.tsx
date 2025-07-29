import React from "react";
import ErrorBoundary from "./ErrorBoundary"; // Import the new component

const RemoteToolbar = React.lazy(() => import("mfe_toolbar/Toolbar"));

function App() {
  return (
    <div className="App p-8">
      <header>
        <h1 className="text-3xl font-bold text-center">
          Main Vite Host Application
        </h1>
        <p className="mt-4">
          The component below is loaded from a separate micro-frontend.
        </p>
      </header>
      <main className="mt-8">
        <ErrorBoundary>
          <React.Suspense fallback={<div>Loading Toolbar...</div>}>
            <RemoteToolbar />
          </React.Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
