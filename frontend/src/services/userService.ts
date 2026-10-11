/**
 * School OS — User Service
 * Resolves user data reflecting the PostgreSQL "user" table.
 * Adheres to explicit mock mode — never automatically falls back upon API failure.
 */

import type { DbUser } from '../types/database';
import type { UserViewModel } from '../types/viewModels';
import { mapUserToViewModel } from '../utils/mappers';
import { SYSTEM_CONFIG } from '../config/env';
import { mockDataProvider } from './mockDataProvider';

export const userService = {
  async getCurrentUser(): Promise<UserViewModel> {
    let dbRecord: DbUser;

    if (SYSTEM_CONFIG.isDevMockMode) {
      dbRecord = await mockDataProvider.getCurrentUser();
    } else {
      const response = await fetch(`${SYSTEM_CONFIG.apiBaseUrl}/auth/me`);
      if (!response.ok) {
        throw new Error(`Failed to fetch current user [HTTP ${response.status}]: ${response.statusText}`);
      }
      dbRecord = await response.json();
    }

    return mapUserToViewModel(dbRecord);
  },
};
