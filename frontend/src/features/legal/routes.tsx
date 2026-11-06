import type { RouteObject } from 'react-router-dom';
import { LegalPage } from './pages/LegalPage';

export const legalRoutes: RouteObject[] = [
  { path: '/privacy', element: <LegalPage kind="privacy" /> },
  { path: '/terms', element: <LegalPage kind="terms" /> },
];
