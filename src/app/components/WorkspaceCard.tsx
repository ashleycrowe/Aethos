import { motion } from "motion/react";
import { Eye, EyeOff, FileText, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface WorkspaceCardProps {
  name: string;
  path: string;
  steward: string;
  isAccessible: boolean;
  resonance: number;
  lastUpdated: string;
  onRequestAccess?: () => void;
}

export function WorkspaceCard({
  name,
  path,
  steward,
  isAccessible,
  resonance,
  lastUpdated,
  onRequestAccess,
}: WorkspaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6 hover:border-[#00F0FF]/50 transition-colors group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-lg bg-muted/50 group-hover:bg-[#00F0FF]/10 transition-colors">
            <FileText className="w-5 h-5 text-muted-foreground group-hover:text-[#00F0FF] transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1 group-hover:text-[#00F0FF] transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{path}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAccessible ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">Accessible</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              <EyeOff className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400">Restricted</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Steward:</span>
          <span className="font-medium">{steward}</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Resonance Score</span>
            <span>{resonance}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00F0FF] to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${resonance}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Updated {lastUpdated}
          </span>

          {!isAccessible && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRequestAccess}
              className="border-[#00F0FF]/30 hover:bg-[#00F0FF]/10 text-[#00F0FF]"
            >
              Request Access
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
