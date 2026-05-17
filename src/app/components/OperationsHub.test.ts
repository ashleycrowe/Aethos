import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('./OperationsHub.tsx', import.meta.url), 'utf8');
const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
const sidebarSource = readFileSync(new URL('./Sidebar.tsx', import.meta.url), 'utf8');

describe('OperationsHub UI contract', () => {
  it('renders role-based Operations Hub views', () => {
    expect(source).toContain('Product Intelligence & Unified Support Hub');
    expect(source).toContain('Sales / Success Queue');
    expect(source).toContain('Support Queue');
    expect(source).toContain('Most Requested Features');
    expect(source).toContain('Frequent Frustrations');
    expect(source).toContain('Anomaly Alerts');
  });

  it('searches both tickets and knowledge articles', () => {
    expect(source).toContain('searchOperationsHub');
    expect(source).toContain('Tickets');
    expect(source).toContain('Articles');
  });

  it('is mounted as the internal Ops Hub route', () => {
    expect(appSource).toContain("case 'ops'");
    expect(sidebarSource).toContain('Ops Hub');
  });
});
