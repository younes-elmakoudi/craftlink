import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import '@/i18n';
import { queryClient } from '@/lib/queryClient';

/** Global providers. Add new ones here (auth, toasts...) in a dedicated PR. */
export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
