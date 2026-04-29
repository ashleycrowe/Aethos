/**
 * Pending Approvals Panel
 * Review queue for auto-synced files that need manual approval
 */

import { useState } from 'react';
import { Asset } from '../types/aethos.types';
import { CheckCircle2, XCircle, AlertTriangle, Clock, Tag, Ban } from 'lucide-react';

interface PendingAsset extends Asset {
  addedAt: string;
  matchReason: string;
  matchedTags?: string[];
}

interface PendingApprovalsPanelProps {
  workspaceName: string;
  pendingAssets: PendingAsset[];
  onApprove: (assetIds: string[]) => void;
  onReject: (assetIds: string[]) => void;
  onRejectAndBlockTag: (assetId: string, tag: string) => void;
  onClose: () => void;
}

export function PendingApprovalsPanel({
  workspaceName,
  pendingAssets,
  onApprove,
  onReject,
  onRejectAndBlockTag,
  onClose,
}: PendingApprovalsPanelProps) {
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(
    new Set(pendingAssets.map((a) => a.id))
  );
  const [showBlockTagDialog, setShowBlockTagDialog] = useState<{
    assetId: string;
    tags: string[];
  } | null>(null);

  const toggleAssetSelection = (id: string) => {
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getTimeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const getWarningFlags = (asset: PendingAsset): string[] => {
    const flags: string[] = [];
    
    if (asset.isDuplicate) flags.push('Possible duplicate');
    if (asset.isStale) flags.push('No activity in 180+ days');
    if (asset.isOrphaned) flags.push('Orphaned (no clear owner)');
    if (asset.sizeBytes > 50 * 1024 * 1024) flags.push('Large file (>50 MB)');
    
    return flags;
  };

  const handleApproveSelected = () => {
    onApprove(Array.from(selectedAssetIds));
    setSelectedAssetIds(new Set());
  };

  const handleRejectSelected = () => {
    onReject(Array.from(selectedAssetIds));
    setSelectedAssetIds(new Set());
  };

  const handleRejectAndBlock = (assetId: string, tag: string) => {
    onRejectAndBlockTag(assetId, tag);
    setShowBlockTagDialog(null);
    setSelectedAssetIds((prev) => {
      const next = new Set(prev);
      next.delete(assetId);
      return next;
    });
  };

  return (
    <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            📋 Pending Files ({pendingAssets.length})
          </h3>
          <p className="text-sm text-[#94A3B8]">
            Auto-synced to <span className="text-white">{workspaceName}</span> in the last 24 hours
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-[#94A3B8] hover:text-white transition-colors text-sm"
        >
          Close
        </button>
      </div>

      {/* Bulk Actions */}
      {pendingAssets.length > 0 && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#94A3B8] cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAssetIds.size === pendingAssets.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAssetIds(new Set(pendingAssets.map((a) => a.id)));
                  } else {
                    setSelectedAssetIds(new Set());
                  }
                }}
                className="w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#00F0FF] focus:ring-[#00F0FF]/50"
              />
              Select All
            </label>
            <span className="text-[#64748B]">
              ({selectedAssetIds.size} selected)
            </span>
          </div>

          {selectedAssetIds.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleRejectSelected}
                className="px-4 py-2 bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] rounded-lg hover:bg-[#FF5733]/20 transition-all text-sm flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject Selected
              </button>
              <button
                onClick={handleApproveSelected}
                className="px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all text-sm font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Approve Selected
              </button>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      {pendingAssets.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-[#00F0FF] mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">All Caught Up!</h4>
          <p className="text-sm text-[#94A3B8]">
            No pending files to review. New matches will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {pendingAssets.map((asset) => {
            const isSelected = selectedAssetIds.has(asset.id);
            const warningFlags = getWarningFlags(asset);
            const hasSuspiciousFlags = warningFlags.length > 0;

            return (
              <div
                key={asset.id}
                className={`border rounded-lg p-4 transition-all ${
                  isSelected
                    ? 'bg-[#00F0FF]/5 border-[#00F0FF]/30'
                    : hasSuspiciousFlags
                    ? 'bg-[#FF5733]/5 border-[#FF5733]/20'
                    : 'bg-[#1E293B]/30 border-[#334155]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAssetSelection(asset.id)}
                    className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#00F0FF] focus:ring-[#00F0FF]/50"
                  />

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate mb-1">
                          {asset.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <Clock className="w-3 h-3" />
                          <span>Added {getTimeSince(asset.addedAt)}</span>
                          <span>•</span>
                          <span>{asset.locationPath}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#64748B]">
                        {(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>

                    {/* Match Reason */}
                    <div className="mb-2">
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded text-xs">
                        <Tag className="w-3 h-3 text-[#00F0FF]" />
                        <span className="text-[#00F0FF]">
                          Matched: {asset.matchReason}
                        </span>
                      </div>
                    </div>

                    {/* Matched Tags */}
                    {asset.matchedTags && asset.matchedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {asset.matchedTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Warning Flags */}
                    {hasSuspiciousFlags && (
                      <div className="mb-3">
                        {warningFlags.map((flag, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-1 text-xs text-[#FF5733] mb-1"
                          >
                            <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove([asset.id])}
                        className="flex-1 px-3 py-1.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] rounded hover:bg-[#00F0FF]/20 transition-all text-xs flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Keep
                      </button>
                      <button
                        onClick={() => onReject([asset.id])}
                        className="flex-1 px-3 py-1.5 bg-[#1E293B]/50 border border-[#334155] text-[#94A3B8] rounded hover:border-[#475569] transition-all text-xs flex items-center justify-center gap-1"
                      >
                        <XCircle className="w-3 h-3" />
                        Remove
                      </button>
                      {asset.matchedTags && asset.matchedTags.length > 0 && (
                        <button
                          onClick={() =>
                            setShowBlockTagDialog({
                              assetId: asset.id,
                              tags: asset.matchedTags!,
                            })
                          }
                          className="px-3 py-1.5 bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] rounded hover:bg-[#FF5733]/20 transition-all text-xs flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          Block Tag
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Block Tag Dialog */}
      {showBlockTagDialog && (
        <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#FF5733]/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-[0_0_40px_rgba(255,87,51,0.2)]">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-[#FF5733]" />
              Block Tag from Auto-Sync
            </h4>
            <p className="text-sm text-[#94A3B8] mb-4">
              Remove this file and prevent future files with the same tag from being auto-synced to
              this workspace.
            </p>

            <div className="mb-4">
              <label className="text-xs text-[#64748B] mb-2 block">Select tag to block:</label>
              <div className="space-y-2">
                {showBlockTagDialog.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleRejectAndBlock(showBlockTagDialog.assetId, tag)}
                    className="w-full px-4 py-3 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#FF5733]/50 hover:bg-[#FF5733]/5 transition-all text-left"
                  >
                    <span className="font-medium">{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBlockTagDialog(null)}
                className="flex-1 px-4 py-2 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#475569] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => onReject([showBlockTagDialog.assetId])}
                className="flex-1 px-4 py-2 bg-[#FF5733] text-white rounded-lg hover:bg-[#FF5733]/90 transition-all font-medium"
              >
                Just Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
