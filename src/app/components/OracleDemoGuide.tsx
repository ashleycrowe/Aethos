import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Terminal, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight,
  ClipboardList,
  MessageSquare,
  Search,
  Pin,
  Gavel,
  History,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const OracleDemoGuide = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { isDaylight } = useTheme();

  const demoCases = [
    {
      title: "1. Financial ROI Analysis",
      description: "Test the Oracle's ability to synthesize financial impact across multi-cloud anchors.",
      query: "What is our current storage ROI?",
      steps: [
        "Search: 'What is our current storage ROI?'",
        "Observe the synthesis combining M365, Box, and Slack data.",
        "Hover over [1] to see the Source Peek of the PDF report.",
        "Click 'Draft Rule' to automate the recovery of identified waste."
      ]
    },
    {
      title: "2. Security & External Exposure",
      description: "Identify Shadow Leakage and high-risk external sharing patterns.",
      query: "Who has external access to Project Alpha?",
      steps: [
        "Search: 'Who has external access to Project Alpha?'",
        "Identify the 14 external collaborators across 3 domains.",
        "See the 'High Risk' detection for Guest Owners.",
        "Pin this insight to the Project Alpha workspace for tracking."
      ]
    },
    {
      title: "3. Operational HR Journey",
      description: "Demonstrate cross-source knowledge Retrieval for employee onboarding.",
      query: "How does the onboarding process work?",
      steps: [
        "Search: 'How does the onboarding process work?'",
        "The Oracle combines the Box Handbook with Slack #new-hires channel data.",
        "Follow up with 'Who is my onboarding buddy?' to see personalized data.",
        "Click the link on the Slack source to see 'Open Link' behavior."
      ]
    },
    {
      title: "4. Project Alpha Deep Dive",
      description: "Synthesize budget, roadmap, and infrastructure status for a core initiative.",
      query: "What's the status of Project Alpha?",
      steps: [
        "Search: 'What's the status of Project Alpha?'",
        "See the combined view of the $150k budget and the PPTX roadmap.",
        "Notice the '5 days behind' alert in the synthesis.",
        "Click on the PPTX Source Card to highlight the citation in the text."
      ]
    },
    {
      title: "5. IT Asset Procurement",
      description: "Test the IT setup workflow and procurement protocols.",
      query: "How do I setup my laptop?",
      steps: [
        "Search: 'How do I setup my laptop?'",
        "Find the Hardware Procurement Guide from Box.",
        "Observe the technical steps (Identity Synthesis script).",
        "Pin the setup guide to your personal workspace."
      ]
    },
    {
      title: "6. Predictive Intent (Zero-State)",
      description: "Test the Oracle's proactive intelligence before a query is even entered.",
      query: "N/A (Zero-State)",
      steps: [
        "Open the Oracle (Cmd+K) without typing anything.",
        "Observe 'Predicted Intent' based on upcoming meetings (Marketing Sync).",
        "Click 'Marketing_Sync_Agenda' to see instant results.",
        "Check 'Recent Architectural Focus' for one-click common searches."
      ]
    },
    {
      title: "7. Vaulted Artifact Protection",
      description: "Test the AI's respect for high-security, vaulted content.",
      query: "Show me the M&A strategy.",
      steps: [
        "Search: 'Show me the M&A strategy.'",
        "Oracle identifies the 'M&A_Strategy_Sensitive.pdf' but blocks content reading.",
        "The response redirects the user to the Compliance Center.",
        "Observe the 'Vaulted' lock icon on the source card."
      ]
    },
    {
      title: "8. Lantern Mode (Privacy Air-Gap)",
      description: "Test the search behavior when AI content reading is disabled.",
      query: "Budget reports",
      steps: [
        "Toggle AI Opt-Out in settings (simulated via Tier/Privacy toggle).",
        "Search: 'Budget reports'.",
        "Oracle performs metadata-only search (Lantern Mode).",
        "No synthesis is generated—only a list of file matches."
      ]
    },
    {
      title: "9. Multi-Source Thread Extraction",
      description: "Combine Slack conversations with official documentation.",
      query: "Who approved the budget increase?",
      steps: [
        "Search: 'Who approved the budget increase?'",
        "Oracle identifies Sarah Jenkins' approval in a Slack thread.",
        "It cross-references this with the Excel budget sheet.",
        "Click the Slack source to view the direct link to the thread."
      ]
    },
    {
      title: "10. Storage Waste Deep Scan",
      description: "Identify specific 'Ghost Town' containers for archival.",
      query: "Find all ghost towns",
      steps: [
        "Search: 'Find all ghost towns'.",
        "Oracle identifies 422 inactive containers and $2,100/mo waste.",
        "Identify 'Legacy_Marketing_2022' as the largest offender.",
        "Observe the 'Supernova Orange' accent on the ROI follow-up."
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-end p-6 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`relative w-full max-w-xl h-full rounded-[40px] border shadow-[0_40px_100px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto ${
              isDaylight ? 'bg-white/95 border-slate-200' : 'bg-[#0B0F19]/95 border-white/10 backdrop-blur-3xl'
            }`}
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-[#00F0FF]/10">
                  <BookOpen className="w-5 h-5 text-[#00F0FF]" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Oracle Demo Protocol</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v1.4 Intelligence Testing</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
              <div className={`p-6 rounded-3xl border border-dashed ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                  This guide provides a structured protocol for demonstrating the Aethos Oracle's synthesis and retrieval capabilities. Follow the trajectories below to showcase hard ROI and operational clarity.
                </p>
              </div>

              {demoCases.map((demo, i) => (
                <div key={i} className="space-y-4 group">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex items-center justify-center w-6 h-6 rounded-lg border text-[10px] font-black ${isDaylight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-black uppercase tracking-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>{demo.title}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{demo.description}</p>
                    </div>
                  </div>
                  
                  <div className={`p-5 rounded-2xl border transition-all ${isDaylight ? 'bg-slate-50 border-slate-100' : 'bg-white/[0.02] border-white/5 group-hover:border-[#00F0FF]/20 group-hover:bg-[#00F0FF]/5'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Terminal className="w-3.5 h-3.5 text-slate-500" />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`}>Query: {demo.query}</span>
                    </div>
                    <ul className="space-y-3">
                      {demo.steps.map((step, si) => (
                        <li key={si} className="flex items-start gap-3">
                          <ChevronRight className="w-3.5 h-3.5 text-slate-600 mt-0.5" />
                          <span className="text-[10px] text-slate-400 font-bold leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#00F0FF]/5 border border-[#00F0FF]/20">
                <Info className="w-5 h-5 text-[#00F0FF]" />
                <p className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest leading-relaxed">
                  Note: All URLs in the evidence deck are live simulations. Clicking 'Access' will trigger source system navigation behavior.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const X = ({ className, ...props }: any) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
