/**
 * Aethos Document Control - Library Detail Page
 * 
 * Shows all documents within a specific library
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Plus,
  Settings,
  Download,
  Folder,
  FileCheck,
  Shield,
} from 'lucide-react';
import { DocumentCard, DocumentSearch } from '../components';
import { useDocumentControl } from '../context/DocumentControlContext';
import type { SearchFilters } from '../components/DocumentSearch';
import { ComplianceStandard } from '../types/document-control.types';

export const LibraryDetailPage: React.FC = () => {
  const { libraryId } = useParams<{ libraryId: string }>();
  const navigate = useNavigate();
  const { libraries, documents } = useDocumentControl();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({ query: '' });

  const library = libraries.find(lib => lib.id === libraryId);
  const libraryDocuments = documents.filter(doc => doc.libraryId === libraryId);

  // Filter documents based on search
  const filteredDocuments = libraryDocuments.filter(doc => {
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      const matchesQuery =
        doc.title.toLowerCase().includes(query) ||
        doc.documentNumber.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesQuery) return false;
    }

    if (searchFilters.status && doc.status !== searchFilters.status) {
      return false;
    }

    if (searchFilters.type && doc.type !== searchFilters.type) {
      return false;
    }

    if (searchFilters.complianceStandard && doc.complianceStandard !== searchFilters.complianceStandard) {
      return false;
    }

    return true;
  });

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  if (!library) {
    return (
      <div className="min-h-screen bg-[#0B0F19] p-8 flex items-center justify-center">
        <div className="text-center">
          <Folder className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <h2 className="text-2xl font-bold text-white mb-2">Library Not Found</h2>
          <p className="text-white/60 mb-6">The requested library could not be found.</p>
          <button
            onClick={() => navigate('/document-control')}
            className="bg-[#00F0FF] text-black font-black uppercase px-6 py-3 rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

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
      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider">
        <Shield className="w-4 h-4" />
        {standardLabels[library.complianceStandard]}
      </span>
    );
  };

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
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center">
                <Folder className="w-8 h-8 text-[#00F0FF]" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-black text-white mb-2">{library.name}</h1>
                {library.description && (
                  <p className="text-white/60 mb-3">{library.description}</p>
                )}
                <div className="flex items-center gap-3">
                  {getComplianceBadge()}
                  {library.isPrivate && (
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider">
                      🔒 Private
                    </span>
                  )}
                  <span className="text-sm text-white/50">
                    Prefix: <span className="text-[#00F0FF] font-mono">{library.numberingPrefix}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/document-control/libraries/${library.id}/settings`)}
                className="p-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                title="Library Settings"
              >
                <Settings className="w-5 h-5 text-white/60" />
              </button>
              <button
                className="p-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                title="Export Library"
              >
                <Download className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
            <div>
              <div className="text-2xl font-black text-white mb-1">{library.documentCount}</div>
              <div className="text-xs text-white/60">Total Documents</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400 mb-1">
                {libraryDocuments.filter(d => d.status === 'published').length}
              </div>
              <div className="text-xs text-white/60">Published</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 mb-1">
                {libraryDocuments.filter(d => d.status === 'in_review').length}
              </div>
              <div className="text-xs text-white/60">In Review</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#00F0FF] mb-1">
                {Math.round(
                  libraryDocuments.reduce((sum, doc) => sum + doc.healthScore, 0) /
                    libraryDocuments.length || 0
                )}%
              </div>
              <div className="text-xs text-white/60">Avg Health</div>
            </div>
          </div>
        </div>
      </header>

      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white/60">
          Showing {filteredDocuments.length} of {libraryDocuments.length} documents
        </div>
        <button
          onClick={() => navigate(`/document-control/libraries/${library.id}/documents/new`)}
          className="flex items-center gap-2 bg-[#00F0FF] text-black font-black uppercase tracking-wider px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Add Document
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <DocumentSearch onSearch={handleSearch} showAISearch={true} />
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
          <FileCheck className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <h3 className="text-2xl font-bold text-white mb-2">
            {libraryDocuments.length === 0 ? 'No Documents Yet' : 'No Results Found'}
          </h3>
          <p className="text-white/60 mb-6">
            {libraryDocuments.length === 0
              ? 'Add your first document to this library to get started.'
              : 'Try adjusting your search filters.'}
          </p>
          {libraryDocuments.length === 0 && (
            <button
              onClick={() => navigate(`/document-control/libraries/${library.id}/documents/new`)}
              className="bg-[#00F0FF] text-black font-black uppercase px-6 py-3 rounded-2xl"
            >
              <Plus className="inline-block w-5 h-5 mr-2" />
              Add First Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}
    </div>
  );
};
