/**
 * Error Page Component
 * Global error boundary fallback
 */

import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import { logger } from "../lib/dev";
import config from "../lib/config";

interface RouteError {
  status?: number;
  statusText?: string;
  message?: string;
  data?: unknown;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  logger.error("ErrorPage: Route error occurred", error);

  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: "Page Not Found",
        message: "The page you are looking for does not exist.",
      };
    }

    if (error?.status) {
      return {
        title: `Error ${error.status}`,
        message: error.statusText || "An unexpected error occurred.",
      };
    }

    return {
      title: "Oops! Something went wrong",
      message: error?.message || "An unexpected error occurred.",
    };
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="flex flex-col h-screen bg-surface-100">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">😵</div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-2">{message}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Home
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reload Page
            </button>
          </div>

          {/* Development error details */}
          {config.isDevelopment && error && (
            <details className="text-left text-sm bg-gray-100 p-4 rounded">
              <summary className="cursor-pointer font-medium">
                Error Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
