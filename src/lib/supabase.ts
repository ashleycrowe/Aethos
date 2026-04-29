/**
 * Supabase Client Configuration
 * 
 * PURPOSE: Initialize and export Supabase client for database operations
 * SECURITY: Uses environment variables for credentials
 * RLS: Row-Level Security enforced at database level
 * 
 * NOTE: If environment variables are not set, client will be null (demo mode)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Allow running in demo mode without Supabase credentials
let supabaseClient: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export const supabase = supabaseClient;

/**
 * Set tenant context for Row-Level Security
 * This must be called after authentication to enforce multi-tenant isolation
 */
export async function setTenantContext(tenantId: string, userId: string) {
  if (!supabaseClient) {
    console.warn('Supabase client is not configured. Cannot set tenant context.');
    return;
  }

  const { error } = await supabaseClient.rpc('set_config', {
    setting: 'app.current_tenant_id',
    value: tenantId
  });

  if (error) {
    console.error('Failed to set tenant context:', error);
  }

  const { error: userError } = await supabaseClient.rpc('set_config', {
    setting: 'app.current_user_id',
    value: userId
  });

  if (userError) {
    console.error('Failed to set user context:', userError);
  }
}

/**
 * Database Types (generated from schema)
 */
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          microsoft_tenant_id: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: 'v1' | 'v1.5' | 'v2' | 'v3' | 'v4';
          status: 'active' | 'suspended' | 'cancelled';
          settings: any;
          metadata: any;
        };
        Insert: Omit<Database['public']['Tables']['tenants']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tenants']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          tenant_id: string;
          email: string;
          name: string | null;
          microsoft_id: string | null;
          role: 'admin' | 'architect' | 'curator' | 'auditor' | 'user' | 'viewer';
          created_at: string;
          last_login: string | null;
          settings: any;
          metadata: any;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      files: {
        Row: {
          id: string;
          tenant_id: string;
          provider: 'microsoft' | 'slack' | 'google' | 'box' | 'local';
          provider_id: string;
          provider_type: string | null;
          name: string;
          path: string | null;
          url: string | null;
          size_bytes: number;
          mime_type: string | null;
          file_extension: string | null;
          created_at: string | null;
          modified_at: string | null;
          last_accessed_at: string | null;
          indexed_at: string;
          owner_id: string | null;
          owner_email: string | null;
          owner_name: string | null;
          is_stale: boolean;
          is_orphaned: boolean;
          is_duplicate: boolean;
          has_external_share: boolean;
          external_user_count: number;
          risk_score: number;
          intelligence_score: number;
          ai_tags: string[];
          ai_category: string | null;
          ai_suggested_title: string | null;
          ai_summary: string | null;
          ai_enriched_at: string | null;
          metadata: any;
          raw_api_response: any;
        };
        Insert: Omit<Database['public']['Tables']['files']['Row'], 'id' | 'indexed_at' | 'file_extension'>;
        Update: Partial<Database['public']['Tables']['files']['Insert']>;
      };
      workspaces: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          color: string;
          tags: string[];
          auto_sync_enabled: boolean;
          sync_rules: any;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          last_sync_at: string | null;
          metadata: any;
        };
        Insert: Omit<Database['public']['Tables']['workspaces']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['workspaces']['Insert']>;
      };
    };
  };
}