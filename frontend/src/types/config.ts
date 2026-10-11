/**
 * School OS — Application Configuration & Environment Settings
 */

export type DensityMode = 'comfortable' | 'compact';

export interface SystemEnvironmentConfig {
  isDevMockMode: boolean; // Explicit toggle - never automatic fallback
  apiBaseUrl: string;
}
