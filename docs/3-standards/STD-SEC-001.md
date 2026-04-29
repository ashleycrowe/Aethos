# [STANDARD] Aethos Security & Privacy Standards
## Data Sovereignty and Cinematic Security Governance

---
status: Active
type: Core Strategic Standard
phase: All Phases
audience: [Security, Engineering, Legal, Architecture]
priority: Critical
last_updated: 2026-02-27
document_id: STD-SEC-001
location: `/docs/3-standards/STD-SEC-001.md`
---

## 📋 Executive Summary

This standard establishes the mandatory security and privacy requirements for Aethos. As an enterprise intelligence layer for Microsoft 365, Aethos follows a "Zero-Body" architecture—storing only metadata pointers and waste indicators while ensuring absolute data sovereignty for the tenant. We utilize Entra ID for all identity orchestration and enforce a strict Sidecar security model.

**Architecture Context:** Simplified free-tier (Vercel + Supabase). See `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`

---

## 🚨 MANDATORY CRITICAL RULES

1. **ZERO-BODY STORAGE:** Never store file bodies, email content, or chat transcripts. Only store metadata pointers (e.g., file size, last access, tenant ID) in Supabase PostgreSQL.

2. **ENTRA ID ONLY:** Authentication MUST use Microsoft Entra ID (MSAL.js with delegated permissions). No custom credentials or third-party auth providers.

3. **ENVIRONMENT SECRETS:** All API keys, connection strings, and certificates MUST reside in **Vercel Environment Variables** (encrypted at rest). Never expose secrets in frontend code or version control.

4. **ENCRYPT IN TRANSIT & AT REST:** 
   - TLS 1.3+ for all communications (automatic with Vercel HTTPS)
   - Database encryption at rest (automatic with Supabase)
   - Secrets encrypted in Vercel environment (automatic)

5. **NO PII IN LOGS:** Scrub all logs of Personally Identifiable Information (PII) before storage. Use Vercel Analytics (anonymized) or self-hosted logging.

6. **LEAST PRIVILEGE:** Graph API scopes must be audited quarterly to ensure we only request the metadata needed for Discovery, Workspaces, and Oracle modules.

7. **ROW-LEVEL SECURITY:** All database queries MUST enforce tenant isolation via Supabase RLS policies. See `STD-DATA-001.md`.

---

## 🔒 Data Classification (Aethos Model)

| Level | Description | Example Data | Handling Requirement |
| :--- | :--- | :--- | :--- |
| **PUBLIC** | Non-sensitive tenant info | Tenant Name, Total User Count | Standard TLS |
| **INTERNAL** | Workspace metadata | Team Names, Channel IDs, Waste % | Logged Access, RLS |
| **CONFIDENTIAL** | User-specific pointers | User Principal Name (UPN), Manager ID | Encrypted, Audit Log, RLS |
| **RESTRICTED** | Security & Auth tokens | Entra ID Tokens, Supabase Secrets | Environment Variables Only, MFA |

---

## 🛡️ Multi-Tenant Security Architecture

### Tenant Isolation Strategy

Every database table enforces tenant isolation using PostgreSQL Row-Level Security (RLS):

```sql
-- Example: containers table
CREATE TABLE containers (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  name TEXT,
  metadata JSONB,
  ...
);

-- RLS Policy: Users can only see their tenant's data
CREATE POLICY tenant_isolation ON containers
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Enable RLS
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;
```

**Key Security Benefits:**
- Database-level enforcement (cannot be bypassed by application bugs)
- Zero-trust model (even compromised API keys can't access other tenants)
- Automatic filtering (no need to add WHERE clauses manually)

### Supabase Security Configuration

```typescript
// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-tenant-id': getCurrentTenantId() // Set tenant context
      }
    }
  }
);
```

---

## 👤 GDPR & Privacy Governance

### Right to be Forgotten

Aethos supports the "Right to be Forgotten" by providing a tenant purge API:

**Endpoint:** `DELETE /api/tenant/:tenantId/purge`

**Implementation:**
```typescript
// /api/tenant/[tenantId]/purge.ts
export async function DELETE(req: Request, { params }: { params: { tenantId: string } }) {
  const { tenantId } = params;
  
  // Verify admin permissions
  const isAdmin = await verifyTenantAdmin(req, tenantId);
  if (!isAdmin) return Response.json({ error: 'Unauthorized' }, { status: 403 });
  
  // Delete all tenant data (cascading delete via foreign keys)
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', tenantId);
  
  if (error) throw error;
  
  // Log deletion for compliance audit trail
  await logComplianceEvent({
    type: 'TENANT_PURGE',
    tenantId,
    timestamp: new Date(),
    initiatedBy: req.user.id
  });
  
  return Response.json({ success: true });
}
```

**What Gets Deleted:**
- All workspace metadata
- All container pointers
- All intelligence scores
- All user activity logs
- All notification history

**What Remains:**
- Anonymized usage metrics (tenant ID removed)
- Billing records (legal requirement)

### Data Portability

All workspace intelligence can be exported as JSON:

**Endpoint:** `GET /api/tenant/:tenantId/export`

**Returns:** Machine-readable JSON with all metadata for GDPR compliance review.

---

## 💻 Secure Development Practices

### Input Sanitization

All user inputs must be sanitized to prevent XSS:

```typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: []
  });
}

// Usage in components
const handleSubmit = (userInput: string) => {
  const clean = sanitizeInput(userInput);
  await saveToDatabase(clean);
};
```

### CSRF & XSS Prevention

- **CSRF:** Vercel Serverless Functions enforce same-origin policy
- **XSS:** Content Security Policy (CSP) headers set in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### SQL Injection Prevention

**Always use parameterized queries with Supabase:**

```typescript
// ❌ BAD: Direct string concatenation (SQL injection risk)
const { data } = await supabase
  .from('containers')
  .select('*')
  .eq('name', userInput); // Safe with Supabase (automatically parameterized)

// ✅ GOOD: Supabase automatically parameterizes all queries
const { data } = await supabase
  .from('containers')
  .select('*')
  .eq('name', userInput)
  .eq('tenant_id', tenantId); // RLS enforces this anyway
```

---

## 🔐 Authentication & Authorization

### Microsoft Entra ID Integration

**MSAL.js Configuration:**

```typescript
// /src/app/services/microsoft/msalConfig.ts
import { PublicClientApplication } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI!
  },
  cache: {
    cacheLocation: 'sessionStorage', // More secure than localStorage
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

// Request scopes (delegated permissions only)
export const loginRequest = {
  scopes: [
    'User.Read',
    'Sites.Read.All',
    'Files.Read.All',
    'Group.Read.All',
    'offline_access'
  ]
};
```

### Authorization Levels

| Role | Permissions | Implementation |
|------|-------------|----------------|
| **VIEWER** | Read-only access to dashboards | `can_read: true` |
| **CURATOR** | Create workspaces, add notes | `can_write: true` |
| **ARCHITECT** | Archive/delete, run scans | `can_delete: true` |
| **ADMIN** | Tenant settings, user management | `is_admin: true` |

**RLS Policy Example:**
```sql
-- Only admins can delete containers
CREATE POLICY delete_containers ON containers
  FOR DELETE
  USING (
    tenant_id = current_setting('app.tenant_id')::uuid
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = current_setting('app.user_id')::uuid
      AND users.is_admin = true
    )
  );
```

---

## 📊 Security Logging & Monitoring

### Event Logging Strategy

**Critical Events to Log:**
- Authentication (login/logout, failed attempts)
- Authorization failures (access denied)
- Data modifications (create/update/delete)
- Admin actions (user management, settings changes)
- API errors (500s, Graph throttling)

**Implementation:**

```typescript
// /src/app/services/logging/securityLogger.ts
interface SecurityEvent {
  type: 'AUTH' | 'AUTHZ' | 'DATA' | 'ADMIN' | 'ERROR';
  action: string;
  userId?: string;
  tenantId: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export async function logSecurityEvent(event: SecurityEvent) {
  // Remove PII from metadata
  const sanitized = sanitizePII(event);
  
  // Store in Supabase audit log
  await supabase
    .from('security_logs')
    .insert(sanitized);
  
  // Alert on critical events
  if (event.type === 'AUTHZ' && event.action === 'ACCESS_DENIED') {
    await alertSecurityTeam(sanitized);
  }
}

function sanitizePII(event: SecurityEvent): SecurityEvent {
  const sanitized = { ...event };
  
  // Remove sensitive fields
  if (sanitized.metadata) {
    delete sanitized.metadata.email;
    delete sanitized.metadata.phoneNumber;
    delete sanitized.metadata.ssn;
  }
  
  // Hash IP for privacy
  sanitized.ipAddress = hashIP(sanitized.ipAddress);
  
  return sanitized;
}
```

### Anomaly Detection

Monitor for suspicious patterns:
- **Brute Force:** >5 failed logins in 5 minutes
- **Mass Data Access:** >1000 records queried in 1 minute
- **Permission Escalation:** User role changed without admin action
- **Off-Hours Access:** Admin actions outside business hours

---

## 🔒 Secrets Management

### Vercel Environment Variables

**Production Secrets:**
```bash
# Supabase
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-key] # Backend only!

# Microsoft Entra ID
NEXT_PUBLIC_AZURE_CLIENT_ID=[client-id]
NEXT_PUBLIC_AZURE_TENANT_ID=[tenant-id]
AZURE_CLIENT_SECRET=[client-secret] # Backend only!

# OpenAI (for Oracle AI features)
OPENAI_API_KEY=[api-key] # Backend only!
```

**Security Rules:**
- ✅ Prefix public vars with `NEXT_PUBLIC_`
- ❌ Never expose service keys to frontend
- ✅ Use different keys for dev/staging/production
- ✅ Rotate secrets quarterly

### Key Rotation Schedule

| Secret Type | Rotation Frequency | Owner |
|-------------|-------------------|-------|
| Supabase Service Key | Quarterly | DevOps Lead |
| Azure Client Secret | Annually | Security Lead |
| OpenAI API Key | Quarterly | Product Lead |

---

## ✅ Compliance Checklist

Before deploying to production:

- [ ] **Authentication:** MSAL.js configured with Entra ID
- [ ] **Secrets:** All secrets in Vercel environment variables (not in code)
- [ ] **Database:** Supabase RLS policies enabled on all tables
- [ ] **Encryption:** TLS 1.3 verified (check Vercel SSL certificate)
- [ ] **PII Scrubbing:** Security logger sanitizes PII before logging
- [ ] **Graph Scopes:** Quarterly audit scheduled (next: 2026-05-01)
- [ ] **GDPR:** Tenant purge API tested and documented
- [ ] **CSP Headers:** Content Security Policy configured in `vercel.json`
- [ ] **Input Validation:** DOMPurify implemented on all user inputs
- [ ] **Audit Logs:** Security events logged to Supabase with 7-year retention

---

## 📚 Related Standards

- **STD-DATA-001:** Database & multi-tenant patterns
- **STD-API-001:** API security & rate limiting
- **STD-CODE-001:** Secure coding practices
- **STD-M365-001:** Microsoft Graph API security
- **Guidelines.md:** Security requirements section

---

## 🔄 Maintenance

**Review Cycle:** Quarterly (security-critical)  
**Owner:** Security Lead / Compliance Officer  
**Authority:** MANDATORY for Microsoft AppSource compatibility  
**Last Updated:** 2026-02-27 (Updated for simplified architecture, moved to /docs/3-standards/)

---

## 📞 Security Incident Response

**Report security issues to:** security@aethos.com (placeholder)

**Severity Levels:**
- **P0 (Critical):** Data breach, authentication bypass → Immediate response
- **P1 (High):** RLS bypass, PII leakage → 4-hour response
- **P2 (Medium):** XSS vulnerability, CSRF → 24-hour response
- **P3 (Low):** Outdated dependency, minor config issue → 1-week response
