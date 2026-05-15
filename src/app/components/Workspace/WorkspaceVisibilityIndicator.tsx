import { Eye, EyeOff } from 'lucide-react';

interface WorkspaceVisibilityIndicatorProps {
  isAccessible: boolean;
  className?: string;
}

export function WorkspaceVisibilityIndicator({
  isAccessible,
  className = "",
}: WorkspaceVisibilityIndicatorProps) {
  if (isAccessible) {
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 ${className}`}>
        <Eye className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
          Accessible
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 ${className}`}>
      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
      <span className="text-xs font-black uppercase tracking-widest text-amber-400">
        Restricted
      </span>
    </div>
  );
}
