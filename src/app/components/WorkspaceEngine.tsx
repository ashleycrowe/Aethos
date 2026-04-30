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
import { createWorkspace, getWorkspaceDetail, listWorkspaces } from '@/lib/api';
import { isDemoModeEnabled } from '@/app/config/demoMode';
import { useAethos } from '@/app/context/AethosContext';
import { useAuth } from '@/app/context/AuthContext';
import { PinnedArtifact, SyncRule, Workspace } from '@/app/types/aethos.types';
import { WorkspaceCreationWizard } from './WorkspaceCreationWizard';
import { WorkspaceSyncManager } from './WorkspaceSyncManager';
import { ArtifactWizard } from './ArtifactWizard';
import { ResourceSynthesizer } from './ResourceSynthesizer';
import { useTheme } from '@/app/context/ThemeContext';
import { useOracle } from '@/app/context/OracleContext';
import { useUser } from '@/app/context/UserContext';
import { PulseCommunicator } from './PulseCommunicator';
import { PulseFeedItem } from './PulseFeedItem';
import { toast } from 'sonner';
import { syncRulesService } from '../services/syncRules.service';
import { syncEngineService } from '../services/syncEngine.service';

const TEST_TENANT_ID = '00000000-0000-0000-0000-000000000101';

function fileTypeFromMime(mimeType?: string): PinnedArtifact['type'] {
  if (!mimeType) return 'document';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  return 'document';
}

function toWorkspace(row: any): Workspace {
  const detailItems = row.items || [];
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
  };
}

export const WorkspaceEngine = () => {
  const { state: { workspaces }, unpinFromWorkspace, updateWorkspace, validatePointers, addWorkspace } = useAethos();
  const { isDaylight } = useTheme();
  const { setIsOpen: setOracleOpen, search: oracleSearch } = useOracle();
  const { user } = useUser();
  const { tenantId, userId, getAccessToken } = useAuth();
  const activeTenantId = tenantId || TEST_TENANT_ID;

  // API state management
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(isDemoModeEnabled());
  const [apiWorkspaces, setApiWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isSyncManagerOpen, setIsSyncManagerOpen] = useState(false);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [editingArtifact, setEditingArtifact] = useState<PinnedArtifact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'lattice' | 'pulse' | 'forensic'>('pulse');
  const [isSyncing, setIsSyncing] = useState(false);

  // Use API data if available, otherwise fall back to context
  const effectiveWorkspaces = isDemoMode ? workspaces : apiWorkspaces;
  const selectedWorkspace = effectiveWorkspaces.find(ws => ws.id === selectedWorkspaceId);

  const { state: { containers: allContainers }, tickRetention } = useAethos();

  // Fetch workspaces from API on component mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (isDemoModeEnabled()) {
        setIsDemoMode(true);
        setIsLoading(false);
        if (!selectedWorkspaceId && workspaces.length > 0) {
          setSelectedWorkspaceId(workspaces[0].id);
        }
        return;
      }

      try {
        setIsLoading(true);

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
        console.warn('Failed to fetch workspaces, falling back to demo data:', err);
        setIsDemoMode(true);
        // Keep the context workspaces as fallback
        if (!selectedWorkspaceId && workspaces.length > 0) {
          setSelectedWorkspaceId(workspaces[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [activeTenantId]);

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
          userId: userId || user.id,
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

      toast.success(`✨ Workspace "${data.name}" created successfully!`, {
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
      toast.error('Failed to create workspace');
    }
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
          Create an operational workspace to synthesize cross-cloud resources into a unified lattice.
        </p>
        <button 
          onClick={handleOpenWizard}
          className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          Create Workspace
        </button>
        <WorkspaceCreationWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onComplete={handleCreateWorkspace} />
      </div>
    );
  }

  const criticalItems = selectedWorkspace?.pinnedItems.filter(item => item.category === 'critical') || [];
  const otherItems = selectedWorkspace?.pinnedItems.filter(item => item.category !== 'critical') || [];

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 md:space-y-10 animate-in fade-in duration-700 pb-16 md:pb-20"
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
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Operational Lattice Live</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_#00F0FF]" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-full md:max-w-2xl font-medium leading-relaxed italic">
                  "{selectedWorkspace.description || "Operational intelligence layer for cross-tenant collaboration."}"
                </p>
              </div>
              
              <div className={`grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-1.5 rounded-2xl border w-full md:w-auto ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5 backdrop-blur-sm md:backdrop-blur-xl'}`}>

                {[
                  { id: 'pulse', label: 'Signal Feed', icon: Activity },
                  { id: 'lattice', label: 'Lattice Resources', icon: Database },
                  { id: 'forensic', label: 'Purge Ops', icon: ShieldCheck }
                ].map(t => (
                  <button 
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`min-h-[44px] px-4 sm:px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 ${
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
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4">Lattice Density</span>
                       <div className="text-4xl font-black text-[#00F0FF]">{selectedWorkspace.pinnedItems.length}</div>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 italic">Active Pointers</p>
                    </div>
                    <div className={`p-5 md:p-8 rounded-[28px] md:rounded-[36px] border ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4">Integrity Score</span>
                       <div className="text-4xl font-black text-white">{selectedWorkspace.intelligenceScore}%</div>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 italic">Operational Fidelity</p>
                    </div>
                    <div className={`p-5 md:p-8 rounded-[28px] md:rounded-[36px] border ${isDaylight ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/[0.03] border-white/5'}`}>
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-4">Sync Velocity</span>
                       <div className="text-4xl font-black text-emerald-500">92/100</div>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-2 italic">Real-time Pulse</p>
                    </div>
                  </div>

                  {/* Pulse Activity Stream */}
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2 sm:px-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Operational Pulse</h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Sync</span>
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
                           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No architectural signals detected</p>
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
                         className="min-h-[44px] px-6 sm:px-10 py-4 rounded-2xl bg-[#00F0FF] text-black text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#00F0FF]/20 flex items-center justify-center gap-3 hover:scale-105 transition-all"
                       >
                          <PlusCircle className="w-5 h-5" /> Synthesize Resource
                       </button>
                       <button 
                         onClick={handleSync}
                         disabled={isSyncing}
                         className={`min-h-[44px] px-6 sm:px-8 py-4 rounded-2xl border flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isSyncing ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                       >
                          <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Validating Pointers...' : 'Nexus Sync Engine'}
                       </button>
                       <div className="flex-1 relative min-h-[44px]">
                          <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                            type="text" 
                            placeholder="SEARCH THE LATTICE..." 
                            className="w-full h-full min-h-[52px] sm:min-h-[64px] pl-14 sm:pl-16 pr-4 rounded-2xl bg-white/5 border border-white/5 outline-none font-black text-[11px] uppercase tracking-widest text-white focus:border-[#00F0FF]/30 transition-all"
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
                               <p className="text-[10px] text-[#FF5733] font-black uppercase tracking-widest mt-1 italic">
                                 {selectedWorkspace.pinnedItems.filter(i => i.syncStatus === 'broken').length} Molecules have moved or lost source connectivity.
                               </p>
                            </div>
                         </div>
                         <button 
                           onClick={handleSync}
                           className="min-h-[44px] w-full md:w-auto px-6 py-3 rounded-xl bg-[#FF5733] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                         >
                            Heal Resource Lattice
                         </button>
                      </Motion.div>
                    )}

                    {/* Key Resources Section */}
                   <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-0 sm:pl-4">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                            <Pin className="w-4 h-4 text-[#00F0FF]" /> Key Operational Anchors
                         </h3>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Pinned for instant forensic access</span>
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
                                    {item.syncStatus === 'broken' && (
                                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 text-[8px] font-black text-[#FF5733] uppercase tracking-widest">
                                         Source Drift
                                      </div>
                                    )}
                                    <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                                 </div>
                              </div>
                              <div className="space-y-4 relative z-10">
                                 <h4 className="text-lg font-black text-white uppercase tracking-tighter">{item.title}</h4>
                                 <p className="text-xs text-slate-400 font-medium leading-relaxed italic line-clamp-2">"{item.aethosNote || "Primary operational anchor for project context."}"</p>
                              </div>
                              <div className="mt-8 pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                                 <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${item.syncStatus === 'broken' ? 'text-[#FF5733]' : 'text-[#00F0FF]'}`}>{item.provider} - {item.type}</span>
                                 <div className="flex items-center gap-2">
                                   {item.syncStatus === 'broken' ? (
                                     <button 
                                       onClick={handleSync}
                                       className="px-4 py-2 rounded-xl bg-[#FF5733] text-white text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                                     >
                                       Heal Link
                                     </button>
                                   ) : (
                                     <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/5 hover:bg-[#00F0FF] hover:text-black transition-all">
                                        <ExternalLink className="w-4 h-4" />
                                     </a>
                                   )}
                                 </div>
                              </div>
                           </div>
                         ))}
                         {criticalItems.length === 0 && (
                           <div className="md:col-span-2 p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                              <Pin className="w-8 h-8 text-slate-700" />
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pin artifacts to create Key Operational Anchors</p>
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Other Lattice Resources */}
                   <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pl-0 sm:pl-4">
                         <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Supporting Synthesis</h3>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{otherItems.length} Discovered Artifacts</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {otherItems.map(item => (
                            <div key={item.id} className="p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group flex flex-col">
                               <div className="flex items-center justify-between mb-8">
                                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-500 group-hover:text-[#00F0FF] transition-colors">
                                     <Link2 className="w-4 h-4" />
                                  </div>
                                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.provider}</span>
                               </div>
                               <h5 className="text-[13px] font-black text-white uppercase tracking-tight mb-3 truncate">{item.title}</h5>
                               <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 mb-6">{item.aethosNote || "Federated resource pointer."}</p>
                               <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{item.type}</span>
                                  <button onClick={() => unpinFromWorkspace(selectedWorkspace.id, item.id)} className="text-slate-700 hover:text-[#FF5733] transition-colors">
                                     <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </Motion.div>
              )}

              {activeTab === 'forensic' && (
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
                         <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Retention Countdown Monitor</h3>
                         <button 
                           onClick={tickRetention}
                           className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest hover:text-white transition-colors"
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
                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 break-words">{c.provider} - {c.type}</p>
                                  </div>
                                  <div className="text-right">
                                     <div className={`text-3xl font-black font-['JetBrains_Mono'] ${c.retentionDaysLeft! <= 3 ? 'text-[#FF5733]' : 'text-white'}`}>
                                        {c.retentionDaysLeft}
                                     </div>
                                     <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Days Remaining</p>
                                  </div>
                               </div>
                               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-6">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${c.retentionDaysLeft! <= 3 ? 'bg-[#FF5733]' : 'bg-[#00F0FF]'}`} 
                                    style={{ width: `${(c.retentionDaysLeft! / 30) * 100}%` }} 
                                  />
                               </div>
                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Target: Governance_Vault</span>
                                  <button className={`min-h-[44px] px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${c.retentionDaysLeft! <= 3 ? 'bg-[#FF5733] text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}`}>
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
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1 italic">Identify and eliminate dead capital from the lattice</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10 mb-8 md:mb-12 relative z-10">
                         <div className="p-5 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">Redundant Bloat</span>
                            <div className="text-3xl md:text-4xl font-black text-[#FF5733]">1.2 TB</div>
                         </div>
                         <div className="p-5 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">Exposure Risks</span>
                            <div className="text-3xl md:text-4xl font-black text-white">04</div>
                         </div>
                         <div className="p-5 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">Orphaned Nodes</span>
                            <div className="text-3xl md:text-4xl font-black text-white">12</div>
                         </div>
                      </div>

                      <button className="w-full min-h-[44px] px-4 py-5 md:py-6 rounded-2xl bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-[#FF5733] hover:text-black transition-all shadow-xl shadow-[#FF5733]/10">
                         Simulate Global Cleanup Protocol
                      </button>
                   </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Context Sidebar Column */}
          <div className="lg:col-span-4 space-y-8 md:space-y-10 min-w-0">
            {/* AI Strategic Synthesis */}
            <div className={`p-6 sm:p-8 md:p-10 rounded-[32px] md:rounded-[48px] border relative overflow-hidden flex flex-col space-y-8 md:space-y-10 ${isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-gradient-to-br from-[#0B0F19] to-[#0D121F] border-white/10 shadow-2xl'}`}>
               <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-[#00F0FF]/5 blur-[60px] sm:blur-[80px] rounded-full" />
               
               <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <Sparkles className="w-6 h-6 text-[#00F0FF]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Oracle Synthesis</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <p className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight text-white">
                      Synthesizing <span className="text-[#00F0FF]">Project Intelligence...</span>
                    </p>
                    <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/5 font-medium text-[12px] leading-relaxed text-slate-400 italic">
                       "Alpha Strategy is heavily weighted toward M365 Excel. However, high-velocity discussion in Slack suggests a budget pivot is imminent. Recommend anchoring the 'Slack Pivot Thread' to the key resources."
                    </div>
                 </div>

                 <button 
                  onClick={() => {
                    setOracleOpen(true);
                    oracleSearch(`Summarize the delta between the Excel budget and the latest Slack pivots in ${selectedWorkspace.name}.`);
                  }}
                  className="w-full min-h-[44px] px-4 py-5 rounded-2xl bg-[#00F0FF] text-black text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl shadow-[#00F0FF]/20 hover:scale-105 transition-all"
                 >
                   <Cpu className="w-4 h-4" /> Deconstruct Delta
                 </button>
               </div>
            </div>

            {/* Anchored Providers */}
            <div className="p-6 sm:p-8 md:p-10 rounded-[32px] md:rounded-[48px] border border-white/5 bg-white/[0.01] space-y-8 md:space-y-10">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Universal Anchors</h3>
                  <button className="p-2 rounded-lg hover:bg-white/5 text-slate-600 transition-colors"><MoreVertical className="w-4 h-4" /></button>
               </div>
               
               <div className="space-y-4">
                  {selectedWorkspace.linkedSources.map((source, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-5 md:p-6 rounded-3xl bg-white/[0.03] border border-white/5 group hover:bg-white/5 transition-all cursor-pointer">
                       <div className="flex items-center gap-5">
                          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 group-hover:border-[#00F0FF]/40 transition-colors">
                             {source.provider === 'microsoft' ? <Share2 className="w-5 h-5 text-blue-500" /> : 
                              source.provider === 'slack' ? <Slack className="w-5 h-5 text-[#E01E5A]" /> : 
                              <Globe className="w-5 h-5 text-emerald-500" />}
                          </div>
                          <div>
                             <p className="text-xs font-black uppercase tracking-tight text-white truncate max-w-[120px]">{source.name}</p>
                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Provider Node</p>
                          </div>
                       </div>
                       <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  <button className="w-full py-5 rounded-3xl border border-dashed border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all flex items-center justify-center gap-3">
                     <Plus className="w-4 h-4" /> Sync New Anchor
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      <WorkspaceCreationWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onComplete={handleCreateWorkspace} />
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
