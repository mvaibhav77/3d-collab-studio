/**
 * Session Layout Component
 * Layout for session pages with sidebar and canvas
 */

import React from "react";
import { Outlet } from "react-router-dom";
import ResizableSidebar from "../components/ResizableSidebar";
import ToolbarFallback from "../components/ToolbarFallback";
import CanvasFallback from "../components/CanvasFallback";
import SafeAsyncComponent from "../components/SafeAsyncComponent";
import { logger } from "../lib/dev";

// Lazily import remote components
const RemoteToolbar = React.lazy(() => import("mfe_toolbar/Toolbar"));
const RemoteScene = React.lazy(() => import("mfe_canvas/Scene"));

const SessionLayout: React.FC = () => {
  logger.debug("SessionLayout rendered");

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      {/* Resizable Sidebar for Toolbar */}
      <ResizableSidebar minWidth={200} maxWidth={600} defaultWidth={320}>
        <SafeAsyncComponent fallback={<ToolbarFallback />}>
          <RemoteToolbar />
        </SafeAsyncComponent>
      </ResizableSidebar>

      {/* Main content area for the 3D Canvas */}
      <div className="flex-1 bg-surface-50 relative">
        <SafeAsyncComponent fallback={<CanvasFallback />}>
          <RemoteScene />
        </SafeAsyncComponent>

        {/* Session-specific content overlay */}
        <Outlet />
      </div>
    </div>
  );
};

export default SessionLayout;
