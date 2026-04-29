/**
 * Tag Cloud Component
 * Displays most common tags in a workspace with click-to-filter functionality
 */

import { useState } from 'react';

interface Tag {
  name: string;
  count: number;
}

interface TagCloudProps {
  tags: Tag[];
  onFilterByTag?: (tag: string) => void;
  maxTags?: number;
}

export function TagCloud({ tags, onFilterByTag, maxTags = 12 }: TagCloudProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Sort by count descending and take top N
  const topTags = [...tags].sort((a, b) => b.count - a.count).slice(0, maxTags);

  // Calculate font sizes based on count
  const maxCount = Math.max(...topTags.map((t) => t.count), 1);
  const minCount = Math.min(...topTags.map((t) => t.count), 1);

  const getFontSize = (count: number): string => {
    if (maxCount === minCount) return 'text-base';

    const ratio = (count - minCount) / (maxCount - minCount);

    if (ratio > 0.75) return 'text-xl';
    if (ratio > 0.5) return 'text-lg';
    if (ratio > 0.25) return 'text-base';
    return 'text-sm';
  };

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      onFilterByTag?.(null);
    } else {
      setSelectedTag(tag);
      onFilterByTag?.(tag);
    }
  };

  if (topTags.length === 0) {
    return (
      <div className="text-center py-8 text-[#64748B]">
        <p className="text-sm">No tags yet. Add tags to files to see them here.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {topTags.map((tag) => {
          const isSelected = selectedTag === tag.name;
          const fontSize = getFontSize(tag.count);

          return (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${fontSize} ${
                isSelected
                  ? 'bg-[#00F0FF]/20 border border-[#00F0FF] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                  : 'bg-[#1E293B]/30 border border-[#334155] text-[#94A3B8] hover:border-[#00F0FF]/50 hover:text-[#00F0FF]'
              }`}
              title={`${tag.count} file${tag.count !== 1 ? 's' : ''}`}
            >
              <span className="font-medium">{tag.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-[#00F0FF]/30 text-[#00F0FF]'
                    : 'bg-[#334155]/50 text-[#64748B]'
                }`}
              >
                {tag.count}
              </span>
            </button>
          );
        })}
      </div>

      {selectedTag && (
        <div className="mt-4 text-center">
          <p className="text-sm text-[#94A3B8]">
            Filtering by tag: <strong className="text-[#00F0FF]">{selectedTag}</strong>
            <button
              onClick={() => {
                setSelectedTag(null);
                onFilterByTag?.(null);
              }}
              className="ml-2 text-[#FF5733] hover:underline"
            >
              Clear filter
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
