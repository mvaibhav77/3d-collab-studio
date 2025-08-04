/**
 * Router hooks and utilities
 */

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { createNavigationHelper, urlUtils } from "../lib/navigation";
import { ROUTES } from "./index";

// Enhanced navigation hook
export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const helper = useMemo(() => createNavigationHelper(navigate), [navigate]);

  return {
    ...helper,
    currentPath: location.pathname,
    currentSearch: location.search,
    urlUtils,
    ROUTES,
  };
}

// Session-specific hooks
export function useSessionParams() {
  const { sessionId } = useParams<{ sessionId: string }>();
  return { sessionId };
}

// Join session specific hooks
export function useJoinSessionParams() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  return { sessionId };
}

export default {
  useAppNavigation,
  useSessionParams,
  useJoinSessionParams,
};
