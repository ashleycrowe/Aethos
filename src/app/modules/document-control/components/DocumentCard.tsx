/**
 * Aethos Document Control - Document Card Component
 * 
 * Displays individual controlled document with health score
 */

import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Archive,
  XCircle,
  Eye,
  Download,
  Edit,
  MoreVertical,
  FileCheck,
} from 'lucide-react';
import {
  ControlledDocument,
  DocumentStatus,
  HealthScoreLevel,
  DocumentType,
} from '../types/document-control.types';

interface DocumentCardProps {
  document: ControlledDocument;
  showLibrary?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  showLibrary = false,
}) => {
  const getStatusConfig = () => {
    switch (document.status) {
      case DocumentStatus.DRAFT:
        return {
          icon: <FileText className="w-4 h-4" />,
          label: 'Draft',
          bgColor: 'bg-slate-500/10',
          textColor: 'text-slate-400',
          borderColor: 'border-slate-500/30',
        };
      case DocumentStatus.IN_REVIEW:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'In Review',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
        };
      case DocumentStatus.APPROVED:
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'Approved',
          bgColor: 'bg-emerald-500/10',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
        };
      case DocumentStatus.PUBLISHED:
        return {
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: 'Published',
          bgColor: 'bg-[#00F0FF]/10',
          textColor: 'text-[#00F0FF]',
          borderColor: 'border-[#00F0FF]/30',
        };
      case DocumentStatus.ARCHIVED:
        return {
          icon: <Archive className="w-4 h-4" />,
          label: 'Archived',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/30',
        };
      case DocumentStatus.EXPIRED:
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: 'Expired',
          bgColor: 'bg-[#FF5733]/10',
          textColor: 'text-[#FF5733]',
          borderColor: 'border-[#FF5733]/30',
        };
      case DocumentStatus.REJECTED:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Rejected',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
        };
      default:
        return {
          icon: <FileText className="w-4 h-4" />,
          label: 'Unknown',
          bgColor: 'bg-white/5',
          textColor: 'text-white/60',
          borderColor: 'border-white/10',
        };
    }
  };

  const getHealthScoreColor = () => {
    switch (document.healthScoreLevel) {
      case HealthScoreLevel.EXCELLENT:
        return 'text-emerald-400';
      case HealthScoreLevel.GOOD:
        return 'text-[#00F0FF]';
      case HealthScoreLevel.FAIR:
        return 'text-amber-400';
      case HealthScoreLevel.POOR:
        return 'text-orange-400';
      case HealthScoreLevel.CRITICAL:
        return 'text-[#FF5733]';
      default:
        return 'text-white/60';
    }
  };

  const getHealthScoreLabel = () => {
    switch (document.healthScoreLevel) {
      case HealthScoreLevel.EXCELLENT:
        return '✅ Excellent';
      case HealthScoreLevel.GOOD:
        return '✓ Good';
      case HealthScoreLevel.FAIR:
        return '⚠️ Fair';
      case HealthScoreLevel.POOR:
        return '⚠️ Poor';
      case HealthScoreLevel.CRITICAL:
        return '🔴 Critical';
      default:
        return '—';
    }
  };

  const getTypeIcon = () => {
    switch (document.type) {
      case DocumentType.POLICY:
        return '📋';
      case DocumentType.SOP:
        return '📘';
      case DocumentType.FORM:
        return '📝';
      case DocumentType.WORK_INSTRUCTION:
        return '🔧';
      case DocumentType.TRAINING_MATERIAL:
        return '🎓';
      default:
        return '📄';
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00F0FF]/50 hover:bg-white/10 transition-all duration-200 group"
    >
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getTypeIcon()}</span>
            <span className="text-xs font-mono text-white/50">
              {document.documentNumber}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-2">
            {document.title}
          </h3>
        </div>
        
        {/* Status Badge */}
        <span
          className={`flex items-center gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </div>

      {/* Document Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
        <div>
          Version: <span className="text-white font-mono">{document.currentVersion}</span>
        </div>
        {document.category && (
          <div>
            <span className="text-white/40">•</span>
            <span className="ml-2">{document.category}</span>
          </div>
        )}
        {document.department && (
          <div>
            <span className="text-white/40">•</span>
            <span className="ml-2">{document.department}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {document.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="bg-white/5 text-white/60 text-xs px-2 py-1 rounded-lg"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="text-xs text-white/40">+{document.tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Health Score */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Health Score</span>
          <span className={`text-sm font-bold ${getHealthScoreColor()}`}>
            {getHealthScoreLabel()}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 ${
              document.healthScoreLevel === HealthScoreLevel.EXCELLENT
                ? 'bg-emerald-400'
                : document.healthScoreLevel === HealthScoreLevel.GOOD
                ? 'bg-[#00F0FF]'
                : document.healthScoreLevel === HealthScoreLevel.FAIR
                ? 'bg-amber-400'
                : document.healthScoreLevel === HealthScoreLevel.POOR
                ? 'bg-orange-400'
                : 'bg-[#FF5733]'
            }`}
            style={{ width: `${document.healthScore}%` }}
          />
        </div>
        
        <div className="text-xs text-white/50">{document.healthScore}% / 100%</div>

        {/* Health Issues */}
        {document.healthIssues && document.healthIssues.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            {document.healthIssues.slice(0, 2).map((issue, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-white/60 mb-1">
                <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
            {document.healthIssues.length > 2 && (
              <div className="text-xs text-white/40 mt-1">
                +{document.healthIssues.length - 2} more issues
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        {document.publishedDate && (
          <div>
            <div className="text-white/50 mb-1">Published</div>
            <div className="text-white">{new Date(document.publishedDate).toLocaleDateString()}</div>
          </div>
        )}
        {document.nextReviewDate && (
          <div>
            <div className="text-white/50 mb-1">Next Review</div>
            <div className="text-white">{new Date(document.nextReviewDate).toLocaleDateString()}</div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {document.requiresAcknowledgement && (
            <div
              className="flex items-center gap-1 text-xs text-white/50"
              title="Acknowledgement required"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Ack Required</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('View document:', document.id);
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="View document"
          >
            <Eye className="w-4 h-4 text-white/60" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Download document:', document.id);
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="Download document"
          >
            <Download className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
};