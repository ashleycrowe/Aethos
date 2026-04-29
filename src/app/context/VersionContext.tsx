/**
 * VersionContext - Prototype Version Management System
 * 
 * PURPOSE:
 * Allows toggling between product versions (V1, V1.5, V2, V3, V4) in the prototype
 * to demonstrate feature evolution without code duplication.
 * 
 * USAGE:
 * - const { version, setVersion } = useVersion();
 * - const canUseAI = useFeature('aiContentSearch');
 * - <FeatureGate feature="slackIntegration">...</FeatureGate>
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type Version = 'V1' | 'V1.5' | 'V2' | 'V3' | 'V4';

export interface VersionFeatures {
  // ========== V1 CORE FEATURES (Always Available) ==========
  discovery: boolean;                    // The Constellation - M365 discovery
  workspaces: boolean;                   // The Nexus - Workspace management
  basicSearch: boolean;                  // The Oracle - Metadata search only
  tagBasedSync: boolean;                 // Tag-based workspace auto-sync
  storageIntelligence: boolean;          // Storage dashboard & waste detection
  exposureVisibility: boolean;           // External sharing & guest access
  basicRemediation: boolean;             // Archive, revoke links
  aiMetadataEnrichment: boolean;         // AI-enhanced titles/tags (no content reading)
  weeklyReports: boolean;                // Basic discovery reports
  
  // ========== V1.5 FEATURES (AI+ Content Intelligence) ==========
  aiContentSearch: boolean;              // Content extraction & indexing
  semanticSearch: boolean;               // Vector embeddings + semantic queries
  summarization: boolean;                // AI document summarization
  piiDetection: boolean;                 // PII scanning in content
  contentChunkRetrieval: boolean;        // Show relevant paragraphs
  conversationalOracle: boolean;         // Chat-based search interface
  topicClustering: boolean;              // Group similar documents
  entityExtraction: boolean;             // Extract people, companies, dates
  
  // ========== V2 FEATURES (Multi-Provider Expansion) ==========
  slackIntegration: boolean;             // Full Slack discovery + workspaces
  googleWorkspaceShadow: boolean;        // Google Workspace shadow discovery
  crossPlatformWorkspaces: boolean;      // M365 + Slack in one workspace
  universalSearch: boolean;              // Search across M365 + Slack
  slackWasteDetection: boolean;          // Slack storage waste analysis
  multiProviderTagSync: boolean;         // Tags across providers
  boxShadowDiscovery: boolean;           // Box shadow discovery (Tier 2)
  
  // ========== V3 FEATURES (Predictive Analytics + Compliance) ==========
  complianceAutomation: boolean;         // Retention policies, lifecycle workflows
  retentionPolicies: boolean;            // Auto-archive/delete rules
  auditTrails: boolean;                  // Immutable compliance logs
  policyTemplates: boolean;              // GDPR, HIPAA, SOC 2 templates
  predictiveAnalytics: boolean;          // Anomaly detection, forecasting
  anomalyDetection: boolean;             // Unusual activity alerts
  driftDetection: boolean;               // Content moving outside anchors
  budgetForecasting: boolean;            // Storage cost projections
  executiveDashboard: boolean;           // C-suite intelligence view
  advancedRemediation: boolean;          // Approval chains, scheduled workflows
  simulationMode: boolean;               // Dry-run remediation
  
  // ========== V4 FEATURES (Federation + Ecosystem) ==========
  multiTenantFederation: boolean;        // MSP platform (manage multiple tenants)
  crossTenantSearch: boolean;            // Search across client tenants
  tenantBenchmarking: boolean;           // Compare tenant metrics
  apiMarketplace: boolean;               // Public API + integrations
  webhooks: boolean;                     // Event notification system
  whiteLabel: boolean;                   // Custom branding
  enterpriseSSO: boolean;                // SAML, Okta, Auth0
  advancedRBAC: boolean;                 // Custom role definitions
  knowledgeGraph: boolean;               // Entity relationship visualization
  multiLanguage: boolean;                // Search/summarize in 10+ languages
  customLLMFineTuning: boolean;          // Tenant-specific AI training
}

// ============================================================================
// VERSION FEATURE MAPPING
// ============================================================================

export const VERSION_FEATURES: Record<Version, VersionFeatures> = {
  V1: {
    // V1 Core
    discovery: true,
    workspaces: true,
    basicSearch: true,
    tagBasedSync: true,
    storageIntelligence: true,
    exposureVisibility: true,
    basicRemediation: true,
    aiMetadataEnrichment: true,
    weeklyReports: true,
    
    // V1.5+ (disabled)
    aiContentSearch: false,
    semanticSearch: false,
    summarization: false,
    piiDetection: false,
    contentChunkRetrieval: false,
    conversationalOracle: false,
    topicClustering: false,
    entityExtraction: false,
    
    // V2+ (disabled)
    slackIntegration: false,
    googleWorkspaceShadow: false,
    crossPlatformWorkspaces: false,
    universalSearch: false,
    slackWasteDetection: false,
    multiProviderTagSync: false,
    boxShadowDiscovery: false,
    
    // V3+ (disabled)
    complianceAutomation: false,
    retentionPolicies: false,
    auditTrails: false,
    policyTemplates: false,
    predictiveAnalytics: false,
    anomalyDetection: false,
    driftDetection: false,
    budgetForecasting: false,
    executiveDashboard: false,
    advancedRemediation: false,
    simulationMode: false,
    
    // V4+ (disabled)
    multiTenantFederation: false,
    crossTenantSearch: false,
    tenantBenchmarking: false,
    apiMarketplace: false,
    webhooks: false,
    whiteLabel: false,
    enterpriseSSO: false,
    advancedRBAC: false,
    knowledgeGraph: false,
    multiLanguage: false,
    customLLMFineTuning: false,
  },
  
  'V1.5': {
    // V1 Core (all enabled)
    discovery: true,
    workspaces: true,
    basicSearch: true,
    tagBasedSync: true,
    storageIntelligence: true,
    exposureVisibility: true,
    basicRemediation: true,
    aiMetadataEnrichment: true,
    weeklyReports: true,
    
    // V1.5 Features (enabled)
    aiContentSearch: true,
    semanticSearch: true,
    summarization: true,
    piiDetection: true,
    contentChunkRetrieval: true,
    conversationalOracle: true,
    topicClustering: true,
    entityExtraction: true,
    
    // V2+ (disabled)
    slackIntegration: false,
    googleWorkspaceShadow: false,
    crossPlatformWorkspaces: false,
    universalSearch: false,
    slackWasteDetection: false,
    multiProviderTagSync: false,
    boxShadowDiscovery: false,
    
    // V3+ (disabled)
    complianceAutomation: false,
    retentionPolicies: false,
    auditTrails: false,
    policyTemplates: false,
    predictiveAnalytics: false,
    anomalyDetection: false,
    driftDetection: false,
    budgetForecasting: false,
    executiveDashboard: false,
    advancedRemediation: false,
    simulationMode: false,
    
    // V4+ (disabled)
    multiTenantFederation: false,
    crossTenantSearch: false,
    tenantBenchmarking: false,
    apiMarketplace: false,
    webhooks: false,
    whiteLabel: false,
    enterpriseSSO: false,
    advancedRBAC: false,
    knowledgeGraph: false,
    multiLanguage: false,
    customLLMFineTuning: false,
  },
  
  V2: {
    // V1 Core (all enabled)
    discovery: true,
    workspaces: true,
    basicSearch: true,
    tagBasedSync: true,
    storageIntelligence: true,
    exposureVisibility: true,
    basicRemediation: true,
    aiMetadataEnrichment: true,
    weeklyReports: true,
    
    // V1.5 Features (enabled)
    aiContentSearch: true,
    semanticSearch: true,
    summarization: true,
    piiDetection: true,
    contentChunkRetrieval: true,
    conversationalOracle: true,
    topicClustering: true,
    entityExtraction: true,
    
    // V2 Features (enabled)
    slackIntegration: true,
    googleWorkspaceShadow: true,
    crossPlatformWorkspaces: true,
    universalSearch: true,
    slackWasteDetection: true,
    multiProviderTagSync: true,
    boxShadowDiscovery: false, // Box comes in V3
    
    // V3+ (disabled)
    complianceAutomation: false,
    retentionPolicies: false,
    auditTrails: false,
    policyTemplates: false,
    predictiveAnalytics: false,
    anomalyDetection: false,
    driftDetection: false,
    budgetForecasting: false,
    executiveDashboard: false,
    advancedRemediation: false,
    simulationMode: false,
    
    // V4+ (disabled)
    multiTenantFederation: false,
    crossTenantSearch: false,
    tenantBenchmarking: false,
    apiMarketplace: false,
    webhooks: false,
    whiteLabel: false,
    enterpriseSSO: false,
    advancedRBAC: false,
    knowledgeGraph: false,
    multiLanguage: false,
    customLLMFineTuning: false,
  },
  
  V3: {
    // V1 Core (all enabled)
    discovery: true,
    workspaces: true,
    basicSearch: true,
    tagBasedSync: true,
    storageIntelligence: true,
    exposureVisibility: true,
    basicRemediation: true,
    aiMetadataEnrichment: true,
    weeklyReports: true,
    
    // V1.5 Features (enabled)
    aiContentSearch: true,
    semanticSearch: true,
    summarization: true,
    piiDetection: true,
    contentChunkRetrieval: true,
    conversationalOracle: true,
    topicClustering: true,
    entityExtraction: true,
    
    // V2 Features (enabled)
    slackIntegration: true,
    googleWorkspaceShadow: true,
    crossPlatformWorkspaces: true,
    universalSearch: true,
    slackWasteDetection: true,
    multiProviderTagSync: true,
    boxShadowDiscovery: true,
    
    // V3 Features (enabled)
    complianceAutomation: true,
    retentionPolicies: true,
    auditTrails: true,
    policyTemplates: true,
    predictiveAnalytics: true,
    anomalyDetection: true,
    driftDetection: true,
    budgetForecasting: true,
    executiveDashboard: true,
    advancedRemediation: true,
    simulationMode: true,
    
    // V4+ (disabled)
    multiTenantFederation: false,
    crossTenantSearch: false,
    tenantBenchmarking: false,
    apiMarketplace: false,
    webhooks: false,
    whiteLabel: false,
    enterpriseSSO: false,
    advancedRBAC: false,
    knowledgeGraph: false,
    multiLanguage: false,
    customLLMFineTuning: false,
  },
  
  V4: {
    // V1 Core (all enabled)
    discovery: true,
    workspaces: true,
    basicSearch: true,
    tagBasedSync: true,
    storageIntelligence: true,
    exposureVisibility: true,
    basicRemediation: true,
    aiMetadataEnrichment: true,
    weeklyReports: true,
    
    // V1.5 Features (enabled)
    aiContentSearch: true,
    semanticSearch: true,
    summarization: true,
    piiDetection: true,
    contentChunkRetrieval: true,
    conversationalOracle: true,
    topicClustering: true,
    entityExtraction: true,
    
    // V2 Features (enabled)
    slackIntegration: true,
    googleWorkspaceShadow: true,
    crossPlatformWorkspaces: true,
    universalSearch: true,
    slackWasteDetection: true,
    multiProviderTagSync: true,
    boxShadowDiscovery: true,
    
    // V3 Features (enabled)
    complianceAutomation: true,
    retentionPolicies: true,
    auditTrails: true,
    policyTemplates: true,
    predictiveAnalytics: true,
    anomalyDetection: true,
    driftDetection: true,
    budgetForecasting: true,
    executiveDashboard: true,
    advancedRemediation: true,
    simulationMode: true,
    
    // V4 Features (all enabled)
    multiTenantFederation: true,
    crossTenantSearch: true,
    tenantBenchmarking: true,
    apiMarketplace: true,
    webhooks: true,
    whiteLabel: true,
    enterpriseSSO: true,
    advancedRBAC: true,
    knowledgeGraph: true,
    multiLanguage: true,
    customLLMFineTuning: true,
  },
};

// ============================================================================
// VERSION METADATA
// ============================================================================

export const VERSION_METADATA: Record<Version, {
  name: string;
  tagline: string;
  releaseTarget: string;
  primaryFeatures: string[];
}> = {
  V1: {
    name: 'V1: The Sharp Wedge',
    tagline: 'Discovery + Workspaces + Basic Search',
    releaseTarget: 'Weeks 1-10',
    primaryFeatures: ['M365 Discovery', 'Tag-Based Workspaces', 'Metadata Search'],
  },
  'V1.5': {
    name: 'V1.5: AI+ Content Intelligence',
    tagline: 'Semantic Search + Summarization',
    releaseTarget: 'Months 3-4',
    primaryFeatures: ['Content Search', 'AI Summarization', 'PII Detection'],
  },
  V2: {
    name: 'V2: Multi-Provider Expansion',
    tagline: 'Slack + Google Workspace',
    releaseTarget: 'Months 5-7',
    primaryFeatures: ['Slack Integration', 'Cross-Platform Workspaces', 'Universal Search'],
  },
  V3: {
    name: 'V3: Predictive Analytics + Compliance',
    tagline: 'Governance Automation + Executive Intelligence',
    releaseTarget: 'Months 8-12',
    primaryFeatures: ['Retention Policies', 'Anomaly Detection', 'Executive Dashboard'],
  },
  V4: {
    name: 'V4: Federation + Ecosystem',
    tagline: 'MSP Platform + API Marketplace',
    releaseTarget: 'Year 2+',
    primaryFeatures: ['Multi-Tenant Federation', 'API Marketplace', 'White-Label'],
  },
};

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

interface VersionContextValue {
  version: Version;
  setVersion: (version: Version) => void;
  features: VersionFeatures;
  metadata: typeof VERSION_METADATA[Version];
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const VersionContext = createContext<VersionContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface VersionProviderProps {
  children: ReactNode;
  defaultVersion?: Version;
  demoMode?: boolean;
}

export const VersionProvider: React.FC<VersionProviderProps> = ({ 
  children, 
  defaultVersion = 'V1',
  demoMode = true, // Enable demo mode by default for prototype
}) => {
  const [version, setVersionState] = useState<Version>(() => {
    // Try to restore from localStorage
    const saved = localStorage.getItem('aethos_prototype_version');
    return (saved as Version) || defaultVersion;
  });
  
  const [isDemoMode, setDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('aethos_demo_mode');
    return saved !== null ? saved === 'true' : demoMode;
  });

  // Persist version to localStorage
  const setVersion = (newVersion: Version) => {
    setVersionState(newVersion);
    localStorage.setItem('aethos_prototype_version', newVersion);
    console.log(`[VersionContext] Switched to ${newVersion}`);
  };

  // Persist demo mode to localStorage
  useEffect(() => {
    localStorage.setItem('aethos_demo_mode', String(isDemoMode));
  }, [isDemoMode]);

  const value: VersionContextValue = {
    version,
    setVersion,
    features: VERSION_FEATURES[version],
    metadata: VERSION_METADATA[version],
    isDemoMode,
    setDemoMode,
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Access current version state
 * 
 * @example
 * const { version, setVersion, features } = useVersion();
 */
export const useVersion = (): VersionContextValue => {
  const context = useContext(VersionContext);
  if (!context) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};

/**
 * Check if a specific feature is enabled in the current version
 * 
 * @example
 * const hasAI = useFeature('aiContentSearch');
 * if (hasAI) { ... }
 */
export const useFeature = (feature: keyof VersionFeatures): boolean => {
  const { features } = useVersion();
  return features[feature];
};

/**
 * Get multiple feature flags at once
 * 
 * @example
 * const { slackIntegration, googleWorkspaceShadow } = useFeatures();
 */
export const useFeatures = (): VersionFeatures => {
  const { features } = useVersion();
  return features;
};

// ============================================================================
// FEATURE GATE COMPONENT
// ============================================================================

interface FeatureGateProps {
  feature: keyof VersionFeatures;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render content based on feature availability
 * 
 * @example
 * <FeatureGate feature="slackIntegration">
 *   <SlackIntegrationPanel />
 * </FeatureGate>
 * 
 * @example
 * <FeatureGate 
 *   feature="aiContentSearch" 
 *   fallback={<UpgradePrompt />}
 * >
 *   <SemanticSearchBar />
 * </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback = null 
}) => {
  const enabled = useFeature(feature);
  return <>{enabled ? children : fallback}</>;
};

// ============================================================================
// VERSION COMPARISON UTILITIES
// ============================================================================

/**
 * Compare version strings
 * 
 * @example
 * if (isVersionAtLeast('V2')) { ... }
 */
export const isVersionAtLeast = (targetVersion: Version, currentVersion?: Version): boolean => {
  const { version } = useVersion();
  const versionOrder: Version[] = ['V1', 'V1.5', 'V2', 'V3', 'V4'];
  const current = currentVersion || version;
  return versionOrder.indexOf(current) >= versionOrder.indexOf(targetVersion);
};

/**
 * Get all features added in a specific version (delta from previous)
 */
export const getVersionDelta = (version: Version): Partial<VersionFeatures> => {
  const versionOrder: Version[] = ['V1', 'V1.5', 'V2', 'V3', 'V4'];
  const currentIndex = versionOrder.indexOf(version);
  
  if (currentIndex === 0) {
    return VERSION_FEATURES[version]; // V1 has no previous version
  }
  
  const previousVersion = versionOrder[currentIndex - 1];
  const currentFeatures = VERSION_FEATURES[version];
  const previousFeatures = VERSION_FEATURES[previousVersion];
  
  const delta: Partial<VersionFeatures> = {};
  
  for (const key in currentFeatures) {
    const featureKey = key as keyof VersionFeatures;
    if (currentFeatures[featureKey] && !previousFeatures[featureKey]) {
      delta[featureKey] = true;
    }
  }
  
  return delta;
};
