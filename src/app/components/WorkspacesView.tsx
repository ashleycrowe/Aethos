import { useState } from "react";
import { WorkspaceCard } from "./WorkspaceCard";
import { RemediationBrief } from "./RemediationBrief";
import { OracleSearch } from "./OracleSearch";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";

const mockWorkspaces = [
  {
    id: "1",
    name: "Engineering Standards",
    path: "/workspaces/engineering/standards",
    steward: "Sarah Chen",
    isAccessible: true,
    resonance: 92,
    lastUpdated: "2 hours ago",
  },
  {
    id: "2",
    name: "Q4 Product Roadmap",
    path: "/workspaces/product/roadmap-q4",
    steward: "Marcus Rivera",
    isAccessible: true,
    resonance: 88,
    lastUpdated: "1 day ago",
  },
  {
    id: "3",
    name: "Security Protocols",
    path: "/workspaces/security/protocols",
    steward: "You",
    isAccessible: false,
    resonance: 76,
    lastUpdated: "3 days ago",
  },
  {
    id: "4",
    name: "Design System v3",
    path: "/workspaces/design/system-v3",
    steward: "Alex Kumar",
    isAccessible: true,
    resonance: 94,
    lastUpdated: "5 hours ago",
  },
  {
    id: "5",
    name: "Customer Analytics",
    path: "/workspaces/analytics/customer",
    steward: "You",
    isAccessible: false,
    resonance: 67,
    lastUpdated: "1 week ago",
  },
];

export function WorkspacesView() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<typeof mockWorkspaces[0] | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const handleRequestAccess = (workspace: typeof mockWorkspaces[0]) => {
    setSelectedWorkspace(workspace);
    setIsBriefOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Resonant <span className="text-[#00F0FF]">Workspaces</span>
          </h1>
          <p className="text-muted-foreground">
            Active workspaces with stewardship assignments and access visibility
          </p>
        </div>

        <OracleSearch />

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-[#00F0FF]/30">
            <Filter className="w-4 h-4 mr-2" />
            All Workspaces
          </Button>
          <Button variant="ghost" size="sm">
            My Stewardships
          </Button>
          <Button variant="ghost" size="sm">
            Access Required
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockWorkspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              {...workspace}
              onRequestAccess={() => handleRequestAccess(workspace)}
            />
          ))}
        </div>
      </div>

      {selectedWorkspace && (
        <RemediationBrief
          isOpen={isBriefOpen}
          onClose={() => setIsBriefOpen(false)}
          workspace={selectedWorkspace}
        />
      )}
    </div>
  );
}
