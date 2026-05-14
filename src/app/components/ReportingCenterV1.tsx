/**
 * Reporting Center V1 - Weekly Discovery Reports
 * 
 * VERSION: V1 (Basic Reports), V3+ (Predictive Analytics)
 * FEATURE FLAGS:
 * - V1: weeklyReports, storageIntelligence
 * - V3: budgetForecasting, executiveDashboard, predictiveAnalytics
 * 
 * V1 SCOPE:
 * - Weekly discovery summary reports
 * - Storage trend visualizations
 * - Waste identification reports
 * - CSV/PDF export
 * - Basic charts (storage over time, waste breakdown)
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  HardDrive, 
  Trash2, 
  TrendingUp,
  TrendingDown,
  FileDown,
  Sparkles,
  Calendar,
  Download,
  Mail,
  Share2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Database
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useVersion, useFeature } from '../context/VersionContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

export const ReportingCenter: React.FC = () => {
  const { isDaylight } = useTheme();
  const { version } = useVersion();
  const hasPredictive = useFeature('budgetForecasting');
  
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('week');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for V1 reports
  const storageOverTime = [
    { date: 'Jan', total: 12.4, waste: 2.1 },
    { date: 'Feb', total: 13.1, waste: 2.4 },
    { date: 'Mar', total: 13.8, waste: 2.6 },
    { date: 'Apr', total: 14.2, waste: 2.8 },
    { date: 'May', total: 14.9, waste: 3.1 },
    { date: 'Jun', total: 15.6, waste: 3.4 },
  ];

  const wasteBreakdown = [
    { name: 'Stale Content', value: 1.2, color: '#F59E0B' },
    { name: 'Orphaned Sites', value: 0.8, color: '#FF5733' },
    { name: 'Duplicate Files', value: 0.6, color: '#EC4899' },
    { name: 'Temp Files', value: 0.4, color: '#8B5CF6' },
    { name: 'Old Backups', value: 0.4, color: '#64748B' },
  ];

  const providerBreakdown = [
    { name: 'SharePoint', value: 6.8, color: '#00F0FF' },
    { name: 'OneDrive', value: 4.2, color: '#10B981' },
    { name: 'Teams', value: 3.6, color: '#8B5CF6' },
    { name: 'Exchange', value: 1.0, color: '#F59E0B' },
  ];

  const topWasteFiles = [
    { name: 'Old Marketing Campaign Archive.zip', size: '847 MB', owner: 'Sarah Chen', lastModified: '240d ago' },
    { name: 'Video Project Renders 2023', size: '1.2 GB', owner: 'Alex Rivera', lastModified: '180d ago' },
    { name: 'Database Backup - Legacy System', size: '645 MB', owner: 'Jordan Lee', lastModified: '320d ago' },
    { name: 'Temp Design Assets', size: '423 MB', owner: 'Marcus Johnson', lastModified: '150d ago' },
    { name: 'Screenshots Archive', size: '312 MB', owner: 'System Admin', lastModified: '210d ago' },
  ];

  const keyMetrics = [
    {
      label: 'Total Storage',
      value: '15.6 TB',
      change: '+7.2%',
      positive: false,
      icon: Database,
      color: '#00F0FF'
    },
    {
      label: 'Waste Identified',
      value: '3.4 TB',
      change: '+9.6%',
      positive: false,
      icon: Trash2,
      color: '#FF5733'
    },
    {
      label: 'Stale Content',
      value: '1,247',
      change: '+124',
      positive: false,
      icon: AlertTriangle,
      color: '#F59E0B'
    },
    {
      label: 'Recovery Potential',
      value: '3.4 TB',
      change: '+0.7 TB',
      positive: true,
      icon: TrendingUp,
      color: '#10B981'
    },
  ];

  const handleExportCSV = () => {
    setIsExporting(true);
    
    // Simulate export
    setTimeout(() => {
      const headers = ['File Name', 'Size', 'Owner', 'Last Modified', 'Waste Type'];
      const rows = topWasteFiles.map(f => [
        f.name,
        f.size,
        f.owner,
        f.lastModified,
        'Stale Content'
      ]);
      
      const csvContent = 'data:text/csv;charset=utf-8,' 
        + headers.join(',') + '\n'
        + rows.map(e => e.join(',')).join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Aethos_Waste_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      toast.success('Report exported to CSV', {
        description: 'Waste inventory downloaded successfully',
        duration: 3000
      });
    }, 1000);
  };

  const handleExportPDF = () => {
    toast.info('PDF Export', {
      description: 'PDF export coming soon in V1 final release',
      duration: 3000
    });
  };

  const handleScheduleReport = () => {
    toast.success('Report Scheduled', {
      description: 'Weekly summary will be sent every Monday at 9:00 AM',
      duration: 4000
    });
  };

  return (
    <div className="flex h-full min-w-0 flex-col space-y-6 overflow-x-hidden pb-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
            Intelligence Reporting
          </h2>
        </div>
        <h1 className={`text-3xl font-black uppercase tracking-tight sm:text-4xl ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
          Reporting <span className="text-[#00F0FF]">Center</span>
        </h1>
        <p className="text-xs text-slate-500 italic max-w-3xl">
          {version === 'V1' || version === 'V1.5' 
            ? 'Weekly discovery reports, storage trends, and waste identification analytics for Microsoft 365.'
            : 'Advanced predictive analytics, budget forecasting, and executive intelligence dashboards.'}
        </p>
      </div>

      {/* Period Selector & Actions */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className={`grid w-full grid-cols-2 gap-2 rounded-xl p-1 sm:grid-cols-4 xl:w-auto ${
          isDaylight ? 'bg-slate-100' : 'bg-white/5 border border-white/10'
        }`}>
          {(['week', 'month', 'quarter', 'year'] as ReportPeriod[]).map(period => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`min-h-[44px] rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-tight transition-all ${
                selectedPeriod === period
                  ? 'bg-[#00F0FF] text-black'
                  : isDaylight
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-slate-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
          <button
            onClick={handleScheduleReport}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold uppercase tracking-tight transition-all ${
              isDaylight
                ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <Mail className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold uppercase tracking-tight transition-all ${
              isDaylight
                ? 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={handleExportPDF}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#00F0FF] px-4 py-2 text-sm font-bold uppercase tracking-tight text-black shadow-lg shadow-[#00F0FF]/20 transition-all hover:bg-[#00F0FF]/90"
          >
            <FileDown className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {keyMetrics.map(metric => (
          <GlassCard key={metric.label} className="p-6 relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-white/5">
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                  metric.positive 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {metric.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {metric.change}
                </span>
              </div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 sm:tracking-widest">
                {metric.label}
              </p>
              <p className={`text-3xl font-black tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                {metric.value}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Storage Over Time */}
        <GlassCard className="p-5 sm:p-8">
          <h3 className="mb-6 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
            Storage Trend (Last 6 Months)
            <HardDrive className="w-4 h-4 text-[#00F0FF]" />
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={storageOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDaylight ? '#E2E8F0' : '#1E293B'} />
              <XAxis 
                dataKey="date" 
                stroke={isDaylight ? '#64748B' : '#64748B'}
                style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em' }}
              />
              <YAxis 
                stroke={isDaylight ? '#64748B' : '#64748B'}
                style={{ fontSize: '11px', fontWeight: 900 }}
                label={{ value: 'TB', angle: -90, position: 'insideLeft', style: { fill: '#64748B', fontWeight: 900 } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDaylight ? '#FFFFFF' : '#0B0F19', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: 900
                }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#00F0FF" 
                strokeWidth={3}
                name="Total Storage"
                dot={{ fill: '#00F0FF', r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="waste" 
                stroke="#FF5733" 
                strokeWidth={3}
                name="Waste"
                dot={{ fill: '#FF5733', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Waste Breakdown Pie */}
        <GlassCard className="p-5 sm:p-8">
          <h3 className="mb-6 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
            Waste Breakdown by Type
            <Trash2 className="w-4 h-4 text-[#FF5733]" />
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={wasteBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {wasteBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDaylight ? '#FFFFFF' : '#0B0F19', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '12px',
                  fontWeight: 900
                }}
                formatter={(value: any) => `${value} TB`}
              />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Provider Storage Distribution */}
      <GlassCard className="p-5 sm:p-8">
        <h3 className="mb-6 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
          Storage by Provider (Microsoft 365)
          <Database className="w-4 h-4 text-[#00F0FF]" />
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={providerBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDaylight ? '#E2E8F0' : '#1E293B'} />
            <XAxis 
              dataKey="name" 
              stroke={isDaylight ? '#64748B' : '#64748B'}
              style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.05em' }}
            />
            <YAxis 
              stroke={isDaylight ? '#64748B' : '#64748B'}
              style={{ fontSize: '11px', fontWeight: 900 }}
              label={{ value: 'TB', angle: -90, position: 'insideLeft', style: { fill: '#64748B', fontWeight: 900 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDaylight ? '#FFFFFF' : '#0B0F19', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '12px',
                fontWeight: 900
              }}
              formatter={(value: any) => `${value} TB`}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {providerBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Top Waste Files */}
      <GlassCard className="p-5 sm:p-8">
        <h3 className="mb-6 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
          Top Waste Files (Largest Storage Impact)
          <AlertTriangle className="w-4 h-4 text-[#FF5733]" />
        </h3>
        <div className="space-y-3">
          {topWasteFiles.map((file, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl transition-all hover:bg-white/[0.03] ${
                isDaylight ? 'bg-slate-50/50' : 'bg-white/[0.02]'
              }`}
            >
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h4 className={`min-w-0 break-words text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                  {file.name}
                </h4>
                <span className="text-sm font-black text-[#FF5733] sm:ml-4">
                  {file.size}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 sm:gap-4 sm:tracking-widest">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {file.owner}
                </span>
                <span className="hidden sm:inline">-</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {file.lastModified}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Summary Insights */}
      <GlassCard className="p-5 sm:p-8">
        <h3 className="mb-6 flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 sm:tracking-[0.4em]">
          Weekly Summary Insights
          <Sparkles className="w-4 h-4 text-[#00F0FF]" />
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20">
            <AlertTriangle className="w-5 h-5 text-[#FF5733] shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Storage growth accelerating
              </p>
              <p className="text-xs text-slate-500">
                Total storage increased by 7.2% this week (+1.1 TB). Review stale content to reduce waste.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                1,247 stale items detected
              </p>
              <p className="text-xs text-slate-500">
                124 new items haven't been accessed in 180+ days. Consider archival protocols.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className={`text-sm font-bold mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Recovery candidate volume identified
              </p>
              <p className="text-xs text-slate-500">
                Aethos found 3.4 TB of review-ready waste. Configure storage assumptions before showing dollar impact.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
