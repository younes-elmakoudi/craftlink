import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { authRoutes } from '@/features/auth/routes';
import { profileRoutes } from '@/features/profile/routes';
import { friendsRoutes } from '@/features/friends/routes';
import { chatRoutes } from '@/features/chat/routes';
import { craftsmenRoutes } from '@/features/craftsmen/routes';
import { requestsRoutes } from '@/features/requests/routes';
import { reviewsRoutes } from '@/features/reviews/routes';
import { notificationsRoutes } from '@/features/notifications/routes';
import { uploadsRoutes } from '@/features/uploads/routes';
import { adminRoutes } from '@/features/admin/routes';
import { legalRoutes } from '@/features/legal/routes';
import { designSystemRoutes } from '@/features/design-system/routes';
import { AppLayout } from './AppLayout';

/**
 * Every feature exposes its own `routes.tsx`, already registered below:
 * you add pages in YOUR feature's routes file and never edit this file.
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      ...authRoutes,
      ...profileRoutes,
      ...friendsRoutes,
      ...chatRoutes,
      ...craftsmenRoutes,
      ...requestsRoutes,
      ...reviewsRoutes,
      ...notificationsRoutes,
      ...uploadsRoutes,
      ...adminRoutes,
      ...legalRoutes,
      ...designSystemRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
