/**
 * Root Layout Component
 * Main layout wrapper for all pages
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { logger } from "../lib/dev";

const RootLayout: React.FC = () => {
  logger.debug("RootLayout rendered");

  return (
    <div className="flex flex-col h-screen bg-surface-100 overflow-hidden">
      {/* Global Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
