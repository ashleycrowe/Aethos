/**
 * Centralized Aethos Type Definitions (STD-CODE-001)
 * Optimized for Universal Metadata Engine (Source-Agnostic)
 */

export type SiteStatus = 'active' | 'archived' | 'degraded' | 'syncing' | 'frozen';

export type ProviderType = 'microsoft' | 'google' | 'slack' | 'box' | 'local';

export type AdapterTier = 1 | 2;

export interface ProviderMetadata {
  type: ProviderType;
  tier: AdapterTier;
  capabilities: ('management' | 'discovery' | 'archival' | 'shadow-audit')[];
}

export type ContainerType = 
  | 'site' | 'team' | 'space' | 'channel' | 'folder' | 'bucket' 
  | 'document' | 'spreadsheet' | 'presentation' | 'external-link' | 'insight'
  | 'loop-component' | 'stream-recording' | 'viva-topic' | 'outlook-meeting' | 'slack-canvas';

export type AppEnvironment = 'development' | 'test' | 'staging' | 'production';

export interface MetadataPointer {
  id: string;
  externalId: string; // The ID from the source system (Graph, Google API, etc.)
  provider: ProviderType;
  tenantId?: string;
  source: 'Graph' | 'Google' | 'HRIS' | 'Sidecar' | 'Local';
  lastSynced: string;
  crossCloudLink?: string; // Links to related resources in other clouds
}

export interface AethosContainer {
  id: string;
  title: string;
  type: ContainerType;
  provider: ProviderType;
  status: SiteStatus;
  storageUsed: number; // in bytes
  idleDays: number;
  ownerId: string;
  metadata: MetadataPointer;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  exposureVectorCount: number;
  retentionDaysLeft?: number;
}

export interface PinnedArtifact {
  id: string;
  type: ContainerType;
  title: string;
  provider: ProviderType;
  url: string;
  aethosNote?: string;
  category: 'critical' | 'reference' | 'tool' | 'archive';
  syncStatus?: 'synced' | 'broken' | 'moving';
  pinnedAt: string;
  lastAccessed?: string;
  permissions?: {
    scope: 'everyone' | 'members' | 'owners';
    access: 'read' | 'write' | 'manage';
  };
  permissionBridge?: {
    stewardAccess: 'can_access' | 'access_missing' | 'unknown' | 'owner_review_required';
    reason: string;
    ownerEmail?: string | null;
    ownerName?: string | null;
    externalUserCount?: number;
    sourceUrl?: string | null;
  };
  sourceMetadata?: Record<string, any>;
}

export type WorkspaceHandoffSource =
  | 'discovery'
  | 'operational_intelligence'
  | 'owner_risk'
  | 'stale_content'
  | 'exposure'
  | 'metadata_quality';

export interface WorkspaceHandoffPacket {
  source: WorkspaceHandoffSource;
  summary: string;
  reasonCodes: string[];
  suggestedAction: string;
  ownerReviewRequired: boolean;
}

export type PulseAction = 
  | 'comment' | 'edit' | 'upload' | 'pin' | 'share'
  | 'meeting-start' | 'loop-sync' | 'viva-post' | 'slack-thread' | 'huddle-start'
  | 'insight-generated' | 'risk-detected' | 'blast' | 'operational-signal';

export interface PulseReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface PulseComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface PulseEvent {
  id: string;
  userId: string;
  userName: string;
  action: PulseAction;
  artifactTitle: string;
  provider: ProviderType;
  timestamp: string;
  message?: string;
  isBlast?: boolean;
  mediaUrl?: string;
  reactions?: PulseReaction[];
  comments?: PulseComment[];
  metadata?: {
    duration?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    impactScore?: number;
    deepLink?: string;
    participants?: string[];
    channelName?: string;
  };
}

export interface StorageConfig {
  provider: ProviderType;
  containerId: string; // e.g., SharePoint Site ID or Drive ID
  path: string; // Default root path for "New" artifacts
  name: string; // Human readable name (e.g., "Marketing Team Site")
}

export interface WorkspaceSubscription {
  id: string;
  provider: ProviderType;
  sourceId: string; // e.g. Slack Channel ID, Viva Topic ID
  sourceName: string;
  type: 'channel' | 'conversation' | 'topic' | 'folder' | 'meeting-series';
  notifyOn: ('post' | 'edit' | 'file' | 'meeting' | 'alert')[];
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  primaryStorage: StorageConfig;
  pinnedItems: PinnedArtifact[];
  linkedSources: Array<{
    provider: ProviderType;
    containerId: string;
    type: ContainerType;
    name: string;
  }>;
  subscriptions: WorkspaceSubscription[];
  members: string[]; // User IDs
  pulseFeed: PulseEvent[];
  createdAt: string;
  updatedAt: string;
  intelligenceScore: number; // 0-100
  syncRules?: SyncRule[]; // Tag-based auto-sync rules
  stewardship?: {
    stewardOwnerEmail?: string | null;
    stewardOwnerName?: string | null;
    reviewStatus: 'admin_review' | 'steward_review' | 'team_ready' | 'archived';
    handoffReasonCodes: string[];
    handoffPacket?: WorkspaceHandoffPacket | null;
    sourceOfTruthItemIds: string[];
    suggestionDecisions: Record<string, unknown>;
    stewardNotes?: string | null;
  };
}

// Asset (File, Channel, Page) - for Discovery and Workspaces
export interface Asset {
  id: string;
  tenantId: string;
  sourceProvider: ProviderType;
  sourceId: string; // Provider's ID (e.g., SharePoint Item ID)
  sourceUrl: string; // Direct link to asset
  
  // Core Metadata
  name: string;
  type: 'file' | 'folder' | 'site' | 'channel' | 'page';
  mimeType?: string;
  sizeBytes: number;
  
  // People
  authorEmail?: string;
  authorName?: string;
  modifiedByEmail?: string;
  
  // Timestamps
  createdDate: string;
  modifiedDate: string;
  lastAccessedDate?: string;
  
  // Location
  locationPath: string; // e.g., "Finance Team > Budget > 2024"
  parentId?: string;
  
  // Sharing & Permissions
  isSharedExternally: boolean;
  shareCount: number;
  permissionType: 'private' | 'team' | 'org' | 'public';
  
  // Tags (for workspace auto-sync) - CRITICAL
  userTags: string[]; // Manually assigned by users/admins
  enrichedTags: string[]; // AI-generated tags from Metadata Intelligence Layer
  
  // Intelligence (Enriched)
  enrichedTitle?: string; // AI-improved title
  intelligenceScore?: number; // 0-100
  
  // Operational Flags
  isOrphaned: boolean;
  isDuplicate: boolean;
  isStale: boolean;
  
  // Sync Metadata
  lastSyncedAt: string;
  syncStatus: 'active' | 'error' | 'deleted';
}

// Sync Rule - for tag-based workspace auto-sync
export interface SyncRule {
  id: string;
  workspaceId: string;
  tenantId: string;
  ruleType: 'location' | 'tag' | 'author' | 'keyword';
  enabled: boolean;
  
  // Location-based rule
  locationPath?: string;
  
  // Tag-based rule (NEW - enables smart workspace organization)
  tagsIncludeAll?: string[]; // Must have ALL these tags (AND logic)
  tagsIncludeAny?: string[]; // Must have ANY of these tags (OR logic)
  tagsExclude?: string[]; // Must NOT have these tags
  
  // Author-based rule
  authorEmails?: string[];
  
  // Keyword-based rule (AI+ tier)
  keywords?: string[];
  
  // Filters
  fileTypes?: string[];
  minSizeBytes?: number;
  maxSizeBytes?: number;
  dateAfter?: string;
  dateBefore?: string;
  excludeLocations?: string[];
  
  // Behavior
  autoAdd: boolean;
  autoRemove: boolean;
  maxFiles: number; // Safety limit (default 500)
  
  // Audit
  lastRun?: string;
  filesAddedCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Workspace Asset (Join table - which assets are in which workspaces)
export interface WorkspaceAsset {
  id: string;
  workspaceId: string;
  assetId: string;
  addedBy: string; // User ID or 'system' for auto-sync
  addedAt: string;
  pinned: boolean;
  notes?: string; // User notes about why this asset is here
}

export interface Connector {
  id: string;
  provider: ProviderType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastScan: string;
  accountEmail: string;
}

export interface CareerMilestone {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'achievement' | 'role' | 'certification' | 'operational';
}

export interface CloudAnchor {
  provider: ProviderType;
  linkedId: string;
  status: 'synced' | 'pending' | 'orphaned';
}

export interface AethosIdentity {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'orphaned' | 'suspended';
  provider: ProviderType;
  lastActive: string;
  accessCount: number;
  riskFactor: number;
  metadata: MetadataPointer;
  avatar?: string;
  badges?: string[];
  skills?: string[];
  milestones?: CareerMilestone[];
  bio?: string;
  anchors?: CloudAnchor[];
}

export interface ResilienceLog {
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'RETRY' | 'FAILURE' | 'SANITY';
  message: string;
}
