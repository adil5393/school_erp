/**
 * School OS — System Environment Configuration
 * Strictly contains environment flags and network configurations.
 * Institutional information, users, and sessions are served by the mock data provider / backend.
 */

import type { SystemEnvironmentConfig } from '../types/config';

export const SYSTEM_CONFIG: SystemEnvironmentConfig = {
  // Explicitly configured development mock mode for Phase 1 UI validation
  // Backend is a scaffold only; this is an explicit setting, never an automatic failure fallback
  isDevMockMode: import.meta.env.VITE_DEV_MOCK_MODE === 'false' ? false : true,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
};
