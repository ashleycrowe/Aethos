import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Heart, 
  Share2, 
  Image as ImageIcon, 
  Award, 
  Megaphone, 
  Users, 
  Clock, 
  Zap, 
  MoreHorizontal,
  Plus,
  ArrowRight,
  Filter,
  CheckCircle2,
  BellRing,
  Calendar,
  Repeat,
  Target,
  Slack,
  Globe,
  Database,
  Link2,
  Activity,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Camera,
  Layers,
  Info
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { PulseAction, ProviderType } from '../types/aethos.types';

const providerColors: Record<ProviderType, string> = {
  microsoft: 'text-[#00F0FF]',
  slack: 'text-[#A855F7]',
  google: 'text-[#34A853]',
  box: 'text-[#0061D5]',
  local: 'text-slate-400'
};

const actionIcons: Record<string, any> = {
  'meeting-start': Calendar,
  'loop-sync': Repeat,
  'viva-post': MessageSquare,
  'slack-thread': Slack,
  'huddle-start': Activity,
  'pin': Target,
  'edit': Zap,
  'risk-detected': ShieldCheck
};

export const OperationalPulse = () => {
  const { isDaylight } = useTheme();
  const { state: { workspaces, pulseStream, pulseChannels }, addPulsePost, reactToPulsePost, subscribeToChannel } = useAethos();
  const [activeTab, setActiveTab] = useState<'stream' | 'blasts' | 'social' | 'workspace'>('stream');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('ch-all');
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [narrativePriority, setNarrativePriority] = useState<'Standard' | 'Critical' | 'Impact'>('Standard');

  const activeWorkspace = workspaces[0];

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    addPulsePost({
      userId: 'id-001',
      userName: 'Sarah Chen',
      userRole: 'Global Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: postContent,
      type: selectedImage ? 'social' : 'blast',
      media: selectedImage,
      provider: 'microsoft',
      isCommunicator: true,
      workspace: activeWorkspace?.name || 'Global Lattice',
      channelId: selectedChannelId,
      impact: narrativePriority === 'Impact' ? 95 : narrativePriority === 'Critical' ? 100 : 45
    });

    toast.success('Cross-Platform Sync Initiated', {
      description: `Targeting: ${pulseChannels.find(c => c.id === selectedChannelId)?.name}`
    });
    setPostContent('');
    setSelectedImage(undefined);
  };

  const filteredPosts = pulseStream.filter(post => {
    if (selectedChannelId !== 'ch-all' && post.channelId !== selectedChannelId) return false;
    if (activeTab === 'blasts') return post.type === 'blast';
    if (activeTab === 'social') return post.type === 'social' || !!post.media;
    if (activeTab === 'workspace') return post.workspace === activeWorkspace?.name;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-in fade-in duration-700">
        {/* Header & View Synthesizer */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]'}`}>
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Universal Lattice Pulse</h2>
            </div>
            <h1 className={`text-5xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              Operational <span className="text-[#00F0FF]">Signals</span>
            </h1>
          </div>

          <div className={`flex items-center p-1.5 rounded-[24px] border shadow-2xl ${isDaylight ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10 backdrop-blur-xl'}`}>
            {[
              { id: 'stream', label: 'All Signals', icon: Users },
              { id: 'workspace', label: 'Subscribed', icon: Target },
              { id: 'blasts', label: 'Blasts', icon: Megaphone },
              { id: 'social', label: 'Gallery', icon: Camera },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 transition-all ${
                  activeTab === tab.id 
                    ? (isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20') 
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pulse Channels Tape */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
           {pulseChannels.map((channel) => (
             <button
               key={channel.id}
               onClick={() => setSelectedChannelId(channel.id)}
               className={`flex items-center gap-4 px-6 py-4 rounded-[24px] border transition-all whitespace-nowrap group ${
                 selectedChannelId === channel.id
                   ? 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                   : 'bg-white/5 border-white/5 hover:border-white/10'
               }`}
             >
               <div className={`p-2 rounded-lg bg-white/5 ${selectedChannelId === channel.id ? 'text-[#00F0FF]' : 'text-slate-500 group-hover:text-white'}`}>
                  {channel.icon === 'Globe' ? <Globe className="w-4 h-4" /> :
                   channel.icon === 'ShieldCheck' ? <ShieldCheck className="w-4 h-4" /> :
                   channel.icon === 'Zap' ? <Zap className="w-4 h-4" /> :
                   <Award className="w-4 h-4" />}
               </div>
               <div className="text-left">
                  <p className={`text-[11px] font-black uppercase tracking-widest ${selectedChannelId === channel.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {channel.name}
                  </p>
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-0.5">{channel.subscriberCount} Architects</p>
               </div>
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Universal Communicator */}
            <GlassCard className="p-8 bg-[#0B0F19]/60 border-white/10">
              <form onSubmit={handlePost} className="space-y-6">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex-shrink-0 flex items-center justify-center overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="User" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest px-2 py-1 rounded bg-[#00F0FF]/10">Posting to: {pulseChannels.find(c => c.id === selectedChannelId)?.name}</span>
                    </div>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Deconstruct an operational win or blast a signal..."
                      className={`w-full bg-transparent border-none outline-none resize-none text-base leading-relaxed py-1 ${isDaylight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'}`}
                      rows={2}
                    />
                    
                    {selectedImage && (
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                        <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setSelectedImage(undefined)}
                          className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Priority</span>
                        <div className="flex p-1 rounded-xl bg-white/5 border border-white/5">
                          {['Standard', 'Impact', 'Critical'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setNarrativePriority(p as any)}
                              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                narrativePriority === p ? 'bg-[#00F0FF] text-black' : 'text-slate-500 hover:text-white'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-[9px] italic text-slate-600">Impact ranking affects blast radius</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setSelectedImage('https://images.unsplash.com/photo-1661701958241-b0f896ea87f6?w=800&q=80')}
                      className={`p-3 rounded-xl hover:bg-white/10 transition-all ${selectedImage ? 'text-[#00F0FF] bg-[#00F0FF]/10' : 'text-slate-500'}`}
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-3 rounded-xl hover:bg-white/10 text-slate-500 transition-all">
                      <Award className="w-5 h-5" />
                    </button>
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-[#00F0FF] text-black text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-[#00F0FF]/20"
                  >
                    Broadcast Signal <Megaphone className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </GlassCard>

            {/* Aggregated Signals List */}
            <div className="space-y-8">
              {filteredPosts.map((post) => {
                const ActionIcon = post.action ? actionIcons[post.action] : Zap;
                return (
                  <Motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <GlassCard className={`p-8 space-y-6 relative overflow-hidden group ${post.type === 'operational' ? 'border-l-4 border-l-[#FF5733]' : 'border-l-4 border-l-[#00F0FF]'}`}>
                      <div className="absolute top-0 right-0 p-8 flex gap-2">
                         <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl flex items-center gap-2">
                           {post.provider === 'slack' ? <Slack className="w-3.5 h-3.5 text-[#A855F7]" /> : <Globe className="w-3.5 h-3.5 text-[#00F0FF]" />}
                           <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{post.provider === 'microsoft' ? 'M365' : post.provider.toUpperCase()}</span>
                         </div>
                      </div>

                      <div className="flex gap-6">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white/10">
                          <img src={post.avatar} alt={post.userName} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h4 className={`text-lg font-black tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                              {post.userName}
                            </h4>
                            {post.isCommunicator && <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />}
                            <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">• {post.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{post.userRole}</p>
                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                            <p className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">{pulseChannels.find(c => c.id === post.channelId)?.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pl-20 space-y-6">
                        <div className="flex-1">
                            <p className={`text-base font-medium leading-relaxed ${isDaylight ? 'text-slate-700' : 'text-slate-300'}`}>
                              {post.content}
                            </p>
                        </div>

                        {post.media && (
                          <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group/img">
                            <img src={post.media} alt="Post content" className="w-full h-auto object-cover max-h-[400px] transition-transform duration-700 group-hover/img:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-8">
                               <button className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2">
                                 <ExternalLink className="w-4 h-4" /> Open Record
                               </button>
                            </div>
                          </div>
                        )}

                        {/* Engagement Bar */}
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-8">
                            <button 
                              onClick={() => reactToPulsePost(post.id, 'heart')}
                              className="flex items-center gap-2.5 group text-slate-500 hover:text-[#FF5733] transition-colors"
                            >
                              <Heart className="w-5 h-5 group-hover:fill-[#FF5733]" />
                              <span className="text-[12px] font-black">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2.5 group text-slate-500 hover:text-[#00F0FF] transition-colors">
                              <MessageSquare className="w-5 h-5" />
                              <span className="text-[12px] font-black">{post.comments}</span>
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Impact ranking</span>
                             <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(b => (
                                  <div key={b} className={`w-1 h-3 rounded-full ${b <= ((post.impact || 40) / 20) ? 'bg-[#00F0FF]' : 'bg-white/10'}`} />
                                ))}
                             </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Motion.div>
                );
              })}
            </div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center justify-between">
                Channel Directory
              </h3>
              <div className="space-y-4">
                 {pulseChannels.map(ch => (
                   <div key={ch.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all space-y-3">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF]">
                              <Layers className="w-4 h-4" />
                            </div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight">{ch.name}</p>
                         </div>
                         <button 
                          onClick={() => subscribeToChannel(ch.id)}
                          className="p-2 rounded-lg hover:bg-white/10 text-[#00F0FF] transition-all"
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">{ch.description}</p>
                   </div>
                 ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8 bg-indigo-600 dark:bg-indigo-600/20 border-indigo-500/30 overflow-hidden relative">
               <div className="absolute -right-10 -top-10 w-48 h-48 bg-indigo-400/20 blur-[80px] rounded-full" />
               <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <Sparkles className="text-white w-6 h-6" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Narrative Guidance</h3>
                 </div>
                 <p className="text-xs font-medium text-white leading-relaxed">
                   "Architects: Avoid raw storage stats in blasts. Instead, frame waste recovery as 'Digital Mass Reduction' to accelerate project discovery."
                 </p>
                 <button className="w-full py-4 bg-white text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all">
                   Deconstruct Story Logic
                 </button>
               </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};