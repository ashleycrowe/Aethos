import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useAethos } from './AethosContext';
import { toast } from 'sonner';
import { 
  Trash2, 
  Target, 
  Fingerprint, 
  Sparkles, 
  Users, 
  Zap, 
  MessageSquare, 
  BookOpen, 
  Award, 
  Globe, 
  Rocket, 
  Heart,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Palette
} from 'lucide-react';

export interface BadgeDefinition {
  name: string;
  description: string;
  icon: string;
  category: 'operational' | 'social' | 'learning' | 'culture' | 'custom';
  triggerCriteria?: string;
  enabled: boolean;
  isCustom?: boolean;
}

const UNIVERSAL_BADGES: Record<string, BadgeDefinition> = {
  // Operational Badges
  'Waste Warrior': {
    name: 'Waste Warrior',
    description: 'Recovered over 500GB of dead capital in a single session.',
    icon: 'Trash2',
    category: 'operational',
    triggerCriteria: 'storage_recovered >= 500',
    enabled: true
  },
  'Clarity Architect': {
    name: 'Clarity Architect',
    description: 'Designed a high-velocity workspace with 90%+ intelligence score.',
    icon: 'Target',
    category: 'operational',
    triggerCriteria: 'workspace_intelligence >= 90',
    enabled: true
  },
  'Identity Anchor': {
    name: 'Identity Anchor',
    description: 'Successfully reconciled fragmented identities across 3+ providers.',
    icon: 'Fingerprint',
    category: 'operational',
    triggerCriteria: 'identity_reconciliation >= 3',
    enabled: true
  },
  'Oracle Sage': {
    name: 'Oracle Sage',
    description: 'Interacted with the Oracle to solve 5+ operational blind spots.',
    icon: 'Sparkles',
    category: 'operational',
    triggerCriteria: 'oracle_interactions >= 5',
    enabled: true
  },
  
  // Social Badges (Pulse Feed)
  'Pulse Pioneer': {
    name: 'Pulse Pioneer',
    description: 'First 100 posts shared to the organization-wide Pulse Feed.',
    icon: 'Zap',
    category: 'social',
    triggerCriteria: 'pulse_posts >= 1',
    enabled: true
  },
  'Culture Catalyst': {
    name: 'Culture Catalyst',
    description: 'Received 50+ engagements on operational updates in a week.',
    icon: 'Heart',
    category: 'social',
    triggerCriteria: 'pulse_engagements >= 50',
    enabled: true
  },
  'Conversation Architect': {
    name: 'Conversation Architect',
    description: 'Initiated 5+ deep-threaded strategic discussions in Pulse.',
    icon: 'MessageSquare',
    category: 'social',
    triggerCriteria: 'pulse_comments >= 5',
    enabled: true
  },

  // Learning Badges (Future)
  'Knowledge Nexus': {
    name: 'Knowledge Nexus',
    description: 'Completed 5+ learning modules in the Aethos Academy.',
    icon: 'BookOpen',
    category: 'learning',
    triggerCriteria: 'modules_completed >= 5',
    enabled: false
  },
  'Skill Synthesizer': {
    name: 'Skill Synthesizer',
    description: 'Successfully applied a new skill to an operational protocol.',
    icon: 'Cpu',
    category: 'learning',
    triggerCriteria: 'skills_applied >= 1',
    enabled: false
  },

  // Culture & Strategy Badges
  'Efficiency Expert': {
    name: 'Efficiency Expert',
    description: 'Consistently maintains personal workspace health above 95%.',
    icon: 'TrendingUp',
    category: 'culture',
    triggerCriteria: 'workspace_health_avg >= 95',
    enabled: true
  },
  'Legacy Lifter': {
    name: 'Legacy Lifter',
    description: 'Archived 10+ legacy containers that were inactive for 2+ years.',
    icon: 'Award',
    category: 'culture',
    triggerCriteria: 'legacy_containers_archived >= 10',
    enabled: true
  },
  'Global Synchronizer': {
    name: 'Global Synchronizer',
    description: 'Successfully bridged a communication gap between 3+ global regions.',
    icon: 'Globe',
    category: 'culture',
    triggerCriteria: 'global_bridge_count >= 3',
    enabled: true
  }
};

interface OperationalMeritContextType {
  badges: Record<string, BadgeDefinition>;
  toggleBadge: (name: string) => void;
  addCustomBadge: (badge: Omit<BadgeDefinition, 'category' | 'enabled' | 'isCustom'>) => void;
  removeCustomBadge: (name: string) => void;
  triggerAchievement: (identityId: string, badgeName: string) => void;
  checkWasteRecoveryAchievements: (identityId: string, gbRecovered: number) => void;
  checkWorkspaceAchievements: (identityId: string, intelligenceScore: number) => void;
  checkPulseAchievements: (identityId: string, stats: { posts: number; engagements: number; comments: number }) => void;
}

const OperationalMeritContext = createContext<OperationalMeritContextType | undefined>(undefined);

export const OperationalMeritProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { awardBadge } = useAethos();
  const [badges, setBadges] = useState<Record<string, BadgeDefinition>>(UNIVERSAL_BADGES);

  const toggleBadge = useCallback((name: string) => {
    setBadges(prev => ({
      ...prev,
      [name]: { ...prev[name], enabled: !prev[name].enabled }
    }));
    
    const isNowEnabled = !badges[name].enabled;
    toast.info(`Badge ${isNowEnabled ? 'Enabled' : 'Disabled'}`, {
      description: `${name} has been ${isNowEnabled ? 'added to' : 'removed from'} the active merit pool.`
    });
  }, [badges]);

  const addCustomBadge = useCallback((badge: Omit<BadgeDefinition, 'category' | 'enabled' | 'isCustom'>) => {
    setBadges(prev => ({
      ...prev,
      [badge.name]: { 
        ...badge, 
        category: 'custom', 
        enabled: true, 
        isCustom: true 
      }
    }));
    
    toast.success('Custom Badge Created', {
      description: `"${badge.name}" is now available for automated distribution.`
    });
  }, []);

  const removeCustomBadge = useCallback((name: string) => {
    setBadges(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    
    toast.info('Custom Badge Removed', {
      description: `${name} has been retired from the merit system.`
    });
  }, []);

  const triggerAchievement = useCallback((identityId: string, badgeName: string) => {
    const badge = badges[badgeName];
    if (!badge || !badge.enabled) return;

    awardBadge(identityId, badgeName);
    
    toast.success(`Operational Merit Awarded: ${badge.name}`, {
      description: badge.description,
      duration: 5000,
    });
  }, [awardBadge, badges]);

  const checkWasteRecoveryAchievements = useCallback((identityId: string, gbRecovered: number) => {
    if (gbRecovered >= 500) {
      triggerAchievement(identityId, 'Waste Warrior');
    }
  }, [triggerAchievement]);

  const checkWorkspaceAchievements = useCallback((identityId: string, intelligenceScore: number) => {
    if (intelligenceScore >= 90) {
      triggerAchievement(identityId, 'Clarity Architect');
    }
  }, [triggerAchievement]);

  const checkPulseAchievements = useCallback((identityId: string, stats: { posts: number; engagements: number; comments: number }) => {
    if (stats.posts >= 1) triggerAchievement(identityId, 'Pulse Pioneer');
    if (stats.engagements >= 50) triggerAchievement(identityId, 'Culture Catalyst');
    if (stats.comments >= 5) triggerAchievement(identityId, 'Conversation Architect');
  }, [triggerAchievement]);

  return (
    <OperationalMeritContext.Provider value={{ 
      badges, 
      toggleBadge, 
      addCustomBadge, 
      removeCustomBadge,
      triggerAchievement, 
      checkWasteRecoveryAchievements, 
      checkWorkspaceAchievements,
      checkPulseAchievements
    }}>
      {children}
    </OperationalMeritContext.Provider>
  );
};

export const useOperationalMerit = () => {
  const context = useContext(OperationalMeritContext);
  if (context === undefined) {
    return {
      badges: UNIVERSAL_BADGES,
      toggleBadge: () => {},
      addCustomBadge: () => {},
      removeCustomBadge: () => {},
      triggerAchievement: () => {},
      checkWasteRecoveryAchievements: () => {},
      checkWorkspaceAchievements: () => {},
      checkPulseAchievements: () => {}
    };
  }
  return context;
};
