import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { 
  ShieldCheck, 
  Zap, 
  Database, 
  ArrowRight, 
  CircleCheck, 
  Loader2, 
  Info, 
  Globe, 
  Slack, 
  Box as BoxIcon, 
  HardDrive, 
  Share2,
  Lock,
  Cpu,
  Activity,
  ChevronRight,
  ShieldAlert,
  Server,
  Cloud,
  X
} from 'lucide-react';
import { ProviderType } from '../types/aethos.types';
import { useAethos } from '../context/AethosContext';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from './ui/use-mobile';

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: () => void;
}

const steps = [
  {
    id: 'intro',
    title: "Operational Clarity",
    description: "Welcome to Aethos. We are initializing your Enterprise Intelligence Layer—a precision overlay for the multi-cloud era.",
    icon: <Zap className="w-6 md:w-8 h-6 md:h-8 text-[#00F0FF]" />,
  },
  {
    id: 'adapters',
    title: "Deploy Adapters",
    description: "Select the providers you wish to audit. Aethos uses the Universal Adapter Pattern to map metadata across disparate silos.",
    icon: <Cpu className="w-6 md:w-8 h-6 md:h-8 text-[#00F0FF]" />,
  },
  {
    id: 'discovery',
    title: "The Metadata MRI",
    description: "Our engine is currently indexing your constellation. Mapping orphaned containers, version bloat, and exposure vectors.",
    icon: <Activity className="w-6 md:w-8 h-6 md:h-8 text-[#FF5733]" />,
  },
  {
    id: 'finish',
    title: "Protocol Established",
    description: "Intelligence adapters are live. You are now the Operational Architect of your enterprise data sprawl.",
    icon: <ShieldCheck className="w-6 md:w-8 h-6 md:h-8 text-[#00F0FF]" />,
  }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ isOpen, onComplete }) => {
  const { addConnector, state } = useAethos();
  const { isDaylight } = useTheme();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProviders, setSelectedProviders] = useState<Set<ProviderType>>(new Set(['microsoft']));
  
  const providers: { type: ProviderType, name: string, icon: any, desc: string }[] = [
    { type: 'microsoft', name: 'Microsoft 365', icon: Share2, desc: 'SharePoint, Teams' },
    { type: 'google', name: 'Google Workspace', icon: Globe, desc: 'Drive, Spaces' },
    { type: 'slack', name: 'Slack Enterprise', icon: Slack, desc: 'Channels, Direct' },
    { type: 'box', name: 'Box.com', icon: BoxIcon, desc: 'Content Mgmt' },
    { type: 'local', name: 'Private Storage', icon: HardDrive, desc: 'Buckets' },
  ];

  const handleNext = () => {
    if (currentStep === 1) {
      runDiscovery();
    } else if (currentStep === steps.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const toggleProvider = (type: ProviderType) => {
    const newSet = new Set(selectedProviders);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedProviders(newSet);
  };

  const [discoveryLogs, setDiscoveryLogs] = useState<{id: string, message: string}[]>([]);
  const discoveryIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (discoveryIntervalRef.current) clearInterval(discoveryIntervalRef.current);
    };
  }, []);

  const runDiscovery = () => {
    setIsProcessing(true);
    setCurrentStep(2);
    
    const possibleLogs = [
      "Mapping SharePoint Sites...",
      "Crawling Google Drive...",
      "Analyzing Slack...",
      "Calculating Box entropy...",
      "Identifying bloat...",
      "Flagging orphaned pointers...",
      "Constructing star-map...",
      "Synchronizing Adapters...",
      "Optimizing scores...",
      "Finalizing overlay..."
    ];

    let p = 0;
    let logIndex = 0;
    
    if (discoveryIntervalRef.current) clearInterval(discoveryIntervalRef.current);
    
    discoveryIntervalRef.current = setInterval(() => {
      p += Math.random() * 8;
      
      if (Math.random() < 0.3 && logIndex < possibleLogs.length) {
        setDiscoveryLogs(prev => [
          { id: `log-${logIndex}-${Date.now()}`, message: possibleLogs[logIndex] }, 
          ...prev
        ].slice(0, 3));
        logIndex++;
      }

      if (p >= 100) {
        p = 100;
        if (discoveryIntervalRef.current) clearInterval(discoveryIntervalRef.current);
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStep(3);
        }, 1200);
      }
      setProgress(p);
    }, 400);

    selectedProviders.forEach(p => {
      if (!state.connectors.find(c => c.provider === p)) {
        addConnector({
          provider: p,
          name: `${p.charAt(0).toUpperCase() + p.slice(1)} Adapter`,
          status: 'connected',
          lastScan: new Date().toISOString(),
          accountEmail: `architect@enterprise-${p}.com`
        });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-3xl overflow-hidden transition-colors duration-700 p-0 md:p-6 ${
      isDaylight ? 'bg-slate-100/90' : 'bg-[#0B0F19]/95'
    }`}>
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] blur-[150px] rounded-full animate-pulse ${
          isDaylight ? 'bg-blue-200/20' : 'bg-[#00F0FF]/10'
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] blur-[150px] rounded-full animate-pulse ${
          isDaylight ? 'bg-orange-200/20' : 'bg-[#FF5733]/10'
        }`} style={{ animationDelay: '1s' }} />
      </div>

      <Motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-4xl px-4 md:px-8 relative z-10 h-full md:h-auto overflow-hidden flex items-center justify-center"
      >
        <GlassCard className={`p-6 md:p-12 border shadow-2xl overflow-y-auto max-h-full md:max-h-[90vh] custom-scrollbar ${
          isDaylight ? 'bg-white border-slate-200' : 'border-white/10'
        }`}>
          <AnimatePresence mode="wait">
            <Motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                <div className={`w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-2xl md:rounded-3xl border flex items-center justify-center relative ${
                  isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                }`}>
                  <div className={`absolute inset-0 animate-pulse rounded-2xl md:rounded-3xl ${
                    isDaylight ? 'bg-blue-400/5' : 'bg-[#00F0FF]/5'
                  }`} />
                  {isProcessing ? <Loader2 className={`w-6 h-6 md:w-10 md:h-10 animate-spin ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} /> : steps[currentStep].icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] ${
                      isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'
                    }`}>Initialization</span>
                    <div className={`h-[1px] w-8 md:w-12 ${isDaylight ? 'bg-blue-600/30' : 'bg-[#00F0FF]/30'}`} />
                  </div>
                  <h2 className={`text-xl md:text-4xl font-black font-['Space_Grotesk'] uppercase tracking-tight leading-none ${
                    isDaylight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {steps[currentStep].title}
                  </h2>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-grow">
                <p className={`text-sm md:text-lg mb-8 md:mb-10 max-w-2xl leading-relaxed font-['Inter'] ${
                  isDaylight ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  {steps[currentStep].description}
                </p>

                {/* Step 1: Adapter Selection */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
                    {providers.map(p => {
                      const Icon = p.icon;
                      const isSelected = selectedProviders.has(p.type);
                      return (
                        <div 
                          key={p.type}
                          onClick={() => toggleProvider(p.type)}
                          className={`group p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected 
                            ? (isDaylight ? 'bg-blue-50 border-blue-600 shadow-xl shadow-blue-100' : 'bg-[#00F0FF]/10 border-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.1)]')
                            : (isDaylight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-white/5 border-white/5 hover:border-white/20')
                          }`}
                        >
                          <div className={`p-2 md:p-3 rounded-lg md:rounded-xl w-fit mb-3 transition-colors ${
                            isSelected 
                              ? (isDaylight ? 'bg-blue-600 text-white' : 'bg-[#00F0FF] text-black') 
                              : (isDaylight ? 'bg-slate-200 text-slate-500 group-hover:text-slate-900' : 'bg-white/5 text-slate-500 group-hover:text-white')
                          }`}>
                            <Icon className="w-4 md:w-5 h-4 md:h-5" />
                          </div>
                          <h4 className={`font-bold font-['Space_Grotesk'] uppercase text-xs mb-1 ${
                            isSelected 
                              ? (isDaylight ? 'text-slate-900' : 'text-white') 
                              : (isDaylight ? 'text-slate-500' : 'text-slate-300')
                          }`}>{p.name}</h4>
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-tight">{p.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Discovery Progress */}
                {isProcessing && (
                  <div className="space-y-6 md:space-y-8 mb-8 md:mb-10">
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ${
                          isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'
                        }`}>Construction</span>
                        <span className={`text-xl md:text-2xl font-black font-['JetBrains_Mono'] ${
                          isDaylight ? 'text-slate-900' : 'text-white'
                        }`}>{Math.round(progress)}%</span>
                      </div>
                      <div className={`w-full h-1.5 md:h-2 rounded-full overflow-hidden ${
                        isDaylight ? 'bg-slate-100' : 'bg-white/5'
                      }`}>
                        <Motion.div 
                          className={`h-full bg-linear-to-r from-[#00F0FF] to-[#7000FF] ${
                            isDaylight ? 'shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className={`p-3 md:p-4 rounded-xl border flex items-center gap-3 md:gap-4 ${
                        isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'
                      }`}>
                        <Database className="w-4 md:w-5 h-4 md:h-5 text-[#FF5733] shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate">Found</span>
                          <span className={`text-xs md:text-base font-['JetBrains_Mono'] font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{Math.floor(progress * 1.4)}</span>
                        </div>
                      </div>
                      <div className={`p-3 md:p-4 rounded-xl border flex items-center gap-3 md:gap-4 ${
                        isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
                      }`}>
                        <Activity className={`w-4 md:w-5 h-4 md:h-5 shrink-0 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate">Streams</span>
                          <span className={`text-xs md:text-base font-['JetBrains_Mono'] font-bold ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{Math.floor(progress * 8)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2 mt-6 md:mt-8">
                      <AnimatePresence mode="popLayout">
                        {discoveryLogs.map((log, i) => (
                          <Motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1 - i * 0.3, x: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 md:gap-3"
                          >
                            <div className={`w-1 h-1 rounded-full shrink-0 ${isDaylight ? 'bg-blue-600' : 'bg-[#00F0FF]'}`} />
                            <span className="text-[8px] md:text-[10px] font-['JetBrains_Mono'] uppercase tracking-widest text-slate-500 truncate">{log.message}</span>
                          </Motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Step 3: Success State */}
                {currentStep === 3 && (
                  <div className={`border rounded-2xl md:rounded-3xl p-6 md:p-8 mb-8 md:mb-10 flex flex-col sm:flex-row items-center gap-6 md:gap-8 ${
                    isDaylight ? 'bg-blue-50 border-blue-200' : 'bg-[#00F0FF]/5 border-[#00F0FF]/20'
                  }`}>
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center shrink-0 ${
                      isDaylight ? 'border-blue-600 shadow-xl shadow-blue-100' : 'border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                    }`}>
                      <CircleCheck className={`w-10 h-10 md:w-12 md:h-12 ${isDaylight ? 'text-blue-600' : 'text-[#00F0FF]'}`} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h4 className={`text-lg md:text-xl font-black font-['Space_Grotesk'] uppercase tracking-tight mb-2 ${
                        isDaylight ? 'text-slate-900' : 'text-white'
                      }`}>Protocol Active</h4>
                      <p className={`text-[10px] md:text-sm leading-relaxed max-w-md ${
                        isDaylight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Adapters synchronized. Source-agnostic operational layer established.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer / Actions */}
              <div className={`flex items-center justify-between mt-auto pt-6 md:pt-8 border-t ${
                isDaylight ? 'border-slate-100' : 'border-white/5'
              }`}>
                <div className="flex gap-1.5 md:gap-2">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === currentStep 
                          ? 'w-8 md:w-12 bg-blue-600' 
                          : i < currentStep 
                            ? 'w-3 md:w-4 bg-blue-600/40' 
                            : 'w-3 md:w-4 bg-white/10'
                      }`} 
                    />
                  ))}
                </div>

                {!isProcessing && (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 1 && selectedProviders.size === 0}
                    className={`group flex items-center gap-3 md:gap-4 px-6 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl font-black font-['Space_Grotesk'] uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all ${
                      currentStep === 1 && selectedProviders.size === 0
                      ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                      : (isDaylight ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:scale-[1.05] active:scale-95' : 'bg-[#00F0FF] text-black shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-[1.05] active:scale-95')
                    }`}
                  >
                    <span className="truncate">{currentStep === 0 ? "Begin" : 
                     currentStep === 1 ? "Initialize" : 
                     currentStep === 3 ? "Dashboard" : "Continue"}</span>
                    <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </Motion.div>
          </AnimatePresence>
        </GlassCard>
      </Motion.div>
    </div>
  );
};
