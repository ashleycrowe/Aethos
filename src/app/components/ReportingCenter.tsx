import React from 'react';
import { useVersion } from '../context/VersionContext';
import { ReportingCenter as ReportingCenterV1 } from './ReportingCenterV1';

export const ReportingCenter: React.FC = () => {
  const { version } = useVersion();
  
  // V1, V1.5, V2 all use the same basic reporting
  // V3+ would add predictive analytics (not built yet)
  return <ReportingCenterV1 />;
};