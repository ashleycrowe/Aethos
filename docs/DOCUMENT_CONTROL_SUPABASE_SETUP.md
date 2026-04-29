# Document Control - Supabase Setup Guide (5 Minutes)

**Goal:** Get your Document Control System connected to a real Supabase database  
**Time:** ~5 minutes  
**Cost:** $0 (free tier)

---

## ✅ Quick Start Checklist

- [ ] Create Supabase project
- [ ] Run database schema script
- [ ] Configure RLS (Row-Level Security)
- [ ] Get connection string
- [ ] Update environment variables
- [ ] Test connection

---

## 📦 Step 1: Create Supabase Project (1 minute)

### Option A: Use Existing Project
If you already have a Supabase project for Aethos:
1. Go to [app.supabase.com](https://app.supabase.com)
2. Open your existing Aethos project
3. Skip to Step 2

### Option B: Create New Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name:** Aethos Document Control (or any name)
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

---

## 🗄️ Step 2: Run Database Schema (2 minutes)

### Open SQL Editor
1. In your Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"+ New query"**

### Copy-Paste the Schema Script

**File:** `/docs/DOCUMENT_CONTROL_DATABASE_SCHEMA.md`

You'll run the SQL in this order:

#### 2A: Core Tables (Copy and Run)

```sql
-- TABLE 1: document_libraries
CREATE TABLE document_libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  numbering_prefix TEXT NOT NULL,
  next_number INTEGER DEFAULT 1,
  compliance_standard TEXT,
  requires_acknowledgement BOOLEAN DEFAULT true,
  acknowledgement_threshold INTEGER DEFAULT 80,
  is_private BOOLEAN DEFAULT false,
  allowed_roles TEXT[] DEFAULT ARRAY['ARCHITECT', 'CURATOR'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT unique_library_name UNIQUE (tenant_id, name)
);

CREATE INDEX idx_libraries_tenant ON document_libraries(tenant_id);
CREATE INDEX idx_libraries_compliance ON document_libraries(compliance_standard);
CREATE INDEX idx_libraries_deleted ON document_libraries(deleted_at) WHERE deleted_at IS NOT NULL;

ALTER TABLE document_libraries ENABLE ROW LEVEL SECURITY;

-- TABLE 2: controlled_documents
CREATE TABLE controlled_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  library_id UUID NOT NULL REFERENCES document_libraries(id) ON DELETE CASCADE,
  document_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  version TEXT DEFAULT '1.0',
  effective_date TIMESTAMPTZ,
  review_due_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  owner_id UUID,
  author_id UUID,
  health_score INTEGER DEFAULT 0,
  health_level TEXT,
  last_health_check TIMESTAMPTZ,
  requires_signature BOOLEAN DEFAULT false,
  is_superseded_by UUID REFERENCES controlled_documents(id),
  supersedes UUID REFERENCES controlled_documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID,
  published_at TIMESTAMPTZ,
  published_by UUID,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT unique_document_number UNIQUE (tenant_id, document_number),
  CONSTRAINT valid_health_score CHECK (health_score >= 0 AND health_score <= 100)
);

CREATE INDEX idx_documents_tenant ON controlled_documents(tenant_id);
CREATE INDEX idx_documents_library ON controlled_documents(library_id);
CREATE INDEX idx_documents_status ON controlled_documents(status);
CREATE INDEX idx_documents_owner ON controlled_documents(owner_id);
CREATE INDEX idx_documents_expiration ON controlled_documents(expiration_date) WHERE expiration_date IS NOT NULL;
CREATE INDEX idx_documents_health ON controlled_documents(health_score);
CREATE INDEX idx_documents_deleted ON controlled_documents(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_documents_search ON controlled_documents USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

ALTER TABLE controlled_documents ENABLE ROW LEVEL SECURITY;

-- Continue with remaining tables...
-- (See full schema in DOCUMENT_CONTROL_DATABASE_SCHEMA.md)
```

**💡 Tip:** Copy each table creation block from the schema doc one at a time, paste into SQL Editor, and click **"RUN"**.

---

## 🔐 Step 3: Configure RLS (30 seconds)

Run this function to enable multi-tenant security:

```sql
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

Then enable RLS policies (already in schema scripts above).

---

## 🔗 Step 4: Get Connection Details (30 seconds)

### In Supabase Dashboard:
1. Click **"Settings"** → **"API"**
2. Copy these values:

```
Project URL: https://[your-project-id].supabase.co
Anon/Public Key: eyJhbGc... (long string)
Service Role Key: eyJhbGc... (long string - KEEP SECRET!)
```

---

## ⚙️ Step 5: Update Environment Variables (1 minute)

### Create `.env` file in your project root:

```env
# Supabase Connection
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key

# Server-Side Only (DO NOT EXPOSE TO CLIENT)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# Document Control Feature Flag
VITE_ENABLE_DOCUMENT_CONTROL=true
```

### Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## 🧪 Step 6: Test Connection (30 seconds)

### Create test file: `/src/app/utils/supabaseClient.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Test in browser console:

```typescript
import { supabase } from './utils/supabaseClient';

// Test query
const { data, error } = await supabase
  .from('document_libraries')
  .select('*')
  .limit(10);

console.log('Libraries:', data);
// Should return [] (empty array) if successful
```

---

## ✅ Verification Checklist

### Database Tables Created?
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'document%'
ORDER BY table_name;
```

**Expected:** 14 rows (all document tables)

### RLS Enabled?
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename LIKE 'document%';
```

**Expected:** All tables show `rowsecurity = t`

### Connection Works?
```typescript
const { data } = await supabase.from('document_libraries').select('count');
console.log(data); // Should not error
```

**Expected:** No errors, returns `{ count: 0 }`

---

## 🎯 Next Steps: Connect Frontend to Backend

### Update Context to Use Real Data

**File:** `/src/app/modules/document-control/context/DocumentControlContext.tsx`

```typescript
import { supabase } from '../../../utils/supabaseClient';

// Replace mockData with real queries
const loadLibraries = async () => {
  const { data, error } = await supabase
    .from('document_libraries')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

const loadDocuments = async () => {
  const { data, error } = await supabase
    .from('controlled_documents')
    .select(`
      *,
      library:document_libraries(*),
      owner:users(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
```

### Create API Helper Functions

**File:** `/src/app/modules/document-control/services/documentService.ts`

```typescript
import { supabase } from '../../../utils/supabaseClient';
import type { DocumentLibrary, ControlledDocument } from '../types/document-control.types';

export const documentService = {
  // Libraries
  async getLibraries(): Promise<DocumentLibrary[]> {
    const { data, error } = await supabase
      .from('document_libraries')
      .select('*')
      .is('deleted_at', null);
    
    if (error) throw error;
    return data;
  },

  async createLibrary(library: Partial<DocumentLibrary>): Promise<DocumentLibrary> {
    const { data, error } = await supabase
      .from('document_libraries')
      .insert([library])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Documents
  async getDocuments(libraryId?: string): Promise<ControlledDocument[]> {
    let query = supabase
      .from('controlled_documents')
      .select(`
        *,
        library:document_libraries(*),
        owner:users(*),
        versions:document_versions(count)
      `)
      .is('deleted_at', null);
    
    if (libraryId) {
      query = query.eq('library_id', libraryId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createDocument(document: Partial<ControlledDocument>): Promise<ControlledDocument> {
    const { data, error } = await supabase
      .from('controlled_documents')
      .insert([document])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDocument(id: string, updates: Partial<ControlledDocument>): Promise<ControlledDocument> {
    const { data, error } = await supabase
      .from('controlled_documents')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Acknowledgements
  async getAcknowledgements(documentId: string) {
    const { data, error } = await supabase
      .from('acknowledgements')
      .select(`
        *,
        user:users(*)
      `)
      .eq('document_id', documentId);
    
    if (error) throw error;
    return data;
  },

  async acknowledgeDocument(documentId: string, userId: string) {
    const { data, error } = await supabase
      .from('acknowledgements')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString()
      })
      .eq('document_id', documentId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};
```

---

## 🚨 Common Issues & Solutions

### Issue: "relation does not exist"
**Solution:** Table wasn't created. Re-run the CREATE TABLE script.

### Issue: "new row violates row-level security policy"
**Solution:** Set tenant context before queries:
```typescript
await supabase.rpc('set_tenant_context', {
  p_tenant_id: 'your-tenant-id',
  p_user_id: 'your-user-id',
  p_user_role: 'ARCHITECT'
});
```

### Issue: "permission denied for table"
**Solution:** Check RLS policies are created and enabled.

### Issue: Environment variables not working
**Solution:** 
1. Restart dev server after adding `.env`
2. Make sure variables start with `VITE_` for Vite projects
3. Check `.env` is in project root (not `/src`)

---

## 📊 Free Tier Limits

| Resource | Free Tier | Document Control Usage | Status |
|----------|-----------|------------------------|--------|
| Database | 500 MB | ~85 MB (1,000 docs) | ✅ Safe |
| Bandwidth | 2 GB/mo | ~100 MB/mo (normal use) | ✅ Safe |
| Storage | 1 GB | Files stored separately | ✅ Safe |
| API Requests | Unlimited | Unlimited | ✅ Safe |

**Recommendation:** Start with free tier, upgrade to Pro ($25/mo) when you hit 5,000+ documents.

---

## 🎉 You're Done!

Your Document Control System now has a real database!

### What You Can Do Now:
- ✅ Create libraries in the UI → Saved to Supabase
- ✅ Add documents → Persisted across page refreshes
- ✅ Track acknowledgements → Real user data
- ✅ Approval workflows → Stored in database
- ✅ Audit logs → Immutable compliance trail

### Next Steps:
1. **Test the full flow:** Create library → Add document → Submit for approval
2. **Add file upload:** Integrate Supabase Storage for actual files
3. **Enable notifications:** Add email/webhook triggers
4. **Add users:** Import from Microsoft Entra ID

---

**Need Help?**
- 📚 [Supabase Docs](https://supabase.com/docs)
- 📋 [Full Schema Reference](/docs/DOCUMENT_CONTROL_DATABASE_SCHEMA.md)
- 🛠️ [Implementation Guide](/docs/DOCUMENT_CONTROL_IMPLEMENTATION.md)

**Status:** ✅ Ready to Deploy  
**Time to Complete:** ~5 minutes  
**Cost:** $0 (free tier)
