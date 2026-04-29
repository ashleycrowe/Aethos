/**
 * Workspace Sync Manager
 * Manage tag-based auto-sync rules and view sync history
 */

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Plus,
  Tag,
  FolderOpen,
  User,
  FileText,
  Edit,
  Trash2,
  Power,
  PowerOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Zap,
  X,
  ChevronDown
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { SyncRule, Asset } from '../types/aethos.types';
import {
  getSyncRules,
  createSyncRule,
  updateSyncRule,
  deleteSyncRule,
  toggleSyncRule,
  runWorkspaceSync,
  getSyncHistory,
  getWorkspaceSyncStats
} from '../services/syncRules.service';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

interface WorkspaceSyncManagerProps {
  workspaceId: string;
  workspaceName: string;
  availableAssets: Asset[];
  tenantId: string;
  userId: string;
  onClose: () => void;
}

type RuleFormMode = 'create' | 'edit' | null;

export const WorkspaceSyncManager = ({
  workspaceId,
  workspaceName,
  availableAssets,
  tenantId,
  userId,
  onClose
}: WorkspaceSyncManagerProps) => {
  const { isDaylight } = useTheme();
  
  const [syncRules, setSyncRules] = useState<SyncRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [formMode, setFormMode] = useState<RuleFormMode>(null);
  const [editingRule, setEditingRule] = useState<SyncRule | null>(null);
  const [stats, setStats] = useState<any>(null);
  
  // Form state
  const [ruleType, setRuleType] = useState<'tag' | 'location' | 'author' | 'keyword'>('tag');
  const [tagsIncludeAny, setTagsIncludeAny] = useState<string[]>([]);
  const [tagsExclude, setTagsExclude] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [locationPath, setLocationPath] = useState('');
  const [authorEmails, setAuthorEmails] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [autoAdd, setAutoAdd] = useState(true);
  const [autoRemove, setAutoRemove] = useState(false);
  const [maxFiles, setMaxFiles] = useState(500);

  useEffect(() => {
    loadData();
  }, [workspaceId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rules, statistics] = await Promise.all([
        getSyncRules(workspaceId),
        getWorkspaceSyncStats(workspaceId)
      ]);
      setSyncRules(rules);
      setStats(statistics);
    } catch (error) {
      toast.error('Failed to load sync rules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRule = async () => {
    try {
      const result = await createSyncRule(
        workspaceId,
        tenantId,
        {
          ruleType,
          tagsIncludeAny: ruleType === 'tag' ? tagsIncludeAny : [],
          tagsExclude: ruleType === 'tag' ? tagsExclude : [],
          locationPath: ruleType === 'location' ? locationPath : undefined,
          authorEmails: ruleType === 'author' ? authorEmails : [],
          autoAdd,
          autoRemove,
          maxFiles,
          enabled: true
        },
        userId
      );

      if (result.success && result.data) {
        setSyncRules([result.data, ...syncRules]);
        toast.success('Sync rule created successfully');
        resetForm();
        setFormMode(null);
      } else {
        toast.error(result.error || 'Failed to create sync rule');
      }
    } catch (error) {
      toast.error('Failed to create sync rule');
    }
  };

  const handleToggleRule = async (ruleId: string, enabled: boolean) => {
    const result = await toggleSyncRule(ruleId, enabled);
    if (result.success && result.data) {
      setSyncRules(syncRules.map(r => r.id === ruleId ? result.data! : r));
      toast.success(`Rule ${enabled ? 'enabled' : 'disabled'}`);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this sync rule?')) return;
    
    const result = await deleteSyncRule(ruleId);
    if (result.success) {
      setSyncRules(syncRules.filter(r => r.id !== ruleId));
      toast.success('Sync rule deleted');
    }
  };

  const handleRunSync = async () => {
    setIsSyncing(true);
    try {
      const result = await runWorkspaceSync(workspaceId, availableAssets);
      
      if (result.success && result.result) {
        toast.success(
          `Sync complete: ${result.result.addedAssets.length} added, ${result.result.removedAssets.length} removed`,
          { duration: 5000 }
        );
        await loadData(); // Reload stats
      } else {
        toast.error(result.error || 'Sync failed');
      }
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const resetForm = () => {
    setRuleType('tag');
    setTagsIncludeAny([]);
    setTagsExclude([]);
    setTagInput('');
    setLocationPath('');
    setAuthorEmails([]);
    setAuthorInput('');
    setAutoAdd(true);
    setAutoRemove(false);
    setMaxFiles(500);
    setEditingRule(null);
  };

  const addTag = (listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!tagInput.trim()) return;
    const formatted = tagInput.toLowerCase().trim().replace(/\s+/g, '-');
    listSetter(prev => prev.includes(formatted) ? prev : [...prev, formatted]);
    setTagInput('');
  };

  const addAuthor = () => {
    if (!authorInput.trim() || !authorInput.includes('@')) return;
    setAuthorEmails(prev => prev.includes(authorInput) ? prev : [...prev, authorInput]);
    setAuthorInput('');
  };

  const getRuleTypeIcon = (type: string) => {
    switch (type) {
      case 'tag': return Tag;
      case 'location': return FolderOpen;
      case 'author': return User;
      case 'keyword': return FileText;
      default: return Tag;
    }
  };

  const formatRuleSummary = (rule: SyncRule): string => {
    switch (rule.ruleType) {
      case 'tag':
        return `Tags: ${[...(rule.tagsIncludeAny || [])].join(', ')}`;
      case 'location':
        return `Location: ${rule.locationPath}`;
      case 'author':
        return `Authors: ${rule.authorEmails?.join(', ')}`;
      default:
        return rule.ruleType;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl ${
          isDaylight
            ? 'bg-white border border-slate-200'
            : 'bg-[#0B0F19] border border-white/10'
        }`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${isDaylight ? 'border-slate-200' : 'border-white/10'}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-2xl font-black uppercase tracking-tight ${
                isDaylight ? 'text-slate-900' : 'text-white'
              }`}>
                Auto-Sync Manager
              </h2>
              <p className="text-sm text-[#94A3B8] mt-1">
                {workspaceName} • {syncRules.length} rules configured
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className={`p-4 rounded-xl ${
                isDaylight ? 'bg-slate-50' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#00F0FF]" />
                  <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Active Rules</span>
                </div>
                <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {stats.activeRules}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDaylight ? 'bg-slate-50' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Auto-Added</span>
                </div>
                <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {stats.autoAddedAssets}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDaylight ? 'bg-slate-50' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Manual</span>
                </div>
                <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {stats.manuallyAddedAssets}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDaylight ? 'bg-slate-50' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-[#94A3B8] uppercase tracking-wider">Last Sync</span>
                </div>
                <p className={`text-xs font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {stats.lastSyncTime ? new Date(stats.lastSyncTime).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setFormMode('create')}
              className="px-4 py-2.5 bg-[#00F0FF] text-[#0B0F19] rounded-xl font-medium text-sm hover:bg-[#00F0FF]/90 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Sync Rule
            </button>
            <button
              onClick={handleRunSync}
              disabled={isSyncing || syncRules.length === 0}
              className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Run Sync Now'}
            </button>
          </div>

          {/* Create/Edit Form */}
          <AnimatePresence>
            {formMode && (
              <Motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-6 rounded-2xl border ${
                  isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                }`}
              >
                <h3 className={`text-lg font-bold mb-4 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {formMode === 'create' ? 'Create New Sync Rule' : 'Edit Sync Rule'}
                </h3>

                <div className="space-y-4">
                  {/* Rule Type */}
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                      Rule Type
                    </label>
                    <div className="flex gap-2">
                      {(['tag', 'location', 'author'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setRuleType(type)}
                          className={`px-4 py-2 rounded-lg border font-medium text-sm capitalize transition-all ${
                            ruleType === type
                              ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20'
                              : isDaylight
                              ? 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                              : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tag-based rules */}
                  {ruleType === 'tag' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                          Include Tags (any match)
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag(setTagsIncludeAny)}
                            placeholder="Enter tag..."
                            className={`flex-1 px-4 py-2 rounded-lg border outline-none ${
                              isDaylight
                                ? 'bg-white border-slate-200 text-slate-900'
                                : 'bg-white/5 border-white/10 text-white'
                            }`}
                          />
                          <button
                            onClick={() => addTag(setTagsIncludeAny)}
                            className="px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tagsIncludeAny.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 bg-[#00F0FF]/10 text-[#00F0FF] rounded-lg border border-[#00F0FF]/20 text-sm flex items-center gap-2"
                            >
                              {tag}
                              <button onClick={() => setTagsIncludeAny(tagsIncludeAny.filter(t => t !== tag))}>
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                          Exclude Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag(setTagsExclude)}
                            placeholder="Enter tag to exclude..."
                            className={`flex-1 px-4 py-2 rounded-lg border outline-none ${
                              isDaylight
                                ? 'bg-white border-slate-200 text-slate-900'
                                : 'bg-white/5 border-white/10 text-white'
                            }`}
                          />
                          <button
                            onClick={() => addTag(setTagsExclude)}
                            className="px-4 py-2 bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20 rounded-lg font-medium"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tagsExclude.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 bg-[#FF5733]/10 text-[#FF5733] rounded-lg border border-[#FF5733]/20 text-sm flex items-center gap-2"
                            >
                              {tag}
                              <button onClick={() => setTagsExclude(tagsExclude.filter(t => t !== tag))}>
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Location-based rules */}
                  {ruleType === 'location' && (
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Location Path
                      </label>
                      <input
                        type="text"
                        value={locationPath}
                        onChange={(e) => setLocationPath(e.target.value)}
                        placeholder="e.g., Finance Team > Budget"
                        className={`w-full px-4 py-2 rounded-lg border outline-none ${
                          isDaylight
                            ? 'bg-white border-slate-200 text-slate-900'
                            : 'bg-white/5 border-white/10 text-white'
                        }`}
                      />
                    </div>
                  )}

                  {/* Author-based rules */}
                  {ruleType === 'author' && (
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Author Emails
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="email"
                          value={authorInput}
                          onChange={(e) => setAuthorInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addAuthor()}
                          placeholder="email@company.com"
                          className={`flex-1 px-4 py-2 rounded-lg border outline-none ${
                            isDaylight
                              ? 'bg-white border-slate-200 text-slate-900'
                              : 'bg-white/5 border-white/10 text-white'
                          }`}
                        />
                        <button
                          onClick={addAuthor}
                          className="px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {authorEmails.map(email => (
                          <span
                            key={email}
                            className="px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20 text-sm flex items-center gap-2"
                          >
                            {email}
                            <button onClick={() => setAuthorEmails(authorEmails.filter(e => e !== email))}>
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoAdd}
                        onChange={(e) => setAutoAdd(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 text-[#00F0FF] focus:ring-[#00F0FF]"
                      />
                      <span className={isDaylight ? 'text-slate-700' : 'text-white'}>
                        Auto-add matching assets
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRemove}
                        onChange={(e) => setAutoRemove(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 text-[#FF5733] focus:ring-[#FF5733]"
                      />
                      <span className={isDaylight ? 'text-slate-700' : 'text-white'}>
                        Auto-remove non-matching
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                      Max Files: {maxFiles}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={maxFiles}
                      onChange={(e) => setMaxFiles(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={handleCreateRule}
                      className="px-6 py-2.5 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all"
                    >
                      Create Rule
                    </button>
                    <button
                      onClick={() => {
                        setFormMode(null);
                        resetForm();
                      }}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                        isDaylight
                          ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* Rules List */}
          <div className="space-y-3">
            {syncRules.length === 0 ? (
              <div className={`text-center py-12 rounded-2xl ${
                isDaylight ? 'bg-slate-50' : 'bg-white/5'
              }`}>
                <Tag className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                <p className={`font-medium ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  No sync rules configured
                </p>
                <p className="text-sm text-[#94A3B8] mt-1">
                  Create a rule to automatically sync assets to this workspace
                </p>
              </div>
            ) : (
              syncRules.map(rule => {
                const Icon = getRuleTypeIcon(rule.ruleType);
                return (
                  <div
                    key={rule.id}
                    className={`p-4 rounded-xl border transition-all ${
                      rule.enabled
                        ? isDaylight
                          ? 'bg-white border-slate-200'
                          : 'bg-white/5 border-white/10'
                        : isDaylight
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white/5 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${
                          rule.enabled ? 'bg-[#00F0FF]/10 text-[#00F0FF]' : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-semibold capitalize ${
                              isDaylight ? 'text-slate-900' : 'text-white'
                            }`}>
                              {rule.ruleType} Rule
                            </p>
                            {rule.enabled ? (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded border border-emerald-500/20">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-500/10 text-slate-500 text-xs font-bold rounded border border-slate-500/20">
                                PAUSED
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#94A3B8]">
                            {formatRuleSummary(rule)}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[#94A3B8]">
                            <span>Auto-add: {rule.autoAdd ? 'Yes' : 'No'}</span>
                            <span>Auto-remove: {rule.autoRemove ? 'Yes' : 'No'}</span>
                            <span>Max: {rule.maxFiles} files</span>
                            <span>Added: {rule.filesAddedCount} files</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                          }`}
                          title={rule.enabled ? 'Disable' : 'Enable'}
                        >
                          {rule.enabled ? (
                            <Power className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <PowerOff className="w-4 h-4 text-slate-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDaylight ? 'hover:bg-red-50' : 'hover:bg-red-500/10'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-[#FF5733]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Motion.div>
    </div>
  );
};
