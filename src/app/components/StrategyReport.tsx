import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Target, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Globe, 
  Lock,
  BarChart3,
  Cpu,
  Layers,
  FileText,
  Clock,
  MousePointer2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion as Motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/Button';

export const StrategyReport = () => {
  const { isDaylight } = useTheme();

  const tiers = [
    {
      name: 'Foundation',
      tagline: 'Discovery & Visibility',
      price: '$0',
      period: 'Forever',
      description: 'The "Operational Anchor" for teams starting their clarity journey. High-fidelity visibility without the friction.',
      features: [
        'Voyager Discovery Map (Core)',
        'Tenant-wide Waste Audit',
        'Identity Engine (Limited)',
        'Intelligence Stream (Standard)',
        'Microsoft 365 Core Adapter'
      ],
      color: '#94A3B8',
      cta: 'Start Free Scan',
      recommended: false
    },
    {
      name: 'Governance',
      tagline: 'The Remediation Suite',
      price: '$12',
      period: 'per architect / mo',
      description: 'Advanced protocols for policy enforcement and automated storage recovery. For the "Waste Warrior".',
      features: [
        'Archival Spectrum (Read-Only)',
        'Universal Remediation Logic',
        'Waste Warrior Merit Badges',
        'Shadow Discovery (Box/Google)',
        'Audit-Ready Event Logging'
      ],
      color: '#FF5733',
      cta: 'Secure Governance',
      recommended: false
    },
    {
      name: 'Architect',
      tagline: 'Full Intelligence Layer',
      price: '$28',
      period: 'per architect / mo',
      description: 'The complete Aethos experience. Bridge the gap between data silos and organizational culture.',
      features: [
        'Universal Resource Lattice',
        'Oracle AI Intelligence Engine',
        'Pulse Feed & Engagement Loops',
        'Identity Engine (Full Reconciliation)',
        'Predictive Remediation Protocols'
      ],
      color: '#00F0FF',
      cta: 'Achieve Clarity',
      recommended: true
    }
  ];

  const upsellPaths = [
    {
      trigger: '500GB+ Dead Capital Recovery',
      action: 'Waste Warrior Merit Trigger',
      description: 'Triggered when the architect recovers significant storage, unlocking automated policy enforcement templates.'
    },
    {
      trigger: 'Cross-Platform Identity Decay',
      action: 'Identity Engine Reconciliation',
      description: 'Triggered when the system detects 3+ unlinked personas for the same user across M365 and Slack.'
    },
    {
      trigger: 'Oracle Logic Federation',
      action: 'Intelligence Tier Upsell',
      description: 'Triggered when users perform complex cross-provider searches that require the advanced AI Narrative layer.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32">
      {/* Cinematic Header */}
      <div className="text-center space-y-6 pt-10">
        <Motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-4 ${isDaylight ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white/5 border-white/10 text-[#00F0FF]'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Packaging & Pricing Architecture</span>
        </Motion.div>
        
        <h1 className={`text-6xl font-black uppercase tracking-tighter leading-none ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
          The Path to <span className="text-[#00F0FF]">Operational Clarity</span>
        </h1>
        
        <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
          "Aethos is priced to scale with your architectural maturity. From initial discovery to full intelligence federation."
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <Motion.div 
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-10 rounded-[48px] border flex flex-col relative overflow-hidden group transition-all duration-500 ${
              tier.recommended 
                ? (isDaylight ? 'bg-white border-blue-500 shadow-2xl scale-105 z-10' : 'bg-[#0B0F19] border-[#00F0FF] shadow-[0_0_40px_rgba(0,240,255,0.1)] scale-105 z-10')
                : (isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]')
            }`}
          >
            {tier.recommended && (
              <div className="absolute top-0 right-0 p-8 pt-10 pr-12 opacity-5 pointer-events-none">
                <Target className="w-32 h-32 text-[#00F0FF]" />
              </div>
            )}
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tier.tagline}</span>
                {tier.recommended && (
                  <span className="px-3 py-1 rounded-full bg-[#00F0FF] text-black text-[8px] font-black uppercase tracking-widest">Architect Favorite</span>
                )}
              </div>
              <h2 className={`text-4xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{tier.name}</h2>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{tier.price}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{tier.period}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed italic">{tier.description}</p>
            </div>

            <div className="flex-1 space-y-6 mb-12">
              <div className="h-px w-full bg-slate-200 dark:bg-white/5" />
              <ul className="space-y-4">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-center gap-4 group/item">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all group-hover/item:scale-150 group-hover/item:shadow-[0_0_8px_currentColor]`} style={{ backgroundColor: tier.color }} />
                    <span className={`text-[11px] font-black uppercase tracking-tight ${isDaylight ? 'text-slate-700' : 'text-slate-300'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              variant={tier.recommended ? 'success' : 'secondary'}
              fullWidth
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
            >
              {tier.cta}
            </Button>
          </Motion.div>
        ))}
      </div>

      {/* Strategic Report Section */}
      <div className={`p-12 rounded-[64px] border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className={`text-3xl font-black uppercase tracking-tighter leading-none ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Technical <span className="text-[#FF5733]">Monetization</span> Logic
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                Aethos utilizes a "Value-First" trigger system to ensure upselling occurs at the exact moment of operational necessity.
              </p>
            </div>

            <div className="space-y-6">
              {upsellPaths.map((path, i) => (
                <div key={i} className={`p-6 rounded-[32px] border ${isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trigger: {path.trigger}</span>
                  </div>
                  <h4 className={`text-sm font-black uppercase tracking-tight mb-2 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{path.action}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{path.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className={`text-3xl font-black uppercase tracking-tighter leading-none ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                Operational <span className="text-[#00F0FF]">Clarity</span> Outcomes
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
                Our pricing is anchored in measurable efficiency gains. Every dollar spent must recover 3x in architect focus.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
               {[
                 { label: 'Avg. ROI', value: '312%', icon: BarChart3 },
                 { label: 'Time Saved', value: '4.2h/wk', icon: Clock },
                 { label: 'Waste Yield', value: '$4k/mo', icon: TrendingUp },
                 { label: 'Clarity Index', value: '94/100', icon: ShieldCheck },
               ].map(stat => (
                 <div key={stat.label} className={`p-8 rounded-[40px] border flex flex-col items-center text-center space-y-4 ${isDaylight ? 'bg-white border-slate-100 shadow-md' : 'bg-white/[0.03] border-white/10'}`}>
                    <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`text-2xl font-black font-['JetBrains_Mono'] ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{stat.value}</div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                 </div>
               ))}
            </div>

            <div className={`p-8 rounded-[40px] border border-dashed flex items-center gap-6 ${isDaylight ? 'bg-white border-slate-200' : 'bg-white/[0.01] border-white/10'}`}>
               <div className="p-4 rounded-full bg-[#00F0FF]/10">
                  <Cpu className="w-8 h-8 text-[#00F0FF]" />
               </div>
               <div className="flex-1">
                  <h5 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Architectural Support</h5>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Dedicated Enterprise Architects available for monthly operational strategy reviews.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trial Mechanics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className={`p-12 rounded-[56px] border flex flex-col space-y-8 ${isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-gradient-to-br from-white/[0.05] to-transparent border-white/10 shadow-2xl'}`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <MousePointer2 className="w-6 h-6" />
              </div>
              <h3 className={`text-2xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>The "First Click" Trial</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
              "We don't do traditional time-based trials. We do action-based trials. Your first 3 workspace creations are on us, with full Oracle AI capabilities unlocked."
            </p>
            <div className="space-y-4">
               {[
                 'Zero credit card required for initial mapping',
                 'Instant waste audit results on connect',
                 'Unlimited team members in "Free" workspaces'
               ].map(item => (
                 <div key={item} className="flex items-center gap-3">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-tight text-slate-400">{item}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className={`p-12 rounded-[56px] border flex flex-col space-y-8 ${isDaylight ? 'bg-white border-slate-100 shadow-xl' : 'bg-gradient-to-br from-[#00F0FF]/5 to-transparent border-white/10 shadow-2xl'}`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className={`text-2xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Reference Pricing Model</h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
              "Our pricing model is designed for flexibility and market validation. Base tier ($499/mo) + AI Add-On ($199/mo) provides a clear value ladder while allowing adjustments based on customer feedback during beta."
            </p>
            <div className="flex flex-col gap-4">
              <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">Base Tier (Suggested)</span>
                 <div className={`text-xl font-black uppercase mt-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>$499 / month per tenant</div>
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Discovery • Workspaces • Oracle Metadata Intelligence</p>
              </div>
              <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5733]">AI+ Add-On (Suggested)</span>
                 <div className={`text-xl font-black uppercase mt-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>+$199 / month</div>
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Content Reading • Semantic Search • Summarization</p>
              </div>
            </div>
         </div>
      </div>

      {/* Future Growth Path */}
      <div className={`p-8 rounded-3xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className={`text-2xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Future Expansion</h3>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed font-medium italic">
          "As we validate product-market fit with SMB customers (500-2,000 employees), we'll expand into enterprise tiers with custom pricing, white-glove service, and dedicated support. Focus for v1: nail the core product, defer complexity."
        </p>
        <div className="flex flex-col gap-4 mt-6">
          <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
             <span className="text-[10px] font-black uppercase tracking-widest text-[#00F0FF]">v1.1+ Enterprise Tier</span>
             <div className={`text-xl font-black uppercase mt-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>Custom Pricing</div>
             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Negotiated Deals • White-Glove Service • Deferred to Post-MVP</p>
          </div>
        </div>
      </div>
    </div>
  );
};