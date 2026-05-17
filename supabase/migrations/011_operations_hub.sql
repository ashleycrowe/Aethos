-- ============================================================================
-- Aethos Operations Hub
-- ============================================================================
-- Internal support, knowledge, product intelligence, and enablement foundation.
-- Uses a dedicated operations_user_roles table so internal RBAC can evolve
-- without changing tenant-facing user roles.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS operations_user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('sales_success', 'support', 'product_admin')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('question', 'issue', 'feature', 'billing', 'landing_page')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'triaged', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  product_area_tag TEXT CHECK (product_area_tag IN ('oracle', 'workspaces', 'billing', 'sync', 'ai_plus', 'admin', 'remediation', 'metadata', 'auth', 'unknown')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative', 'urgent')),
  ui_context_dump JSONB NOT NULL DEFAULT '{}'::jsonb,
  resolution_summary TEXT,
  source TEXT NOT NULL DEFAULT 'in_app' CHECK (source IN ('in_app', 'email', 'manual', 'landing_page', 'diagnostics')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('setup', 'oracle', 'workspaces', 'billing', 'sync', 'ai_plus', 'admin', 'remediation', 'troubleshooting')),
  product_area_tag TEXT CHECK (product_area_tag IN ('oracle', 'workspaces', 'billing', 'sync', 'ai_plus', 'admin', 'remediation', 'metadata', 'auth', 'unknown')),
  embedding vector(1536),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operations_roles_user
  ON operations_user_roles(user_id, active, role);

CREATE INDEX IF NOT EXISTS idx_support_tickets_tenant_created
  ON support_tickets(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_category_status
  ON support_tickets(category, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_product_sentiment
  ON support_tickets(product_area_tag, sentiment, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_support_tickets_search
  ON support_tickets USING GIN(to_tsvector('english', title || ' ' || description || ' ' || COALESCE(resolution_summary, '')));

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_category
  ON knowledge_articles(category, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_search
  ON knowledge_articles USING GIN(to_tsvector('english', title || ' ' || content));

CREATE INDEX IF NOT EXISTS idx_knowledge_articles_embedding
  ON knowledge_articles USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

ALTER TABLE operations_user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY operations_roles_admin_only ON operations_user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM operations_user_roles our
      WHERE our.user_id = current_setting('app.current_user_id', true)::uuid
        AND our.role = 'product_admin'
        AND our.active = TRUE
    )
  );

CREATE POLICY support_tickets_submitter_read ON support_tickets
  FOR SELECT USING (
    user_id = current_setting('app.current_user_id', true)::uuid
    OR tenant_id = current_setting('app.current_tenant_id', true)::uuid
  );

CREATE POLICY support_tickets_submitter_insert ON support_tickets
  FOR INSERT WITH CHECK (
    tenant_id = current_setting('app.current_tenant_id', true)::uuid
    OR user_id = current_setting('app.current_user_id', true)::uuid
  );

CREATE POLICY support_tickets_ops_read ON support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM operations_user_roles our
      WHERE our.user_id = current_setting('app.current_user_id', true)::uuid
        AND our.active = TRUE
        AND (
          our.role = 'product_admin'
          OR (our.role = 'support' AND category IN ('question', 'issue'))
          OR (our.role = 'sales_success' AND category IN ('billing', 'landing_page'))
        )
    )
  );

CREATE POLICY support_tickets_ops_update ON support_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1
      FROM operations_user_roles our
      WHERE our.user_id = current_setting('app.current_user_id', true)::uuid
        AND our.active = TRUE
        AND our.role IN ('product_admin', 'support', 'sales_success')
    )
  );

CREATE POLICY knowledge_articles_ops_read ON knowledge_articles
  FOR SELECT USING (
    status = 'published'
    OR EXISTS (
      SELECT 1
      FROM operations_user_roles our
      WHERE our.user_id = current_setting('app.current_user_id', true)::uuid
        AND our.active = TRUE
        AND our.role IN ('product_admin', 'support', 'sales_success')
    )
  );

CREATE POLICY knowledge_articles_ops_write ON knowledge_articles
  FOR ALL USING (
    EXISTS (
      SELECT 1
      FROM operations_user_roles our
      WHERE our.user_id = current_setting('app.current_user_id', true)::uuid
        AND our.active = TRUE
        AND our.role IN ('product_admin', 'support')
    )
  );

CREATE OR REPLACE FUNCTION match_knowledge_articles(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.75,
  match_count int DEFAULT 8
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  category TEXT,
  product_area_tag TEXT,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    ka.id,
    ka.title,
    ka.content,
    ka.category,
    ka.product_area_tag,
    1 - (ka.embedding <=> query_embedding) AS similarity
  FROM knowledge_articles ka
  WHERE ka.status = 'published'
    AND ka.embedding IS NOT NULL
    AND 1 - (ka.embedding <=> query_embedding) > match_threshold
  ORDER BY ka.embedding <=> query_embedding
  LIMIT match_count;
$$;

COMMENT ON TABLE support_tickets IS 'Unified customer support, issue, feature, billing, and landing-page intake for Aethos Operations Hub.';
COMMENT ON TABLE knowledge_articles IS 'Aethos enablement and support knowledge base with optional pgvector embeddings.';
COMMENT ON TABLE operations_user_roles IS 'Internal Operations Hub RBAC roles for Sales/Success, Support, and Product Admin views.';
