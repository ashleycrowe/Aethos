import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { GlassCard } from './GlassCard';
import { useAethos } from '../context/AethosContext';
import { X, Search, Plus, Trash2, ShieldAlert, Share2, Globe, Slack, Box as BoxIcon, HardDrive, Target, Activity, Cpu, ArrowUpRight, Database } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { ProviderType } from '../types/aethos.types';
import { useSettings } from '../context/SettingsContext';
import { useIsMobile } from './ui/use-mobile';

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  name: string;
  type: string;
  provider: ProviderType;
  isGhost: boolean;
  isCritical: boolean;
  links: string[]; // IDs of connected nodes
}

interface StarMapProps {
  height?: string | number;
  active?: boolean;
  onNodeClick?: (name: string) => void;
  onPinNode?: (node: any) => void;
}

const PROVIDER_COLORS: Record<ProviderType, string> = {
  microsoft: '#00F0FF', // Starlight Cyan
  google: '#34A853',    // Google Green
  slack: '#A855F7',     // Slack Purple
  box: '#0061D5',       // Box Blue
  local: '#64748B'      // Slate
};

export const StarMap: React.FC<StarMapProps> = ({ height = '100%', active = true, onNodeClick, onPinNode }) => {
  const { state } = useAethos();
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [isClustered, setIsClustered] = useState(false);
  const nodesRef = useRef<Node[]>([]);
  
  // Initialize nodes
  const initializeNodes = useCallback(() => {
    const providers: ProviderType[] = ['microsoft', 'google', 'slack', 'box'];
    const count = isMobile ? 40 : 120;
    
    const newNodes: Node[] = Array.from({ length: count }).map((_, i) => {
      const provider = providers[i % providers.length];
      const isGhost = Math.random() > 0.75;
      
      const angle = (providers.indexOf(provider) / providers.length) * Math.PI * 2;
      const radius = isClustered ? 100 + Math.random() * 100 : 100 + Math.random() * 300;
      const spread = isClustered ? 50 : 150;
      
      return {
        id: `node-${i}`,
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * spread,
        y: Math.sin(angle) * radius + (Math.random() - 0.5) * spread,
        vx: 0,
        vy: 0,
        size: isGhost ? Math.random() * 10 + 6 : Math.random() * 6 + 4,
        name: isGhost ? `Waste Cluster ${i}` : `Operational Node ${i}`,
        type: i % 3 === 0 ? 'Site Container' : 'Identity Node',
        provider,
        isGhost,
        isCritical: isGhost && Math.random() > 0.85,
        links: Array.from({ length: Math.floor(Math.random() * 2) + 1 }).map(() => `node-${Math.floor(Math.random() * count)}`)
      };
    });
    
    nodesRef.current = newNodes;
  }, [isMobile, isClustered]);

  useEffect(() => {
    initializeNodes();
  }, [initializeNodes]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Interaction Layer: Global Signal Pulse
    if (state.signalMode) {
      const pulseTime = Date.now() / 1000;
      const pulseRadius = (pulseTime % 2) * 800;
      ctx.strokeStyle = 'rgba(255, 87, 51, 0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw Links
    nodesRef.current.forEach(node => {
      node.links.forEach(linkId => {
        const target = nodesRef.current.find(n => n.id === linkId);
        if (target) {
          const isRelated = selectedNode?.id === node.id || selectedNode?.id === target.id || 
                            hoveredNode?.id === node.id || hoveredNode?.id === target.id;
          
          let opacity = state.signalMode ? (node.isCritical ? 0.3 : 0.02) : 0.06;
          if (isRelated) opacity = 0.5;

          const color = node.isGhost ? '255, 87, 51' : '0, 240, 255';
          ctx.strokeStyle = `rgba(${color}, ${opacity})`;
          ctx.lineWidth = isRelated ? 1.5 : 0.5;
          ctx.beginPath();
          ctx.moveTo(node.x + centerX, node.y + centerY);
          ctx.lineTo(target.x + centerX, target.y + centerY);
          ctx.stroke();
        }
      });
    });

    // Draw Nodes
    const providers: ProviderType[] = ['microsoft', 'google', 'slack', 'box'];
    nodesRef.current.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      
      // Physics Simulation for Cluster Mode
      if (isClustered) {
        const targetAngle = (providers.indexOf(node.provider) / providers.length) * Math.PI * 2;
        const targetRadius = node.isGhost ? 220 : 120;
        const targetX = Math.cos(targetAngle) * targetRadius;
        const targetY = Math.sin(targetAngle) * targetRadius;
        
        node.x += (targetX - node.x) * 0.05;
        node.y += (targetY - node.y) * 0.05;
      } else {
        // Gentle drift
        node.x += Math.sin(Date.now() / 2000 + parseInt(node.id.split('-')[1])) * 0.1;
        node.y += Math.cos(Date.now() / 2000 + parseInt(node.id.split('-')[1])) * 0.1;
      }

      const drawX = node.x + centerX;
      const drawY = node.y + centerY;

      // Intelligent Color Mapping
      let baseColor = PROVIDER_COLORS[node.provider];
      if (node.isGhost) baseColor = '#FF5733'; // Waste takes visual priority
      
      // Interaction Glow
      if (isSelected || isHovered || (state.signalMode && node.isCritical)) {
        const glowSize = isSelected || isHovered ? 40 : 20;
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowSize);
        const rgb = baseColor.replace('#', '');
        const r = parseInt(rgb.substring(0, 2), 16);
        const g = parseInt(rgb.substring(2, 4), 16);
        const b = parseInt(rgb.substring(4, 6), 16);
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${isHovered ? 0.4 : 0.25})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(drawX, drawY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Hover Halo - Visual Cue for Clickability
        if (isHovered && !isSelected) {
          ctx.strokeStyle = baseColor;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(drawX, drawY, node.size + 12, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Node Body
      ctx.fillStyle = baseColor;
      
      if (state.signalMode && !node.isCritical && !node.isGhost) {
        ctx.globalAlpha = 0.05;
      } else if (selectedNode && !isSelected) {
        ctx.globalAlpha = 0.15;
      } else {
        ctx.globalAlpha = 1;
      }
      
      ctx.beginPath();
      ctx.arc(drawX, drawY, node.size + (isHovered ? 3 : 0), 0, Math.PI * 2);
      ctx.fill();
      
      // Critical Pulse
      if (node.isCritical) {
        const pulse = Math.sin(Date.now() / 200) * 0.5 + 0.5;
        ctx.strokeStyle = '#FF5733';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.size + 8 + (pulse * 4), 0, Math.PI * 2);
        ctx.globalAlpha = 0.3 * pulse;
        ctx.stroke();
      }

      // Architectural ring for selected
      if (isSelected) {
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.size + 10, 0, Math.PI * 2);
        ctx.stroke();
        
        // Internal dot for anchor nodes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(drawX, drawY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    });
  }, [selectedNode, hoveredNode, state.signalMode]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      draw();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Mouse relative to canvas center
    const mouseX = (e.clientX - rect.left) * scaleX - canvas.width / 2;
    const mouseY = (e.clientY - rect.top) * scaleY - canvas.height / 2;

    let found: Node | null = null;
    // Expanded hit area (35px radius) for easier interaction
    nodesRef.current.forEach(node => {
      const dx = node.x - mouseX;
      const dy = node.y - mouseY;
      if (Math.sqrt(dx * dx + dy * dy) < 35) {
        found = node;
      }
    });
    
    if (found !== hoveredNode) {
      setHoveredNode(found);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredNode) {
      setSelectedNode(hoveredNode);
      if (onNodeClick) onNodeClick(hoveredNode.name);
    } else {
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = canvasRef.current.offsetWidth * dpr;
        canvasRef.current.height = canvasRef.current.offsetHeight * dpr;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const providerIcons: Record<ProviderType, any> = {
    microsoft: Share2,
    google: Globe,
    slack: Slack,
    box: BoxIcon,
    local: HardDrive
  };

  return (
    <div className="w-full h-full relative group/map overflow-hidden" style={{ height }}>
      {/* Top Left Status - Subtle */}
      <div className="absolute top-8 left-10 z-10 pointer-events-none flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {state.signalMode ? (
            <Motion.div 
              key="signal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 py-3 bg-[#FF5733]/10 backdrop-blur-xl rounded-2xl border border-[#FF5733]/30 flex items-center gap-4 pointer-events-auto"
            >
              <ShieldAlert size={16} className="text-[#FF5733] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF5733]">Signal Isolation Mode</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Visualizing Waste Clusters</span>
              </div>
            </Motion.div>
          ) : (
            <Motion.div 
              key="live"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-4 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 pointer-events-auto"
            >
              <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Universal Lattice</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{nodesRef.current.length} Live Metadata Pointers</span>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsClustered(!isClustered)}
          className={`pointer-events-auto px-6 py-3 rounded-2xl border transition-all flex items-center gap-3 group ${isClustered ? 'bg-[#00F0FF] border-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
        >
          <Cpu size={14} className={isClustered ? '' : 'text-[#00F0FF]'} />
          <span className="text-[9px] font-black uppercase tracking-widest">{isClustered ? 'Cluster Mode Active' : 'Enter Cluster Mode'}</span>
        </button>
      </div>

      <canvas 
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        className="w-full h-full cursor-crosshair"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '80px 80px' }} />

      {/* Hover Preview - Real-time feedback */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-30 pointer-events-none px-4 py-2 bg-[#0B0F19]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl flex items-center gap-3"
            style={{ 
              left: hoveredNode.x + (canvasRef.current?.offsetWidth || 0) / 2 + 20, 
              top: hoveredNode.y + (canvasRef.current?.offsetHeight || 0) / 2 - 40 
            }}
          >
            <div className="p-1.5 rounded-lg bg-white/5">
              {React.createElement(providerIcons[hoveredNode.provider], { size: 12, className: "text-[#00F0FF]" })}
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-tight">{hoveredNode.name}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{hoveredNode.provider}</p>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Node Detail Side Panel */}
      <AnimatePresence>
        {selectedNode && (
          <Motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="absolute top-4 right-4 bottom-4 w-96 z-40 pointer-events-auto"
          >
            <GlassCard className={`h-full p-0 flex flex-col border-white/10 bg-[#0B0F19]/95 shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl rounded-[40px] overflow-hidden ${selectedNode.isCritical ? 'ring-1 ring-[#FF5733]/30' : ''}`}>
               {/* Header */}
               <div className="p-10 border-b border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[selectedNode.provider] }} />
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      {React.createElement(providerIcons[selectedNode.provider], { size: 24, className: "text-[#00F0FF]" })}
                    </div>
                    <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                      <X size={20} className="text-slate-500 hover:text-white" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-none truncate">{selectedNode.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: PROVIDER_COLORS[selectedNode.provider] }}>{selectedNode.provider}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{selectedNode.type}</span>
                    </div>
                  </div>
                  
                  {selectedNode.isCritical && (
                    <div className="mt-8 p-4 bg-[#FF5733]/10 border border-[#FF5733]/30 rounded-2xl flex items-center gap-4">
                       <ShieldAlert size={18} className="text-[#FF5733]" />
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5733]">High-Risk Exposure</span>
                         <span className="text-[8px] font-bold text-[#FF5733]/70 uppercase tracking-widest">Detected external sharing vectors</span>
                       </div>
                    </div>
                  )}
               </div>

               {/* Metrics */}
               <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Metadata Mass</span>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white">{selectedNode.isGhost ? '840' : '4.2'}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedNode.isGhost ? 'GB' : 'PB'}</span>
                       </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                       <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Node Sync</span>
                       <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-white">99</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">%</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 flex items-center gap-2">
                       <Database size={12} />
                       Lattice Relational Context
                     </h4>
                     <div className="space-y-3">
                        {[
                          { label: 'Relational Density', value: `${selectedNode.links.length} Connected Nodes`, icon: Activity },
                          { label: 'Intelligence Tier', value: selectedNode.isGhost ? 'Dead Capital' : 'Anchor Tier', icon: Target },
                          { label: 'Operational ID', value: `AE-LATTICE-${selectedNode.id.toUpperCase()}`, icon: Cpu },
                        ].map((m, i) => (
                          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                             <div className="flex items-center gap-3">
                                <m.icon size={14} className="text-slate-500 group-hover:text-[#00F0FF] transition-colors" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{m.label}</span>
                             </div>
                             <span className="text-[10px] font-black text-white uppercase tracking-tight">{m.value}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-[#00F0FF]/5 border border-[#00F0FF]/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-2 opacity-20">
                       <Target size={40} className="text-[#00F0FF]" />
                     </div>
                     <p className="text-[11px] text-slate-400 leading-relaxed italic relative z-10">
                        "Node identified as a critical architectural anchor for the current workspace cluster. Suggesting high-velocity synchronization."
                     </p>
                  </div>
               </div>

               {/* Action Footer */}
               <div className="p-10 border-t border-white/5 bg-white/[0.02] space-y-3">
                  <button className="w-full py-5 rounded-2xl bg-[#00F0FF] text-[#0B0F19] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#00F0FF]/10 flex items-center justify-center gap-3">
                    Deconstruct Lattice <ArrowUpRight size={16} />
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Sync Status
                    </button>
                    <button className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      selectedNode.isGhost 
                      ? 'bg-[#FF5733] text-white shadow-lg shadow-[#FF5733]/20' 
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                    }`}>
                      {selectedNode.isGhost ? 'Execute Archival' : 'Soft-Gate'}
                    </button>
                  </div>
               </div>
            </GlassCard>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Legend - Detailed & Intelligent */}
      <div className="absolute bottom-8 left-10 flex items-center gap-10 p-5 bg-[#0B0F19]/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl opacity-60 hover:opacity-100 transition-opacity">
         <div className="flex flex-col gap-3">
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Architectural Nodes</span>
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00F0FF]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Microsoft</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#34A853]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Google</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#A855F7]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Slack</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#0061D5]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Box</span>
             </div>
           </div>
         </div>
         <div className="w-px h-10 bg-white/10" />
         <div className="flex flex-col gap-3">
           <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Risk Intelligence</span>
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF5733]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Storage Waste</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#FF5733] animate-pulse shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#FF5733]">Critical Exposure</span>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};
