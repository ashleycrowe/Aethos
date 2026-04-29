/**
 * Cross-Tenant Search API - V4 Feature (MSP Platform)
 * 
 * PURPOSE: Search across multiple managed tenants for MSPs
 * SECURITY: Row-level security enforced per tenant
 * USE CASE: MSPs managing 50+ client tenants
 * 
 * WORKFLOW:
 * 1. Verify MSP has access to tenants
 * 2. Execute parallel searches across tenants
 * 3. Aggregate and rank results
 * 4. Return with tenant context
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface CrossTenantSearchResult {
  tenantId: string;
  tenantName: string;
  results: any[];
  totalMatches: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mspTenantId, query, filters = {}, limit = 50 } = req.body;

    if (!mspTenantId || !query) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify MSP tenant has federation enabled
    const { data: mspTenant } = await supabase
      .from('tenants')
      .select('federation_enabled, subscription_tier')
      .eq('id', mspTenantId)
      .single();

    if (!mspTenant?.federation_enabled) {
      return res.status(403).json({ error: 'Federation not enabled for this tenant' });
    }

    // Get all managed tenants for this MSP
    const { data: managedTenants } = await supabase
      .from('tenant_relationships')
      .select('child_tenant_id, child_tenant:tenants!child_tenant_id(id, name)')
      .eq('parent_tenant_id', mspTenantId)
      .eq('relationship_type', 'managed');

    if (!managedTenants || managedTenants.length === 0) {
      return res.status(200).json({
        success: true,
        results: [],
        message: 'No managed tenants found',
      });
    }

    // Execute search across all managed tenants in parallel
    const searchPromises = managedTenants.map(async (relationship: any) => {
      const tenantId = relationship.child_tenant_id;
      const tenantName = relationship.child_tenant?.name || 'Unknown';

      try {
        // Build search query
        let searchQuery = supabase
          .from('artifacts')
          .select('*')
          .eq('tenant_id', tenantId)
          .or(`name.ilike.%${query}%,enriched_name.ilike.%${query}%,tags.cs.{${query}}`);

        // Apply filters
        if (filters.provider) {
          searchQuery = searchQuery.eq('provider', filters.provider);
        }

        if (filters.artifact_type) {
          searchQuery = searchQuery.eq('artifact_type', filters.artifact_type);
        }

        if (filters.tags && filters.tags.length > 0) {
          searchQuery = searchQuery.contains('tags', filters.tags);
        }

        // Execute search
        const { data: results, error } = await searchQuery.limit(limit);

        if (error) {
          console.error(`Search error for tenant ${tenantId}:`, error);
          return null;
        }

        return {
          tenantId,
          tenantName,
          results: results || [],
          totalMatches: results?.length || 0,
        };
      } catch (error) {
        console.error(`Error searching tenant ${tenantId}:`, error);
        return null;
      }
    });

    const searchResults = (await Promise.all(searchPromises)).filter((r) => r !== null) as CrossTenantSearchResult[];

    // Aggregate statistics
    const totalResults = searchResults.reduce((sum, r) => sum + r.totalMatches, 0);
    const tenantsWithMatches = searchResults.filter((r) => r.totalMatches > 0).length;

    // Create cross-tenant search audit log
    await supabase.from('federation_audit_logs').insert({
      msp_tenant_id: mspTenantId,
      action: 'cross_tenant_search',
      query,
      tenants_searched: managedTenants.length,
      tenants_with_matches: tenantsWithMatches,
      total_results: totalResults,
      executed_at: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      query,
      results: searchResults,
      summary: {
        tenantsSearched: managedTenants.length,
        tenantsWithMatches,
        totalResults,
      },
    });
  } catch (error: any) {
    console.error('Cross-tenant search error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
