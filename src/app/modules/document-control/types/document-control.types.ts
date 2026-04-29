/**
 * Aethos Document Control System - TypeScript Types
 * 
 * Complete type definitions for the Document Management Add-On
 * Supports ISO 9001, FDA 21 CFR Part 11, SOC 2, and custom compliance standards
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum DocumentStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SUPERSEDED = 'superseded',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

export enum DocumentType {
  SOP = 'sop', // Standard Operating Procedure
  POLICY = 'policy',
  WORK_INSTRUCTION = 'work_instruction',
  FORM = 'form',
  TRAINING_MATERIAL = 'training_material',
  SPECIFICATION = 'specification',
  PROTOCOL = 'protocol',
  REPORT = 'report',
  OTHER = 'other',
}

export enum LibraryType {
  GENERAL = 'general',
  QUALITY_MANAGEMENT = 'quality_management', // ISO 9001
  REGULATORY = 'regulatory', // FDA 21 CFR Part 11
  SECURITY = 'security', // SOC 2
  HR = 'hr',
  IT = 'it',
  FINANCE = 'finance',
  OPERATIONS = 'operations',
  CUSTOM = 'custom',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELEGATED = 'delegated',
  ESCALATED = 'escalated',
}

export enum ApprovalStageType {
  SEQUENTIAL = 'sequential', // One after another
  PARALLEL = 'parallel', // All at once
  CONDITIONAL = 'conditional', // Based on document properties
}

export enum UserRole {
  DOCUMENT_MANAGER = 'document_manager', // Full control
  APPROVER = 'approver', // Can approve documents
  CONTRIBUTOR = 'contributor', // Can edit drafts
  REVIEWER = 'reviewer', // Can comment only
  VIEWER = 'viewer', // Read-only
}

export enum AcknowledgementStatus {
  NOT_SENT = 'not_sent',
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  OVERDUE = 'overdue',
}

export enum ComplianceStandard {
  ISO_9001 = 'iso_9001',
  FDA_21_CFR_PART_11 = 'fda_21_cfr_part_11',
  SOC_2 = 'soc_2',
  GDPR = 'gdpr',
  HIPAA = 'hipaa',
  GXP = 'gxp',
  NONE = 'none', // No compliance requirement
}

export enum AuditAction {
  CREATED = 'created',
  VIEWED = 'viewed',
  EDITED = 'edited',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DOWNLOADED = 'downloaded',
  ACKNOWLEDGED = 'acknowledged',
  COMMENTED = 'commented',
  SHARED = 'shared',
  DELETED = 'deleted',
}

export enum HealthScoreLevel {
  EXCELLENT = 'excellent', // 90-100%
  GOOD = 'good', // 75-89%
  FAIR = 'fair', // 60-74%
  POOR = 'poor', // 40-59%
  CRITICAL = 'critical', // 0-39%
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface DocumentLibrary {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: LibraryType;
  complianceStandard: ComplianceStandard;
  
  // Numbering Configuration
  numberingPrefix: string; // e.g., "SOP-HR", "POL-IT"
  numberingPattern: string; // e.g., "{prefix}-{year}-{sequence:3}"
  currentSequence: number;
  
  // Access Control
  managers: string[]; // User IDs with full control
  allowedRoles: UserRole[];
  isPrivate: boolean;
  
  // Settings
  requireAcknowledgement: boolean;
  defaultRetentionDays?: number;
  autoArchiveExpired: boolean;
  allowPdfConversion: boolean;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
}

export interface ControlledDocument {
  id: string;
  libraryId: string;
  tenantId: string;
  
  // Identification
  documentNumber: string; // Auto-generated (e.g., "SOP-HR-2026-001")
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  
  // Current Version Info
  currentVersion: string; // e.g., "3.2"
  versionId: string; // Reference to current DocumentVersion
  
  // Classification
  category?: string;
  tags: string[];
  department?: string;
  
  // Ownership
  owner: string; // User ID
  contributors: string[]; // User IDs
  
  // Source File
  sourceProvider: 'microsoft365' | 'google' | 'slack' | 'box' | 'local';
  sourceFileId?: string; // External file reference
  sourceFileName: string;
  sourceFileUrl?: string;
  fileSize: number;
  mimeType: string;
  
  // AI-Generated Metadata
  aiSuggestedTags?: string[];
  aiSuggestedCategory?: string;
  aiSuggestedReviewers?: string[];
  aiContentSummary?: string;
  
  // Compliance
  complianceStandard: ComplianceStandard;
  requiresApproval: boolean;
  requiresAcknowledgement: boolean;
  
  // Lifecycle Dates
  approvedDate?: Date;
  publishedDate?: Date;
  expirationDate?: Date;
  nextReviewDate?: Date;
  
  // Relationships
  supersedes?: string; // Previous document ID
  supersededBy?: string; // Newer document ID
  relatedDocuments: string[]; // Related doc IDs
  
  // Health Score
  healthScore: number; // 0-100
  healthScoreLevel: HealthScoreLevel;
  healthIssues: string[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  libraryId: string;
  tenantId: string;
  
  // Version Info
  version: string; // e.g., "3.2"
  versionNumber: number; // Sequential (1, 2, 3...)
  isCurrent: boolean;
  
  // Change Information
  changeDescription: string; // Required for each version
  changeType: 'minor' | 'major' | 'patch';
  
  // File Information
  sourceFileId?: string;
  sourceFileName: string;
  sourceFileUrl?: string;
  fileSize: number;
  mimeType: string;
  
  // PDF Conversion
  pdfFileId?: string;
  pdfFileUrl?: string;
  
  // Approval Status
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  
  // Lineage (for branching/merging)
  parentVersionId?: string; // Previous version
  branchedFrom?: string; // If created from a branch
  mergedInto?: string; // If merged into another version
}

export interface ApprovalWorkflow {
  id: string;
  libraryId: string;
  tenantId: string;
  
  // Workflow Definition
  name: string;
  description?: string;
  isDefault: boolean; // Auto-apply to new documents?
  
  // Conditions (when to use this workflow)
  documentTypes: DocumentType[]; // Apply to these doc types
  categories?: string[]; // Apply to these categories
  
  // Stages
  stages: ApprovalStage[];
  
  // Settings
  allowDelegation: boolean;
  escalationDays?: number; // Auto-escalate if stalled
  escalationRecipients?: string[]; // Who to notify
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ApprovalStage {
  id: string;
  workflowId: string;
  
  // Stage Info
  name: string; // e.g., "Tech Review", "Legal Review"
  order: number; // Sequence in workflow
  type: ApprovalStageType;
  
  // Approvers
  approvers: string[]; // User IDs
  requiredApprovals: number; // How many approvals needed (for parallel)
  
  // AI Suggestions
  aiSuggestedApprovers?: string[]; // Based on document content
  
  // Settings
  allowComments: boolean;
  requireComments: boolean; // If rejecting
  slaDays?: number; // Expected completion time
  
  // Conditional Logic
  condition?: {
    field: string; // e.g., "documentType", "category"
    operator: 'equals' | 'contains' | 'in';
    value: string | string[];
  };
}

export interface DocumentApproval {
  id: string;
  documentId: string;
  versionId: string;
  workflowId: string;
  stageId: string;
  tenantId: string;
  
  // Approval Info
  approverId: string;
  status: ApprovalStatus;
  comments?: string;
  
  // Timestamps
  requestedAt: Date;
  respondedAt?: Date;
  
  // Delegation
  delegatedTo?: string;
  delegatedAt?: Date;
  delegationReason?: string;
}

export interface DocumentAcknowledgement {
  id: string;
  documentId: string;
  versionId: string;
  tenantId: string;
  
  // Acknowledgement Info
  userId: string;
  status: AcknowledgementStatus;
  
  // Digital Signature (for FDA 21 CFR Part 11)
  signature?: string; // Encrypted signature
  signatureMethod?: 'click' | 'typed_name' | 'digital_certificate';
  ipAddress?: string;
  
  // Timestamps
  sentAt: Date;
  acknowledgedAt?: Date;
  dueDate?: Date;
  
  // Training Context
  isTrainingRequired: boolean;
  trainingCompleted?: boolean;
  trainingCompletedAt?: Date;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  
  // What happened
  action: AuditAction;
  entityType: 'document' | 'library' | 'workflow' | 'acknowledgement';
  entityId: string;
  
  // Who did it
  userId: string;
  userName: string;
  
  // Details
  details: Record<string, any>; // Flexible metadata
  ipAddress?: string;
  userAgent?: string;
  
  // Context
  documentId?: string;
  versionId?: string;
  libraryId?: string;
  
  // Timestamp (immutable)
  timestamp: Date;
}

export interface ComplianceGap {
  id: string;
  tenantId: string;
  
  // Gap Info
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'missing_approval' | 'expired_document' | 'low_acknowledgement' | 
        'missing_owner' | 'no_review_date' | 'overdue_review' | 'orphaned_document';
  
  // Affected Entity
  documentId?: string;
  libraryId?: string;
  
  // Description
  title: string;
  description: string;
  recommendation: string;
  
  // Status
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Detection
  detectedAt: Date;
  detectedBy: 'system' | 'user' | 'ai';
}

// ============================================================================
// UI & ANALYTICS
// ============================================================================

export interface DocumentHealthMetrics {
  overall: number; // 0-100
  level: HealthScoreLevel;
  
  breakdown: {
    compliance: {
      score: number;
      issues: string[];
    };
    freshness: {
      score: number;
      daysSinceReview: number;
      isExpired: boolean;
    };
    usage: {
      score: number;
      acknowledgementRate: number;
      viewCount: number;
    };
    risk: {
      score: number;
      level: 'low' | 'medium' | 'high' | 'critical';
      factors: string[];
    };
  };
}

export interface ApprovalMetrics {
  averageApprovalTime: number; // days
  currentStageDuration: number; // days
  slaStatus: 'on_track' | 'at_risk' | 'overdue';
  bottlenecks: string[]; // User IDs causing delays
}

export interface LibraryAnalytics {
  totalDocuments: number;
  documentsByStatus: Record<DocumentStatus, number>;
  documentsByType: Record<DocumentType, number>;
  
  complianceScore: number; // 0-100
  complianceGapCount: number;
  
  averageHealthScore: number;
  ghostDocumentCount: number; // <10% acknowledgement
  expiredDocumentCount: number;
  
  collaborationMetrics: {
    topContributors: Array<{ userId: string; contributionCount: number }>;
    topApprovers: Array<{ userId: string; approvalCount: number }>;
    collaborationHeatmap: Array<{ user1: string; user2: string; count: number }>;
  };
}

export interface VersionLineage {
  versions: DocumentVersion[];
  branches: Array<{
    id: string;
    name: string;
    versions: string[]; // Version IDs
  }>;
  relationships: Array<{
    from: string; // Version ID
    to: string; // Version ID
    type: 'sequential' | 'branched' | 'merged';
  }>;
}

// ============================================================================
// API REQUEST/RESPONSE
// ============================================================================

export interface CreateLibraryRequest {
  name: string;
  description?: string;
  type: LibraryType;
  complianceStandard: ComplianceStandard;
  numberingPrefix: string;
  managers: string[];
  settings: {
    requireAcknowledgement: boolean;
    defaultRetentionDays?: number;
    autoArchiveExpired: boolean;
    allowPdfConversion: boolean;
  };
}

export interface CreateDocumentRequest {
  libraryId: string;
  title: string;
  type: DocumentType;
  sourceFileId: string;
  sourceFileName: string;
  sourceProvider: 'microsoft365' | 'google' | 'slack' | 'box' | 'local';
  
  // Optional metadata
  category?: string;
  tags?: string[];
  department?: string;
  
  // AI-powered options
  useAiMetadata?: boolean; // Auto-suggest tags, category, reviewers
  useAiSummary?: boolean; // Generate content summary
}

export interface SubmitForApprovalRequest {
  documentId: string;
  versionId: string;
  workflowId?: string; // If not provided, use default
  comments?: string;
}

export interface ApproveDocumentRequest {
  approvalId: string;
  comments?: string;
  signature?: string; // For FDA 21 CFR Part 11
}

export interface RejectDocumentRequest {
  approvalId: string;
  comments: string; // Required for rejection
  reason: string;
}

export interface PublishDocumentRequest {
  documentId: string;
  versionId: string;
  
  // Optional settings
  convertToPdf?: boolean;
  pushToWorkspaces?: string[]; // Workspace IDs to distribute to
  requireAcknowledgement?: boolean;
  acknowledgementDueDate?: Date;
  notifyUsers?: string[]; // User IDs to notify
}

export interface BulkAcknowledgementRequest {
  documentId: string;
  userIds: string[];
  dueDate?: Date;
  message?: string;
}

export interface ComplianceGapQuery {
  severity?: 'critical' | 'high' | 'medium' | 'low';
  type?: string;
  libraryId?: string;
  includeResolved?: boolean;
}

// ============================================================================
// DEMO MODE
// ============================================================================

export interface DemoModeConfig {
  enabled: boolean;
  autoApprovalDelay: number; // milliseconds
  simulatedUsers: DemoUser[];
  mockDocuments: ControlledDocument[];
  mockWorkflows: ApprovalWorkflow[];
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

// ============================================================================
// CONTEXT & HOOKS
// ============================================================================

export interface DocumentControlContextValue {
  // State
  libraries: DocumentLibrary[];
  documents: ControlledDocument[];
  workflows: ApprovalWorkflow[];
  
  // Current selections
  currentLibrary?: DocumentLibrary;
  currentDocument?: ControlledDocument;
  
  // Actions
  createLibrary: (data: CreateLibraryRequest) => Promise<DocumentLibrary>;
  createDocument: (data: CreateDocumentRequest) => Promise<ControlledDocument>;
  submitForApproval: (data: SubmitForApprovalRequest) => Promise<void>;
  approveDocument: (data: ApproveDocumentRequest) => Promise<void>;
  rejectDocument: (data: RejectDocumentRequest) => Promise<void>;
  publishDocument: (data: PublishDocumentRequest) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  error?: string;
  
  // Demo mode
  isDemoMode: boolean;
}
