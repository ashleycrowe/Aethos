# Intelligence Stream Protocols (Aethos)

**Location:** `/docs/3-standards/IntelligenceStreamProtocols.md`  
**Last Updated:** 2026-02-27  
**Status:** Active

---

This document outlines the standard triggers, delivery logic, and narrative standards for the Aethos Intelligence Stream (Notification System).

## 1. Notification Philosophy

Every notification must be an **Operational Insight**, not a generic alert. 
- **BAD**: "File Deleted."
- **GOOD**: "Storage Efficiency Improved: Dormant artifact purged from SharePoint."

---

## 2. Trigger Matrix

### Governance & Storage (Supernova Orange)
| Trigger Event | Priority | Narrative Logic | Recipient |
| :--- | :--- | :--- | :--- |
| **Dormancy Threshold** | High | Container has reached 90/180 day inactivity limit. | Curator, Architect |
| **Storage Spike** | Medium | Unexpected data growth in Tier 2 (Shadow) storage. | Curator |
| **Archival Complete** | Low | Artifact successfully moved to cold storage tier. | Initiator |
| **Waste Recovery** | High | Monthly recapture opportunity exceeds $1,000. | Architect |

### Security & Exposure (Supernova Orange)
| Trigger Event | Priority | Narrative Logic | Recipient |
| :--- | :--- | :--- | :--- |
| **Exposure Spike** | Critical | External sharing links increased by >50% in 1hr. | Architect |
| **Anonymous Access** | High | Sensitive folder accessed via public link. | Architect, Auditor |
| **Protocol Violation** | Medium | File moved from M365 (Tier 1) to personal Box (Tier 2). | Architect |

### Identity & Access (Starlight Cyan)
| Trigger Event | Priority | Narrative Logic | Recipient |
| :--- | :--- | :--- | :--- |
| **Orphaned Identity** | High | Deactivated user still holds active cloud permissions. | Curator, Architect |
| **Blast Radius Expansion** | Medium | User granted "Owner" rights to >5 core containers. | Architect |
| **Onboarding Complete** | Low | New identity provisioned across Universal Engine. | Curator |

### System & Sync (Starlight Cyan)
| Trigger Event | Priority | Narrative Logic | Recipient |
| :--- | :--- | :--- | :--- |
| **Adapter Failure** | High | Connection to Slack/M365 interrupted. | Architect |
| **Scan Synchronized** | Low | Universal metadata engine update complete. | All |
| **Schema Update** | Low | New metadata fields mapped from Shadow providers. | Architect |

---

## 3. Delivery Standards

- **Acknowledge vs. Resolve**: Notifications are "Acknowledged" (read) but some require "Resolution" (action taken).
- **Batching**: System syncs and low-priority updates should be batched into a single "Intelligence Summary" every 24 hours.
- **Story vs. Calculation**: Always provide the narrative (Story) first. The raw technical calculation is hidden but accessible via the Forensic Lab deep-link.

---

## 4. Interaction Patterns

1. **Analyze**: Deep-link to Forensic Lab or StarMap.
2. **Acknowledge**: Mark as read, remove from unread count.
3. **Execute**: Direct action button (e.g., "Archive Now") for critical waste triggers.

---

## 5. Color & Priority System

### Priority Levels:
- **Critical** (🔴 Red): Immediate action required, potential security breach or data loss
  - Color: `#FF5733` (Supernova Orange) with pulsing animation
  - Sound: Alert tone (optional, user preference)
  - Delivery: Real-time push + email

- **High** (🟠 Orange): Requires attention within 24 hours
  - Color: `#FF5733` (Supernova Orange)
  - Delivery: Real-time push

- **Medium** (🔵 Blue): Review within 3 days
  - Color: `#00F0FF` (Starlight Cyan)
  - Delivery: Batched (every 6 hours)

- **Low** (⚪ Slate): Informational, review at convenience
  - Color: `#94A3B8` (Nebula Slate)
  - Delivery: Daily digest

---

## 6. Notification UI Components

### Notification Card Structure
```tsx
<div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
  {/* Header */}
  <div className="flex items-start justify-between mb-3">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#FF5733]/10 flex items-center justify-center">
        <ShieldAlert className="w-5 h-5 text-[#FF5733]" />
      </div>
      <div>
        <h4 className="text-sm font-bold">Exposure Spike Detected</h4>
        <p className="text-xs text-slate-500">2 minutes ago</p>
      </div>
    </div>
    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#FF5733]/10 text-[#FF5733]">
      Critical
    </span>
  </div>
  
  {/* Narrative */}
  <p className="text-sm text-slate-300 mb-4">
    External sharing links increased by 73% in the last hour across 3 high-value containers.
  </p>
  
  {/* Actions */}
  <div className="flex gap-2">
    <button className="px-4 py-2 bg-[#00F0FF] text-black rounded-xl text-sm font-bold">
      Analyze in Forensic Lab
    </button>
    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
      Acknowledge
    </button>
  </div>
</div>
```

---

## 7. Integration with Modules

### The Constellation (Discovery)
- Triggers: Dormancy Threshold, Waste Recovery, Storage Spike
- Action Links: Open container in Star Map, view in Forensic Lab

### The Nexus (Workspaces)
- Triggers: Workspace Sync Complete, Intelligence Score Updated
- Action Links: Open workspace, view sync status

### Oracle (Search & Intelligence)
- Triggers: Schema Update, New Tag Patterns Detected
- Action Links: View new patterns, update tag rules

---

## 8. User Preferences

Users can customize:
- **Notification Frequency**: Real-time, Hourly batches, Daily digest
- **Priority Filter**: Show only Critical/High, or all priorities
- **Delivery Channels**: In-app only, Email + in-app, Teams notifications (future)
- **Sound**: Enable/disable alert tones

---

## 9. Related Standards

- **STD-DESIGN-001**: UI/UX for notification cards
- **STD-A11Y-001**: Accessibility requirements (screen reader support)
- **STD-ERROR-001**: Error handling for failed notifications
- **Guidelines.md**: Intelligence Stream Standard section

---

## 🔄 Maintenance

**Review Cycle:** Quarterly  
**Owner:** Product & Engineering  
**Authority:** MANDATORY for all notification implementations  
**Last Updated:** 2026-02-27 (Moved to /docs/3-standards/)
