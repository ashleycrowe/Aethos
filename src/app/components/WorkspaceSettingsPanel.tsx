/**
 * Workspace Settings Panel
 * Enhanced settings with auto-sync rules management and pending approvals
 */

import { useState } from 'react';
import { SyncRule } from '../types/aethos.types';
import { Settings, RefreshCw, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WorkspaceSettingsPanelProps {
  workspaceName: string;
  syncRules: SyncRule[];
  pendingApprovalsCount: number;
  onAddRule: () => void;
  onEditRule: (ruleId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onToggleRule: (ruleId: string, enabled: boolean) => void;
  onViewPendingApprovals: () => void;
  onClose: () => void;
}

type AutoApprovalMode = 'manual' | 'auto-approve' | 'auto-notify';

export function WorkspaceSettingsPanel({
  workspaceName,
  syncRules,
  pendingApprovalsCount,
  onAddRule,
  onEditRule,
  onDeleteRule,
  onToggleRule,
  onViewPendingApprovals,
  onClose,
}: WorkspaceSettingsPanelProps) {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [autoApprovalMode, setAutoApprovalMode] = useState<AutoApprovalMode>('manual');

  const activeSyncRules = syncRules.filter((r) => r.enabled);
  const inactiveSyncRules = syncRules.filter((r) => !r.enabled);

  return (
    <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#334155]">
        <div>
          <h3 className="text-2xl font-semibold text-white mb-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#00F0FF]" />
            Workspace Settings
          </h3>
          <p className="text-sm text-[#94A3B8]">{workspaceName}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-white transition-colors"
        >
          Close
        </button>
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovalsCount > 0 && (
        <div className="mb-6 bg-[#00F0FF]/5 border border-[#00F0FF]/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#00F0FF] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-white font-medium mb-1">
                  {pendingApprovalsCount} File{pendingApprovalsCount !== 1 ? 's' : ''} Pending
                  Review
                </h4>
                <p className="text-sm text-[#94A3B8]">
                  Auto-synced files are waiting for your approval before being added to this
                  workspace.
                </p>
              </div>
            </div>
            <button
              onClick={onViewPendingApprovals}
              className="px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium text-sm whitespace-nowrap"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Auto-Sync Rules Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-1">Auto-Sync Rules</h4>
            <p className="text-sm text-[#94A3B8]">
              Automatically organize files based on tags, location, or people
            </p>
          </div>
          <button
            onClick={onAddRule}
            className="px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>

        {/* Active Rules */}
        {activeSyncRules.length === 0 && inactiveSyncRules.length === 0 ? (
          <div className="text-center py-8 bg-[#1E293B]/30 border border-[#334155] rounded-lg">
            <RefreshCw className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
            <h5 className="text-white font-medium mb-2">No Auto-Sync Rules Yet</h5>
            <p className="text-sm text-[#94A3B8] mb-4">
              Keep this workspace up-to-date automatically by adding sync rules.
            </p>
            <button
              onClick={onAddRule}
              className="px-6 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Rule
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Active Rules */}
            {activeSyncRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-[#1E293B]/50 border border-[#334155] rounded-lg p-4 hover:border-[#00F0FF]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-white font-medium">
                        {rule.ruleType === 'tag' && '🏷️ Tag-based Rule'}
                        {rule.ruleType === 'location' && '📁 Location-based Rule'}
                        {rule.ruleType === 'author' && '👤 Author-based Rule'}
                      </h5>
                      <span className="px-2 py-0.5 bg-[#00F0FF]/20 text-[#00F0FF] text-xs rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    </div>

                    {/* Rule Details */}
                    <div className="space-y-1 mb-3">
                      {rule.tagsIncludeAny && rule.tagsIncludeAny.length > 0 && (
                        <p className="text-sm text-[#94A3B8]">
                          <strong className="text-white">Include ANY:</strong>{' '}
                          {rule.tagsIncludeAny.join(', ')}
                        </p>
                      )}
                      {rule.tagsIncludeAll && rule.tagsIncludeAll.length > 0 && (
                        <p className="text-sm text-[#94A3B8]">
                          <strong className="text-white">Must also have:</strong>{' '}
                          {rule.tagsIncludeAll.join(', ')}
                        </p>
                      )}
                      {rule.tagsExclude && rule.tagsExclude.length > 0 && (
                        <p className="text-sm text-[#FF5733]">
                          <strong>Exclude:</strong> {rule.tagsExclude.join(', ')}
                        </p>
                      )}
                      {rule.locationPath && (
                        <p className="text-sm text-[#94A3B8]">
                          <strong className="text-white">Location:</strong> {rule.locationPath}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-[#64748B]">
                      <div>
                        <span className="text-[#00F0FF] font-semibold">
                          {rule.filesAddedCount}
                        </span>{' '}
                        files added
                      </div>
                      {rule.lastRun && (
                        <div>Last run: {new Date(rule.lastRun).toLocaleDateString()}</div>
                      )}
                      <div>
                        Auto-add: {rule.autoAdd ? 'Yes' : 'No'} | Auto-remove:{' '}
                        {rule.autoRemove ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => onToggleRule(rule.id, !rule.enabled)}
                      className="p-2 text-[#00F0FF] hover:bg-[#00F0FF]/10 rounded transition-all"
                      title="Disable rule"
                    >
                      <ToggleRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEditRule(rule.id)}
                      className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded transition-all"
                      title="Edit rule"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-2 text-[#FF5733] hover:bg-[#FF5733]/10 rounded transition-all"
                      title="Delete rule"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Inactive Rules */}
            {inactiveSyncRules.length > 0 && (
              <div className="pt-3 border-t border-[#334155]">
                <h5 className="text-sm font-medium text-[#64748B] mb-3">
                  Disabled Rules ({inactiveSyncRules.length})
                </h5>
                <div className="space-y-2">
                  {inactiveSyncRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="bg-[#1E293B]/30 border border-[#334155]/50 rounded-lg p-3 opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium mb-1">
                            {rule.ruleType === 'tag' && '🏷️ Tag-based Rule'}
                            {rule.ruleType === 'location' && '📁 Location-based Rule'}
                          </p>
                          <p className="text-xs text-[#64748B]">
                            {rule.tagsIncludeAny?.join(', ') || rule.locationPath}
                          </p>
                        </div>
                        <button
                          onClick={() => onToggleRule(rule.id, true)}
                          className="p-2 text-[#64748B] hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 rounded transition-all"
                          title="Enable rule"
                        >
                          <ToggleLeft className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auto-Approval Settings */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-3">Auto-Approval Behavior</h4>
        <p className="text-sm text-[#94A3B8] mb-4">
          How should new matching files be handled?
        </p>

        <div className="space-y-3">
          {/* Manual Review */}
          <button
            onClick={() => setAutoApprovalMode('manual')}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              autoApprovalMode === 'manual'
                ? 'border-[#00F0FF] bg-[#00F0FF]/5'
                : 'border-[#334155] bg-[#1E293B]/30 hover:border-[#475569]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                checked={autoApprovalMode === 'manual'}
                onChange={() => setAutoApprovalMode('manual')}
                className="mt-1 w-4 h-4"
              />
              <div className="flex-1">
                <h5 className="text-white font-medium mb-1">
                  ✋ Require Manual Review (Recommended)
                </h5>
                <p className="text-sm text-[#94A3B8]">
                  Files appear in pending queue. You review and approve before they're added.
                </p>
              </div>
            </div>
          </button>

          {/* Auto-Approve */}
          <button
            onClick={() => setAutoApprovalMode('auto-approve')}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              autoApprovalMode === 'auto-approve'
                ? 'border-[#00F0FF] bg-[#00F0FF]/5'
                : 'border-[#334155] bg-[#1E293B]/30 hover:border-[#475569]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                checked={autoApprovalMode === 'auto-approve'}
                onChange={() => setAutoApprovalMode('auto-approve')}
                className="mt-1 w-4 h-4"
              />
              <div className="flex-1">
                <h5 className="text-white font-medium mb-1 flex items-center gap-2">
                  ⚡ Auto-Approve All Matches
                  <span className="px-2 py-0.5 bg-[#FF5733]/20 text-[#FF5733] text-xs rounded">
                    Risky
                  </span>
                </h5>
                <p className="text-sm text-[#94A3B8]">
                  Files appear immediately. No review needed. Use only if you trust your rules.
                </p>
              </div>
            </div>
          </button>

          {/* Auto-Approve + Notify */}
          <button
            onClick={() => setAutoApprovalMode('auto-notify')}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              autoApprovalMode === 'auto-notify'
                ? 'border-[#00F0FF] bg-[#00F0FF]/5'
                : 'border-[#334155] bg-[#1E293B]/30 hover:border-[#475569]'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                checked={autoApprovalMode === 'auto-notify'}
                onChange={() => setAutoApprovalMode('auto-notify')}
                className="mt-1 w-4 h-4"
              />
              <div className="flex-1">
                <h5 className="text-white font-medium mb-1">
                  🔔 Auto-Approve + Notify Me
                </h5>
                <p className="text-sm text-[#94A3B8]">
                  Files auto-add immediately, but you get notified so you can undo if needed.
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Safety Limit */}
      <div className="bg-[#1E293B]/30 border border-[#334155] rounded-lg p-4">
        <h5 className="text-white font-medium mb-2">Safety Limit</h5>
        <p className="text-sm text-[#94A3B8] mb-3">
          Stop auto-syncing after this many pending files (prevents workspace bloat):
        </p>
        <input
          type="number"
          defaultValue={50}
          min={10}
          max={500}
          className="w-32 bg-[#0B0F19]/50 border border-[#334155] rounded px-3 py-2 text-white focus:outline-none focus:border-[#00F0FF]/50"
        />
        <span className="text-sm text-[#64748B] ml-2">files</span>
      </div>
    </div>
  );
}
