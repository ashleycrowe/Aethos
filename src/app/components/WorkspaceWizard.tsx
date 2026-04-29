import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Globe,
  Slack,
  Box as BoxIcon,
  HardDrive,
  Link2,
  Zap,
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  CheckCircle2,
  Plus,
  Rocket,
  Shield,
  Briefcase,
  Compass,
  Users as UsersIcon,
  X as CloseIcon,
  Calendar,
  Clock,
  MessageSquare,
  Repeat
} from 'lucide-react';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { useOperationalMerit } from '../context/OperationalMeritContext';
import { GlassCard } from './GlassCard';
import { ProviderType, Workspace, ContainerType, WorkspaceSubscription } from '../types/aethos.types';
import { toast } from 'sonner';

// Import New UI Components
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { IconButton } from './ui/IconButton';
import { Modal } from './ui/Modal';

interface WorkspaceWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const providerIcons: Record<ProviderType, any> = {
  microsoft: Share2,
  google: Globe,
  slack: Slack,
  box: BoxIcon,
  local: HardDrive
};

export const WorkspaceWizard: React.FC<WorkspaceWizardProps> = ({ isOpen, onClose }) => {
  const { isDaylight } = useTheme();
  const { addWorkspace, linkMeetingToWorkspace } = useAethos();
  const { checkWorkspaceAchievements } = useOperationalMerit();
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  // State for Workspace
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#00F0FF',
    icon: 'Target'
  });

  const [seedSearch, setSeedSearch] = useState('');
  const [suggestedSources, setSuggestedSources] = useState<any[]>([]);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());

  const [suggestedMeetings, setSuggestedMeetings] = useState<any[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);

  const handleCreate = () => {
    const newWorkspace: Workspace = {
      id: `ws-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      description: formData.description,
      color: formData.color,
      icon: formData.icon,
      primaryStorage: {
        provider: 'microsoft',
        containerId: 'sp-new-auto',
        path: `/Shared Documents/${formData.name}`,
        name: `${formData.name} Storage`
      },
      pinnedItems: [],
      linkedSources: Array.from(selectedSources).map(id => {
        const source = suggestedSources.find(a => a.id === id);
        return {
          provider: source.provider,
          containerId: source.id,
          type: source.type as ContainerType,
          name: source.name
        };
      }),
      subscriptions: [], // Will be populated if meeting selected
      members: ['id-001'],
      pulseFeed: [
        {
          id: 'p-initial',
          userId: 'id-001',
          userName: 'System',
          action: 'pin',
          artifactTitle: 'Workspace Created',
          provider: 'local',
          timestamp: new Date().toISOString(),
          message: 'Universal Adapter has initialized the operational lattice.'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intelligenceScore: selectedSources.size > 2 ? 94 : 62
    };

    addWorkspace(newWorkspace);
    
    // If a meeting was selected, link it immediately
    if (selectedMeeting) {
      const meeting = suggestedMeetings.find(m => m.id === selectedMeeting);
      if (meeting) {
        linkMeetingToWorkspace(newWorkspace.id, meeting.id, meeting.name);
      }
    }
    
    // Check for "Clarity Architect" achievement
    checkWorkspaceAchievements('id-001', newWorkspace.intelligenceScore);

    toast.success("Workspace Activated", {
      description: `"${formData.name}" lattice is now live.`
    });
    onClose();
    // Reset wizard
    setStep(0);
    setFormData({ name: '', description: '', color: '#00F0FF', icon: 'Target' });
    setSelectedSources(new Set());
    setSelectedMeeting(null);
  };

  const startDiscovery = async () => {
    if (!seedSearch) return;
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Mocked discovery results for sources and meetings
    setSuggestedSources([
      { id: 'suggest-1', name: `${seedSearch} Project Site`, provider: 'microsoft', type: 'site', logic: 'Found in SharePoint' },
      { id: 'suggest-2', name: `#${seedSearch.toLowerCase()}-updates`, provider: 'slack', type: 'channel', logic: 'Active Slack Channel' },
      { id: 'suggest-3', name: `${seedSearch}_Assets`, provider: 'google', type: 'folder', logic: 'Shared Drive Folder' },
      { id: 'suggest-4', name: 'Reference_Materials', provider: 'box', type: 'folder', logic: 'Related Box Content' }
    ]);

    setSuggestedMeetings([
      { id: 'meet-1', name: `${seedSearch} Strategy Sync`, date: 'Every Monday @ 10:00 AM', provider: 'microsoft', type: 'meeting', participants: 8 },
      { id: 'meet-2', name: `${seedSearch} Weekly Standup`, date: 'Daily @ 9:00 AM', provider: 'microsoft', type: 'meeting', participants: 12 },
    ]);

    setIsScanning(false);
    setStep(2);
  };

  const toggleSource = (id: string) => {
    const next = new Set(selectedSources);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSources(next);
  };

  const iconOptions = [
    { label: 'Target', value: 'Target', icon: <Target className="w-4 h-4" /> },
    { label: 'Rocket', value: 'Rocket', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Shield', value: 'Shield', icon: <Shield className="w-4 h-4" /> },
    { label: 'Briefcase', value: 'Briefcase', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Compass', value: 'Compass', icon: <Compass className="w-4 h-4" /> },
    { label: 'Team', value: 'Users', icon: <UsersIcon className="w-4 h-4" /> },
  ];

  const SelectedIcon = iconOptions.find(o => o.value === formData.icon)?.icon || <Target className="w-8 h-8 text-white" />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Operational Workspace"
      subtitle="Synthesize your operational environment"
      maxWidth="max-w-5xl"
    >
      <div className="flex-1 flex flex-col min-h-[550px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <Motion.div 
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <Input 
                    label="Workspace Name"
                    placeholder="e.g. Q1 Marketing Campaign"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    icon={Target}
                  />
                  <TextArea 
                    label="Description"
                    placeholder="What is the operational goal of this workspace?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="space-y-6">
                  <Select 
                    label="Workspace Icon"
                    options={iconOptions}
                    value={formData.icon}
                    onChange={(val) => setFormData({ ...formData, icon: val })}
                  />
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 pl-1">Pick a Color</label>
                    <div className="flex flex-wrap gap-3">
                      {['#00F0FF', '#FF5733', '#10B981', '#6366F1', '#F59E0B', '#EC4899'].map(c => (
                        <button 
                          key={c} 
                          onClick={() => setFormData({ ...formData, color: c })}
                          className={`w-10 h-10 rounded-xl transition-all ${formData.color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-400 dark:ring-white' : 'opacity-40 hover:opacity-100'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={`p-8 rounded-[40px] border border-dashed flex flex-col items-center justify-center text-center space-y-4 ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500" style={{ backgroundColor: formData.color }}>
                      {React.cloneElement(SelectedIcon as React.ReactElement, { className: 'w-10 h-10 text-white' })}
                    </div>
                    <div>
                      <p className={`text-xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{formData.name || 'Untitled Project'}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Preview Visualization</p>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}

          {step === 1 && (
            <Motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10 py-10"
            >
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 ${isDaylight ? 'bg-blue-50' : 'bg-[#00F0FF]/10'}`}>
                  <Zap className={`w-8 h-8 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
                </div>
                <h3 className={`text-3xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Crystallize Context</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Search for a project name or primary document. Aethos will find related folders, Slack channels, and **Outlook Meetings** to anchor your workspace.
                </p>
              </div>

              <div className="relative max-w-2xl mx-auto">
                <Input 
                  placeholder="SEARCH FOR A PROJECT ANCHOR..."
                  value={seedSearch}
                  onChange={(e) => setSeedSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startDiscovery()}
                  icon={Search}
                  className="scale-110"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button 
                    size="md"
                    onClick={startDiscovery}
                    disabled={!seedSearch || isScanning}
                    icon={isScanning ? Cpu : ChevronRight}
                    className={isScanning ? 'animate-spin' : ''}
                  >
                    {isScanning ? '' : 'Synthesize'}
                  </Button>
                </div>
              </div>

              {isScanning && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <Motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Querying Universal Adapter...</span>
                </div>
              )}
            </Motion.div>
          )}

          {step === 2 && (
            <Motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Linked Content */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDaylight ? 'text-slate-400' : 'text-slate-500'}`}>Artifact Clusters</h3>
                    <span className="text-[10px] font-black text-[#00F0FF]">{selectedSources.size} Linked</span>
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                    {suggestedSources.map((source) => {
                      const SourceIcon = providerIcons[source.provider as ProviderType];
                      const isSelected = selectedSources.has(source.id);
                      return (
                        <div 
                          key={source.id}
                          onClick={() => toggleSource(source.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected 
                              ? (isDaylight ? 'bg-blue-50 border-blue-600' : 'bg-[#00F0FF]/10 border-[#00F0FF]') 
                              : (isDaylight ? 'bg-slate-50 border-slate-100 hover:border-slate-300' : 'bg-white/5 border-white/5')
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <SourceIcon className={`w-4 h-4 ${isSelected ? (isDaylight ? 'text-blue-600' : 'text-[#00F0FF]') : 'text-slate-500'}`} />
                            <div className="truncate max-w-[180px]">
                              <p className={`text-[11px] font-bold uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{source.name}</p>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{source.logic}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#00F0FF] border-[#00F0FF]' : 'border-slate-300 dark:border-white/10'}`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Temporal Anchors (Meetings) */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDaylight ? 'text-slate-400' : 'text-slate-500'}`}>Temporal Anchors</h3>
                    <span className="text-[10px] font-black text-[#FF5733]">Integration Ready</span>
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                    {suggestedMeetings.map((meeting) => (
                      <div 
                        key={meeting.id}
                        onClick={() => setSelectedMeeting(selectedMeeting === meeting.id ? null : meeting.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                          selectedMeeting === meeting.id 
                            ? 'bg-[#FF5733]/10 border-[#FF5733] shadow-lg shadow-[#FF5733]/10' 
                            : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className={`p-3 rounded-xl bg-white/5 border ${selectedMeeting === meeting.id ? 'border-[#FF5733]/30' : 'border-white/10'}`}>
                            <Calendar className={`w-5 h-5 ${selectedMeeting === meeting.id ? 'text-[#FF5733]' : 'text-slate-500'}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{meeting.name}</p>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                              <Repeat className="w-3 h-3" /> {meeting.date}
                            </p>
                          </div>
                          {selectedMeeting === meeting.id && <ShieldCheck className="w-5 h-5 text-[#FF5733]" />}
                        </div>
                        
                        {/* Status for Linkage */}
                        {selectedMeeting === meeting.id && (
                          <div className="mt-4 pt-4 border-t border-[#FF5733]/20 space-y-2 relative z-10">
                            <div className="flex items-center gap-2 text-[9px] font-black text-[#FF5733] uppercase tracking-widest">
                              <Sparkles className="w-3 h-3" /> Auto-sync Loop Components
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              <MessageSquare className="w-3 h-3" /> Extract Viva Topics
                            </div>
                          </div>
                        )}
                        
                        {selectedMeeting === meeting.id && (
                          <Motion.div layoutId="meeting-glow" className="absolute inset-0 bg-gradient-to-br from-[#FF5733]/5 to-transparent pointer-events-none" />
                        )}
                      </div>
                    ))}
                    <div className="p-4 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-center">
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">No other meetings found for this context</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${isDaylight ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-500/10 border-indigo-500/20'} flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/20">
                    <Rocket className="text-indigo-500 w-6 h-6" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Intelligence Synthesis</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Linking {selectedSources.size} sources & {selectedMeeting ? '1 temporal anchor' : '0 temporal anchors'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Clarity Score</span>
                   <span className="text-2xl font-black text-indigo-500">{(selectedSources.size * 15) + (selectedMeeting ? 20 : 0) + 40}%</span>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        <div className={`mt-12 pt-8 border-t flex items-center justify-between shrink-0 ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-indigo-500 dark:bg-[#00F0FF]' : 'w-2.5 bg-slate-200 dark:bg-white/10'}`} />
            ))}
          </div>

          <div className="flex gap-4">
            {step > 0 && (
              <Button 
                variant="secondary"
                onClick={() => setStep(step - 1)}
                icon={ChevronLeft}
              >
                Back
              </Button>
            )}
            
            {step < 2 ? (
              <Button 
                disabled={step === 0 && !formData.name}
                onClick={() => setStep(step + 1)}
                icon={ChevronRight}
                iconPosition="right"
              >
                Continue Synthesis
              </Button>
            ) : (
              <Button 
                variant="success"
                onClick={handleCreate}
                icon={Rocket}
                size="lg"
                className="px-10"
              >
                Launch Workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
