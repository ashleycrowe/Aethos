import React, { useState } from 'react';
import { 
  Zap, 
  Camera, 
  MessageSquare,
  Bell,
  TrendingUp,
  Users,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { OperationalPulse } from './OperationalPulse';
import { WorkInstagram } from './WorkInstagram';

type PulseView = 'feed' | 'gallery' | 'notifications';

export const PulseBridge = () => {
  const { isDaylight } = useTheme();
  const [activeView, setActiveView] = useState<PulseView>('feed');

  const views = [
    { id: 'feed' as PulseView, label: 'Feed', icon: MessageSquare, description: 'Communication stream' },
    { id: 'gallery' as PulseView, label: 'Gallery', icon: Camera, description: 'Visual updates' },
    { id: 'notifications' as PulseView, label: 'Notifications', icon: Bell, description: 'Activity alerts' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'gallery':
        return <WorkInstagram />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return <OperationalPulse />;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header with View Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              Communication Center
            </h2>
          </div>
          <h1 className={`text-4xl font-black uppercase tracking-tighter ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
            <span className="text-[#00F0FF]">Pulse</span> Bridge
          </h1>
          <p className="text-xs text-[#94A3B8] italic">
            Bridge communication gaps across your organization
          </p>
        </div>

        {/* View Tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-xl ${
          isDaylight ? 'bg-slate-100' : 'bg-white/5 border border-white/10'
        }`}>
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeView === view.id
                  ? 'bg-[#00F0FF] text-[#0B0F19]'
                  : isDaylight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <view.icon className="w-4 h-4" />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderView()}
          </Motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const NotificationsView = () => {
  const { isDaylight } = useTheme();

  const notifications = [
    {
      id: 1,
      type: 'engagement',
      icon: Heart,
      title: 'Sarah Chen liked your post',
      message: 'Project Phoenix Q1 Update',
      time: '5m ago',
      read: false
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageCircle,
      title: 'New comment on "Budget Review"',
      message: 'Marcus Thompson: "Great insights on the cost analysis"',
      time: '12m ago',
      read: false
    },
    {
      id: 3,
      type: 'share',
      icon: Share2,
      title: 'Your post was shared',
      message: 'Rachel Kim shared "Q4 Roadmap" to Product Team',
      time: '1h ago',
      read: true
    },
    {
      id: 4,
      type: 'mention',
      icon: Users,
      title: 'You were mentioned',
      message: 'Alex Rivera mentioned you in "Sprint Planning Notes"',
      time: '2h ago',
      read: true
    },
    {
      id: 5,
      type: 'trending',
      icon: TrendingUp,
      title: 'Your post is trending',
      message: '"New Workspace Architecture" has 47 reactions',
      time: '3h ago',
      read: true
    },
  ];

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            All Notifications
          </h3>
          <button className="text-xs font-bold text-[#00F0FF] hover:underline uppercase tracking-widest">
            Mark all read
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 rounded-2xl transition-all cursor-pointer group ${
                notification.read
                  ? isDaylight 
                    ? 'bg-slate-50/50' 
                    : 'bg-white/[0.02]'
                  : isDaylight
                  ? 'bg-blue-50 border border-blue-100'
                  : 'bg-[#00F0FF]/5 border border-[#00F0FF]/20'
              } hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  notification.read 
                    ? 'bg-slate-200 dark:bg-white/10' 
                    : 'bg-[#00F0FF]/20'
                }`}>
                  <notification.icon className={`w-5 h-5 ${
                    notification.read ? 'text-slate-500' : 'text-[#00F0FF]'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className={`text-sm font-bold ${
                      isDaylight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {notification.title}
                    </h4>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                      <span className="text-[9px] font-black text-[#00F0FF] uppercase tracking-widest">
                        NEW
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};