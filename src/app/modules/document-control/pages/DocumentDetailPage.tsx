/**
 * Aethos Document Control - Document Detail Page
 * 
 * Complete view of a controlled document with all metadata, versions, and approvals
 */

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  Download,
  Eye,
  Edit,
  Archive,
  Send,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  GitBranch,
  Shield,
  MoreVertical,
} from 'lucide-react';
import {
  ApprovalWorkflowTimeline,
  VersionHistoryTree,
  AcknowledgementTracker,
} from '../components';
import { useDocumentControl } from '../context/DocumentControlContext';
import { MOCK_WORKFLOWS } from '../utils/mockData';
import { DocumentVersion } from '../types/document-control.types';

type TabType = 'overview' | 'versions' | 'approval' | 'acknowledgements';

export const DocumentDetailPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { documents, libraries } = useDocumentControl();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const document = documents.find(doc => doc.id === documentId);
  const library = document ? libraries.find(lib => lib.id === document.libraryId) : undefined;

  // Mock version data (in real app, fetch from API)
  const mockVersions: DocumentVersion[] = document
    ? [
        {
          id: 'ver-1-3',
          documentId: document.id,
          libraryId: document.libraryId,
          tenantId: document.tenantId,
          version: '3.2',
          versionNumber: 3,
          isCurrent: true,
          changeDescription: 'Updated remote work eligibility criteria and added hybrid schedule examples',
          changeType: 'minor',
          sourceFileId: document.sourceFileId,
          sourceFileName: document.sourceFileName,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          approvalStatus: 'approved',
          approvedBy: 'user-4',
          approvedAt: document.approvedDate,
          createdBy: 'user-1',
          createdAt: new Date('2026-02-10'),
        },
        {
          id: 'ver-1-2',
          documentId: document.id,
          libraryId: document.libraryId,
          tenantId: document.tenantId,
          version: '3.1',
          versionNumber: 2,
          isCurrent: false,
          changeDescription: 'Minor clarifications to equipment reimbursement policy',
          changeType: 'patch',
          sourceFileName: 'Remote_Work_Policy_v3.1.docx',
          fileSize: 240000,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          approvalStatus: 'approved',
          approvedBy: 'user-4',
          approvedAt: new Date('2026-01-15'),
          createdBy: 'user-1',
          createdAt: new Date('2026-01-10'),
          parentVersionId: 'ver-1-1',
        },
        {
          id: 'ver-1-1',
          documentId: document.id,
          libraryId: document.libraryId,
          tenantId: document.tenantId,
          version: '3.0',
          versionNumber: 1,
          isCurrent: false,
          changeDescription: 'Major revision: Added hybrid work schedules and security requirements',
          changeType: 'major',
          sourceFileName: 'Remote_Work_Policy_v3.0.docx',
          fileSize: 235000,
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          approvalStatus: 'approved',
          approvedBy: 'user-4',
          approvedAt: new Date('2025-12-01'),
          createdBy: 'user-1',
          createdAt: new Date('2025-11-20'),
        },
      ]
    : [];

  const workflow = library ? MOCK_WORKFLOWS.find(w => w.libraryId === library.id) : undefined;

  if (!document || !library) {
    return (
      <div className="min-h-screen bg-[#0B0F19] p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <h2 className="text-2xl font-bold text-white mb-2">Document Not Found</h2>
          <p className="text-white/60 mb-6">The requested document could not be found.</p>
          <button
            onClick={() => navigate('/document-control')}
            className="bg-[#00F0FF] text-black font-black uppercase px-6 py-3 rounded-2xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'versions', label: 'Version History', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'approval', label: 'Approval Workflow', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'acknowledgements', label: 'Acknowledgements', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8">
      {/* Header */}
      <header className="mb-8">
        <button
          onClick={() => navigate(`/document-control/libraries/${library.id}`)}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {library.name}
        </button>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          {/* Document Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 flex items-center justify-center text-3xl">
                {document.type === 'policy' ? '📋' : '📘'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-white">{document.title}</h1>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    document.status === 'published'
                      ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                      : document.status === 'in_review'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-white/60 border border-white/10'
                  }`}>
                    {document.status === 'published' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {document.status === 'in_review' && <Clock className="w-3.5 h-3.5" />}
                    {document.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                  <span className="font-mono text-[#00F0FF]">{document.documentNumber}</span>
                  <span>•</span>
                  <span>Version {document.currentVersion}</span>
                  <span>•</span>
                  <span className="capitalize">{document.type.replace('_', ' ')}</span>
                  {document.category && (
                    <>
                      <span>•</span>
                      <span>{document.category}</span>
                    </>
                  )}
                </div>
                {document.tags && document.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-white/5 text-white/60 text-xs px-2 py-1 rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                className="p-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                title="View Document"
              >
                <Eye className="w-5 h-5 text-white/60" />
              </button>
              <button
                className="p-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-white/60" />
              </button>
              <button
                className="p-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                title="Edit Metadata"
              >
                <Edit className="w-5 h-5 text-white/60" />
              </button>
              <button
                className="p-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors"
                title="More Options"
              >
                <MoreVertical className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {document.status === 'draft' && (
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#00F0FF] text-black font-black uppercase tracking-wider px-6 py-3 rounded-xl">
                <Send className="w-5 h-5" />
                Submit for Approval
              </button>
              <button className="px-6 py-3 bg-white/5 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors font-semibold">
                Save Draft
              </button>
            </div>
          )}

          {document.status === 'approved' && (
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-[#00F0FF] text-black font-black uppercase tracking-wider px-6 py-3 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
                Publish Document
              </button>
              <button className="px-6 py-3 bg-white/5 text-white border border-white/20 rounded-xl hover:bg-white/10 transition-colors font-semibold">
                <Archive className="w-5 h-5 inline mr-2" />
                Archive
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/50'
                  : 'text-white/60 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Health Score */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-[#00F0FF]" />
                <h3 className="text-lg font-bold text-white">Health Score</h3>
              </div>
              <div className="text-5xl font-black text-[#00F0FF] mb-2">{document.healthScore}%</div>
              <div className="text-sm text-white/60 mb-4">{document.healthScoreLevel}</div>
              {document.healthIssues && document.healthIssues.length > 0 && (
                <div className="space-y-2">
                  {document.healthIssues.map((issue, index) => (
                    <div key={index} className="text-xs text-white/60 flex items-start gap-2">
                      <span className="text-amber-400">⚠️</span>
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="col-span-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Document Metadata</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-white/50 mb-1">Owner</div>
                  <div className="text-white">{document.owner}</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Department</div>
                  <div className="text-white">{document.department || '—'}</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Created</div>
                  <div className="text-white">{new Date(document.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-white/50 mb-1">Last Updated</div>
                  <div className="text-white">{new Date(document.updatedAt).toLocaleDateString()}</div>
                </div>
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
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <VersionHistoryTree
            versions={mockVersions}
            currentVersionId={document.versionId}
          />
        )}

        {activeTab === 'approval' && workflow && (
          <ApprovalWorkflowTimeline workflow={workflow} currentStageIndex={1} />
        )}

        {activeTab === 'acknowledgements' && <AcknowledgementTracker document={document} />}
      </div>
    </div>
  );
};
