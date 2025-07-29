import React from "react";
import ErrorBoundary from "./ErrorBoundary"; // Import the new component

const RemoteToolbar = React.lazy(() => import("mfe_toolbar/Toolbar"));

function App() {
  return (
    <div className="App" style={{ padding: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Main Vite Host Application
        </h1>
        <p style={{ marginTop: "1rem" }}>
          The component below is loaded from a separate micro-frontend.
        </p>
      </header>
      <main style={{ marginTop: "2rem" }}>
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
