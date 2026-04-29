import { AethosIdentity, AethosContainer, CareerMilestone } from '../types/aethos.types';

export interface SuggestedMerit {
  badge: string;
  reason: string;
  confidence: number;
}

/**
 * Analyzes identity activity and container ownership to suggest "Operational Merit" badges.
 */
export const synthesizeSkills = (identity: AethosIdentity, containers: AethosContainer[]): SuggestedMerit[] => {
  const suggestions: SuggestedMerit[] = [];
  
  // Logic 1: Waste Mitigation (Waste Warrior)
  const ownedContainers = containers.filter(c => c.ownerId === identity.id);
  const totalRemediated = ownedContainers.filter(c => c.status === 'archived' || c.status === 'frozen')
    .reduce((acc, c) => acc + c.storageUsed, 0);
  
  if (totalRemediated > 100 * 1024 * 1024 * 1024) { // > 100GB
    suggestions.push({
      badge: 'Waste Warrior',
      reason: `Has successfully remediated ${(totalRemediated / 1024 / 1024 / 1024).toFixed(1)}GB of redundant data.`,
      confidence: 0.95
    });
  }

  // Logic 2: Collaboration (Collaboration Catalyst)
  if (identity.accessCount > 1000) {
    suggestions.push({
      badge: 'Collaboration Catalyst',
      reason: 'High frequency of cross-cloud asset interactions detected.',
      confidence: 0.88
    });
  }

  // Logic 3: Clarity (Clarity Architect)
  const healthyContainers = ownedContainers.filter(c => c.riskLevel === 'low').length;
  if (healthyContainers > 5) {
    suggestions.push({
      badge: 'Clarity Architect',
      reason: 'Maintains a portfolio of containers with zero critical exposure vectors.',
      confidence: 0.92
    });
  }

  return suggestions;
};

/**
 * Generates automated milestones based on system events.
 */
export const synthesizeMilestones = (identity: AethosIdentity): CareerMilestone[] => {
  const milestones: CareerMilestone[] = [];
  
  if (identity.accessCount > 500 && !identity.milestones?.find(m => m.title === 'Active Contributor')) {
    milestones.push({
      id: `m-auto-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Active Contributor',
      description: 'Surpassed 500 operational interactions within the intelligence layer.',
      type: 'operational'
    });
  }
  
  return milestones;
};
