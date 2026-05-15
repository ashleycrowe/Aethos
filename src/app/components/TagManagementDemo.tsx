/**
 * Tag Management Demo Component
 * Showcases tag-based workspace auto-sync functionality
 */

import { useState } from 'react';
import { Asset, SyncRule, Workspace } from '../types/aethos.types';
import { BulkTagEditor } from './BulkTagEditor';
import { FileTagEditor } from './FileTagEditor';
import { SyncRuleEditor } from './SyncRuleEditor';
import { TagCloud } from './TagCloud';
import { GlassCard } from './GlassCard';
import { Tags, Sparkles, Settings, RefreshCw, CheckCircle2 } from 'lucide-react';

// Mock data
const mockAssets: Asset[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    sourceProvider: 'microsoft',
    sourceId: 'sp-001',
    sourceUrl: 'https://sharepoint.com/sites/marketing/doc1',
    name: 'Q1-2026-Marketing-Plan.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    sizeBytes: 2500000,
    authorEmail: 'sarah@company.com',
    authorName: 'Sarah Thompson',
    createdDate: '2026-01-15T10:00:00Z',
    modifiedDate: '2026-02-20T14:30:00Z',
    locationPath: '/Marketing/Campaigns/Q1',
    isSharedExternally: false,
    shareCount: 5,
    permissionType: 'team',
    userTags: ['q1-2026', 'marketing'],
    enrichedTags: ['budget', 'strategy', 'quarterly-plan'],
    enrichedTitle: 'Q1 2026 Marketing Strategy and Budget Plan',
    intelligenceScore: 87,
    isOrphaned: false,
    isDuplicate: false,
    isStale: false,
    lastSyncedAt: '2026-02-27T08:00:00Z',
    syncStatus: 'active',
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    sourceProvider: 'microsoft',
    sourceId: 'sp-002',
    sourceUrl: 'https://sharepoint.com/sites/product/doc2',
    name: 'Product-Launch-Timeline.xlsx',
    type: 'file',
    mimeType: 'application/vnd.ms-excel',
    sizeBytes: 1800000,
    authorEmail: 'john@company.com',
    authorName: 'John Davis',
    createdDate: '2026-01-20T09:00:00Z',
    modifiedDate: '2026-02-25T11:15:00Z',
    locationPath: '/Product/Launch/2026',
    isSharedExternally: false,
    shareCount: 12,
    permissionType: 'org',
    userTags: ['product-launch', 'q1-2026'],
    enrichedTags: ['timeline', 'roadmap', 'approved'],
    enrichedTitle: 'Q1 2026 Product Launch Timeline and Milestones',
    intelligenceScore: 92,
    isOrphaned: false,
    isDuplicate: false,
    isStale: false,
    lastSyncedAt: '2026-02-27T08:00:00Z',
    syncStatus: 'active',
  },
  {
    id: '3',
    tenantId: 'tenant-1',
    sourceProvider: 'microsoft',
    sourceId: 'sp-003',
    sourceUrl: 'https://sharepoint.com/sites/finance/doc3',
    name: 'copy-of-final-DRAFT-v2.docx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 950000,
    authorEmail: 'lisa@company.com',
    authorName: 'Lisa Chen',
    createdDate: '2026-02-10T15:00:00Z',
    modifiedDate: '2026-02-12T16:20:00Z',
    locationPath: '/Finance/Drafts',
    isSharedExternally: false,
    shareCount: 2,
    permissionType: 'private',
    userTags: [],
    enrichedTags: ['budget', 'draft', 'financial-report'],
    enrichedTitle: 'Q1 Financial Report Draft',
    intelligenceScore: 45,
    isOrphaned: false,
    isDuplicate: true,
    isStale: false,
    lastSyncedAt: '2026-02-27T08:00:00Z',
    syncStatus: 'active',
  },
];

const mockWorkspace: Workspace = {
  id: 'workspace-1',
  name: 'Q1 2026 Product Launch',
  description: 'All files related to Q1 product launch planning',
  color: '#00F0FF',
  icon: 'Rocket',
  isAccessible: true,
  steward: 'Sarah Chen',
  path: '/Product/Launch',
  primaryStorage: {
    provider: 'microsoft',
    containerId: 'site-001',
    path: '/Product/Launch',
    name: 'Product Launch Site',
  },
  pinnedItems: [],
  linkedSources: [],
  subscriptions: [],
  members: ['user-1', 'user-2', 'user-3'],
  pulseFeed: [],
  createdAt: '2026-01-10T00:00:00Z',
  updatedAt: '2026-02-27T10:00:00Z',
  intelligenceScore: 85,
  syncRules: [],
};

export function TagManagementDemo() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [showBulkTagEditor, setShowBulkTagEditor] = useState(false);
  const [showSyncRuleEditor, setShowSyncRuleEditor] = useState(false);
  const [syncRules, setSyncRules] = useState<SyncRule[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Get tag cloud data
  const allTags = assets.flatMap((a) => [...a.userTags, ...a.enrichedTags]);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tagCloudData = Object.entries(tagCounts).map(([name, count]) => ({ name, count }));

  // Mock API functions
  const handleUpdateTags = async (
    assetIds: string[],
    tagsToAdd: string[],
    tagsToRemove: string[]
  ) => {
    console.log('Updating tags:', { assetIds, tagsToAdd, tagsToRemove });

    setAssets((prev) =>
      prev.map((asset) => {
        if (!assetIds.includes(asset.id)) return asset;

        const newUserTags = Array.from(
          new Set([...asset.userTags.filter((t) => !tagsToRemove.includes(t)), ...tagsToAdd])
        );

        return { ...asset, userTags: newUserTags };
      })
    );

    // Simulate workspace sync check
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleSaveSyncRule = async (rule: Partial<SyncRule>) => {
    console.log('Saving sync rule:', rule);

    const newRule: SyncRule = {
      id: `rule-${Date.now()}`,
      workspaceId: mockWorkspace.id,
      tenantId: 'tenant-1',
      ruleType: rule.ruleType || 'tag',
      enabled: true,
      tagsIncludeAny: rule.tagsIncludeAny,
      tagsIncludeAll: rule.tagsIncludeAll,
      tagsExclude: rule.tagsExclude,
      locationPath: rule.locationPath,
      fileTypes: rule.fileTypes,
      excludeLocations: rule.excludeLocations,
      autoAdd: rule.autoAdd ?? true,
      autoRemove: rule.autoRemove ?? false,
      maxFiles: rule.maxFiles || 500,
      filesAddedCount: 0,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSyncRules((prev) => [...prev, newRule]);
  };

  const handlePreviewSyncRule = async (rule: Partial<SyncRule>) => {
    console.log('Previewing sync rule:', rule);

    // Mock matching logic
    const matchingAssets = assets.filter((asset) => {
      if (rule.ruleType === 'tag') {
        const allAssetTags = [...asset.userTags, ...asset.enrichedTags];

        const matchesIncludeAny =
          !rule.tagsIncludeAny ||
          rule.tagsIncludeAny.length === 0 ||
          rule.tagsIncludeAny.some((tag) => allAssetTags.includes(tag));

        const matchesIncludeAll =
          !rule.tagsIncludeAll ||
          rule.tagsIncludeAll.length === 0 ||
          rule.tagsIncludeAll.every((tag) => allAssetTags.includes(tag));

        const matchesExclude =
          !rule.tagsExclude ||
          rule.tagsExclude.length === 0 ||
          !rule.tagsExclude.some((tag) => allAssetTags.includes(tag));

        return matchesIncludeAny && matchesIncludeAll && matchesExclude;
      }

      return false;
    });

    return {
      matchCount: matchingAssets.length,
      sampleFiles: matchingAssets.slice(0, 5).map((a) => a.name),
    };
  };

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredAssets = filterTag
    ? assets.filter((a) => [...a.userTags, ...a.enrichedTags].includes(filterTag))
    : assets;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tags className="w-10 h-10 text-[#00F0FF]" />
            <h1 className="text-4xl font-bold text-white">Tag Management & Auto-Sync Demo</h1>
          </div>
          <p className="text-lg text-[#94A3B8]">
            Showcasing tag-based workspace organization and smart auto-sync rules
          </p>
        </div>

        {/* Workspace Overview */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                📁 Workspace: {mockWorkspace.name}
              </h2>
              <p className="text-[#94A3B8]">{mockWorkspace.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-[#64748B]">Intelligence Score</div>
                <div className="text-2xl font-bold text-[#00F0FF]">
                  {mockWorkspace.intelligenceScore}%
                </div>
              </div>
              <button
                onClick={() => setShowSyncRuleEditor(true)}
                className="bg-[#00F0FF] text-[#0B0F19] px-6 py-3 rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Add Sync Rule
              </button>
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              🏷️ Tag Cloud (most common tags):
            </h3>
            <TagCloud tags={tagCloudData} onFilterByTag={setFilterTag} />
          </div>

          {/* Active Sync Rules */}
          {syncRules.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#334155]">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#00F0FF]" />
                Active Auto-Sync Rules: {syncRules.length}
              </h3>
              <div className="space-y-3">
                {syncRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="bg-[#1E293B]/30 border border-[#334155] rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-white">
                            {rule.ruleType === 'tag' ? '🏷️ Tag-based' : '📁 Location-based'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              rule.enabled
                                ? 'bg-[#00F0FF]/20 text-[#00F0FF]'
                                : 'bg-[#64748B]/20 text-[#64748B]'
                            }`}
                          >
                            {rule.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        {rule.tagsIncludeAny && rule.tagsIncludeAny.length > 0 && (
                          <div className="text-sm text-[#94A3B8] mb-1">
                            Include ANY: {rule.tagsIncludeAny.join(', ')}
                          </div>
                        )}
                        {rule.tagsIncludeAll && rule.tagsIncludeAll.length > 0 && (
                          <div className="text-sm text-[#94A3B8] mb-1">
                            Must also have: {rule.tagsIncludeAll.join(', ')}
                          </div>
                        )}
                        {rule.tagsExclude && rule.tagsExclude.length > 0 && (
                          <div className="text-sm text-[#FF5733]">
                            Exclude: {rule.tagsExclude.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#64748B]">Files Added</div>
                        <div className="text-lg font-semibold text-[#00F0FF]">
                          {rule.filesAddedCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Assets List */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              📄 Assets ({filteredAssets.length} {filterTag && `matching "${filterTag}"`})
            </h2>
            {selectedAssets.length > 0 && (
              <button
                onClick={() => setShowBulkTagEditor(true)}
                className="bg-[#00F0FF] text-[#0B0F19] px-6 py-3 rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all flex items-center gap-2"
              >
                <Tags className="w-5 h-5" />
                Bulk Tag ({selectedAssets.length} selected)
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssets.includes(asset.id);
              const isDetailView = selectedAssetForDetail?.id === asset.id;

              return (
                <div
                  key={asset.id}
                  className={`bg-[#1E293B]/50 border rounded-lg p-4 transition-all ${
                    isSelected
                      ? 'border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'border-[#334155]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAssetSelection(asset.id)}
                      className="mt-1 w-5 h-5 rounded border-[#334155] bg-[#1E293B] text-[#00F0FF] focus:ring-[#00F0FF]/50"
                    />

                    {/* File Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-white mb-1">{asset.name}</h3>
                          <p className="text-sm text-[#94A3B8]">
                            {asset.enrichedTitle || 'No enriched title'}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setSelectedAssetForDetail(isDetailView ? null : asset)
                          }
                          className="text-sm text-[#00F0FF] hover:underline"
                        >
                          {isDetailView ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>

                      {/* Tags Preview */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {asset.userTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] px-2 py-0.5 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {asset.enrichedTags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 bg-[#1E293B]/50 border border-[#334155] text-[#94A3B8] px-2 py-0.5 rounded-full text-xs"
                          >
                            <Sparkles className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-4 gap-4 text-xs text-[#64748B]">
                        <div>
                          <div>Author: {asset.authorName}</div>
                        </div>
                        <div>
                          <div>Location: {asset.locationPath}</div>
                        </div>
                        <div>
                          <div>
                            Size: {(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        <div>
                          <div>Intelligence: {asset.intelligenceScore}%</div>
                        </div>
                      </div>

                      {/* Detail View */}
                      {isDetailView && (
                        <div className="mt-4 pt-4 border-t border-[#334155]">
                          <FileTagEditor
                            asset={asset}
                            onUpdateTags={async (id, add, remove) => {
                              await handleUpdateTags([id], add, remove);
                            }}
                            workspacesUsingTags={[
                              {
                                id: 'workspace-1',
                                name: 'Q1 2026 Product Launch',
                                matchingTags: asset.userTags.filter((t) =>
                                  ['q1-2026', 'product-launch'].includes(t)
                                ),
                              },
                            ]}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-6">
          <GlassCard>
            <div className="text-center">
              <div className="text-4xl mb-3">🏷️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Tag Suggestions</h3>
              <p className="text-sm text-[#94A3B8]">
                AI enriches files with intelligent tags based on content and context
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h3 className="text-lg font-semibold text-white mb-2">Auto-Sync Rules</h3>
              <p className="text-sm text-[#94A3B8]">
                Workspaces automatically organize based on tag-based criteria
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-semibold text-white mb-2">Bulk Operations</h3>
              <p className="text-sm text-[#94A3B8]">
                Tag multiple files at once for efficient metadata management
              </p>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      {showBulkTagEditor && (
        <BulkTagEditor
          selectedAssets={assets.filter((a) => selectedAssets.includes(a.id))}
          onUpdateTags={handleUpdateTags}
          onClose={() => {
            setShowBulkTagEditor(false);
            setSelectedAssets([]);
          }}
        />
      )}

      {showSyncRuleEditor && (
        <SyncRuleEditor
          workspaceId={mockWorkspace.id}
          onSave={handleSaveSyncRule}
          onPreview={handlePreviewSyncRule}
          onClose={() => setShowSyncRuleEditor(false)}
        />
      )}
    </div>
  );
}
