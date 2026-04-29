# ⚠️ STANDARDS DIRECTORY - REFERENCE ONLY

**Status:** PARTIALLY MIGRATED (2026-02-27)  
**New Location:** `/docs/3-standards/`

---

## 📋 Migration Status

This directory has been **partially migrated** to `/docs/3-standards/`.

**Migrated Files (12):** ✅ Now located in `/docs/3-standards/`
- STD-DESIGN-001.md → `/docs/3-standards/STD-DESIGN-001.md`
- STD-CODE-001.md → `/docs/3-standards/STD-CODE-001.md`
- STD-SEC-001.md → `/docs/3-standards/STD-SEC-001.md`
- STD-DATA-001.md → `/docs/3-standards/STD-DATA-001.md`
- STD-API-001.md → `/docs/3-standards/STD-API-001.md`
- STD-M365-001.md → `/docs/3-standards/STD-M365-001.md`
- STD-ERROR-001.md → `/docs/3-standards/STD-ERROR-001.md`
- DECISION-LOG.md → `/docs/3-standards/DECISION-LOG.md`
- IntelligenceStreamProtocols.md → `/docs/3-standards/IntelligenceStreamProtocols.md`
- MASTER-PROJECT-PLAN.md → `/docs/3-standards/MASTER-PROJECT-PLAN.md`
- SidecarWhitepaper.md → `/docs/3-standards/SidecarWhitepaper.md`

**Remaining Files (13):** ⚠️ REFERENCE ONLY
- STD-A11Y-001.md
- STD-AI-001.md
- STD-DEV-001.md
- STD-DEVOPS-001.md
- STD-DOC-003.md
- STD-ETHOS-001.md
- STD-FAQ-001.md
- STD-GTM-001.md
- STD-I18N-001.md
- STD-PERF-001.md
- STD-RESP-001.md
- STD-TASK-001.md
- STD-TEST-001.md

---

## ⚠️ IMPORTANT: Use New Location

**For all new development, use:** `/docs/3-standards/`

The files remaining in this directory (`/src/standards/`) are:
- Reference only (not actively maintained)
- Lower priority standards
- May contain outdated architecture references (Azure vs Vercel)

**If you need a file from this directory:**
1. Check if it's already been migrated to `/docs/3-standards/`
2. If not migrated and you need it, migrate it yourself (update paths, architecture refs)
3. Delete the old version from `/src/standards/`

---

## 📚 Migration Details

**See:** `/docs/3-standards/_MIGRATION_STATUS.md` for complete migration details.

**What was updated in migrated files:**
- Architecture references: Azure → Vercel + Supabase
- Database references: Cosmos DB → Supabase PostgreSQL
- Backend references: Azure Functions → Vercel Serverless Functions
- Enhanced with code examples and implementation guides
- Updated "Last Updated" dates to 2026-02-27
- Added `location:` metadata field

---

## 🔄 Next Actions

**Option 1: Migrate on-demand**
- When you need a file, migrate it to `/docs/3-standards/`
- Update architecture references
- Delete from `/src/standards/`

**Option 2: Deprecate unused files**
- If a standard is no longer relevant, mark it as DEPRECATED
- Don't migrate, just leave for historical reference

**Option 3: Leave as-is**
- Keep as reference documentation
- Mark clearly as "May contain outdated architecture references"

---

**For questions about migration, see:** `/docs/3-standards/_MIGRATION_STATUS.md`
