# Document Control System - Supabase Database Schema

**Status:** 📋 Ready to Implement  
**Date:** April 6, 2026  
**Database:** PostgreSQL (Supabase)  
**Multi-Tenant:** Yes (tenant_id partition key on all tables)

---

## 🎯 Overview

This document provides the complete database schema for the Aethos Document Control System add-on. The schema is designed for **multi-tenant SaaS** with strict data isolation using PostgreSQL Row-Level Security (RLS).

### Key Design Principles
- ✅ **Multi-tenant by default** - Every table has `tenant_id`
- ✅ **Row-Level Security** - Database-enforced tenant isolation
- ✅ **Audit trail** - Immutable logs for compliance
- ✅ **Soft deletes** - All records retained for 30 days
- ✅ **Version control** - Full document lineage tracking
- ✅ **Compliance-first** - Support for ISO 9001, FDA 21 CFR Part 11, SOC 2, GDPR, HIPAA

---

## 📦 Tables Overview

### Core Tables (6)
1. `document_libraries` - Library containers
2. `controlled_documents` - Document metadata
3. `document_versions` - Version history
4. `document_content` - File storage references
5. `document_numbering_sequences` - Auto-numbering
6. `document_tags` - Tagging system

### Workflow Tables (4)
7. `approval_workflows` - Workflow definitions
8. `approval_stages` - Workflow steps
9. `approval_instances` - Active approval processes
10. `approval_actions` - Approval history

### Compliance Tables (3)
11. `acknowledgements` - User read receipts
12. `compliance_standards` - Standard definitions
13. `compliance_gaps` - Detected issues

### Audit Tables (1)
14. `document_audit_logs` - Immutable audit trail

**Total:** 14 tables

---

## 🗄️ Table Schemas

### 1. `document_libraries`
**Purpose:** Organize documents into libraries with specific compliance standards

```sql
CREATE TABLE document_libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Icon identifier (e.g., "Folder", "Shield")
  
  -- Numbering
  numbering_prefix TEXT NOT NULL, -- e.g., "SOP-HR", "POL-IT"
  next_number INTEGER DEFAULT 1,
  
  -- Compliance
  compliance_standard TEXT, -- 'ISO_9001' | 'FDA_21_CFR_PART_11' | 'SOC_2' | 'GDPR' | 'HIPAA' | null
  requires_acknowledgement BOOLEAN DEFAULT true,
  acknowledgement_threshold INTEGER DEFAULT 80, -- Minimum % required
  
  -- Access Control
  is_private BOOLEAN DEFAULT false,
  allowed_roles TEXT[] DEFAULT ARRAY['ARCHITECT', 'CURATOR'], -- Role-based access
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete
  
  -- Indexes
  CONSTRAINT unique_library_name UNIQUE (tenant_id, name)
);

-- Indexes
CREATE INDEX idx_libraries_tenant ON document_libraries(tenant_id);
CREATE INDEX idx_libraries_compliance ON document_libraries(compliance_standard);
CREATE INDEX idx_libraries_deleted ON document_libraries(deleted_at) WHERE deleted_at IS NOT NULL;

-- Row-Level Security
ALTER TABLE document_libraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view libraries in their tenant"
  ON document_libraries FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Architects can manage libraries"
  ON document_libraries FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND current_setting('app.current_user_role') IN ('ARCHITECT', 'CURATOR')
  );
```

---

### 2. `controlled_documents`
**Purpose:** Core document metadata and status tracking

```sql
CREATE TABLE controlled_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  library_id UUID NOT NULL REFERENCES document_libraries(id) ON DELETE CASCADE,
  
  -- Identification
  document_number TEXT NOT NULL, -- Auto-generated (e.g., "SOP-HR-2026-001")
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL, -- 'SOP' | 'POLICY' | 'PROCEDURE' | 'WORK_INSTRUCTION' | 'FORM' | 'GUIDELINE'
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'in_review' | 'approved' | 'published' | 'archived' | 'expired'
  version TEXT DEFAULT '1.0',
  
  -- Lifecycle Dates
  effective_date TIMESTAMPTZ,
  review_due_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  
  -- Ownership
  owner_id UUID REFERENCES users(id), -- Document owner
  author_id UUID REFERENCES users(id), -- Primary author
  
  -- Health Metrics (calculated)
  health_score INTEGER DEFAULT 0, -- 0-100
  health_level TEXT, -- 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  last_health_check TIMESTAMPTZ,
  
  -- Compliance
  requires_signature BOOLEAN DEFAULT false, -- FDA 21 CFR Part 11
  is_superseded_by UUID REFERENCES controlled_documents(id), -- Supersession chain
  supersedes UUID REFERENCES controlled_documents(id),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES users(id),
  deleted_at TIMESTAMPTZ, -- Soft delete
  
  -- Constraints
  CONSTRAINT unique_document_number UNIQUE (tenant_id, document_number),
  CONSTRAINT valid_health_score CHECK (health_score >= 0 AND health_score <= 100)
);

-- Indexes
CREATE INDEX idx_documents_tenant ON controlled_documents(tenant_id);
CREATE INDEX idx_documents_library ON controlled_documents(library_id);
CREATE INDEX idx_documents_status ON controlled_documents(status);
CREATE INDEX idx_documents_owner ON controlled_documents(owner_id);
CREATE INDEX idx_documents_expiration ON controlled_documents(expiration_date) WHERE expiration_date IS NOT NULL;
CREATE INDEX idx_documents_health ON controlled_documents(health_score);
CREATE INDEX idx_documents_deleted ON controlled_documents(deleted_at) WHERE deleted_at IS NOT NULL;

-- Full-text search
CREATE INDEX idx_documents_search ON controlled_documents USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Row-Level Security
ALTER TABLE controlled_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents in their tenant"
  ON controlled_documents FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Users can create documents"
  ON controlled_documents FOR INSERT
  WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND current_setting('app.current_user_role') IN ('ARCHITECT', 'CURATOR', 'CONTRIBUTOR')
  );

CREATE POLICY "Owners and architects can update documents"
  ON controlled_documents FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND (
      owner_id = current_setting('app.current_user_id')::UUID
      OR current_setting('app.current_user_role') IN ('ARCHITECT', 'CURATOR')
    )
  );
```

---

### 3. `document_versions`
**Purpose:** Git-like version history with branching support

```sql
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  
  -- Version Info
  version TEXT NOT NULL, -- Semantic versioning: "1.0", "1.1", "2.0"
  version_number INTEGER NOT NULL, -- Sequential: 1, 2, 3...
  parent_version_id UUID REFERENCES document_versions(id), -- Previous version
  
  -- Content Reference
  content_id UUID REFERENCES document_content(id),
  
  -- Changes
  change_description TEXT,
  change_type TEXT, -- 'minor' | 'major' | 'patch'
  diff_summary JSONB, -- Structured diff data
  
  -- Collaboration
  contributors UUID[] DEFAULT ARRAY[]::UUID[], -- Array of user IDs
  comment_count INTEGER DEFAULT 0,
  
  -- Status
  is_current BOOLEAN DEFAULT false, -- Only one current version per document
  is_published BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT unique_version_number UNIQUE (document_id, version_number)
);

-- Indexes
CREATE INDEX idx_versions_tenant ON document_versions(tenant_id);
CREATE INDEX idx_versions_document ON document_versions(document_id);
CREATE INDEX idx_versions_current ON document_versions(is_current) WHERE is_current = true;
CREATE INDEX idx_versions_published ON document_versions(is_published) WHERE is_published = true;

-- Row-Level Security
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions in their tenant"
  ON document_versions FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 4. `document_content`
**Purpose:** File storage references (not actual files)

```sql
CREATE TABLE document_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  
  -- Storage
  storage_provider TEXT NOT NULL DEFAULT 'supabase', -- 'supabase' | 's3' | 'azure_blob'
  storage_path TEXT NOT NULL, -- Path/key in storage
  storage_bucket TEXT, -- Bucket name
  
  -- File Metadata
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL, -- Bytes
  checksum TEXT, -- SHA-256 hash for integrity
  
  -- Processing
  extracted_text TEXT, -- For search indexing
  has_embeddings BOOLEAN DEFAULT false, -- AI embeddings generated
  pdf_url TEXT, -- URL to converted PDF (if applicable)
  
  -- Metadata
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_content_tenant ON document_content(tenant_id);
CREATE INDEX idx_content_document ON document_content(document_id);
CREATE INDEX idx_content_checksum ON document_content(checksum);

-- Full-text search on extracted content
CREATE INDEX idx_content_search ON document_content USING GIN (to_tsvector('english', COALESCE(extracted_text, '')));

-- Row-Level Security
ALTER TABLE document_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view content in their tenant"
  ON document_content FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 5. `document_numbering_sequences`
**Purpose:** Track auto-numbering for libraries

```sql
CREATE TABLE document_numbering_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  library_id UUID NOT NULL REFERENCES document_libraries(id) ON DELETE CASCADE,
  
  -- Sequence
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  next_sequence INTEGER DEFAULT 1,
  
  -- Format Template
  format_template TEXT DEFAULT '{prefix}-{year}-{seq:04d}', -- e.g., "SOP-HR-2026-0001"
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_library_year UNIQUE (library_id, year)
);

-- Indexes
CREATE INDEX idx_sequences_tenant ON document_numbering_sequences(tenant_id);
CREATE INDEX idx_sequences_library ON document_numbering_sequences(library_id);

-- Row-Level Security
ALTER TABLE document_numbering_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sequences in their tenant"
  ON document_numbering_sequences FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 6. `document_tags`
**Purpose:** Tag documents for categorization and search

```sql
CREATE TABLE document_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  
  -- Tag Info
  tag_name TEXT NOT NULL,
  tag_category TEXT, -- 'department' | 'topic' | 'custom'
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_tags_tenant ON document_tags(tenant_id);
CREATE INDEX idx_tags_document ON document_tags(document_id);
CREATE INDEX idx_tags_name ON document_tags(tag_name);

-- Row-Level Security
ALTER TABLE document_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tags in their tenant"
  ON document_tags FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 7. `approval_workflows`
**Purpose:** Define reusable approval workflow templates

```sql
CREATE TABLE approval_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  library_id UUID REFERENCES document_libraries(id) ON DELETE SET NULL, -- Optional library association
  
  -- Workflow Info
  name TEXT NOT NULL,
  description TEXT,
  
  -- Configuration
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  routing_type TEXT DEFAULT 'sequential', -- 'sequential' | 'parallel' | 'conditional'
  
  -- SLA
  sla_hours INTEGER, -- Expected completion time
  escalation_rules JSONB, -- Escalation config
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_workflow_name UNIQUE (tenant_id, name)
);

-- Indexes
CREATE INDEX idx_workflows_tenant ON approval_workflows(tenant_id);
CREATE INDEX idx_workflows_library ON approval_workflows(library_id);
CREATE INDEX idx_workflows_default ON approval_workflows(is_default) WHERE is_default = true;

-- Row-Level Security
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows in their tenant"
  ON approval_workflows FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 8. `approval_stages`
**Purpose:** Define stages within a workflow

```sql
CREATE TABLE approval_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
  
  -- Stage Info
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL, -- 1, 2, 3...
  
  -- Approvers
  required_approvers UUID[] NOT NULL, -- Array of user IDs
  approver_count_required INTEGER DEFAULT 1, -- How many need to approve (for parallel)
  allow_delegation BOOLEAN DEFAULT true,
  
  -- Conditions
  skip_conditions JSONB, -- When to skip this stage
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stages_tenant ON approval_stages(tenant_id);
CREATE INDEX idx_stages_workflow ON approval_stages(workflow_id);
CREATE INDEX idx_stages_order ON approval_stages(workflow_id, stage_order);

-- Row-Level Security
ALTER TABLE approval_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stages in their tenant"
  ON approval_stages FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 9. `approval_instances`
**Purpose:** Track active approval processes for documents

```sql
CREATE TABLE approval_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES approval_workflows(id),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'in_progress' | 'approved' | 'rejected' | 'cancelled'
  current_stage_id UUID REFERENCES approval_stages(id),
  current_stage_order INTEGER DEFAULT 1,
  
  -- Progress
  stages_completed INTEGER DEFAULT 0,
  total_stages INTEGER NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  
  -- SLA Tracking
  started_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_overdue BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_instances_tenant ON approval_instances(tenant_id);
CREATE INDEX idx_instances_document ON approval_instances(document_id);
CREATE INDEX idx_instances_workflow ON approval_instances(workflow_id);
CREATE INDEX idx_instances_status ON approval_instances(status);
CREATE INDEX idx_instances_overdue ON approval_instances(is_overdue) WHERE is_overdue = true;

-- Row-Level Security
ALTER TABLE approval_instances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view instances in their tenant"
  ON approval_instances FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 10. `approval_actions`
**Purpose:** Log all approval/rejection actions (immutable)

```sql
CREATE TABLE approval_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  instance_id UUID NOT NULL REFERENCES approval_instances(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES approval_stages(id),
  
  -- Action
  action TEXT NOT NULL, -- 'approve' | 'reject' | 'delegate' | 'comment'
  actor_id UUID NOT NULL REFERENCES users(id),
  delegated_to UUID REFERENCES users(id), -- If delegated
  
  -- Feedback
  comments TEXT,
  signature_data JSONB, -- Electronic signature (FDA 21 CFR Part 11)
  
  -- Metadata (IMMUTABLE)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_actions_tenant ON approval_actions(tenant_id);
CREATE INDEX idx_actions_instance ON approval_actions(instance_id);
CREATE INDEX idx_actions_stage ON approval_actions(stage_id);
CREATE INDEX idx_actions_actor ON approval_actions(actor_id);
CREATE INDEX idx_actions_created ON approval_actions(created_at);

-- Row-Level Security
ALTER TABLE approval_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view actions in their tenant"
  ON approval_actions FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 11. `acknowledgements`
**Purpose:** Track who has read/acknowledged published documents

```sql
CREATE TABLE acknowledgements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES controlled_documents(id) ON DELETE CASCADE,
  version_id UUID REFERENCES document_versions(id) ON DELETE SET NULL,
  
  -- User
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Acknowledgement
  acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  signature_data JSONB, -- Electronic signature if required
  
  -- Engagement Tracking
  opened_at TIMESTAMPTZ, -- First opened
  last_opened_at TIMESTAMPTZ, -- Last viewed
  open_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0, -- Total time on document
  
  -- Reminders
  reminder_sent_count INTEGER DEFAULT 0,
  last_reminder_sent TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_document_version UNIQUE (user_id, document_id, version_id)
);

-- Indexes
CREATE INDEX idx_ack_tenant ON acknowledgements(tenant_id);
CREATE INDEX idx_ack_document ON acknowledgements(document_id);
CREATE INDEX idx_ack_user ON acknowledgements(user_id);
CREATE INDEX idx_ack_pending ON acknowledgements(acknowledged) WHERE acknowledged = false;
CREATE INDEX idx_ack_version ON acknowledgements(version_id);

-- Row-Level Security
ALTER TABLE acknowledgements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view acknowledgements in their tenant"
  ON acknowledgements FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY "Users can acknowledge documents"
  ON acknowledgements FOR UPDATE
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND user_id = current_setting('app.current_user_id')::UUID
  );
```

---

### 12. `compliance_standards`
**Purpose:** Define compliance standard requirements

```sql
CREATE TABLE compliance_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Standard Info
  code TEXT UNIQUE NOT NULL, -- 'ISO_9001', 'FDA_21_CFR_PART_11', etc.
  name TEXT NOT NULL,
  description TEXT,
  
  -- Requirements
  requires_acknowledgement BOOLEAN DEFAULT true,
  requires_signature BOOLEAN DEFAULT false,
  requires_version_control BOOLEAN DEFAULT true,
  requires_approval_workflow BOOLEAN DEFAULT true,
  min_acknowledgement_rate INTEGER DEFAULT 80, -- Minimum %
  max_review_cycle_days INTEGER, -- e.g., 365 days for annual review
  
  -- Validation Rules
  validation_rules JSONB, -- Custom validation logic
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-populate with standards
INSERT INTO compliance_standards (code, name, requires_signature, min_acknowledgement_rate, max_review_cycle_days) VALUES
  ('ISO_9001', 'ISO 9001:2015 Quality Management', false, 95, 365),
  ('FDA_21_CFR_PART_11', 'FDA 21 CFR Part 11 (Electronic Records)', true, 100, 365),
  ('SOC_2', 'SOC 2 Type II', false, 90, 365),
  ('GDPR', 'GDPR Data Protection', false, 95, 730),
  ('HIPAA', 'HIPAA Privacy & Security', true, 100, 365);

-- Row-Level Security (Public read)
ALTER TABLE compliance_standards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view standards"
  ON compliance_standards FOR SELECT
  USING (true);
```

---

### 13. `compliance_gaps`
**Purpose:** Detected compliance issues and gaps

```sql
CREATE TABLE compliance_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID REFERENCES controlled_documents(id) ON DELETE CASCADE,
  library_id UUID REFERENCES document_libraries(id) ON DELETE CASCADE,
  
  -- Gap Info
  gap_type TEXT NOT NULL, -- 'expired_document' | 'missing_approval' | 'low_acknowledgement' | 'ghost_document'
  severity TEXT NOT NULL, -- 'critical' | 'high' | 'medium' | 'low'
  title TEXT NOT NULL,
  description TEXT,
  
  -- Resolution
  status TEXT DEFAULT 'open', -- 'open' | 'acknowledged' | 'resolved' | 'ignored'
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id),
  resolution_notes TEXT,
  
  -- Context
  context_data JSONB, -- Additional gap-specific data
  
  -- Metadata
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  last_notified TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_gaps_tenant ON compliance_gaps(tenant_id);
CREATE INDEX idx_gaps_document ON compliance_gaps(document_id);
CREATE INDEX idx_gaps_library ON compliance_gaps(library_id);
CREATE INDEX idx_gaps_severity ON compliance_gaps(severity);
CREATE INDEX idx_gaps_status ON compliance_gaps(status);
CREATE INDEX idx_gaps_type ON compliance_gaps(gap_type);

-- Row-Level Security
ALTER TABLE compliance_gaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view gaps in their tenant"
  ON compliance_gaps FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

---

### 14. `document_audit_logs`
**Purpose:** Immutable audit trail for all document actions

```sql
CREATE TABLE document_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  document_id UUID REFERENCES controlled_documents(id) ON DELETE SET NULL,
  
  -- Action
  action TEXT NOT NULL, -- 'created' | 'updated' | 'approved' | 'published' | 'archived' | 'deleted' | 'viewed' | 'downloaded'
  actor_id UUID NOT NULL REFERENCES users(id),
  
  -- Context
  ip_address INET, -- User's IP address
  user_agent TEXT, -- Browser/client info
  
  -- Changes
  before_state JSONB, -- State before action
  after_state JSONB, -- State after action
  metadata JSONB, -- Additional context
  
  -- Metadata (IMMUTABLE - no updates allowed)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_tenant ON document_audit_logs(tenant_id);
CREATE INDEX idx_audit_document ON document_audit_logs(document_id);
CREATE INDEX idx_audit_actor ON document_audit_logs(actor_id);
CREATE INDEX idx_audit_action ON document_audit_logs(action);
CREATE INDEX idx_audit_created ON document_audit_logs(created_at DESC);

-- Row-Level Security
ALTER TABLE document_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Architects can view audit logs in their tenant"
  ON document_audit_logs FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND current_setting('app.current_user_role') IN ('ARCHITECT', 'CURATOR')
  );

-- Prevent updates/deletes (immutable)
CREATE POLICY "Audit logs cannot be modified"
  ON document_audit_logs FOR UPDATE
  USING (false);

CREATE POLICY "Audit logs cannot be deleted"
  ON document_audit_logs FOR DELETE
  USING (false);
```

---

## 🔐 Row-Level Security (RLS) Setup

### Required Supabase Configuration

Before creating tables, configure these session variables:

```sql
-- Function to set tenant context (called by backend)
CREATE OR REPLACE FUNCTION set_tenant_context(
  p_tenant_id UUID,
  p_user_id UUID,
  p_user_role TEXT
) RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', p_tenant_id::TEXT, false);
  PERFORM set_config('app.current_user_id', p_user_id::TEXT, false);
  PERFORM set_config('app.current_user_role', p_user_role, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Backend Usage

```typescript
// Before any database query
await supabase.rpc('set_tenant_context', {
  p_tenant_id: currentTenant.id,
  p_user_id: currentUser.id,
  p_user_role: currentUser.role
});

// Now all queries respect RLS policies
const { data } = await supabase
  .from('controlled_documents')
  .select('*');
// ✅ Only returns documents for the current tenant
```

---

## 📊 Database Triggers

### 1. Auto-Update `updated_at` Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_libraries_updated_at BEFORE UPDATE ON document_libraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON controlled_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON approval_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Auto-Create Audit Log on Document Changes

```sql
CREATE OR REPLACE FUNCTION log_document_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO document_audit_logs (
    tenant_id,
    document_id,
    action,
    actor_id,
    before_state,
    after_state
  ) VALUES (
    NEW.tenant_id,
    NEW.id,
    TG_OP, -- 'INSERT', 'UPDATE', or 'DELETE'
    current_setting('app.current_user_id', true)::UUID,
    row_to_json(OLD),
    row_to_json(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_document_changes
  AFTER INSERT OR UPDATE OR DELETE ON controlled_documents
  FOR EACH ROW EXECUTE FUNCTION log_document_changes();
```

### 3. Calculate Document Health Score

```sql
CREATE OR REPLACE FUNCTION calculate_document_health(doc_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 100;
  doc RECORD;
  ack_rate NUMERIC;
BEGIN
  SELECT * INTO doc FROM controlled_documents WHERE id = doc_id;
  
  -- Factor 1: Expiration (40 points)
  IF doc.expiration_date < NOW() THEN
    score := score - 40; -- Expired
  ELSIF doc.expiration_date < NOW() + INTERVAL '30 days' THEN
    score := score - 20; -- Expiring soon
  END IF;
  
  -- Factor 2: Review Date (30 points)
  IF doc.review_due_date < NOW() THEN
    score := score - 30; -- Overdue
  ELSIF doc.review_due_date < NOW() + INTERVAL '30 days' THEN
    score := score - 15; -- Due soon
  END IF;
  
  -- Factor 3: Acknowledgement Rate (20 points)
  SELECT 
    CASE WHEN COUNT(*) = 0 THEN 100
         ELSE (COUNT(*) FILTER (WHERE acknowledged = true) * 100.0 / COUNT(*))
    END INTO ack_rate
  FROM acknowledgements
  WHERE document_id = doc_id;
  
  IF ack_rate < 50 THEN
    score := score - 20;
  ELSIF ack_rate < 80 THEN
    score := score - 10;
  END IF;
  
  -- Factor 4: Version Age (10 points)
  IF doc.updated_at < NOW() - INTERVAL '365 days' THEN
    score := score - 10; -- Stale
  END IF;
  
  RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Auto-update health score on changes
CREATE OR REPLACE FUNCTION update_document_health()
RETURNS TRIGGER AS $$
DECLARE
  new_score INTEGER;
BEGIN
  new_score := calculate_document_health(NEW.id);
  
  NEW.health_score := new_score;
  NEW.health_level := CASE
    WHEN new_score >= 90 THEN 'excellent'
    WHEN new_score >= 75 THEN 'good'
    WHEN new_score >= 60 THEN 'fair'
    WHEN new_score >= 40 THEN 'poor'
    ELSE 'critical'
  END;
  NEW.last_health_check := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_health_on_change
  BEFORE INSERT OR UPDATE ON controlled_documents
  FOR EACH ROW EXECUTE FUNCTION update_document_health();
```

---

## 🚀 Deployment Instructions

### Step 1: Create Database in Supabase

1. Go to [app.supabase.com](https://app.supabase.com)
2. Create new project or use existing
3. Go to SQL Editor

### Step 2: Run Schema Creation Scripts

Execute in this order:

```sql
-- 1. Core tables first
-- Run scripts for tables 1-6 (libraries, documents, versions, content, sequences, tags)

-- 2. Workflow tables
-- Run scripts for tables 7-10 (workflows, stages, instances, actions)

-- 3. Compliance tables
-- Run scripts for tables 11-13 (acknowledgements, standards, gaps)

-- 4. Audit table
-- Run script for table 14 (audit logs)

-- 5. Triggers
-- Run all trigger creation scripts

-- 6. RLS setup
-- Run set_tenant_context function
```

### Step 3: Verify

```sql
-- Check table creation
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'document%'
ORDER BY table_name;

-- Should return 14 tables

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename LIKE 'document%';

-- Should show rowsecurity = true for all
```

---

## 📈 Storage Estimates

### For 1,000 Documents

| Table | Estimated Rows | Storage |
|-------|---------------|---------|
| `controlled_documents` | 1,000 | ~500 KB |
| `document_versions` | 5,000 (avg 5 versions/doc) | ~2 MB |
| `document_content` | 5,000 | ~2 MB |
| `approval_instances` | 2,000 | ~1 MB |
| `approval_actions` | 10,000 | ~5 MB |
| `acknowledgements` | 100,000 (100 users × 1,000 docs) | ~50 MB |
| `document_audit_logs` | 50,000 | ~25 MB |
| **Total** | | **~85 MB** |

### Supabase Free Tier

- **Database:** 500 MB ✅ (enough for ~5,000 documents)
- **Bandwidth:** 2 GB/month ✅
- **Cost:** $0/month

---

## 🔄 Migration from Demo Mode

When moving from demo data to production:

```sql
-- 1. Clear demo data (if needed)
DELETE FROM document_audit_logs WHERE tenant_id = 'demo-tenant-id';
DELETE FROM compliance_gaps WHERE tenant_id = 'demo-tenant-id';
DELETE FROM acknowledgements WHERE tenant_id = 'demo-tenant-id';
DELETE FROM approval_actions WHERE tenant_id = 'demo-tenant-id';
DELETE FROM approval_instances WHERE tenant_id = 'demo-tenant-id';
DELETE FROM document_versions WHERE tenant_id = 'demo-tenant-id';
DELETE FROM document_content WHERE tenant_id = 'demo-tenant-id';
DELETE FROM controlled_documents WHERE tenant_id = 'demo-tenant-id';
DELETE FROM document_libraries WHERE tenant_id = 'demo-tenant-id';

-- 2. Reset sequences
UPDATE document_numbering_sequences 
SET next_sequence = 1 
WHERE tenant_id = 'demo-tenant-id';
```

---

## ✅ Next Steps

1. **Create Supabase Project** - Set up database
2. **Run Schema Scripts** - Execute all CREATE TABLE statements
3. **Configure RLS** - Set up tenant context function
4. **Test Queries** - Verify RLS policies work correctly
5. **Build APIs** - Connect backend to database
6. **Integrate Frontend** - Replace mock data with real queries

---

**Status:** 📋 Ready to Deploy  
**Database Size:** ~14 tables, ~85 MB for 1,000 documents  
**Free Tier Compatible:** ✅ Yes (Supabase free tier)  
**Multi-Tenant:** ✅ Yes (RLS enforced)  
**Compliance Ready:** ✅ Yes (audit logs, immutable records)
