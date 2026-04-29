---
status: Active
type: Reference Standard
phase: All Phases
audience: [All Teams, Sales, Support]
priority: Medium
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [faq, knowledge-base, support]
document_id: STD-FAQ-001
---

# [STANDARD] Aethos Frequently Asked Questions
## Knowledge Base & Common Questions

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Product & Support Team  
**Authority:** REFERENCE  
**Document ID:** STD-FAQ-001

---

## 🎯 PRODUCT OVERVIEW

**Q: What is Aethos?**  
A: Aethos is an intelligence layer for Microsoft 365 tenants. We enrich metadata, enable cross-provider search, and provide operational clarity without storing file contents.

**Q: Why "The Anti-Intranet"?**  
A: Legacy intranets are static information silos. Aethos is a dynamic intelligence stream that connects fragmented enterprise data.

---

## 💰 PRICING & TIERS

**Q: What are the pricing tiers?**  
A: 
- **14-Day Trial:** $0 (1 workspace limit, view-only)
- **Base Tier:** $499/tenant/month (metadata intelligence)
- **AI+ Tier:** $698/tenant/month (Base + content reading)

**Q: What's included in Base vs AI+?**  
A: Base tier includes metadata enrichment, tag management, workspace auto-sync, and cross-provider search. AI+ adds semantic search, document summarization, and content-level duplicate detection.

**Q: Can I try before buying?**  
A: Yes. 14-day free trial with 1 workspace and 100 assets. No credit card required.

---

## 🔐 SECURITY & PRIVACY

**Q: Do you store our files?**  
A: No. Aethos stores only metadata pointers (file names, paths, activity logs). We never download or store file contents in Base tier.

**Q: What about AI+ tier?**  
A: AI+ tier reads file contents for analysis but does not store them. Content is processed in-memory via Azure OpenAI and immediately discarded.

**Q: Is Aethos SOC 2 compliant?**  
A: We inherit compliance from Vercel (SOC 2 Type II) and Supabase (SOC 2 Type II). Full GDPR compliance. Dedicated VPAT available upon request.

**Q: Where is data stored?**  
A: All metadata is stored in Supabase (AWS us-east-1 by default). You can request regional data residency for enterprise contracts.

---

## 🛠️ TECHNICAL

**Q: What integrations do you support?**  
A: 
- **Tier 1 (Full Management):** Microsoft 365, Slack
- **Tier 2 (Discovery):** Google Workspace, Box, Local Storage

**Q: Do I need to install anything?**  
A: No. Aethos is 100% cloud-based. Access via web browser at `app.aethos.com`. Microsoft 365 admin consent required for Graph API permissions.

**Q: What permissions does Aethos need?**  
A: Read access to SharePoint sites, Teams, OneDrive, and user profiles via Microsoft Graph API. We use delegated permissions (user-level, not app-level).

**Q: Can I self-host Aethos?**  
A: Not currently. Aethos is SaaS-only to ensure performance, security, and compliance.

---

## 🎯 FEATURES

**Q: What is "Workspace Auto-Sync"?**  
A: Tag-based rules that automatically add matching assets to workspaces. Example: All files tagged "q1-2026" and "product-launch" auto-populate the "Q1 Launch" workspace.

**Q: What is the Oracle search?**  
A: Cross-provider search across Microsoft 365, Slack, Google, and Box. Base tier uses metadata search. AI+ tier uses semantic/vector search.

**Q: Can I archive old files?**  
A: Not directly. Aethos identifies waste/orphaned content but doesn't modify source data. You execute remediation in native platforms (SharePoint, Slack, etc.).

---

## 📊 USE CASES

**Q: Who is Aethos for?**  
A: IT Directors, M365 Admins, Enterprise Architects, and Operations Leadership managing 500+ users with significant Microsoft 365 sprawl.

**Q: What problems does Aethos solve?**  
A: 
- Finding data across siloed platforms
- Identifying storage waste and orphaned content
- Organizing cross-platform projects into virtual workspaces
- Reconciling user identities across M365/Slack/Google

**Q: How long to see ROI?**  
A: Typical customers identify $10K-20K in annual storage waste within 30 days.

---

## 🚀 GETTING STARTED

**Q: How do I get started?**  
A: 
1. Sign up for 14-day trial at `app.aethos.com`
2. Connect Microsoft 365 (admin consent required)
3. Run initial Discovery scan
4. Create your first workspace

**Q: Do you offer onboarding?**  
A: Yes. All customers receive a 60-minute onboarding call with a Solutions Architect.

**Q: Can I migrate from another tool?**  
A: Contact us at `support@aethos.com` for migration assistance.

---

## 📞 SUPPORT

**Q: How do I get help?**  
A: 
- **Email:** support@aethos.com
- **Chat:** In-app chat (bottom right)
- **Documentation:** docs.aethos.com

**Q: What is your SLA?**  
A: 99.9% uptime guaranteed. Critical issues resolved within 4 hours. Standard support 9am-5pm EST weekdays.

---

**Document ID:** STD-FAQ-001  
**Status:** 🟢 ACTIVE REFERENCE  
**Location:** `/docs/3-standards/STD-FAQ-001.md`
