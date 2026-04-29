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
  Sparkles,
  Award,
  ExternalLink,
  Send,
  Plus,
  Camera,
  Grid,
  Layout,
  Search,
  Filter,
  Eye,
  Activity,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

const StoryCircle = ({ user, active }: { user: any, active?: boolean }) => {
  const { isDaylight } = useTheme();
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
      <div className={`p-1 rounded-full border-2 transition-all duration-500 ${active ? 'border-[#00F0FF] scale-110 shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'border-white/10 group-hover:border-white/30'}`}>
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0B0F19]">
          <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
        </div>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-slate-500'} group-hover:text-[#00F0FF] transition-colors`}>
        {user.userName.split(' ')[0]}
      </span>
    </div>
  );
};

export const WorkInstagram = () => {
  const { isDaylight } = useTheme();
  const { state: { pulseStream }, reactToPulsePost } = useAethos();
  const [activeFilter, setActiveFilter] = useState<'all' | 'blast' | 'social' | 'operational'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');

  // Filter the unified stream for the gallery view (must have media)
  const visualPosts = pulseStream.filter(post => !!post.media);
  
  const filteredPosts = activeFilter === 'all' 
    ? visualPosts 
    : visualPosts.filter(p => p.type === activeFilter);

  const handleAction = (postId: string, type: string) => {
    if (type === 'Like') {
      reactToPulsePost(postId, 'heart');
    }
    toast.success(`${type} Loop Triggered`, {
      description: `Your operational engagement has been synchronized across all adapters.`
    });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-12 pb-20 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Cinematic Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'}`}>
                <Camera className="w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Visual Operational Records</h2>
            </div>
            <h1 className={`text-6xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              The <span className="text-[#00F0FF]">Pulse</span> Gallery
            </h1>
            <p className="text-sm text-slate-500 font-medium max-w-xl">
              A cinematic visual lens into the operational lattice. Proof of impact, synchronized across every adapter.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className={`flex items-center p-1.5 rounded-[24px] border shadow-2xl ${isDaylight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
              {[
                { id: 'grid', icon: Grid },
                { id: 'feed', icon: Layout },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={`p-3 rounded-[18px] transition-all ${
                    viewMode === mode.id 
                      ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black') 
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <mode.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            <button className="px-8 py-4 rounded-[24px] bg-[#00F0FF] text-black text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-[#00F0FF]/20">
              Post Record <Megaphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stories / Active Channels */}
        <div className="flex items-center gap-8 overflow-x-auto pb-6 custom-scrollbar no-scrollbar">
          <div className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
            <div className={`p-1 rounded-full border-2 border-dashed border-[#00F0FF]/40 group-hover:border-[#00F0FF] transition-all`}>
              <div className="w-16 h-16 rounded-full bg-[#00F0FF]/5 flex items-center justify-center text-[#00F0FF]">
                <Plus className="w-8 h-8" />
              </div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-[#00F0FF]`}>Add Pulse</span>
          </div>
          {visualPosts.slice(0, 8).map((post, i) => (
            <StoryCircle key={post.id} user={post} active={i === 0} />
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-4">
          {['all', 'blast', 'social', 'operational'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'text-slate-500 hover:text-slate-400'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 1100: 3 }}>
          <Masonry gutter="32px">
            {filteredPosts.map((post) => (
              <Motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-0 overflow-hidden group border-white/10 hover:border-[#00F0FF]/30 transition-all duration-700 bg-[#0B0F19]/80">
                  {/* Aethos Cinematic Frame */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={post.media} 
                      alt={post.content} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                    
                    {/* Overlay Metadata */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-6 right-6 flex flex-col gap-2">
                      {post.badges?.map((badge, idx) => (
                        <Motion.div 
                          key={badge}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[#00F0FF] text-[8px] font-black uppercase tracking-widest"
                        >
                          <Award className="w-3 h-3" /> {badge}
                        </Motion.div>
                      ))}
                    </div>

                    {/* Impact Meter */}
                    {post.impact && (
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#00F0FF]/10 backdrop-blur-xl border border-[#00F0FF]/20 group/impact cursor-help relative">
                          <Zap className="w-4 h-4 text-[#00F0FF]" />
                          <div className="text-left">
                            <p className="text-[14px] font-black text-white leading-none">{post.impact}%</p>
                            <p className="text-[7px] font-black text-[#00F0FF] uppercase tracking-widest mt-0.5">Impact</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Operational Icon */}
                    <div className="absolute bottom-6 left-6 p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white">
                      {post.provider === 'slack' ? <Slack className="w-5 h-5 text-[#A855F7]" /> :
                       post.provider === 'microsoft' ? <Globe className="w-5 h-5 text-[#00F0FF]" /> :
                       <Target className="w-5 h-5 text-indigo-400" />}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                          <img src={post.avatar} alt={post.userName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-black text-white uppercase tracking-tight">{post.userName}</h4>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{post.userRole}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{post.timestamp}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-slate-300 font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                      {post.content}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-8">
                        <button 
                          onClick={() => handleAction(post.id, 'Like')}
                          className="flex items-center gap-2.5 group/btn text-slate-500 hover:text-[#FF5733] transition-colors"
                        >
                          <Heart className="w-5 h-5 group-hover/btn:fill-[#FF5733]" />
                          <span className="text-[12px] font-black">{post.likes}</span>
                        </button>
                        <button 
                          onClick={() => handleAction(post.id, 'Comment')}
                          className="flex items-center gap-2.5 group/btn text-slate-500 hover:text-[#00F0FF] transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-[12px] font-black">{post.comments}</span>
                        </button>
                      </div>
                      
                      <button className="flex items-center gap-2 text-[10px] font-black text-[#00F0FF] uppercase tracking-widest group/link">
                        Deconstruct Intelligence <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </Motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* Global Trend Sidebar */}
        <div className="fixed bottom-10 right-10 z-[100] space-y-4 max-w-xs hidden xl:block">
          <GlassCard className="p-6 bg-[#00F0FF]/5 border-[#00F0FF]/20 backdrop-blur-3xl">
             <div className="flex items-center gap-3 mb-4">
               <TrendingUp className="w-5 h-5 text-[#00F0FF]" />
               <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Operational Velocity</h3>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
               "The visual record lattice is observing high-velocity synchronization across 4 active workspaces."
             </p>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <Motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '68%' }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="h-full bg-[#00F0FF]"
               />
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};