/**
 * Oracle Metadata Search UI
 * Advanced metadata filtering and intelligence-based search
 */

import { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Tag,
  Sparkles,
  Calendar,
  FolderOpen,
  Users,
  FileText,
  Database,
  Globe,
  Shield,
  AlertTriangle,
  Copy,
  Trash2,
  Plus,
  Download,
  Bookmark,
  Filter,
  TrendingUp,
  Clock,
  HardDrive,
  Zap,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { Asset, ProviderType } from '../types/aethos.types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

// Mock data generator
const generateMockAssets = (): Asset[] => {
  const providers: ProviderType[] = ['microsoft', 'google', 'slack', 'box', 'local'];
  const types = ['file', 'folder', 'site', 'channel', 'page'] as const;
  const fileNames = [
    'Q1 Budget Review', 'Marketing Strategy 2026', 'Product Roadmap', 
    'Client Presentation', 'Annual Report', 'Team Meeting Notes',
    'Design System Guide', 'API Documentation', 'Security Audit',
    'Employee Handbook', 'Sales Pipeline', 'Revenue Forecast'
  ];
  const locations = [
    'Finance Team > Budget', 'Marketing > Strategy', 'Product > Roadmap',
    'Sales > Presentations', 'HR > Policies', 'Engineering > Docs'
  ];
  const userTagOptions = ['q1-2026', 'budget', 'marketing', 'product', 'security', 'hr', 'sales', 'engineering'];
  const enrichedTagOptions = ['financial-planning', 'strategic-initiative', 'customer-facing', 'internal-process', 'compliance', 'technical-spec'];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `asset-${i}`,
    tenantId: 'tenant-123',
    sourceProvider: providers[i % providers.length],
    sourceId: `src-${i}`,
    sourceUrl: `https://example.com/asset-${i}`,
    name: `${fileNames[i % fileNames.length]} ${Math.floor(i / fileNames.length) + 1}`,
    type: types[i % types.length],
    mimeType: i % 3 === 0 ? 'application/pdf' : i % 3 === 1 ? 'application/vnd.ms-excel' : 'text/plain',
    sizeBytes: Math.floor(Math.random() * 50000000),
    authorEmail: `user${i % 5}@company.com`,
    authorName: `User ${i % 5}`,
    modifiedByEmail: `modifier${i % 3}@company.com`,
    createdDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    modifiedDate: new Date(2025 + Math.floor(i / 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
    lastAccessedDate: new Date(2026, 1, Math.floor(Math.random() * 27)).toISOString(),
    locationPath: locations[i % locations.length],
    parentId: i % 3 === 0 ? `parent-${Math.floor(i / 3)}` : undefined,
    isSharedExternally: i % 4 === 0,
    shareCount: Math.floor(Math.random() * 20),
    permissionType: ['private', 'team', 'org', 'public'][i % 4] as any,
    userTags: Array.from({ length: Math.floor(Math.random() * 3) }, () => userTagOptions[Math.floor(Math.random() * userTagOptions.length)]),
    enrichedTags: Array.from({ length: Math.floor(Math.random() * 3) }, () => enrichedTagOptions[Math.floor(Math.random() * enrichedTagOptions.length)]),
    enrichedTitle: i % 3 === 0 ? `[Enriched] ${fileNames[i % fileNames.length]}` : undefined,
    intelligenceScore: Math.floor(Math.random() * 100),
    isOrphaned: i % 7 === 0,
    isDuplicate: i % 8 === 0,
    isStale: i % 6 === 0,
    lastSyncedAt: new Date().toISOString(),
    syncStatus: 'active'
  }));
};

type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'size-desc' | 'size-asc' | 'score-desc' | 'score-asc';

export const OracleMetadataSearch = () => {
  const { isDaylight } = useTheme();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Filter state
  const [selectedProviders, setSelectedProviders] = useState<ProviderType[]>([]);
  const [intelligenceRange, setIntelligenceRange] = useState<[number, number]>([0, 100]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [permissionFilter, setPermissionFilter] = useState<string[]>([]);
  const [showStaleOnly, setShowStaleOnly] = useState(false);
  const [showOrphanedOnly, setShowOrphanedOnly] = useState(false);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  
  // Results state
  const [allAssets] = useState<Asset[]>(generateMockAssets());
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(allAssets);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  
  // Apply filters
  useEffect(() => {
    let results = [...allAssets];
    
    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(asset => 
        asset.name.toLowerCase().includes(query) ||
        asset.locationPath.toLowerCase().includes(query) ||
        asset.userTags.some(tag => tag.toLowerCase().includes(query)) ||
        asset.enrichedTags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Provider filter
    if (selectedProviders.length > 0) {
      results = results.filter(asset => selectedProviders.includes(asset.sourceProvider));
    }
    
    // Intelligence score filter
    results = results.filter(asset => {
      const score = asset.intelligenceScore || 0;
      return score >= intelligenceRange[0] && score <= intelligenceRange[1];
    });
    
    // Tag filter
    if (selectedTags.length > 0) {
      results = results.filter(asset => {
        const allTags = [...asset.userTags, ...asset.enrichedTags];
        return selectedTags.some(tag => allTags.includes(tag));
      });
    }
    
    // Permission filter
    if (permissionFilter.length > 0) {
      results = results.filter(asset => permissionFilter.includes(asset.permissionType));
    }
    
    // Operational flags
    if (showStaleOnly) results = results.filter(asset => asset.isStale);
    if (showOrphanedOnly) results = results.filter(asset => asset.isOrphaned);
    if (showDuplicatesOnly) results = results.filter(asset => asset.isDuplicate);
    
    // Sort
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime();
        case 'date-asc':
          return new Date(a.modifiedDate).getTime() - new Date(b.modifiedDate).getTime();
        case 'size-desc':
          return b.sizeBytes - a.sizeBytes;
        case 'size-asc':
          return a.sizeBytes - b.sizeBytes;
        case 'score-desc':
          return (b.intelligenceScore || 0) - (a.intelligenceScore || 0);
        case 'score-asc':
          return (a.intelligenceScore || 0) - (b.intelligenceScore || 0);
        default: // relevance
          return 0;
      }
    });
    
    setFilteredAssets(results);
  }, [searchQuery, selectedProviders, intelligenceRange, selectedTags, permissionFilter, showStaleOnly, showOrphanedOnly, showDuplicatesOnly, sortBy, allAssets]);
  
  const toggleProvider = (provider: ProviderType) => {
    setSelectedProviders(prev => 
      prev.includes(provider) 
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  };
  
  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim().toLowerCase())) {
      setSelectedTags([...selectedTags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };
  
  const togglePermission = (perm: string) => {
    setPermissionFilter(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    );
  };
  
  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedProviders([]);
    setIntelligenceRange([0, 100]);
    setSelectedTags([]);
    setPermissionFilter([]);
    setShowStaleOnly(false);
    setShowOrphanedOnly(false);
    setShowDuplicatesOnly(false);
  };
  
  const getProviderBadge = (provider: ProviderType) => {
    const badges = {
      microsoft: { label: 'M365', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      google: { label: 'Google', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
      slack: { label: 'Slack', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
      box: { label: 'Box', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
      local: { label: 'Local', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' }
    };
    return badges[provider];
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };
  
  const activeFilterCount = 
    selectedProviders.length + 
    selectedTags.length + 
    permissionFilter.length +
    (intelligenceRange[0] !== 0 || intelligenceRange[1] !== 100 ? 1 : 0) +
    (showStaleOnly ? 1 : 0) +
    (showOrphanedOnly ? 1 : 0) +
    (showDuplicatesOnly ? 1 : 0);

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Metadata Intelligence Layer
            </h2>
          </div>
          <h1 className={`text-4xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Oracle <span className="text-[#00F0FF]">Search</span>
          </h1>
          <p className="text-sm text-[#94A3B8]">
            {filteredAssets.length} assets indexed • {selectedAssets.size} selected
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
              isFiltersOpen
                ? 'bg-[#00F0FF] text-[#0B0F19]'
                : isDaylight
                ? 'bg-white border border-slate-200 text-slate-900 hover:border-slate-300'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-[#FF5733] text-white text-xs rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {selectedAssets.size > 0 && (
            <button
              onClick={() => toast.success(`Added ${selectedAssets.size} assets to workspace`)}
              className="px-4 py-2.5 bg-[#00F0FF] text-[#0B0F19] rounded-xl font-medium text-sm hover:bg-[#00F0FF]/90 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Workspace
            </button>
          )}
        </div>
      </div>
      
      {/* Search Bar */}
      <div className={`rounded-2xl p-1 ${
        isDaylight 
          ? 'bg-white border border-slate-200' 
          : 'bg-white/5 backdrop-blur-xl border border-white/10'
      }`}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Search className={`w-5 h-5 ${isDaylight ? 'text-slate-400' : 'text-[#94A3B8]'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or tags..."
            className={`flex-1 bg-transparent outline-none text-base ${
              isDaylight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-[#94A3B8]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Filters Panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-2xl overflow-hidden ${
              isDaylight 
                ? 'bg-white border border-slate-200' 
                : 'bg-white/5 backdrop-blur-xl border border-white/10'
            }`}
          >
            <div className="p-6 space-y-6">
              {/* Provider Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Providers
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['microsoft', 'google', 'slack', 'box', 'local'] as ProviderType[]).map(provider => {
                    const badge = getProviderBadge(provider);
                    const isSelected = selectedProviders.includes(provider);
                    return (
                      <button
                        key={provider}
                        onClick={() => toggleProvider(provider)}
                        className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all ${
                          isSelected
                            ? badge.color
                            : isDaylight
                            ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                            : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                        }`}
                      >
                        {badge.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Intelligence Score Range */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Intelligence Score: {intelligenceRange[0]} - {intelligenceRange[1]}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intelligenceRange[0]}
                    onChange={(e) => setIntelligenceRange([parseInt(e.target.value), intelligenceRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intelligenceRange[1]}
                    onChange={(e) => setIntelligenceRange([intelligenceRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
              
              {/* Tag Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add tag to filter..."
                    className={`flex-1 px-4 py-2 rounded-lg border outline-none ${
                      isDaylight
                        ? 'bg-slate-50 border-slate-200 text-slate-900'
                        : 'bg-white/5 border-white/10 text-white'
                    }`}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all"
                  >
                    Add
                  </button>
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-[#00F0FF]/10 text-[#00F0FF] rounded-lg border border-[#00F0FF]/20 text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Permission Filter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Sharing Scope
                </label>
                <div className="flex flex-wrap gap-2">
                  {['private', 'team', 'org', 'public'].map(perm => (
                    <button
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={`px-4 py-2 rounded-lg border font-medium text-sm capitalize transition-all ${
                        permissionFilter.includes(perm)
                          ? 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/20'
                          : isDaylight
                          ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                          : 'bg-white/5 border-white/10 text-[#94A3B8] hover:bg-white/10'
                      }`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Operational Flags */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Operational Flags
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showStaleOnly}
                      onChange={(e) => setShowStaleOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 text-[#00F0FF] focus:ring-[#00F0FF]"
                    />
                    <span className={isDaylight ? 'text-slate-700' : 'text-white'}>
                      Show Stale Assets Only
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOrphanedOnly}
                      onChange={(e) => setShowOrphanedOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 text-[#00F0FF] focus:ring-[#00F0FF]"
                    />
                    <span className={isDaylight ? 'text-slate-700' : 'text-white'}>
                      Show Orphaned Assets Only
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showDuplicatesOnly}
                      onChange={(e) => setShowDuplicatesOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 text-[#00F0FF] focus:ring-[#00F0FF]"
                    />
                    <span className={isDaylight ? 'text-slate-700' : 'text-white'}>
                      Show Duplicates Only
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full px-4 py-2.5 bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20 rounded-lg font-medium hover:bg-[#FF5733]/20 transition-all"
                >
                  Clear All Filters ({activeFilterCount})
                </button>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
      
      {/* Sort & View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#94A3B8]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className={`px-4 py-2 rounded-lg border outline-none text-sm font-medium ${
              isDaylight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-white/5 border-white/10 text-white'
            }`}
          >
            <option value="relevance">Relevance</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const ids = new Set(filteredAssets.map(a => a.id));
              setSelectedAssets(ids);
              toast.success(`Selected all ${filteredAssets.length} results`);
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isDaylight
                ? 'hover:bg-slate-100 text-slate-600'
                : 'hover:bg-white/5 text-[#94A3B8]'
            }`}
          >
            Select All
          </button>
          <button
            onClick={() => setSelectedAssets(new Set())}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isDaylight
                ? 'hover:bg-slate-100 text-slate-600'
                : 'hover:bg-white/5 text-[#94A3B8]'
            }`}
          >
            Clear Selection
          </button>
        </div>
      </div>
      
      {/* Results Grid */}
      <div className="flex-1 overflow-auto">
        {filteredAssets.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-20 rounded-2xl ${
            isDaylight ? 'bg-slate-50' : 'bg-white/5'
          }`}>
            <Database className="w-16 h-16 text-[#94A3B8] mb-4" />
            <p className={`text-lg font-semibold mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              No Assets Found
            </p>
            <p className="text-[#94A3B8] text-sm">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAssets.map(asset => {
              const badge = getProviderBadge(asset.sourceProvider);
              const isSelected = selectedAssets.has(asset.id);
              const score = asset.intelligenceScore || 0;
              
              return (
                <Motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-2xl p-6 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : isDaylight
                      ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
                      : 'bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => toggleAssetSelection(asset.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className={`w-4 h-4 flex-shrink-0 ${
                          isDaylight ? 'text-slate-600' : 'text-[#94A3B8]'
                        }`} />
                        <h3 className={`font-semibold truncate ${
                          isDaylight ? 'text-slate-900' : 'text-white'
                        }`}>
                          {asset.enrichedTitle || asset.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" />
                        {asset.locationPath}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#00F0FF]" />
                      )}
                    </div>
                  </div>
                  
                  {/* Intelligence Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Intelligence Score
                      </span>
                      <span className={`text-xs font-bold ${
                        score >= 80 ? 'text-emerald-500' :
                        score >= 60 ? 'text-[#00F0FF]' :
                        score >= 40 ? 'text-amber-500' :
                        'text-[#FF5733]'
                      }`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          score >= 80 ? 'bg-emerald-500' :
                          score >= 60 ? 'bg-[#00F0FF]' :
                          score >= 40 ? 'bg-amber-500' :
                          'bg-[#FF5733]'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <HardDrive className="w-3 h-3" />
                      {formatBytes(asset.sizeBytes)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <Clock className="w-3 h-3" />
                      {formatDate(asset.modifiedDate)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <Users className="w-3 h-3" />
                      {asset.permissionType}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <Users className="w-3 h-3" />
                      {asset.shareCount} shares
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {(asset.userTags.length > 0 || asset.enrichedTags.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {asset.userTags.map((tag, tagIndex) => (
                        <span
                          key={`user-${asset.id}-${tag}-${tagIndex}`}
                          className="px-2 py-1 bg-[#00F0FF]/10 text-[#00F0FF] rounded text-xs border border-[#00F0FF]/20 flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                      {asset.enrichedTags.map((tag, tagIndex) => (
                        <span
                          key={`enriched-${asset.id}-${tag}-${tagIndex}`}
                          className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20 flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Operational Flags */}
                  {(asset.isStale || asset.isOrphaned || asset.isDuplicate || asset.isSharedExternally) && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                      {asset.isStale && (
                        <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-xs border border-amber-500/20 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Stale
                        </span>
                      )}
                      {asset.isOrphaned && (
                        <span className="px-2 py-1 bg-[#FF5733]/10 text-[#FF5733] rounded text-xs border border-[#FF5733]/20 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Orphaned
                        </span>
                      )}
                      {asset.isDuplicate && (
                        <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-xs border border-orange-500/20 flex items-center gap-1">
                          <Copy className="w-3 h-3" />
                          Duplicate
                        </span>
                      )}
                      {asset.isSharedExternally && (
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs border border-red-500/20 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          External
                        </span>
                      )}
                    </div>
                  )}
                </Motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};