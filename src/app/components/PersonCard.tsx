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
      className="group relative bg-[#0B0F19]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-[#00F0FF]/40 transition-all cursor-pointer overflow-hidden"
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
            <h3 className="text-sm font-bold text-white truncate group-hover:text-[#00F0FF] transition-colors">{person.name}</h3>
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

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all">
            <Mail size={14} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-[#E01E5A] hover:bg-[#E01E5A]/10 transition-all">
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F19]/90 backdrop-blur-md p-4 sm:p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-[#0B0F19] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* Header / Banner */}
            <div className="h-40 bg-gradient-to-br from-[#00F0FF]/20 via-[#0B0F19] to-transparent relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all z-10"
              >
                <MoreVertical size={20} />
              </button>
              
              {/* Profile Background Graphics */}
              <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#00F0FF,transparent_70%)]" />
                 <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#FF5733,transparent_70%)]" />
              </div>
            </div>

            <div className="px-6 sm:px-12 pb-12 relative flex-1 overflow-y-auto no-scrollbar">
              {/* Profile Pic Floating */}
              <div className="absolute -top-16 left-6 sm:left-12">
                <div className="w-32 h-32 rounded-3xl border-8 border-[#0B0F19] overflow-hidden bg-slate-800 shadow-2xl">
                  <ImageWithFallback src={person.avatar || ""} alt={person.name} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="pt-20 flex flex-col sm:flex-row justify-between items-start gap-6">
                <div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    {person.name}
                    <div className="px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF] font-black uppercase tracking-widest">
                      Verified Identity
                    </div>
                  </h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">{person.role} • {person.metadata.source} Sync</p>
                </div>
                <div className="flex gap-3">
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
                   <button className="px-6 py-3 rounded-2xl bg-[#00F0FF] text-[#0B0F19] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#00F0FF]/20">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
                {/* Left: Career Milestones & Experience */}
                <div className="lg:col-span-7 space-y-10">
                   <div>
                     <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-6 flex items-center gap-3">
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
                     <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-6 flex items-center gap-3">
                       <Zap size={14} /> Synthesized Expertise
                     </h3>
                     <div className="flex flex-wrap gap-2">
                        {(person.skills || []).map((skill, idx) => (
                          <div key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            {skill}
                          </div>
                        ))}
                     </div>
                   </div>
                </div>

                {/* Right: Operational Merit & Engagement */}
                <div className="lg:col-span-5 space-y-10">
                   <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
                     <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-6">Operational Merit</h3>
                     <div className="space-y-4">
                        {(person.badges || []).map((badge, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00F0FF]/50 transition-all cursor-default">
                             <div className="p-2.5 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF]">
                               <Award size={18} />
                             </div>
                             <span className="text-xs font-black text-white uppercase tracking-widest">{badge}</span>
                          </div>
                        ))}
                        {(!person.badges || person.badges.length === 0) && (
                          <div className="text-slate-600 text-[11px] italic">No merit badges awarded.</div>
                        )}
                     </div>
                     {/* Decorative background glow */}
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#00F0FF]/5 rounded-full blur-[60px] group-hover:bg-[#00F0FF]/10 transition-all" />
                   </div>

                   <div className="p-8 rounded-[40px] border border-white/5 space-y-6">
                      <h3 className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black">Identity Analytics</h3>
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Velocity Score</span>
                               <span className="text-xl font-black text-white font-mono">{(person.accessCount / 15).toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-gradient-to-r from-blue-500 to-[#00F0FF]" style={{ width: `${Math.min((person.accessCount / 15), 100)}%` }} />
                            </div>
                         </div>
                         <div className="space-y-3">
                            <div className="flex justify-between items-end">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Integrity</span>
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
            <div className="mt-auto px-12 py-5 border-t border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-6">
                <button className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <Linkedin size={14} /> Profile
                </button>
                <button className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  <ExternalLink size={14} /> Portfolio
                </button>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">SOURCE_LINKAGE_SYNC_ACTIVE: {person.metadata.source}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
