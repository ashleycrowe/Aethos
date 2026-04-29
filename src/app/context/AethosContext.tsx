import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { Connector, ProviderType, AethosIdentity, AethosContainer, Workspace, PinnedArtifact, PulseEvent, WorkspaceSubscription } from '../types/aethos.types';
import { IntelligenceService } from '../services/intelligence.service';
import { toast } from 'sonner';

export interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  provider: ProviderType | 'universal';
  action: 'archive' | 'delete' | 'notify';
  threshold: number; // days
  status: 'draft' | 'active';
  impact?: {
    storageReclaimed: number; // in GB
    costSaved: number; // in USD
    riskReduction: number; // 0-100
  };
}

interface GovernancePolicy {
  ghostTownThreshold: number; // Days
  retentionWindow: number;    // Days
  criticalExposureThreshold: number; // For Risk Granularity
}

interface InitializationState {
  isInitialized: boolean;
  bootProgress: number;
  activeAdapters: ProviderType[];
}

interface DashboardConfig {
  pinnedMetrics: string[];
}

export interface PulsePost {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  avatar: string;
  content: string;
  type: 'blast' | 'social' | 'operational' | 'integration';
  action?: PulseAction;
  media?: string;
  likes: number;
  comments: number;
  timestamp: string;
  workspace?: string;
  badges?: string[];
  channels?: string[];
  impact?: number;
  provider: ProviderType;
  isCommunicator?: boolean;
  channelId?: string;
}

export interface PulseChannel {
  id: string;
  name: string;
  description: string;
  type: 'global' | 'workspace' | 'automated';
  icon: string;
  subscriberCount: number;
}

interface AethosState {
  policy: GovernancePolicy;
  signalMode: boolean; 
  connectors: Connector[];
  identities: AethosIdentity[];
  initialization: InitializationState;
  dashboardConfig: DashboardConfig;
  workspaces: Workspace[];
  containers: AethosContainer[];
  rules: GovernanceRule[];
  pulseStream: PulsePost[];
  pulseChannels: PulseChannel[];
  forensicContext: {
    target?: string;
    type: 'universal' | 'node' | 'category' | 'workspace';
    category?: 'waste' | 'ghost' | 'exposure' | 'redundancy';
    label?: string;
  };
  isForensicLabOpen: boolean;
}

interface AethosContextType {
  state: AethosState;
  setGhostTownThreshold: (days: number) => void;
  setRetentionWindow: (days: number) => void;
  toggleSignalMode: () => void;
  addConnector: (connector: Omit<Connector, 'id'>) => void;
  removeConnector: (id: string) => void;
  updateConnectorStatus: (id: string, status: Connector['status']) => void;
  completeInitialization: () => void;
  remediateIdentity: (id: string, action: 'suspend' | 'archive' | 'delete') => void;
  remediateContainer: (id: string, action: 'archive' | 'delete' | 'restore') => void;
  updateDashboardConfig: (config: DashboardConfig) => void;
  setForensicContext: (context: AethosState['forensicContext']) => void;
  setForensicLabOpen: (open: boolean) => void;
  openForensicLab: (context: AethosState['forensicContext']) => void;
  addRule: (rule: Omit<GovernanceRule, 'id' | 'status'>) => void;
  updateRule: (id: string, updates: Partial<GovernanceRule>) => void;
  removeRule: (id: string) => void;
  commitRules: () => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
  pinToWorkspace: (workspaceId: string, artifact: PinnedArtifact) => void;
  unpinFromWorkspace: (workspaceId: string, artifactId: string) => void;
  addPulseEvent: (workspaceId: string, event: Omit<PulseEvent, 'id' | 'timestamp'>) => void;
  blastToWorkspace: (workspaceId: string, message: string, mediaUrl?: string) => void;
  reactToPulse: (workspaceId: string, eventId: string, emoji: string) => void;
  commentOnPulse: (workspaceId: string, eventId: string, text: string) => void;
  awardBadge: (identityId: string, badgeName: string) => void;
  subscribeToSource: (workspaceId: string, subscription: Omit<WorkspaceSubscription, 'id'>) => void;
  unsubscribeFromSource: (workspaceId: string, subscriptionId: string) => void;
  linkMeetingToWorkspace: (workspaceId: string, meetingId: string, meetingTitle: string) => void;
  validatePointers: () => Promise<void>;
  tickRetention: () => void;
  addPulsePost: (post: Omit<PulsePost, 'id' | 'timestamp' | 'likes' | 'comments'>) => void;
  reactToPulsePost: (postId: string, emoji: string) => void;
  subscribeToChannel: (channelId: string) => void;
}

const AethosContext = createContext<AethosContextType | undefined>(undefined);

export const AethosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
    pinnedMetrics: ['waste', 'ghost-towns', 'exposure', 'redundancy', 'orphaned']
  });

  const [policy, setPolicy] = useState<GovernancePolicy>({
    ghostTownThreshold: 180,
    retentionWindow: 365,
    criticalExposureThreshold: 50,
  });
  
  const [signalMode, setSignalMode] = useState(false);
  
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: 'conn-msft-01',
      provider: 'microsoft',
      name: 'M365 Production Tenant',
      status: 'connected',
      lastScan: new Date().toISOString(),
      accountEmail: 'admin@aethos-demo.onmicrosoft.com',
    }
  ]);

  const [identities, setIdentities] = useState<AethosIdentity[]>([
    {
      id: 'id-001',
      name: 'Sarah Chen',
      email: 'schen@enterprise.com',
      role: 'Global Architect',
      status: 'active',
      provider: 'microsoft',
      lastActive: new Date().toISOString(),
      accessCount: 1420,
      riskFactor: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Leading the global architectural strategy for Aethos. Specialized in cross-tenant synthesis and data governance.',
      badges: ['Waste Warrior', 'Clarity Architect', 'M365 Guru'],
      skills: ['Cloud Architecture', 'Data Privacy', 'Security Engineering', 'M365 Management'],
      anchors: [
        { provider: 'microsoft', linkedId: 'm365-schen', status: 'synced' },
        { provider: 'slack', linkedId: 'slack-schen', status: 'synced' },
        { provider: 'box', linkedId: 'box-schen', status: 'pending' }
      ],
      metadata: { 
        id: 'm-001', 
        externalId: 'graph-001', 
        provider: 'microsoft', 
        source: 'Graph', 
        lastSynced: new Date().toISOString(),
        crossCloudLink: 'slack-schen-01, google-schen-01'
      }
    }
  ]);

  const [containers, setContainers] = useState<AethosContainer[]>([
    {
      id: 'c-001',
      title: 'Q4 Financial Planning',
      provider: 'microsoft',
      status: 'active',
      storageUsed: 1288490188800, // 1.2 TB
      idleDays: 12,
      type: 'site',
      ownerId: 'id-001',
      riskLevel: 'high',
      exposureVectorCount: 42,
      metadata: { 
        id: 'm-c1', 
        externalId: 'sp-001', 
        provider: 'microsoft', 
        source: 'Graph', 
        lastSynced: new Date().toISOString() 
      },
      retentionDaysLeft: 7
    },
    {
      id: 'c-002',
      title: 'Legacy Marketing Assets',
      provider: 'microsoft',
      status: 'frozen',
      storageUsed: 483183820800, // 450 GB
      idleDays: 210,
      type: 'site',
      ownerId: 'id-002',
      riskLevel: 'medium',
      exposureVectorCount: 12,
      metadata: { 
        id: 'm-c2', 
        externalId: 'sp-002', 
        provider: 'microsoft', 
        source: 'Graph', 
        lastSynced: new Date().toISOString() 
      },
      retentionDaysLeft: 3
    }
  ]);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'ws-alpha',
      name: 'Project Alpha Launch',
      description: 'Core strategic alignment for the Q1 global rollout.',
      color: '#FF5733',
      icon: 'Rocket',
      primaryStorage: {
        provider: 'microsoft',
        containerId: 'sp-marketing-launch',
        path: '/Shared Documents/Alpha_Launch',
        name: 'Marketing Launch Site'
      },
      pinnedItems: [
        {
          id: 'art-001',
          type: 'spreadsheet',
          title: 'Q1 Budget Tracker',
          provider: 'microsoft',
          url: 'https://m365.com/alpha-budget',
          aethosNote: 'Sarah approved this on Tuesday. Update every Friday.',
          category: 'critical',
          pinnedAt: new Date().toISOString()
        }
      ],
      linkedSources: [
        { provider: 'microsoft', containerId: 'sp-marketing', type: 'site', name: 'Marketing Core' },
        { provider: 'slack', containerId: 'sl-alpha', type: 'channel', name: '#alpha-ops' }
      ],
      subscriptions: [
        { id: 'sub-1', provider: 'slack', sourceId: 'sl-alpha', sourceName: '#alpha-ops', type: 'channel', notifyOn: ['post', 'file'] },
        { id: 'sub-2', provider: 'microsoft', sourceId: 'viva-alpha', sourceName: 'Project Alpha Viva Topic', type: 'topic', notifyOn: ['post', 'alert'] }
      ],
      members: ['id-001'],
      pulseFeed: [
        { 
          id: 'p1', userId: 'id-001', userName: 'Sarah Chen', action: 'meeting-start', 
          artifactTitle: 'Alpha Strategy Sync', provider: 'microsoft', 
          timestamp: new Date().toISOString(), message: 'Weekly sync initialized.',
          metadata: { deepLink: '#', participants: ['Sarah Chen', 'Marcus Thorne'] }
        },
        { 
          id: 'p2', userId: 'id-002', userName: 'Marcus Thorne', action: 'loop-sync', 
          artifactTitle: 'Agenda & Action Items', provider: 'microsoft', 
          timestamp: new Date().toISOString(), message: 'Updated the meeting agenda with Q1 budget pivots.',
          metadata: { deepLink: '#', sentiment: 'positive' }
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      intelligenceScore: 92
    }
  ]);

  const [rules, setRules] = useState<GovernanceRule[]>([
    { 
      id: 'pol-1', 
      name: 'Ghost Town Archival', 
      description: 'Move inactive Microsoft 365 containers to Cold Tier storage.', 
      provider: 'microsoft', 
      action: 'archive', 
      threshold: 180, 
      status: 'active',
      impact: { storageReclaimed: 1200, costSaved: 450, riskReduction: 40 }
    }
  ]);

  const [pulseStream, setPulseStream] = useState<PulsePost[]>([
    {
      id: 'p-1',
      userId: 'id-001',
      userName: 'Sarah Chen',
      userRole: 'Global Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: "Synchronizing Alpha Strategy meeting results across the lattice. Loop components updated with the new Q1 budget pivots.",
      type: 'integration',
      action: 'loop-sync',
      likes: 12,
      comments: 4,
      timestamp: '15m ago',
      workspace: 'Project Alpha',
      provider: 'microsoft',
      isCommunicator: true
    },
    {
      id: 'p-2',
      userId: 'id-002',
      userName: 'Marcus Thorne',
      userRole: 'Operations Lead',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      content: "Slack thread #alpha-ops finalized on the deployment timeline. Aethos AI has summarized the key outcomes.",
      type: 'integration',
      action: 'slack-thread',
      likes: 34,
      comments: 7,
      timestamp: '45m ago',
      workspace: 'Project Alpha',
      provider: 'slack',
      channels: ['Slack']
    },
    {
      id: 'p-3',
      userId: 'id-sys',
      userName: 'Aethos Intelligence',
      userRole: 'System Agent',
      avatar: 'figma:asset/859f06bc073a2b7fea02cba7e30b0f6f6794d27a.png',
      content: "CRITICAL WASTE IDENTIFIED: The 'Marketing Archive' container has grown by 400GB of redundant versioning.",
      type: 'operational',
      action: 'risk-detected',
      likes: 56,
      comments: 12,
      timestamp: '2h ago',
      workspace: 'Global Governance',
      provider: 'microsoft',
      impact: 98
    },
    {
      id: 'p-4',
      userId: 'id-003',
      userName: 'Elena Rodriguez',
      userRole: 'Marketing Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
      content: "Check out the new Brand Kit visualization. 60% storage reduction achieved!",
      type: 'social',
      media: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      likes: 156,
      comments: 12,
      timestamp: '4h ago',
      workspace: 'Marketing Ops',
      provider: 'microsoft',
      badges: ['Waste Warrior'],
      impact: 92,
      channelId: 'ch-velocity'
    }
  ]);

  const [pulseChannels, setPulseChannels] = useState<PulseChannel[]>([
    { id: 'ch-all', name: 'Global Intelligence', description: 'Universal feed for all operational signals.', type: 'global', icon: 'Globe', subscriberCount: 1240 },
    { id: 'ch-governance', name: 'Governance & Waste', description: 'Monitoring digital mass reduction and ROI recovery.', type: 'automated', icon: 'ShieldCheck', subscriberCount: 45 },
    { id: 'ch-velocity', name: 'Workspace Velocity', description: 'Visual records of project acceleration and clarity.', type: 'workspace', icon: 'Zap', subscriberCount: 890 },
    { id: 'ch-merit', name: 'Merit & Achievements', description: 'Celebrating Clarity Architects and Waste Warriors.', type: 'global', icon: 'Award', subscriberCount: 560 },
  ]);

  const [forensicContext, setForensicContext] = useState<AethosState['forensicContext']>({
    type: 'universal'
  });

  const [isForensicLabOpen, setForensicLabOpen] = useState(false);

  const [initialization, setInitialization] = useState<InitializationState>({
    isInitialized: false,
    bootProgress: 100,
    activeAdapters: ['microsoft']
  });

  // Hydration from LocalStorage
  useEffect(() => {
    try {
      const savedOnboarded = localStorage.getItem('aethos_onboarded');
      if (savedOnboarded === 'true') {
        setInitialization(prev => ({ ...prev, isInitialized: true }));
      }
      
      const savedDashboard = localStorage.getItem('aethos_dashboard_config');
      if (savedDashboard) setDashboardConfig(JSON.parse(savedDashboard));
      
      const savedConnectors = localStorage.getItem('aethos_connectors');
      if (savedConnectors) setConnectors(JSON.parse(savedConnectors));
      
      const savedWorkspaces = localStorage.getItem('aethos_workspaces');
      if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
      
      const savedRules = localStorage.getItem('aethos_rules');
      if (savedRules) setRules(JSON.parse(savedRules));
    } catch (e) {
      console.error("Hydration failed", e);
    }
  }, []);

  // Persistence to LocalStorage
  useEffect(() => {
    localStorage.setItem('aethos_connectors', JSON.stringify(connectors));
  }, [connectors]);

  useEffect(() => {
    localStorage.setItem('aethos_dashboard_config', JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  useEffect(() => {
    localStorage.setItem('aethos_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('aethos_rules', JSON.stringify(rules));
  }, [rules]);

  // Simulation Engine: Ingest external signals every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (workspaces.length === 0) return;
      
      const providers: ProviderType[] = ['slack', 'microsoft', 'box', 'google'];
      const provider = providers[Math.floor(Math.random() * providers.length)];
      const signalBase = IntelligenceService.generateExternalSignal(provider);
      
      const targetWorkspace = workspaces[Math.floor(Math.random() * workspaces.length)];
      
      const newEvent: PulseEvent = {
        ...signalBase as any,
        id: `pulse-ext-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        reactions: [],
        comments: []
      };

      setWorkspaces(prev => prev.map(ws => {
        if (ws.id === targetWorkspace.id) {
          return {
            ...ws,
            pulseFeed: [newEvent, ...ws.pulseFeed].slice(0, 50),
            updatedAt: new Date().toISOString()
          };
        }
        return ws;
      }));
      
      toast("Intelligence Stream Ingested", {
        description: `Source: ${provider.toUpperCase()} • ${signalBase.artifactTitle}`,
      });
    }, 45000);

    return () => clearInterval(interval);
  }, [workspaces]);

  const openForensicLab = (context: AethosState['forensicContext']) => {
    setForensicContext(context);
    setForensicLabOpen(true);
  };

  const remediateIdentity = (id: string, action: 'suspend' | 'archive' | 'delete') => {
    setIdentities(prev => prev.map(ident => {
      if (ident.id === id) {
        return { ...ident, status: action === 'suspend' ? 'suspended' : 'orphaned' }; 
      }
      return ident;
    }));
  };

  const remediateContainer = (id: string, action: 'archive' | 'delete' | 'restore') => {
    setContainers(prev => prev.map(c => {
      if (c.id === id) {
        if (action === 'restore') return { ...c, status: 'active', retentionDaysLeft: undefined };
        if (action === 'delete') return { ...c, status: 'orphaned', retentionDaysLeft: 0 };
        return { ...c, status: 'frozen', retentionDaysLeft: 30 };
      }
      return c;
    }));
  };

  const updateDashboardConfig = (config: DashboardConfig) => {
    setDashboardConfig(config);
  };

  const setGhostTownThreshold = (days: number) => {
    setPolicy(prev => ({ ...prev, ghostTownThreshold: days }));
  };

  const setRetentionWindow = (days: number) => {
    setPolicy(prev => ({ ...prev, retentionWindow: days }));
  };

  const toggleSignalMode = () => {
    setSignalMode(prev => !prev);
  };

  const addConnector = (connector: Omit<Connector, 'id'>) => {
    const newConnector: Connector = {
      ...connector,
      id: `conn-${Math.random().toString(36).substr(2, 9)}`,
    };
    setConnectors(prev => [...prev, newConnector]);
    setInitialization(prev => ({
      ...prev,
      activeAdapters: [...new Set([...prev.activeAdapters, connector.provider as ProviderType])]
    }));
  };

  const removeConnector = (id: string) => {
    setConnectors(prev => prev.filter(c => c.id !== id));
  };

  const updateConnectorStatus = (id: string, status: Connector['status']) => {
    setConnectors(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const completeInitialization = () => {
    setInitialization(prev => ({ ...prev, isInitialized: true }));
    localStorage.setItem('aethos_onboarded', 'true');
  };

  const addRule = (rule: Omit<GovernanceRule, 'id' | 'status'>) => {
    const newRule: GovernanceRule = {
      ...rule,
      id: `pol-${Math.random().toString(36).substr(2, 9)}`,
      status: 'draft',
      impact: {
        storageReclaimed: Math.floor(Math.random() * 500) + 100,
        costSaved: Math.floor(Math.random() * 200) + 50,
        riskReduction: Math.floor(Math.random() * 40) + 20
      }
    };
    setRules(prev => [...prev, newRule]);
  };

  const updateRule = (id: string, updates: Partial<GovernanceRule>) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const commitRules = () => {
    setRules(prev => prev.map(r => ({ ...r, status: 'active' })));
  };

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces(prev => [...prev, workspace]);
  };

  const updateWorkspace = (id: string, updates: Partial<Workspace>) => {
    setWorkspaces(prev => prev.map(ws => ws.id === id ? { ...ws, ...updates, updatedAt: new Date().toISOString() } : ws));
  };

  const removeWorkspace = (id: string) => {
    setWorkspaces(prev => prev.filter(ws => ws.id !== id));
  };

  const pinToWorkspace = (workspaceId: string, artifact: PinnedArtifact) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        if (ws.pinnedItems.find(item => item.id === artifact.id)) return ws;
        return {
          ...ws,
          pinnedItems: [...ws.pinnedItems, { ...artifact, pinnedAt: new Date().toISOString() }],
          updatedAt: new Date().toISOString()
        };
      }
      return ws;
    }));
  };

  const unpinFromWorkspace = (workspaceId: string, artifactId: string) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          pinnedItems: ws.pinnedItems.filter(item => item.id !== artifactId),
          updatedAt: new Date().toISOString()
        };
      }
      return ws;
    }));
  };

  const addPulseEvent = (workspaceId: string, event: Omit<PulseEvent, 'id' | 'timestamp'>) => {
    const newEvent: PulseEvent = {
      ...event,
      id: `pulse-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      reactions: [],
      comments: []
    };
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          pulseFeed: [newEvent, ...ws.pulseFeed].slice(0, 50),
          updatedAt: new Date().toISOString()
        };
      }
      return ws;
    }));
  };

  const blastToWorkspace = async (workspaceId: string, message: string, mediaUrl?: string) => {
    // In a real app, this would be a POST request to your backend
    const blast = await IntelligenceService.broadcastBlast(workspaceId, message, 'id-001', 'Sarah Chen');
    
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          pulseFeed: [{ ...blast, mediaUrl }, ...ws.pulseFeed].slice(0, 50),
          updatedAt: new Date().toISOString()
        };
      }
      return ws;
    }));
  };

  const reactToPulse = (workspaceId: string, eventId: string, emoji: string) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          pulseFeed: ws.pulseFeed.map(evt => {
            if (evt.id === eventId) {
              const reactions = [...(evt.reactions || [])];
              const existing = reactions.find(r => r.emoji === emoji);
              if (existing) {
                existing.count += 1;
              } else {
                reactions.push({ emoji, count: 1, userIds: ['id-001'] });
              }
              return { ...evt, reactions };
            }
            return evt;
          })
        };
      }
      return ws;
    }));
  };

  const commentOnPulse = (workspaceId: string, eventId: string, text: string) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          pulseFeed: ws.pulseFeed.map(evt => {
            if (evt.id === eventId) {
              const comments = [...(evt.comments || [])];
              comments.push({
                id: `c-${Math.random()}`,
                userId: 'id-001',
                userName: 'Sarah Chen',
                text,
                timestamp: new Date().toISOString()
              });
              return { ...evt, comments };
            }
            return evt;
          })
        };
      }
      return ws;
    }));
  };

  const awardBadge = (identityId: string, badgeName: string) => {
    setIdentities(prev => prev.map(ident => {
      if (ident.id === identityId) {
        if (ident.badges.includes(badgeName)) return ident;
        return { ...ident, badges: [...ident.badges, badgeName] };
      }
      return ident;
    }));
  };

  const subscribeToSource = (workspaceId: string, subscription: Omit<WorkspaceSubscription, 'id'>) => {
    const newSub: WorkspaceSubscription = {
      ...subscription,
      id: `sub-${Math.random().toString(36).substr(2, 9)}`
    };
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return { ...ws, subscriptions: [...ws.subscriptions, newSub], updatedAt: new Date().toISOString() };
      }
      return ws;
    }));
  };

  const unsubscribeFromSource = (workspaceId: string, subscriptionId: string) => {
    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return { ...ws, subscriptions: ws.subscriptions.filter(s => s.id !== subscriptionId), updatedAt: new Date().toISOString() };
      }
      return ws;
    }));
  };

  const linkMeetingToWorkspace = (workspaceId: string, meetingId: string, meetingTitle: string) => {
    // Automatically create subscriptions and pin loop components for the meeting
    const loopArtifact: PinnedArtifact = {
      id: `loop-${meetingId}`,
      type: 'loop-component',
      title: `${meetingTitle} Agenda & Notes`,
      provider: 'microsoft',
      url: '#',
      category: 'critical',
      pinnedAt: new Date().toISOString(),
      sourceMetadata: { meetingId }
    };

    const meetingSub: WorkspaceSubscription = {
      id: `sub-meet-${meetingId}`,
      provider: 'microsoft',
      sourceId: meetingId,
      sourceName: meetingTitle,
      type: 'meeting-series',
      notifyOn: ['meeting', 'edit', 'post']
    };

    setWorkspaces(prev => prev.map(ws => {
      if (ws.id === workspaceId) {
        return {
          ...ws,
          pinnedItems: [...ws.pinnedItems, loopArtifact],
          subscriptions: [...ws.subscriptions, meetingSub],
          updatedAt: new Date().toISOString()
        };
      }
      return ws;
    }));
  };

  const validatePointers = async () => {
    // Simulate background sync engine validating links across providers
    toast("Nexus Sync Engine Initialized", {
      description: "Validating pinned molecules across federated providers...",
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    setWorkspaces(prev => prev.map(ws => ({
      ...ws,
      pinnedItems: ws.pinnedItems.map(item => {
        // Randomly simulate a broken link for demo purposes if it doesn't have one
        const shouldBreak = Math.random() > 0.8 && item.syncStatus !== 'broken';
        if (shouldBreak) {
          toast.error("Broken Pointer Detected", {
            description: `Source moved or deleted: ${item.title} in ${ws.name}`,
          });
          return { ...item, syncStatus: 'broken' };
        }
        return { ...item, syncStatus: 'synced' };
      })
    })));
  };

  const tickRetention = () => {
    setContainers(prev => prev.map(c => {
      if (c.retentionDaysLeft !== undefined) {
        const nextDays = Math.max(0, c.retentionDaysLeft - 1);
        
        // Email Simulation Logic
        if (nextDays === 3 || nextDays === 1 || nextDays === 0) {
          const urgency = nextDays === 0 ? "CRITICAL" : "WARNING";
          const action = nextDays === 0 ? "PURGE INITIALIZED" : "PURGE PENDING";
          
          console.log(`[EMAIL SIMULATION] To: owner-${c.id}@enterprise.com | Subject: ${urgency}: ${c.title} - ${action}`);
          
          toast(`Email Sent to ${c.ownerId}`, {
            description: `Subject: ${urgency}: Retention Policy Alert for ${c.title}`,
          });
        }

        if (nextDays === 3 || nextDays === 1) {
          toast(`${c.title} Alert`, {
            description: `Scheduled for Deep Purge in ${nextDays} days.`,
          });
        }
        if (nextDays === 0 && c.retentionDaysLeft > 0) {
          toast.error("Deep Purge Initialized", {
            description: `${c.title} has reached zero retention. Purge protocol active.`,
          });
        }
        return { ...c, retentionDaysLeft: nextDays };
      }
      return c;
    }));
  };

  const addPulsePost = (post: Omit<PulsePost, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    const newPost: PulsePost = {
      ...post,
      id: `p-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: 'Just now',
      likes: 0,
      comments: 0
    };
    setPulseStream(prev => [newPost, ...prev]);
  };

  const reactToPulsePost = (postId: string, emoji: string) => {
    setPulseStream(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const subscribeToChannel = (channelId: string) => {
    setPulseChannels(prev => prev.map(ch => 
      ch.id === channelId ? { ...ch, subscriberCount: ch.subscriberCount + 1 } : ch
    ));
    toast.success("Channel Subscription Active", {
      description: `You are now receiving signals from ${channelId}.`
    });
  };

  const contextValue = useMemo(() => ({
    state: { policy, signalMode, connectors, initialization, identities, containers, dashboardConfig, workspaces, rules, pulseStream, pulseChannels, forensicContext, isForensicLabOpen },
    setGhostTownThreshold,
    setRetentionWindow,
    toggleSignalMode,
    addConnector,
    removeConnector,
    updateConnectorStatus,
    completeInitialization,
    remediateIdentity,
    remediateContainer,
    updateDashboardConfig,
    setForensicContext,
    setForensicLabOpen,
    openForensicLab,
    addRule,
    updateRule,
    removeRule,
    commitRules,
    addWorkspace,
    updateWorkspace,
    removeWorkspace,
    pinToWorkspace,
    unpinFromWorkspace,
    addPulseEvent,
    blastToWorkspace,
    reactToPulse,
    commentOnPulse,
    awardBadge,
    subscribeToSource,
    unsubscribeFromSource,
    linkMeetingToWorkspace,
    validatePointers,
    tickRetention,
    addPulsePost,
    reactToPulsePost,
    subscribeToChannel
  }), [policy, signalMode, connectors, initialization, identities, containers, dashboardConfig, workspaces, rules, pulseStream, pulseChannels, forensicContext, isForensicLabOpen]);

  return (
    <AethosContext.Provider value={contextValue}>
      {children}
    </AethosContext.Provider>
  );
};

export const useAethos = () => {
  const context = useContext(AethosContext);
  if (context === undefined) {
    // Return a safe fallback to prevent crashes in mis-nested providers
    return {
      state: {
        policy: { ghostTownThreshold: 180, retentionWindow: 365, criticalExposureThreshold: 50 },
        signalMode: false,
        connectors: [],
        identities: [],
        initialization: { isInitialized: true, bootProgress: 100, activeAdapters: [] },
        dashboardConfig: { pinnedMetrics: [] },
        workspaces: [],
        containers: [],
        rules: [],
        forensicContext: { type: 'universal' as const },
        isForensicLabOpen: false
      },
      setGhostTownThreshold: () => {},
      setRetentionWindow: () => {},
      toggleSignalMode: () => {},
      addConnector: () => {},
      removeConnector: () => {},
      updateConnectorStatus: () => {},
      completeInitialization: () => {},
      remediateIdentity: () => {},
      updateDashboardConfig: () => {},
      setForensicContext: () => {},
      setForensicLabOpen: () => {},
      openForensicLab: () => {},
      addRule: () => {},
      updateRule: () => {},
      removeRule: () => {},
      commitRules: () => {},
      addWorkspace: () => {},
      updateWorkspace: () => {},
      removeWorkspace: () => {},
      pinToWorkspace: () => {},
      unpinFromWorkspace: () => {},
      addPulseEvent: () => {},
      blastToWorkspace: async () => {},
      reactToPulse: () => {},
      commentOnPulse: () => {},
      awardBadge: () => {},
      subscribeToSource: () => {},
      unsubscribeFromSource: () => {},
      linkMeetingToWorkspace: () => {},
      validatePointers: async () => {},
      tickRetention: () => {}
    };
  }
  return context;
};
