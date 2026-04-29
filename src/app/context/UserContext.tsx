import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ARCHITECT' | 'CURATOR' | 'AUDITOR' | 'VIEWER';
export type LicenseTier = 'AI_PLUS' | 'BASE' | 'TRIAL';

interface UserState {
  id: string;
  name: string;
  role: string;
  actualRole: UserRole;
  tier: LicenseTier;
  permissions: {
    canCreateWorkspace: boolean;
    canAddNotes: boolean;
    canPinAssets: boolean;
    canAccessDashboard: boolean;
    canUpload: boolean;
    canDelete: boolean;
    canArchive: boolean;
    canUseAiFeatures: boolean; // AI+ tier feature
    canReadFileContent: boolean; // AI+ tier feature
  };
}

interface UserContextType {
  user: UserState;
  setRole: (role: UserRole) => void;
  setTier: (tier: LicenseTier) => void;
}

const getPermissions = (role: UserRole, tier: LicenseTier) => {
  const isArchitect = role === 'ARCHITECT';
  const isCurator = role === 'CURATOR';
  const isAuditor = role === 'AUDITOR';
  const isAiPlus = tier === 'AI_PLUS';
  const hasBaseTier = tier === 'BASE' || tier === 'AI_PLUS';

  return {
    canCreateWorkspace: (isArchitect || isCurator) && hasBaseTier,
    canAddNotes: hasBaseTier,
    canPinAssets: hasBaseTier,
    canAccessDashboard: hasBaseTier,
    canUpload: (isArchitect || isCurator) && hasBaseTier,
    canDelete: isArchitect && hasBaseTier,
    canArchive: (isArchitect || isCurator) && hasBaseTier,
    canUseAiFeatures: isAiPlus,
    canReadFileContent: isAiPlus,
  };
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('ARCHITECT');
  const [tier, setTierState] = useState<LicenseTier>('AI_PLUS');

  const roleDisplay: Record<UserRole, string> = {
    'ARCHITECT': 'Operational Architect',
    'CURATOR': 'Content Curator',
    'AUDITOR': 'Governance Auditor',
    'VIEWER': 'Intelligence Consumer'
  };

  const user: UserState = {
    id: 'id-001',
    name: 'Sarah Chen',
    role: roleDisplay[role],
    actualRole: role,
    tier,
    permissions: getPermissions(role, tier),
  };

  const setRole = (newRole: UserRole) => setRoleState(newRole);
  const setTier = (newTier: LicenseTier) => setTierState(newTier);

  return (
    <UserContext.Provider value={{ user, setRole, setTier }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};