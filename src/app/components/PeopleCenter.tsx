import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Layout, 
  Settings, 
  RefreshCcw, 
  Database,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Sparkles
} from 'lucide-react';
import { PersonCard, PersonDetailModal } from './PersonCard';
import { MeritArchitecture } from './MeritArchitecture';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAethos } from '../context/AethosContext';
import { AethosIdentity } from '../types/aethos.types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PeopleCenter: React.FC = () => {
  const [view, setView] = useState<'directory' | 'manager'>('directory');

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setView(view === 'directory' ? 'manager' : 'directory')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#00F0FF] hover:border-[#00F0FF]/30 transition-all group"
        >
          <Settings size={12} className="group-hover:rotate-90 transition-transform" />
          {view === 'directory' ? 'Enter Manager Mode' : 'Exit Manager Mode'}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        {view === 'directory' ? <DirectoryView /> : <DirectoryManager />}
      </div>
    </div>
  );
};

const DirectoryView: React.FC = () => {
  const { state: { identities } } = useAethos();
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<AethosIdentity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredPeople = identities.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.role.toLowerCase().includes(search.toLowerCase()) ||
    p.badges?.some(b => b.toLowerCase().includes(search.toLowerCase())) ||
    p.metadata.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            People Center
            <div className="px-2 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[10px] text-[#00F0FF]">
              TENANT DIRECTORY
            </div>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Explore the organizational architecture through the story of its people.</p>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
             <button 
               onClick={() => setViewMode('grid')}
               className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-[#00F0FF] text-[#0B0F19]" : "text-slate-400 hover:text-white")}
             >
               <Grid size={16} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-[#00F0FF] text-[#0B0F19]" : "text-slate-400 hover:text-white")}
             >
               <List size={16} />
             </button>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-all">
             <Filter size={14} /> Filters
           </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, role, or merit badge (e.g., 'Waste Warrior')..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-[#00F0FF]/50 transition-all placeholder:text-slate-600 shadow-inner"
        />
      </div>

      {/* Directory Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className={cn(
          "grid gap-4 pb-12",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredPeople.map((person) => (
            <PersonCard 
              key={person.id} 
              person={person} 
              onOpen={(p) => {
                setSelectedPerson(p);
                setIsModalOpen(true);
              }} 
            />
          ))}
          {filteredPeople.length === 0 && (
            <div className="col-span-full py-20 text-center">
               <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
               <p className="text-slate-500 font-medium">No identities found matching "{search}"</p>
            </div>
          )}
        </div>
      </div>

      <PersonDetailModal 
        person={selectedPerson} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export const DirectoryManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'merit'>('config');
  const [config, setConfig] = useState({
    showVelocity: true,
    showBadges: true,
    showSocial: false,
    showMilestones: true,
    primarySource: 'm365'
  });

  return (
    <div className="h-full flex flex-col gap-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              Directory Architecture
              <div className="px-2 py-0.5 rounded-full bg-[#FF5733]/10 border border-[#FF5733]/30 text-[10px] text-[#FF5733]">
                MANAGER MODE
              </div>
            </h1>
            <p className="text-sm text-slate-400 mt-1">Configure user-facing directory metadata and highlight cultural milestones.</p>
          </div>

          <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
            <button 
              onClick={() => setActiveTab('config')}
              className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'config' ? "bg-[#00F0FF] text-[#0B0F19]" : "text-slate-400 hover:text-white")}
            >
              Config
            </button>
            <button 
              onClick={() => setActiveTab('merit')}
              className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'merit' ? "bg-[#00F0FF] text-[#0B0F19]" : "text-slate-400 hover:text-white")}
            >
              Merit
            </button>
          </div>
        </div>

        {activeTab === 'config' ? (
          <div className="grid grid-cols-12 gap-6 flex-1 overflow-y-auto no-scrollbar pb-10">
            {/* Settings Side */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} className="text-[#00F0FF]" />
                  Card Customization
                </h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'showVelocity', label: 'Identity Velocity Metric', sub: 'Show relative engagement score' },
                    { id: 'showBadges', label: 'Operational Merit Badges', sub: 'Display earned certifications' },
                    { id: 'showMilestones', label: 'Career Trajectory', sub: 'Show historical milestones' },
                    { id: 'showSocial', label: 'Social Activity Summaries', sub: 'Enable Pulse Feed highlights (Premium)' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                      <div>
                        <p className="text-xs font-bold text-slate-200">{item.label}</p>
                        <p className="text-[10px] text-slate-500">{item.sub}</p>
                      </div>
                      <button 
                        onClick={() => setConfig(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))}
                        className={cn(
                          "w-10 h-5 rounded-full relative transition-all",
                          config[item.id as keyof typeof config] ? "bg-[#00F0FF]" : "bg-white/10"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                          config[item.id as keyof typeof config] ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Primary Data Anchor</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['m365', 'slack', 'google', 'box'].map(source => (
                      <button 
                        key={source}
                        onClick={() => setConfig(prev => ({ ...prev, primarySource: source }))}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                          config.primarySource === source 
                            ? "bg-[#00F0FF]/10 border-[#00F0FF]/50 text-[#00F0FF]" 
                            : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                        )}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00F0FF]/5 to-transparent border border-white/10">
                 <div className="flex items-center gap-2 mb-4">
                   <Sparkles size={14} className="text-[#00F0FF]" />
                   <span className="text-xs font-bold text-white uppercase tracking-wider">Automated Synthesis</span>
                 </div>
                 <p className="text-xs text-slate-300 mb-4">Identity Engine can automatically suggest bio updates and milestones based on cross-cloud activity.</p>
                 <button className="w-full py-3 rounded-xl bg-[#00F0FF] text-[#0B0F19] font-black text-[10px] uppercase tracking-widest shadow-lg">
                   Enable Auto-Synthesis
                 </button>
              </div>
            </div>

            {/* Sync Integrity Side */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-[#0B0F19]/60 backdrop-blur-xl border border-white/10 flex-1">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <RefreshCcw size={18} className="text-[#00F0FF]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Universal Sync Integrity</h3>
                  </div>
                  <button className="text-[10px] font-bold text-[#00F0FF] hover:underline flex items-center gap-1">
                    Re-initialize Tier 2 Synthesis <RefreshCcw size={10} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { source: 'Microsoft 365', status: 'Healthy', type: 'Tier 1', users: 1242, latency: '42ms' },
                    { source: 'Slack Enterprise', status: 'Healthy', type: 'Tier 1', users: 980, latency: '12ms' },
                    { source: 'Google Workspace', status: 'Incomplete', type: 'Tier 2', users: 42, latency: '850ms', warning: '14 Orphaned Nodes' },
                    { source: 'Box Storage', status: 'Healthy', type: 'Tier 2', users: 310, latency: '110ms' },
                  ].map((sync, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          sync.status === 'Healthy' ? "bg-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.5)]" : "bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]"
                        )} />
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-white">{sync.source}</span>
                             <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 font-mono uppercase">{sync.type}</span>
                          </div>
                          {sync.warning && <p className="text-[10px] text-[#FF5733] flex items-center gap-1 mt-0.5"><AlertTriangle size={10} /> {sync.warning}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                         <div className="text-right">
                           <span className="block text-[8px] text-slate-500 uppercase font-bold">Latency</span>
                           <span className="text-xs font-mono text-white">{sync.latency}</span>
                         </div>
                         <div className="text-right min-w-[80px]">
                           <span className="block text-[8px] text-slate-500 uppercase font-bold">Identities</span>
                           <span className="text-xs font-mono text-white">{sync.users}</span>
                         </div>
                         <div className="p-2 rounded-lg bg-white/5 text-slate-500 group-hover:text-white transition-colors cursor-pointer">
                           <Database size={16} />
                         </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                   <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                     <Layout size={20} className="text-slate-500" />
                   </div>
                   <h4 className="text-xs font-bold text-white mb-1">Previewing: "Narrative Engagement"</h4>
                   <p className="text-[10px] text-slate-500 max-w-xs">End-users will see the bio and career milestones prominently in their profile detail view.</p>
                   <button className="mt-4 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-white transition-all flex items-center gap-2">
                     <Eye size={12} /> Live Preview
                   </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <MeritArchitecture />
          </div>
        )}
    </div>
  );
};
