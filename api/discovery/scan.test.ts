import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./scan.ts', import.meta.url), 'utf8');

describe('discovery scan V1 scope contract', () => {
  it('keeps SharePoint Lists and content scanning out of V1 discovery', () => {
    expect(source).toContain('SharePoint Lists and row-level list data are intentionally deferred.');
    expect(source).toContain("included: ['sharepoint_files', 'onedrive_files', 'teams_files', 'site_metadata']");
    expect(source).toContain("deferred: ['sharepoint_lists', 'list_items', 'document_body_content']");
    expect(source).toContain('contentScanning: false');
  });
});
