/**
 * Sync Rule Editor Component
 * Create and configure tag-based auto-sync rules for workspaces
 */

import { useState } from 'react';
import { SyncRule } from '../types/aethos.types';
import { X, Plus, AlertCircle, Eye } from 'lucide-react';

interface SyncRuleEditorProps {
  workspaceId: string;
  existingRule?: SyncRule;
  onSave: (rule: Partial<SyncRule>) => Promise<void>;
  onPreview: (rule: Partial<SyncRule>) => Promise<{ matchCount: number; sampleFiles: string[] }>;
  onClose: () => void;
}

export function SyncRuleEditor({
  workspaceId,
  existingRule,
  onSave,
  onPreview,
  onClose,
}: SyncRuleEditorProps) {
  const [ruleType, setRuleType] = useState<'location' | 'tag' | 'author' | 'keyword'>(
    existingRule?.ruleType || 'tag'
  );

  // Tag-based fields
  const [tagsIncludeAny, setTagsIncludeAny] = useState<string[]>(
    existingRule?.tagsIncludeAny || []
  );
  const [tagsIncludeAll, setTagsIncludeAll] = useState<string[]>(
    existingRule?.tagsIncludeAll || []
  );
  const [tagsExclude, setTagsExclude] = useState<string[]>(existingRule?.tagsExclude || []);

  // Location-based fields
  const [locationPath, setLocationPath] = useState(existingRule?.locationPath || '');

  // Filters
  const [fileTypes, setFileTypes] = useState<string[]>(existingRule?.fileTypes || []);
  const [excludeLocations, setExcludeLocations] = useState<string[]>(
    existingRule?.excludeLocations || []
  );
  const [maxFiles, setMaxFiles] = useState(existingRule?.maxFiles || 500);

  // Behavior
  const [autoAdd, setAutoAdd] = useState(existingRule?.autoAdd ?? true);
  const [autoRemove, setAutoRemove] = useState(existingRule?.autoRemove ?? false);

  // UI state
  const [tagInput, setTagInput] = useState('');
  const [isPreviewingmatches, setIsPreviewingMatches] = useState(false);
  const [previewResult, setPreviewResult] = useState<{
    matchCount: number;
    sampleFiles: string[];
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddTag = (listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!tagInput.trim()) return;

    const formatted = tagInput.toLowerCase().trim().replace(/\s+/g, '-');
    listSetter((prev) => (prev.includes(formatted) ? prev : [...prev, formatted]));
    setTagInput('');
  };

  const handleRemoveTag = (
    tag: string,
    listSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    listSetter((prev) => prev.filter((t) => t !== tag));
  };

  const handlePreview = async () => {
    setIsPreviewingMatches(true);
    try {
      const result = await onPreview(buildRule());
      setPreviewResult(result);
    } catch (error) {
      console.error('Preview failed:', error);
    } finally {
      setIsPreviewingMatches(false);
    }
  };

  const buildRule = (): Partial<SyncRule> => {
    return {
      workspaceId,
      ruleType,
      tagsIncludeAny: tagsIncludeAny.length > 0 ? tagsIncludeAny : undefined,
      tagsIncludeAll: tagsIncludeAll.length > 0 ? tagsIncludeAll : undefined,
      tagsExclude: tagsExclude.length > 0 ? tagsExclude : undefined,
      locationPath: ruleType === 'location' ? locationPath : undefined,
      fileTypes: fileTypes.length > 0 ? fileTypes : undefined,
      excludeLocations: excludeLocations.length > 0 ? excludeLocations : undefined,
      maxFiles,
      autoAdd,
      autoRemove,
      enabled: true,
    };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(buildRule());
      onClose();
    } catch (error) {
      console.error('Failed to save rule:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = ruleType === 'tag'
    ? tagsIncludeAny.length > 0 || tagsIncludeAll.length > 0
    : ruleType === 'location'
    ? locationPath.length > 0
    : true;

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-8 max-w-3xl w-full my-8 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">
              {existingRule ? 'Edit' : 'Create'} Auto-Sync Rule
            </h2>
            <p className="text-[#94A3B8]">
              Automatically add/remove files from workspace based on criteria
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Rule Type */}
        <div className="mb-6">
          <label className="text-sm font-medium text-[#94A3B8] mb-2 block">Rule Type:</label>
          <div className="grid grid-cols-2 gap-3">
            {(['tag', 'location'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setRuleType(type)}
                className={`px-4 py-3 rounded-lg border transition-all ${
                  ruleType === type
                    ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]'
                    : 'bg-[#1E293B]/30 border-[#334155] text-[#94A3B8] hover:border-[#475569]'
                }`}
              >
                {type === 'tag' ? '🏷️ Tag-based' : '📁 Location-based'}
              </button>
            ))}
          </div>
        </div>

        {/* Tag-Based Configuration */}
        {ruleType === 'tag' && (
          <div className="space-y-6">
            {/* Include ANY tags (OR logic) */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Include ANY of these tags (OR logic):
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
                  className="bg-[#00F0FF] text-[#0B0F19] px-4 py-2 rounded-lg hover:bg-[#00F0FF]/90 transition-all"
                >
                  <Plus className="w-5 h-5" />
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
              <p className="text-xs text-[#64748B] mt-2">
                Files must have at least ONE of these tags
              </p>
            </div>

            {/* Include ALL tags (AND logic) */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Must also have ALL of these tags (AND logic):
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(setTagsIncludeAll);
                    }
                  }}
                  placeholder="e.g., approved, final"
                  className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
                />
                <button
                  onClick={() => handleAddTag(setTagsIncludeAll)}
                  className="bg-[#00F0FF] text-[#0B0F19] px-4 py-2 rounded-lg hover:bg-[#00F0FF]/90 transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagsIncludeAll.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag, setTagsIncludeAll)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#64748B] mt-2">Optional (leave empty to skip)</p>
            </div>

            {/* Exclude tags */}
            <div>
              <label className="text-sm font-medium text-white mb-2 block">
                Exclude files with these tags:
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
                  placeholder="e.g., archived, draft, obsolete"
                  className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
                />
                <button
                  onClick={() => handleAddTag(setTagsExclude)}
                  className="bg-[#00F0FF] text-[#0B0F19] px-4 py-2 rounded-lg hover:bg-[#00F0FF]/90 transition-all"
                >
                  <Plus className="w-5 h-5" />
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
              <p className="text-xs text-[#64748B] mt-2">
                Files with ANY of these tags will be excluded
              </p>
            </div>
          </div>
        )}

        {/* Location-Based Configuration */}
        {ruleType === 'location' && (
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Location Path:</label>
            <input
              type="text"
              value={locationPath}
              onChange={(e) => setLocationPath(e.target.value)}
              placeholder="e.g., /Marketing/Campaigns or Finance > Budget"
              className="w-full bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
            />
            <p className="text-xs text-[#64748B] mt-2">
              All files under this path will be included (recursive)
            </p>
          </div>
        )}

        {/* Additional Filters */}
        <div className="mt-6 p-4 bg-[#1E293B]/30 rounded-lg border border-[#334155]">
          <h3 className="text-sm font-medium text-white mb-3">Additional Filters (Optional):</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* File Types */}
            <div>
              <label className="text-xs text-[#94A3B8] mb-1 block">File Types:</label>
              <input
                type="text"
                placeholder=".pdf, .docx, .xlsx"
                className="w-full bg-[#0B0F19]/50 border border-[#334155] rounded px-3 py-1.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
              />
            </div>

            {/* Max Files */}
            <div>
              <label className="text-xs text-[#94A3B8] mb-1 block">Max Files:</label>
              <input
                type="number"
                value={maxFiles}
                onChange={(e) => setMaxFiles(parseInt(e.target.value) || 500)}
                min="1"
                max="5000"
                className="w-full bg-[#0B0F19]/50 border border-[#334155] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#00F0FF]/50"
              />
            </div>
          </div>
        </div>

        {/* Behavior */}
        <div className="mt-6 space-y-3">
          <label className="text-sm font-medium text-white block">Behavior:</label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAdd}
              onChange={(e) => setAutoAdd(e.target.checked)}
              className="w-4 h-4 rounded border-[#334155] bg-[#1E293B]/50 text-[#00F0FF] focus:ring-[#00F0FF]/50"
            />
            <span className="text-sm text-[#94A3B8]">
              Auto-add new files that match this rule
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRemove}
              onChange={(e) => setAutoRemove(e.target.checked)}
              className="w-4 h-4 rounded border-[#334155] bg-[#1E293B]/50 text-[#00F0FF] focus:ring-[#00F0FF]/50"
            />
            <span className="text-sm text-[#94A3B8]">
              Auto-remove files that no longer match (⚠️ use carefully)
            </span>
          </label>
        </div>

        {/* Preview Results */}
        {previewResult && (
          <div className="mt-6 p-4 bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">Preview Results:</h3>
            <p className="text-sm text-[#94A3B8] mb-3">
              This rule would match <strong className="text-[#00F0FF]">{previewResult.matchCount} files</strong>
            </p>
            {previewResult.sampleFiles.length > 0 && (
              <div>
                <p className="text-xs text-[#64748B] mb-2">Sample files:</p>
                <ul className="space-y-1">
                  {previewResult.sampleFiles.slice(0, 5).map((file, i) => (
                    <li key={i} className="text-xs text-[#94A3B8]">
                      • {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {previewResult.matchCount > 500 && (
              <div className="mt-3 pt-3 border-t border-[#00F0FF]/10">
                <p className="text-xs text-[#FF5733] flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Rule matches {previewResult.matchCount} files (max is {maxFiles}). Consider
                    using more specific criteria.
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 bg-[#1E293B]/50 border border-[#334155] text-white px-6 py-3 rounded-lg font-medium hover:border-[#475569] transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handlePreview}
            disabled={!isValid || isPreviewingmatches}
            className="flex-1 bg-[#1E293B]/70 border border-[#00F0FF]/30 text-[#00F0FF] px-6 py-3 rounded-lg font-medium hover:bg-[#1E293B] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            {isPreviewingmatches ? 'Previewing...' : 'Preview Matches'}
          </button>

          <button
            onClick={handleSave}
            disabled={!isValid || isSaving}
            className="flex-1 bg-[#00F0FF] text-[#0B0F19] px-6 py-3 rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : existingRule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </div>
    </div>
  );
}
