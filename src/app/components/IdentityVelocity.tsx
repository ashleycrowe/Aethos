import React, { useState, useEffect, forwardRef } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { GlassCard } from './GlassCard';
import { 
  TrendingUp, 
  UserPlus, 
  UserMinus, 
  Zap, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const velocityData = [
  { time: '08:00', active: 1420, risk: 42, new: 5 },
  { time: '10:00', active: 1650, risk: 38, new: 12 },
  { time: '12:00', active: 1890, risk: 35, new: 8 },
  { time: '14:00', active: 1720, risk: 45, new: 15 },
  { time: '16:00', active: 1950, risk: 30, new: 22 },
  { time: '18:00', active: 1580, risk: 32, new: 4 },
  { time: '20:00', active: 1410, risk: 28, new: 2 },
];

const distributionData = [
  { name: 'M365', count: 4200, color: '#0078D4' },
  { name: 'Google', count: 2100, color: '#EA4335' },
  { name: 'Slack', count: 1500, color: '#4A154B' },
  { name: 'Box', count: 800, color: '#0061D5' },
  { name: 'Local', count: 400, color: '#6366F1' },
];

const CustomTooltip = forwardRef<HTMLDivElement, any>(({ active, payload, label, isDaylight }, ref) => {
  if (active && payload && payload.length) {
    return (
      <div ref={ref} className={`border p-5 rounded-2xl backdrop-blur-2xl shadow-2xl ${
        isDaylight ? 'bg-white/90 border-slate-200 shadow-slate-200' : 'bg-[#0B0F19]/90 border-white/10 shadow-black'
      }`}>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className={`text-[11px] font-bold uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{entry.name}:</span>
            <span className="text-[11px] font-black text-[#00F0FF]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

export const IdentityVelocity = () => {
  const { isDaylight } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-10">
      <GlassCard className={`p-10 border relative overflow-hidden ${isDaylight ? 'bg-white border-slate-100' : 'border-white/5'}`}>
        <div className="absolute top-0 right-0 p-10 flex flex-col items-end gap-2">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
            isDaylight ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
          }`}>
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18% Optimization
          </div>
        </div>

        <div className="mb-10">
          <h3 className={`text-2xl font-black uppercase tracking-tight flex items-center gap-4 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            <TrendingUp className="w-6 h-6 text-[#00F0FF]" />
            Provisioning Velocity
          </h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2 leading-relaxed italic">
            "Real-time identity state transitions across the universal graph."
          </p>
        </div>

        <div className="w-full" style={{ position: 'relative', height: '400px', minHeight: '400px', width: '100%', minWidth: 0 }}>
          {mounted && (
            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={velocityData}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={isDaylight ? 0.2 : 0.4}/>
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF5733" stopOpacity={isDaylight ? 0.2 : 0.4}/>
                      <stop offset="95%" stopColor="#FF5733" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDaylight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                    dx={-15}
                  />
                  <Tooltip content={<CustomTooltip isDaylight={isDaylight} />} />
                  <Area 
                    type="monotone" 
                    dataKey="active" 
                    name="Active Nodes"
                    stroke="#00F0FF" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorActive)" 
                    animationDuration={2000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="risk" 
                    name="Risk Exposure"
                    stroke="#FF5733" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorRisk)" 
                    animationDuration={2500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard className={`p-10 border relative overflow-hidden ${isDaylight ? 'bg-white border-slate-100' : 'border-white/5 shadow-2xl shadow-black/20'}`}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className={`text-xs font-black uppercase tracking-[0.4em] ${isDaylight ? 'text-slate-900' : 'text-slate-500'}`}>Universal Adapter Load</h3>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Cross-cloud identity distribution</p>
            </div>
            <div className={`p-3 rounded-xl ${isDaylight ? 'bg-slate-50' : 'bg-white/5'}`}>
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
          </div>
          <div className="w-full" style={{ position: 'relative', height: '300px', minHeight: '300px', width: '100%', minWidth: 0 }}>
            {mounted && (
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={distributionData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                      width={70}
                    />
                    <Tooltip cursor={{ fill: isDaylight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)' }} content={<CustomTooltip isDaylight={isDaylight} />} />
                    <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={24}>
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={isDaylight ? 0.8 : 0.6} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className={`p-10 space-y-8 relative overflow-hidden ${isDaylight ? 'bg-white border-slate-100' : 'border-white/5'}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-black uppercase tracking-[0.4em] ${isDaylight ? 'text-slate-900' : 'text-slate-500'}`}>Velocity Intelligence</h3>
            <div className={`p-2.5 rounded-lg border border-dashed ${isDaylight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-slate-600'}`}>
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Provisioning Spike', value: '+42 Identities', time: 'M365 • 1h ago', icon: UserPlus, color: '#00F0FF' },
              { label: 'Deprovisioning Event', value: '18 Orphans Removed', time: 'Google • 4h ago', icon: UserMinus, color: '#FF5733' },
              { label: 'High Velocity Access', value: '8.2k Operations/min', time: 'Global • Now', icon: Zap, color: isDaylight ? '#ea580c' : '#F59E0B' }
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-300 group ${
                isDaylight ? 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-2xl'
              }`}>
                <div className={`p-4 rounded-2xl transition-all duration-500 ${isDaylight ? 'bg-white shadow-inner' : 'bg-white/5'}`} style={{ color: item.color }}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`text-[11px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{item.label}</p>
                    <span className="text-[10px] font-black text-slate-500 opacity-60 uppercase tracking-widest">{item.time.split(' • ')[1]}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-[#00F0FF] font-black uppercase tracking-widest">{item.value}</p>
                    <div className="w-1 h-1 rounded-full bg-slate-500 opacity-30" />
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.time.split(' • ')[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`p-6 rounded-[32px] border border-dashed text-center ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Full Log Intelligence Visualization</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
