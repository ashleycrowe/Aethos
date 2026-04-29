/**
 * Aethos Document Control - Approval Workflow Timeline
 * 
 * Visual timeline showing approval stages and progress
 */

import React from 'react';
import { CheckCircle2, Clock, XCircle, Circle, AlertTriangle, User } from 'lucide-react';
import { ApprovalWorkflow, ApprovalStage, ApprovalStatus } from '../types/document-control.types';
import { DEMO_USERS } from '../utils/mockData';

interface ApprovalWorkflowTimelineProps {
  workflow: ApprovalWorkflow;
  currentStageIndex?: number;
  approvalStatuses?: Map<string, ApprovalStatus>; // stage ID -> status
}

export const ApprovalWorkflowTimeline: React.FC<ApprovalWorkflowTimelineProps> = ({
  workflow,
  currentStageIndex = 0,
  approvalStatuses = new Map(),
}) => {
  const getStageStatus = (stage: ApprovalStage, index: number): 'completed' | 'current' | 'pending' | 'rejected' => {
    const status = approvalStatuses.get(stage.id);
    
    if (status === ApprovalStatus.REJECTED) {
      return 'rejected';
    }
    
    if (status === ApprovalStatus.APPROVED) {
      return 'completed';
    }
    
    if (index < currentStageIndex) {
      return 'completed';
    }
    
    if (index === currentStageIndex) {
      return 'current';
    }
    
    return 'pending';
  };

  const getStatusConfig = (status: 'completed' | 'current' | 'pending' | 'rejected') => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle2 className="w-6 h-6" />,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/50',
          lineColor: 'bg-emerald-500',
        };
      case 'current':
        return {
          icon: <Clock className="w-6 h-6 animate-pulse" />,
          color: 'text-[#00F0FF]',
          bgColor: 'bg-[#00F0FF]/20',
          borderColor: 'border-[#00F0FF]/50',
          lineColor: 'bg-white/20',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-6 h-6" />,
          color: 'text-[#FF5733]',
          bgColor: 'bg-[#FF5733]/20',
          borderColor: 'border-[#FF5733]/50',
          lineColor: 'bg-white/20',
        };
      case 'pending':
        return {
          icon: <Circle className="w-6 h-6" />,
          color: 'text-white/40',
          bgColor: 'bg-white/5',
          borderColor: 'border-white/20',
          lineColor: 'bg-white/20',
        };
    }
  };

  const calculateProgress = (): number => {
    const totalStages = workflow.stages.length;
    if (totalStages === 0) return 0;
    return Math.round((currentStageIndex / totalStages) * 100);
  };

  const calculateAverageTime = (): string => {
    // Mock data - in real implementation, calculate from historical data
    return '4.2 days';
  };

  const getCurrentStageDuration = (): string => {
    // Mock data - in real implementation, calculate from current stage start time
    return '2 days';
  };

  const getSLAStatus = (): 'on_track' | 'at_risk' | 'overdue' => {
    const currentStage = workflow.stages[currentStageIndex];
    if (!currentStage || !currentStage.slaDays) return 'on_track';
    
    // Mock logic - in reality, compare current duration to SLA
    const currentDays = 2; // Mock
    if (currentDays > currentStage.slaDays) return 'overdue';
    if (currentDays > currentStage.slaDays * 0.8) return 'at_risk';
    return 'on_track';
  };

  const slaStatus = getSLAStatus();

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{workflow.name}</h3>
        {workflow.description && (
          <p className="text-sm text-white/60">{workflow.description}</p>
        )}
      </div>

      {/* Overall Progress */}
      <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/60">Overall Progress</span>
          <span className="text-lg font-bold text-[#00F0FF]">
            Stage {currentStageIndex + 1} of {workflow.stages.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#00F0FF] to-emerald-400 transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <div className="text-white/50 mb-1">Average Time</div>
            <div className="text-white font-semibold">{calculateAverageTime()}</div>
          </div>
          <div>
            <div className="text-white/50 mb-1">Current Stage</div>
            <div className="text-white font-semibold">{getCurrentStageDuration()}</div>
          </div>
          <div>
            <div className="text-white/50 mb-1">SLA Status</div>
            <div className={`font-semibold ${
              slaStatus === 'on_track' ? 'text-emerald-400' :
              slaStatus === 'at_risk' ? 'text-amber-400' :
              'text-[#FF5733]'
            }`}>
              {slaStatus === 'on_track' ? '✓ On Track' :
               slaStatus === 'at_risk' ? '⚠️ At Risk' :
               '🔴 Overdue'}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {workflow.stages.map((stage, index) => {
          const status = getStageStatus(stage, index);
          const config = getStatusConfig(status);
          const isLast = index === workflow.stages.length - 1;

          return (
            <div key={stage.id} className="relative">
              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute left-[15px] top-[48px] w-0.5 h-[calc(100%+24px)] ${config.lineColor}`}
                />
              )}

              {/* Stage Card */}
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center flex-shrink-0 z-10`}
                >
                  <div className={config.color}>{config.icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className={`backdrop-blur-xl bg-white/5 border ${
                    status === 'current' ? 'border-[#00F0FF]/50' : 'border-white/10'
                  } rounded-xl p-4`}>
                    {/* Stage Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white">{stage.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${config.bgColor} ${config.color} border ${config.borderColor} uppercase tracking-wider`}>
                            {status}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          Stage {index + 1} · {stage.type.replace('_', ' ')}
                        </div>
                      </div>
                      
                      {stage.slaDays && (
                        <div className="text-right">
                          <div className="text-xs text-white/50 mb-1">SLA</div>
                          <div className="text-sm font-semibold text-white">{stage.slaDays} days</div>
                        </div>
                      )}
                    </div>

                    {/* Approvers */}
                    <div className="space-y-2">
                      <div className="text-xs text-white/50 mb-2">
                        Approvers ({stage.requiredApprovals} required):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {stage.approvers.map(approverId => {
                          const user = DEMO_USERS.find(u => u.id === approverId);
                          if (!user) return null;
                          
                          return (
                            <div
                              key={approverId}
                              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5"
                            >
                              <User className="w-3.5 h-3.5 text-white/60" />
                              <div>
                                <div className="text-xs font-semibold text-white">{user.name}</div>
                                <div className="text-xs text-white/50">{user.department}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Suggested Approvers */}
                    {stage.aiSuggestedApprovers && stage.aiSuggestedApprovers.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#00F0FF]" />
                          <span>AI suggests adding these reviewers:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {stage.aiSuggestedApprovers.map(approverId => {
                            const user = DEMO_USERS.find(u => u.id === approverId);
                            if (!user) return null;
                            
                            return (
                              <span
                                key={approverId}
                                className="text-xs bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-lg px-2 py-1"
                              >
                                {user.name} ({user.department})
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Comments Toggle */}
                    {stage.allowComments && (
                      <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Comments {stage.requireComments ? 'required' : 'allowed'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {currentStageIndex < workflow.stages.length && (
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="text-sm text-white/60">
            {workflow.allowDelegation && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Delegation allowed
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/5 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold">
              View Comments
            </button>
            <button className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-colors text-sm font-semibold">
              Escalate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
