/**
 * Aethos Document Control - Version History Tree
 * 
 * Git-like visualization of document version lineage
 */

import React, { useState } from 'react';
import { GitBranch, GitCommit, GitMerge, ChevronRight, FileText, Download, Eye } from 'lucide-react';
import { DocumentVersion } from '../types/document-control.types';

interface VersionHistoryTreeProps {
  versions: DocumentVersion[];
  currentVersionId: string;
  onVersionSelect?: (version: DocumentVersion) => void;
}

export const VersionHistoryTree: React.FC<VersionHistoryTreeProps> = ({
  versions,
  currentVersionId,
  onVersionSelect,
}) => {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set([currentVersionId]));

  const toggleExpanded = (versionId: string) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  const getVersionIcon = (version: DocumentVersion) => {
    if (version.branchedFrom) {
      return <GitBranch className="w-4 h-4 text-purple-400" />;
    }
    if (version.mergedInto) {
      return <GitMerge className="w-4 h-4 text-emerald-400" />;
    }
    return <GitCommit className="w-4 h-4 text-[#00F0FF]" />;
  };

  const getVersionColor = (version: DocumentVersion): string => {
    if (version.id === currentVersionId) {
      return 'border-[#00F0FF]/50 bg-[#00F0FF]/10';
    }
    if (version.isCurrent) {
      return 'border-emerald-500/50 bg-emerald-500/10';
    }
    return 'border-white/10 bg-white/5';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Sort versions by creation date (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group versions into branches
  const mainBranch = sortedVersions.filter(v => !v.branchedFrom);
  const branches = sortedVersions.filter(v => v.branchedFrom);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Version History</h3>
          <p className="text-sm text-white/60">{versions.length} versions</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
            Compare Versions
          </button>
          <button className="px-4 py-2 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-xl hover:bg-[#00F0FF]/20 transition-colors text-sm font-semibold">
            Create Branch
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {sortedVersions.map((version, index) => {
          const isExpanded = expandedVersions.has(version.id);
          const isCurrent = version.id === currentVersionId;
          const isLast = index === sortedVersions.length - 1;

          return (
            <div key={version.id} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div className="absolute left-[19px] top-[48px] w-0.5 h-[calc(100%+12px)] bg-white/20" />
              )}

              {/* Version Card */}
              <div
                className={`relative backdrop-blur-xl border rounded-xl p-4 cursor-pointer transition-all duration-200 ${getVersionColor(version)} ${
                  isCurrent ? 'ring-2 ring-[#00F0FF]/30' : ''
                } hover:border-[#00F0FF]/50`}
                onClick={() => {
                  toggleExpanded(version.id);
                  onVersionSelect?.(version);
                }}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      {getVersionIcon(version)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white">
                            Version {version.version}
                          </h4>
                          {version.isCurrent && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5 text-xs font-bold uppercase">
                              Current
                            </span>
                          )}
                          {isCurrent && (
                            <span className="bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-full px-2 py-0.5 text-xs font-bold uppercase">
                              Viewing
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/50">
                          {new Date(version.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(version.id);
                        }}
                        className={`p-1 hover:bg-white/10 rounded transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      >
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      </button>
                    </div>

                    {/* Change Description */}
                    <div className="mb-3">
                      <p className="text-sm text-white/80">{version.changeDescription}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{version.sourceFileName}</span>
                      </div>
                      <div>
                        <span className="text-white/40">•</span>
                        <span className="ml-2">{formatFileSize(version.fileSize)}</span>
                      </div>
                      <div>
                        <span className="text-white/40">•</span>
                        <span className="ml-2 capitalize">{version.changeType} change</span>
                      </div>
                    </div>

                    {/* Approval Status */}
                    {version.approvalStatus && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          version.approvalStatus === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : version.approvalStatus === 'rejected'
                            ? 'bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {version.approvalStatus}
                        </span>
                        {version.approvedBy && version.approvedAt && (
                          <span className="text-xs text-white/50">
                            by {version.approvedBy} on{' '}
                            {new Date(version.approvedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                        {/* Lineage */}
                        {(version.parentVersionId || version.branchedFrom || version.mergedInto) && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="text-xs text-white/50 mb-2">Lineage:</div>
                            <div className="space-y-1 text-xs">
                              {version.parentVersionId && (
                                <div className="flex items-center gap-2 text-white/70">
                                  <GitCommit className="w-3 h-3" />
                                  <span>Parent: {version.parentVersionId}</span>
                                </div>
                              )}
                              {version.branchedFrom && (
                                <div className="flex items-center gap-2 text-purple-400">
                                  <GitBranch className="w-3 h-3" />
                                  <span>Branched from: {version.branchedFrom}</span>
                                </div>
                              )}
                              {version.mergedInto && (
                                <div className="flex items-center gap-2 text-emerald-400">
                                  <GitMerge className="w-3 h-3" />
                                  <span>Merged into: {version.mergedInto}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* PDF Version */}
                        {version.pdfFileUrl && (
                          <div className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-white/70">
                                <FileText className="w-4 h-4 text-red-400" />
                                <span>PDF version available</span>
                              </div>
                              <button className="text-xs text-[#00F0FF] hover:underline">
                                Download PDF
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('View version:', version.id);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Download version:', version.id);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          {!version.isCurrent && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Restore version:', version.id);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-lg hover:bg-[#00F0FF]/20 transition-colors text-sm font-semibold"
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-white/50 mb-1">Total Versions</div>
          <div className="text-2xl font-bold text-white">{versions.length}</div>
        </div>
        <div>
          <div className="text-white/50 mb-1">Branches</div>
          <div className="text-2xl font-bold text-purple-400">{branches.length}</div>
        </div>
        <div>
          <div className="text-white/50 mb-1">Main Line</div>
          <div className="text-2xl font-bold text-[#00F0FF]">{mainBranch.length}</div>
        </div>
      </div>
    </div>
  );
};
