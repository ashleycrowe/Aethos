/**
 * Aethos Environment Configuration (STD-DEVOPS-001)
 * Centralized governance for environment-specific settings.
 */

import { AppEnvironment } from '../types/aethos.types';

interface Config {
  apiBaseUrl: string;
  appInsightsEnabled: boolean;
  debugMode: boolean;
  mockData: boolean;
  circuitBreakerThreshold: number;
}

const CONFIGS: Record<AppEnvironment, Config> = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    appInsightsEnabled: false,
    debugMode: true,
    mockData: true,
    circuitBreakerThreshold: 5,
  },
  test: {
    apiBaseUrl: 'https://test-api.aethos.glass',
    appInsightsEnabled: true,
    debugMode: true,
    mockData: true,
    circuitBreakerThreshold: 3,
  },
  staging: {
    apiBaseUrl: 'https://staging-api.aethos.glass',
    appInsightsEnabled: true,
    debugMode: false,
    mockData: false,
    circuitBreakerThreshold: 3,
  },
  production: {
    apiBaseUrl: 'https://api.aethos.glass',
    appInsightsEnabled: true,
    debugMode: false,
    mockData: false,
    circuitBreakerThreshold: 5,
  },
};

/**
 * Get the current environment from process.env or fallback to development
 */
export const getEnvironment = (): AppEnvironment => {
  const env = (process.env.NODE_ENV || 'development').toLowerCase();
  if (['development', 'test', 'staging', 'production'].includes(env)) {
    return env as AppEnvironment;
  }
  return 'development';
};

/**
 * Retrieve the configuration for the active environment
 */
export const getAppConfig = (): Config => {
  return CONFIGS[getEnvironment()];
};
