import React, { createContext, useContext, useState } from 'react';

interface NavigationContextValue {
  isMobileSidebarOpen: boolean;
  openMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  toggleMobileSidebar: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        isMobileSidebarOpen,
        openMobileSidebar: () => setIsMobileSidebarOpen(true),
        closeMobileSidebar: () => setIsMobileSidebarOpen(false),
        toggleMobileSidebar: () => setIsMobileSidebarOpen((prev) => !prev),
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
