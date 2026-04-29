# Version Testing Guide
**How to Use the Version Toggle System in Aethos Prototype**

## Quick Start

### Open the Version Toggle
Press **`Cmd+Shift+V`** (Mac) or **`Ctrl+Shift+V`** (Windows/Linux) to open the version switcher panel.

Or click the **"Demo Mode"** badge in the bottom-right corner.

### Switch Versions
Click any version button (V1, V1.5, V2, V3, V4) to instantly switch between product versions.

### Watch Features Appear/Disappear
Features are automatically hidden or shown based on the selected version.

---

## What You'll See in Each Version

### V1 (Current Default)
**Available:**
- ✅ Discovery module (The Constellation)
- ✅ Workspaces with tag-based sync
- ✅ Basic metadata search (Oracle)
- ✅ Storage intelligence dashboard
- ✅ Basic remediation tools

**NOT Available:**
- ❌ AI content search toggle (Oracle)
- ❌ Slack integration
- ❌ Compliance automation
- ❌ MSP multi-tenant features

**To Test:** Navigate to Oracle Search. You should see ONLY metadata search, no AI+ toggle.

---

### V1.5 (AI+ Content Intelligence)
**New Features:**
- ✅ **AI+ Content Search toggle** appears in Oracle
  - Toggle on/off to simulate semantic search
  - Shows upgrade messaging
- ✅ Semantic search mode indicator
- ✅ PII detection alerts (in Discovery)
- ✅ Content summarization (on artifact detail)

**How to Test:**
1. Switch to V1.5 using the version toggle
2. Navigate to Oracle Search (`oracle` tab in sidebar)
3. You should now see a cyan gradient panel above the search input with:
   - "AI+ Content Search" label
   - Toggle switch (off by default)
   - Click the toggle to simulate enabling AI search

**Expected Behavior:**
- When toggled ON: Toast message "AI+ Enabled: Searching document contents"
- When toggled OFF: Toast message "Switched to Metadata Search"
- Status text updates: "Semantic search enabled" vs "Metadata search only"

---

### V2 (Multi-Provider Expansion)
**New Features:**
- ✅ Slack integration UI (mock)
- ✅ Cross-platform workspace cards
- ✅ Google Workspace shadow discovery tab
- ✅ Universal search across providers

**How to Test:**
1. Switch to V2
2. Check Discovery for new "Slack" and "Google" tabs
3. Check Workspaces for cross-platform artifact cards
4. Check Oracle filters for "Slack" provider option

**Note:** Currently mocked - real Slack integration comes in actual V2 development.

---

### V3 (Compliance + Analytics)
**New Features:**
- ✅ Compliance automation module
- ✅ Predictive analytics dashboard
- ✅ Executive intelligence view
- ✅ Advanced remediation workflows
- ✅ Simulation mode for remediation

**How to Test:**
1. Switch to V3
2. Navigate to Admin Center or Remediation Center
3. Look for new "Compliance" and "Predictive" sections
4. Check for "Simulate Remediation" buttons

---

### V4 (Federation + Ecosystem)
**New Features:**
- ✅ MSP multi-tenant dashboard
- ✅ API marketplace
- ✅ White-label branding settings
- ✅ Enterprise SSO options
- ✅ Knowledge graph visualization

**How to Test:**
1. Switch to V4
2. Check Admin Center for "MSP Dashboard" option
3. Look for "API Keys" section
4. Check for "Branding" settings in admin

---

## How to Use Feature Gates in Code

### Example 1: Conditional Rendering (Hook-based)

```tsx
import { useFeature } from '../context/VersionContext';

function MyComponent() {
  const hasAISearch = useFeature('aiContentSearch');
  
  return (
    <div>
      <h1>Search</h1>
      
      {/* This only shows in V1.5+ */}
      {hasAISearch && (
        <div className="ai-search-toggle">
          <button>Enable AI Search</button>
        </div>
      )}
      
      <input type="text" placeholder="Search..." />
    </div>
  );
}
```

### Example 2: Feature Gate Component

```tsx
import { FeatureGate } from '../context/VersionContext';

function MyComponent() {
  return (
    <div>
      <h1>Workspaces</h1>
      
      {/* This only shows in V2+ */}
      <FeatureGate feature="slackIntegration">
        <SlackWorkspaceCard />
      </FeatureGate>
      
      {/* Always shows */}
      <M365WorkspaceCard />
    </div>
  );
}
```

### Example 3: Feature Gate with Fallback

```tsx
import { FeatureGate } from '../context/VersionContext';

function MyComponent() {
  return (
    <FeatureGate 
      feature="predictiveAnalytics"
      fallback={
        <div className="upgrade-prompt">
          <p>Upgrade to V3 to unlock Predictive Analytics</p>
          <button>Learn More</button>
        </div>
      }
    >
      <PredictiveDashboard />
    </FeatureGate>
  );
}
```

### Example 4: Multiple Features

```tsx
import { useFeatures } from '../context/VersionContext';

function MyComponent() {
  const { slackIntegration, googleWorkspaceShadow, crossPlatformWorkspaces } = useFeatures();
  
  const providers = ['M365'];
  if (slackIntegration) providers.push('Slack');
  if (googleWorkspaceShadow) providers.push('Google');
  
  return (
    <div>
      <h2>Connected Providers</h2>
      {providers.map(p => <ProviderCard key={p} name={p} />)}
    </div>
  );
}
```

---

## Testing Workflow

### When Building a New Feature:

1. **Determine Version Assignment**
   - Check `/docs/AETHOS_PRODUCT_ROADMAP.md`
   - Confirm feature belongs to V1, V1.5, V2, V3, or V4

2. **Add Feature Flag**
   - Update `/src/app/context/VersionContext.tsx`
   - Add to `VersionFeatures` interface
   - Set `true/false` for each version in `VERSION_FEATURES`

3. **Update Documentation**
   - Add row to `/docs/FEATURE_MATRIX.md`
   - Document component reference and pricing impact

4. **Implement with Feature Gates**
   - Use `useFeature()` hook or `<FeatureGate>` component
   - Test in all versions to ensure proper hiding/showing

5. **Test Version Transitions**
   - Toggle between versions (V1 → V1.5 → V2 → V3 → V4)
   - Verify feature appears/disappears correctly
   - Check for layout shifts or errors

6. **Production Deployment**
   - Set `VITE_VERSION=V1` in `.env` for V1 launch
   - When ready for V1.5, change to `VITE_VERSION=V1.5`

---

## Demo Mode Controls

### Enable/Disable Demo Mode
Click the toggle switch in the Version Switcher panel to hide/show all demo indicators.

**When Demo Mode is OFF:**
- Version toggle panel is hidden
- No version badges visible
- Clean production-like experience

**When Demo Mode is ON:**
- Version toggle accessible via Cmd+Shift+V
- Current version badge shown (bottom-right)
- Easy switching between versions for demos

### Use Cases:
- **ON** → User testing, stakeholder demos, feature validation
- **OFF** → Production-like screenshots, final UX review

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+V` (Mac) | Toggle version switcher panel |
| `Ctrl+Shift+V` (Windows) | Toggle version switcher panel |

---

## Current Implementation Status

### ✅ Fully Implemented:
- `VersionContext` with all feature flags
- `VersionToggle` UI component
- Feature gates (`useFeature`, `FeatureGate`)
- localStorage persistence (version persists across reloads)
- Oracle Search V1.5 example (AI+ toggle)

### 🚧 In Progress:
- Additional V2/V3/V4 UI components (currently mocked)
- Mock data per version (see `/docs/FEATURE_MATRIX.md`)

### 📋 Next Steps:
- Add version-specific mock data
- Build V2 Slack integration UI
- Build V3 Compliance Center
- Build V4 MSP Dashboard

---

## Troubleshooting

### Feature Not Showing When Switching Versions
**Check:**
1. Is the feature flag added to `VersionContext.tsx`?
2. Is the feature set to `true` for the current version in `VERSION_FEATURES`?
3. Is the component using `useFeature()` or `<FeatureGate>`?
4. Hard refresh the page (Cmd+Shift+R)

### Version Not Persisting After Reload
**Check:**
1. localStorage is enabled in browser
2. Check browser console for errors
3. Try switching versions again and refreshing

### Version Toggle Not Appearing
**Check:**
1. Is Demo Mode enabled? (it's on by default)
2. Try pressing `Cmd+Shift+V` to show it
3. Check if `VersionToggle` is rendered in `App.tsx`

---

## Best Practices

### ✅ DO:
- Use feature gates for all version-specific UI
- Test features in ALL versions (V1 through V4)
- Update FEATURE_MATRIX.md when adding features
- Use descriptive feature flag names
- Add component version comments

### ❌ DON'T:
- Hard-code version checks (`if (version === 'V2')`) - use feature flags instead
- Show features in V1 that belong in V2+
- Forget to update documentation
- Create duplicate code for different versions
- Mix version logic with business logic

---

## Example: Adding a New V2 Feature

**Scenario:** You want to add a "Slack Channel Browser" that only appears in V2+.

**Step 1:** Add feature flag to `VersionContext.tsx`
```tsx
export interface VersionFeatures {
  // ... existing features
  slackChannelBrowser: boolean; // V2+ feature
}
```

**Step 2:** Update VERSION_FEATURES
```tsx
V1: { slackChannelBrowser: false, ... },
'V1.5': { slackChannelBrowser: false, ... },
V2: { slackChannelBrowser: true, ... }, // Enable in V2
V3: { slackChannelBrowser: true, ... },
V4: { slackChannelBrowser: true, ... },
```

**Step 3:** Update FEATURE_MATRIX.md
```markdown
| Slack Channel Browser | ❌ | ❌ | ✅ | ✅ | ✅ | `SlackChannelBrowser` (TBD) | Included in Slack module |
```

**Step 4:** Implement component with gate
```tsx
import { FeatureGate } from '../context/VersionContext';
import { SlackChannelBrowser } from './SlackChannelBrowser';

function Discovery() {
  return (
    <div>
      <h1>Discovery</h1>
      
      {/* Always shows */}
      <M365DiscoveryPanel />
      
      {/* Only shows in V2+ */}
      <FeatureGate feature="slackChannelBrowser">
        <SlackChannelBrowser />
      </FeatureGate>
    </div>
  );
}
```

**Step 5:** Test
1. Switch to V1 → Slack browser should NOT appear
2. Switch to V1.5 → Slack browser should NOT appear
3. Switch to V2 → Slack browser SHOULD appear
4. Switch to V3/V4 → Slack browser SHOULD appear

Done! ✅

---

## Questions?

Refer to:
- `/docs/FEATURE_MATRIX.md` - Feature availability by version
- `/docs/AETHOS_PRODUCT_ROADMAP.md` - Strategic roadmap and version rationale
- `/docs/AETHOS_V1_SPEC.md` - V1 detailed specification
- `/src/app/context/VersionContext.tsx` - Feature flag source of truth

**Happy version testing!** 🚀
