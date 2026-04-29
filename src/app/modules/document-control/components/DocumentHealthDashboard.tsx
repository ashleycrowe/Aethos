/**
 * Aethos Document Control - Document Health Dashboard
 * 
 * Analytics and metrics for document health across libraries
 */

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  FileCheck,
  Clock,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { ControlledDocument, DocumentLibrary, DocumentStatus } from '../types/document-control.types';
import { useDocumentControl } from '../context/DocumentControlContext';

export const DocumentHealthDashboard: React.FC = () => {
  const { documents, libraries } = useDocumentControl();

  // Calculate overall statistics
  const stats = {
    totalDocuments: documents.length,
    published: documents.filter(d => d.status === DocumentStatus.PUBLISHED).length,
    inReview: documents.filter(d => d.status === DocumentStatus.IN_REVIEW).length,
    draft: documents.filter(d => d.status === DocumentStatus.DRAFT).length,
    expired: documents.filter(d => d.status === DocumentStatus.EXPIRED).length,
    avgHealthScore: Math.round(
      documents.reduce((sum, doc) => sum + doc.healthScore, 0) / documents.length || 0
    ),
  };

  // Calculate health distribution
  const healthDistribution = {
    excellent: documents.filter(d => d.healthScore >= 90).length,
    good: documents.filter(d => d.healthScore >= 75 && d.healthScore < 90).length,
    fair: documents.filter(d => d.healthScore >= 60 && d.healthScore < 75).length,
    poor: documents.filter(d => d.healthScore >= 40 && d.healthScore < 60).length,
    critical: documents.filter(d => d.healthScore < 40).length,
  };

  // Top contributors (mock data)
  const topContributors = [
    { id: 'user-1', name: 'Sarah Johnson', documents: 12, score: 92 },
    { id: 'user-2', name: 'Mike Torres', documents: 8, score: 88 },
    { id: 'user-5', name: 'Emily Chen', documents: 6, score: 95 },
  ];

  // Recent activity (mock data)
  const recentActivity = [
    { action: 'published', document: 'SOP-HR-2026-001', user: 'Sarah Johnson', time: '2 hours ago' },
    { action: 'approved', document: 'POL-IT-2026-015', user: 'Mike Torres', time: '5 hours ago' },
    { action: 'submitted', document: 'QMS-2026-003', user: 'Emily Chen', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white mb-1">📊 Document Health Analytics</h2>
        <p className="text-white/60">Comprehensive insights into your document control system</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total Documents */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{stats.totalDocuments}</div>
          <div className="text-sm text-white/60">Total Documents</div>
        </div>

        {/* Published */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+8%</span>
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{stats.published}</div>
          <div className="text-sm text-white/60">Published</div>
        </div>

        {/* Average Health Score */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3%</span>
            </div>
          </div>
          <div className="text-3xl font-black text-[#00F0FF] mb-1">{stats.avgHealthScore}%</div>
          <div className="text-sm text-white/60">Avg Health Score</div>
        </div>

        {/* Issues */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#FF5733]/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#FF5733]" />
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-5%</span>
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {stats.expired + healthDistribution.critical}
          </div>
          <div className="text-sm text-white/60">Issues Detected</div>
        </div>
      </div>

      {/* Health Distribution & Status Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        {/* Health Distribution */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Health Distribution</h3>
              <p className="text-xs text-white/60">Document health scores</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Excellent */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Excellent (90-100%)</span>
                <span className="text-sm font-bold text-emerald-400">{healthDistribution.excellent}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400"
                  style={{ width: `${(healthDistribution.excellent / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>

            {/* Good */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Good (75-89%)</span>
                <span className="text-sm font-bold text-[#00F0FF]">{healthDistribution.good}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00F0FF]"
                  style={{ width: `${(healthDistribution.good / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>

            {/* Fair */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Fair (60-74%)</span>
                <span className="text-sm font-bold text-amber-400">{healthDistribution.fair}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${(healthDistribution.fair / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>

            {/* Poor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Poor (40-59%)</span>
                <span className="text-sm font-bold text-orange-400">{healthDistribution.poor}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400"
                  style={{ width: `${(healthDistribution.poor / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>

            {/* Critical */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Critical (0-39%)</span>
                <span className="text-sm font-bold text-[#FF5733]">{healthDistribution.critical}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF5733]"
                  style={{ width: `${(healthDistribution.critical / stats.totalDocuments) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Document Status</h3>
              <p className="text-xs text-white/60">Current workflow stages</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Published */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-white">Published</span>
              </div>
              <span className="text-lg font-bold text-emerald-400">{stats.published}</span>
            </div>

            {/* In Review */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-white">In Review</span>
              </div>
              <span className="text-lg font-bold text-amber-400">{stats.inReview}</span>
            </div>

            {/* Draft */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-white/60" />
                <span className="text-sm font-semibold text-white">Draft</span>
              </div>
              <span className="text-lg font-bold text-white">{stats.draft}</span>
            </div>

            {/* Expired */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#FF5733]/10 border border-[#FF5733]/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FF5733]" />
                <span className="text-sm font-semibold text-white">Expired</span>
              </div>
              <span className="text-lg font-bold text-[#FF5733]">{stats.expired}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors & Recent Activity */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Contributors */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#00F0FF]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Top Contributors</h3>
              <p className="text-xs text-white/60">Most active document owners</p>
            </div>
          </div>

          <div className="space-y-3">
            {topContributors.map((contributor, index) => (
              <div
                key={contributor.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#00F0FF]/10 flex items-center justify-center text-sm font-bold text-[#00F0FF]">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white mb-1">{contributor.name}</div>
                  <div className="text-xs text-white/50">
                    {contributor.documents} documents · {contributor.score}% avg health
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#00F0FF]">{contributor.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-white/60">Latest document actions</p>
            </div>
          </div>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.action === 'published' ? 'bg-emerald-400' :
                  activity.action === 'approved' ? 'bg-[#00F0FF]' :
                  'bg-amber-400'
                }`} />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="font-semibold">{activity.user}</span>
                    {' '}<span className="text-white/60">{activity.action}</span>{' '}
                    <span className="font-mono text-[#00F0FF]">{activity.document}</span>
                  </div>
                  <div className="text-xs text-white/40">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
