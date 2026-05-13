/**
 * Intelligence Metrics API Endpoint
 *
 * PURPOSE: Provide aggregated intelligence metrics for the dashboard
 * VERSION: V1
 *
 * Returns counts and statistics about file metadata quality and AI enrichment
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, supabase } from '../_lib/apiAuth.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const { tenantId } = context;

  try {
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('name,path,owner_email,owner_name,is_stale,has_external_share,ai_suggested_title,ai_tags,ai_category,metadata,intelligence_score')
      .eq('tenant_id', tenantId);

    if (filesError) throw filesError;

    const tenantFiles = files || [];
    const totalFiles = tenantFiles.length;
    const hasOwner = (file: any) => Boolean(file.owner_email?.trim() || file.owner_name?.trim());
    const isMeaningfulName = (name?: string | null) => {
      if (!name) return false;
      return !/^(document|untitled|new|copy)(\b|[-_\s\d.])/i.test(name.trim());
    };

    const filesWithDescriptions = tenantFiles.filter((file) => Boolean(file.ai_suggested_title)).length;
    const filesWithTags = tenantFiles.filter((file) => Array.isArray(file.ai_tags) && file.ai_tags.length > 0).length;
    const filesWithMeaningfulNames = tenantFiles.filter((file) => isMeaningfulName(file.name)).length;
    const avgNameLength = totalFiles > 0
      ? Math.round(tenantFiles.reduce((sum, file) => sum + (file.name?.length || 0), 0) / totalFiles)
      : 0;

    // Enrichment status
    const filesCategorized = tenantFiles.filter((file) => Boolean(file.ai_category)).length;
    const departmentsInferred = filesWithTags;
    const keywordsGenerated = filesWithTags;
    const timePeriodsExtracted = tenantFiles.filter((file) => file.metadata && Object.keys(file.metadata).length > 0).length;
    const scores = tenantFiles.filter((file) => file.intelligence_score !== null && file.intelligence_score !== undefined);
    const avgConfidenceScore = scores.length > 0
      ? scores.reduce((sum, file) => sum + (file.intelligence_score || 0), 0) / scores.length / 100
      : 0;

    const filesNowDiscoverable = tenantFiles.filter((file) =>
      (Array.isArray(file.ai_tags) && file.ai_tags.length > 0) || Boolean(file.ai_category)
    ).length;

    const genericNameCount = totalFiles - filesWithMeaningfulNames;
    const missingOwnerCount = tenantFiles.filter((file) => !hasOwner(file)).length;
    const staleFileCount = tenantFiles.filter((file) => file.is_stale).length;
    const externalExposureCount = tenantFiles.filter((file) => file.has_external_share).length;
    const missingTagsOrCategoryCount = totalFiles - filesNowDiscoverable;

    // Categories breakdown
    const categoryCounts: { [key: string]: number } = {};
    tenantFiles.forEach(file => {
      if (file.ai_category) {
        categoryCounts[file.ai_category] = (categoryCounts[file.ai_category] || 0) + 1;
      }
    });

    const categories = Object.entries(categoryCounts).map(([category, count]) => ({
      category: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: Math.round((count / (totalFiles || 1)) * 100),
      color: getCategoryColor(category)
    }));

    // Intelligence score - average of intelligence_score
    const intelligenceScore = scores.length > 0
      ? Math.round(scores.reduce((sum, file) => sum + (file.intelligence_score || 0), 0) / scores.length)
      : 0;
    const sourceMetadataScore = totalFiles > 0
      ? Math.round(
          (filesWithMeaningfulNames / totalFiles) * 35 +
          ((totalFiles - missingOwnerCount) / totalFiles) * 30 +
          ((totalFiles - staleFileCount) / totalFiles) * 15 +
          ((totalFiles - externalExposureCount) / totalFiles) * 10 +
          (filesNowDiscoverable / totalFiles) * 10
        )
      : 0;

    // Opportunities - simplified
    const opportunities = [
      {
        priority: 'high' as const,
        title: 'Missing Ownership',
        description: 'Files without usable owner metadata weaken search, stewardship, and Copilot readiness.',
        count: missingOwnerCount,
        action: 'Review missing-owner candidates before cleanup',
        icon: 'AlertCircle'
      },
      {
        priority: 'medium' as const,
        title: 'Generic File Names',
        description: 'Files named "Document", "Untitled", etc.',
        count: genericNameCount,
        action: 'Use filename/path suggestions for safer review',
        icon: 'FileQuestion'
      },
      {
        priority: 'low' as const,
        title: 'Missing Tags Or Categories',
        description: 'Files without AI tags or categories',
        count: missingTagsOrCategoryCount,
        action: 'Generate Aethos-side suggestions for human review',
        icon: 'FolderOpen'
      }
    ];
    const aiReadinessBlockers = [
      {
        id: 'generic_names',
        label: 'Generic names',
        count: genericNameCount,
        severity: genericNameCount > 0 ? 'medium' : 'low',
        recommendation: 'Suggest clearer titles from filename and path context before source-system writeback.',
      },
      {
        id: 'missing_owner',
        label: 'Missing owners',
        count: missingOwnerCount,
        severity: missingOwnerCount > 0 ? 'high' : 'low',
        recommendation: 'Review ownership metadata and assign stewardship before remediation.',
      },
      {
        id: 'stale_files',
        label: 'Stale files',
        count: staleFileCount,
        severity: staleFileCount > 0 ? 'medium' : 'low',
        recommendation: 'Create archive review workspaces before cleanup.',
      },
      {
        id: 'external_exposure',
        label: 'External exposure',
        count: externalExposureCount,
        severity: externalExposureCount > 0 ? 'high' : 'low',
        recommendation: 'Review sharing posture before broad AI or search rollout.',
      },
      {
        id: 'missing_tags',
        label: 'Missing tags/categories',
        count: missingTagsOrCategoryCount,
        severity: missingTagsOrCategoryCount > 0 ? 'medium' : 'low',
        recommendation: 'Generate conservative Aethos-side metadata suggestions for review.',
      },
    ];
    const metadataSuggestions = [
      genericNameCount > 0
        ? {
            id: 'suggest-clearer-titles',
            type: 'title',
            label: 'Suggest clearer titles',
            count: genericNameCount,
            sourceSignals: ['filename', 'path'],
            confidence: 'medium',
            rationale: 'Generic filenames reduce search quality. Aethos can suggest clearer titles from path and filename context for human review.',
            nextAction: 'Review title suggestions',
            actionTarget: 'metadata_review',
          }
        : null,
      missingOwnerCount > 0
        ? {
            id: 'suggest-stewardship-review',
            type: 'owner',
            label: 'Suggest stewardship review',
            count: missingOwnerCount,
            sourceSignals: ['owner', 'path', 'provider'],
            confidence: 'low',
            rationale: 'Owner assignment needs human validation. Aethos can group missing-owner files for stewardship review without claiming departed-user detection.',
            nextAction: 'Review missing owners',
            actionTarget: 'remediation',
            remediationIssue: 'missing_owner',
          }
        : null,
      missingTagsOrCategoryCount > 0
        ? {
            id: 'suggest-tags-categories',
            type: 'tag',
            label: 'Suggest tags and categories',
            count: missingTagsOrCategoryCount,
            sourceSignals: ['filename', 'path', 'extension', 'owner'],
            confidence: 'medium',
            rationale: 'Metadata-only context can produce conservative Aethos-side tags and categories for approval.',
            nextAction: 'Generate suggestions',
            actionTarget: 'metadata_review',
          }
        : null,
      staleFileCount > 0
        ? {
            id: 'suggest-archive-review',
            type: 'category',
            label: 'Suggest archive review groups',
            count: staleFileCount,
            sourceSignals: ['modified date', 'path', 'owner'],
            confidence: 'high',
            rationale: 'Stale files can be grouped for archive review before any cleanup action is taken.',
            nextAction: 'Create review workspace',
            actionTarget: 'workspace',
            remediationIssue: 'stale',
          }
        : null,
    ].filter(Boolean);

    res.status(200).json({
      intelligenceScore,
      sourceMetadataScore,
      aethosEnrichmentScore: intelligenceScore,
      aiReadinessBlockers,
      metadataSuggestions,
      sourceQuality: {
        totalFiles,
        filesWithDescriptions,
        filesWithTags,
        filesWithMeaningfulNames,
        avgNameLength
      },
      enrichmentStatus: {
        filesCategorized,
        departmentsInferred,
        keywordsGenerated,
        timePeriodsExtracted,
        avgConfidenceScore: Math.round(avgConfidenceScore * 100) / 100,
        filesNowDiscoverable
      },
      categories,
      opportunities
    });

  } catch (error) {
    console.error('Error fetching intelligence metrics:', error);
    res.status(500).json({ error: 'Failed to fetch intelligence metrics' });
  }
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'financial-planning': '#00F0FF',
    'hr-documents': '#FF5733',
    'engineering': '#9B59B6',
    'sales': '#3498DB',
    'marketing': '#E74C3C',
    'operations': '#2ECC71',
    'legal': '#F39C12'
  };
  return colors[category] || '#95A5A6';
}
