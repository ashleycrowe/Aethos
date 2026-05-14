import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  ChevronRight,
  Grid as GridIcon,
  List,
  FileText,
  Clock,
  Trash2,
  Target as TargetIcon,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  ArrowRight,
  MessageSquare,
  History,
  TrendingDown,
  Layout,
  ExternalLink,
  Users,
  Share2,
  Globe,
  Slack,
  Link2,
  Shield,
  Eye,
  Lock,
  MoreVertical,
  Edit3,
  Upload,
  Pin,
  MoreHorizontal,
  PlusCircle,
  RefreshCcw,
  AlertCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import { createWorkspace, getWorkspaceDetail, listWorkspaces, searchFiles } from '@/lib/api';
import { isDemoModeEnabled } from '@/app/config/demoMode';
import { useAethos } from '@/app/context/AethosContext';
import { useAuth } from '@/app/context/AuthContext';
import { Asset, PinnedArtifact, SyncRule, Workspace } from '@/app/types/aethos.types';
import { WorkspaceCreationWizard } from './WorkspaceCreationWizard';
import { WorkspaceSyncManager } from './WorkspaceSyncManager';
import { ArtifactWizard } from './ArtifactWizard';
import { ResourceSynthesizer } from './ResourceSynthesizer';
import { useTheme } from '@/app/context/ThemeContext';
import { useOracle } from '@/app/context/OracleContext';
import { useUser } from '@/app/context/UserContext';
import { useVersion } from '@/app/context/VersionContext';
import { PulseCommunicator } from './PulseCommunicator';
import { PulseFeedItem } from './PulseFeedItem';
import { toast } from 'sonner';
import { syncRulesService } from '../services/syncRules.service';
import { syncEngineService } from '../services/syncEngine.service';

const TEST_TENANT_ID = '00000000-0000-0000-0000-000000000101';

const WORKSPACE_PERSONA_LOOP = [
  {
    role: 'Systems Admin',
    label: 'Generate handoff',
    detail: 'Bundle risky, stale, scattered, or unowned files from Discovery.',
  },
  {
    role: 'Context Steward',
    label: 'Curate context',
    detail: 'Pin source-of-truth files, approve suggestions, and route dry-runs.',
  },
  {
    role: 'Knowledge Worker',
    label: 'Consume playlist',
    detail: 'Search trusted working context without hunting across Microsoft 365.',
  },
];

const WORKSPACE_PERSONA_MODES = [
  {
    id: 'admin',
    label: 'Admin Review',
    role: 'Systems Admin',
    headline: 'Handoff risk safely',
    detail: 'Review workspace anchors as a tenant-backed handoff packet before running any remediation path.',
    action: 'Open Review Handoff',
    prompt: (name: string) => `Find externally shared, stale, or ownerless files related to ${name}.`,
  },
  {
    id: 'steward',
    label: 'Steward Curation',
    role: 'Context Steward',
    headline: 'Curate source of truth',
    detail: 'Pin golden-path files, validate metadata suggestions, and turn handoff packets into usable team context.',
    action: 'Curate Anchors',
    prompt: (name: string) => `Find source-of-truth candidates and stale duplicates in ${name}.`,
  },
  {
    id: 'worker',
    label: 'Team View',
    role: 'Knowledge Worker',
    headline: 'Find trusted context',
    detail: 'Use the workspace as a focused playlist of current files without caring where Microsoft 365 stores them.',
    action: 'Search Workspace Files',
    prompt: (name: string) => `Find trusted files related to ${name}.`,
  },
] as const;

type WorkspacePersonaModeId = typeof WORKSPACE_PERSONA_MODES[number]['id'];

const WORKSPACE_REVIEW_STATUS_LABELS: Record<NonNullable<Workspace['stewardship']>['reviewStatus'], string> = {
  admin_review: 'Admin Review',
  steward_review: 'Steward Review',
  team_ready: 'Team Ready',
  archived: 'Archived',
};

function getPermissionBridgeState(file: Record<string, any>, stewardship?: Workspace['stewardship']): PinnedArtifact['permissionBridge'] {
  const stewardEmail = stewardship?.stewardOwnerEmail?.toLowerCase();
  const ownerEmail = file.ownerEmail || file.owner_email || null;
  const ownerName = file.ownerName || file.owner_name || null;
  const externalUserCount = file.externalUserCount || file.external_user_count || 0;
  const sourceUrl = file.url || file.webUrl || file.web_url || null;

  if (!stewardEmail) {
    return {
      stewardAccess: 'unknown',
      reason: 'Assign a steward to run permission parity.',
      ownerEmail,
      ownerName,
      externalUserCount,
      sourceUrl,
    };
  }

  if (!ownerEmail) {
    return {
      stewardAccess: 'owner_review_required',
      reason: 'Owner metadata is missing, so access must be reviewed by IT or the source system owner.',
      ownerEmail,
      ownerName,
      externalUserCount,
      sourceUrl,
    };
  }

  if (ownerEmail.toLowerCase() === stewardEmail) {
    return {
      stewardAccess: 'can_access',
      reason: 'Steward appears to be the recorded owner.',
      ownerEmail,
      ownerName,
      externalUserCount,
      sourceUrl,
    };
  }

  return {
    stewardAccess: 'access_missing',
    reason: 'Stewardship does not grant source access. Request access through the file owner or Microsoft 365.',
    ownerEmail,
    ownerName,
    externalUserCount,
    sourceUrl,
  };
}

const getPermissionBridgeLabel = (state?: PinnedArtifact['permissionBridge']) => {
  switch (state?.stewardAccess) {
    case 'can_access':
      return 'Steward Visible';
    case 'access_missing':
      return 'Access Gap';
    case 'owner_review_required':
      return 'Owner Review';
    default:
      return 'Access Unknown';
  }
};

function fileTypeFromMime(mimeType?: string): PinnedArtifact['type'] {
  if (!mimeType) return 'document';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  return 'document';
}

function toWorkspace(row: any): Workspace {
  const detailItems = row.items || [];
  const stewardship: NonNullable<Workspace['stewardship']> = {
    stewardOwnerEmail: row.stewardOwnerEmail || row.steward_owner_email || null,
    stewardOwnerName: row.stewardOwnerName || row.steward_owner_name || null,
    reviewStatus: row.reviewStatus || row.review_status || 'admin_review',
    handoffReasonCodes: row.handoffReasonCodes || row.handoff_reason_codes || [],
    sourceOfTruthItemIds: row.sourceOfTruthItemIds || row.source_of_truth_item_ids || [],
    suggestionDecisions: row.suggestionDecisions || row.suggestion_decisions || {},
    stewardNotes: row.stewardNotes || row.steward_notes || null,
  };
  const pinnedItems: PinnedArtifact[] = detailItems.map((item: any) => {
    const file = item.file || {};
    return {
      id: item.id,
      type: fileTypeFromMime(file.mimeType),
      title: file.aiSuggestedTitle || file.name || 'Untitled resource',
      provider: 'microsoft',
      url: file.url || '#',
      aethosNote: file.aiCategory ? `Category: ${file.aiCategory}` : undefined,
      category: item.pinned ? 'critical' : 'reference',
      syncStatus: 'synced',
      pinnedAt: item.addedAt || row.createdAt || new Date().toISOString(),
      permissionBridge: getPermissionBridgeState(file, stewardship),
      sourceMetadata: file,
    };
  });

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color || '#00F0FF',
    icon: row.icon || 'Target',
    primaryStorage: {
      provider: 'microsoft',
      containerId: `workspace-${row.id}`,
      path: `/Aethos Workspaces/${row.name}`,
      name: `${row.name} Storage`,
    },
    pinnedItems,
    linkedSources: [],
    subscriptions: [],
    members: [],
    pulseFeed: [],
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
    updatedAt: row.updatedAt || row.updated_at || new Date().toISOString(),
    intelligenceScore: Math.round(row.stats?.avgIntelligenceScore || 0),
    syncRules: [],
    stewardship,
  };
}

type WorkspacePreviewFile = {
  id: string;
  tenant_id?: string;
  provider?: string | null;
  provider_type?: string | null;
  drive_item_id?: string | null;
  web_url?: string | null;
  name?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  owner_email?: string | null;
  owner_name?: string | null;
  modified_at?: string | null;
  created_at?: string | null;
  path?: string | null;
  has_external_share?: boolean | null;
  external_user_count?: number | null;
  ai_tags?: string[] | null;
  ai_category?: string | null;
  ai_suggested_title?: string | null;
  intelligence_score?: number | null;
  is_orphaned?: boolean | null;
  is_stale?: boolean | null;
};

function toPreviewAsset(file: WorkspacePreviewFile): Asset {
  return {
    id: file.id,
    tenantId: file.tenant_id || '',
    sourceProvider: 'microsoft',
    sourceId: file.drive_item_id || file.id,
    sourceUrl: file.web_url || '#',
    name: file.ai_suggested_title || file.name || 'Untitled file',
    type: 'file',
    mimeType: file.mime_type || undefined,
    sizeBytes: file.size_bytes || 0,
    authorEmail: file.owner_email || undefined,
    authorName: file.owner_name || undefined,
    createdDate: file.created_at || file.modified_at || new Date().toISOString(),
    modifiedDate: file.modified_at || file.created_at || new Date().toISOString(),
    locationPath: file.path || 'Microsoft 365',
    isSharedExternally: Boolean(file.has_external_share),
    shareCount: file.external_user_count || 0,
    permissionType: file.has_external_share ? 'public' : 'team',
    userTags: [],
    enrichedTags: file.ai_tags || [],
    enrichedTitle: file.ai_suggested_title || undefined,
    intelligenceScore: file.intelligence_score || 0,
    isOrphaned: Boolean(file.is_orphaned),
    isDuplicate: false,
    isStale: Boolean(file.is_stale),
    lastSyncedAt: file.modified_at || new Date().toISOString(),
    syncStatus: 'active',
  };
}

function openRemediation(issue?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab: 'archival', issue },
  }));
}

export const WorkspaceEngine = () => {
  const { state: { workspaces }, unpinFromWorkspace, updateWorkspace, validatePointers, addWorkspace } = useAethos();
  const { isDaylight } = useTheme();
  const { setIsOpen: setOracleOpen, search: oracleSearch } = useOracle();
  const { user } = useUser();
  const { tenantId, userId, getAccessToken } = useAuth();
  const { isDemoMode: globalDemoMode } = useVersion();
  const activeTenantId = tenantId || TEST_TENANT_ID;

  // API state management
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(isDemoModeEnabled());
  const [apiWorkspaces, setApiWorkspaces] = useState<Workspace[]>([]);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSyncManagerOpen, setIsSyncManagerOpen] = useState(false);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<PinnedArtifact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'lattice' | 'pulse' | 'forensic'>('pulse');
  const [personaModeId, setPersonaModeId] = useState<WorkspacePersonaModeId>('admin');
  const [isSyncing, setIsSyncing] = useState(false);

  // Use API data if available, otherwise fall back to context
  const effectiveWorkspaces = isDemoMode ? workspaces : apiWorkspaces;
  const selectedWorkspace = effectiveWorkspaces.find(ws => ws.id === selectedWorkspaceId);

  const { state: { containers: allContainers }, tickRetention } = useAethos();

  // Fetch workspaces from API on component mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (globalDemoMode) {
        setIsDemoMode(true);
        setIsLoading(false);
        if (!selectedWorkspaceId && workspaces.length > 0) {
          setSelectedWorkspaceId(workspaces[0].id);
        }
        return;
      }

      try {
        setIsLoading(true);
        setIsDemoMode(false);
        setWorkspaceError(null);

        const accessToken = await getAccessToken();
        const response = await listWorkspaces({ tenantId: activeTenantId, accessToken });

        if (response.success) {
          const normalizedWorkspaces = response.workspaces.map(toWorkspace);
          setApiWorkspaces(normalizedWorkspaces);
          // Set the first workspace as selected if none selected
          if (!selectedWorkspaceId && normalizedWorkspaces.length > 0) {
            setSelectedWorkspaceId(normalizedWorkspaces[0].id);
          }
        } else {
          throw new Error('API returned unsuccessful response');
        }

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch live workspaces';
        console.warn('Failed to fetch live workspaces:', err);
        setWorkspaceError(message);
        setApiWorkspaces([]);
        setSelectedWorkspaceId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [activeTenantId, globalDemoMode]);

  // Fetch workspace details when selected workspace changes
  useEffect(() => {
    const fetchWorkspaceDetail = async () => {
      if (!selectedWorkspaceId || isDemoMode) return;

      try {
        const response = await getWorkspaceDetail({
          tenantId: activeTenantId,
          workspaceId: selectedWorkspaceId,
          accessToken: await getAccessToken(),
        });

        if (response.success) {
          setApiWorkspaces((current) =>
            current.map((workspace) =>
              workspace.id === response.workspace.id ? toWorkspace(response.workspace) : workspace
            )
          );
        }
      } catch (err) {
        console.warn('Failed to fetch workspace details:', err);
      }
    };

    fetchWorkspaceDetail();
  }, [selectedWorkspaceId, isDemoMode, activeTenantId]);

  const handleSync = async () => {
    setIsSyncing(true);
    await validatePointers();
    setIsSyncing(false);
  };

  const handleCreateWorkspace = async (data: {
    name: string;
    description: string;
    contentMethod: 'smart' | 'manual' | 'hybrid';
    syncRules?: Partial<SyncRule>[];
    selectedAssets?: string[];
  }) => {
    try {
      const tags = data.syncRules?.flatMap((rule) => rule.tagsIncludeAny || []) || [];

      if (!isDemoMode) {
        const response = await createWorkspace({
          tenantId: activeTenantId,
          name: data.name,
          description: data.description,
          icon: 'Target',
          color: '#00F0FF',
          tags,
          autoSyncEnabled: data.contentMethod !== 'manual',
          syncRules: data.syncRules?.[0] as Record<string, unknown> | undefined,
          accessToken: await getAccessToken(),
        });

        const normalizedWorkspace = toWorkspace({
          ...response.workspace,
          tags: response.workspace.tags || tags,
          createdAt: response.workspace.created_at,
          updatedAt: response.workspace.updated_at,
          lastSyncAt: response.workspace.last_sync_at,
        });

        setApiWorkspaces((current) => [normalizedWorkspace, ...current]);
        setIsWizardOpen(false);
        setSelectedWorkspaceId(normalizedWorkspace.id);

        toast.success(`Workspace "${data.name}" created successfully`, {
          description: response.syncedCount > 0
            ? `${response.syncedCount} files auto-synced based on tags.`
            : data.contentMethod !== 'manual'
              ? 'Auto-sync enabled.'
              : 'Manual content management.',
        });

        return;
      }

      // Create the base workspace
      const newWorkspace: Workspace = {
        id: `ws-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        description: data.description,
        color: '#00F0FF',
        icon: 'Target',
        primaryStorage: {
          provider: 'microsoft',
          containerId: 'sp-new-auto',
          path: `/Shared Documents/${data.name}`,
          name: `${data.name} Storage`
        },
        pinnedItems: [],
        linkedSources: [],
        subscriptions: [],
        members: [user.id],
        pulseFeed: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        intelligenceScore: 75,
        syncRules: [],
      };

      // Add workspace to context
      addWorkspace(newWorkspace);

      toast.success(`Workspace "${data.name}" created successfully!`, {
        description: data.contentMethod !== 'manual' 
          ? `Auto-sync enabled with ${data.syncRules?.length || 0} rule(s)`
          : 'Manual content management',
      });

      // Close wizard and select new workspace
      setIsWizardOpen(false);
      setSelectedWorkspaceId(newWorkspace.id);

      // TODO: Create sync rules via syncRulesService
      // if (data.syncRules && data.syncRules.length > 0) {
      //   for (const rule of data.syncRules) {
      //     await syncRulesService.createSyncRule(newWorkspace.id, rule);
      //   }
      // }

    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Failed to create workspace', {
        description: error instanceof Error ? error.message : 'Check diagnostics for details.',
      });
    }
  };

  const handlePreviewWorkspaceMatches = async (criteria: {
    ruleType: 'tag' | 'location' | 'author';
    tagsIncludeAny: string[];
    tagsExclude: string[];
    locationPath: string;
  }) => {
    if (isDemoMode) {
      return {
        matchCount: 0,
        totalSizeBytes: 0,
        sampleAssets: [],
      };
    }

    const response = await searchFiles<WorkspacePreviewFile>({
      tenantId: activeTenantId,
      query: criteria.ruleType === 'location' ? criteria.locationPath : '',
      filters: criteria.ruleType === 'tag' ? { tags: criteria.tagsIncludeAny } : {},
      sortBy: 'modified',
      sortOrder: 'desc',
      page: 1,
      pageSize: 10,
      accessToken: await getAccessToken(),
    });

    const sampleAssets = response.results
      .map(toPreviewAsset)
      .filter((asset) => {
        if (criteria.ruleType !== 'tag' || criteria.tagsExclude.length === 0) return true;
        const assetTags = [...asset.userTags, ...asset.enrichedTags];
        return !criteria.tagsExclude.some((tag) => assetTags.includes(tag));
      });

    return {
      matchCount: response.pagination?.totalResults ?? sampleAssets.length,
      totalSizeBytes: sampleAssets.reduce((sum, asset) => sum + asset.sizeBytes, 0),
      sampleAssets,
    };
  };

  const handleOpenWizard = () => {
    // Check trial mode restrictions
    if (user.tier === 'TRIAL' && effectiveWorkspaces.length >= 1) {
      toast.error('Trial Limit Reached', {
        description: 'Upgrade to Base tier to create unlimited workspaces',
        duration: 5000,
      });
      return;
    }
    setIsWizardOpen(true);
  };

  if (!isLoading && effectiveWorkspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-8">
          <TargetIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-slate-900 dark:text-white">No Workspaces Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 max-w-md font-medium leading-relaxed">
          {workspaceError
            ? `Live workspace data could not load: ${workspaceError}`
            : isDemoMode
              ? 'Create an operational workspace to synthesize cross-cloud resources into a unified lattice.'
              : 'No live workspaces exist for this tenant yet. Create a trusted working context that an admin can hand off, a steward can curate, and a team can actually use.'}
        </p>
        <div className="mb-10 grid w-full max-w-4xl grid-cols-1 gap-3 px-4 sm:grid-cols-3">
          {WORKSPACE_PERSONA_LOOP.map((persona) => (
            <div
              key={persona.role}
              className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-left shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">{persona.role}</p>
              <p className="mt-2 text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">{persona.label}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{persona.detail}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={handleOpenWizard}
          className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Create Workspace
        </button>
        <WorkspaceCreationWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onComplete={handleCreateWorkspace}
          onPreviewMatches={!isDemoMode ? handlePreviewWorkspaceMatches : undefined}
        />
      </div>
    );
  }

  const criticalItems = selectedWorkspace?.pinnedItems.filter(item => item.category === 'critical') || [];
  const otherItems = selectedWorkspace?.pinnedItems.filter(item => item.category !== 'critical') || [];
  const accessGapItems = selectedWorkspace?.pinnedItems.filter((item) =>
    ['access_missing', 'owner_review_required', 'unknown'].includes(item.permissionBridge?.stewardAccess || 'unknown')
  ) || [];
  const stewardVisibleItems = selectedWorkspace?.pinnedItems.filter((item) =>
    item.permissionBridge?.stewardAccess === 'can_access'
  ) || [];
  const stewardVisibilityPercent = selectedWorkspace && selectedWorkspace.pinnedItems.length > 0
    ? Math.round((stewardVisibleItems.length / selectedWorkspace.pinnedItems.length) * 100)
    : null;
  const workspaceTabs = [
    { id: 'pulse', label: 'Signal Feed', icon: Activity },
    { id: 'lattice', label: 'Lattice Resources', icon: Database },
    { id: 'forensic', label: isDemoMode ? 'Purge Ops' : 'Review Handoff', icon: ShieldCheck },
  ] as const;
  const liveWorkspaceCoverage = selectedWorkspace
    ? selectedWorkspace.pinnedItems.length > 0
      ? `${Math.min(100, 55 + selectedWorkspace.pinnedItems.length * 10)}/100`
      : 'Pending'
    : 'Pending';
  const activePersonaMode =
    WORKSPACE_PERSONA_MODES.find((mode) => mode.id === personaModeId) || WORKSPACE_PERSONA_MODES[0];

  const handlePersonaAction = () => {
    if (!selectedWorkspace) return;

    if (isDemoMode) {
      setOracleOpen(true);
      oracleSearch(`Summarize the delta between the Excel budget and the latest Slack pivots in ${selectedWorkspace.name}.`);
      return;
    }

    if (activePersonaMode.id === 'admin') {
      setActiveTab('forensic');
      return;
    }

    if (activePersonaMode.id === 'steward') {
      setActiveTab('lattice');
      return;
    }

    setOracleOpen(true);
    oracleSearch(activePersonaMode.prompt(selectedWorkspace.name));
  };

  const copyPermissionRequestPacket = (item: PinnedArtifact) => {
    const owner = item.permissionBridge?.ownerEmail || item.permissionBridge?.ownerName || 'the current file owner';
    const steward = selectedWorkspace?.stewardship?.stewardOwnerEmail || selectedWorkspace?.stewardship?.stewardOwnerName || 'the assigned workspace steward';
    const sourceUrl = item.permissionBridge?.sourceUrl || item.url;
    const packet = [
      `Permission Bridge Request: ${selectedWorkspace?.name}`,
      '',
      `${steward} is assigned to curate this Aethos workspace but may not have source access to:`,
      item.title,
      '',
      `Current owner: ${owner}`,
      `Reason: ${item.permissionBridge?.reason || 'Steward access needs source-system review.'}`,
      sourceUrl && sourceUrl !== '#' ? `Source link: ${sourceUrl}` : 'Source link: unavailable',
      '',
      'Please review access in Microsoft 365. Aethos tracks this visibility gap but does not grant source permissions automatically.',
    ].join('\n');

    void navigator.clipboard?.writeText(packet);
    toast.success('Permission request packet copied', {
      description: 'Send it to the owner or IT for source-system access review.',
    });
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-w-0 space-y-8 overflow-x-hidden pb-16 animate-in fade-in duration-700 md:space-y-10 md:pb-20"
    >
      {/* Loading State */}
      {isLoading && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full animate-spin"></div>
            <span className="text-[#A0A8B8]">Loading workspaces...</span>
          </div>
        </Motion.div>
      )}

      {!isLoading && (
        <>
          {/* Workspace Selection Strip */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 px-2 sm:px-1 -mx-2 sm:mx-0">
        <button 
          onClick={handleOpenWizard}
          className="flex-shrink-0 min-w-[44px] min-h-[44px] rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center hover:border-[#00F0FF] transition-all group"
        >
          <Plus className="w-5 h-5 text-slate-400 group-hover:text-[#00F0FF]" />
        </button>
        <button
          onClick={handleOpenWizard}
          className="flex-shrink-0 min-h-[44px] rounded-xl border border-[#00F0FF]/25 bg-[#00F0FF]/10 px-4 text-[10px] font-black uppercase tracking-[0.14em] text-[#00F0FF] transition-all hover:bg-[#00F0FF]/20 sm:tracking-[0.2em]"
        >
          Create Workspace
        </button>
        {effectiveWorkspaces.map((ws) => (
          <button 
            key={ws.id}
            onClick={() => setSelectedWorkspaceId(ws.id)}
            className={`flex-shrink-0 flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl border transition-all relative ${
              selectedWorkspaceId === ws.id 
                ? 'bg-white dark:bg-white/10 border-slate-900 dark:border-white shadow-lg shadow-[#00F0FF]/5' 
                : 'bg-transparent border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5'
            }`}
          >
            <div className="w-6 h-6 rounded-lg shrink-0" style={{ backgroundColor: ws.color }} />
            <span className={`max-w-[11rem] truncate text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.2em] whitespace-nowrap ${selectedWorkspaceId === ws.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {ws.name}
            </span>
          </button>
        ))}
      </div>

      {selectedWorkspace && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Workspace Column */}
          <div className="lg:col-span-8 space-y-8 md:space-y-10 min-w-0">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-xl shrink-0" style={{ backgroundColor: selectedWorkspace.color }}>
                    <TargetIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 gap-3 min-w-0">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-slate-900 dark:text-white break-words">{selectedWorkspace.name}</h1>
                      {isDemoMode && (
                        <Motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full bg-[#F39C12]/20 text-[#F39C12] border border-[#F39C12]/30"
                        >
                          Demo Mode
                        </Motion.span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                         {isDemoMode ? 'Demo Lattice' : 'Live Tenant Workspace'}
                       </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_#00F0FF]" />
                     </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-full md:max-w-2xl font-medium leading-relaxed italic">
                  "{selectedWorkspace.description || "Operational intelligence layer for cross-tenant collaboration."}"
                </p>
              </div>
              
              <div className={`grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-1.5 rounded-2xl border w-full md:w-auto ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 backdrop-blur-sm md:backdrop-blur-xl'}`}>

                {workspaceTabs.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`min-h-[44px] px-4 sm:px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-2.5 sm:tracking-widest ${
                      activeTab === t.id 
                        ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/10') 
                        : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'pulse' && (
                <Motion.div 
                  key="pulse" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="space-y-8 md:space-y-10"
                >
                  {/* Top Stats Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    <div className={`p-5 md:p-8 rounded-[28px] md:rounded-[36px] border ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4">
                         {isDemoMode ? 'Lattice Density' : 'Trusted Files'}
                       </span>
                       <div className="text-4xl font-black text-[#00F0FF]">{selectedWorkspace.pinnedItems.length}</div>
                       <p className="mt-2 text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 italic sm:tracking-widest">
                         {isDemoMode ? 'Active Pointers' : 'Playlist anchors'}
                       </p>
                    </div>
                    <div className={`p-5 md:p-8 rounded-[28px] md:rounded-[36px] border ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4">
                         {isDemoMode ? 'Integrity Score' : 'Trust Score'}
                       </span>
                       <div className="text-4xl font-black text-white">{selectedWorkspace.intelligenceScore}%</div>
                       <p className="mt-2 text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 italic sm:tracking-widest">
                         {isDemoMode ? 'Operational Fidelity' : 'Owner and freshness signal'}
                       </p>
                    </div>
                    <div className={`p-5 md:p-8 rounded-[28px] md:rounded-[36px] border ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4">
                         {isDemoMode ? 'Sync Velocity' : 'Workspace Coverage'}
                       </span>
                       <div className="text-4xl font-black text-emerald-500">
                         {isDemoMode ? '92/100' : liveWorkspaceCoverage}
                       </div>
                       <p className="mt-2 text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 italic sm:tracking-widest">
                         {isDemoMode ? 'Real-time Pulse' : 'Indexed anchors'}
                       </p>
                    </div>
                  </div>

                  {/* Pulse Activity Stream */}
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 sm:px-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 sm:tracking-[0.4em]">Operational Pulse</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                           <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">Active Sync</span>
                        </div>
                      </div>
                    </div>

                    <PulseCommunicator workspaceId={selectedWorkspace.id} />

                    <div className="space-y-4">
                      {selectedWorkspace.pulseFeed.length > 0 ? (
                        selectedWorkspace.pulseFeed.map((event) => (
                          <PulseFeedItem 
                            key={event.id} 
                            workspaceId={selectedWorkspace.id} 
                            event={event} 
                          />
                        ))
                      ) : (
                        <div className="py-20 text-center space-y-4">
                           <Activity className="w-10 h-10 text-slate-800 mx-auto" />
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 sm:tracking-[0.4em]">No architectural signals detected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Motion.div>
              )}

              {activeTab === 'lattice' && (
                <Motion.div 
                  key="lattice" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="space-y-8 md:space-y-12"
                >
                    {/* Actions Strip */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                       <button 
                         onClick={() => setIsSynthesizerOpen(true)}
                         className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-2xl bg-[#00F0FF] px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-black shadow-xl shadow-[#00F0FF]/20 transition-all hover:scale-105 sm:w-auto sm:px-10 sm:tracking-[0.2em]"
                       >
                          <PlusCircle className="w-5 h-5" /> Synthesize Resource
                       </button>
                       <button 
                         onClick={handleSync}
                         disabled={isSyncing}
                         className={`flex min-h-[44px] w-full items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-[11px] font-black uppercase tracking-[0.14em] transition-all sm:w-auto sm:px-8 sm:tracking-[0.2em] ${isSyncing ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                       >
                          <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Validating Pointers...' : 'Workspace Sync Engine'}
                       </button>
                       <div className="flex-1 relative min-h-[44px]">
                          <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="SEARCH THE LATTICE..." 
                            className="h-full min-h-[52px] w-full rounded-2xl border border-white/5 bg-white/5 pl-14 pr-4 text-[11px] font-black uppercase tracking-[0.12em] text-white outline-none transition-all focus:border-[#00F0FF]/30 sm:min-h-[64px] sm:pl-16 sm:tracking-widest"
                          />
                       </div>
                    </div>

                    {/* Alert for Broken Links */}
                    {selectedWorkspace.pinnedItems.some(i => i.syncStatus === 'broken') && (
                      <Motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 md:p-6 rounded-[28px] md:rounded-[32px] border border-[#FF5733]/40 bg-[#FF5733]/5 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6"
                      >
                         <div className="flex items-start sm:items-center gap-4">
                            <div className="p-3 rounded-2xl bg-[#FF5733]/20 text-[#FF5733]">
                               <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-white uppercase tracking-tight">Pointer Drift Detected</h4>
                               <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FF5733] italic sm:tracking-widest">
                                 {selectedWorkspace.pinnedItems.filter(i => i.syncStatus === 'broken').length} Molecules have moved or lost source connectivity.
                               </p>
                            </div>
                         </div>
                         <button 
                           onClick={handleSync}
                           className="min-h-[44px] w-full rounded-xl bg-[#FF5733] px-6 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-white transition-all hover:scale-105 sm:tracking-widest md:w-auto"
                         >
                            Heal Resource Lattice
                         </button>
                      </Motion.div>
                    )}

                    {!isDemoMode && accessGapItems.length > 0 && (
                      <Motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col justify-between gap-5 rounded-[28px] border border-amber-400/30 bg-amber-400/5 p-5 md:flex-row md:items-center md:gap-6 md:p-6"
                      >
                        <div className="flex items-start gap-4 sm:items-center">
                          <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-300">
                            <Lock className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-black uppercase tracking-tight text-white">Permission Bridge Gaps</h4>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-200 italic sm:tracking-widest">
                              {accessGapItems.length} workspace item{accessGapItems.length === 1 ? '' : 's'} need steward visibility review.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => copyPermissionRequestPacket(accessGapItems[0])}
                          className="min-h-[44px] w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-6 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-amber-100 transition-all hover:bg-amber-300 hover:text-black sm:tracking-widest md:w-auto"
                        >
                          Copy Access Packet
                        </button>
                      </Motion.div>
                    )}

                    {/* Key Resources Section */}
                   <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-0 sm:pl-4">
                         <h3 className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 sm:tracking-[0.4em]">
                            <Pin className="w-4 h-4 text-[#00F0FF]" /> Key Operational Anchors
                         </h3>
                         <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 italic sm:tracking-widest">Pinned for instant forensic access</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {criticalItems.map(item => (
                           <div key={item.id} className={`p-5 sm:p-6 md:p-8 rounded-[28px] md:rounded-[40px] bg-gradient-to-br border flex flex-col group relative overflow-hidden transition-all ${item.syncStatus === 'broken' ? 'from-[#FF5733]/10 to-transparent border-[#FF5733]/40' : 'from-[#00F0FF]/10 to-transparent border-[#00F0FF]/20 hover:border-[#00F0FF]/40'}`}>
                              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                 {item.syncStatus === 'broken' ? <AlertCircle className="w-24 h-24 text-[#FF5733]" /> : <Pin className="w-24 h-24 text-[#00F0FF]" />}
                              </div>
                              <div className="flex justify-between items-start gap-4 mb-8 md:mb-10 relative z-10">
                                 <div className={`p-4 rounded-2xl bg-black/60 border border-white/10 transition-colors ${item.syncStatus === 'broken' ? 'text-[#FF5733]' : 'group-hover:text-[#00F0FF]'}`}>
                                    {item.provider === 'slack' ? <Slack className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                 </div>
                                 <div className="flex gap-2">
                                    {item.permissionBridge?.stewardAccess && item.permissionBridge.stewardAccess !== 'can_access' && (
                                      <div className="flex items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-amber-200 sm:tracking-widest">
                                        {getPermissionBridgeLabel(item.permissionBridge)}
                                      </div>
                                    )}
                                    {item.syncStatus === 'broken' && (
                                      <div className="flex items-center gap-2 rounded-xl border border-[#FF5733]/20 bg-[#FF5733]/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#FF5733] sm:tracking-widest">
                                         Source Drift
                                      </div>
                                    )}
                                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                                 </div>
                              </div>
                              <div className="space-y-4 relative z-10">
                                 <h4 className="break-words text-lg font-black uppercase tracking-tight text-white">{item.title}</h4>
                                 <p className="text-xs text-slate-400 font-medium leading-relaxed italic line-clamp-2">"{item.aethosNote || "Primary operational anchor for project context."}"</p>
                              </div>
                              <div className="mt-8 pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                                 <span className={`break-words text-[9px] font-black uppercase tracking-[0.12em] sm:tracking-[0.2em] ${item.syncStatus === 'broken' ? 'text-[#FF5733]' : 'text-[#00F0FF]'}`}>{item.provider} - {item.type}</span>
                                 <div className="flex items-center gap-2">
                                   {item.syncStatus === 'broken' ? (
                                     <button 
                                       onClick={handleSync}
                                       className="min-h-[44px] rounded-xl bg-[#FF5733] px-4 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-white transition-all hover:scale-105 sm:tracking-widest"
                                     >
                                       Heal Link
                                     </button>
                                   ) : (
                                     <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#00F0FF] hover:text-black transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                     </a>
                                   )}
                                   {item.permissionBridge?.stewardAccess && item.permissionBridge.stewardAccess !== 'can_access' && (
                                     <button
                                       type="button"
                                       onClick={() => copyPermissionRequestPacket(item)}
                                       className="min-h-[44px] rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-amber-200 transition-all hover:bg-amber-300 hover:text-black sm:tracking-widest"
                                     >
                                       Request Access
                                     </button>
                                   )}
                                 </div>
                              </div>
                           </div>
                         ))}
                         {criticalItems.length === 0 && (
                           <div className="md:col-span-2 p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                              <Pin className="w-8 h-8 text-slate-700" />
                              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">Pin artifacts to create Key Operational Anchors</p>
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Other Lattice Resources */}
                   <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-0 sm:pl-4">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 sm:tracking-[0.4em]">Supporting Synthesis</h3>
                         <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">{otherItems.length} Discovered Artifacts</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {otherItems.map(item => (
                            <div key={item.id} className="p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group flex flex-col">
                               <div className="flex items-center justify-between mb-8">
                                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-500 group-hover:text-[#00F0FF] transition-colors">
                                     <Link2 className="w-4 h-4" />
                                  </div>
                                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-600 sm:tracking-widest">{item.provider}</span>
                               </div>
                               <h5 className="mb-3 break-words text-[13px] font-black uppercase tracking-tight text-white">{item.title}</h5>
                               <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mb-6">{item.aethosNote || "Federated resource pointer."}</p>
                               <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                  <span className="text-[8px] font-black uppercase tracking-[0.12em] text-slate-600 sm:tracking-widest">{item.type}</span>
                                  <button onClick={() => unpinFromWorkspace(selectedWorkspace.id, item.id)} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-700 transition-colors hover:text-[#FF5733]">
                                     <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </Motion.div>
              )}

              {activeTab === 'forensic' && isDemoMode && (
                <Motion.div 
                  key="forensic" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="space-y-8 md:space-y-10"
                >
                   {/* Retention Countdown Monitor */}
                   <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 sm:px-4">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">Retention Countdown Monitor</h3>
                         <button 
                           onClick={tickRetention}
                           className="min-h-[44px] text-[9px] font-black uppercase tracking-[0.12em] text-[#00F0FF] transition-colors hover:text-white sm:tracking-widest"
                         >
                            Simulate Day Transition
                         </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {allContainers.filter(c => c.retentionDaysLeft !== undefined).map(c => (
                            <Motion.div
                              key={c.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4 }}
                              className={`bg-[rgba(20,24,36,0.7)] backdrop-blur-sm md:backdrop-blur-[20px] border border-white/10
                                rounded-xl p-5 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
                                border-l-4 ${c.retentionDaysLeft! <= 3 ? 'border-l-[#FF5733]' : 'border-l-[#00F0FF]'}`}
                            >
                               <div className="flex justify-between items-start gap-4 mb-6">
                                  <div className="min-w-0">
                                     <h4 className="text-sm font-black text-white uppercase tracking-tight">{c.title}</h4>
                                     <p className="mt-1 break-words text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">{c.provider} - {c.type}</p>
                                  </div>
                                  <div className="text-right">
                                     <div className={`text-3xl font-black font-['JetBrains_Mono'] ${c.retentionDaysLeft! <= 3 ? 'text-[#FF5733]' : 'text-white'}`}>
                                        {c.retentionDaysLeft}
                                     </div>
                                     <p className="text-[7px] font-black uppercase tracking-[0.12em] text-slate-600 sm:tracking-widest">Days Remaining</p>
                                  </div>
                               </div>
                               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${c.retentionDaysLeft! <= 3 ? 'bg-[#FF5733]' : 'bg-[#00F0FF]'}`} 
                                    style={{ width: `${(c.retentionDaysLeft! / 30) * 100}%` }} 
                                  />
                               </div>
                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                  <span className="break-words text-[8px] font-black uppercase tracking-[0.12em] text-slate-500 italic sm:tracking-widest">Target: Governance_Vault</span>
                                  <button className={`min-h-[44px] w-full rounded-xl px-4 py-2 text-[8px] font-black uppercase tracking-[0.12em] transition-all sm:w-auto sm:tracking-widest ${c.retentionDaysLeft! <= 3 ? 'bg-[#FF5733] text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
                                     {c.retentionDaysLeft! === 0 ? 'Purge Now' : 'Grant Extension'}
                                  </button>
                               </div>
                            </Motion.div>
                         ))}
                      </div>
                   </div>

                   <div className="p-6 md:p-10 rounded-[32px] md:rounded-[48px] border-t-4 border-t-[#FF5733] bg-[#0B0F19] border border-white/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5">
                         <TrendingDown className="w-28 h-28 md:w-40 md:h-40 text-[#FF5733]" />
                      </div>
                      <div className="flex items-start sm:items-center gap-4 md:gap-5 mb-8 md:mb-10 relative z-10">
                         <div className="p-4 rounded-[20px] bg-[#FF5733]/10 text-[#FF5733]">
                            <Trash2 className="w-7 h-7" />
                         </div>
                         <div className="min-w-0">
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Workspace Purge Ops</h3>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 italic sm:tracking-[0.3em]">Identify and eliminate dead capital from the lattice</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10 mb-8 md:mb-12 relative z-10">
                         <div className="p-5 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="mb-4 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">Redundant Bloat</span>
                            <div className="text-3xl md:text-4xl font-black text-[#FF5733]">{isDemoMode ? '1.2 TB' : '0 B'}</div>
                         </div>
                         <div className="p-5 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="mb-4 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">Exposure Risks</span>
                            <div className="text-3xl md:text-4xl font-black text-white">{isDemoMode ? '04' : '0'}</div>
                         </div>
                         <div className="p-5 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="mb-4 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">Orphaned Nodes</span>
                            <div className="text-3xl md:text-4xl font-black text-white">{isDemoMode ? '12' : '0'}</div>
                         </div>
                      </div>

                      <button className="min-h-[44px] w-full rounded-2xl border border-[#FF5733]/30 bg-[#FF5733]/10 px-4 py-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#FF5733] shadow-xl shadow-[#FF5733]/10 transition-all hover:bg-[#FF5733] hover:text-black md:py-6 md:text-[11px] md:tracking-[0.3em]">
                         {isDemoMode ? 'Simulate Global Cleanup Protocol' : 'Run Remediation Dry Run'}
                      </button>
                   </div>
                 </Motion.div>
               )}

              {activeTab === 'forensic' && !isDemoMode && (
                <Motion.div
                  key="live-review-handoff"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8 md:space-y-10"
                >
                  <div className="rounded-[32px] border border-[#00F0FF]/20 bg-[#00F0FF]/[0.03] p-6 shadow-xl md:rounded-[48px] md:p-10">
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="rounded-[20px] bg-[#00F0FF]/10 p-4 text-[#00F0FF]">
                          <ShieldCheck className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                            Review-First Workspace Handoff
                          </h3>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            Live Mode does not simulate retention timers or cleanup results. Use Remediation to run
                            tenant-backed dry runs against indexed Microsoft metadata.
                          </p>
                        </div>
                      </div>
                      <span className="w-fit rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-emerald-400 sm:tracking-widest">
                        Data source: Live tenant
                      </span>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 md:p-8">
                        <span className="mb-4 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                          Anchored Files
                        </span>
                        <div className="text-3xl font-black text-[#00F0FF] md:text-4xl">
                          {selectedWorkspace.pinnedItems.length}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 md:p-8">
                        <span className="mb-4 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                          Critical Anchors
                        </span>
                        <div className="text-3xl font-black text-white md:text-4xl">
                          {criticalItems.length}
                        </div>
                      </div>
                      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 md:p-8">
                        <span className="mb-4 block text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                          Review State
                        </span>
                        <div className="text-3xl font-black text-emerald-500 md:text-4xl">
                          Ready
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openRemediation()}
                      className="min-h-[44px] w-full rounded-2xl border border-[#00F0FF]/30 bg-[#00F0FF] px-4 py-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#0B0F19] shadow-xl shadow-[#00F0FF]/10 transition-all hover:bg-white md:py-6 md:text-[11px] md:tracking-[0.3em]"
                    >
                      Open Remediation Dry Runs
                    </button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Context Sidebar Column */}
          <div className="lg:col-span-4 space-y-8 md:space-y-10 min-w-0">
            {/* Persona Loop */}
            <div className={`p-6 sm:p-8 rounded-[32px] border ${isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-white/[0.02] border-white/10'}`}>
              <div className="flex items-center gap-4">
                <Users className="h-5 w-5 text-[#00F0FF]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.35em]">
                  Workspace Loop
                </h3>
              </div>
              <div className="mt-6 space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                  Persona View Mode
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {WORKSPACE_PERSONA_MODES.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setPersonaModeId(mode.id)}
                      className={`min-h-[44px] rounded-2xl border px-4 py-3 text-left transition-all ${
                        personaModeId === mode.id
                          ? 'border-[#00F0FF]/50 bg-[#00F0FF]/10 text-[#00F0FF]'
                          : 'border-white/5 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="block text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em]">
                        {mode.label}
                      </span>
                      <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.12em] opacity-70 sm:tracking-widest">
                        {mode.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {WORKSPACE_PERSONA_LOOP.map((persona, index) => (
                  <div key={persona.role} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#00F0FF]/25 bg-[#00F0FF]/10 text-[10px] font-black text-[#00F0FF]">
                        {index + 1}
                      </div>
                      {index < WORKSPACE_PERSONA_LOOP.length - 1 && (
                        <div className="mt-2 h-full min-h-6 w-px bg-white/10" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">{persona.role}</p>
                      <p className={`mt-1 text-sm font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{persona.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{persona.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stewardship State */}
            <div className={`rounded-[32px] border p-6 sm:p-8 ${isDaylight ? 'border-slate-100 bg-white shadow-xl' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-5 w-5 text-[#00F0FF]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.35em]">
                  Handoff State
                </h3>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                    Review Status
                  </p>
                  <p className={`mt-1 text-sm font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {WORKSPACE_REVIEW_STATUS_LABELS[selectedWorkspace.stewardship?.reviewStatus || 'admin_review']}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                    Context Steward
                  </p>
                  <p className={`mt-1 break-words text-sm font-black tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedWorkspace.stewardship?.stewardOwnerName || selectedWorkspace.stewardship?.stewardOwnerEmail || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                    Handoff Reasons
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(selectedWorkspace.stewardship?.handoffReasonCodes?.length
                      ? selectedWorkspace.stewardship.handoffReasonCodes
                      : ['manual-review']
                    ).map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-[#00F0FF]"
                      >
                        {reason.replace(/[-_]/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                    Steward Visibility
                  </p>
                  <p className={`mt-1 text-sm font-black uppercase tracking-tight ${accessGapItems.length > 0 ? 'text-amber-200' : isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {stewardVisibilityPercent === null
                      ? 'No Files Yet'
                      : `${stewardVisibilityPercent}% Visible`}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Stewardship is accountability, not source access. Aethos highlights permission gaps and routes requests back to Microsoft 365.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-xs leading-5 text-slate-500">
                    {selectedWorkspace.stewardship?.stewardNotes ||
                      'This workspace can carry a handoff packet from discovery into steward curation before the team consumes it.'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Strategic Synthesis */}
            <div className={`p-6 sm:p-8 md:p-10 rounded-[32px] md:rounded-[48px] border relative overflow-hidden flex flex-col space-y-8 md:space-y-10 ${isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-gradient-to-br from-[#0B0F19] to-[#0D121F] border-white/10 shadow-2xl'}`}>
               <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-[#00F0FF]/5 blur-[60px] sm:blur-[80px] rounded-full" />
               
               <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-[#00F0FF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">Oracle Synthesis</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <p className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight text-white">
                      {isDemoMode ? 'Synthesizing' : activePersonaMode.headline} <span className="text-[#00F0FF]">Workspace Intelligence...</span>
                    </p>
                    <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/5 font-medium text-[12px] leading-relaxed text-slate-400 italic">
                       {isDemoMode
                         ? '"Alpha Strategy is heavily weighted toward M365 Excel. However, high-velocity discussion in Slack suggests a budget pivot is imminent. Recommend anchoring the Slack Pivot Thread to the key resources."'
                         : selectedWorkspace.pinnedItems.length > 0
                           ? `${activePersonaMode.detail} "${selectedWorkspace.name}" currently has ${selectedWorkspace.pinnedItems.length} indexed Microsoft artifact${selectedWorkspace.pinnedItems.length === 1 ? '' : 's'} anchored.`
                           : `${activePersonaMode.detail} "${selectedWorkspace.name}" is ready for indexed Microsoft files from Discovery.`}
                    </div>
                 </div>

                 <button 
                  onClick={handlePersonaAction}
                  className="flex min-h-[44px] w-full items-center justify-center gap-4 rounded-2xl bg-[#00F0FF] px-4 py-5 text-[10px] font-black uppercase tracking-[0.14em] text-black shadow-xl shadow-[#00F0FF]/20 transition-all hover:scale-105 md:tracking-[0.3em]"
                 >
                   <Cpu className="w-4 h-4" /> {isDemoMode ? 'Deconstruct Delta' : activePersonaMode.action}
                 </button>
               </div>
            </div>

            {/* Anchored Providers */}
            <div className="p-6 sm:p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/5 bg-white/[0.01] space-y-8 md:space-y-10">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">Universal Anchors</h3>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
               </div>
               
               <div className="space-y-4">
                  {selectedWorkspace.linkedSources.map((source, i) => (
                    <div key={i} className="group flex items-center justify-between gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:bg-white/5 md:p-6">
                       <div className="flex min-w-0 items-center gap-5">
                          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 group-hover:border-[#00F0FF]/40 transition-colors">
                             {source.provider === 'microsoft' ? <Share2 className="w-5 h-5 text-blue-500" /> : 
                              source.provider === 'slack' ? <Slack className="w-5 h-5 text-[#E01E5A]" /> : 
                              <Globe className="w-5 h-5 text-emerald-500" />}
                          </div>
                          <div>
                             <p className="max-w-[120px] truncate text-xs font-black uppercase tracking-tight text-white sm:max-w-[180px]">{source.name}</p>
                             <p className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-600 sm:tracking-widest">Provider Node</p>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  <button className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 py-5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-600 transition-all hover:border-[#00F0FF]/30 hover:text-[#00F0FF] sm:tracking-[0.3em]">
                     <Plus className="w-4 h-4" /> Sync New Anchor
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <WorkspaceCreationWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleCreateWorkspace}
        onPreviewMatches={!isDemoMode ? handlePreviewWorkspaceMatches : undefined}
      />
      {selectedWorkspace && (
        <>
          <ResourceSynthesizer 
            workspaceId={selectedWorkspace.id}
            isOpen={isSynthesizerOpen}
            onClose={() => setIsSynthesizerOpen(false)}
          />
          <ArtifactWizard 
            workspace={selectedWorkspace} 
            isOpen={!!editingArtifact} 
            editArtifact={editingArtifact}
            onClose={() => setEditingArtifact(null)} 
          />
        </>
      )}
      </>
    )}
  </Motion.div>
  );
};
