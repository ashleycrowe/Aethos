import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldAlert, 
  Layers, 
  Database, 
  Globe, 
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Layout,
  Network,
  Activity,
  Radio,
  Target,
  Search,
  AlertTriangle,
  Fingerprint,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';

interface ExposureNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'anchor' | 'leak' | 'ghost';
  risk: 'critical' | 'high' | 'medium' | 'low';
  provider: 'microsoft' | 'google' | 'slack' | 'box';
  connections: string[];
}

const RISK_COLORS = {
  critical: '#FF5733',
  high: '#FF5733',
  medium: '#F59E0B',
  low: '#00F0FF'
};

export const IdentityBlastRadius = () => {
  const { isDaylight } = useTheme();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate dynamic nodes representing the "Topography"
  const nodes: ExposureNode[] = useMemo(() => [
    { id: 'm-anchor', x: 50, y: 50, label: 'Core Executive Tenant', type: 'anchor', risk: 'low', provider: 'microsoft', connections: ['s-leak', 'b-ghost', 'g-leak'] },
    { id: 's-leak', x: 25, y: 30, label: 'Sales External Channel', type: 'leak', risk: 'high', provider: 'slack', connections: ['m-anchor'] },
    { id: 'b-ghost', x: 75, y: 25, label: 'Orphaned Marketing Folder', type: 'ghost', risk: 'critical', provider: 'box', connections: ['m-anchor'] },
    { id: 'g-leak', x: 20, y: 70, label: 'Legacy Roadmap Docs', type: 'leak', risk: 'medium', provider: 'google', connections: ['m-anchor', 'l-local'] },
    { id: 'l-local', x: 80, y: 75, label: 'Local Backup Blob', type: 'ghost', risk: 'high', provider: 'google', connections: ['g-leak'] },
    { id: 'p-partner', x: 60, y: 15, label: 'Partner Guest identity', type: 'leak', risk: 'critical', provider: 'microsoft', connections: ['m-anchor'] }
  ], []);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const triggerSimulation = () => {
    setSimulationActive(true);
    toast.info("Initializing Exposure Simulation", {
      description: "Tracing metadata leakage paths across universal adapters."
    });
    setTimeout(() => {
      setSimulationActive(false);
      toast.success("Simulation Complete", {
        description: "3 High-risk critical paths identified."
      });
    }, 3000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Narrative */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FF5733]/10 text-[#FF5733]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Identity Risk Surface</h2>
          </div>
          <h1 className={`text-6xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            Blast <span className="text-[#FF5733]">Radius</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl">
            Visualizing the "Topography of Exposure." See how a single orphaned container or guest identity impacts the integrity of your core Operational Anchors.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={triggerSimulation}
            disabled={simulationActive}
            className={`px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl ${
              simulationActive 
                ? 'bg-white/5 text-slate-500 cursor-not-allowed' 
                : 'bg-[#FF5733] text-white hover:scale-105 shadow-[#FF5733]/20'
            }`}
          >
            {simulationActive ? 'Simulating...' : 'Run Propagation'} <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Topography Map */}
      <GlassCard className="p-0 h-[600px] relative overflow-hidden group border-white/5">
        <div className="absolute inset-0 bg-[#0B0F19]">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          {/* Topography Decorative Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
            <defs>
              <linearGradient id="leak-flow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF5733" stopOpacity="0" />
                <stop offset="50%" stopColor="#FF5733" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FF5733" stopOpacity="0" />
              </linearGradient>
            </defs>
            {nodes.map(node => node.connections.map(connId => {
              const target = nodes.find(n => n.id === connId);
              if (!target) return null;
              return (
                <Motion.line
                  key={`${node.id}-${connId}`}
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={simulationActive ? 'url(#leak-flow)' : 'rgba(255, 255, 255, 0.1)'}
                  strokeWidth={simulationActive ? 2 : 1}
                  strokeDasharray={simulationActive ? "10,10" : "none"}
                  animate={simulationActive ? { strokeDashoffset: -100 } : {}}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
              );
            }))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <div 
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <button
                onClick={() => setSelectedNodeId(node.id)}
                className="relative group/node"
              >
                {/* Node Outer Ring */}
                <Motion.div 
                  animate={simulationActive && node.risk === 'critical' ? { scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-[-20px] rounded-full border border-white/5 opacity-0 group-hover/node:opacity-100 transition-opacity" 
                />
                
                {/* Impact Ripple */}
                {selectedNodeId === node.id && (
                  <div className="absolute inset-[-40px] rounded-full border border-[#FF5733]/20 animate-ping pointer-events-none" />
                )}

                {/* Core Node */}
                <div 
                  className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 transition-all duration-500 ${
                    selectedNodeId === node.id ? 'scale-150 border-white' : 'border-black/50 hover:scale-125'
                  }`}
                  style={{ backgroundColor: RISK_COLORS[node.risk] }}
                />

                {/* Node Label */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none">
                  <div className="px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-white/10 shadow-2xl">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</p>
                    <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{node.risk} Risk · {node.provider}</p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Floating Detail Panel (Context Layer) */}
        <AnimatePresence>
          {selectedNode && (
            <Motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-8 right-8 w-80 z-20"
            >
              <GlassCard className="p-8 bg-[#0B0F19]/90 border-[#FF5733]/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Fingerprint className="w-5 h-5 text-[#00F0FF]" />
                  </div>
                  <button onClick={() => setSelectedNodeId(null)} className="text-slate-500 hover:text-white transition-colors">
                    <Layout className="w-4 h-4 rotate-45" />
                  </button>
                </div>

                <div className="space-y-2 mb-8">
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">{selectedNode.label}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: RISK_COLORS[selectedNode.risk] }}>{selectedNode.risk} EXPOSURE</span>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{selectedNode.provider}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Propagation Depth</span>
                      <span className="text-[10px] font-black text-[#FF5733]">Lvl 4</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF5733]" style={{ width: '75%' }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Impact Narrative</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      "This {selectedNode.type} node creates a high-velocity breach path to the Core Executive Tenant via the {selectedNode.provider} universal adapter."
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <button className="w-full py-4 rounded-xl bg-[#FF5733] text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                    Initialize Remediation
                  </button>
                </div>
              </GlassCard>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Legend Overlay */}
        <div className="absolute bottom-8 left-8 flex items-center gap-8 p-4 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00F0FF]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Anchor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Leak Vector</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#FF5733]" />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Ghost Exposure</span>
          </div>
        </div>
      </GlassCard>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Vectors', value: '42', icon: Network, color: '#00F0FF' },
          { label: 'Critical Paths', value: '03', icon: AlertTriangle, color: '#FF5733' },
          { label: 'Cross-Tenant Leakage', value: '14%', icon: Globe, color: '#A855F7' },
          { label: 'Integrity Score', value: '84', icon: ShieldCheck, color: '#10B981' }
        ].map((metric, i) => (
          <GlassCard key={i} className="p-8 border-white/5 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{metric.value}</span>
                {metric.label === 'Integrity Score' && <span className="text-[10px] font-black text-slate-500">/100</span>}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{metric.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Exposure Deep Dive (Universal Forensic Lab Link) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GlassCard className="p-10 lg:col-span-2 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5733]/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-[#FF5733]/10 transition-all duration-700" />
          
          <div className="space-y-6 relative z-10">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Deconstruct Exposure Paths</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              Every identified risk vector is indexed in the Universal Forensic Lab. Launch a deep-dive audit to identify the exact metadata pointers creating these exposure paths.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Audit All Artifacts
              </button>
              <button className="px-6 py-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] text-[10px] font-black uppercase tracking-widest hover:bg-[#00F0FF]/20 transition-all">
                View Forensics
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-10 border-t-4 border-t-[#00F0FF] space-y-8">
          <div className="flex items-center gap-4">
            <Info className="w-5 h-5 text-[#00F0FF]" />
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Operational Insight</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            "Your Identity Blast Radius is currently concentrated in legacy Box containers. Synchronizing these to the Cold Tier Vault would reduce your total exposure by 42%."
          </p>
          <div className="pt-4 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Source: Oracle Engine</span>
            <ArrowUpRight className="w-4 h-4 text-[#00F0FF]" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
