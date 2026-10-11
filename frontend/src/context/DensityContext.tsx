import React, { createContext, useContext, useState, useEffect } from 'react';
import type { DensityMode } from '../types/config';

interface DensityContextValue {
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
  toggleDensity: () => void;
}

const DensityContext = createContext<DensityContextValue | undefined>(undefined);

export const DensityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [density, setDensityState] = useState<DensityMode>('comfortable');

  const setDensity = (mode: DensityMode) => {
    setDensityState(mode);
    document.documentElement.setAttribute('data-density', mode);
  };

  const toggleDensity = () => {
    setDensity(density === 'comfortable' ? 'compact' : 'comfortable');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  return (
    <DensityContext.Provider value={{ density, setDensity, toggleDensity }}>
      {children}
    </DensityContext.Provider>
  );
};

export const useDensity = (): DensityContextValue => {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error('useDensity must be used within a DensityProvider');
  }
  return context;
};
