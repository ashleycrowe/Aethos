/**
 * Sync Rules API Service (Mock Implementation)
 * In production, these would be Vercel Serverless Functions calling Supabase
 */

import { SyncRule, WorkspaceAsset, Asset } from '../types/aethos.types';
import { SyncJobHistory, executeSyncRule, executeAllSyncRules, validateSyncRule } from './syncEngine.service';

// Mock in-memory storage (in production, this would be Supabase)
const mockSyncRules: Map<string, SyncRule> = new Map();
const mockWorkspaceAssets: Map<string, WorkspaceAsset> = new Map();
const mockSyncHistory: Map<string, SyncJobHistory> = new Map();

let syncRuleIdCounter = 1;
let workspaceAssetIdCounter = 1;
let syncJobIdCounter = 1;

/**
 * Create a new sync rule for a workspace
 */
export async function createSyncRule(
  workspaceId: string,
  tenantId: string,
  rule: Partial<SyncRule>,
  userId: string
): Promise<{ success: boolean; data?: SyncRule; error?: string }> {
  // Validate rule
  const validation = validateSyncRule(rule);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  const newRule: SyncRule = {
    id: `sync-rule-${syncRuleIdCounter++}`,
    workspaceId,
    tenantId,
    ruleType: rule.ruleType!,
    enabled: rule.enabled !== false,
    tagsIncludeAll: rule.tagsIncludeAll || [],
    tagsIncludeAny: rule.tagsIncludeAny || [],
    tagsExclude: rule.tagsExclude || [],
    locationPath: rule.locationPath,
    authorEmails: rule.authorEmails || [],
    keywords: rule.keywords || [],
    fileTypes: rule.fileTypes || [],
    minSizeBytes: rule.minSizeBytes,
    maxSizeBytes: rule.maxSizeBytes,
    dateAfter: rule.dateAfter,
    dateBefore: rule.dateBefore,
    excludeLocations: rule.excludeLocations || [],
    autoAdd: rule.autoAdd !== false,
    autoRemove: rule.autoRemove || false,
    maxFiles: rule.maxFiles || 500,
    filesAddedCount: 0,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockSyncRules.set(newRule.id, newRule);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    data: newRule
  };
}

/**
 * Get all sync rules for a workspace
 */
export async function getSyncRules(workspaceId: string): Promise<SyncRule[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return Array.from(mockSyncRules.values())
    .filter(rule => rule.workspaceId === workspaceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Update a sync rule
 */
export async function updateSyncRule(
  ruleId: string,
  updates: Partial<SyncRule>
): Promise<{ success: boolean; data?: SyncRule; error?: string }> {
  const existingRule = mockSyncRules.get(ruleId);
  
  if (!existingRule) {
    return {
      success: false,
      error: 'Sync rule not found'
    };
  }

  const updatedRule: SyncRule = {
    ...existingRule,
    ...updates,
    id: existingRule.id,
    workspaceId: existingRule.workspaceId,
    tenantId: existingRule.tenantId,
    createdBy: existingRule.createdBy,
    createdAt: existingRule.createdAt,
    updatedAt: new Date().toISOString()
  };

  // Validate updated rule
  const validation = validateSyncRule(updatedRule);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    };
  }

  mockSyncRules.set(ruleId, updatedRule);

  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    success: true,
    data: updatedRule
  };
}

/**
 * Delete a sync rule
 */
export async function deleteSyncRule(ruleId: string): Promise<{ success: boolean; error?: string }> {
  const existed = mockSyncRules.delete(ruleId);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!existed) {
    return {
      success: false,
      error: 'Sync rule not found'
    };
  }

  return { success: true };
}

/**
 * Toggle sync rule enabled status
 */
export async function toggleSyncRule(ruleId: string, enabled: boolean): Promise<{ success: boolean; data?: SyncRule }> {
  const rule = mockSyncRules.get(ruleId);
  
  if (!rule) {
    return { success: false };
  }

  const updatedRule = {
    ...rule,
    enabled,
    updatedAt: new Date().toISOString()
  };

  mockSyncRules.set(ruleId, updatedRule);

  await new Promise(resolve => setTimeout(resolve, 150));

  return {
    success: true,
    data: updatedRule
  };
}

/**
 * Run sync for a specific workspace
 */
export async function runWorkspaceSync(
  workspaceId: string,
  availableAssets: Asset[]
): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    // Get all sync rules for this workspace
    const syncRules = await getSyncRules(workspaceId);
    
    if (syncRules.length === 0) {
      return {
        success: false,
        error: 'No sync rules configured for this workspace'
      };
    }

    // Get current workspace assets
    const currentAssets = Array.from(mockWorkspaceAssets.values())
      .filter(wa => wa.workspaceId === workspaceId);

    // Execute all rules
    const result = executeAllSyncRules(workspaceId, syncRules, availableAssets, currentAssets);

    // Add new assets to workspace
    result.addedAssets.forEach(assetId => {
      const newWorkspaceAsset: WorkspaceAsset = {
        id: `workspace-asset-${workspaceAssetIdCounter++}`,
        workspaceId,
        assetId,
        addedBy: 'system',
        addedAt: new Date().toISOString(),
        pinned: false
      };
      mockWorkspaceAssets.set(newWorkspaceAsset.id, newWorkspaceAsset);
    });

    // Remove assets from workspace
    result.removedAssets.forEach(assetId => {
      for (const [id, wa] of mockWorkspaceAssets.entries()) {
        if (wa.workspaceId === workspaceId && wa.assetId === assetId && wa.addedBy === 'system') {
          mockWorkspaceAssets.delete(id);
        }
      }
    });

    // Record sync job in history
    const jobId = `sync-job-${syncJobIdCounter++}`;
    const job: SyncJobHistory = {
      id: jobId,
      workspaceId,
      ruleId: 'all',
      result,
      status: 'success',
      createdAt: new Date().toISOString()
    };
    mockSyncHistory.set(jobId, job);

    // Update filesAddedCount for each rule
    syncRules.forEach(rule => {
      const updated = mockSyncRules.get(rule.id);
      if (updated) {
        updated.filesAddedCount += result.addedAssets.length;
        updated.lastRun = new Date().toISOString();
        mockSyncRules.set(rule.id, updated);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      result: {
        ...result,
        jobId
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Sync failed'
    };
  }
}

/**
 * Get sync history for a workspace
 */
export async function getSyncHistory(
  workspaceId: string,
  limit: number = 10
): Promise<SyncJobHistory[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return Array.from(mockSyncHistory.values())
    .filter(job => job.workspaceId === workspaceId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Get workspace assets
 */
export async function getWorkspaceAssets(workspaceId: string): Promise<WorkspaceAsset[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return Array.from(mockWorkspaceAssets.values())
    .filter(wa => wa.workspaceId === workspaceId);
}

/**
 * Manually add asset to workspace (non-sync)
 */
export async function addAssetToWorkspace(
  workspaceId: string,
  assetId: string,
  userId: string
): Promise<{ success: boolean; data?: WorkspaceAsset }> {
  // Check if already exists
  const existing = Array.from(mockWorkspaceAssets.values())
    .find(wa => wa.workspaceId === workspaceId && wa.assetId === assetId);

  if (existing) {
    return {
      success: false
    };
  }

  const newWorkspaceAsset: WorkspaceAsset = {
    id: `workspace-asset-${workspaceAssetIdCounter++}`,
    workspaceId,
    assetId,
    addedBy: userId,
    addedAt: new Date().toISOString(),
    pinned: false
  };

  mockWorkspaceAssets.set(newWorkspaceAsset.id, newWorkspaceAsset);

  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    success: true,
    data: newWorkspaceAsset
  };
}

/**
 * Remove asset from workspace
 */
export async function removeAssetFromWorkspace(
  workspaceId: string,
  assetId: string
): Promise<{ success: boolean }> {
  let removed = false;

  for (const [id, wa] of mockWorkspaceAssets.entries()) {
    if (wa.workspaceId === workspaceId && wa.assetId === assetId) {
      mockWorkspaceAssets.delete(id);
      removed = true;
      break;
    }
  }

  await new Promise(resolve => setTimeout(resolve, 150));

  return { success: removed };
}

/**
 * Get sync statistics for a workspace
 */
export async function getWorkspaceSyncStats(workspaceId: string): Promise<{
  totalRules: number;
  activeRules: number;
  totalAssetsSynced: number;
  lastSyncTime?: string;
  autoAddedAssets: number;
  manuallyAddedAssets: number;
}> {
  const rules = await getSyncRules(workspaceId);
  const assets = await getWorkspaceAssets(workspaceId);
  const history = await getSyncHistory(workspaceId, 1);

  return {
    totalRules: rules.length,
    activeRules: rules.filter(r => r.enabled).length,
    totalAssetsSynced: rules.reduce((sum, r) => sum + r.filesAddedCount, 0),
    lastSyncTime: history[0]?.createdAt,
    autoAddedAssets: assets.filter(a => a.addedBy === 'system').length,
    manuallyAddedAssets: assets.filter(a => a.addedBy !== 'system').length
  };
}
