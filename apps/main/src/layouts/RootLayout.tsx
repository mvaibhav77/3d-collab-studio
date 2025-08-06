/**
 * Root Layout Component
 * Main layout wrapper for all pages
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { logger } from "../lib/dev";

const RootLayout: React.FC = () => {
  logger.debug("RootLayout rendered");
  return (
    <div className="flex flex-col h-screen bg-surface-100 overflow-hidden">
      {/* Global Header */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
