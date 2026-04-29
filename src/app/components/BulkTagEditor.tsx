/**
 * Bulk Tag Editor Component
 * Allows users to add/remove tags from multiple files at once
 * Critical for tag-based workspace auto-sync feature
 */

import { useState } from 'react';
import { Asset } from '../types/aethos.types';
import { X, Plus, Sparkles } from 'lucide-react';

interface BulkTagEditorProps {
  selectedAssets: Asset[];
  onUpdateTags: (assetIds: string[], tagsToAdd: string[], tagsToRemove: string[]) => Promise<void>;
  onClose: () => void;
}

export function BulkTagEditor({ selectedAssets, onUpdateTags, onClose }: BulkTagEditorProps) {
  const [newTagInput, setNewTagInput] = useState('');
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
  const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get all unique existing tags across selected assets
  const existingTags = Array.from(
    new Set(
      selectedAssets.flatMap((asset) => [
        ...(asset.userTags || []),
        ...(asset.enrichedTags || []),
      ])
    )
  );

  // AI-suggested tags based on file names and locations
  const aiSuggestedTags = getAISuggestedTags(selectedAssets);

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;

    // Convert to lowercase with hyphens (standard format)
    const formatted = newTagInput.toLowerCase().trim().replace(/\s+/g, '-');

    if (!tagsToAdd.includes(formatted)) {
      setTagsToAdd([...tagsToAdd, formatted]);
    }

    setNewTagInput('');
  };

  const handleRemoveFromAdding = (tag: string) => {
    setTagsToAdd(tagsToAdd.filter((t) => t !== tag));
  };

  const handleToggleExistingTag = (tag: string) => {
    if (tagsToRemove.includes(tag)) {
      setTagsToRemove(tagsToRemove.filter((t) => t !== tag));
    } else {
      setTagsToRemove([...tagsToRemove, tag]);
    }
  };

  const handleAddAISuggestion = (tag: string) => {
    if (!tagsToAdd.includes(tag)) {
      setTagsToAdd([...tagsToAdd, tag]);
    }
  };

  const handleApply = async () => {
    setIsSubmitting(true);
    try {
      const assetIds = selectedAssets.map((a) => a.id);
      await onUpdateTags(assetIds, tagsToAdd, tagsToRemove);
      onClose();
    } catch (error) {
      console.error('Failed to update tags:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-1">
              📋 Bulk Tag Editor
            </h2>
            <p className="text-[#94A3B8]">
              Selected: {selectedAssets.length} file{selectedAssets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Add Tags Input */}
        <div className="mb-6">
          <label className="text-sm font-medium text-[#94A3B8] mb-2 block">
            Add Tags (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="q1-2026, marketing-campaign, final"
              className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded-lg px-4 py-2 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
            />
            <button
              onClick={handleAddTag}
              className="bg-[#00F0FF] text-[#0B0F19] px-6 py-2 rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tags to Add */}
          {tagsToAdd.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tagsToAdd.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveFromAdding(tag)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Existing Tags */}
        {existingTags.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-medium text-[#94A3B8] mb-2 block">
              Existing Tags (across {selectedAssets.length} files):
            </label>
            <div className="flex flex-wrap gap-2">
              {existingTags.map((tag) => {
                const isRemoving = tagsToRemove.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleExistingTag(tag)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
                      isRemoving
                        ? 'bg-[#FF5733]/20 border border-[#FF5733]/50 text-[#FF5733] line-through'
                        : 'bg-[#1E293B]/50 border border-[#334155] text-[#94A3B8] hover:border-[#00F0FF]/30'
                    }`}
                  >
                    {tag}
                    {isRemoving && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#64748B] mt-2">
              Click tags to remove from all selected files
            </p>
          </div>
        )}

        {/* AI Suggested Tags */}
        {aiSuggestedTags.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00F0FF]" />
              AI Tag Suggestions (based on file names/locations):
            </label>
            <div className="flex flex-wrap gap-2">
              {aiSuggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleAddAISuggestion(tag)}
                  disabled={tagsToAdd.includes(tag)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
                    tagsToAdd.includes(tag)
                      ? 'bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] cursor-not-allowed'
                      : 'bg-[#1E293B]/50 border border-[#334155] text-[#94A3B8] hover:border-[#00F0FF]/50 hover:text-[#00F0FF]'
                  }`}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info Tip */}
        <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-[#94A3B8]">
            💡 <strong className="text-white">Tip:</strong> Add tags like 'q1-2026' or 'budget' to
            enable auto-sync to workspaces using tag-based rules. Better tags = better workspace
            organization.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 bg-[#1E293B]/50 border border-[#334155] text-white px-6 py-3 rounded-lg font-medium hover:border-[#475569] transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isSubmitting || (tagsToAdd.length === 0 && tagsToRemove.length === 0)}
            className="flex-1 bg-[#00F0FF] text-[#0B0F19] px-6 py-3 rounded-lg font-medium hover:bg-[#00F0FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Applying...' : `Apply to ${selectedAssets.length} Files`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper: Generate AI-suggested tags based on file names and locations
function getAISuggestedTags(assets: Asset[]): string[] {
  const suggestions = new Set<string>();

  assets.forEach((asset) => {
    // Extract from file name
    const nameParts = asset.name
      .toLowerCase()
      .replace(/\.(pdf|docx|xlsx|pptx|txt|jpg|png)$/i, '')
      .split(/[\s_-]+/);

    nameParts.forEach((part) => {
      if (part.length >= 3 && !isCommonWord(part)) {
        suggestions.add(part);
      }
    });

    // Extract from location path
    const pathParts = asset.locationPath
      .toLowerCase()
      .split(/[>\s/]+/)
      .filter((p) => p.length >= 3);

    pathParts.forEach((part) => {
      if (!isCommonWord(part)) {
        suggestions.add(part);
      }
    });

    // Extract dates (e.g., "2026", "q1", "jan")
    const dateMatches = asset.name.match(/\b(20\d{2}|q[1-4]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi);
    dateMatches?.forEach((match) => suggestions.add(match.toLowerCase()));
  });

  // Filter out tags already in enrichedTags across all assets
  const existingEnrichedTags = new Set(assets.flatMap((a) => a.enrichedTags || []));

  return Array.from(suggestions)
    .filter((tag) => !existingEnrichedTags.has(tag))
    .slice(0, 10); // Limit to 10 suggestions
}

function isCommonWord(word: string): boolean {
  const commonWords = [
    'the',
    'and',
    'for',
    'with',
    'from',
    'copy',
    'final',
    'new',
    'old',
    'document',
    'file',
    'folder',
    'site',
    'team',
    'untitled',
  ];
  return commonWords.includes(word.toLowerCase());
}
