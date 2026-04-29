/**
 * Aethos Document Control - Compliance Gap Detector
 * 
 * AI-powered detection of compliance issues and gaps
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  TrendingDown,
  FileX,
  Clock,
  Users,
} from 'lucide-react';
import { ComplianceGap } from '../types/document-control.types';
import { MOCK_COMPLIANCE_GAPS } from '../utils/mockData';

export const ComplianceGapDetector: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showResolved, setShowResolved] = useState(false);

  const gaps = MOCK_COMPLIANCE_GAPS;

  // Filter gaps
  const filteredGaps = gaps.filter(gap => {
    const matchesSeverity = filterSeverity === 'all' || gap.severity === filterSeverity;
    const matchesResolved = showResolved || !gap.isResolved;
    return matchesSeverity && matchesResolved;
  });

  // Calculate statistics
  const stats = {
    total: gaps.filter(g => !g.isResolved).length,
    critical: gaps.filter(g => g.severity === 'critical' && !g.isResolved).length,
    high: gaps.filter(g => g.severity === 'high' && !g.isResolved).length,
    medium: gaps.filter(g => g.severity === 'medium' && !g.isResolved).length,
    low: gaps.filter(g => g.severity === 'low' && !g.isResolved).length,
    resolved: gaps.filter(g => g.isResolved).length,
  };

  const getSeverityConfig = (severity: 'critical' | 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'critical':
        return {
          icon: <XCircle className="w-5 h-5" />,
          label: 'Critical',
          bgColor: 'bg-[#FF5733]/10',
          textColor: 'text-[#FF5733]',
          borderColor: 'border-[#FF5733]/30',
          emoji: '🔴',
        };
      case 'high':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          label: 'High',
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          emoji: '⚠️',
        };
      case 'medium':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          label: 'Medium',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          emoji: '⚡',
        };
      case 'low':
        return {
          icon: <Info className="w-5 h-5" />,
          label: 'Low',
          bgColor: 'bg-sky-500/10',
          textColor: 'text-sky-400',
          borderColor: 'border-sky-500/30',
          emoji: 'ℹ️',
        };
    }
  };

  const getGapTypeIcon = (type: string) => {
    switch (type) {
      case 'expired_document':
        return <Clock className="w-4 h-4" />;
      case 'missing_approval':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'low_acknowledgement':
        return <Users className="w-4 h-4" />;
      case 'orphaned_document':
        return <FileX className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getGapTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      expired_document: 'Expired Document',
      missing_approval: 'Missing Approval',
      low_acknowledgement: 'Low Acknowledgement',
      orphaned_document: 'Orphaned Document',
      overdue_review: 'Overdue Review',
      missing_owner: 'Missing Owner',
      no_review_date: 'No Review Date',
    };
    return labels[type] || type.replace(/_/g, ' ');
  };

  const complianceScore = Math.max(0, 100 - (stats.critical * 10 + stats.high * 5 + stats.medium * 2 + stats.low * 1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">🛡️ Compliance Dashboard</h2>
            <p className="text-white/60">AI-powered gap detection and compliance monitoring</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60 mb-1">Overall Compliance Score</div>
            <div className={`text-4xl font-black ${
              complianceScore >= 90 ? 'text-emerald-400' :
              complianceScore >= 75 ? 'text-[#00F0FF]' :
              complianceScore >= 60 ? 'text-amber-400' :
              'text-[#FF5733]'
            }`}>
              {complianceScore}%
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-5 gap-4">
          <div className="backdrop-blur-xl bg-[#FF5733]/10 border border-[#FF5733]/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-[#FF5733]" />
              <div className="text-xs text-[#FF5733]/80 uppercase tracking-wider">Critical</div>
            </div>
            <div className="text-3xl font-black text-[#FF5733]">{stats.critical}</div>
          </div>

          <div className="backdrop-blur-xl bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <div className="text-xs text-orange-400/80 uppercase tracking-wider">High</div>
            </div>
            <div className="text-3xl font-black text-orange-400">{stats.high}</div>
          </div>

          <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <div className="text-xs text-amber-400/80 uppercase tracking-wider">Medium</div>
            </div>
            <div className="text-3xl font-black text-amber-400">{stats.medium}</div>
          </div>

          <div className="backdrop-blur-xl bg-sky-500/10 border border-sky-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-sky-400" />
              <div className="text-xs text-sky-400/80 uppercase tracking-wider">Low</div>
            </div>
            <div className="text-3xl font-black text-sky-400">{stats.low}</div>
          </div>

          <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div className="text-xs text-emerald-400/80 uppercase tracking-wider">Resolved</div>
            </div>
            <div className="text-3xl font-black text-emerald-400">{stats.resolved}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/60">Filter by severity:</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map(severity => (
            <button
              key={severity}
              onClick={() => setFilterSeverity(severity)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filterSeverity === severity
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#00F0FF] focus:ring-[#00F0FF]/50"
            />
            <span className="text-sm text-white/60">Show resolved</span>
          </label>
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {filteredGaps.length === 0 ? (
          <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">
              All Clear! 🎉
            </h3>
            <p className="text-emerald-400/80">
              No compliance gaps detected with current filters
            </p>
          </div>
        ) : (
          filteredGaps.map(gap => {
            const config = getSeverityConfig(gap.severity);

            return (
              <div
                key={gap.id}
                className={`backdrop-blur-xl border rounded-2xl p-6 ${
                  gap.isResolved
                    ? 'bg-white/5 border-white/10 opacity-60'
                    : `${config.bgColor} ${config.borderColor}`
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                      <span className="text-2xl">{config.emoji}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{gap.title}</h3>
                        <span className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </div>

                      {/* Type Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/70 border border-white/20 rounded-lg px-2 py-1 text-xs">
                          {getGapTypeIcon(gap.type)}
                          {getGapTypeLabel(gap.type)}
                        </span>
                        {gap.documentId && (
                          <span className="text-xs text-white/50 font-mono">
                            Document: {gap.documentId}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-white/80 mb-3">{gap.description}</p>

                      {/* Recommendation */}
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <TrendingDown className="w-4 h-4 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs text-white/50 mb-1">Recommendation:</div>
                            <div className="text-sm text-white/80">{gap.recommendation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    <div>
                      Detected: {new Date(gap.detectedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-white/40">•</span>
                      <span className="ml-2">By: {gap.detectedBy}</span>
                    </div>
                    {gap.isResolved && gap.resolvedBy && (
                      <>
                        <div>
                          <span className="text-white/40">•</span>
                          <span className="ml-2 text-emerald-400">
                            Resolved by {gap.resolvedBy} on {new Date(gap.resolvedAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {!gap.isResolved && (
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-white/5 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors text-sm font-semibold">
                        View Document
                      </button>
                      <button className="px-4 py-2 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-lg hover:bg-[#00F0FF]/20 transition-colors text-sm font-semibold">
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-white/60">
            Showing {filteredGaps.length} of {gaps.length} gaps
          </div>
          {stats.total > 0 && (
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-white/80">
                {stats.total} active {stats.total === 1 ? 'gap' : 'gaps'} requiring attention
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
