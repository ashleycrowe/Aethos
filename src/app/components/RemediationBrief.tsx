import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle, Shield, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface RemediationBriefProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: {
    name: string;
    path: string;
    steward: string;
  };
}

export function RemediationBrief({ isOpen, onClose, workspace }: RemediationBriefProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-card border-b border-border px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Remediation Brief</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Access gap detected for {workspace.name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-8 space-y-8">
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-500/20">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Steward Access Gap</h3>
                    <p className="text-sm text-muted-foreground">
                      You are designated as the steward for this workspace but currently
                      lack native access permissions. This creates a blind spot in your
                      stewardship coverage.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#00F0FF]" />
                  Reason Code
                </h3>
                <Badge variant="outline" className="bg-[#00F0FF]/10 border-[#00F0FF]/30 text-[#00F0FF]">
                  STEWARD_ACCESS_GAP
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Risk Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2" />
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Stewardship Integrity</div>
                      <div className="text-xs text-muted-foreground">
                        Unable to verify content quality, ownership metadata, or usage patterns
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2" />
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Handoff Vulnerability</div>
                      <div className="text-xs text-muted-foreground">
                        If current owner departs, knowledge transfer will be incomplete
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-amber-400 mt-2" />
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Compliance Gap</div>
                      <div className="text-xs text-muted-foreground">
                        Cannot audit or certify workspace contents per policy requirements
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Workspace Details</h3>
                <div className="bg-muted/20 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{workspace.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Path:</span>
                    <span className="font-mono text-xs">{workspace.path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Steward:</span>
                    <span className="font-medium">{workspace.steward}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Recommended Action</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Request native access to this workspace to fulfill your stewardship
                  responsibilities. This will enable continuous monitoring, quality
                  validation, and seamless ownership transitions.
                </p>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h4 className="font-medium mb-3">Access Request Packet</h4>
                  <div className="bg-muted/20 rounded-lg p-4 mb-4 text-sm font-mono">
                    <div className="text-xs text-muted-foreground mb-2">Request Justification:</div>
                    <div>
                      As designated steward for "{workspace.name}", I require native
                      access to maintain operational integrity, validate ownership
                      metadata, and ensure compliant handoff procedures.
                    </div>
                  </div>

                  <Button className="w-full bg-[#00F0FF] text-background hover:bg-[#00F0FF]/90">
                    <Send className="w-4 h-4 mr-2" />
                    Request Native Access
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  This brief was generated by Aethos Integrity Intelligence on{" "}
                  {new Date().toLocaleDateString()} based on current stewardship
                  assignments and permission mappings.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
