import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/AppContext';
import { DensityProvider } from './context/DensityContext';
import { NavigationProvider } from './context/NavigationContext';
import { AppShell } from './components/shell/AppShell';
import { AppRouter } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <DensityProvider>
            <NavigationProvider>
              <AppShell>
                <AppRouter />
              </AppShell>
            </NavigationProvider>
          </DensityProvider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
