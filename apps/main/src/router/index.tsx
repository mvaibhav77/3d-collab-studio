/* eslint-disable react-refresh/only-export-components */
/**
 * Router configuration and route definitions
 */

import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy } from 'react';

// Layout Components
import RootLayout from '../layouts/RootLayout';
import SessionLayout from '../layouts/SessionLayout';

// Page Components (eager loaded for critical routes)
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';

// Lazy-loaded pages for better performance
const SessionPage = lazy(() => import('../pages/SessionPage'));
const JoinSessionPage = lazy(() => import('../pages/JoinSessionPage'));

// Route definitions
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'join/:sessionId?',
        element: <JoinSessionPage />,
      },
      {
        path: 'session/:sessionId',
        element: <SessionLayout />,
        children: [
          {
            index: true,
            element: <SessionPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

// Create the router instance
export const router = createBrowserRouter(routes, {
  // Enable future flags for better performance
  future: {
    v7_normalizeFormMethod: true,
  },
});

// Export route helpers
export const ROUTES = {
  HOME: '/',
  JOIN: '/join',
  JOIN_SESSION: (sessionId: string) => `/join/${sessionId}`,
  SESSION: (sessionId: string) => `/session/${sessionId}`,
} as const;

export default router;
