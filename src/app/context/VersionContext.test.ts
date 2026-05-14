import { describe, expect, it } from 'vitest';
import {
  applyFeaturePromotionGates,
  FEATURE_PROMOTION_STAGES,
  isFeaturePromotedForSurface,
  VERSION_FEATURES,
} from './VersionContext';

describe('VersionContext feature promotion gates', () => {
  it('keeps V1 core features promoted to live', () => {
    expect(FEATURE_PROMOTION_STAGES.discovery).toBe('live');
    expect(FEATURE_PROMOTION_STAGES.workspaces).toBe('live');
    expect(FEATURE_PROMOTION_STAGES.basicSearch).toBe('live');
    expect(isFeaturePromotedForSurface('workspaces', 'live')).toBe(true);
  });

  it('keeps AI+ pre-release until content scanning is ready for live or demo', () => {
    expect(FEATURE_PROMOTION_STAGES.aiContentSearch).toBe('pre-release');
    expect(isFeaturePromotedForSurface('aiContentSearch', 'live')).toBe(false);
    expect(isFeaturePromotedForSurface('aiContentSearch', 'demo')).toBe(false);
    expect(isFeaturePromotedForSurface('aiContentSearch', 'pre-release')).toBe(true);
  });

  it('allows future multi-provider story in demo while blocking it on live', () => {
    expect(FEATURE_PROMOTION_STAGES.slackIntegration).toBe('demo');
    expect(isFeaturePromotedForSurface('slackIntegration', 'live')).toBe(false);
    expect(isFeaturePromotedForSurface('slackIntegration', 'demo')).toBe(true);
  });

  it('filters version-enabled features by runtime surface', () => {
    const liveV4 = applyFeaturePromotionGates(VERSION_FEATURES.V4, 'live');
    expect(liveV4.discovery).toBe(true);
    expect(liveV4.workspaces).toBe(true);
    expect(liveV4.aiContentSearch).toBe(false);
    expect(liveV4.slackIntegration).toBe(false);

    const demoV4 = applyFeaturePromotionGates(VERSION_FEATURES.V4, 'demo');
    expect(demoV4.discovery).toBe(true);
    expect(demoV4.slackIntegration).toBe(true);
    expect(demoV4.aiContentSearch).toBe(false);
  });
});
