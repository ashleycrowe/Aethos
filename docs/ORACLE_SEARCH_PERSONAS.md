# 🔮 Oracle Search: User Persona Queries

**Purpose:** Real-world search patterns by user type to guide Oracle UX and AI+ positioning  
**Date:** 2026-02-26  
**Status:** Reference Guide for v1 Implementation

---

## 🎯 **How to Use This Document**

- **For Product Design:** Build search UX that handles these query patterns
- **For Sales/Demo:** Show personas queries they'll actually use
- **For AI+ Positioning:** Queries marked ⚡ **require Content Reading** (upsell opportunity)

**Query Types:**
- 🟢 **Metadata-only** - Works with base tier (filenames, authors, dates, locations)
- ⚡ **Content-reading** - Requires AI+ tier (reads document contents, semantic search)
- 🔄 **Hybrid** - Works basic with metadata, MUCH better with AI+

---

## 👤 **Persona 1: IT Admin / Tenant Admin**

**Role:** Manages M365 tenant, responsible for governance, security, compliance  
**Pain Points:** Orphaned content, permission sprawl, storage waste, audit trails  
**Search Behavior:** Technical, specific, often looking for problems

### **Typical Queries:**

#### **Storage & Waste Management**
```
🟢 "files larger than 100mb not accessed in 6 months"
🟢 "sharepoint sites with no activity since 2024"
🟢 "duplicate files uploaded by john.smith@company.com"
🟢 "onedrive folders taking up most space"
🔄 "old vendor contracts we don't need anymore"
```

#### **Security & Compliance**
```
🟢 "files shared with external domains"
🟢 "documents modified after business hours"
🟢 "sharepoint sites with broken inheritance"
⚡ "documents containing social security numbers"
⚡ "files mentioning merger talks with Acme Corp"
⚡ "sensitive financial data outside finance workspace"
```

#### **Permission Auditing**
```
🟢 "who has access to the executive team site"
🟢 "files shared with everyone in the company"
🟢 "former employee sarah.jones still has access to"
🟢 "channels created by IT department in last 30 days"
```

#### **Governance & Cleanup**
```
🟢 "teams with more than 50 channels"
🟢 "archived teams still taking up storage"
🟢 "files in personal onedrive that belong in team sites"
🔄 "old project files from 2022 that can be archived"
⚡ "redundant copies of the employee handbook"
```

**What They Care About:**
- **Speed:** "Give me the list fast so I can take action"
- **Precision:** "Don't show me false positives"
- **Bulk Actions:** "Let me archive 500 files at once"

**AI+ Upsell Moment:**  
❌ Base Tier: "files shared externally" → Shows 2,000 files (filename search only)  
✅ AI+ Tier: "files containing SSN" → Shows 12 files (actually reads content, finds PII)

---

## 👔 **Persona 2: Department Head / Manager**

**Role:** Leads a team (Marketing, Sales, Engineering, HR)  
**Pain Points:** Can't find team knowledge, duplicate work, onboarding new hires  
**Search Behavior:** Broad, exploratory, looking for context

### **Typical Queries:**

#### **Team Knowledge Discovery**
```
🔄 "marketing campaign plans from last year"
🔄 "sales playbooks for enterprise customers"
⚡ "engineering docs about the authentication system"
⚡ "HR policies about remote work"
🔄 "design files for the rebrand project"
```

#### **Project Management**
```
🟢 "all files related to Project Phoenix"
🔄 "status updates from the Q4 roadmap"
⚡ "meeting notes where we discussed budget cuts"
⚡ "decisions made about the vendor selection"
🟢 "teams channels for the product launch"
```

#### **People & Onboarding**
```
🟢 "documents created by our newest team member"
🔄 "onboarding materials for new sales reps"
⚡ "training videos about our CRM system"
🟢 "who worked on the customer portal project"
🔄 "templates our team uses for client proposals"
```

#### **Cross-Team Collaboration**
```
⚡ "what engineering said about the API timeline"
⚡ "legal's feedback on the new contract template"
🔄 "finance department's budget planning spreadsheets"
⚡ "conversations about working with the Austin office"
```

**What They Care About:**
- **Context:** "Why did we make that decision?"
- **People:** "Who knows about this?"
- **History:** "What did we do last time?"

**AI+ Upsell Moment:**  
❌ Base Tier: "API timeline" → Shows files with "API" in name  
✅ AI+ Tier: "API timeline" → Reads meeting notes, finds "Q2 delivery target"

---

## 💼 **Persona 3: Knowledge Worker / Individual Contributor**

**Role:** Day-to-day employee (designer, developer, analyst, coordinator)  
**Pain Points:** "I know we have this somewhere", wasting time recreating work  
**Search Behavior:** Casual, conversational, often vague

### **Typical Queries:**

#### **Finding Templates & Resources**
```
🔄 "presentation template with the new branding"
🔄 "expense report form"
🟢 "the design system figma file"
⚡ "examples of good customer onboarding emails"
🔄 "code snippets for connecting to the database"
```

#### **"I Saw This Somewhere..."**
```
⚡ "document mentioning the new pricing tiers"
⚡ "slack message where someone shared the demo video"
⚡ "presentation with the competitor analysis"
🔄 "spreadsheet with all our customer contact info"
⚡ "that funny team photo from the offsite"
```

#### **Getting Unstuck**
```
⚡ "how do I submit a reimbursement request"
⚡ "who do I talk to about IT issues"
⚡ "where is the guide for using our CMS"
⚡ "documentation about the deployment process"
⚡ "meeting notes from the engineering standup"
```

#### **Collaboration Lookups**
```
🟢 "files I shared with the marketing team"
🟢 "documents Jane edited last week"
🟢 "my files that haven't been opened in a while"
⚡ "conversations about the logo redesign"
🟢 "teams channels I'm a member of"
```

**What They Care About:**
- **Speed:** "I need this now, I'm on a deadline"
- **Simplicity:** "Just show me the thing"
- **Relevance:** "Don't make me dig through 50 results"

**AI+ Upsell Moment:**  
❌ Base Tier: "how do I submit reimbursement" → Shows files with "reimbursement" in name  
✅ AI+ Tier: Reads HR docs, shows step-by-step process from policy manual

---

## ⚖️ **Persona 4: Compliance / Legal / Auditor**

**Role:** Ensures regulatory compliance, manages legal risk, conducts audits  
**Pain Points:** Finding evidence, proving deletion, tracking sensitive data  
**Search Behavior:** Highly specific, technical, needs audit trails

### **Typical Queries:**

#### **Data Discovery (eDiscovery)**
```
⚡ "all documents mentioning the Johnson lawsuit"
⚡ "emails sent to external counsel between Jan-March 2025"
⚡ "files containing GDPR subject access requests"
⚡ "customer data for user ID 847291"
⚡ "documents related to the FDA audit"
```

#### **Compliance Monitoring**
```
⚡ "files containing credit card numbers"
⚡ "documents with patient health information"
⚡ "spreadsheets with employee salary data"
⚡ "contracts that haven't been renewed in 3 years"
🟢 "files shared outside the organization in last 90 days"
```

#### **Retention & Deletion**
```
🟢 "documents older than 7 years that should be deleted"
🟢 "files marked for legal hold"
🟢 "former employee accounts with remaining files"
⚡ "emails about the terminated project"
🟢 "archived teams that can be permanently deleted"
```

#### **Audit Trail Investigations**
```
🟢 "who accessed the confidential merger folder"
🟢 "when was the employee handbook last updated"
🟢 "files deleted by john.doe in the last 6 months"
🟢 "permission changes to the finance team site"
🟢 "all activity from IP address 192.168.1.100"
```

**What They Care About:**
- **Precision:** "False positives = legal risk"
- **Evidence:** "I need to prove this in court"
- **Audit Trail:** "Who, what, when, where"

**AI+ Upsell Moment:**  
❌ Base Tier: "credit card numbers" → Searches filenames only (misses 90% of violations)  
✅ AI+ Tier: Reads file contents, finds PII using pattern matching (catches violations)

---

## 🎯 **Persona 5: Executive / Leadership**

**Role:** C-suite, VPs, Directors making strategic decisions  
**Pain Points:** Information overload, can't find strategic context, relying on assistants  
**Search Behavior:** High-level, conceptual, looking for insights not files

### **Typical Queries:**

#### **Strategic Context**
```
⚡ "what did we decide about the international expansion"
⚡ "board meeting presentations from 2024"
⚡ "analysis of our competitors' pricing strategies"
⚡ "customer feedback about the new product launch"
⚡ "revenue forecasts for Q3"
```

#### **Decision Support**
```
⚡ "pros and cons of migrating to the cloud"
⚡ "risk assessments for the acquisition"
⚡ "legal opinions on the partnership agreement"
⚡ "financial models for the new business unit"
⚡ "market research on AI adoption trends"
```

#### **People & Organization**
```
🟢 "who is leading the digital transformation initiative"
⚡ "succession planning documents for key roles"
⚡ "performance reviews for director-level team"
⚡ "compensation benchmarking data"
🟢 "org chart for the product division"
```

#### **Communication Lookups**
```
⚡ "what I said in the all-hands about company values"
🔄 "investor update presentations from this year"
⚡ "press releases about our sustainability efforts"
🟢 "confidential memos to the leadership team"
```

**What They Care About:**
- **Relevance:** "Only show me what matters"
- **Summary:** "Give me the 2-sentence answer"
- **Trust:** "This better be accurate"

**AI+ Upsell Moment:**  
❌ Base Tier: "cloud migration pros and cons" → Finds file named "Cloud_Migration.docx"  
✅ AI+ Tier: Reads 10 documents, summarizes key arguments from strategy memos

---

## 🔬 **Persona 6: Power User / Data Analyst**

**Role:** Technical users who need advanced search (IT, ops, data teams)  
**Pain Points:** Basic search is too simple, need complex queries  
**Search Behavior:** Uses filters, boolean operators, saved searches

### **Typical Queries:**

#### **Complex Filtering**
```
🟢 "files:size>50MB AND modified:<30days AND owner:marketing"
🟢 "channels:archived=false AND members:>100 AND created:2024"
🟢 "files:extension=xlsx AND shares:external=true AND location:onedrive"
⚡ "documents:contains='confidential' AND accessed_by:external_users"
```

#### **Trend Analysis**
```
🟢 "storage growth by department over last 12 months"
🟢 "most active sharepoint sites by file edit count"
🟢 "teams channels with declining engagement"
🟢 "file types consuming most storage space"
```

#### **Anomaly Detection**
```
🟢 "files uploaded between 2am-5am"
🟢 "users who haven't logged in for 90 days but still own files"
🟢 "sudden spike in external shares from finance team"
⚡ "documents that were copy-pasted from external sources"
```

#### **Saved Search Automation**
```
🟢 "new files matching criteria: 'client contracts older than 3 years'"
🟢 "weekly report: orphaned teams with no owner"
🟢 "alert me when: files containing 'acquisition' shared externally"
```

**What They Care About:**
- **Power:** "Let me build complex queries"
- **Export:** "Give me the raw data"
- **Automation:** "Run this search every week"

**AI+ Upsell Moment:**  
❌ Base Tier: Can filter by metadata fields only  
✅ AI+ Tier: Can search inside document contents + use semantic matching

---

## 📊 **Query Pattern Analysis**

### **By Search Type:**

| Query Type | % of Searches | Base Tier | AI+ Tier | Example |
|------------|---------------|-----------|----------|---------|
| **Filename/Title** | 35% | ✅ Excellent | ✅ Excellent | "Q4 budget spreadsheet" |
| **Author/Owner** | 20% | ✅ Excellent | ✅ Excellent | "files created by Sarah" |
| **Date/Location** | 15% | ✅ Excellent | ✅ Excellent | "files modified last week" |
| **Metadata Keywords** | 10% | 🟡 OK (if tagged) | ✅ Good (AI enriches) | "marketing campaign files" |
| **Content Keywords** | 15% | ❌ Miss 80% | ✅ Excellent | "mention of layoffs" |
| **Semantic/Conceptual** | 5% | ❌ No results | ✅ Good | "how to submit expenses" |

**Insight:** 70% of searches work fine with metadata-only (Base tier), but 30% require content reading (AI+ tier). However, even metadata searches get BETTER with AI enrichment.

---

### **By User Persona:**

| Persona | Metadata-Only | AI+ Benefit | Conversion Likelihood |
|---------|---------------|-------------|----------------------|
| **IT Admin** | 🟢 High (70%) | 🟡 Medium | 40% (compliance-driven) |
| **Department Head** | 🟡 Medium (50%) | 🟢 High | 60% (context-driven) |
| **Knowledge Worker** | 🟡 Medium (40%) | 🟢 High | 50% (convenience-driven) |
| **Compliance/Legal** | 🔴 Low (20%) | 🟢 Critical | 90% (must-have for audits) |
| **Executive** | 🔴 Low (10%) | 🟢 Critical | 70% (insight-driven) |
| **Power User** | 🟢 High (60%) | 🟢 High | 80% (wants both) |

**Insight:** Compliance and Executives are **highest conversion** targets for AI+ upsell.

---

## 🎯 **AI+ Upsell Positioning by Persona**

### **IT Admin → "Find violations you're missing"**
```
Free Tier Search: "files shared externally"
→ Shows 2,847 files (based on sharing settings)

AI+ Search: "files containing customer PII shared externally"
→ Shows 12 files (actually reads contents, finds violations)

💰 Value Prop: "Don't wait for a breach to find out"
```

---

### **Department Head → "Get context, not just files"**
```
Free Tier Search: "API timeline"
→ Shows "API_spec.pdf", "API_roadmap.xlsx" (filename match)

AI+ Search: "API timeline"
→ Reads meeting notes, finds: "Q2 launch target per John's email"
→ Shows relevant excerpts from 5 documents with timeline mentions

💰 Value Prop: "Stop opening 50 files to find one answer"
```

---

### **Knowledge Worker → "Search like you talk"**
```
Free Tier Search: "how to submit expenses"
→ Shows files with "expenses" in name (15 random files)

AI+ Search: "how to submit expenses"
→ Reads HR policy doc, extracts: "1. Fill form 2. Upload receipt 3. Email to finance@..."
→ Shows step-by-step instructions directly in search results

💰 Value Prop: "Get answers, not file lists"
```

---

### **Compliance/Legal → "Find what regulators will find"**
```
Free Tier Search: "credit card numbers"
→ 0 results (no files named "credit card numbers")

AI+ Search: "credit card numbers"
→ Scans file contents, finds 47 spreadsheets with card data
→ Flags violations with pattern: ####-####-####-####

💰 Value Prop: "Find violations before the audit does"
```

---

### **Executive → "Get insights, not documents"**
```
Free Tier Search: "cloud migration decision"
→ Shows "Cloud_Migration_Analysis.docx" (1 file)

AI+ Search: "cloud migration decision"
→ Reads 8 documents (strategy memos, meeting notes, financial models)
→ Summarizes: "Board approved in Q3 2024, $2M budget, AWS preferred, timeline: 18mo"

💰 Value Prop: "Instant briefings without asking your assistant"
```

---

## 🛠️ **Implementation Guidance for v1**

### **Week 9: Oracle Search UI**

**Must Support (Base Tier):**
- ✅ Natural language queries (parse into metadata filters)
- ✅ Filters: Author, Date, Location, File Type, Size
- ✅ Sorting: Relevance, Date, Size, Author
- ✅ Result preview: Filename, path, metadata, thumbnail

**AI+ Upgrade CTA Placement:**
```
When user searches for content-heavy query:
┌───────────────────────────────��─────────────────────────┐
│ 🔍 "documents mentioning the new pricing model"        │
│                                                         │
│ ⚠️ Limited Results (Filename Search Only)              │
│                                                         │
│ We found 3 files with "pricing model" in the filename. │
│ To search INSIDE document contents, upgrade to AI+.    │
│                                                         │
│ [ See What You're Missing with AI+ ] [ Maybe Later ]   │
└─────────────────────────────────────────────────────────┘
```

**Detection Logic (When to Show AI+ CTA):**
```javascript
// Show AI+ upsell if query looks like content search
const needsContentReading = (
  query.includes('mention') ||
  query.includes('about') ||
  query.includes('containing') ||
  query.includes('discuss') ||
  query.includes('how to') ||
  query.includes('what') ||
  query.includes('why') ||
  results.length < 5 // Low recall suggests metadata-only missed content
);
```

---

### **Week 10: AI+ Content Reading (If Enabled)**

**Must Support (AI+ Tier):**
- ✅ Full-text search inside documents (PDF, Word, Excel, PPT)
- ✅ Semantic search (similar meaning, not just keyword match)
- ✅ Content snippets in results (show matching excerpt)
- ✅ Summarization (for Executive persona)
- ✅ Entity extraction (dates, names, amounts mentioned in content)

**Result Comparison:**
```
🟢 Base Tier Result:
┌────────────────────────────────────────┐
│ 📄 Q4_Budget_Final.xlsx                │
│ Modified: 2025-01-15 by Sarah Johnson  │
│ Location: Finance Team > Budget folder │
│ Size: 2.4 MB                           │
└────────────────────────────────────────┘

⚡ AI+ Tier Result (Same File):
┌────────────────────────────────────────┐
│ 📄 Q4_Budget_Final.xlsx                │
│ Modified: 2025-01-15 by Sarah Johnson  │
│ Location: Finance Team > Budget folder │
│ Size: 2.4 MB                           │
│                                        │
│ 💡 AI Summary:                         │
│ "Q4 budget approved at $1.2M, includes │
│ $200K for new hires and $150K for      │
│ marketing spend. CFO flagged concerns  │
│ about cloud infrastructure costs."     │
│                                        │
│ 🔖 Key Topics: Budget Planning, Hiring,│
│              Cloud Costs, Marketing    │
└────────────────────────────────────────┘
```

---

## 💡 **Key Takeaways for Product Strategy**

### **1. Metadata-First is Good Enough for 70% of Queries**
- Don't over-sell AI+ for simple searches
- "Files by Sarah" doesn't need content reading
- Fast, accurate metadata search = core value prop

### **2. AI+ Has Highest Value for 3 Personas:**
- **Compliance** (must-have for audits) → 90% conversion
- **Executives** (insight over info) → 70% conversion
- **Knowledge Workers** ("I know it's somewhere") → 50% conversion

### **3. Position AI+ as "Search Inside Documents"**
- ❌ Don't say "AI-powered semantic embeddings with LLM summarization"
- ✅ Say "Search inside your files, not just filenames"
- ❌ Don't say "We use GPT-4 to vectorize content"
- ✅ Say "Find documents that mention specific topics"

### **4. Demo Strategy (Sales/Marketing):**
**Act 1:** Show metadata search (fast, works great for simple queries)  
**Act 2:** Show a "failure case" (query returns no results or wrong results)  
**Act 3:** Enable AI+, same query now returns perfect results with summaries  
**Close:** "Which search experience do your users want?"

---

## 🎬 **Demo Script Examples**

### **Demo 1: IT Admin (Security Focus)**
```
Scenario: "Show me files that might contain sensitive data"

Step 1 (Base Tier):
Search: "files containing SSN"
Result: 0 files (no file named "SSN")
Reaction: "Looks like you're clean! ✅"

Step 2 (Enable AI+):
Search: "files containing SSN"
Result: 8 files with social security numbers in content
Reaction: "Wait, you DO have PII exposure ⚠️"

Insight: "AI+ finds what auditors find. Base tier can't."
```

---

### **Demo 2: Department Head (Knowledge Discovery)**
```
Scenario: "Why did we choose AWS over Azure?"

Step 1 (Base Tier):
Search: "AWS Azure decision"
Result: 1 file "Cloud_Vendor_Comparison.xlsx"
Reaction: "You'll need to open and read this."

Step 2 (Enable AI+):
Search: "AWS Azure decision"
Result: Summary from 6 documents:
"Team chose AWS due to existing expertise (3 AWS-certified engineers),
better pricing for our usage pattern ($400K vs $520K/yr), and tighter
integration with existing CI/CD pipeline. Decision made Q3 2024."

Insight: "AI+ reads the docs for you. Base tier makes you read."
```

---

### **Demo 3: Knowledge Worker (Getting Unstuck)**
```
Scenario: "How do I request time off?"

Step 1 (Base Tier):
Search: "time off request"
Result: 12 files with "time off" or "request" in filename
Reaction: "Which one has the answer?"

Step 2 (Enable AI+):
Search: "how to request time off"
Result: Step-by-step from HR policy:
"1. Log into Workday
 2. Navigate to Time Off > Request PTO
 3. Select dates and reason
 4. Submit for manager approval"

Insight: "AI+ answers questions. Base tier finds files."
```

---

**Status:** ✅ Ready for v1 implementation (Search UX + AI+ positioning)  
**Next:** Build Oracle search UI with AI+ upsell CTAs in Week 9-10
