import { PulseEvent, Workspace, PinnedArtifact, PulseAction, ProviderType } from '../types/aethos.types';

/**
 * Aethos Intelligence Service (SIMULATED)
 * This service mimics a backend implementation (Supabase or Azure)
 * for the Operational Pulse and Resource Lattice.
 */

const LATENCY = 600;

export const IntelligenceService = {
  // Simulate fetching signals from a database
  async getPulseFeed(workspaceId: string): Promise<PulseEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would be: supabase.from('pulse').select('*').eq('workspace_id', workspaceId)
        resolve([]); 
      }, LATENCY);
    });
  },

  // Simulate a manual blast (Server-side broadcast)
  async broadcastBlast(workspaceId: string, message: string, userId: string, userName: string): Promise<PulseEvent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blast: PulseEvent = {
          id: `blast-${Math.random().toString(36).substr(2, 9)}`,
          userId,
          userName,
          action: 'blast',
          artifactTitle: 'Operational Broadcast',
          provider: 'local',
          timestamp: new Date().toISOString(),
          message,
          isBlast: true,
          reactions: [],
          comments: [],
          metadata: { impactScore: 10, sentiment: 'positive' }
        };
        resolve(blast);
      }, LATENCY);
    });
  },

  // Simulate external signal ingestion (The "Intelligence Stream")
  generateExternalSignal(provider: ProviderType): Partial<PulseEvent> {
    const signals: Record<ProviderType, Array<{ action: PulseAction, title: string, msg: string }>> = {
      slack: [
        { action: 'slack-thread', title: '#product-sync', msg: 'New architectural review requested for the Voyager Map constellation logic.' },
        { action: 'comment', title: '#general', msg: 'Operational clarity achieved on the Q1 storage reclamation target.' }
      ],
      microsoft: [
        { action: 'viva-post', title: 'Intelligence Stream', msg: 'New Viva Topic identified: "Storage Governance Protocol 2.0".' },
        { action: 'meeting-start', title: 'Architectural Sync', msg: 'Weekly synchronization initialized. 12 participants anchored.' }
      ],
      google: [
        { action: 'edit', title: 'Operational Roadmap', msg: 'Collaborative edit detected on the Enterprise Intelligence Layer specification.' }
      ],
      box: [
        { action: 'upload', title: 'Compliance_Vault', msg: 'New governance artifact anchored to the Cold_Tier storage.' }
      ],
      local: []
    };

    const options = signals[provider];
    const pick = options[Math.floor(Math.random() * options.length)];
    
    return {
      userId: 'system-ai',
      userName: 'Aethos Oracle',
      action: pick.action,
      artifactTitle: pick.title,
      provider: provider,
      message: pick.msg,
      metadata: { 
        sentiment: 'neutral', 
        impactScore: Math.floor(Math.random() * 5) + 3,
        channelName: pick.title
      }
    };
  }
};
