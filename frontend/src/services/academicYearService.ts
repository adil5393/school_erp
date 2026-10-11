/**
 * School OS — Academic Year Service
 * Resolves session data reflecting the PostgreSQL academic_year table.
 * Adheres to explicit mock mode — never automatically falls back upon API failure.
 */

import type { DbAcademicYear } from '../types/database';
import type { AcademicYearViewModel } from '../types/viewModels';
import { mapAcademicYearToViewModel } from '../utils/mappers';
import { SYSTEM_CONFIG } from '../config/env';
import { mockDataProvider } from './mockDataProvider';

export const academicYearService = {
  async getAcademicYears(): Promise<AcademicYearViewModel[]> {
    let dbRecords: DbAcademicYear[];

    if (SYSTEM_CONFIG.isDevMockMode) {
      dbRecords = await mockDataProvider.getAcademicYears();
    } else {
      const response = await fetch(`${SYSTEM_CONFIG.apiBaseUrl}/academic-years`);
      if (!response.ok) {
        throw new Error(`Failed to fetch academic years [HTTP ${response.status}]: ${response.statusText}`);
      }
      dbRecords = await response.json();
    }

    return dbRecords.map(mapAcademicYearToViewModel);
  },

  async getCurrentAcademicYear(): Promise<AcademicYearViewModel> {
    let dbRecord: DbAcademicYear;

    if (SYSTEM_CONFIG.isDevMockMode) {
      dbRecord = await mockDataProvider.getCurrentAcademicYear();
    } else {
      const response = await fetch(`${SYSTEM_CONFIG.apiBaseUrl}/academic-years/current`);
      if (!response.ok) {
        throw new Error(`Failed to fetch current academic year [HTTP ${response.status}]: ${response.statusText}`);
      }
      dbRecord = await response.json();
    }

    return mapAcademicYearToViewModel(dbRecord);
  },
};
