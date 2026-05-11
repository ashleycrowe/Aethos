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
    // Get total files count
    const { count: totalFiles } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId);

    // Files with descriptions (ai_suggested_title not null)
    const { count: filesWithDescriptions } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .not('ai_suggested_title', 'is', null);

    // Files with tags (ai_tags not empty)
    const { count: filesWithTags } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .neq('ai_tags', '{}');

    // Files with meaningful names (not starting with generic terms)
    const { count: filesWithMeaningfulNames } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .not('name', 'ilike', 'Document%')
      .not('name', 'ilike', 'Untitled%')
      .not('name', 'ilike', 'New%');

    // Average name length
    const { data: nameLengths } = await supabase
      .from('files')
      .select('name')
      .eq('tenant_id', tenantId);

    const avgNameLength = nameLengths
      ? Math.round(nameLengths.reduce((sum, file) => sum + file.name.length, 0) / nameLengths.length)
      : 0;

    // Enrichment status
    const { count: filesCategorized } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .not('ai_category', 'is', null);

    // For departments inferred, assuming ai_tags contain department info
    // This is a simplification; in reality, you might have a separate field
    const { count: departmentsInferred } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .neq('ai_tags', '{}');

    const { count: keywordsGenerated } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .neq('ai_tags', '{}');

    // Time periods extracted - assuming from metadata or tags
    // Simplified: count files with some date-related metadata
    const { count: timePeriodsExtracted } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .not('metadata', 'is', null);

    // Average confidence score - using intelligence_score / 100
    const { data: scores } = await supabase
      .from('files')
      .select('intelligence_score')
      .eq('tenant_id', tenantId)
      .not('intelligence_score', 'is', null);

    const avgConfidenceScore = scores && scores.length > 0
      ? scores.reduce((sum, file) => sum + (file.intelligence_score || 0), 0) / scores.length / 100
      : 0;

    // Files now discoverable - files with ai_tags or ai_category
    const { count: filesNowDiscoverable } = await supabase
      .from('files')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .or('ai_tags.neq.{},ai_category.not.is.null');

    // Categories breakdown
    const { data: categoryData } = await supabase
      .from('files')
      .select('ai_category')
      .eq('tenant_id', tenantId)
      .not('ai_category', 'is', null);

    const categoryCounts: { [key: string]: number } = {};
    categoryData?.forEach(file => {
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
    const intelligenceScore = scores && scores.length > 0
      ? Math.round(scores.reduce((sum, file) => sum + (file.intelligence_score || 0), 0) / scores.length)
      : 0;

    // Opportunities - simplified
    const opportunities = [
      {
        priority: 'high' as const,
        title: 'Low Confidence Files',
        description: `Files with intelligence_score < 50`,
        count: scores ? scores.filter(s => (s.intelligence_score || 0) < 50).length : 0,
        action: 'Enable Content Reading for better results',
        icon: 'AlertCircle'
      },
      {
        priority: 'medium' as const,
        title: 'Generic File Names',
        description: 'Files named "Document", "Untitled", etc.',
        count: (totalFiles || 0) - (filesWithMeaningfulNames || 0),
        action: 'Low discoverability - consider renaming',
        icon: 'FileQuestion'
      },
      {
        priority: 'low' as const,
        title: 'No Enrichment',
        description: 'Files without AI tags or categories',
        count: (totalFiles || 0) - (filesNowDiscoverable || 0),
        action: 'Run AI enrichment to improve discoverability',
        icon: 'FolderOpen'
      }
    ];

    res.status(200).json({
      intelligenceScore,
      sourceQuality: {
        totalFiles: totalFiles || 0,
        filesWithDescriptions: filesWithDescriptions || 0,
        filesWithTags: filesWithTags || 0,
        filesWithMeaningfulNames: filesWithMeaningfulNames || 0,
        avgNameLength
      },
      enrichmentStatus: {
        filesCategorized: filesCategorized || 0,
        departmentsInferred: departmentsInferred || 0,
        keywordsGenerated: keywordsGenerated || 0,
        timePeriodsExtracted: timePeriodsExtracted || 0,
        avgConfidenceScore: Math.round(avgConfidenceScore * 100) / 100,
        filesNowDiscoverable: filesNowDiscoverable || 0
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
