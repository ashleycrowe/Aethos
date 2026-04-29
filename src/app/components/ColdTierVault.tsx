import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Archive, 
  Trash2, 
  History,
  Database,
  Globe,
  Slack,
  Box,
  HardDrive,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { OperationalGrid, GridColumn } from './ui/OperationalGrid';

import { Modal } from './ui/Modal';

interface ArchivedArtifact {
  id: string;
  name: string;
  size: string;
  archivedDate: string;
  daysRemaining: number;
  savings: string;
  provider: 'microsoft' | 'slack' | 'google' | 'box';
  status: 'cold' | 'vault' | 'soft-delete';
}

const filterCategories = [
  {
    id: 'provider',
    label: 'Architecture Provider',
    options: [
      { label: 'Microsoft 365', value: 'microsoft' },
      { label: 'Slack Enterprise', value: 'slack' },
      { label: 'Google Workspace', value: 'google' },
      { label: 'Box Governance', value: 'box' },
    ]
  },
  {
    id: 'status',
    label: 'Operational Status',
    options: [
      { label: 'Cold Tier', value: 'cold' },
      { label: 'Vaulted', value: 'vault' },
      { label: 'Soft Delete', value: 'soft-delete' },
    ]
  }
];

export const ColdTierVault = () => {
  const { isDaylight } = useTheme();
  const [isPurging, setIsPurging] = useState(false);
  const [isConfirmingPurge, setIsConfirmingPurge] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<ArchivedArtifact | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const [artifacts, setArtifacts] = useState<ArchivedArtifact[]>([
    { id: 'v1', name: 'Legacy_Project_Titan_Archive.zip', size: '12.4 GB', archivedDate: '12 days ago', daysRemaining: 18, savings: '$124.00/mo', provider: 'microsoft', status: 'cold' },
    { id: 'v2', name: 'Sales_Records_2022_Internal.csv', size: '4.2 GB', archivedDate: '24 days ago', daysRemaining: 6, savings: '$42.00/mo', provider: 'google', status: 'cold' },
    { id: 'v3', name: '#private-legacy-support-channel', size: '890 MB', archivedDate: '45 days ago', daysRemaining: 0, savings: '$8.90/mo', provider: 'slack', status: 'vault' },
    { id: 'v4', name: 'Board_Meeting_Video_2023.mp4', size: '2.1 GB', archivedDate: '2 days ago', daysRemaining: 28, savings: '$21.00/mo', provider: 'box', status: 'soft-delete' },
    { id: 'v5', name: 'Raw_Asset_Dump_Old.7z', size: '45 GB', archivedDate: '60 days ago', daysRemaining: 0, savings: '$450.00/mo', provider: 'microsoft', status: 'vault' },
  ]);

  const filteredArtifacts = artifacts.filter(art => {
    const providerMatch = !activeFilters.provider?.length || activeFilters.provider.includes(art.provider);
    const statusMatch = !activeFilters.status?.length || activeFilters.status.includes(art.status);
    return providerMatch && statusMatch;
  });

  const columns: GridColumn[] = [
    { key: 'artifact', label: 'Archived Artifact', width: '35%' },
    { key: 'status', label: 'Status', width: '15%', align: 'center' },
    { key: 'archivedDate', label: 'Archived', width: '15%', align: 'center' },
    { key: 'retention', label: 'Retention', width: '20%', align: 'center' },
    { key: 'savings', label: 'ROI Reclaimed', width: '15%', align: 'right' },
  ];

  const totalRecovered = artifacts.reduce((acc, art) => acc + parseFloat(art.savings.replace('$', '')), 0);

  const handleDeepPurge = async () => {
    if (!selectedArtifact) return;
    setIsPurging(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setArtifacts(prev => prev.filter(a => a.id !== selectedArtifact.id));
    setIsPurging(false);
    setIsConfirmingPurge(false);
    setSelectedArtifact(null);
    
    toast.error("Deep Purge Executed", {
      description: "Artifact permanently removed from Aethos storage layer."
    });
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'cold': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'vault': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'soft-delete': return 'text-[#FF5733] bg-[#FF5733]/10 border-[#FF5733]/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const renderCell = (artifact: ArchivedArtifact, key: string) => {
    switch (key) {
      case 'artifact':
        return (
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl flex items-center justify-center shrink-0 ${
              isDaylight ? 'bg-slate-100' : 'bg-white/5'
            }`}>
              {artifact.provider === 'microsoft' ? <Globe className="w-5 h-5 text-blue-500" /> :
               artifact.provider === 'slack' ? <Slack className="w-5 h-5 text-[#E01E5A]" /> :
               artifact.provider === 'box' ? <Box className="w-5 h-5 text-blue-400" /> :
               <HardDrive className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <p className={`text-[12px] font-black uppercase tracking-tight mb-1 ${
                isDaylight ? 'text-slate-900' : 'text-white'
              }`}>
                {artifact.name}
              </p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                {artifact.size} • {artifact.provider}
              </p>
            </div>
          </div>
        );
      case 'status':
        return (
          <div className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(artifact.status)}`}>
            {artifact.status}
          </div>
        );
      case 'archivedDate':
        return (
          <span className={`text-[11px] font-black uppercase tracking-widest ${
            isDaylight ? 'text-slate-900' : 'text-slate-400'
          }`}>
            {artifact.archivedDate}
          </span>
        );
      case 'retention':
        return (
          <div className="flex flex-col items-center gap-2">
            <div className={`w-24 h-1.5 rounded-full overflow-hidden ${
              isDaylight ? 'bg-slate-200' : 'bg-slate-800'
            }`}>
              <div 
                className={`h-full transition-all duration-1000 ${
                  artifact.daysRemaining < 7 ? 'bg-[#FF5733]' : 'bg-indigo-500'
                }`}
                style={{ width: `${(artifact.daysRemaining / 30) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {artifact.daysRemaining} days
            </span>
          </div>
        );
      case 'savings':
        return (
          <span className="text-sm font-black text-[#00F0FF] tracking-tighter font-['JetBrains_Mono']">
            {artifact.savings}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Archive, label: 'Total Recovered ROI', value: `$${totalRecovered.toFixed(2)}`, unit: '/mo', desc: 'Monthly storage credits reclaimed across M365, Box, and Google Workspace.', color: 'indigo-500' },
          { icon: Database, label: 'Cold Tier Capacity', value: '64.5', unit: 'GB', desc: 'Compressed metadata storage utilized in the Aethos Governance Vault.', color: '[#00F0FF]' },
          { icon: Trash2, label: 'Awaiting Purge', value: '3', unit: 'Artifacts', desc: 'Soft-gate retention expiring in the next 7 days. Permanent deletion imminent.', color: '[#FF5733]', isAlert: true }
        ].map((stat, idx) => (
          <div key={idx} className={`p-10 rounded-[48px] border transition-all duration-500 ${
            stat.isAlert 
              ? (isDaylight ? 'bg-orange-50/50 border-orange-100 shadow-sm' : 'bg-[#FF5733]/5 border-[#FF5733]/10 shadow-2xl')
              : (isDaylight ? 'bg-white border-slate-100 shadow-xl shadow-slate-200/50' : 'bg-white/[0.03] border-white/5 shadow-2xl')
          }`}>
            <div className="flex items-center gap-5 mb-8">
               <div className={`p-4 rounded-2xl bg-${stat.color}/10 text-${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
               </div>
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${stat.isAlert ? 'text-[#FF5733]' : 'text-slate-500'}`}>
                 {stat.label}
               </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className={`text-5xl font-black font-['JetBrains_Mono'] tracking-tighter ${
                isDaylight ? 'text-slate-900' : 'text-white'
              }`}>
                {stat.value}
              </h3>
              <span className="text-xl font-black text-slate-500 uppercase tracking-widest">{stat.unit}</span>
            </div>
            <p className="text-[12px] text-slate-500 mt-6 leading-relaxed italic font-medium">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Reusable Operational Grid Implementation */}
      <OperationalGrid 
        title="Cold Tier Vault"
        subtitle="Historical ROI & Remediation Log"
        columns={columns}
        data={filteredArtifacts}
        filterCategories={filterCategories}
        onFilterChange={setActiveFilters}
        renderCell={renderCell}
        onRowAction={(item, type) => {
          if (type === 'delete') {
            setSelectedArtifact(item);
            setIsConfirmingPurge(true);
          } else {
            toast.info("Viewing Historical Record", {
              description: `Loading audit trail for ${item.name}...`
            });
          }
        }}
      />

      {/* Deep Purge Confirmation Modal - Using the new Modal Component */}
      <Modal
        isOpen={isConfirmingPurge}
        onClose={() => setIsConfirmingPurge(false)}
        title="Initialize Deep Purge?"
        subtitle="Permanent Data Remediation"
        maxWidth="max-w-xl"
      >
        <div className="space-y-8">
          <div className={`p-8 rounded-3xl border ${
            isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'
          }`}>
            <div className="flex items-center gap-5 mb-6">
              <div className="p-3 rounded-2xl bg-[#FF5733]/20 text-[#FF5733]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "You are about to permanently delete <span className={`${isDaylight ? 'text-slate-900' : 'text-white'} font-bold`}>{selectedArtifact?.name}</span>. This action is irreversible."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setIsConfirmingPurge(false)}
              className={`py-5 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                isDaylight ? 'border-slate-200 text-slate-400 hover:text-slate-900' : 'border-white/10 text-slate-500 hover:text-white'
              }`}
            >
              Abort Protocol
            </button>
            <button 
              onClick={handleDeepPurge}
              disabled={isPurging}
              className="py-5 rounded-2xl bg-[#FF5733] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
            >
              {isPurging ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Purging...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Execute Purge</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
