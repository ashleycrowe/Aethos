import React, { useState } from 'react';
import { 
  Upload, 
  Plus, 
  Shield, 
  FileText, 
  Database, 
  Users, 
  Share2, 
  Slack, 
  Globe, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Lock,
  Eye,
  Edit3,
  Cpu,
  RefreshCw,
  Layout,
  Table,
  Presentation,
  Link2,
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Workspace, ProviderType, PinnedArtifact } from '../types/aethos.types';
import { useTheme } from '../context/ThemeContext';
import { useAethos } from '../context/AethosContext';
import { toast } from 'sonner';

// Import New UI Components
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { IconButton } from './ui/IconButton';
import { Modal } from './ui/Modal';

interface ArtifactWizardProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
  editArtifact?: PinnedArtifact | null;
}

export const ArtifactWizard: React.FC<ArtifactWizardProps> = ({ workspace, isOpen, onClose, editArtifact }) => {
  const { isDaylight } = useTheme();
  const { pinToWorkspace, updateWorkspace } = useAethos();
  const [step, setStep] = useState<'source' | 'metadata' | 'permissions' | 'success'>(editArtifact ? 'metadata' : 'source');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    source: editArtifact ? { provider: editArtifact.provider, name: editArtifact.sourceMetadata?.container || 'Unknown' } as any : (workspace.linkedSources[0] || { provider: 'microsoft' as ProviderType, name: 'Default Store' }),
    title: editArtifact?.title || '',
    type: editArtifact?.type || 'document',
    status: editArtifact?.sourceMetadata?.status || 'Draft',
    sensitivity: editArtifact?.sourceMetadata?.sensitivity || 'Internal',
    category: editArtifact?.category || 'reference',
    scope: editArtifact?.permissions?.scope || 'members',
    access: editArtifact?.permissions?.access || 'write'
  });

  const handleInitialize = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    if (editArtifact) {
      const updates = {
        title: formData.title,
        category: formData.category as any,
        permissions: { scope: formData.scope, access: formData.access },
        sourceMetadata: {
          ...editArtifact.sourceMetadata,
          status: formData.status,
          sensitivity: formData.sensitivity,
        }
      };
      // In real app, call context to update artifact in workspace
      updateWorkspace(workspace.id, {
        pinnedItems: workspace.pinnedItems.map(item => item.id === editArtifact.id ? { ...item, ...updates } : item)
      });
    } else {
      const newArtifact: PinnedArtifact = {
        id: `art-${Math.random().toString(36).substr(2, 9)}`,
        type: formData.type,
        title: formData.title,
        provider: formData.source.provider,
        url: '#',
        aethosNote: `Initialized via Aethos Operational Flow. Managed in ${formData.source.name}.`,
        category: formData.category as any,
        pinnedAt: new Date().toISOString(),
        permissions: {
          scope: formData.scope,
          access: formData.access
        },
        sourceMetadata: {
          status: formData.status,
          sensitivity: formData.sensitivity,
          container: formData.source.name
        }
      };
      pinToWorkspace(workspace.id, newArtifact);
    }

    setLoading(false);
    setStep('success');
    toast.success(editArtifact ? "Governance updated." : "Resource initialized.", {
      description: `Changes synced to ${formData.source.provider} source.`
    });
  };

  const reset = () => {
    setStep('source');
    setFormData({
      source: workspace.linkedSources[0] || { provider: 'microsoft' as ProviderType, name: 'Default Store' },
      title: '',
      type: 'document',
      status: 'Draft',
      sensitivity: 'Internal',
      category: 'reference',
      scope: 'members',
      access: 'write'
    });
  };

  if (!isOpen) return null;

  const typeOptions = [
    { label: 'Document', value: 'document', icon: <FileText className="w-4 h-4" /> },
    { label: 'Spreadsheet', value: 'spreadsheet', icon: <Table className="w-4 h-4" /> },
    { label: 'Presentation', value: 'presentation', icon: <Presentation className="w-4 h-4" /> },
    { label: 'External Link', value: 'external-link', icon: <Link2 className="w-4 h-4" /> },
  ];

  const statusOptions = [
    { label: 'Draft', value: 'Draft' },
    { label: 'In Review', value: 'In Review' },
    { label: 'Final', value: 'Final' },
    { label: 'Approved', value: 'Approved' },
  ];

  const sensitivityOptions = [
    { label: 'Public', value: 'Public' },
    { label: 'Internal', value: 'Internal' },
    { label: 'Confidential', value: 'Confidential' },
    { label: 'Highly Confidential', value: 'Highly Confidential' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'success' ? 'Protocol Complete' : editArtifact ? 'Update Governance' : 'Initialize Resource'}
      subtitle="Operational Workspace Deployment"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col min-h-[400px]">
        <AnimatePresence mode="wait">
          {step === 'source' && (
            <motion.div key="source" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Step 1: Select Target Source</h3>
              </div>
              <p className={`text-sm ${isDaylight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed italic`}>
                "Choose where this document will be physically stored. Aethos will manage the bi-directional sync."
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {workspace.linkedSources.map((source, i) => (
                  <button 
                    key={i}
                    onClick={() => { setFormData({ ...formData, source }); setStep('metadata'); }}
                    className={`flex items-center justify-between p-6 rounded-3xl border transition-all text-left group ${
                      formData.source.containerId === source.containerId 
                        ? (isDaylight ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]')
                        : (isDaylight ? 'bg-white border-slate-100 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]')
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl ${isDaylight ? 'bg-slate-800' : 'bg-black/40'}`}>
                        {source.provider === 'microsoft' ? <Share2 className="w-5 h-5 text-blue-500" /> : 
                         source.provider === 'slack' ? <Slack className="w-5 h-5 text-[#E01E5A]" /> : 
                         <Globe className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <div>
                        <p className="font-black text-xs uppercase tracking-tight">{source.name}</p>
                        <p className={`text-[9px] uppercase tracking-widest font-black opacity-60 mt-1`}>{source.provider} • {source.type}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'metadata' && (
            <motion.div key="metadata" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Step 2: Source Metadata</h3>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Resource Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Q1 Marketing Strategy"
                    icon={FileText}
                  />
                  <Select 
                    label="Resource Type"
                    value={formData.type}
                    options={typeOptions}
                    onChange={(v) => setFormData({ ...formData, type: v })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Select 
                    label="Initial Status"
                    value={formData.status}
                    options={statusOptions}
                    onChange={(v) => setFormData({ ...formData, status: v })}
                  />
                  <Select 
                    label="Sensitivity"
                    value={formData.sensitivity}
                    options={sensitivityOptions}
                    onChange={(v) => setFormData({ ...formData, sensitivity: v })}
                  />
                </div>

                <div className={`p-6 rounded-3xl border flex items-start gap-4 ${isDaylight ? 'bg-blue-50 border-blue-100' : 'bg-blue-500/5 border-blue-500/20'}`}>
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-500/80 leading-relaxed font-black uppercase tracking-widest">
                    These fields map directly to **Source Governance Schema**. Making them accurate now ensures "Easy Peasy" searchability across the tenant.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setStep('source')} className="flex-1">Back</Button>
                <Button 
                  disabled={!formData.title}
                  onClick={() => setStep('permissions')} 
                  icon={ChevronRight}
                  iconPosition="right"
                  className="flex-2"
                >
                  Continue to Access
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'permissions' && (
            <motion.div key="permissions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-4 h-4 text-[#00F0FF]" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Step 3: Access Governance</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 block">Who can access this artifact?</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'members', label: 'Workspace Members Only', desc: 'Secure to this specific project team.', icon: Users },
                      { id: 'owners', label: 'Workspace Owners Only', desc: 'Restrict to project leads and architects.', icon: Lock },
                      { id: 'everyone', label: 'Entire Organization', desc: 'Anyone in the M365 tenant can discover.', icon: Globe }
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setFormData({ ...formData, scope: item.id as any })}
                        className={`flex items-center gap-5 p-5 rounded-2xl border transition-all text-left ${
                          formData.scope === item.id 
                            ? (isDaylight ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF]')
                            : (isDaylight ? 'bg-white border-slate-100 hover:border-slate-200' : 'bg-white/5 border-white/5 hover:border-white/10')
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${formData.scope === item.id ? 'bg-white/10' : 'bg-slate-100 dark:bg-white/5'}`}>
                          <item.icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="font-black text-[11px] uppercase tracking-tight">{item.label}</p>
                          <p className={`text-[9px] font-bold opacity-60 mt-0.5 uppercase tracking-widest`}>{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 block">Operation Level</label>
                  <div className="flex gap-4">
                    <Button 
                      variant={formData.access === 'read' ? 'primary' : 'secondary'}
                      onClick={() => setFormData({ ...formData, access: 'read' })}
                      icon={Eye}
                      fullWidth
                    >
                      View Only
                    </Button>
                    <Button 
                      variant={formData.access === 'write' ? 'primary' : 'secondary'}
                      onClick={() => setFormData({ ...formData, access: 'write' })}
                      icon={Edit3}
                      fullWidth
                    >
                      Can Edit
                    </Button>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border flex items-start gap-4 ${isDaylight ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                  <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-emerald-500/80 leading-relaxed font-black uppercase tracking-widest">
                    Aethos will automatically enforce these permissions on **{formData.source.name}**. Changes in Word/Office will write back automatically.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="secondary" onClick={() => setStep('metadata')} className="flex-1">Back</Button>
                <Button 
                  onClick={handleInitialize}
                  isLoading={loading}
                  icon={CheckCircle2}
                  variant="success"
                  className="flex-2"
                >
                  Finalize Protocol
                </Button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-10">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-[#00F0FF]/20 blur-[60px] rounded-full" />
                <div className={`relative w-28 h-28 rounded-full flex items-center justify-center mx-auto border-4 border-[#00F0FF] ${isDaylight ? 'bg-slate-900 shadow-2xl' : 'bg-black shadow-[0_0_30px_rgba(0,240,255,0.3)]'}`}>
                  <CheckCircle2 className="w-14 h-14 text-[#00F0FF]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className={`text-3xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Artifact Active</h3>
                <p className={`text-sm ${isDaylight ? 'text-slate-600' : 'text-slate-400'} leading-relaxed max-w-sm mx-auto font-medium`}>
                  "**{formData.title}** has been deployed to the {formData.source.provider} governance layer. Operation established."
                </p>
              </div>

              <div className={`p-8 rounded-[40px] border text-left flex items-start gap-5 ${isDaylight ? 'bg-slate-50 border-slate-100 shadow-inner' : 'bg-white/5 border-white/5 shadow-inner'}`}>
                <div className="p-3 rounded-2xl bg-white/10">
                  <Cpu className="w-6 h-6 text-[#00F0FF]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Operational ID Hash</p>
                  <p className={`text-[13px] font-mono font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{Math.random().toString(36).substr(2, 16).toUpperCase()}</p>
                </div>
              </div>

              <Button 
                onClick={() => { reset(); onClose(); }}
                variant="primary"
                fullWidth
                size="lg"
              >
                Return to Workspace Engine
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
