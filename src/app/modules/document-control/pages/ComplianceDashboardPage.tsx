/**
 * Aethos Document Control - Compliance Dashboard Page
 * 
 * Comprehensive compliance monitoring and gap detection
 */

import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Download, FileCheck, AlertTriangle } from 'lucide-react';
import { ComplianceGapDetector } from '../components';
import { useDocumentControl } from '../context/DocumentControlContext';

export const ComplianceDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, libraries } = useDocumentControl();

  // Calculate compliance statistics
  const stats = {
    totalLibraries: libraries.length,
    compliantLibraries: libraries.filter(lib => lib.complianceStandard !== 'none').length,
    totalDocuments: documents.length,
    compliantDocuments: documents.filter(
      doc => doc.healthScore >= 75 && doc.status === 'published'
    ).length,
  };

  const complianceRate = stats.totalDocuments > 0
    ? Math.round((stats.compliantDocuments / stats.totalDocuments) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8">
      {/* Header */}
      <header className="mb-8">
        <button
          onClick={() => navigate('/document-control')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Document Control
        </button>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center">
                <FileCheck className="w-8 h-8 text-[#00F0FF]" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-1">Compliance Dashboard</h1>
                <p className="text-white/60">
                  Monitor compliance gaps and regulatory requirements
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors font-semibold">
                <Download className="w-5 h-5" />
                Export Audit Report
              </button>
            </div>
          </div>

          {/* Overall Compliance Score */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-white/60 mb-1">Overall Compliance Rate</div>
                <div className={`text-4xl font-black ${
                  complianceRate >= 90 ? 'text-emerald-400' :
                  complianceRate >= 75 ? 'text-[#00F0FF]' :
                  complianceRate >= 60 ? 'text-amber-400' :
                  'text-[#FF5733]'
                }`}>
                  {complianceRate}%
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="text-white/50 mb-1">Compliant Documents</div>
                  <div className="text-2xl font-bold text-white">
                    {stats.compliantDocuments} / {stats.totalDocuments}
                  </div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Compliance-Enabled Libraries</div>
                  <div className="text-2xl font-bold text-white">
                    {stats.compliantLibraries} / {stats.totalLibraries}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  complianceRate >= 90 ? 'bg-emerald-400' :
                  complianceRate >= 75 ? 'bg-[#00F0FF]' :
                  complianceRate >= 60 ? 'bg-amber-400' :
                  'bg-[#FF5733]'
                }`}
                style={{ width: `${complianceRate}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Compliance Standards Breakdown */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
          <div className="text-sm text-emerald-400/80 mb-2">ISO 9001</div>
          <div className="text-3xl font-black text-emerald-400 mb-1">
            {libraries.filter(lib => lib.complianceStandard === 'iso_9001').length}
          </div>
          <div className="text-xs text-emerald-400/60">Libraries</div>
        </div>

        <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
          <div className="text-sm text-blue-400/80 mb-2">FDA 21 CFR Part 11</div>
          <div className="text-3xl font-black text-blue-400 mb-1">
            {libraries.filter(lib => lib.complianceStandard === 'fda_21_cfr_part_11').length}
          </div>
          <div className="text-xs text-blue-400/60">Libraries</div>
        </div>

        <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
          <div className="text-sm text-purple-400/80 mb-2">SOC 2</div>
          <div className="text-3xl font-black text-purple-400 mb-1">
            {libraries.filter(lib => lib.complianceStandard === 'soc_2').length}
          </div>
          <div className="text-xs text-purple-400/60">Libraries</div>
        </div>

        <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="text-sm text-amber-400/80 mb-2">Other Standards</div>
          <div className="text-3xl font-black text-amber-400 mb-1">
            {libraries.filter(lib =>
              ['gdpr', 'hipaa', 'gxp'].includes(lib.complianceStandard)
            ).length}
          </div>
          <div className="text-xs text-amber-400/60">Libraries</div>
        </div>
      </div>

      {/* Gap Detection */}
      <ComplianceGapDetector />
    </div>
  );
};
