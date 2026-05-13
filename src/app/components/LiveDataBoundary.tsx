import React from 'react';
import { AlertCircle, CheckCircle2, Database, Loader2 } from 'lucide-react';
import { GlassCard } from '@/app/components/GlassCard';

type LiveDataBoundaryState = 'loading' | 'error' | 'empty' | 'ready' | 'demo';

type LiveDataBoundaryProps = {
  state: LiveDataBoundaryState;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
};

const boundaryTone = {
  loading: {
    icon: Loader2,
    card: 'border-[#00F0FF]/20 bg-[#00F0FF]/5',
    iconClass: 'text-[#00F0FF] animate-spin',
    eyebrow: 'Loading Live Data',
  },
  error: {
    icon: AlertCircle,
    card: 'border-[#FF5733]/20 bg-[#FF5733]/5',
    iconClass: 'text-[#FF5733]',
    eyebrow: 'Live Data Unavailable',
  },
  empty: {
    icon: Database,
    card: 'border-white/10 bg-white/[0.03]',
    iconClass: 'text-slate-500',
    eyebrow: 'No Live Data Yet',
  },
  ready: {
    icon: CheckCircle2,
    card: 'border-emerald-500/20 bg-emerald-500/5',
    iconClass: 'text-emerald-400',
    eyebrow: 'Live Tenant Data',
  },
  demo: {
    icon: Database,
    card: 'border-[#F59E0B]/20 bg-[#F59E0B]/5',
    iconClass: 'text-[#F59E0B]',
    eyebrow: 'Demo Fixtures',
  },
} satisfies Record<LiveDataBoundaryState, {
  icon: React.ComponentType<{ className?: string }>;
  card: string;
  iconClass: string;
  eyebrow: string;
}>;

export function LiveDataBoundary({
  state,
  title,
  message,
  actionLabel,
  onAction,
  children,
}: LiveDataBoundaryProps) {
  const tone = boundaryTone[state];
  const Icon = tone.icon;

  if (state === 'ready') {
    return <>{children}</>;
  }

  return (
    <GlassCard className={`p-5 ${tone.card}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone.iconClass}`} />
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
              {tone.eyebrow}
            </p>
            <h3 className="mt-2 text-sm font-black uppercase tracking-widest text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {message}
            </p>
          </div>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="min-h-[40px] rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-300 transition hover:border-[#00F0FF]/40 hover:text-white"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </GlassCard>
  );
}
