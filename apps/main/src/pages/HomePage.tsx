/**
 * Home Page Component
 * Landing page with session creation and history
 */

import React from "react";
import { SessionHistory } from "../components/SessionHistory";
import { logger } from "../lib/dev";

const HomePage: React.FC = () => {
  logger.debug("HomePage rendered");

  return (
    <div className="flex-1 overflow-auto">
      <SessionHistory />
    </div>
  );
};

export default HomePage;
