/**
 * School OS — School Profile Service
 * Resolves school profile data reflecting the PostgreSQL school_profile table.
 * Adheres to explicit mock mode — never automatically falls back upon API failure.
 */

import type { DbSchoolProfile } from '../types/database';
import type { SchoolProfileViewModel } from '../types/viewModels';
import { mapSchoolProfileToViewModel } from '../utils/mappers';
import { SYSTEM_CONFIG } from '../config/env';
import { mockDataProvider } from './mockDataProvider';

export const schoolProfileService = {
  async getProfile(): Promise<SchoolProfileViewModel> {
    let dbRecord: DbSchoolProfile;

    if (SYSTEM_CONFIG.isDevMockMode) {
      dbRecord = await mockDataProvider.getSchoolProfile();
    } else {
      const response = await fetch(`${SYSTEM_CONFIG.apiBaseUrl}/school-profile`);
      if (!response.ok) {
        throw new Error(`Failed to fetch school profile [HTTP ${response.status}]: ${response.statusText}`);
      }
      dbRecord = await response.json();
    }

    return mapSchoolProfileToViewModel(dbRecord);
  },
};
