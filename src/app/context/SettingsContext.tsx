import React, { createContext, useContext, useState } from 'react';

export interface InterfaceSettings {
  cinematicBlur: boolean;
  motionFidelity: boolean;
  highClarityMode: boolean; // Daylight
}

export interface NotificationSettings {
  intelligenceSummary: boolean;
  securityCritical: boolean;
  syncResilience: boolean;
  operationalDrifts: boolean;
}

interface GovernanceOverrides {
  forceLowMotion: boolean;
  disableHighFidelity: boolean;
}

interface SettingsContextType {
  settings: InterfaceSettings;
  notifications: NotificationSettings;
  governance: GovernanceOverrides;
  updateSetting: (key: keyof InterfaceSettings, value: boolean) => void;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => void;
  updateGovernance: (key: keyof GovernanceOverrides, value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<InterfaceSettings>({
    cinematicBlur: true,
    motionFidelity: true,
    highClarityMode: false,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    intelligenceSummary: true,
    securityCritical: true,
    syncResilience: false,
    operationalDrifts: true,
  });

  const [governance, setGovernance] = useState<GovernanceOverrides>({
    forceLowMotion: false,
    disableHighFidelity: false,
  });

  const updateSetting = (key: keyof InterfaceSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const updateGovernance = (key: keyof GovernanceOverrides, value: boolean) => {
    setGovernance(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      notifications, 
      governance,
      updateSetting, 
      updateNotification,
      updateGovernance
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    // Return safe defaults to prevent crashing in isolated previews
    return {
      settings: { cinematicBlur: true, motionFidelity: true, highClarityMode: false },
      notifications: { intelligenceSummary: true, securityCritical: true, syncResilience: false, operationalDrifts: true },
      governance: { forceLowMotion: false, disableHighFidelity: false },
      updateSetting: () => {},
      updateNotification: () => {},
      updateGovernance: () => {}
    };
  }
  return context;
};
