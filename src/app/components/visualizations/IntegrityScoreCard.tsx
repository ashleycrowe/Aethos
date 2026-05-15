import { useState } from 'react';
import { ChevronDown, Shield, Users } from 'lucide-react';
import { IntegrityGrade } from '@/app/components/IntegrityGrade';
import { IntegrityRadar } from '@/app/components/IntegrityRadar';
import { HealthCard } from '@/app/components/HealthCard';
import { GlassCard } from '@/app/components/GlassCard';

type IntegrityScoreCardProps = {
  score: number;
  trendDelta?: string;
  onOpenRemediation?: (issue: string) => void;
};

export function IntegrityScoreCard({
  score,
  trendDelta = '+4%',
  onOpenRemediation,
}: IntegrityScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const aiReadiness = Math.max(0, score - 15);
  const exposureControl = Math.min(100, score + 8);
  const ownershipCoverage = Math.max(0, score - 28);

  return (
    <GlassCard className="overflow-hidden p-0">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="integrity-score-card-body"
        onClick={() => setIsExpanded((current) => !current)}
        className="flex min-h-[72px] w-full flex-col gap-3 p-5 text-left transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between md:p-6"
      >
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1AFFFF] sm:tracking-[0.28em]">
            Integrity Assessment
          </p>
          <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white">
            Sense-Making Infrastructure Health
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-400">
            {trendDelta} change
          </span>
          <ChevronDown
            className={`h-5 w-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      {isExpanded && (
        <div id="integrity-score-card-body" className="border-t border-white/10 p-5 md:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <IntegrityGrade score={score} trendDelta={trendDelta} />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              <IntegrityRadar
                humanClarity={score}
                aiReadiness={aiReadiness}
                externalExposure={exposureControl}
                ownershipGaps={ownershipCoverage}
              />
              <div className="space-y-4">
                <HealthCard
                  title="External Exposure"
                  grade={exposureControl >= 85 ? 'A-' : 'B'}
                  score={exposureControl}
                  description="External sharing is visible enough for COO and AI strategy review."
                  icon={Shield}
                  trend="up"
                  delay={0}
                  onClick={() => onOpenRemediation?.('external_share')}
                  ariaLabel="Open remediation review for external exposure"
                />
                <HealthCard
                  title="Ownership Coverage"
                  grade={ownershipCoverage >= 80 ? 'B+' : ownershipCoverage >= 60 ? 'C+' : 'D+'}
                  score={ownershipCoverage}
                  description="Steward coverage tracks whether key context has accountable owners."
                  icon={Users}
                  trend={ownershipCoverage >= 70 ? 'up' : 'down'}
                  delay={0.1}
                  onClick={() => onOpenRemediation?.('missing_owner')}
                  ariaLabel="Open remediation review for ownership coverage"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
