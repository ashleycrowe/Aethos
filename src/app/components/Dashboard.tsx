import { Shield, Users, Database, Eye } from "lucide-react";
import { IntegrityGrade } from "./IntegrityGrade";
import { IntegrityRadar } from "./IntegrityRadar";
import { HealthCard } from "./HealthCard";
import { OracleSearch } from "./OracleSearch";
import { EmptyState } from "./EmptyState";

interface DashboardProps {
  hasData?: boolean;
}

export function Dashboard({ hasData = true }: DashboardProps) {
  if (!hasData) {
    return (
      <div className="min-h-screen bg-background p-8">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        <div className="mb-8">
          <OracleSearch />
        </div>

        <div>
          <IntegrityGrade score={73} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Integrity <span className="text-[#00F0FF]">Radar</span>
            </h2>
            <IntegrityRadar
              humanClarity={75}
              aiReadiness={62}
              externalExposure={88}
              ownershipGaps={45}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">
              Health <span className="text-[#00F0FF]">Cards</span>
            </h2>
            <div className="space-y-4">
              <HealthCard
                title="External Exposure"
                grade="A-"
                score={88}
                description="Strong perimeter controls with minimal leakage risk"
                icon={Shield}
                trend="up"
                delay={0}
              />
              <HealthCard
                title="Ownership Gaps"
                grade="D+"
                score={45}
                description="Critical gaps detected from departed personnel"
                icon={Users}
                trend="down"
                delay={0.1}
              />
              <HealthCard
                title="Architectural Debt"
                grade="C+"
                score={67}
                description="Moderate entropy with stale data accumulation"
                icon={Database}
                trend="stable"
                delay={0.2}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-6 h-6 text-[#00F0FF]" />
            <h2 className="text-2xl font-bold">Stewardship Overview</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-4xl font-bold text-[#00F0FF] mb-2">847</div>
              <div className="text-sm text-muted-foreground">Active Workspaces</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-4xl font-bold text-emerald-400 mb-2">92%</div>
              <div className="text-sm text-muted-foreground">Steward Coverage</div>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="text-4xl font-bold text-amber-400 mb-2">23</div>
              <div className="text-sm text-muted-foreground">Remediation Briefs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
