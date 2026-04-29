import React from 'react';
import { useVersion } from '../context/VersionContext';
import { RemediationCenter as RemediationCenterV1 } from './RemediationCenterV1';

export const RemediationCenter: React.FC = () => {
  const { version } = useVersion();
  
  // V1, V1.5, V2 all use the same basic remediation
  // V3+ would use advanced version (not built yet)
  return <RemediationCenterV1 />;
};