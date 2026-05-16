# 💰 Aethos Pricing Strategy - Reference Guide

**Date:** 2026-02-26  
**Status:** ✅ **APPROVED - REFERENCE PRICING**  
**Owner:** CEO / Product Lead

---

## 2026-05-16 AI+ Usage Guardrail Update

V1.5 AI+ remains a paid add-on direction, but paid launch should include explicit usage controls before it is treated as generally available.

Current implementation supports pre-release/local validation through:

- tenant-level `ai_features_enabled`
- backend-only `OPENAI_API_KEY`
- manual Oracle `Index Content`
- Admin Center `AI+ Readiness`
- semantic search, summaries, PII scans, and review-first AI+ metadata suggestions

Before paid AI+ launch, add:

- monthly AI credit budget
- per-action usage ledger
- bulk job queue
- admin usage meter
- cache-first charging rules
- overage or expansion-pack policy

Detailed guardrails: `docs/AI_PLUS_USAGE_GUARDRAILS.md`.

---

## 🎯 **Decision Made: Option 1B (Base + AI Upsell)**

**Approved Pricing Model for v1:**

**Base Tier: $499/mo per tenant** *(reference/suggested)*
- Includes: Discovery + Workspaces + Oracle (Metadata Intelligence)
- Flat rate, unlimited users
- Multi-tenant model

**AI+ Content Intelligence: +$199/mo** *(reference/suggested)*
- Opt-in content reading (reads file bodies with permission)
- Semantic search with OpenAI embeddings
- Document summaries and topic extraction
- Toggleable (privacy-friendly, some customers don't want AI)

**Note:** Pricing is **reference/suggested** for testing market fit. This provides a baseline for customer conversations and can be adjusted based on feedback, competitive analysis, and value validation during beta.

---

## ✅ **What's Approved**

**For v1 (Build These):**
- ✅ Base tier infrastructure ($499/mo reference)
- ✅ AI+ upsell infrastructure (+$199/mo reference)
- ✅ `tenant_ai_settings` table (toggles for AI features)
- ✅ Billing UI (subscription management, upgrade flow)

**What's Deferred:**
- ❌ Enterprise tier ($48K/year) - Defer to v1.1 (no white-glove service)
- ❌ Phase 3+ add-on pricing - Defer until features built (2027+)
- ❌ Hard commitment to exact prices - Can adjust based on market feedback

---

## 🎯 **Pricing Philosophy: "Suggested, Not Locked"**

**Why "Reference Pricing"?**
- Allows market testing without rigid commitment
- Can adjust based on customer willingness to pay
- Enables custom enterprise deals without breaking pricing model
- Beta customers get grandfathered rates (marketing advantage)

**Flexibility:**
- One customer says $499 is high → Test $399 with next cohort
- Enterprise customer wants $48K/year → Negotiate custom deal
- Customer wants only AI+ → Offer standalone (future)

**Hard Rules:**
- ✅ Build billing infrastructure (Stripe, subscription management)
- ✅ Two-tier model exists (Base + AI Add-On)
- ⚠️ Exact dollar amounts can flex

---

## 🔒 **Retention Strategy: Tag-Based Workspace Sync**

**New v1 Feature:** Tag-based auto-sync rules for workspaces

**Why This Matters for Revenue:**

1. **Prevents One-Time Cleanup Churn:**
   - ❌ **Old risk:** Customer signs up → cleans up waste → cancels (one-time value)
   - ✅ **New solution:** Workspaces become mission-critical operational tool (ongoing value)

2. **Creates Lock-In Through Organization:**
   - Metadata Intelligence Layer AI-enriches files with tags
   - Workspaces auto-sync files based on tags (e.g., "Add all files tagged [q1-2026, budget]")
   - Teams rely on workspaces for daily work (not just cleanup)
   - **Lose Aethos → lose smart aggregation → organizational chaos**

3. **Makes Metadata Cleanup Mission-Critical:**
   - ❌ **Weak pitch:** "Clean metadata so search is better" (nice to have)
   - ✅ **Strong pitch:** "Clean metadata so workspaces auto-organize" (must have)
   - Better tags → more accurate workspaces → more value → less churn

4. **Network Effects:**
   - More files tagged → more accurate workspaces
   - More workspaces using tag-sync → more incentive to tag well
   - Virtuous cycle of metadata quality

**Revenue Impact:**
- **Base Case (No Tag Sync):** 60% annual retention → $299K ARR from 100 customers
- **With Tag Sync:** 80% annual retention → $399K ARR from 100 customers
- **Net Gain:** +$100K ARR per 100 customers (+33% revenue)

**Implementation Cost:**
- Already included in Week 7-8 roadmap (Workspaces module)
- No additional timeline impact
- Database schema already designed (sync_rules table)

**Strategic Positioning:**
- Base tier feature (not AI+ upsell) - drives retention for all customers
- Competitive differentiator (SharePoint/Teams can't do cross-platform tag aggregation)
- Enables "Aethos is where you work, not just where you clean up"

---

## 🛠️ **Implementation Impact**

### **If We Choose Option 1A (Simple Base Only):**
- **Timeline:** No change (Week 1-12 roadmap is accurate)
- **Billing:** Basic Stripe subscription (1 plan)
- **Supabase:** Just `tenant_subscription` table (no tiers)
- **UI:** No pricing page needed

### **If We Choose Option 1B (Base + AI Upsell - Recommended):**
- **Timeline:** Add 2-3 weeks for billing features
  - Week 11: Build subscription management UI
  - Week 12: Build AI toggle + billing integration
- **Billing:** Stripe with 2 plans (Base + AI Add-On)
- **Supabase:** Add `tenant_ai_settings` table (already in Content Oracle spec!)
- **UI:** Need "Upgrade to AI+" CTA in Oracle search results

---

## 📊 **Revenue Scenarios (Year 1)**

### **Scenario A: No AI Upsell**
```
50 customers × $499/mo × 12 months = $299,400/year
```

### **Scenario B: With AI Upsell (30% adoption)**
```
Base: 50 customers × $499/mo × 12 = $299,400
AI+:  15 customers × $199/mo × 12 = $35,820
Total: $335,220/year (+12% revenue)
```

### **Scenario C: With AI Upsell (60% adoption)**
```
Base: 50 customers × $499/mo × 12 = $299,400
AI+:  30 customers × $199/mo × 12 = $71,640
Total: $371,040/year (+24% revenue)
```

**Insight:** If even 30% of customers enable AI+, we generate an extra $36K/year with minimal additional cost (OpenAI API costs are ~$5-10/customer/month, so margin is high).

---

## ✅ **My Recommendation**

**Build v1 with Base + AI Upsell ($499 + $199)**

**Rationale:**
1. **Bigger market:** Privacy-conscious customers can use Aethos without AI
2. **Higher revenue:** 30%+ of customers will want semantic search (AI+)
3. **Competitive:** "AI is optional, not forced" is a selling point vs. Copilot
4. **Already designed:** `tenant_ai_settings` table is in Content Oracle spec
5. **Timeline acceptable:** 2-3 week delay for billing UI is worth $35K+/year

**Action Items:**
- [ ] CEO/Product Lead: Approve pricing model (Base + AI or Base only?)
- [ ] Update DECISION-LOG.md: Mark DEC-BUS-001 as **APPROVED**
- [ ] Update V1_IMPLEMENTATION_ROADMAP.md: Add billing features to Week 11-12
- [ ] Update CONSOLIDATED_SPEC Section 1.3: Remove Phase 3+ pricing (just features)
- [ ] Create DEC-BUS-002: Document AI+ pricing decision

---

## 📞 **Next Steps**

**This Week:**
1. **Product Owner decides:** Base only OR Base + AI upsell
2. Update documentation with final decision
3. Update V1 roadmap if billing features needed

**Week 1-2 (Database):**
- Implement `tenant_subscription` table (required)
- Implement `tenant_ai_settings` table (if AI upsell approved)

**Week 11-12 (Billing - if AI upsell approved):**
- Build subscription management UI
- Integrate Stripe billing
- Build "Upgrade to AI+" flow in Oracle

---

**Status:** 🔴 **DECISION REQUIRED** - Cannot finalize v1 roadmap until pricing model approved

**Decision Owner:** CEO / Product Lead  
**Decision Deadline:** Before Week 1 (Database design depends on pricing model)
