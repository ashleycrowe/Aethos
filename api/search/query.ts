/**
 * Search API Endpoint
 * 
 * PURPOSE: Full-text search across all indexed files (The Oracle)
 * FEATURES:
 * - Full-text search (PostgreSQL FTS)
 * - Filters (provider, risk, stale, external shares, tags)
 * - Sorting (relevance, date, size, name)
 * - Pagination
 * 
 * V1 SCOPE: Microsoft 365 metadata only
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

function sanitizeIlikeTerm(value: string) {
  return value.replace(/[%_,]/g, ' ').trim();
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const {
    query = '',
    filters = {},
    sortBy = 'relevance',
    sortOrder = 'desc',
    page = 1,
    pageSize = 50,
  } = req.body;
  const { tenantId } = context;

  if (!tenantId) {
    return sendApiError(res, 400, 'Missing tenant ID');
  }

  try {
    // Build the query
    let dbQuery = supabase
      .from('files')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId);

    // Apply metadata search if query provided. The V1 schema has a functional
    // full-text index but no materialized search_vector column, so use indexed
    // metadata fields that exist in the files table.
    if (query && query.trim()) {
      const searchTerm = sanitizeIlikeTerm(query);
      if (searchTerm) {
        dbQuery = dbQuery.or(
          [
            `name.ilike.%${searchTerm}%`,
            `path.ilike.%${searchTerm}%`,
            `ai_suggested_title.ilike.%${searchTerm}%`,
            `ai_category.ilike.%${searchTerm}%`,
            `owner_email.ilike.%${searchTerm}%`,
          ].join(',')
        );
      }
    }

    // Apply filters
    if (filters.provider) {
      dbQuery = dbQuery.eq('provider', filters.provider);
    }

    if (filters.providerType) {
      dbQuery = dbQuery.eq('provider_type', filters.providerType);
    }

    if (filters.isStale !== undefined) {
      dbQuery = dbQuery.eq('is_stale', filters.isStale);
    }

    if (filters.isOrphaned !== undefined) {
      dbQuery = dbQuery.eq('is_orphaned', filters.isOrphaned);
    }

    if (filters.hasExternalShare !== undefined) {
      dbQuery = dbQuery.eq('has_external_share', filters.hasExternalShare);
    }

    if (filters.minRiskScore !== undefined) {
      dbQuery = dbQuery.gte('risk_score', filters.minRiskScore);
    }

    if (filters.maxRiskScore !== undefined) {
      dbQuery = dbQuery.lte('risk_score', filters.maxRiskScore);
    }

    if (filters.minSize !== undefined) {
      dbQuery = dbQuery.gte('size_bytes', filters.minSize);
    }

    if (filters.maxSize !== undefined) {
      dbQuery = dbQuery.lte('size_bytes', filters.maxSize);
    }

    if (filters.tags && filters.tags.length > 0) {
      // Search for files that have ANY of the specified tags
      dbQuery = dbQuery.overlaps('ai_tags', filters.tags);
    }

    if (filters.category) {
      dbQuery = dbQuery.eq('ai_category', filters.category);
    }

    if (filters.ownerEmail) {
      dbQuery = dbQuery.eq('owner_email', filters.ownerEmail);
    }

    if (filters.modifiedAfter) {
      dbQuery = dbQuery.gte('modified_at', filters.modifiedAfter);
    }

    if (filters.modifiedBefore) {
      dbQuery = dbQuery.lte('modified_at', filters.modifiedBefore);
    }

    if (filters.fileExtension) {
      dbQuery = dbQuery.eq('file_extension', filters.fileExtension.toLowerCase());
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        dbQuery = dbQuery.order('name', { ascending: sortOrder === 'asc' });
        break;
      case 'size':
        dbQuery = dbQuery.order('size_bytes', { ascending: sortOrder === 'asc' });
        break;
      case 'modified':
        dbQuery = dbQuery.order('modified_at', { ascending: sortOrder === 'asc' });
        break;
      case 'created':
        dbQuery = dbQuery.order('created_at', { ascending: sortOrder === 'asc' });
        break;
      case 'risk':
        dbQuery = dbQuery.order('risk_score', { ascending: sortOrder === 'asc' });
        break;
      case 'intelligence':
        dbQuery = dbQuery.order('intelligence_score', { ascending: sortOrder === 'asc' });
        break;
      case 'relevance':
      default:
        // For relevance, PostgreSQL FTS automatically ranks by relevance
        // If no query, sort by modified date
        if (!query || !query.trim()) {
          dbQuery = dbQuery.order('modified_at', { ascending: false });
        }
        break;
    }

    // Apply pagination
    const offset = (page - 1) * pageSize;
    dbQuery = dbQuery.range(offset, offset + pageSize - 1);

    // Execute query
    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Search query failed:', error);
      return res.status(500).json({ error: 'Search failed' });
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / pageSize);

    res.status(200).json({
      success: true,
      results: data,
      pagination: {
        page,
        pageSize,
        totalResults: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
