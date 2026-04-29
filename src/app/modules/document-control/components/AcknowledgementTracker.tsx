/**
 * Aethos Document Control - Acknowledgement Tracker
 * 
 * Track who has read and acknowledged documents (compliance)
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Mail,
  Search,
  Filter,
  Download,
  User,
} from 'lucide-react';
import {
  DocumentAcknowledgement,
  AcknowledgementStatus,
  ControlledDocument,
} from '../types/document-control.types';
import { DEMO_USERS, generateMockAcknowledgements } from '../utils/mockData';

interface AcknowledgementTrackerProps {
  document: ControlledDocument;
}

export const AcknowledgementTracker: React.FC<AcknowledgementTrackerProps> = ({ document }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AcknowledgementStatus | 'all'>('all');

  // Generate mock acknowledgements
  const acknowledgements = generateMockAcknowledgements(document.id);

  // Calculate statistics
  const stats = {
    total: acknowledgements.length,
    acknowledged: acknowledgements.filter(a => a.status === AcknowledgementStatus.ACKNOWLEDGED).length,
    pending: acknowledgements.filter(a => a.status === AcknowledgementStatus.PENDING).length,
    overdue: acknowledgements.filter(a => a.status === AcknowledgementStatus.OVERDUE).length,
  };

  const acknowledgementRate = stats.total > 0 ? (stats.acknowledged / stats.total) * 100 : 0;

  // Filter acknowledgements
  const filteredAcknowledgements = acknowledgements.filter(ack => {
    const user = DEMO_USERS.find(u => u.id === ack.userId);
    if (!user) return false;

    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || ack.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusConfig = (status: AcknowledgementStatus) => {
    switch (status) {
      case AcknowledgementStatus.ACKNOWLEDGED:
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'Acknowledged',
          bgColor: 'bg-emerald-500/10',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
        };
      case AcknowledgementStatus.PENDING:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'Pending',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
        };
      case AcknowledgementStatus.OVERDUE:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Overdue',
          bgColor: 'bg-[#FF5733]/10',
          textColor: 'text-[#FF5733]',
          borderColor: 'border-[#FF5733]/30',
        };
      default:
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: 'Not Sent',
          bgColor: 'bg-white/5',
          textColor: 'text-white/60',
          borderColor: 'border-white/10',
        };
    }
  };

  const sendReminders = () => {
    const pendingUsers = filteredAcknowledgements.filter(
      ack => ack.status === AcknowledgementStatus.PENDING || ack.status === AcknowledgementStatus.OVERDUE
    );
    console.log('Sending reminders to:', pendingUsers.length, 'users');
    // In real implementation, call API to send reminder emails
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Acknowledgement Tracking</h3>
          <p className="text-sm text-white/60">
            {document.documentNumber} · {document.title}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={sendReminders}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-colors text-sm font-semibold"
          >
            <Mail className="w-4 h-4" />
            Send Reminders
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Acknowledgement Rate</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-[#00F0FF]">
              {Math.round(acknowledgementRate)}%
            </div>
          </div>
          <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00F0FF] transition-all duration-500"
              style={{ width: `${acknowledgementRate}%` }}
            />
          </div>
        </div>

        <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-sm text-emerald-400/80 mb-1">Acknowledged</div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-emerald-400">{stats.acknowledged}</div>
            <div className="text-sm text-emerald-400/60">/ {stats.total}</div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="text-sm text-amber-400/80 mb-1">Pending</div>
          <div className="text-3xl font-black text-amber-400">{stats.pending}</div>
        </div>

        <div className="backdrop-blur-xl bg-[#FF5733]/10 border border-[#FF5733]/30 rounded-xl p-4">
          <div className="text-sm text-[#FF5733]/80 mb-1">Overdue</div>
          <div className="text-3xl font-black text-[#FF5733]">{stats.overdue}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1F2E] text-white border border-white/10 rounded-xl pl-10 pr-4 py-2.5 placeholder:text-white/40 focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AcknowledgementStatus | 'all')}
            className="appearance-none bg-[#1A1F2E] text-white border border-white/10 rounded-xl pl-10 pr-10 py-2.5 cursor-pointer focus:border-[#00F0FF]/50 focus:ring-2 focus:ring-[#00F0FF]/20 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value={AcknowledgementStatus.ACKNOWLEDGED}>Acknowledged</option>
            <option value={AcknowledgementStatus.PENDING}>Pending</option>
            <option value={AcknowledgementStatus.OVERDUE}>Overdue</option>
          </select>
        </div>
      </div>

      {/* Acknowledgement List */}
      <div className="space-y-2">
        {filteredAcknowledgements.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            <User className="w-12 h-12 mx-auto mb-3 text-white/30" />
            <p>No users match the current filters</p>
          </div>
        ) : (
          filteredAcknowledgements.map(ack => {
            const user = DEMO_USERS.find(u => u.id === ack.userId);
            if (!user) return null;

            const config = getStatusConfig(ack.status);

            return (
              <div
                key={ack.id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#00F0FF]/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#00F0FF]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-0.5">{user.name}</div>
                      <div className="text-xs text-white/50">
                        {user.email} · {user.department}
                      </div>
                    </div>
                  </div>

                  {/* Status & Dates */}
                  <div className="flex items-center gap-6">
                    {/* Dates */}
                    <div className="text-right">
                      <div className="text-xs text-white/50 mb-1">
                        {ack.status === AcknowledgementStatus.ACKNOWLEDGED ? 'Acknowledged' : 'Due Date'}
                      </div>
                      <div className="text-sm text-white">
                        {ack.acknowledgedAt
                          ? new Date(ack.acknowledgedAt).toLocaleDateString()
                          : ack.dueDate
                          ? new Date(ack.dueDate).toLocaleDateString()
                          : '—'}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 ${config.bgColor} ${config.textColor} border ${config.borderColor} rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider`}
                    >
                      {config.icon}
                      {config.label}
                    </span>
                  </div>
                </div>

                {/* Training Status */}
                {ack.isTrainingRequired && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/60">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Training Required</span>
                    </div>
                    {ack.trainingCompleted ? (
                      <div className="text-emerald-400">
                        ✓ Completed on {new Date(ack.trainingCompletedAt!).toLocaleDateString()}
                      </div>
                    ) : (
                      <div className="text-amber-400">⏳ Pending</div>
                    )}
                  </div>
                )}

                {/* Digital Signature */}
                {ack.signature && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      Digital signature verified ({ack.signatureMethod})
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-sm">
        <div className="text-white/60">
          Showing {filteredAcknowledgements.length} of {acknowledgements.length} users
        </div>
        {acknowledgementRate < 90 && (
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Target acknowledgement rate: 90%</span>
          </div>
        )}
      </div>
    </div>
  );
};
