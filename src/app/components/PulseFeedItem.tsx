import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Zap, 
  Slack, 
  Target, 
  Globe, 
  Info,
  Cpu,
  CornerDownRight,
  Sparkles,
  ExternalLink,
  Send
} from 'lucide-react';
import { PulseEvent, PulseAction, ProviderType } from '../types/aethos.types';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { useUser } from '../context/UserContext';
import { formatDistanceToNow } from 'date-fns';

interface PulseFeedItemProps {
  workspaceId: string;
  event: PulseEvent;
}

const ProviderIcon = ({ provider, action }: { provider: ProviderType, action: PulseAction }) => {
  if (action === 'blast') return <Zap className="w-4 h-4 text-[#00F0FF]" />;
  if (provider === 'slack') return <Slack className="w-4 h-4 text-[#A855F7]" />;
  if (provider === 'microsoft') return <Target className="w-4 h-4 text-[#00F0FF]" />;
  return <Globe className="w-4 h-4 text-slate-500" />;
};

export const PulseFeedItem: React.FC<PulseFeedItemProps> = ({ workspaceId, event }) => {
  const { isDaylight } = useTheme();
  const { reactToPulse, commentOnPulse } = useAethos();
  const { user } = useUser();
  const [showStory, setShowStory] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState('');

  const isPositive = event.metadata?.sentiment === 'positive';
  const hasImpact = (event.metadata?.impactScore || 0) > 5;

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentOnPulse(workspaceId, event.id, commentText);
    setCommentText('');
    setIsCommenting(false);
  };

  return (
    <div className={`group relative p-8 rounded-[40px] border transition-all ${
      event.isBlast 
        ? (isDaylight ? 'bg-white border-slate-900 shadow-xl' : 'bg-white/[0.04] border-[#00F0FF]/20 shadow-[0_0_40px_rgba(0,240,255,0.05)]') 
        : (isDaylight ? 'bg-white border-slate-100' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.03]')
    }`}>
      {/* Narrative Logic Layer (Visual Pulse) */}
      {hasImpact && !isDaylight && (
        <div className="absolute top-0 left-0 w-1 h-full rounded-full bg-[#00F0FF] shadow-[0_0_15px_#00F0FF] opacity-30" />
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar/Actor */}
        <div className="flex flex-row md:flex-col items-center gap-4 shrink-0">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg font-black shadow-lg transition-transform group-hover:scale-110 ${
            event.isBlast 
              ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black')
              : (isDaylight ? 'bg-slate-100 text-slate-900' : 'bg-white/5 text-slate-400')
          }`}>
            {event.userName.charAt(0)}
          </div>
          <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${isDaylight ? 'bg-white border-slate-200 text-slate-500' : 'bg-black/40 border-white/10 text-slate-500'}`}>
             {event.provider}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {event.userName}
                 </h4>
                 <span className="w-1 h-1 rounded-full bg-slate-700" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                 </span>
                 {event.isBlast && (
                   <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-[#00F0FF]/10 text-[#00F0FF] text-[8px] font-black uppercase tracking-widest">
                      <Sparkles className="w-2.5 h-2.5" /> High Impact
                   </div>
                 )}
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                 <ProviderIcon provider={event.provider} action={event.action} />
                 {event.action.replace('-', ' ')} <CornerDownRight className="w-3 h-3" /> {event.artifactTitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
               <button 
                  onClick={() => setShowStory(!showStory)}
                  className={`p-2 rounded-xl border transition-all ${showStory ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]' : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'}`}
               >
                  <Cpu className="w-4 h-4" />
               </button>
               <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all">
                  <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>
          </div>

          <div className="space-y-6">
             <div className={`text-sm md:text-base leading-relaxed ${isDaylight ? 'text-slate-700' : 'text-slate-300'} font-medium`}>
                {event.message || `Automated operational sync from ${event.provider} regarding ${event.artifactTitle}.`}
             </div>

             {/* Aethos Cinematic Frame for Media */}
             {event.mediaUrl && (
               <div className="relative group/media cursor-zoom-in">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl z-10 flex items-end p-6">
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">View Operational Evidence</p>
                  </div>
                  <img 
                    src={event.mediaUrl} 
                    className="w-full h-80 object-cover rounded-[32px] border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.01]" 
                    alt="Operational Artifact"
                  />
                  <div className="absolute top-4 right-4 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white z-10">
                     <ExternalLink className="w-4 h-4" />
                  </div>
               </div>
             )}

             {/* Story vs Calculation Layer */}
             <AnimatePresence>
                {showStory && (
                  <Motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-6 rounded-[28px] ${isDaylight ? 'bg-slate-50 border border-slate-200' : 'bg-black/40 border border-[#00F0FF]/10'} space-y-4`}>
                       <div className="flex items-center gap-3">
                          <Info className={`w-4 h-4 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />
                          <h5 className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Architectural Intelligence</h5>
                       </div>
                       <p className="text-[11px] leading-relaxed text-slate-500 font-medium italic">
                          "This signal indicates a 12% increase in cross-cloud data movement. Based on the Narrative Logic Layer, this is an intentional 'Blast' to reduce operational friction in the {event.metadata?.channelName || 'primary'} channel."
                       </p>
                       <div className="flex items-center gap-6 pt-2">
                          <div>
                             <p className={`text-xs font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>+{event.metadata?.impactScore || 2}%</p>
                             <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Impact</p>
                          </div>
                          <div className="h-4 w-[1px] bg-white/10" />
                          <div>
                             <p className={`text-xs font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{event.metadata?.sentiment || 'Neutral'}</p>
                             <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Sentiment</p>
                          </div>
                       </div>
                    </div>
                  </Motion.div>
                )}
             </AnimatePresence>
          </div>

          {/* Engagement Loop */}
          <div className="flex flex-col gap-6 pt-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <button 
                        onClick={() => reactToPulse(workspaceId, event.id, '❤️')}
                        className={`flex items-center gap-2 p-2 rounded-xl transition-all ${isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/5'}`}
                      >
                         <Heart className={`w-5 h-5 ${event.reactions?.some(r => r.userIds.includes(user.id)) ? 'fill-[#FF5733] text-[#FF5733]' : 'text-slate-500'}`} />
                         {event.reactions && event.reactions.length > 0 && (
                           <span className="text-[10px] font-black text-slate-400">{event.reactions.reduce((a, b) => a + b.count, 0)}</span>
                         )}
                      </button>
                   </div>
                   <button 
                      onClick={() => setIsCommenting(!isCommenting)}
                      className={`flex items-center gap-2 p-2 rounded-xl transition-all ${isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/5'}`}
                   >
                      <MessageCircle className="w-5 h-5 text-slate-500" />
                      {event.comments && event.comments.length > 0 && (
                        <span className="text-[10px] font-black text-slate-400">{event.comments.length}</span>
                      )}
                   </button>
                   <button className={`p-2 rounded-xl transition-all ${isDaylight ? 'hover:bg-slate-100' : 'hover:bg-white/5'}`}>
                      <Share2 className="w-5 h-5 text-slate-500" />
                   </button>
                </div>
             </div>

             {/* Comments Section */}
             {(event.comments?.length || 0) > 0 && (
               <div className="space-y-4 pl-4 border-l border-white/5">
                  {event.comments?.map(comment => (
                    <div key={comment.id} className="flex gap-4 group/comment">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${isDaylight ? 'bg-slate-100 text-slate-900' : 'bg-white/5 text-slate-500'}`}>
                          {comment.userName.charAt(0)}
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-2">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{comment.userName}</span>
                             <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{formatDistanceToNow(new Date(comment.timestamp))} ago</span>
                          </div>
                          <p className={`text-[12px] mt-1 ${isDaylight ? 'text-slate-600' : 'text-slate-400'}`}>{comment.text}</p>
                       </div>
                    </div>
                  ))}
               </div>
             )}

             {isCommenting && (
               <Motion.form 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 onSubmit={handleComment}
                 className="flex gap-4 items-center"
               >
                  <input 
                    autoFocus
                    placeholder="Add an operational insight..."
                    className={`flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-sm outline-none focus:border-[#00F0FF]/30 transition-all ${isDaylight ? 'bg-slate-50 border-slate-200' : ''}`}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button type="submit" className="p-3 rounded-2xl bg-[#00F0FF] text-black hover:scale-105 transition-all">
                     <Send className="w-4 h-4" />
                  </button>
               </Motion.form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
