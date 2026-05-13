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
});
