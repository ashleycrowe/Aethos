/**
 * Auto Workspace Suggestion Component
 * Smart popup that appears after bulk tagging to suggest workspace placement
 */

import { useState } from 'react';
import { Sparkles, FolderPlus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkspaceSuggestion {
  workspaceId: string;
  workspaceName: string;
  matchedRuleName: string;
  matchedTags: string[];
  fileCount: number;
}

interface AutoWorkspaceSuggestionProps {
  suggestions: WorkspaceSuggestion[];
  newFilesCount: number;
  onAddToWorkspace: (workspaceId: string) => void;
  onCreateNewWorkspace: () => void;
  onDismiss: () => void;
}

export function AutoWorkspaceSuggestion({
  suggestions,
  newFilesCount,
  onAddToWorkspace,
  onCreateNewWorkspace,
  onDismiss,
}: AutoWorkspaceSuggestionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 right-8 z-50 max-w-md"
      >
        <div className="bg-[#0B0F19]/95 backdrop-blur-xl border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.25)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00F0FF]/10 to-[#00F0FF]/5 p-4 border-b border-[#00F0FF]/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">💡 Smart Workspace Suggestion</h3>
                  <p className="text-sm text-[#94A3B8]">
                    {newFilesCount} file{newFilesCount !== 1 ? 's' : ''} match {suggestions.length}{' '}
                    workspace{suggestions.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="text-[#94A3B8] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* First Suggestion (Always Visible) */}
            <div className="mb-3">
              <div className="bg-[#1E293B]/50 border border-[#334155] rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      📁 {suggestions[0].workspaceName}
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      Rule: {suggestions[0].matchedRuleName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#00F0FF]">
                      {suggestions[0].fileCount}
                    </div>
                    <div className="text-xs text-[#64748B]">files</div>
                  </div>
                </div>

                {/* Matched Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {suggestions[0].matchedTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onAddToWorkspace(suggestions[0].workspaceId)}
                  className="w-full px-4 py-2 bg-[#00F0FF] text-[#0B0F19] rounded-lg hover:bg-[#00F0FF]/90 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  <FolderPlus className="w-4 h-4" />
                  Add to {suggestions[0].workspaceName}
                </button>
              </div>
            </div>

            {/* Additional Suggestions (Expandable) */}
            {suggestions.length > 1 && (
              <>
                {isExpanded ? (
                  <div className="space-y-2 mb-3">
                    {suggestions.slice(1).map((suggestion) => (
                      <div
                        key={suggestion.workspaceId}
                        className="bg-[#1E293B]/30 border border-[#334155] rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="text-white text-sm font-medium mb-0.5">
                              📁 {suggestion.workspaceName}
                            </h5>
                            <p className="text-xs text-[#64748B]">
                              {suggestion.fileCount} files match
                            </p>
                          </div>
                          <button
                            onClick={() => onAddToWorkspace(suggestion.workspaceId)}
                            className="px-3 py-1.5 bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] rounded hover:bg-[#00F0FF]/20 transition-all text-xs"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.matchedTags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="w-full px-4 py-2 bg-[#1E293B]/30 border border-[#334155] text-[#94A3B8] rounded-lg hover:border-[#475569] hover:text-white transition-all text-sm mb-3"
                  >
                    + Show {suggestions.length - 1} more workspace
                    {suggestions.length - 1 !== 1 ? 's' : ''}
                  </button>
                )}
              </>
            )}

            {/* Create New Workspace */}
            <button
              onClick={onCreateNewWorkspace}
              className="w-full px-4 py-2 bg-[#1E293B]/50 border border-[#334155] text-white rounded-lg hover:border-[#00F0FF]/50 hover:bg-[#1E293B]/70 transition-all text-sm flex items-center justify-center gap-2 mb-2"
            >
              <Plus className="w-4 h-4" />
              Create New Workspace Instead
            </button>

            {/* Dismiss */}
            <button
              onClick={onDismiss}
              className="w-full px-4 py-2 text-[#64748B] hover:text-[#94A3B8] transition-colors text-sm"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer Tip */}
          <div className="bg-[#00F0FF]/5 border-t border-[#00F0FF]/10 px-4 py-3">
            <p className="text-xs text-[#94A3B8]">
              💡 <strong className="text-white">Tip:</strong> Better tags = smarter workspace
              organization
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
