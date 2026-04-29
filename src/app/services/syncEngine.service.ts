/**
 * Sync Engine Service
 * Handles tag-based workspace auto-sync logic
 */

import { Asset, SyncRule, WorkspaceAsset } from '../types/aethos.types';

export interface SyncResult {
  addedAssets: string[]; // Asset IDs
  removedAssets: string[]; // Asset IDs
  matchedCount: number;
  executionTimeMs: number;
  timestamp: string;
}

export interface SyncJobHistory {
  id: string;
  workspaceId: string;
  ruleId: string;
  result: SyncResult;
  status: 'success' | 'error' | 'partial';
  errorMessage?: string;
  createdAt: string;
}

/**
 * Evaluates if an asset matches a sync rule
 */
export function evaluateAssetAgainstRule(asset: Asset, rule: SyncRule): boolean {
  if (!rule.enabled) return false;

  // Combine user tags and enriched tags
  const allAssetTags = [...asset.userTags, ...asset.enrichedTags];

  // Tag-based matching
  if (rule.ruleType === 'tag') {
    // Must have ALL tags in tagsIncludeAll (AND logic)
    if (rule.tagsIncludeAll && rule.tagsIncludeAll.length > 0) {
      const hasAllTags = rule.tagsIncludeAll.every(tag => allAssetTags.includes(tag));
      if (!hasAllTags) return false;
    }

    // Must have ANY tag in tagsIncludeAny (OR logic)
    if (rule.tagsIncludeAny && rule.tagsIncludeAny.length > 0) {
      const hasAnyTag = rule.tagsIncludeAny.some(tag => allAssetTags.includes(tag));
      if (!hasAnyTag) return false;
    }

    // Must NOT have any excluded tags
    if (rule.tagsExclude && rule.tagsExclude.length > 0) {
      const hasExcludedTag = rule.tagsExclude.some(tag => allAssetTags.includes(tag));
      if (hasExcludedTag) return false;
    }
  }

  // Location-based matching
  if (rule.ruleType === 'location' && rule.locationPath) {
    if (!asset.locationPath.toLowerCase().includes(rule.locationPath.toLowerCase())) {
      return false;
    }
  }

  // Author-based matching
  if (rule.ruleType === 'author' && rule.authorEmails && rule.authorEmails.length > 0) {
    if (!asset.authorEmail || !rule.authorEmails.includes(asset.authorEmail)) {
      return false;
    }
  }

  // Keyword-based matching (AI+ tier)
  if (rule.ruleType === 'keyword' && rule.keywords && rule.keywords.length > 0) {
    const searchableText = `${asset.name} ${asset.enrichedTitle || ''} ${allAssetTags.join(' ')}`.toLowerCase();
    const hasKeyword = rule.keywords.some(keyword => 
      searchableText.includes(keyword.toLowerCase())
    );
    if (!hasKeyword) return false;
  }

  // File type filter
  if (rule.fileTypes && rule.fileTypes.length > 0) {
    const fileExtension = asset.mimeType?.split('/').pop() || asset.name.split('.').pop();
    if (!fileExtension || !rule.fileTypes.includes(fileExtension)) {
      return false;
    }
  }

  // Size filters
  if (rule.minSizeBytes && asset.sizeBytes < rule.minSizeBytes) return false;
  if (rule.maxSizeBytes && asset.sizeBytes > rule.maxSizeBytes) return false;

  // Date filters
  if (rule.dateAfter) {
    const assetDate = new Date(asset.modifiedDate);
    const filterDate = new Date(rule.dateAfter);
    if (assetDate < filterDate) return false;
  }

  if (rule.dateBefore) {
    const assetDate = new Date(asset.modifiedDate);
    const filterDate = new Date(rule.dateBefore);
    if (assetDate > filterDate) return false;
  }

  // Exclude locations
  if (rule.excludeLocations && rule.excludeLocations.length > 0) {
    const matchesExcludedLocation = rule.excludeLocations.some(excludedPath =>
      asset.locationPath.toLowerCase().includes(excludedPath.toLowerCase())
    );
    if (matchesExcludedLocation) return false;
  }

  return true;
}

/**
 * Executes a sync rule against all available assets
 */
export function executeSyncRule(
  rule: SyncRule,
  availableAssets: Asset[],
  currentWorkspaceAssets: WorkspaceAsset[]
): SyncResult {
  const startTime = Date.now();
  
  const currentAssetIds = new Set(currentWorkspaceAssets.map(wa => wa.assetId));
  const addedAssets: string[] = [];
  const removedAssets: string[] = [];

  // Find all assets that match the rule
  const matchingAssets = availableAssets.filter(asset => 
    evaluateAssetAgainstRule(asset, rule)
  );

  // Respect maxFiles limit
  const matchedAssetIds = matchingAssets
    .slice(0, rule.maxFiles)
    .map(a => a.id);

  // Auto-add: Add matching assets not currently in workspace
  if (rule.autoAdd) {
    matchedAssetIds.forEach(assetId => {
      if (!currentAssetIds.has(assetId)) {
        addedAssets.push(assetId);
      }
    });
  }

  // Auto-remove: Remove assets in workspace that no longer match
  if (rule.autoRemove) {
    const matchedSet = new Set(matchedAssetIds);
    currentWorkspaceAssets.forEach(wa => {
      // Only remove if this asset was added by a sync rule (not manually)
      if (wa.addedBy === 'system' && !matchedSet.has(wa.assetId)) {
        removedAssets.push(wa.assetId);
      }
    });
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    addedAssets,
    removedAssets,
    matchedCount: matchingAssets.length,
    executionTimeMs,
    timestamp: new Date().toISOString()
  };
}

/**
 * Executes all sync rules for a workspace
 */
export function executeAllSyncRules(
  workspaceId: string,
  syncRules: SyncRule[],
  availableAssets: Asset[],
  currentWorkspaceAssets: WorkspaceAsset[]
): SyncResult {
  const startTime = Date.now();
  const allAddedAssets = new Set<string>();
  const allRemovedAssets = new Set<string>();
  let totalMatched = 0;

  // Execute each enabled rule
  const enabledRules = syncRules.filter(rule => rule.enabled && rule.workspaceId === workspaceId);

  enabledRules.forEach(rule => {
    const result = executeSyncRule(rule, availableAssets, currentWorkspaceAssets);
    result.addedAssets.forEach(id => allAddedAssets.add(id));
    result.removedAssets.forEach(id => allRemovedAssets.add(id));
    totalMatched += result.matchedCount;
  });

  const executionTimeMs = Date.now() - startTime;

  return {
    addedAssets: Array.from(allAddedAssets),
    removedAssets: Array.from(allRemovedAssets),
    matchedCount: totalMatched,
    executionTimeMs,
    timestamp: new Date().toISOString()
  };
}

/**
 * Previews what would happen if a rule were applied (dry-run)
 */
export function previewSyncRule(
  rule: Partial<SyncRule>,
  availableAssets: Asset[]
): { matchingAssets: Asset[]; count: number } {
  // Create a temporary full rule for evaluation
  const tempRule: SyncRule = {
    id: 'preview',
    workspaceId: 'preview',
    tenantId: 'preview',
    ruleType: rule.ruleType || 'tag',
    enabled: true,
    tagsIncludeAny: rule.tagsIncludeAny || [],
    tagsIncludeAll: rule.tagsIncludeAll || [],
    tagsExclude: rule.tagsExclude || [],
    locationPath: rule.locationPath,
    authorEmails: rule.authorEmails,
    keywords: rule.keywords,
    fileTypes: rule.fileTypes,
    minSizeBytes: rule.minSizeBytes,
    maxSizeBytes: rule.maxSizeBytes,
    dateAfter: rule.dateAfter,
    dateBefore: rule.dateBefore,
    excludeLocations: rule.excludeLocations,
    autoAdd: true,
    autoRemove: false,
    maxFiles: rule.maxFiles || 500,
    filesAddedCount: 0,
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const matchingAssets = availableAssets.filter(asset => 
    evaluateAssetAgainstRule(asset, tempRule)
  );

  return {
    matchingAssets: matchingAssets.slice(0, tempRule.maxFiles),
    count: matchingAssets.length
  };
}

/**
 * Validates a sync rule configuration
 */
export function validateSyncRule(rule: Partial<SyncRule>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!rule.ruleType) {
    errors.push('Rule type is required');
  }

  if (rule.ruleType === 'tag') {
    if (
      (!rule.tagsIncludeAny || rule.tagsIncludeAny.length === 0) &&
      (!rule.tagsIncludeAll || rule.tagsIncludeAll.length === 0)
    ) {
      errors.push('At least one include tag is required for tag-based rules');
    }
  }

  if (rule.ruleType === 'location' && !rule.locationPath) {
    errors.push('Location path is required for location-based rules');
  }

  if (rule.ruleType === 'author' && (!rule.authorEmails || rule.authorEmails.length === 0)) {
    errors.push('At least one author email is required for author-based rules');
  }

  if (rule.ruleType === 'keyword' && (!rule.keywords || rule.keywords.length === 0)) {
    errors.push('At least one keyword is required for keyword-based rules');
  }

  if (rule.maxFiles && rule.maxFiles < 1) {
    errors.push('Max files must be at least 1');
  }

  if (rule.maxFiles && rule.maxFiles > 10000) {
    errors.push('Max files cannot exceed 10,000');
  }

  if (rule.minSizeBytes && rule.maxSizeBytes && rule.minSizeBytes > rule.maxSizeBytes) {
    errors.push('Min size cannot be greater than max size');
  }

  if (rule.dateAfter && rule.dateBefore) {
    const dateAfter = new Date(rule.dateAfter);
    const dateBefore = new Date(rule.dateBefore);
    if (dateAfter > dateBefore) {
      errors.push('Date after cannot be later than date before');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
