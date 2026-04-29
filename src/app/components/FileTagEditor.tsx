/**
 * File Tag Editor Component
 * Inline tag editor for individual files in detail views
 */

import { useState } from 'react';
import { Asset } from '../types/aethos.types';
import { X, Plus, Sparkles, Info } from 'lucide-react';

interface FileTagEditorProps {
  asset: Asset;
  workspacesUsingTags?: Array<{ id: string; name: string; matchingTags: string[] }>;
  onUpdateTags: (assetId: string, tagsToAdd: string[], tagsToRemove: string[]) => Promise<void>;
}

export function FileTagEditor({ asset, workspacesUsingTags = [], onUpdateTags }: FileTagEditorProps) {
  const [newTagInput, setNewTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const userTags = asset.userTags || [];
  const enrichedTags = asset.enrichedTags || [];

  const handleAddTag = async () => {
    if (!newTagInput.trim()) return;

    const formatted = newTagInput.toLowerCase().trim().replace(/\s+/g, '-');

    if (!userTags.includes(formatted)) {
      await onUpdateTags(asset.id, [formatted], []);
    }

    setNewTagInput('');
  };

  const handleRemoveUserTag = async (tag: string) => {
    await onUpdateTags(asset.id, [], [tag]);
  };

  const handleAcceptEnrichedTag = async (tag: string) => {
    // Move from enriched to user tags
    await onUpdateTags(asset.id, [tag], []);
  };

  return (
    <div className="space-y-4">
      {/* User Tags */}
      <div>
        <label className="text-sm font-medium text-[#94A3B8] mb-2 block">
          🏷️ Tags:
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {userTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveUserTag(tag)}
                className="hover:text-white transition-colors"
                title="Remove tag"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Tag Input */}
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
            placeholder="Add tag..."
            className="flex-1 bg-[#1E293B]/50 border border-[#334155] rounded-lg px-3 py-1.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
          />
          <button
            onClick={handleAddTag}
            className="bg-[#00F0FF] text-[#0B0F19] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#00F0FF]/90 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI-Enriched Tags (Suggestions) */}
      {enrichedTags.length > 0 && (
        <div>
          <label className="text-sm font-medium text-[#94A3B8] mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            AI-Suggested Tags:
          </label>
          <div className="flex flex-wrap gap-2">
            {enrichedTags.map((tag) => {
              const alreadyAdded = userTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => !alreadyAdded && handleAcceptEnrichedTag(tag)}
                  disabled={alreadyAdded}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
                    alreadyAdded
                      ? 'bg-[#1E293B]/30 border border-[#334155]/50 text-[#64748B] cursor-not-allowed'
                      : 'bg-[#1E293B]/50 border border-[#334155] text-[#94A3B8] hover:border-[#00F0FF]/50 hover:text-[#00F0FF]'
                  }`}
                  title={alreadyAdded ? 'Already added' : 'Click to accept'}
                >
                  {alreadyAdded ? '✓' : '+'} {tag}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#64748B] mt-2">
            (From Metadata Intelligence Layer)
          </p>
        </div>
      )}

      {/* Workspaces Using These Tags */}
      {workspacesUsingTags.length > 0 && (
        <div className="bg-[#00F0FF]/5 border border-[#00F0FF]/20 rounded-lg p-3">
          <label className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            📂 In Workspaces:
          </label>
          <div className="space-y-2">
            {workspacesUsingTags.map((workspace) => (
              <div key={workspace.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-sm text-white">• {workspace.name}</p>
                  <p className="text-xs text-[#64748B]">
                    {workspace.matchingTags.length > 0
                      ? `Synced via tags: ${workspace.matchingTags.join(', ')}`
                      : 'Synced via location rule'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Warning about removing tags */}
          {userTags.some((tag) =>
            workspacesUsingTags.some((w) => w.matchingTags.includes(tag))
          ) && (
            <div className="mt-3 pt-3 border-t border-[#00F0FF]/10">
              <p className="text-xs text-[#FF5733] flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>
                  Removing certain tags will remove this file from workspaces with auto-remove
                  rules enabled.
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
