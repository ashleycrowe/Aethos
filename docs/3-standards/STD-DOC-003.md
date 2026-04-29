---
status: Active
type: Process Standard
phase: All Phases
audience: [All Teams]
priority: Medium
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [documentation, standards, knowledge-management]
document_id: STD-DOC-003
---

# [STANDARD] Aethos Documentation Standards
## Knowledge Management & Standards Governance

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Engineering Team  
**Authority:** RECOMMENDED  
**Document ID:** STD-DOC-003

---

## 🚨 CRITICAL RULES

1. ✅ **STANDARDS IN /docs/3-standards/** - All official standards live in `/docs/3-standards/`
2. ✅ **YAML FRONTMATTER** - Every standard must have metadata header
3. ✅ **MARKDOWN FORMAT** - All documentation uses Markdown (.md)
4. ✅ **LAST_UPDATED DATE** - Update `last_updated` field when editing
5. ✅ **VERSION CONTROL** - All docs committed to Git

---

## 📁 Documentation Structure

```
/docs/
  ├── 3-standards/              # Official standards (CANONICAL)
  │   ├── README.md             # Standards index
  │   ├── STD-*.md              # Individual standards
  │   └── _MIGRATION_STATUS.md  # Migration tracking
  ├── MASTER_DESIGN_GUIDE.md    # Complete design reference
  ├── SIMPLIFIED_ARCHITECTURE.md # Architecture overview
  └── Guidelines.md             # Project guidelines

/src/app/
  └── USER_STORIES.md           # Feature user stories
```

---

## 📝 Standard Document Template

```markdown
---
status: Active | Future | Deprecated
type: Core Strategic Standard | Feature Standard | Process Standard
phase: All Phases | Phase 1 | Phase 2+
audience: [Teams who need to read this]
working_group: [Technical, Design, Product]
priority: Critical | High | Medium | Low
last_updated: YYYY-MM-DD
location: /docs/3-standards/
tags: [relevant, keywords]
document_id: STD-XXX-001
---

# [STANDARD] Title
## Subtitle

**Version:** X.0  
**Date:** Month DD, YYYY  
**Status:** 🟢 ACTIVE  
**Owner:** Team Name  
**Description:** Brief description  
**Authority:** MANDATORY | RECOMMENDED | REFERENCE  
**Document ID:** STD-XXX-001

---

## 🚨 MANDATORY RULES

1. ✅ Rule 1
2. ✅ Rule 2

---

## Content sections...

---

**Document ID:** STD-XXX-001  
**Location:** `/docs/3-standards/STD-XXX-001.md`
```

---

## ✅ COMPLIANCE CHECKLIST

- [ ] Document has YAML frontmatter
- [ ] `last_updated` field is current
- [ ] Document ID matches filename
- [ ] Location field is correct
- [ ] Status badge is accurate (🟢/🔵/🔴)
- [ ] Related standards are cross-referenced

---

**Document ID:** STD-DOC-003  
**Location:** `/docs/3-standards/STD-DOC-003.md`
