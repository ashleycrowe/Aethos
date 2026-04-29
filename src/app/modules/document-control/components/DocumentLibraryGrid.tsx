/**
 * Aethos Document Control - Library Grid View
 * 
 * Displays all document libraries in a grid layout
 */

import React from 'react';
import { Folder, Lock, Shield, FileCheck, Plus } from 'lucide-react';
import { ComplianceStandard } from '../types/document-control.types';
import { useDocumentControl } from '../context/DocumentControlContext';

export const DocumentLibraryGrid: React.FC = () => {
  const { libraries, isLoading } = useDocumentControl();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-[#00F0FF]" />
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <Folder className="w-12 h-12 text-white/30" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Document Libraries</h3>
        <p className="text-white/60 mb-6">
          Create your first library to start managing controlled documents
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {libraries.map(library => (
        <LibraryCard key={library.id} library={library} />
      ))}
    </div>
  );
};

// ============================================================================
// LIBRARY CARD COMPONENT
// ============================================================================

interface LibraryCardProps {
  library: DocumentLibrary;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ library }) => {
  const getComplianceIcon = () => {
    switch (library.complianceStandard) {
      case ComplianceStandard.ISO_9001:
        return <FileCheck className="w-5 h-5 text-emerald-400" />;
      case ComplianceStandard.FDA_21_CFR_PART_11:
        return <Shield className="w-5 h-5 text-blue-400" />;
      case ComplianceStandard.SOC_2:
        return <Lock className="w-5 h-5 text-purple-400" />;
      default:
        return <Folder className="w-5 h-5 text-white/40" />;
    }
  };

  const getComplianceBadge = () => {
    if (library.complianceStandard === ComplianceStandard.NONE) {
      return null;
    }

    const standardLabels: Record<ComplianceStandard, string> = {
      [ComplianceStandard.ISO_9001]: 'ISO 9001',
      [ComplianceStandard.FDA_21_CFR_PART_11]: 'FDA 21 CFR Part 11',
      [ComplianceStandard.SOC_2]: 'SOC 2',
      [ComplianceStandard.GDPR]: 'GDPR',
      [ComplianceStandard.HIPAA]: 'HIPAA',
      [ComplianceStandard.GXP]: 'GxP',
      [ComplianceStandard.NONE]: '',
    };

    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
        {getComplianceIcon()}
        {standardLabels[library.complianceStandard]}
      </span>
    );
  };

  return (
    <div
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00F0FF]/50 hover:bg-white/10 transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Folder className="w-6 h-6 text-[#00F0FF]" />
        </div>
        {library.isPrivate && (
          <Lock className="w-5 h-5 text-amber-400" title="Private Library" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00F0FF] transition-colors">
        {library.name}
      </h3>

      {/* Description */}
      {library.description && (
        <p className="text-sm text-white/60 mb-4 line-clamp-2">
          {library.description}
        </p>
      )}

      {/* Compliance Badge */}
      <div className="mb-4">{getComplianceBadge()}</div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-white/60">
          <span className="text-2xl font-bold text-white">{library.documentCount}</span>
          <span className="ml-1">documents</span>
        </div>
        <div className="text-white/60">
          Prefix: <span className="text-[#00F0FF] font-mono">{library.numberingPrefix}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
        <div>
          Updated {new Date(library.updatedAt).toLocaleDateString()}
        </div>
        {library.requireAcknowledgement && (
          <div className="flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Acknowledgement Required</span>
          </div>
        )}
      </div>
    </div>
  );
};