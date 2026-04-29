/**
 * Aethos Document Control - Document Search
 * 
 * Search and filter documents with Oracle integration
 */

import React, { useState } from 'react';
import { Search, Filter, X, Sparkles } from 'lucide-react';
import {
  DocumentType,
  DocumentStatus,
  ComplianceStandard,
  ControlledDocument,
} from '../types/document-control.types';

interface DocumentSearchProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  showAISearch?: boolean;
}

export interface SearchFilters {
  query: string;
  status?: DocumentStatus;
  type?: DocumentType;
  complianceStandard?: ComplianceStandard;
  libraryId?: string;
  tags?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

export const DocumentSearch: React.FC<DocumentSearchProps> = ({
  onSearch,
  showAISearch = true,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);

  const handleSearch = () => {
    onSearch?.(filters.query, filters);
  };

  const handleReset = () => {
    setFilters({ query: '' });
    setIsAIMode(false);
    onSearch?.('', { query: '' });
  };

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const activeFilterCount = Object.values(filters).filter(
    v => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
  ).length - 1; // Subtract query

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className={`flex items-center gap-3 backdrop-blur-xl border rounded-2xl px-4 py-3 transition-all ${
          isAIMode
            ? 'bg-gradient-to-r from-[#00F0FF]/10 to-purple-500/10 border-[#00F0FF]/50'
            : 'bg-white/5 border-white/10 focus-within:border-[#00F0FF]/50'
        }`}>
          {isAIMode ? (
            <Sparkles className="w-5 h-5 text-[#00F0FF] animate-pulse" />
          ) : (
            <Search className="w-5 h-5 text-white/40" />
          )}
          
          <input
            type="text"
            placeholder={
              isAIMode
                ? 'Ask Oracle: "Find all expired SOPs" or "Show documents needing review"...'
                : 'Search documents by title, number, tags...'
            }
            value={filters.query}
            onChange={(e) => updateFilter('query', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
          />

          {showAISearch && (
            <button
              onClick={() => setIsAIMode(!isAIMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                isAIMode
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
              title="Toggle AI-powered semantic search"
            >
              <Sparkles className="w-3.5 h-3.5 inline-block mr-1" />
              {isAIMode ? 'Oracle ON' : 'Oracle'}
            </button>
          )}

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              showAdvancedFilters || activeFilterCount > 0
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[#00F0FF] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
                {activeFilterCount}
              </span>
            )}
          </button>

          {filters.query && (
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          )}
        </div>

        {/* AI Search Hint */}
        {isAIMode && (
          <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-xl p-3">
            <div className="flex items-start gap-2 text-xs text-[#00F0FF]">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Oracle AI Search Active</div>
                <div className="text-[#00F0FF]/80">
                  Use natural language queries like "expired policies" or "documents missing approval"
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Advanced Filters</h3>
            <button
              onClick={handleReset}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => updateFilter('status', e.target.value as DocumentStatus || undefined)}
                className="w-full bg-[#1A1F2E] text-white border border-white/10 rounded-xl px-3 py-2 text-sm cursor-pointer focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20"
              >
                <option value="">All Statuses</option>
                <option value={DocumentStatus.DRAFT}>Draft</option>
                <option value={DocumentStatus.IN_REVIEW}>In Review</option>
                <option value={DocumentStatus.APPROVED}>Approved</option>
                <option value={DocumentStatus.PUBLISHED}>Published</option>
                <option value={DocumentStatus.ARCHIVED}>Archived</option>
                <option value={DocumentStatus.EXPIRED}>Expired</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Document Type</label>
              <select
                value={filters.type || ''}
                onChange={(e) => updateFilter('type', e.target.value as DocumentType || undefined)}
                className="w-full bg-[#1A1F2E] text-white border border-white/10 rounded-xl px-3 py-2 text-sm cursor-pointer focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20"
              >
                <option value="">All Types</option>
                <option value={DocumentType.POLICY}>Policy</option>
                <option value={DocumentType.SOP}>SOP</option>
                <option value={DocumentType.FORM}>Form</option>
                <option value={DocumentType.WORK_INSTRUCTION}>Work Instruction</option>
                <option value={DocumentType.TRAINING_MATERIAL}>Training Material</option>
                <option value={DocumentType.SPECIFICATION}>Specification</option>
                <option value={DocumentType.PROTOCOL}>Protocol</option>
                <option value={DocumentType.REPORT}>Report</option>
              </select>
            </div>

            {/* Compliance Standard Filter */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Compliance Standard</label>
              <select
                value={filters.complianceStandard || ''}
                onChange={(e) => updateFilter('complianceStandard', e.target.value as ComplianceStandard || undefined)}
                className="w-full bg-[#1A1F2E] text-white border border-white/10 rounded-xl px-3 py-2 text-sm cursor-pointer focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20"
              >
                <option value="">All Standards</option>
                <option value={ComplianceStandard.ISO_9001}>ISO 9001</option>
                <option value={ComplianceStandard.FDA_21_CFR_PART_11}>FDA 21 CFR Part 11</option>
                <option value={ComplianceStandard.SOC_2}>SOC 2</option>
                <option value={ComplianceStandard.GDPR}>GDPR</option>
                <option value={ComplianceStandard.HIPAA}>HIPAA</option>
                <option value={ComplianceStandard.GXP}>GxP</option>
                <option value={ComplianceStandard.NONE}>None</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSearch}
              className="flex-1 bg-[#00F0FF] text-black font-black uppercase tracking-wider px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all duration-200"
            >
              Apply Filters
            </button>
            <button
              onClick={() => setShowAdvancedFilters(false)}
              className="px-6 py-3 bg-white/5 text-white border border-white/20 rounded-2xl hover:bg-white/10 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
