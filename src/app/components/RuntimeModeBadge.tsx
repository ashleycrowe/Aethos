import React from 'react';
import { FlaskConical, ShieldCheck } from 'lucide-react';
import {
  getRuntimeSurface,
  isDemoModeEnabled,
  isDemoOverrideAllowed,
} from '@/app/config/demoMode';

export const RuntimeModeBadge = () => {
  const demoMode = isDemoModeEnabled();
  const surface = getRuntimeSurface();
  const overrideAllowed = isDemoOverrideAllowed();
  const Icon = demoMode ? FlaskConical : ShieldCheck;

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] ${
        demoMode
          ? 'border-amber-300/25 bg-amber-300/10 text-amber-200'
          : 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200'
      }`}
      title={`${surface} surface${overrideAllowed ? ' with browser override enabled' : ' with domain-locked mode'}`}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">
        {demoMode ? 'Demo: fixture data' : 'Live: real tenant data'}
      </span>
      <span className="sm:hidden">{demoMode ? 'Demo' : 'Live'}</span>
    </div>
  );
};
