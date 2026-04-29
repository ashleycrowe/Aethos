import React, { createContext, useContext, useState } from 'react';

export type NotificationType = 'waste' | 'security' | 'sync' | 'governance' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  insight: string;
  narrative: string;
  actionLabel: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'clarity-01',
      type: 'governance',
      priority: 'high',
      title: 'Clarity Response: Sarah Chen',
      insight: 'Owner has responded to the clarity request for "Q4_Strategy_Final_V2.pptx".',
      narrative: 'Sarah Chen has confirmed this artifact is "Legacy Reference Only." Aethos recommends immediate archival to Cold Tier as utility score is < 15%.',
      actionLabel: 'Review Justification',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isRead: false
    },
    {
      id: '1',
      type: 'waste',
      priority: 'high',
      title: 'Operational Inefficiency Identified',
      insight: 'SharePoint storage in "Project Alpha" has exceeded the 90-day inactivity threshold.',
      narrative: 'This container holds 4.2TB of "Dead Capital" that continues to consume high-tier storage credits without generating business value. Operational clarity requires transition to Cold Tier.',
      actionLabel: 'Initialize Archival Protocol',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      metadata: { wasteAmount: 450, workspace: 'Project Alpha' }
    },
    {
      id: 'shadow-01',
      type: 'waste',
      priority: 'medium',
      title: 'Shadow Discovery: Dead Capital',
      insight: 'Orphaned Box artifacts identified with zero interaction in 730 days.',
      narrative: 'These artifacts exist outside your core anchors. Remediation path is "Alert & Redirect" to Governance_Vault to stop storage waste leakage.',
      actionLabel: 'Redirect to Vault',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
      isRead: false
    },
    {
      id: '2',
      type: 'security',
      priority: 'critical',
      title: 'Anomalous Exposure Spike',
      insight: 'External sharing links in "Finance Core" have increased by 240% in the last 2 hours.',
      narrative: 'Sudden external exposure spikes often indicate accidental document leakage or unauthorized data exfiltration attempts. Immediate audit required to secure operational anchors.',
      actionLabel: 'Revoke External Access',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false
    },
    {
      id: 'oracle-01',
      type: 'system',
      priority: 'medium',
      title: 'Oracle Synthesis Complete',
      insight: 'Predictive analysis identified 14 redundant budget spreadsheets across 3 providers.',
      narrative: 'Reducing multi-source redundancy improves "Decision Integrity." Aethos recommends consolidating these into a single Pinned Insight in the Alpha Workspace.',
      actionLabel: 'View Redundancy Report',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      isRead: false
    },
    {
      id: '3',
      type: 'governance',
      priority: 'medium',
      title: 'Orphaned Identity Detected',
      insight: 'Former employee "Sarah Jenkins" still retains Architect-level access to 12 Box folders.',
      narrative: 'Orphaned accounts create security backdoors. Revoking this access restores identity governance integrity and ensures only active architects can influence the workspace.',
      actionLabel: 'Acknowledge & Revoke',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true
    },
    {
      id: 'sync-01',
      type: 'sync',
      priority: 'low',
      title: 'Universal Adapter Pulse',
      insight: 'M365 Tenant "Production-Alpha" successfully re-indexed 42,000 artifacts.',
      narrative: 'Active synchronization ensures the Oracle has a high-fidelity view of the operational landscape. Search latency reduced by 140ms.',
      actionLabel: 'View Sync Stats',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
      isRead: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
