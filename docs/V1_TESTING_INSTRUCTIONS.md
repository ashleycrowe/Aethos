# Aethos V1 Testing Instructions
**How to Test Remediation & Reporting Centers**

---

## 🎮 Quick Setup

1. **Make sure the app is running**
2. **Press `Cmd+Shift+V`** to open version toggle
3. **Ensure you're on V1** (default)

---

## 🧪 Test 1: Remediation Center

### Access
Navigate to the **"Archival"** tab in the sidebar.

### What You Should See (V1)
- ✅ Page header: "Remediation Center"
- ✅ Two tabs: "Pending Items" and "History"
- ✅ 5 mock remediation items displayed
- ✅ Search bar and filter dropdowns (Risk Level, Issue Type)
- ✅ **No** advanced features like "Simulation Mode" or "Approval Chains" (those are V3+)

### Test Steps

#### 1. Select Items
- [ ] Click the checkbox next to "Q3 2025 Financial Projections.xlsx"
- [ ] Verify the bulk actions bar appears at the top
- [ ] Verify it says "1 item selected"
- [ ] Click "Select All (5)" checkbox at the top
- [ ] Verify all 5 items are now selected
- [ ] Verify bulk actions bar says "5 items selected"

#### 2. Archive Action
- [ ] Click **"Archive"** button in the bulk actions bar
- [ ] Verify confirmation dialog appears
- [ ] Dialog should say: "You are about to archive 5 items. Archived items will be read-only."
- [ ] Click **"Confirm"**
- [ ] Verify toast notification: "Archived 5 items"
- [ ] Verify items disappear from "Pending Items"
- [ ] Switch to **"History"** tab
- [ ] Verify archived items appear in history with green checkmark

#### 3. Delete Action
- [ ] Go back to "Pending Items" tab
- [ ] Refresh or switch tabs to reset mock data
- [ ] Select 2 items
- [ ] Click **"Delete"** button
- [ ] Verify confirmation dialog: "Items will be moved to the Recycle Bin for 30 days"
- [ ] Click **"Confirm"**
- [ ] Verify toast notification: "Deleted 2 items"

#### 4. Revoke Links Action
- [ ] Select "Q3 2025 Financial Projections.xlsx" (the one with external users badge)
- [ ] Click **"Revoke Links"** button
- [ ] Verify confirmation dialog: "External users will lose access"
- [ ] Click **"Confirm"**
- [ ] Verify toast notification: "Links Revoked 1 item"

#### 5. Search & Filter
- [ ] Type "financial" in search bar
- [ ] Verify only "Q3 2025 Financial Projections.xlsx" shows
- [ ] Clear search
- [ ] Select "High Risk" from Risk Level dropdown
- [ ] Verify only high-risk items show (2 items)
- [ ] Select "External Share" from Issue Type dropdown
- [ ] Verify only external share items show

#### 6. Cancel Action
- [ ] Select any item
- [ ] Click "Delete"
- [ ] In confirmation dialog, click **"Cancel"**
- [ ] Verify dialog closes
- [ ] Verify item still selected

---

## 📊 Test 2: Reporting Center

### Access
Navigate to the **"Reports"** tab in the sidebar.

### What You Should See (V1)
- ✅ Page header: "Reporting Center"
- ✅ Period selector: Week / Month / Quarter / Year
- ✅ 4 key metric cards (Total Storage, Waste Identified, Stale Content, Recovery Potential)
- ✅ 3 charts:
  - Storage Trend (line chart)
  - Waste Breakdown by Type (pie chart)
  - Storage by Provider (bar chart)
- ✅ Top Waste Files list (5 files)
- ✅ Weekly Summary Insights (3 alerts)
- ✅ Export buttons (Schedule, Export CSV, Export PDF)

### Test Steps

#### 1. Key Metrics
- [ ] Verify "Total Storage" shows **15.6 TB** with **+7.2%** (red badge)
- [ ] Verify "Waste Identified" shows **3.4 TB** with **+9.6%** (red badge)
- [ ] Verify "Stale Content" shows **1,247** items with **+124** (red badge)
- [ ] Verify "Recovery Potential" shows **$12,400** with **+$2,840** (green badge)

#### 2. Storage Trend Chart
- [ ] Verify line chart shows 6 months (Jan - Jun)
- [ ] Verify **two lines**: Total Storage (cyan) and Waste (orange)
- [ ] Verify both lines trend upward
- [ ] Hover over a data point
- [ ] Verify tooltip appears with exact values

#### 3. Waste Breakdown Pie Chart
- [ ] Verify 5 slices: Stale Content, Orphaned Sites, Duplicate Files, Temp Files, Old Backups
- [ ] Verify percentages are shown on labels
- [ ] Hover over a slice
- [ ] Verify tooltip shows TB value

#### 4. Provider Storage Bar Chart
- [ ] Verify 4 bars: SharePoint, OneDrive, Teams, Exchange
- [ ] Verify SharePoint is tallest (6.8 TB)
- [ ] Verify different colors for each provider
- [ ] Hover over a bar
- [ ] Verify tooltip shows exact TB value

#### 5. Top Waste Files
- [ ] Verify 5 files listed
- [ ] Verify each shows: name, size, owner, last modified date
- [ ] Verify largest file is "Video Project Renders 2023" at **1.2 GB**

#### 6. Weekly Summary Insights
- [ ] Verify 3 colored alert boxes:
  - Red/Orange: "Storage growth accelerating"
  - Yellow: "1,247 stale items detected"
  - Green: "Potential savings: $12,400/month"

#### 7. Period Selector
- [ ] Click **"Month"** button
- [ ] Verify button turns cyan (active state)
- [ ] Click **"Quarter"**
- [ ] Verify quarter becomes active
- [ ] Click **"Week"** (return to default)

#### 8. Export CSV
- [ ] Click **"Export CSV"** button
- [ ] Verify button text changes to "Exporting..." (1 second)
- [ ] Verify CSV file downloads: `Aethos_Waste_Report_2026-03-01.csv`
- [ ] Open CSV file
- [ ] Verify headers: File Name, Size, Owner, Last Modified, Waste Type
- [ ] Verify 5 rows of data match the "Top Waste Files" list

#### 9. Export PDF
- [ ] Click **"Export PDF"** button
- [ ] Verify toast notification: "PDF export coming soon in V1 final release"
- [ ] (PDF export is placeholder for now)

#### 10. Schedule Report
- [ ] Click **"Schedule"** button
- [ ] Verify toast notification: "Weekly summary will be sent every Monday at 9:00 AM"

---

## 🔄 Test 3: Version-Aware Menu Filtering (NEW!)

### Test Navigation Menu Changes

**Purpose:** Verify that the sidebar menu dynamically filters based on the active version.

#### V1 Menu (Default)
- [ ] Press `Cmd+Shift+V` and ensure you're on **V1**
- [ ] Open the sidebar (hover if collapsed)
- [ ] **Expected V1 Menu Items:**
  - ✅ **Oracle Search** (Core)
  - ✅ **Nexus** (Core)
  - ✅ **Intelligence** (Core)
  - ✅ **Remediation** (Tools)
  - ✅ **Reports** (Tools)
  - ❌ **Constellation** (hidden - V2+)
  - ❌ **Pulse** (hidden - V2+)
  - ❌ **People** (hidden - V2+)

#### V1.5 Menu
- [ ] Switch to **V1.5** via version toggle
- [ ] **Expected V1.5 Menu:** Same as V1
- [ ] No new tabs appear (V1.5 only adds AI+ toggle to Oracle, not new tabs)

#### V2 Menu
- [ ] Switch to **V2** via version toggle
- [ ] **Expected V2 Menu Items:**
  - ✅ **Oracle Search** (Core)
  - ✅ **Constellation** (**NEW!** - Star map visualization)
  - ✅ **Nexus** (Core)
  - ✅ **Intelligence** (Core)
  - ✅ **Pulse** (**NEW!** - Communication bridge)
  - ✅ **People** (**NEW!** - Directory & identity)
  - ✅ **Remediation** (Tools)
  - ✅ **Reports** (Tools)
- [ ] Verify **3 new tabs appeared:** Constellation, Pulse, People

#### V3 Menu
- [ ] Switch to **V3** via version toggle
- [ ] **Expected V3 Menu:** Same as V2 (no new tabs in V3)
- [ ] (V3 adds features to existing modules, not new tabs)

#### V4 Menu
- [ ] Switch to **V4** via version toggle
- [ ] **Expected V4 Menu:** Same as V2/V3
- [ ] (V4 adds federation features to existing modules)

### Test Auto-Redirect on Version Downgrade

**Purpose:** Verify that switching from V2 to V1 automatically redirects if you're on a V2+ tab.

#### Scenario 1: On Constellation Tab (V2+)
- [ ] Switch to **V2**
- [ ] Click **"Constellation"** tab in sidebar (the star map)
- [ ] Verify Constellation view loads
- [ ] Switch back to **V1** via version toggle
- [ ] **Expected:** Automatically redirected to **"Intelligence"** tab
- [ ] Verify Constellation tab disappeared from sidebar
- [ ] Verify you're now viewing Intelligence Dashboard

#### Scenario 2: On Pulse Tab (V2+)
- [ ] Switch to **V2**
- [ ] Click **"Pulse"** tab in sidebar
- [ ] Verify Pulse view loads
- [ ] Switch back to **V1** via version toggle
- [ ] **Expected:** Automatically redirected to **"Intelligence"** tab
- [ ] Verify Pulse tab disappeared from sidebar

#### Scenario 3: On People Tab (V2+)
- [ ] Switch to **V2**
- [ ] Click **"People"** tab in sidebar
- [ ] Verify People view loads
- [ ] Switch back to **V1** via version toggle
- [ ] **Expected:** Automatically redirected to **"Intelligence"** tab
- [ ] Verify People tab disappeared from sidebar

#### Scenario 4: On Valid V1 Tab
- [ ] Ensure you're on **V1**
- [ ] Click **"Oracle Search"** tab
- [ ] Switch to **V2** and back to **V1**
- [ ] **Expected:** Still on **"Oracle Search"** tab (no redirect needed)

---

## 🔄 Test 4: Version Switching Impact (Components)

### Test Remediation Center Across Versions

**V1 (Default):**
- [ ] Remediation Center shows M365 items only
- [ ] Provider icons show SharePoint, OneDrive, Teams
- [ ] **No simulation mode** button visible

**Switch to V1.5:**
- [ ] Remediation Center looks the same (no V1.5 features in remediation)
- [ ] All V1 features still work

**Switch to V2:**
- [ ] Remediation Center still shows M365 only (Slack/Google remediation comes later)
- [ ] All features still work

**Switch to V3:**
- [ ] (Future: Simulation mode, approval chains would appear here)
- [ ] For now, same as V1/V2

### Test Reporting Center Across Versions

**V1 (Default):**
- [ ] Charts show M365 data only
- [ ] Provider chart shows 4 M365 services (SharePoint, OneDrive, Teams, Exchange)
- [ ] No "Predictive Analytics" tab

**Switch to V1.5:**
- [ ] Reports look the same (no AI in reporting yet)

**Switch to V2:**
- [ ] Provider chart would show Slack + Google (not implemented yet in mock)
- [ ] For now, same as V1

**Switch to V3:**
- [ ] (Future: Predictive analytics, budget forecasting would appear)
- [ ] For now, same as V1/V2

---

## ✅ Success Criteria

### Remediation Center
- [x] Can select individual items
- [x] Can select all items
- [x] Bulk actions bar appears when items selected
- [x] Archive action shows confirmation and executes
- [x] Delete action shows confirmation and executes
- [x] Revoke links action works
- [x] Search filters items correctly
- [x] Risk/Issue filters work
- [x] History tab shows completed actions
- [x] Toast notifications appear for all actions
- [x] Confirmation dialogs can be cancelled

### Reporting Center
- [x] All 4 key metrics display correctly
- [x] Storage trend chart renders with 2 lines
- [x] Waste breakdown pie chart renders with 5 slices
- [x] Provider bar chart renders with 4 bars
- [x] Top waste files list shows 5 items
- [x] Weekly insights show 3 alerts
- [x] Period selector changes active state
- [x] CSV export downloads file with correct data
- [x] PDF export shows coming soon message
- [x] Schedule button shows success message
- [x] All charts have hover tooltips

---

## 🐛 Known Issues / Expected Behavior

### Remediation Center
- **Mock Data Reset**: Refreshing or switching tabs resets the pending items (this is expected for prototype)
- **No Real Provider Integration**: Archive/delete actions are simulated (in production, would call M365 APIs)
- **History Persistence**: History only persists for current session (in production, would be saved to database)

### Reporting Center
- **Static Data**: Charts show hardcoded mock data (in production, would fetch from database)
- **Period Selector**: Switching periods doesn't change data yet (future enhancement)
- **PDF Export**: Placeholder - not implemented yet
- **Email Scheduling**: Simulated - would need backend service

---

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ **V1 Remediation is DONE**
2. ✅ **V1 Reporting is DONE**
3. 🎉 **V1 is 90% complete!**

Only **Admin Center** (tenant settings) remains, which is optional for V1 launch.

---

## 📝 Feedback Template

**What works well:**
- 

**What needs improvement:**
- 

**Bugs found:**
- 

**Questions:**
- 

---

**Happy Testing!** 🧪✨