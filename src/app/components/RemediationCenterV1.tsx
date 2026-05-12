/**
 * Remediation Center V1 - Basic Remediation Workflows
 * 
 * VERSION: V1 (Basic Remediation), V3+ (Advanced Workflows)
 * FEATURE FLAGS:
 * - V1: basicRemediation (archive, delete, revoke links)
 * - V3: advancedRemediation (approval chains), simulationMode
 * 
 * V1 SCOPE:
 * - Archive artifacts (provider-specific archival)
 * - Delete artifacts (with confirmation)
 * - Revoke external links
 * - Bulk operations
 * - Simple confirmation dialogs
 */

import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Archive, 
  Trash2, 
  ExternalLink, 
  ShieldOff,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ChevronDown,
  X,
  Info,
  Zap,
  FileText,
  Users,
  Globe,
  Lock,
  Unlock,
  RotateCcw,
  Download,
  Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useVersion, useFeature } from '../context/VersionContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { generateRemediationItems, searchRemediationItems, type RemediationItem } from '../utils/mockDataGenerator';
import { executeRemediation, searchFiles } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';

type RemediationAction = 'archive' | 'delete' | 'revoke_links' | null;
type ViewMode = 'pending' | 'history';

type SearchFileResult = {
  id: string;
  name: string;
  provider_type?: string | null;
  provider?: string | null;
  size_bytes?: number | null;
  modified_at?: string | null;
  owner_email?: string | null;
  owner_name?: string | null;
  risk_score?: number | null;
  is_stale?: boolean | null;
  is_orphaned?: boolean | null;
  has_external_share?: boolean | null;
  external_user_count?: number | null;
};

function formatBytes(bytes?: number | null) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatRelativeDate(value?: string | null) {
  if (!value) return 'Unknown';
  const diffMs = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.round(diffMs / 86400000));
  if (days === 0) return 'Today';
  if (days < 31) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

function toRemediationItem(file: SearchFileResult): RemediationItem {
  const riskScore = file.risk_score || 0;
  const issue: RemediationItem['issue'] = file.has_external_share
    ? 'external_share'
    : file.is_orphaned
      ? 'orphaned'
      : file.is_stale
        ? 'stale'
        : 'waste';

  return {
    id: file.id,
    name: file.name,
    type: file.provider_type === 'teams' ? 'channel' : 'file',
    provider: file.provider_type === 'sharepoint'
      ? 'SharePoint'
      : file.provider_type === 'onedrive'
        ? 'OneDrive'
        : file.provider_type === 'teams'
          ? 'Teams'
          : 'M365',
    risk: riskScore >= 70 ? 'high' : riskScore >= 35 ? 'medium' : 'low',
    issue,
    size: formatBytes(file.size_bytes),
    lastModified: formatRelativeDate(file.modified_at),
    owner: file.owner_name || file.owner_email || 'Unknown owner',
    externalUsers: file.external_user_count || undefined,
  };
}

export const RemediationCenter: React.FC = () => {
  const { isDaylight } = useTheme();
  const { version, isDemoMode } = useVersion();
  const { tenantId, getAccessToken } = useAuth();
  const hasSimulation = useFeature('simulationMode');
  const hasAdvancedRemediation = useFeature('advancedRemediation');
  
  const [viewMode, setViewMode] = useState<ViewMode>('pending');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<RemediationAction>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterIssue, setFilterIssue] = useState<'all' | 'external_share' | 'stale' | 'orphaned' | 'waste'>('all');

  const [items, setItems] = useState<RemediationItem[]>(() => generateRemediationItems(5));
  const [completedActions, setCompletedActions] = useState<any[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setItems(generateRemediationItems(5));
      setItemsError(null);
      return;
    }

    let cancelled = false;
    const loadLiveCandidates = async () => {
      try {
        setIsLoadingItems(true);
        setItemsError(null);
        const token = await getAccessToken();
        const response = await searchFiles<SearchFileResult>({
          tenantId: tenantId || '',
          filters: { minRiskScore: 1 },
          sortBy: 'risk',
          sortOrder: 'desc',
          pageSize: 25,
          accessToken: token,
        });
        if (!cancelled) setItems((response.results || []).map(toRemediationItem));
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load live remediation candidates';
        if (!cancelled) {
          setItems([]);
          setItemsError(message);
        }
      } finally {
        if (!cancelled) setIsLoadingItems(false);
      }
    };

    void loadLiveCandidates();
    return () => {
      cancelled = true;
    };
  }, [isDemoMode, tenantId]);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterRisk === 'all' || item.risk === filterRisk;
    const matchesIssue = filterIssue === 'all' || item.issue === filterIssue;
    return matchesSearch && matchesRisk && matchesIssue;
  });

  const selectedCount = selectedItems.size;
  const allSelected = filteredItems.length > 0 && filteredItems.every(item => selectedItems.has(item.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const initiateAction = (action: RemediationAction) => {
    if (selectedCount === 0) {
      toast.error('No items selected');
      return;
    }
    setPendingAction(action);
    setShowConfirmDialog(true);
  };

  const executeAction = async () => {
    const actionLabels = {
      archive: 'Archived',
      delete: 'Deleted',
      revoke_links: 'Links Revoked',
    };

    const selectedItemsList = items.filter(i => selectedItems.has(i.id));
    if (!pendingAction) return;

    if (!isDemoMode) {
      try {
        const response = await executeRemediation({
          action: pendingAction,
          fileIds: selectedItemsList.map((item) => item.id),
          dryRun: true,
          accessToken: await getAccessToken(),
        });

        setCompletedActions(prev => [
          {
            id: response.actionId,
            action: pendingAction,
            items: selectedItemsList,
            timestamp: new Date().toISOString(),
            executedBy: 'Current User',
            dryRun: true,
          },
          ...prev
        ]);

        toast.success(`Dry run logged for ${selectedCount} item${selectedCount > 1 ? 's' : ''}`, {
          description: response.message,
          duration: 5000,
        });

        setSelectedItems(new Set());
        setShowConfirmDialog(false);
        setPendingAction(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Remediation dry run failed';
        toast.error('Remediation dry run failed', { description: message });
      }
      return;
    }
    
    // Add to history
    setCompletedActions(prev => [
      {
        id: Date.now().toString(),
        action: pendingAction,
        items: selectedItemsList,
        timestamp: new Date().toISOString(),
        executedBy: 'Current User',
      },
      ...prev
    ]);

    toast.success(`${actionLabels[pendingAction]} ${selectedCount} item${selectedCount > 1 ? 's' : ''}`, {
      description: pendingAction === 'delete' 
        ? 'Items moved to Recycle Bin (30-day recovery)' 
        : 'Changes synced to provider',
      duration: 4000,
    });

    setSelectedItems(new Set());
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return '#FF5733';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#64748B';
    }
  };

  const getIssueLabel = (issue: string) => {
    switch (issue) {
      case 'external_share': return 'External Share';
      case 'stale': return 'Stale Content';
      case 'orphaned': return 'Orphaned';
      case 'waste': return 'Storage Waste';
      default: return issue;
    }
  };

  const getProviderIcon = (provider: string) => {
    // In V1, all are M365 sub-services
    return FileText;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#FF5733]/10 text-[#FF5733] shadow-[0_0_15px_rgba(255,87,51,0.2)]">
            <Archive className="w-5 h-5" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Remediation Protocol
          </h2>
        </div>
        <h1 className={`text-4xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
          Remediation <span className="text-[#FF5733]">Center</span>
        </h1>
        <p className="text-xs text-slate-500 italic max-w-3xl">
          {version === 'V1' || version === 'V1.5' 
            ? 'Execute basic remediation protocols: archive, delete, and revoke external access.'
            : 'Advanced remediation workflows with approval chains, simulation mode, and multi-provider support.'}
        </p>
      </div>

      {/* View Mode Tabs */}
      <div className={`flex items-center gap-2 p-1 rounded-xl w-fit ${
        isDaylight ? 'bg-slate-100' : 'bg-white/5 border border-white/10'
      }`}>
        <button
          onClick={() => setViewMode('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-tight transition-all ${
            viewMode === 'pending'
              ? 'bg-[#FF5733] text-white'
              : isDaylight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
          }`}
        >
          Pending Items ({filteredItems.length})
        </button>
        <button
          onClick={() => setViewMode('history')}
          className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-tight transition-all ${
            viewMode === 'history'
              ? 'bg-[#FF5733] text-white'
              : isDaylight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-slate-400 hover:text-white'
          }`}
        >
          History ({completedActions.length})
        </button>
      </div>

      {viewMode === 'pending' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all ${
                  isDaylight
                    ? 'bg-white border-slate-200 text-slate-900 focus:border-[#FF5733]'
                    : 'bg-white/5 border-white/10 text-white focus:border-[#FF5733]/50'
                }`}
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                isDaylight
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <select
              value={filterIssue}
              onChange={(e) => setFilterIssue(e.target.value as any)}
              className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                isDaylight
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-white/5 border-white/10 text-white'
              }`}
            >
              <option value="all">All Issues</option>
              <option value="external_share">External Shares</option>
              <option value="stale">Stale Content</option>
              <option value="orphaned">Orphaned</option>
              <option value="waste">Storage Waste</option>
            </select>
          </div>

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedCount > 0 && (
              <Motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="sticky top-0 z-10"
              >
                <GlassCard className="p-4 border-[#00F0FF]/30 bg-[#00F0FF]/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#00F0FF]" />
                        <span className={`text-sm font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedItems(new Set())}
                        className="text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-black"
                      >
                        Clear Selection
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => initiateAction('archive')}
                        className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 transition-all flex items-center gap-2 text-sm font-black uppercase tracking-tight"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </button>
                      <button
                        onClick={() => initiateAction('revoke_links')}
                        className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500/20 transition-all flex items-center gap-2 text-sm font-black uppercase tracking-tight"
                      >
                        <ShieldOff className="w-4 h-4" />
                        Revoke Links
                      </button>
                      <button
                        onClick={() => initiateAction('delete')}
                        className="px-4 py-2 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] hover:bg-[#FF5733]/20 transition-all flex items-center gap-2 text-sm font-black uppercase tracking-tight"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {isLoadingItems ? (
              <GlassCard className="p-12 text-center">
                <Loader2 className="w-12 h-12 text-[#00F0FF] mx-auto mb-4 animate-spin" />
                <h3 className={`text-lg font-black uppercase mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Loading Live Candidates
                </h3>
                <p className="text-sm text-slate-500">
                  Querying indexed Microsoft metadata for stale, exposed, or high-risk files.
                </p>
              </GlassCard>
            ) : itemsError ? (
              <GlassCard className="p-12 text-center border-[#FF5733]/20 bg-[#FF5733]/5">
                <AlertTriangle className="w-12 h-12 text-[#FF5733] mx-auto mb-4" />
                <h3 className={`text-lg font-black uppercase mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  Live Remediation Unavailable
                </h3>
                <p className="text-sm text-slate-500">
                  {itemsError}
                </p>
              </GlassCard>
            ) : filteredItems.length === 0 ? (
              <GlassCard className="p-12 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-4" />
                <h3 className={`text-lg font-black uppercase mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  No Items Requiring Remediation
                </h3>
                <p className="text-sm text-slate-500">
                  {isDemoMode
                    ? 'All artifacts are within operational parameters. Check back later for new recommendations.'
                    : 'No indexed Microsoft files currently match the remediation rules. Run discovery first if this tenant has not been indexed.'}
                </p>
              </GlassCard>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center gap-3 px-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-[#00F0FF] checked:border-[#00F0FF] cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-black">
                    Select All ({filteredItems.length})
                  </span>
                </div>

                {filteredItems.map(item => {
                  const ProviderIcon = getProviderIcon(item.provider);
                  const isSelected = selectedItems.has(item.id);

                  return (
                    <Motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <GlassCard
                        className={`p-6 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[#00F0FF]/50 bg-[#00F0FF]/5' 
                            : 'hover:bg-white/[0.02]'
                        }`}
                        onClick={() => toggleSelect(item.id)}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 w-5 h-5 rounded border-2 border-white/20 bg-white/5 checked:bg-[#00F0FF] checked:border-[#00F0FF] cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-black mb-1 truncate ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                                  <span className="flex items-center gap-1">
                                    <ProviderIcon className="w-3 h-3" />
                                    {item.provider}
                                  </span>
                                  <span>•</span>
                                  <span>{item.size}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {item.lastModified}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {item.owner}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <div
                                  className="px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest"
                                  style={{
                                    backgroundColor: `${getRiskColor(item.risk)}15`,
                                    borderColor: `${getRiskColor(item.risk)}40`,
                                    color: getRiskColor(item.risk),
                                  }}
                                >
                                  {item.risk} Risk
                                </div>
                                <div className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                  {getIssueLabel(item.issue)}
                                </div>
                              </div>
                            </div>

                            {item.externalUsers && (
                              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20">
                                <Globe className="w-4 h-4 text-[#FF5733]" />
                                <span className="text-xs font-bold text-[#FF5733]">
                                  Shared with {item.externalUsers} external user{item.externalUsers > 1 ? 's' : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlassCard>
                    </Motion.div>
                  );
                })}
              </>
            )}
          </div>
        </>
      ) : (
        /* History View */
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
          {completedActions.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className={`text-lg font-black uppercase mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                No Remediation History
              </h3>
              <p className="text-sm text-slate-500">
                Completed remediation actions will appear here.
              </p>
            </GlassCard>
          ) : (
            completedActions.map(action => (
              <GlassCard key={action.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        {action.action === 'archive' ? 'Archived' : action.action === 'delete' ? 'Deleted' : 'Links Revoked'}
                      </h4>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
                        {new Date(action.timestamp).toLocaleString()} • {action.executedBy}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">
                    {action.items.length} item{action.items.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2">
                  {action.items.map((item: RemediationItem) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}
                    >
                      <span className={`text-xs ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && pendingAction && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirmDialog(false)}
          >
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassCard className="p-8 border-[#FF5733]/30">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[#FF5733]/10 text-[#FF5733]">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-black uppercase mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      Confirm {pendingAction === 'archive' ? 'Archive' : pendingAction === 'delete' ? 'Delete' : 'Revoke Links'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {pendingAction === 'delete' 
                        ? `You are about to delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}. Items will be moved to the Recycle Bin for 30 days.`
                        : pendingAction === 'archive'
                        ? `You are about to archive ${selectedCount} item${selectedCount > 1 ? 's' : ''}. Archived items will be read-only.`
                        : `You are about to revoke external links for ${selectedCount} item${selectedCount > 1 ? 's' : ''}. External users will lose access.`
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className={`flex-1 px-4 py-3 rounded-xl border font-black uppercase text-sm tracking-tight transition-all ${
                      isDaylight
                        ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeAction}
                    className="flex-1 px-4 py-3 rounded-xl bg-[#FF5733] text-white font-black uppercase text-sm tracking-tight hover:bg-[#FF5733]/90 transition-all shadow-lg shadow-[#FF5733]/20"
                  >
                    Confirm
                  </button>
                </div>
              </GlassCard>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
