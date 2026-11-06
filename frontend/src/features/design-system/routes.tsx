import type { RouteObject } from 'react-router-dom';
import { DesignSystemPage } from './pages/DesignSystemPage';

export const designSystemRoutes: RouteObject[] = [
  { path: '/design-system', element: <DesignSystemPage /> },
];
