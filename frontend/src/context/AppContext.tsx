import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SchoolProfileViewModel, UserViewModel, AcademicYearViewModel } from '../types/viewModels';
import { schoolProfileService } from '../services/schoolProfileService';
import { userService } from '../services/userService';
import { academicYearService } from '../services/academicYearService';
import { SYSTEM_CONFIG } from '../config/env';

interface AppContextValue {
  schoolProfile: SchoolProfileViewModel | null;
  user: UserViewModel | null;
  activeAcademicYear: AcademicYearViewModel | null;
  academicYears: AcademicYearViewModel[];
  setActiveAcademicYear: (year: AcademicYearViewModel) => void;
  isLoading: boolean;
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  isDevMockMode: boolean;
  refreshContext: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfileViewModel | null>(null);
  const [user, setUser] = useState<UserViewModel | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYearViewModel[]>([]);
  const [activeAcademicYear, setActiveAcademicYear] = useState<AcademicYearViewModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [profileData, userData, yearsData, currentYear] = await Promise.all([
        schoolProfileService.getProfile(),
        userService.getCurrentUser(),
        academicYearService.getAcademicYears(),
        academicYearService.getCurrentAcademicYear(),
      ]);

      setSchoolProfile(profileData);
      setUser(userData);
      setAcademicYears(yearsData);
      setActiveAcademicYear(currentYear);
    } catch (err) {
      console.error('Failed to load application context from provider:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        schoolProfile,
        user,
        activeAcademicYear,
        academicYears,
        setActiveAcademicYear,
        isLoading,
        isSearchModalOpen,
        openSearchModal: () => setIsSearchModalOpen(true),
        closeSearchModal: () => setIsSearchModalOpen(false),
        isDevMockMode: SYSTEM_CONFIG.isDevMockMode,
        refreshContext: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
