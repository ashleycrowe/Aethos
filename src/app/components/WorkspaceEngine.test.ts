import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const engineSource = readFileSync(new URL('./WorkspaceEngine.tsx', import.meta.url), 'utf8');
const wizardSource = readFileSync(new URL('./WorkspaceCreationWizard.tsx', import.meta.url), 'utf8');

describe('WorkspaceEngine smoke contract', () => {
  it('previews live workspace matches before creation', () => {
    expect(engineSource).toContain('searchFiles<WorkspacePreviewFile>');
    expect(engineSource).toContain('handlePreviewWorkspaceMatches');
    expect(engineSource).toContain('pageSize: 10');
    expect(engineSource).toContain('matchCount: response.pagination?.totalResults');
    expect(engineSource).toContain('onPreviewMatches={!isDemoMode ? handlePreviewWorkspaceMatches : undefined}');
  });

  it('allows empty workspace creation when preview returns no samples', () => {
    expect(wizardSource).toContain('No sample files matched these rules yet.');
    expect(wizardSource).toContain('Create Empty Workspace');
    expect(wizardSource).toContain('Preview unavailable');
    expect(wizardSource).toContain('onPreviewMatches');
  });

  it('keeps purge simulations out of live workspaces', () => {
    expect(engineSource).toContain("label: isDemoMode ? 'Purge Ops' : 'Review Handoff'");
    expect(engineSource).toContain("activeTab === 'forensic' && isDemoMode");
    expect(engineSource).toContain("activeTab === 'forensic' && !isDemoMode");
    expect(engineSource).toContain('Live Mode does not simulate retention timers or cleanup results');
    expect(engineSource).toContain('Open Remediation Dry Runs');
  });

  it('keeps V1 workspace personas visible in the product surface', () => {
    expect(engineSource).toContain('const WORKSPACE_PERSONA_LOOP');
    expect(engineSource).toContain('const WORKSPACE_PERSONA_MODES');
    expect(engineSource).toContain('Systems Admin');
    expect(engineSource).toContain('Context Steward');
    expect(engineSource).toContain('Knowledge Worker');
    expect(engineSource).toContain('Admin Review');
    expect(engineSource).toContain('Steward Curation');
    expect(engineSource).toContain('Team View');
    expect(engineSource).toContain('Persona View Mode');
    expect(engineSource).toContain('Workspace Loop');
    expect(engineSource).toContain('trusted working context that an admin can hand off');
  });

  it('surfaces persisted stewardship handoff metadata', () => {
    expect(engineSource).toContain('WORKSPACE_REVIEW_STATUS_LABELS');
    expect(engineSource).toContain('stewardOwnerEmail');
    expect(engineSource).toContain('handoffReasonCodes');
    expect(engineSource).toContain('handoffPacket');
    expect(engineSource).toContain('buildFallbackHandoffPacket');
    expect(engineSource).toContain('Copy Handoff Packet');
    expect(engineSource).toContain('sourceOfTruthItemIds');
    expect(engineSource).toContain('Handoff State');
    expect(engineSource).toContain('Context Steward');
  });

  it('keeps steward permission workflow visibility-first', () => {
    expect(engineSource).toContain('getPermissionBridgeState');
    expect(engineSource).toContain('access_missing');
    expect(engineSource).toContain('owner_review_required');
    expect(engineSource).toContain('Copy Access Packet');
    expect(engineSource).toContain('Request Access');
    expect(engineSource).toContain('does not grant source access');
    expect(engineSource).not.toContain('Grant Access');
  });

  it('adds workspace-scoped trust filters for mobile review', () => {
    expect(engineSource).toContain('WORKSPACE_TRUST_FILTERS');
    expect(engineSource).toContain('Workspace Trust Filters');
    expect(engineSource).toContain('matchesWorkspaceTrustFilter');
    expect(engineSource).toContain('source-of-truth');
    expect(engineSource).toContain('fresh');
    expect(engineSource).toContain('owned');
    expect(engineSource).toContain('external');
    expect(engineSource).toContain('stale');
    expect(engineSource).toContain('needs-review');
    expect(engineSource).toContain('grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-7');
  });

  it('makes Team View a read-focused workspace mode', () => {
    expect(engineSource).toContain("personaModeId !== 'worker' || tab.id !== 'forensic'");
    expect(engineSource).toContain('Team View Is Read-Focused');
    expect(engineSource).toContain('Admin remediation controls are hidden here');
    expect(engineSource).toContain('!isTeamView && accessGapItems.length > 0');
    expect(engineSource).toContain('!isTeamView && (');
  });

  it('keeps workspace controls mobile-first', () => {
    expect(engineSource).toContain('overflow-x-hidden');
    expect(engineSource).toContain('sm:w-auto sm:px-10');
    expect(engineSource).toContain('break-words text-lg font-black uppercase');
    expect(engineSource).toContain('min-h-[44px] w-full rounded-xl');
    expect(engineSource).toContain('sm:tracking-[0.4em]');
  });
});
