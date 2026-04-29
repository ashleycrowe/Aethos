/**
 * Workspace Creation Wizard
 * Multi-step wizard with Smart/Manual/Hybrid content organization
 */

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, FolderOpen, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { SyncRule, Asset } from '../types/aethos.types';

interface WorkspaceCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (workspace: {
    name: string;
    description: string;
    contentMethod: 'smart' | 'manual' | 'hybrid';
    syncRules?: Partial<SyncRule>[];
    selectedAssets?: string[];
  }) => void;
  availableAssets?: Asset[];
}

type ContentMethod = 'smart' | 'manual' | 'hybrid';
type RuleType = 'tag' | 'location' | 'author';

export function WorkspaceCreationWizard({
  isOpen,
  onClose,
  onComplete,
  availableAssets = [],
}: WorkspaceCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contentMethod, setContentMethod] = useState<ContentMethod | null>(null);
  
  // Sync rule fields
  const [ruleType, setRuleType] = useState<RuleType>('tag');
  const [tagsIncludeAny, setTagsIncludeAny] = useState<string[]>([]);
  const [tagsExclude, setTagsExclude] = useState<string[]>([]);
  const [locationPath, setLocationPath] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Review step
  const [matchingAssets, setMatchingAssets] = useState<Asset[]>([]);
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<string>>(new Set());
  const [autoAddFuture, setAutoAddFuture] = useState(true);
  const [isPreviewingMatches, setIsPreviewingMatches] = useState(false);

  if (!isOpen) return null;

  const canProceedStep1 = name.trim().length >= 3;
  const canProceedStep2 = contentMethod !== null;
  const canProceedStep3 = contentMethod === 'manual' || 
    (contentMethod === 'smart' && (
      (ruleType === 'tag' && tagsIncludeAny.length > 0) ||
      (ruleType === 'location' && locationPath.trim().length > 0)
    ));

  const handleAddTag = (listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!tagInput.trim()) return;
    const formatted = tagInput.toLowerCase().trim().replace(/\s+/g, '-');
    listSetter((prev) => (prev.includes(formatted) ? prev : [...prev, formatted]));
    setTagInput('');
  };

  const handleRemoveTag = (tag: string, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    listSetter((prev) => prev.filter((t) => t !== tag));
  };

  const handlePreviewMatches = () => {
    setIsPreviewingMatches(true);
    
    // Simulate matching logic
    setTimeout(() => {
      const matches = availableAssets.filter((asset) => {
        if (ruleType === 'tag') {
          const allAssetTags = [...asset.userTags, ...asset.enrichedTags];
          const matchesIncludeAny = tagsIncludeAny.some((tag) => allAssetTags.includes(tag));
          const matchesExclude = tagsExclude.length === 0 || !tagsExclude.some((tag) => allAssetTags.includes(tag));
          return matchesIncludeAny && matchesExclude;
        } else if (ruleType === 'location') {
          return asset.locationPath.toLowerCase().includes(locationPath.toLowerCase());
        }
        return false;
      });
      
      setMatchingAssets(matches);
      setSelectedAssetIds(new Set(matches.map((a) => a.id)));
      setStep(4); // Go to review step
      setIsPreviewingMatches(false);
    }, 500);
  };

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

  const handleComplete = () => {
    const syncRule: Partial<SyncRule> = {
      ruleType,
      tagsIncludeAny: tagsIncludeAny.length > 0 ? tagsIncludeAny : undefined,
      tagsExclude: tagsExclude.length > 0 ? tagsExclude : undefined,
      locationPath: ruleType === 'location' ? locationPath : undefined,
      autoAdd: autoAddFuture,
      autoRemove: false,
      maxFiles: 500,
      enabled: true,
    };

    onComplete?.({
      name,
      description,
      contentMethod: contentMethod!,
      syncRules: contentMethod !== 'manual' ? [syncRule] : undefined,
      selectedAssets: Array.from(selectedAssetIds),
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">Create New Workspace</h2>
            <p className="text-[#94A3B8]">Step {step} of {contentMethod === 'manual' ? 2 : 4}</p>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00F0FF] transition-all duration-300"
              style={{ width: `${(step / (contentMethod === 'manual' ? 2 : 4)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Workspace Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Q1 2026 Product Launch"
                className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this workspace for?"
                rows={3}
                className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#475569] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="px-6 py-3 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next: Choose Content Method
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Content Method */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                How should this workspace organize content?
              </h3>
              <div className="space-y-3">
                {/* Smart */}
                <button
                  onClick={() => setContentMethod('smart')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    contentMethod === 'smart'
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'border-[#334155] bg-[#1E293B]/30 hover:border-[#475569]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-[#00F0FF]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-semibold">⚙️ Smart (Recommended)</h4>
                        <span className="px-2 py-0.5 bg-[#00F0FF]/20 text-[#00F0FF] text-xs rounded-full">
                          AI-Powered
                        </span>
                      </div>
                      <p className="text-sm text-[#94A3B8]">
                        Automatically add files based on tags, location, or people. Perfect for ongoing projects.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Manual */}
                <button
                  onClick={() => setContentMethod('manual')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    contentMethod === 'manual'
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'border-[#334155] bg-[#1E293B]/30 hover:border-[#475569]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#94A3B8]/20 flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-[#94A3B8]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">📂 Manual</h4>
                      <p className="text-sm text-[#94A3B8]">
                        I'll add files myself. Best for small, curated collections.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Hybrid */}
                <button
                  onClick={() => setContentMethod('hybrid')}
                  className={`w-full text-left p-6 rounded-xl border-2 transition-all ${
                    contentMethod === 'hybrid'
                      ? 'border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                      : 'border-[#334155] bg-[#1E293B]/30 hover:border-[#475569]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="w-6 h-6 text-[#00F0FF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2">🔄 Hybrid</h4>
                      <p className="text-sm text-[#94A3B8]">
                        Auto-sync files + manual additions. Maximum flexibility.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#475569] transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => {
                  if (contentMethod === 'manual') {
                    handleComplete();
                  } else {
                    setStep(3);
                  }
                }}
                disabled={!canProceedStep2}
                className="px-6 py-3 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {contentMethod === 'manual' ? 'Create Workspace' : 'Next: Set Up Rules'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Set Up Sync Rules */}
        {step === 3 && contentMethod !== 'manual' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                What files should auto-add to this workspace?
              </h3>

              {/* Rule Type Selection */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => setRuleType('tag')}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    ruleType === 'tag'
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#1E293B]/30 border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                  }`}
                >
                  🏷️ Tag-based
                </button>
                <button
                  onClick={() => setRuleType('location')}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    ruleType === 'location'
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#1E293B]/30 border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                  }`}
                >
                  📁 Location-based
                </button>
                <button
                  onClick={() => setRuleType('author')}
                  className={`px-4 py-3 rounded-lg border transition-all opacity-50 cursor-not-allowed ${
                    ruleType === 'author'
                      ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#1E293B]/30 border-[#334155] text-[#94A3B8]'
                  }`}
                  disabled
                >
                  👤 Author-based
                </button>
              </div>

              {/* Tag-based Configuration */}
              {ruleType === 'tag' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Include files with ANY of these tags:
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(setTagsIncludeAny);
                          }
                        }}
                        placeholder="e.g., q1-2026, product-launch"
                        className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
                      />
                      <button
                        onClick={() => handleAddTag(setTagsIncludeAny)}
                        className="bg-[#00F0FF] text-[#0B0F19] px-6 py-2 rounded-lg hover:bg-[#00F0FF]/90 transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tagsIncludeAny.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag, setTagsIncludeAny)}
                            className="hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Exclude files with these tags (optional):
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(setTagsExclude);
                          }
                        }}
                        placeholder="e.g., draft, archived"
                        className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
                      />
                      <button
                        onClick={() => handleAddTag(setTagsExclude)}
                        className="bg-[#1E293B]/70 border border-[#334155] text-white px-6 py-2 rounded-lg hover:border-[#475569] transition-all"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tagsExclude.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-[#FF5733]/10 border border-[#FF5733]/30 text-[#FF5733] px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag, setTagsExclude)}
                            className="hover:text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Location-based Configuration */}
              {ruleType === 'location' && (
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Location Path:
                  </label>
                  <input
                    type="text"
                    value={locationPath}
                    onChange={(e) => setLocationPath(e.target.value)}
                    placeholder="e.g., /Product/Launch or Marketing > Campaigns"
                    className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
                  />
                  <p className="text-xs text-[#64748B] mt-2">
                    All files under this path will be included (recursive)
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#475569] transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handlePreviewMatches}
                disabled={!canProceedStep3 || isPreviewingMatches}
                className="px-6 py-3 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPreviewingMatches ? 'Finding Matches...' : 'Preview Matches'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Approve Matches */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                📋 Review {matchingAssets.length} Matching Files
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                Select which files to add to the workspace. You can always add or remove files later.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1E293B]/30 border border-[#334155] rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00F0FF]">{matchingAssets.length}</div>
                  <div className="text-xs text-[#64748B] uppercase tracking-wider">Files Found</div>
                </div>
                <div className="bg-[#1E293B]/30 border border-[#334155] rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00F0FF]">{selectedAssetIds.size}</div>
                  <div className="text-xs text-[#64748B] uppercase tracking-wider">Selected</div>
                </div>
                <div className="bg-[#1E293B]/30 border border-[#334155] rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#00F0FF]">
                    {(matchingAssets.reduce((sum, a) => sum + a.sizeBytes, 0) / 1024 / 1024).toFixed(1)} MB
                  </div>
                  <div className="text-xs text-[#64748B] uppercase tracking-wider">Total Size</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAssetIds(new Set(matchingAssets.map((a) => a.id)))}
                    className="text-xs text-[#00F0FF] hover:underline"
                  >
                    Select All
                  </button>
                  <span className="text-[#64748B]">•</span>
                  <button
                    onClick={() => setSelectedAssetIds(new Set())}
                    className="text-xs text-[#00F0FF] hover:underline"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* File List */}
              <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
                {matchingAssets.map((asset) => {
                  const isSelected = selectedAssetIds.has(asset.id);
                  const hasIssue = asset.isDuplicate || asset.isStale;

                  return (
                    <div
                      key={asset.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#00F0FF]/5 border-[#00F0FF]/30'
                          : 'bg-[#1E293B]/30 border-[#334155]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAssetSelection(asset.id)}
                        className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#00F0FF] focus:ring-[#00F0FF]/50"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                            <p className="text-xs text-[#64748B]">{asset.locationPath}</p>
                          </div>
                          <div className="text-xs text-[#64748B]">
                            {(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {[...asset.userTags, ...asset.enrichedTags].slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Warnings */}
                        {hasIssue && (
                          <div className="mt-2 flex items-start gap-1 text-xs text-[#FF5733]">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>
                              {asset.isDuplicate && 'Possible duplicate'}
                              {asset.isStale && 'No activity in 180+ days'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Auto-add future files */}
              <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoAddFuture}
                    onChange={(e) => setAutoAddFuture(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#334155] bg-[#1E293B] text-[#00F0FF] focus:ring-[#00F0FF]/50"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">
                      Auto-add future matching files
                    </p>
                    <p className="text-xs text-[#94A3B8]">
                      When new files match your rules, they'll be added to this workspace automatically. You can review and approve them in the workspace settings.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#475569] transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={selectedAssetIds.size === 0}
                className="px-6 py-3 bg-[#00F0FF] text-[#0B0F19] rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Create Workspace with {selectedAssetIds.size} Files
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}