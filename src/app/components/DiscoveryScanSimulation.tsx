/**
 * Discovery Scan Simulation Component
 * 
 * PURPOSE: Simulates a realistic Microsoft 365 metadata discovery scan
 * for demo purposes. Shows progress, found items, and completion.
 * 
 * V1 DEMO: M365 only (SharePoint, OneDrive, Teams)
 * V2 DEMO: Add Slack, Google Workspace
 */

import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Loader2, 
  CheckCircle2, 
  Database,
  FileText,
  Users,
  Folder,
  AlertTriangle,
  TrendingUp,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useVersion } from '../context/VersionContext';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { runDiscoveryScan, type DiscoveryScanResponse } from '@/lib/api';

type ScanStage = 'idle' | 'scanning' | 'complete';
type ScanStep = 'sharepoint' | 'onedrive' | 'teams' | 'analyzing' | 'done';

interface ScanProgress {
  step: ScanStep;
  label: string;
  found: number;
  progress: number;
}

export const DiscoveryScanSimulation: React.FC = () => {
  const { isDaylight } = useTheme();
  const { version, isDemoMode } = useVersion();
  const { isAuthenticated, getAccessToken } = useAuth();
  const [scanStage, setScanStage] = useState<ScanStage>('idle');
  const [currentStep, setCurrentStep] = useState<ScanStep>('sharepoint');
  const [progress, setProgress] = useState(0);
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [liveScanResult, setLiveScanResult] = useState<DiscoveryScanResponse | null>(null);
  const [foundItems, setFoundItems] = useState({
    files: 0,
    sites: 0,
    waste: 0,
    exposure: 0,
  });

  const scanSteps: ScanProgress[] = [
    { step: 'sharepoint', label: 'Scanning SharePoint Sites', found: 0, progress: 0 },
    { step: 'onedrive', label: 'Scanning OneDrive Storage', found: 0, progress: 0 },
    { step: 'teams', label: 'Scanning Teams Files', found: 0, progress: 0 },
    { step: 'analyzing', label: 'Analyzing Metadata', found: 0, progress: 0 },
    { step: 'done', label: 'Scan Complete', found: 0, progress: 100 },
  ];

  const startScan = async () => {
    setScanStage('scanning');
    setProgress(0);
    setFoundItems({ files: 0, sites: 0, waste: 0, exposure: 0 });
    toast.info('Discovery scan initiated', {
      description: 'Connecting to Microsoft 365 tenant...'
    });

    // Simulate scanning stages
    const stages = ['sharepoint', 'onedrive', 'teams', 'analyzing', 'done'] as ScanStep[];
    
    for (let i = 0; i < stages.length; i++) {
      setCurrentStep(stages[i]);
      
      // Simulate progress for this step
      const stepDuration = stages[i] === 'analyzing' ? 2000 : 3000;
      const steps = 20;
      const stepProgress = 100 / stages.length;
      
      for (let j = 0; j <= steps; j++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration / steps));
        setProgress((i * stepProgress) + (j / steps) * stepProgress);
        
        // Simulate finding items
        if (stages[i] === 'sharepoint' && j % 3 === 0) {
          setFoundItems(prev => ({
            ...prev,
            sites: prev.sites + Math.floor(Math.random() * 5) + 1,
            files: prev.files + Math.floor(Math.random() * 50) + 10,
          }));
        }
        if (stages[i] === 'onedrive' && j % 3 === 0) {
          setFoundItems(prev => ({
            ...prev,
            files: prev.files + Math.floor(Math.random() * 80) + 20,
            waste: prev.waste + Math.floor(Math.random() * 10) + 2,
          }));
        }
        if (stages[i] === 'teams' && j % 3 === 0) {
          setFoundItems(prev => ({
            ...prev,
            files: prev.files + Math.floor(Math.random() * 60) + 15,
            exposure: prev.exposure + Math.floor(Math.random() * 5) + 1,
          }));
        }
      }
    }

    setScanStage('complete');
    toast.success('Discovery scan complete!', {
      description: `Found ${foundItems.files} files across ${foundItems.sites} sites`
    });
  };

  const resetScan = () => {
    setScanStage('idle');
    setProgress(0);
    setCurrentStep('sharepoint');
    setFoundItems({ files: 0, sites: 0, waste: 0, exposure: 0 });
  };

  const startLiveScan = async () => {
    try {
      setIsLiveScanning(true);
      setLiveScanResult(null);
      const token = await getAccessToken();
      if (!token) {
        toast.error('Microsoft session required', {
          description: 'Sign in again before running discovery.',
        });
        return;
      }

      const result = await runDiscoveryScan({ accessToken: token, scanType: 'full' });
      setLiveScanResult(result);
      toast.success('Live discovery scan complete', {
        description: `${result.results.totalFiles.toLocaleString()} files found across ${result.results.totalSites.toLocaleString()} sites.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Discovery scan failed';
      toast.error('Live discovery scan failed', { description: message });
    } finally {
      setIsLiveScanning(false);
    }
  };

  if (!isDemoMode) {
    return (
      <GlassCard className="p-5 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">
              Discovery Engine
            </h3>
            <h2 className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              Microsoft 365 Live Scan
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Live Mode uses your signed-in Microsoft tenant. If your OneDrive or SharePoint has little
              content, Aethos should show little or no content too.
            </p>
          </div>

          <button
            type="button"
            onClick={startLiveScan}
            disabled={!isAuthenticated || isLiveScanning}
            className="flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[#00F0FF] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#0B0F19] shadow-[0_0_30px_rgba(0,240,255,0.25)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLiveScanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
            {isLiveScanning ? 'Scanning Tenant' : 'Run Live Discovery'}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: 'Files Found', value: liveScanResult?.results.totalFiles ?? 0, icon: FileText, color: '#00F0FF' },
            { label: 'Sites/Teams', value: liveScanResult?.results.totalSites ?? 0, icon: Database, color: '#A855F7' },
            { label: 'New Indexed', value: liveScanResult?.results.newFiles ?? 0, icon: TrendingUp, color: '#10B981' },
            { label: 'Errors', value: liveScanResult?.results.errors ?? 0, icon: AlertTriangle, color: '#FF5733' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <metric.icon className="mb-2 h-5 w-5" style={{ color: metric.color }} />
              <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                {metric.value.toLocaleString()}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {!liveScanResult && !isLiveScanning && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
            No live scan has been run in this browser session. Run discovery from here or Admin before
            expecting Search, Intelligence, Workspace, or Remediation to show tenant-specific data.
          </div>
        )}
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">
              Discovery Engine
            </h3>
            <h2 className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
              {version === 'V1' || version === 'V1.5' ? 'Microsoft 365' : 'Multi-Provider'} Scan
            </h2>
          </div>
          
          {scanStage === 'idle' && (
            <button 
              onClick={startScan}
              className="px-6 py-3 rounded-xl bg-[#00F0FF] text-[#0B0F19] font-black text-sm uppercase tracking-widest hover:bg-[#00F0FF]/90 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(0,240,255,0.3)]"
            >
              <Play className="w-5 h-5" />
              Run Discovery Scan
            </button>
          )}

          {scanStage === 'complete' && (
            <button 
              onClick={resetScan}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
            >
              <X className="w-5 h-5" />
              Reset
            </button>
          )}
        </div>

        {/* Scan Progress */}
        <AnimatePresence mode="wait">
          {scanStage === 'scanning' && (
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={isDaylight ? 'text-slate-900' : 'text-white'}>
                    {scanSteps.find(s => s.step === currentStep)?.label}
                  </span>
                  <span className="text-[#00F0FF] font-black">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <Motion.div 
                    className="h-full bg-gradient-to-r from-[#00F0FF] to-[#0080FF] shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Current Activity */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20">
                <Loader2 className="w-5 h-5 text-[#00F0FF] animate-spin" />
                <div className="flex-1">
                  <p className={`text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {currentStep === 'sharepoint' && 'Indexing SharePoint sites and document libraries...'}
                    {currentStep === 'onedrive' && 'Scanning OneDrive personal storage...'}
                    {currentStep === 'teams' && 'Discovering Teams channels and shared files...'}
                    {currentStep === 'analyzing' && 'Applying AI metadata enrichment...'}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">
                    {foundItems.files.toLocaleString()} files discovered
                  </p>
                </div>
              </div>

              {/* Live Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <FileText className="w-5 h-5 text-[#00F0FF] mb-2" />
                  <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {foundItems.files.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                    Files Found
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <Database className="w-5 h-5 text-[#A855F7] mb-2" />
                  <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {foundItems.sites}
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                    Sites/Teams
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <AlertTriangle className="w-5 h-5 text-[#FF5733] mb-2" />
                  <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {foundItems.waste}
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                    Waste Items
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <Users className="w-5 h-5 text-[#F59E0B] mb-2" />
                  <p className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {foundItems.exposure}
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                    Exposed Links
                  </p>
                </div>
              </div>
            </Motion.div>
          )}

          {/* Scan Complete */}
          {scanStage === 'complete' && (
            <Motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <Motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </Motion.div>
                  <h3 className={`text-2xl font-black ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    Discovery Complete!
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md">
                    Successfully scanned your {version === 'V1' || version === 'V1.5' ? 'Microsoft 365' : 'multi-provider'} tenant. 
                    Metadata enrichment and intelligence scoring complete.
                  </p>
                </div>
              </div>

              {/* Final Results */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl bg-[#00F0FF]/5 border border-[#00F0FF]/20 text-center">
                  <FileText className="w-6 h-6 text-[#00F0FF] mb-3 mx-auto" />
                  <p className={`text-3xl font-black mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {foundItems.files.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Total Files
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#A855F7]/5 border border-[#A855F7]/20 text-center">
                  <Database className="w-6 h-6 text-[#A855F7] mb-3 mx-auto" />
                  <p className={`text-3xl font-black mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {foundItems.sites}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Sites Indexed
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-[#FF5733]/5 border border-[#FF5733]/20 text-center">
                  <AlertTriangle className="w-6 h-6 text-[#FF5733] mb-3 mx-auto" />
                  <p className={`text-3xl font-black mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    {(foundItems.waste * 42).toFixed(1)} GB
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Waste Detected
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500 mb-3 mx-auto" />
                  <p className={`text-3xl font-black mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                    ${(foundItems.waste * 24).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Recovery Value
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#00F0FF]/5 to-transparent border border-[#00F0FF]/20">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4">
                  Top Recommendations
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#FF5733]/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-[#FF5733]" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        {foundItems.waste} stale items detected
                      </p>
                      <p className="text-xs text-slate-500">
                        Files untouched for 180+ days. Review in Remediation Center.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-[#F59E0B]" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        {foundItems.exposure} external shares found
                      </p>
                      <p className="text-xs text-slate-500">
                        Review sharing permissions for sensitive content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#00F0FF]" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                        {Math.round(foundItems.files * 0.23)} files ready for AI enrichment
                      </p>
                      <p className="text-xs text-slate-500">
                        {version === 'V1' ? 'Upgrade to V1.5 for AI+ metadata tagging.' : 'Run AI enrichment to improve metadata quality.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}

          {/* Idle State */}
          {scanStage === 'idle' && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <Database className="w-16 h-16 text-[#00F0FF] mx-auto mb-6 opacity-50" />
              <h3 className={`text-xl font-black mb-3 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Ready to Scan
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Run a discovery scan to index your {version === 'V1' || version === 'V1.5' ? 'Microsoft 365' : 'multi-provider'} tenant. 
                This simulates what Aethos would discover in a real deployment.
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Metadata-only (no content read)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>~30 second scan time</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>AI enrichment included</span>
                </div>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};
