// Session utility functions

/**
 * Extract session ID from various URL formats:
 * - Full URL: https://app.com/session/abc123
 * - Path: /session/abc123
 * - Just ID: abc123
 */
export function extractSessionId(input: string): string {
  const trimmed = input.trim();

  // Handle full URL
  if (trimmed.startsWith("http")) {
    const url = new URL(trimmed);
    const pathParts = url.pathname.split("/");
    const sessionIndex = pathParts.indexOf("session");
    if (sessionIndex >= 0 && pathParts[sessionIndex + 1]) {
      return pathParts[sessionIndex + 1];
    }
  }

  // Handle path like /session/abc123
  if (trimmed.startsWith("/session/")) {
    return trimmed.replace("/session/", "");
  }

  // Handle just the ID
  return trimmed;
}

/**
 * Generate a shareable URL for a session
 */
export function generateSessionUrl(sessionId: string): string {
  return `/session/${sessionId}`;
}

/**
 * Format date for display in session history
 */
export function formatLastVisited(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    return "Just now";
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return d.toLocaleDateString();
  }
}
