/**
 * Navigation utilities and helpers
 * Centralized navigation logic for the app
 */

import type { NavigateFunction } from "react-router-dom";
import { ROUTES } from "../router/index";
import { logger } from "./dev";

export class NavigationHelper {
  private navigate: NavigateFunction;

  constructor(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  // Navigate to home page
  goHome() {
    logger.debug("NavigationHelper: Navigating to home");
    this.navigate(ROUTES.HOME);
  }

  // Navigate to session page
  goToSession(sessionId: string, replace?: boolean) {
    logger.debug("NavigationHelper: Navigating to session", sessionId);
    this.navigate(ROUTES.SESSION(sessionId), { replace });
  }

  // Navigate to join session page
  goToJoinSession(sessionId?: string) {
    const route = sessionId ? ROUTES.JOIN_SESSION(sessionId) : ROUTES.JOIN;
    logger.debug("NavigationHelper: Navigating to join session", route);
    this.navigate(route);
  }

  // Go back in history
  goBack() {
    logger.debug("NavigationHelper: Going back");
    this.navigate(-1);
  }

  // Replace current route
  replace(route: string) {
    logger.debug("NavigationHelper: Replacing route", route);
    this.navigate(route, { replace: true });
  }
}

// Utility functions for URL manipulation
export const urlUtils = {
  // Extract session ID from various URL formats
  extractSessionId(urlOrId: string): string {
    // Handle full URLs
    if (urlOrId.includes("/session/")) {
      return urlOrId.split("/session/")[1].split("?")[0].split("#")[0];
    }

    // Handle join URLs
    if (urlOrId.includes("/join/")) {
      return urlOrId.split("/join/")[1].split("?")[0].split("#")[0];
    }

    // Handle query parameters
    if (urlOrId.includes("?")) {
      const url = new URL(urlOrId, window.location.origin);
      const sessionId =
        url.searchParams.get("sessionId") || url.searchParams.get("id");
      if (sessionId) return sessionId;
    }

    // Assume it's just the ID
    return urlOrId.trim();
  },

  // Generate shareable session URL
  generateSessionUrl(sessionId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}${ROUTES.SESSION(sessionId)}`;
  },

  // Generate join URL
  generateJoinUrl(sessionId: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}${ROUTES.JOIN_SESSION(sessionId)}`;
  },

  // Check if URL is valid session URL
  isValidSessionUrl(url: string): boolean {
    try {
      const sessionId = this.extractSessionId(url);
      return sessionId.length > 0;
    } catch {
      return false;
    }
  },
};

// Hook for creating navigation helper
export function createNavigationHelper(
  navigate: NavigateFunction
): NavigationHelper {
  return new NavigationHelper(navigate);
}

export default {
  NavigationHelper,
  urlUtils,
  createNavigationHelper,
};
