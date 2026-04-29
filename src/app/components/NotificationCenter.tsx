import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Trash2, 
  CheckCheck, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  RefreshCw, 
  Settings,
  MoreHorizontal,
  ExternalLink,
  Archive,
  Eye,
  Info,
  ChevronRight,
  Zap,
  Fingerprint,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';
import { useNotifications, Notification, NotificationPriority } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const PriorityBadge = ({ priority }: { priority: NotificationPriority }) => {
  const isHigh = priority === 'high' || priority === 'critical';
  
  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[7px] font-black uppercase tracking-[0.2em] ${
      isHigh 
        ? 'bg-[#FF5733]/10 text-[#FF5733] border-[#FF5733]/30' 
        : 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30'
    }`}>
      {isHigh && (
        <Motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1.5 h-1.5 rounded-full bg-[#FF5733] shadow-[0_0_8px_#FF5733]" 
        />
      )}
      {!isHigh && (
         <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
      )}
      {priority}
    </div>
  );
};

const NotificationItem = ({ notification, onAnalyze }: { notification: Notification, onAnalyze: (n: Notification) => void }) => {
  const { markAsRead, deleteNotification } = useNotifications();
  const { isDaylight } = useTheme();

  const getIcon = () => {
    switch (notification.type) {
      case 'waste': return <DollarSign className="w-4 h-4 text-[#FF5733]" />;
      case 'security': return <ShieldAlert className="w-4 h-4 text-[#FF5733]" />;
      case 'sync': return <RefreshCw className={`w-4 h-4 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />;
      case 'governance': return <AlertTriangle className={`w-4 h-4 ${isDaylight ? 'text-slate-900' : 'text-[#00F0FF]'}`} />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const isHighPriority = notification.priority === 'high' || notification.priority === 'critical';

  return (
    <Motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`relative group p-6 rounded-[32px] border transition-all ${
        notification.isRead 
          ? isDaylight ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-white/[0.02] border-white/5 opacity-60'
          : isDaylight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/[0.05] border-white/10'
      } ${!notification.isRead && isHighPriority ? 'ring-1 ring-[#FF5733]/20 shadow-[0_0_30px_rgba(255,87,51,0.05)]' : ''}`}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <PriorityBadge priority={notification.priority} />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-['JetBrains_Mono']">
            {new Intl.RelativeTimeFormat('en', { style: 'short' }).format(-Math.round((Date.now() - notification.timestamp.getTime()) / 60000), 'minute')}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className={`p-3 rounded-2xl shrink-0 ${isDaylight ? 'bg-slate-50' : 'bg-black/40 border border-white/5'}`}>
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-black uppercase tracking-widest leading-tight ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                {notification.title}
              </h4>
              <p className={`text-[11px] font-bold mt-1.5 ${isDaylight ? 'text-slate-700' : 'text-slate-300'}`}>
                {notification.insight}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-slate-50/50 border-slate-100' : 'bg-white/[0.02] border-white/5'}`}>
            <p className={`text-[10px] leading-relaxed italic ${isDaylight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span className="font-black uppercase tracking-widest text-[8px] block mb-1 opacity-50">Narrative Analysis</span>
              {notification.narrative}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                markAsRead(notification.id);
                onAnalyze(notification);
              }}
              className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                isHighPriority 
                  ? 'bg-[#FF5733] text-white shadow-lg shadow-[#FF5733]/20' 
                  : isDaylight ? 'bg-slate-900 text-white' : 'bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {notification.actionLabel}
            </button>
            <button 
              onClick={() => deleteNotification(notification.id)}
              className={`p-3.5 rounded-xl border transition-all ${
                isDaylight ? 'bg-white border-slate-200 text-slate-400 hover:text-[#FF5733]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {!notification.isRead && isHighPriority && (
        <div className="absolute top-4 right-4">
          <Motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-3 h-3 rounded-full bg-[#FF5733] blur-[4px]"
          />
        </div>
      )}
    </Motion.div>
  );
};

export const NotificationCenter = ({ isOpen, onClose, onAnalyze }: { isOpen: boolean, onClose: () => void, onAnalyze: (n: Notification) => void }) => {
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();
  const { isDaylight } = useTheme();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          <Motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 300 }}
            className={`fixed top-0 right-0 bottom-0 w-full max-w-[500px] z-[1001] border-l shadow-2xl flex flex-col pointer-events-auto ${
              isDaylight ? 'bg-white border-slate-200' : 'bg-[#0B0F19] border-white/5'
            }`}
          >
            {/* Intelligence Stream Header */}
            <div className={`p-10 border-b ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-[#00F0FF] text-black shadow-lg shadow-[#00F0FF]/20">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tight mb-1 ${isDaylight ? 'text-slate-900' : 'text-white'}`}>
                      Intelligence Stream
                    </h2>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDaylight ? 'text-slate-500' : 'text-[#00F0FF]'}`}>
                      {unreadCount} Anomalies Requiring Clarity
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-all`}
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className={`flex p-1 rounded-2xl border ${isDaylight ? 'bg-slate-100 border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'}`}>
                  <button 
                    onClick={() => setFilter('all')}
                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      filter === 'all' 
                        ? isDaylight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/15 text-white'
                        : 'text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    Global
                  </button>
                  <button 
                    onClick={() => setFilter('unread')}
                    className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      filter === 'unread' 
                        ? isDaylight ? 'bg-white text-slate-900 shadow-sm' : 'bg-white/15 text-white'
                        : 'text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    Critical
                  </button>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={markAllAsRead}
                    className={`p-3 rounded-xl border transition-all ${isDaylight ? 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm' : 'bg-white/5 border-white/10 text-slate-500 hover:text-[#00F0FF]'}`}
                    title="Acknowledge All"
                  >
                    <CheckCheck className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={clearAll}
                    className={`p-3 rounded-xl border transition-all ${isDaylight ? 'bg-white border-slate-200 text-slate-400 hover:text-[#FF5733] shadow-sm' : 'bg-white/5 border-white/10 text-slate-500 hover:text-[#FF5733]'}`}
                    title="Purge Stream"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stream Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-6 bg-slate-50/50 dark:bg-black/20">
              {filteredNotifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                  <div className={`w-24 h-24 rounded-[40px] border-2 border-dashed flex items-center justify-center mb-8 ${isDaylight ? 'border-slate-200' : 'border-white/10'}`}>
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Stream Synchronized</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Universal Clarity Maintained</p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} onAnalyze={onAnalyze} />
                ))
              )}
            </div>

            {/* Config Footer */}
            <div className={`p-10 border-t ${isDaylight ? 'border-slate-100' : 'border-white/5'}`}>
              <button className={`w-full py-5 rounded-[24px] border flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                isDaylight ? 'bg-slate-900 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}>
                <Settings className="w-5 h-5" />
                Configure Intelligence Layers
              </button>
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
