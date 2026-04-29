import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProviderType } from '../types/aethos.types';
import { useAethos } from './AethosContext';
import { useOperationalMerit } from './OperationalMeritContext';

export interface OracleSource {
  id: string;
  title: string;
  provider: ProviderType;
  type: string;
  snippet: string;
  content: string;
  relevance: number;
  url: string;
  isVaulted?: boolean;
}

export interface OraclePredictiveItem {
  id: string;
  title: string;
  type: string;
  reason: string;
  context: string;
}

export interface OracleAction {
  id: string;
  label: string;
  icon: string;
  type: 'communication' | 'workspace' | 'governance' | 'utility';
  target?: string;
}

export interface OracleMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  sources?: OracleSource[];
  actions?: OracleAction[];
  timestamp: number;
}

export interface OracleResponse {
  answer: string;
  sources: OracleSource[];
  actions: OracleAction[];
  isStreaming: boolean;
  intent?: string;
  followUps: string[];
}

export interface OracleInsight {
  id: string;
  title: string;
  narrative: string;
  calculation: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  type: 'waste' | 'identity' | 'governance' | 'workspace';
  suggestedAction: string;
  timestamp: number;
}

interface OracleContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  results: OracleResponse | null;
  search: (q: string) => Promise<void>;
  status: 'idle' | 'federating' | 'reading' | 'synthesizing' | 'answering' | 'purging';
  federationStatus: Record<ProviderType, 'pending' | 'complete' | 'none'>;
  tier: 'basic' | 'pro';
  setTier: (tier: 'basic' | 'pro') => void;
  isAiOptOut: boolean;
  setIsAiOptOut: (optOut: boolean) => void;
  predictiveItems: OraclePredictiveItem[];
  insights: OracleInsight[];
  history: OracleMessage[];
  clearHistory: () => void;
}

const OracleContext = createContext<OracleContextType | undefined>(undefined);

const PREDICTIVE_DATABASE: OraclePredictiveItem[] = [
  {
    id: 'pred-1',
    title: 'Marketing_Sync_Agenda.docx',
    type: 'word',
    reason: 'Upcoming Meeting',
    context: 'Marketing Sync (in 10m)'
  },
  {
    id: 'pred-2',
    title: 'Q3_Performance_Summary.xlsx',
    type: 'excel',
    reason: 'Recent Collaboration',
    context: 'Shared by Sarah Jenkins'
  }
];

const ORACLE_DATABASE: OracleSource[] = [
  // --- PROJECT ALPHA (CORE) ---
  {
    id: 'ms-budget-01',
    title: 'Project_Alpha_Budget_2026.xlsx',
    provider: 'microsoft',
    type: 'excel',
    snippet: '...total projected spend for FY26 is $150,000...',
    content: 'Project Alpha Budget Analysis. Current Budget: $150,000. Q1 Allocation: $40,000. Q2 Allocation: $50,000. Note: Sarah approved a $30k increase on Feb 1st due to vendor contract changes to cover Azure scaling. This document is the source of truth for all Alpha spend.',
    relevance: 0.98,
    url: 'https://sharepoint.com/alpha/budget'
  },
  {
    id: 'slack-budget-01',
    title: '#finance-general (Thread)',
    provider: 'slack',
    type: 'thread',
    snippet: 'Sarah: "I just pushed the extra $30k through for Alpha..."',
    content: 'User Sarah (10:15 AM): I just pushed the extra $30k through for Project Alpha. We need to cover the new Azure vendor contract. Total budget is now $150k. User Mark (10:17 AM): Understood, updating the master sheet now. This represents a 20% increase over Q4.',
    relevance: 0.95,
    url: 'https://slack.com/archives/finance/p123456789'
  },
  {
    id: 'ms-strategy-01',
    title: 'Alpha_Roadmap_Q1.pptx',
    provider: 'microsoft',
    type: 'presentation',
    snippet: '...milestone for multi-cloud parity set for March 15...',
    content: 'Project Alpha Strategic Roadmap. Key Milestones: 1. Identity Synthesis (Feb 10). 2. Multi-Cloud Parity (Mar 15). 3. Global Scale (Apr 30). Currently tracking 5 days behind on milestone 1 due to Box API latency.',
    relevance: 0.92,
    url: 'https://sharepoint.com/alpha/roadmap'
  },

  // --- STORAGE WASTE & ROI ---
  {
    id: 'roi-breakdown-01',
    title: 'Storage_ROI_Analysis_Jan.pdf',
    provider: 'google',
    type: 'pdf',
    snippet: '...potential savings of $4,280/mo identified...',
    content: 'Storage ROI Breakdown. Inactive Microsoft 365 sites: $2,100/mo. Orphaned Box containers: $1,200/mo. Slack legacy archives: $980/mo. Total potential recovery: $4,280/mo. Recommendation: Initialize "Deep Purge" on all sites with zero activity for 180+ days.',
    relevance: 0.99,
    url: 'https://drive.google.com/roi-report'
  },
  {
    id: 'waste-audit-01',
    title: 'Ghost_Town_Report_Q4.csv',
    provider: 'microsoft',
    type: 'csv',
    snippet: '...422 SharePoint sites identified as "Ghost Towns"...',
    content: 'Ghost Town Audit results for Q4 2025. 422 sites found with 0 edits and 0 views in 6 months. Total storage footprint: 1.2TB. Largest offender: "Legacy_Marketing_2022" at 450GB.',
    relevance: 0.97,
    url: 'https://sharepoint.com/compliance/ghost-towns'
  },

  // --- SECURITY & EXTERNAL ACCESS ---
  {
    id: 'external-users-audit',
    title: 'External_Collaborators_Report.csv',
    provider: 'microsoft',
    type: 'csv',
    snippet: '...list of 14 external entities with access...',
    content: 'External Access Audit. 14 external collaborators identified across 3 domains (partner.com, vendor.net, agency.org). High risk detected in "Project Alpha" shared folders where "Guest" users have "Owner" permissions.',
    relevance: 0.98,
    url: 'https://sharepoint.com/security/external-report'
  },
  {
    id: 'ms-vault-01',
    title: 'M&A_Strategy_Sensitive.pdf',
    provider: 'microsoft',
    type: 'pdf',
    snippet: '...strictly confidential acquisition plans...',
    content: 'TOP SECRET: M&A Strategy for 2026. This document contains sensitive acquisition targets and valuation models. Access restricted to Architects only. Not to be shared via Slack.',
    relevance: 0.99,
    url: 'https://sharepoint.com/vault/ma-strategy',
    isVaulted: true
  },
  {
    id: 'slack-security-01',
    title: '#security-alerts (Channel)',
    provider: 'slack',
    type: 'channel',
    snippet: 'System: "Unauthorized sharing attempt detected in Google Drive..."',
    content: 'Alert: User Alex tried to share "Customer_PII_List.csv" with an external Gmail account. Action: Blocked by Aethos Security Shield. Incident logged as SEC-402.',
    relevance: 0.88,
    url: 'https://slack.com/archives/security/alerts'
  },

  // --- ONBOARDING & HR ---
  {
    id: 'hr-onboarding-01',
    title: 'Aethos_Employee_Handbook_2026.pdf',
    provider: 'box',
    type: 'pdf',
    snippet: '...onboarding process takes 4 weeks and includes...',
    content: 'Aethos Onboarding Process. Week 1: Identity Synthesis & Security Clearance. Week 2: Oracle Training. Week 3: Universal Adapter Certification. Week 4: Project Assignment. Week 3 focuses on technical certification for M365 and Slack integrations.',
    relevance: 0.96,
    url: 'https://box.com/hr/handbook'
  },
  {
    id: 'hr-buddy-list',
    title: 'Onboarding_Buddies_Q1.xlsx',
    provider: 'microsoft',
    type: 'excel',
    snippet: '...assigned mentors for new hires in Jan-Mar...',
    content: 'Onboarding Buddy List Q1 2026. Marcus is assigned to Sarah Jenkins. Alex is assigned to Mark Stevens. New hires should coordinate weekly syncs with their buddy in Slack #new-hires.',
    relevance: 0.92,
    url: 'https://sharepoint.com/hr/buddies'
  },
  {
    id: 'slack-onboarding-01',
    title: '#new-hires (Channel)',
    provider: 'slack',
    type: 'channel',
    snippet: 'Marcus: "Where can I find the laptop setup guide?"',
    content: 'Marcus (Monday): Where can I find the laptop setup guide? Admin: It\'s pinned in the #it-support channel, but you can also search the Oracle for "Hardware Procurement". Check the pinned messages for the "Welcome Kit".',
    relevance: 0.82,
    url: 'https://slack.com/archives/new-hires'
  },

  // --- IT & INFRASTRUCTURE ---
  {
    id: 'it-setup-guide',
    title: 'Hardware_Procurement_Guide.docx',
    provider: 'box',
    type: 'word',
    snippet: '...how to request your Aethos workstation...',
    content: 'Hardware Procurement & Laptop Setup. Step 1: Request asset via the IT Portal. Step 2: Once delivered, run the Identity Synthesis script found in /opt/aethos/bin. Step 3: Connect to the Nexus Sync hub. Standard issue is M3 Max 64GB.',
    relevance: 0.97,
    url: 'https://box.com/it/setup'
  },
  {
    id: 'google-it-01',
    title: 'Cloud_Inventory_List',
    provider: 'google',
    type: 'spreadsheet',
    snippet: '...list of all active GCP and Azure instances...',
    content: 'Global Cloud Inventory. 42 Azure VMs (Project Alpha), 12 GCP Buckets (Storage Archive), 4 AWS S3 Buckets (Legacy). Total cloud spend current: $42,000/mo. Infrastructure is managed via Terraform.',
    relevance: 0.85,
    url: 'https://docs.google.com/inventory'
  },

  // --- ARCHIVAL & GOVERNANCE ---
  {
    id: 'archive-policy-01',
    title: 'Global_Retention_Policy_v2.docx',
    provider: 'microsoft',
    type: 'word',
    snippet: '...records must be kept for 7 years then purged...',
    content: 'Corporate Retention Policy. Financial records: 7 years. Communication logs: 1 year. Project artifacts: 3 years post-completion. Use Aethos "Cold Tier" for all archival over 12 months.',
    relevance: 0.94,
    url: 'https://sharepoint.com/legal/retention'
  },
  {
    id: 'box-archive-01',
    title: 'Legacy_Contracts_Vault',
    provider: 'box',
    type: 'folder',
    snippet: '...sealed contracts from 2018-2022...',
    content: 'Vault containing all signed customer contracts from the legacy era. Access restricted to Legal and Finance leads only. Total folder size: 85GB.',
    relevance: 0.89,
    url: 'https://box.com/legal/vault'
  }
];

const INSIGHT_DATABASE: OracleInsight[] = [
  {
    id: 'ins-1',
    title: 'Storage Optimization identified in SharePoint',
    narrative: 'We found 422 "Ghost Town" sites that haven\'t been accessed in 180 days. Moving these to the Cold Tier will reclaim $2,100/mo immediately.',
    calculation: '422 sites * avg 2.8GB * $0.02/GB/mo premium storage cost = $23.6k annual savings.',
    impact: 'high',
    type: 'waste',
    suggestedAction: 'Initialize Deep Purge Simulation',
    timestamp: Date.now() - 1000 * 60 * 60 * 2
  },
  {
    id: 'ins-2',
    title: 'Identity Risk: External Exposure in Project Alpha',
    narrative: '14 external users from agency.org still have "Owner" permissions on Project Alpha folders despite the project ending 3 weeks ago.',
    calculation: 'Identity Entropy Index: 0.84. Risk Probability: High. Exposure Surface: 4.2TB of sensitive data.',
    impact: 'critical',
    type: 'identity',
    suggestedAction: 'Revoke External Access',
    timestamp: Date.now() - 1000 * 60 * 60 * 5
  },
  {
    id: 'ins-3',
    title: 'Workspace Efficiency: Slack Noise Suppression',
    narrative: 'The #marketing-random channel has a noise-to-signal ratio of 94%. We recommend archiving it and migrating active threads to the new Workspace Anchor.',
    calculation: 'Token Density: 4.2. Engagement Rate: < 1%. Operational Drag: 12m/user/day.',
    impact: 'medium',
    type: 'workspace',
    suggestedAction: 'Archive Slack Channel',
    timestamp: Date.now() - 1000 * 60 * 60 * 24
  }
];

export const OracleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { triggerAchievement } = useOperationalMerit();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OracleContextType['status']>('idle');
  const [results, setResults] = useState<OracleResponse | null>(null);
  const [tier, setTier] = useState<'basic' | 'pro'>('pro');
  const [isAiOptOut, setIsAiOptOut] = useState(false);
  const [history, setHistory] = useState<OracleMessage[]>([]);
  const [insights, setInsights] = useState<OracleInsight[]>(INSIGHT_DATABASE);
  const [searchCount, setSearchCount] = useState(0);
  const [federationStatus, setFederationStatus] = useState<Record<ProviderType, 'pending' | 'complete' | 'none'>>({
    microsoft: 'none', google: 'none', slack: 'none', box: 'none', local: 'none'
  });

  const clearHistory = () => {
    setHistory([]);
    setResults(null);
  };

  const search = async (q: string) => {
    if (!q.trim()) return;
    
    // Achievement Tracking
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    if (newCount === 5) {
      triggerAchievement('id-001', 'Oracle Sage');
    }

    // Add user message to history
    const userMsg: OracleMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: q,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, userMsg]);
    
    setResults(null);
    setStatus('federating');
    setFederationStatus({
      microsoft: 'pending', google: 'pending', slack: 'pending', box: 'pending', local: 'none'
    });

    await new Promise(r => setTimeout(r, 600));
    setFederationStatus(prev => ({ ...prev, microsoft: 'complete', slack: 'complete' }));
    await new Promise(r => setTimeout(r, 400));
    setFederationStatus(prev => ({ ...prev, google: 'complete', box: 'complete' }));

    setStatus('reading');
    await new Promise(r => setTimeout(r, 800));

    // If Basic Tier or Opt-Out, skip synthesis
    if (tier === 'basic' || isAiOptOut) {
      const matchedSources = ORACLE_DATABASE.filter(s => 
        s.title.toLowerCase().includes(q.toLowerCase())
      ).sort((a, b) => b.relevance - a.relevance);

      const lanternMsg: OracleMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: "Lantern Mode Active: Metadata search completed. Found results matching your query in the file directory.",
        intent: "Metadata Search",
        sources: matchedSources,
        timestamp: Date.now()
      };

      setResults({
        answer: lanternMsg.content,
        sources: matchedSources,
        actions: [],
        isStreaming: false,
        intent: "Metadata Search",
        followUps: []
      });
      setHistory(prev => [...prev, lanternMsg]);
      setStatus('idle');
      return;
    }

    setStatus('synthesizing');
    const lowerQ = q.toLowerCase();
    
    // Multi-source retrieval
    const matchedSources = ORACLE_DATABASE.filter(s => 
      s.content.toLowerCase().includes(lowerQ) ||
      s.title.toLowerCase().includes(lowerQ) ||
      s.snippet.toLowerCase().includes(lowerQ)
    ).sort((a, b) => b.relevance - a.relevance);

    await new Promise(r => setTimeout(r, 1200));
    setStatus('answering');
    
    let fullAnswer = "";
    let intent = undefined;
    let suggestedActions: OracleAction[] = [];
    let followUps: string[] = [];

    // Vault check
    const vaultedMatches = matchedSources.filter(s => s.isVaulted);
    if (vaultedMatches.length > 0 && lowerQ.includes(vaultedMatches[0].title.split('_')[0].toLowerCase())) {
      fullAnswer = `I found the file **${vaultedMatches[0].title}**, but my clearance level (AI Content Restriction) prevents me from reading its content. You must access this file manually via the **Microsoft Compliance Center**. [1]`;
      intent = "Security: Vaulted Artifact";
      followUps = ["Check my clearance level", "Request file access"];
    }
    // 1. Context-Aware Forensic Logic
    else if (lowerQ.includes('simulation') || lowerQ.includes('archival')) {
      fullAnswer = `I have initialized the **Archival Simulation** protocol. Based on the intelligence stream, we can safely move 1,200 inactive SharePoint containers to the **Cold Tier** without breaking existing metadata pointers. This will recover **$2,100/mo** in dead capital [1].`;
      intent = "Remediation Simulation";
      followUps = ["Execute Deletion Logic", "View Simulation Report"];
      suggestedActions = [{ id: 'act-s1', label: 'Commit Archival', icon: 'CheckCircle2', type: 'governance' }];
    }
    else if (lowerQ.includes('roi') || lowerQ.includes('savings') || lowerQ.includes('recovery')) {
      fullAnswer = `The **Storage ROI** analysis for January 2026 identifies a total of **$4,280/mo** in potential savings [1]. The breakdown includes **$2,100** from M365, **$1,200** from Box, and **$980** from Slack [2]. I recommend starting with the M365 site cleanup as it has the highest "Identity Velocity."`;
      intent = "Financial ROI Analysis";
      followUps = ["Show M365 Site List", "Export ROI PDF"];
    }
    else if (lowerQ.includes('external') || lowerQ.includes('collaborators')) {
      fullAnswer = `I have identified **14 external collaborators** across 3 primary domains (partner.com, vendor.net, agency.org) [1]. These users have persistent access to "Project Alpha" containers which haven't been modified in 60+ days [2]. This represents a high-exposure **Shadow Leakage** risk.`;
      intent = "Security: External Exposure";
      followUps = ["Revoke External Access", "Who are the domain admins?"];
    }
    // 2. Onboarding / HR Intent
    else if (lowerQ.includes('week 3')) {
      fullAnswer = `**Week 3** of the onboarding journey is the **Technical Certification phase** [1]. You will focus on the **Universal Adapter Pattern**, specifically mastering the bi-directional sync for Microsoft 365 and Slack [2]. Completion is required before you are assigned a "Lead Architect" badge.`;
      intent = "HR: Certification Phase";
      followUps = ["Take Certification Quiz", "Review Week 2"];
    }
    else if (lowerQ.includes('buddy')) {
      fullAnswer = `Based on the **Q1 Onboarding List**, your assigned buddy is **Sarah Jenkins** [1]. Sarah is a Global Architect who can help you navigate the Oracle and the Forensic Lab protocols [2]. I recommend scheduling a 15-minute sync in Slack.`;
      intent = "HR: Buddy Assignment";
      followUps = ["Message Sarah Jenkins", "View Sarah's Profile"];
    }
    else if (lowerQ.includes('setup') || lowerQ.includes('hardware') || lowerQ.includes('laptop')) {
      fullAnswer = `To complete your **Hardware Procurement**, you must first request your asset via the IT Portal [1]. Once your laptop arrives, run the **Identity Synthesis script** found at /opt/aethos/bin to register your device with the Nexus Sync hub [2].`;
      intent = "IT: Asset Setup";
      followUps = ["Open IT Portal", "Download Setup Script"];
    }
    else if (lowerQ.includes('onboarding') || lowerQ.includes('new hire') || lowerQ.includes('process')) {
      fullAnswer = "The Aethos **Onboarding Process** is a 4-week structured journey [1]. It begins with **Identity Synthesis** in Week 1, followed by **Oracle & Forensic Lab training** in Week 2 [2]. By Week 4, new hires are assigned to an active operational workspace. You can find the full setup guide pinned in #new-hires [3].";
      intent = "HR: Employee Journey";
      followUps = ["What happens in Week 3?", "Find laptop setup guide", "Who is my onboarding buddy?"];
      suggestedActions = [
        { id: 'act-h1', label: 'View Employee Handbook', icon: 'Book', type: 'utility' },
        { id: 'act-h2', label: 'Go to #new-hires', icon: 'Slack', type: 'communication' }
      ];
    }
    // 3. Identity / People Intent
    else if (lowerQ.includes('sarah') || lowerQ.includes('who is')) {
      fullAnswer = `**Sarah Jenkins** is the **Global Architect** for Aethos [1]. She leads the **Project Alpha** initiative and recently approved a $30k budget increase for Azure infrastructure [2]. Her current "Operational Footprint" spans 42 containers across Microsoft and Box [3].`;
      intent = "Identity Intelligence";
      followUps = ["Message Sarah Jenkins", "View Sarah's Permissions", "See Alpha Project Status"];
    }
    // 4. Budget / Finance Intent
    else if (lowerQ.includes('budget') || lowerQ.includes('alpha') || lowerQ.includes('cost') || lowerQ.includes('finance')) {
      fullAnswer = "The current budget for **Project Alpha** is **$150,000** annually [1]. This includes a **$30,000 vendor increase** approved on February 1st [2]. Most of the spend is allocated to Azure Infrastructure and Cross-Cloud Governance modules [3].";
      intent = "Financial Operations";
      followUps = ["Open Budget Spreadsheet", "Compare to Q4 spend", "Notify Finance of changes"];
    }
    // 5. Insights Intent
    else if (lowerQ.includes('insight') || lowerQ.includes('stream') || lowerQ.includes('prediction')) {
      fullAnswer = `I am currently tracking **${insights.length} active Intelligence Insights**. The highest impact item is **"${insights[0].title}"**, which identifies a recovery potential of **$2,100/mo**. [1] Would you like me to deconstruct the logic for all active insights?`;
      intent = "Intelligence Stream Overview";
      followUps = ["Show all insights", "Explain the most critical insight", "What is Dead Capital?"];
    }
    // 6. Generic Synthesis (Fallback)
    else if (matchedSources.length > 0) {
      const titles = matchedSources.slice(0, 2).map(s => `**${s.title}**`).join(' and ');
      fullAnswer = `I've analyzed the intelligence stream for "${q}". I found relevant information in ${titles} [1][2]. Based on these artifacts, this topic relates to **Operational Clarity** and multi-cloud governance protocols. Would you like a deeper deconstruction of these files?`;
      intent = "Knowledge Synthesis";
      followUps = [`Tell me more about ${matchedSources[0].title}`, "Summarize all related files", "Pin these to my workspace"];
    }
    else if (lowerQ.includes('cold tier') || lowerQ.includes('archive')) {
      fullAnswer = `I am scanning the **Archived Cold Tiers**... I found 422 legacy containers from 2024. These are currently costing **$840/mo**. Would you like to run a **Deep Purge Simulation** on these orphaned artifacts?`;
      intent = "Archive Deep Scan";
      followUps = ["Run Deep Purge", "Export Archive List"];
    }
    else if (lowerQ.includes('identity audit') || lowerQ.includes('blast radius')) {
      fullAnswer = `The **Identity Blast Radius** scan is complete. I detected 3 users with "Owner" permissions on sensitive finance folders who haven't logged in for 30+ days [1]. This constitutes an **Identity Velocity** risk. [2]`;
      intent = "Security: Identity Audit";
      followUps = ["Revoke Inactive Owners", "View Full Risk Report"];
    }
    // 6. True Fallback
    else {
      fullAnswer = `I scanned 4,200 items across your Microsoft, Slack, and Box anchors but found no direct matches for "${q}". I can broaden the search to **Archived Cold Tiers** or trigger an **Identity Blast Radius** scan to see if this relates to a specific user.`;
      intent = "Null Search Result";
      followUps = ["Scan Cold Tiers", "Run Identity Audit", "Ask the Global Architect"];
    }

    setResults({
      answer: "",
      sources: matchedSources,
      actions: suggestedActions,
      isStreaming: true,
      intent,
      followUps
    });

    let currentText = "";
    const tokens = fullAnswer.split(" ");
    for (let i = 0; i < tokens.length; i++) {
      currentText += (i === 0 ? "" : " ") + tokens[i];
      setResults(prev => prev ? { ...prev, answer: currentText } : null);
      await new Promise(r => setTimeout(r, 10 + Math.random() * 20));
    }

    setResults(prev => prev ? { ...prev, isStreaming: false } : null);
    
    // Add assistant message to history
    const assistantMsg: OracleMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'assistant',
      content: fullAnswer,
      intent,
      sources: matchedSources,
      actions: suggestedActions,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, assistantMsg]);

    await new Promise(r => setTimeout(r, 1000));
    setStatus('idle');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <OracleContext.Provider value={{ 
      isOpen, setIsOpen, query, setQuery, results, search, status, federationStatus,
      tier, setTier, isAiOptOut, setIsAiOptOut, predictiveItems: PREDICTIVE_DATABASE,
      insights,
      history, clearHistory
    }}>
      {children}
    </OracleContext.Provider>
  );
};

export const useOracle = () => {
  const context = useContext(OracleContext);
  if (context === undefined) {
    throw new Error('useOracle must be used within an OracleProvider');
  }
  return context;
};
