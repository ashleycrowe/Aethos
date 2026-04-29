/**
 * Tag Management Flow Demo - Complete User Journey
 * Shows all entry points and user flows for tag-based workspace auto-sync
 */

import { useState } from 'react';
import { Asset, SyncRule, Workspace } from '../types/aethos.types';
import { WorkspaceCreationWizard } from './WorkspaceCreationWizard';
import { PendingApprovalsPanel } from './PendingApprovalsPanel';
import { AutoWorkspaceSuggestion } from './AutoWorkspaceSuggestion';
import { WorkspaceSettingsPanel } from './WorkspaceSettingsPanel';
import { BulkTagEditor } from './BulkTagEditor';
import { GlassCard } from './GlassCard';
import { Play, FolderPlus, Tag, Settings as SettingsIcon, Bell, Sparkles } from 'lucide-react';

// Mock data - same as TagManagementDemo
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
    name: 'Budget-Report-2026.docx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 950000,
    authorEmail: 'lisa@company.com',
    authorName: 'Lisa Chen',
    createdDate: '2026-02-10T15:00:00Z',
    modifiedDate: '2026-02-12T16:20:00Z',
    locationPath: '/Finance/Reports',
    isSharedExternally: false,
    shareCount: 2,
    permissionType: 'team',
    userTags: ['q1-2026', 'budget'],
    enrichedTags: ['financial-report', 'approved'],
    enrichedTitle: 'Q1 2026 Budget Report',
    intelligenceScore: 78,
    isOrphaned: false,
    isDuplicate: false,
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
  syncRules: [
    {
      id: 'rule-1',
      workspaceId: 'workspace-1',
      tenantId: 'tenant-1',
      ruleType: 'tag',
      enabled: true,
      tagsIncludeAny: ['q1-2026', 'product-launch'],
      tagsExclude: ['draft', 'archived'],
      autoAdd: true,
      autoRemove: false,
      maxFiles: 500,
      filesAddedCount: 2,
      createdBy: 'user-1',
      createdAt: '2026-01-10T10:00:00Z',
      updatedAt: '2026-02-27T08:00:00Z',
      lastRun: '2026-02-27T08:00:00Z',
    },
  ],
};

const mockPendingAssets = [
  {
    ...mockAssets[2],
    addedAt: '2026-02-27T14:00:00Z',
    matchReason: 'Tags [q1-2026, budget]',
    matchedTags: ['q1-2026', 'budget'],
  },
];

export function TagManagementFlowDemo() {
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showBulkTagEditor, setShowBulkTagEditor] = useState(false);
  const [showWorkspaceSuggestion, setShowWorkspaceSuggestion] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([mockWorkspace]);

  // Flow handlers
  const handleStartCreationWizard = () => {
    setActiveFlow('creation-wizard');
  };

  const handleCompletionCreation = (workspace: any) => {
    console.log('Workspace created:', workspace);
    setActiveFlow('success');
    setTimeout(() => setActiveFlow(null), 3000);
  };

  const handleStartBulkTag = () => {
    setSelectedAssets(['1', '2']);
    setShowBulkTagEditor(true);
  };

  const handleCompleteBulkTag = async (
    assetIds: string[],
    tagsToAdd: string[],
    tagsToRemove: string[]
  ) => {
    console.log('Bulk tagging:', { assetIds, tagsToAdd, tagsToRemove });
    setAssets((prev) =>
      prev.map((asset) => {
        if (!assetIds.includes(asset.id)) return asset;
        const newUserTags = Array.from(
          new Set([...asset.userTags.filter((t) => !tagsToRemove.includes(t)), ...tagsToAdd])
        );
        return { ...asset, userTags: newUserTags };
      })
    );
    setShowBulkTagEditor(false);
    
    // Show workspace suggestion after tagging
    setTimeout(() => {
      setShowWorkspaceSuggestion(true);
    }, 500);
  };

  const handleViewPendingApprovals = () => {
    setActiveFlow('pending-approvals');
  };

  const handleViewWorkspaceSettings = () => {
    setActiveFlow('workspace-settings');
  };

  const handleApproveFiles = (assetIds: string[]) => {
    console.log('Approved files:', assetIds);
    setActiveFlow(null);
  };

  const handleRejectFiles = (assetIds: string[]) => {
    console.log('Rejected files:', assetIds);
  };

  const handleRejectAndBlockTag = (assetId: string, tag: string) => {
    console.log('Rejected and blocked tag:', { assetId, tag });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-[#00F0FF]" />
            <h1 className="text-4xl font-bold text-white">Tag Management - Complete User Flow</h1>
          </div>
          <p className="text-lg text-[#94A3B8] mb-2">
            Interactive demonstration of all entry points and workflows
          </p>
          <p className="text-sm text-[#64748B]">
            Click any flow below to see it in action
          </p>
        </div>

        {/* Flow Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Flow 1: Creation Wizard */}
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                <FolderPlus className="w-6 h-6 text-[#00F0FF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Flow 1: Workspace Creation Wizard
                </h3>
                <p className="text-sm text-[#94A3B8] mb-4">
                  Create a new workspace and choose Smart/Manual/Hybrid organization. Set up tag-based rules and review matching files before finalizing.
                </p>
                <ul className="text-xs text-[#64748B] mb-4 space-y-1">
                  <li>• Step 1: Basic workspace info</li>
                  <li>• Step 2: Choose Smart/Manual/Hybrid</li>
                  <li>• Step 3: Configure sync rules</li>
                  <li>• Step 4: Review & approve matches</li>
                </ul>
                <button
                  onClick={handleStartCreationWizard}
                  className="w-full px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Try This Flow
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Flow 2: Bulk Tag → Suggestion */}
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                <Tag className="w-6 h-6 text-[#00F0FF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Flow 2: Bulk Tag → Smart Suggestion
                </h3>
                <p className="text-sm text-[#94A3B8] mb-4">
                  Tag multiple files in Discovery module. After tagging, Aethos suggests workspaces that match the tags and offers to add files automatically.
                </p>
                <ul className="text-xs text-[#64748B] mb-4 space-y-1">
                  <li>• Select files in Discovery</li>
                  <li>• Bulk tag with relevant tags</li>
                  <li>• Smart popup suggests workspaces</li>
                  <li>• Add to workspace or create new</li>
                </ul>
                <button
                  onClick={handleStartBulkTag}
                  className="w-full px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Try This Flow
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Flow 3: Pending Approvals */}
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-[#00F0FF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Flow 3: Pending Approvals Queue
                </h3>
                <p className="text-sm text-[#94A3B8] mb-4">
                  Review files that auto-synced to workspace in last 24 hours. Approve, reject, or block specific tags from future auto-sync.
                </p>
                <ul className="text-xs text-[#64748B] mb-4 space-y-1">
                  <li>• Notification appears in workspace</li>
                  <li>• Review pending files</li>
                  <li>• Approve/reject individually or in bulk</li>
                  <li>• Block tags to prevent future matches</li>
                </ul>
                <button
                  onClick={handleViewPendingApprovals}
                  className="w-full px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Try This Flow
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Flow 4: Workspace Settings */}
          <GlassCard>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                <SettingsIcon className="w-6 h-6 text-[#00F0FF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Flow 4: Workspace Settings
                </h3>
                <p className="text-sm text-[#94A3B8] mb-4">
                  Add auto-sync rules to existing workspace. Configure auto-approval behavior and manage active/inactive rules.
                </p>
                <ul className="text-xs text-[#64748B] mb-4 space-y-1">
                  <li>• Open workspace settings</li>
                  <li>• Add/edit/delete sync rules</li>
                  <li>• Configure auto-approval mode</li>
                  <li>• Set safety limits</li>
                </ul>
                <button
                  onClick={handleViewWorkspaceSettings}
                  className="w-full px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Try This Flow
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Key Benefits */}
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4">🎯 Why This Flow Matters</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl mb-2">🚫</div>
              <h4 className="text-white font-medium mb-2">Prevents Churn</h4>
              <p className="text-sm text-[#94A3B8]">
                Workspaces become operational tools, not just cleanup projects. Ongoing value = retention.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="text-white font-medium mb-2">Creates Lock-In</h4>
              <p className="text-sm text-[#94A3B8]">
                AI enriches files → Tags drive workspaces → Teams rely on smart aggregation daily.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h4 className="text-white font-medium mb-2">+33% ARR</h4>
              <p className="text-sm text-[#94A3B8]">
                Retention increases from 60% to 80% when tag-based sync is the primary organization method.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Design Decisions */}
        <GlassCard>
          <h3 className="text-xl font-semibold text-white mb-4">💡 Key UX Design Decisions</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0 text-[#00F0FF] font-bold text-xs">
                1
              </div>
              <div>
                <p className="text-white font-medium mb-1">Review Before Auto-Add (Default)</p>
                <p className="text-[#94A3B8]">
                  Files go to "Pending" queue by default. Users must explicitly choose "Auto-Approve All" for instant adds. Prevents workspace bloat.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0 text-[#00F0FF] font-bold text-xs">
                2
              </div>
              <div>
                <p className="text-white font-medium mb-1">Smart Suggestions After Bulk Tag</p>
                <p className="text-[#94A3B8]">
                  When users tag files, immediately show workspace suggestions. This creates "aha!" moments and trains users that better tags = better organization.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0 text-[#00F0FF] font-bold text-xs">
                3
              </div>
              <div>
                <p className="text-white font-medium mb-1">Block Tag Option</p>
                <p className="text-[#94A3B8]">
                  When rejecting a file, users can block the specific tag that caused the match. This refines rules over time without manual editing.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0 text-[#00F0FF] font-bold text-xs">
                4
              </div>
              <div>
                <p className="text-white font-medium mb-1">Preview Before Enabling Rule</p>
                <p className="text-[#94A3B8]">
                  Always show match count and sample files before creating a rule. Users can see if their criteria are too broad (e.g., 2,000 matches) before committing.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Flow Modals */}
      {activeFlow === 'creation-wizard' && (
        <WorkspaceCreationWizard
          onClose={() => setActiveFlow(null)}
          onComplete={handleCompletionCreation}
          availableAssets={assets}
        />
      )}

      {activeFlow === 'pending-approvals' && (
        <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-8">
          <PendingApprovalsPanel
            workspaceName={mockWorkspace.name}
            pendingAssets={mockPendingAssets}
            onApprove={handleApproveFiles}
            onReject={handleRejectFiles}
            onRejectAndBlockTag={handleRejectAndBlockTag}
            onClose={() => setActiveFlow(null)}
          />
        </div>
      )}

      {activeFlow === 'workspace-settings' && (
        <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-8 overflow-y-auto">
          <WorkspaceSettingsPanel
            workspaceName={mockWorkspace.name}
            syncRules={mockWorkspace.syncRules || []}
            pendingApprovalsCount={1}
            onAddRule={() => console.log('Add rule')}
            onEditRule={(id) => console.log('Edit rule:', id)}
            onDeleteRule={(id) => console.log('Delete rule:', id)}
            onToggleRule={(id, enabled) => console.log('Toggle rule:', id, enabled)}
            onViewPendingApprovals={handleViewPendingApprovals}
            onClose={() => setActiveFlow(null)}
          />
        </div>
      )}

      {activeFlow === 'success' && (
        <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#00F0FF]/10 border border-[#00F0FF] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#00F0FF]/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#00F0FF]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Workspace Created!</h3>
            <p className="text-[#94A3B8]">Files auto-syncing based on your rules</p>
          </div>
        </div>
      )}

      {showBulkTagEditor && (
        <BulkTagEditor
          selectedAssets={assets.filter((a) => selectedAssets.includes(a.id))}
          onUpdateTags={handleCompleteBulkTag}
          onClose={() => setShowBulkTagEditor(false)}
        />
      )}

      {showWorkspaceSuggestion && (
        <AutoWorkspaceSuggestion
          suggestions={[
            {
              workspaceId: 'workspace-1',
              workspaceName: 'Q1 2026 Product Launch',
              matchedRuleName: 'Tag-based: [q1-2026, product-launch]',
              matchedTags: ['q1-2026', 'product-launch'],
              fileCount: 2,
            },
          ]}
          newFilesCount={2}
          onAddToWorkspace={(id) => {
            console.log('Add to workspace:', id);
            setShowWorkspaceSuggestion(false);
          }}
          onCreateNewWorkspace={() => {
            console.log('Create new workspace');
            setShowWorkspaceSuggestion(false);
            handleStartCreationWizard();
          }}
          onDismiss={() => setShowWorkspaceSuggestion(false)}
        />
      )}
    </div>
  );
}
