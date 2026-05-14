import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Slack, 
  Phone, 
  MessageSquare, 
  Award, 
  Zap, 
  ShieldCheck, 
  MoreVertical,
  Linkedin,
  ExternalLink,
  Target,
  History,
  TrendingUp,
  Briefcase,
  Globe,
  Box
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AethosIdentity, CareerMilestone } from '../types/aethos.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PersonCard: React.FC<{ person: AethosIdentity; onOpen: (p: AethosIdentity) => void }> = ({ person, onOpen }) => {
  return (
    <motion.div 
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19]/60 p-5 backdrop-blur-xl transition-all hover:border-[#00F0FF]/40 sm:cursor-pointer"
      onClick={() => onOpen(person)}
    >
      <div className="flex gap-4 items-start">
        <div className="relative">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#00F0FF]/30 transition-colors bg-slate-800">
            <ImageWithFallback src={person.avatar || `https://ui-avatars.com/api/?name=${person.name}&background=random`} alt={person.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B0F19] border border-white/10 flex items-center justify-center">
            <ShieldCheck size={10} className="text-[#00F0FF]" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="break-words text-sm font-bold text-white transition-colors group-hover:text-[#00F0FF]">{person.name}</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{person.role}</p>
          <div className="flex gap-1 mt-2">
            {person.badges?.slice(0, 2).map((badge, idx) => (
              <div key={idx} className="p-1 rounded bg-[#00F0FF]/10 border border-[#00F0FF]/20">
                <Award size={10} className="text-[#00F0FF]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex gap-2">
          <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-white/5 p-2 text-slate-400 transition-all hover:bg-[#00F0FF]/10 hover:text-[#00F0FF]">
            <Mail size={14} />
          </button>
          <button className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-white/5 p-2 text-slate-400 transition-all hover:bg-[#E01E5A]/10 hover:text-[#E01E5A]">
            <Slack size={14} />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono text-slate-600 uppercase">Risk</span>
          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={cn("h-full", person.riskFactor > 50 ? "bg-[#FF5733]" : "bg-[#00F0FF]")} style={{ width: `${person.riskFactor}%` }} />
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F0FF]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

export const PersonDetailModal: React.FC<{ person: AethosIdentity | null; isOpen: boolean; onClose: () => void }> = ({ person, isOpen, onClose }) => {
  if (!person) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B0F19]/90 p-0 backdrop-blur-sm sm:items-center sm:p-6 sm:backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#0B0F19] shadow-2xl sm:max-h-[95vh] sm:rounded-[32px]"
          >
            {/* Header / Banner */}
            <div className="h-40 bg-gradient-to-br from-[#00F0FF]/20 via-[#0B0F19] to-transparent relative">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/40 p-3 text-white transition-all hover:bg-black/60 sm:right-6 sm:top-6"
              >
                <MoreVertical size={20} />
              </button>
              
              {/* Profile Background Graphics */}
              <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#00F0FF,transparent_70%)]" />
                 <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#FF5733,transparent_70%)]" />
              </div>
            </div>

            <div className="relative flex-1 overflow-y-auto px-5 pb-8 no-scrollbar sm:px-12 sm:pb-12">
              {/* Profile Pic Floating */}
              <div className="absolute -top-16 left-6 sm:left-12">
                <div className="w-32 h-32 rounded-3xl border-8 border-[#0B0F19] overflow-hidden bg-slate-800 shadow-2xl">
                  <ImageWithFallback src={person.avatar || ""} alt={person.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-6 pt-20 sm:flex-row">
                <div className="min-w-0">
                  <h2 className="flex flex-wrap items-center gap-3 break-words text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                    {person.name}
                    <div className="rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#00F0FF] sm:tracking-widest">
                      Verified Identity
                    </div>
                  </h2>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-slate-400 sm:tracking-widest">
                    <span>{person.role}</span>
                    <span className="hidden sm:inline">-</span>
                    <span>{person.metadata.source} Sync</span>
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                   <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1">
                      {person.anchors?.map((anchor, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl flex items-center justify-center relative group/anchor" title={`${anchor.provider} linked`}>
                           {anchor.provider === 'microsoft' ? <Globe size={16} className="text-blue-500" /> :
                            anchor.provider === 'slack' ? <Slack size={16} className="text-[#E01E5A]" /> :
                            <Box size={16} className="text-blue-400" />}
                           <div className={cn(
                             "absolute top-1 right-1 w-2 h-2 rounded-full border-2 border-[#0B0F19]",
                             anchor.status === 'synced' ? "bg-emerald-500" : anchor.status === 'pending' ? "bg-amber-500" : "bg-red-500"
                           )} />
                        </div>
                      ))}
                   </div>
                   <button className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-[#00F0FF] px-6 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#0B0F19] shadow-lg shadow-[#00F0FF]/20 transition-all hover:scale-105 active:scale-95 sm:tracking-widest">
                     <MessageSquare size={14} /> Transmit Blast
                   </button>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/5 italic">
                 <p className="text-sm text-slate-300 leading-relaxed font-medium">
                   "{person.bio || "No identity narrative synthesized yet for this node. The system architect suggests updating the bio to improve organizational clarity."}"
                 </p>
              </div>

              {/* Tiered Content Grid */}
              <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Left: Career Milestones & Experience */}
                <div className="lg:col-span-7 space-y-10">
                   <div>
                     <h3 className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
                       <History size={14} /> Career Trajectory
                     </h3>
                     <div className="space-y-6 relative ml-2">
                        {/* Timeline line */}
                        <div className="absolute top-0 bottom-0 left-[7px] w-px bg-white/10" />
                        
                        {(person.milestones || []).map((m, idx) => (
                          <div key={idx} className="relative pl-10">
                            <div className="absolute top-1.5 left-0 w-4 h-4 rounded-full bg-[#0B0F19] border-2 border-[#00F0FF] z-10" />
                            <div className="flex flex-col gap-1">
                               <span className="text-[10px] font-mono text-[#00F0FF] uppercase">{m.date}</span>
                               <h4 className="text-sm font-black text-white uppercase tracking-tight">{m.title}</h4>
                               <p className="text-[11px] text-slate-500 leading-relaxed">{m.description}</p>
                            </div>
                          </div>
                        ))}
                        {(!person.milestones || person.milestones.length === 0) && (
                          <div className="text-slate-600 text-[11px] italic pl-10">No public milestones synthesized.</div>
                        )}
                     </div>
                   </div>

                   <div>
                     <h3 className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
                       <Zap size={14} /> Synthesized Expertise
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {(person.skills || []).map((skill, idx) => (
                          <div key={idx} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300 sm:tracking-widest">
                            {skill}
                          </div>
                        ))}
                     </div>
                   </div>
                </div>

                {/* Right: Operational Merit & Engagement */}
                <div className="lg:col-span-5 space-y-10">
                   <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:rounded-[40px] sm:p-8">
                     <h3 className="mb-6 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">Operational Merit</h3>
                     <div className="space-y-4">
                        {(person.badges || []).map((badge, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00F0FF]/50 transition-all cursor-default">
                             <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                               <Award size={18} />
                             </div>
                             <span className="break-words text-xs font-black uppercase tracking-[0.12em] text-white sm:tracking-widest">{badge}</span>
                          </div>
                        ))}
                        {(!person.badges || person.badges.length === 0) && (
                          <div className="text-slate-600 text-[11px] italic">No merit badges awarded.</div>
                        )}
                     </div>
                     {/* Decorative background glow */}
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00F0FF]/5 rounded-full blur-[60px] group-hover:bg-[#00F0FF]/10 transition-all" />
                   </div>

                   <div className="space-y-6 rounded-[28px] border border-white/5 p-5 sm:rounded-[40px] sm:p-8">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">Identity Analytics</h3>
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 sm:tracking-widest">Velocity Score</span>
                               <span className="text-xl font-black text-white font-mono">{(person.accessCount / 15).toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-blue-500 to-[#00F0FF]" style={{ width: `${Math.min((person.accessCount / 15), 100)}%` }} />
                            </div>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 sm:tracking-widest">Risk Integrity</span>
                               <span className="text-xl font-black text-[#FF5733] font-mono">{100 - person.riskFactor}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-[#FF5733]" style={{ width: `${100 - person.riskFactor}%` }} />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="mt-auto flex flex-col items-stretch justify-between gap-4 border-t border-white/5 bg-white/[0.02] px-5 py-5 sm:flex-row sm:items-center sm:px-12">
              <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-6">
                <button className="flex min-h-[44px] items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 transition-colors hover:text-white sm:tracking-widest">
                  <Linkedin size={14} /> Profile
                </button>
                <button className="flex min-h-[44px] items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 transition-colors hover:text-white sm:tracking-widest">
                  <ExternalLink size={14} /> Portfolio
                </button>
              </div>
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="break-words text-[9px] font-mono uppercase tracking-tight text-slate-600">SOURCE_LINKAGE_SYNC_ACTIVE: {person.metadata.source}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
