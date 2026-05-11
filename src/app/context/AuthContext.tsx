/**
 * Authentication Context (MSAL + Supabase)
 * 
 * PURPOSE: Handle Microsoft authentication and session management
 * FLOW:
 * 1. User clicks "Login with Microsoft"
 * 2. MSAL popup opens for Microsoft login
 * 3. User authenticates and grants permissions
 * 4. Access token received
 * 5. User saved to Supabase database
 * 6. Tenant context set for RLS
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PublicClientApplication,
  AccountInfo,
  AuthenticationResult,
  InteractionRequiredAuthError,
} from '@azure/msal-browser';
import { supabase, setTenantContext } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/microsoftGraph';
import { isDemoModeEnabled } from '@/app/config/demoMode';
import { toast } from 'sonner';

const MICROSOFT_AUTHORITY = 'https://login.microsoftonline.com/organizations';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_MICROSOFT_REDIRECT_URI = `${window.location.origin}/auth/callback.html`;
const MICROSOFT_REDIRECT_URI =
  import.meta.env.VITE_MICROSOFT_REDIRECT_URI || DEFAULT_MICROSOFT_REDIRECT_URI;

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    authority: MICROSOFT_AUTHORITY,
    redirectUri: MICROSOFT_REDIRECT_URI,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage' as const,
    storeAuthStateInCookie: false,
  },
};

// Check if MSAL is configured
const isMsalConfigured = !!(
  import.meta.env.VITE_MICROSOFT_CLIENT_ID
);

// Initialize MSAL instance
let msalInstance: PublicClientApplication | null = null;

const initializeMsal = async () => {
  if (!isMsalConfigured) {
    return null;
  }
  
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
  }
  return msalInstance;
};

// Login request scopes (Microsoft Graph API permissions)
const loginRequest = {
  scopes: [
    'User.Read',
    'Files.Read.All',
    'Sites.Read.All',
    'Group.Read.All',
    'Mail.Read', // For future email integration
  ],
};

interface AuthContextType {
  // State
  user: AccountInfo | null;
  accessToken: string | null;
  tenantId: string | null;
  userId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Methods
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getMicrosoftTenantId(response: AuthenticationResult): string | null {
  return (
    response.tenantId ||
    (response.account as AccountInfo & { tenantId?: string })?.tenantId ||
    ((response.idTokenClaims as Record<string, unknown> | undefined)?.tid as string | undefined) ||
    null
  );
}

async function provisionSessionViaApi(accessToken: string): Promise<{ tenantId: string; userId?: string } | null> {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`Session provisioning failed: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.success || !data.tenantId) return null;

  return {
    tenantId: data.tenantId,
    userId: data.userId,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tenantId, setTenantIdState] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize MSAL and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const msal = await initializeMsal();
        
        // If MSAL is not configured, skip authentication
        if (!msal) {
          setIsLoading(false);
          return;
        }
        
        const accounts = msal.getAllAccounts();

        if (accounts.length > 0) {
          // User has an existing session
          const account = accounts[0];
          setUser(account);

          // Silently acquire token
          try {
            const response = await msal.acquireTokenSilent({
              ...loginRequest,
              account,
            });

            setAccessToken(response.accessToken);
            await handlePostLogin(response);
          } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
              // Token expired, user needs to re-login
              console.log('Token expired, user needs to re-login');
            } else {
              console.error('Error acquiring token silently:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handle post-login tasks:
   * 1. Get user info from Microsoft Graph
   * 2. Create/update user in Supabase
   * 3. Create/update tenant in Supabase
   * 4. Set tenant context for RLS
   */
  const handlePostLogin = async (response: AuthenticationResult) => {
    try {
      // Get full user details from Microsoft Graph
      const graphUser = await getCurrentUser(response.accessToken);
      const microsoftTenantId = getMicrosoftTenantId(response);

      if (!microsoftTenantId) {
        throw new Error('Microsoft tenant ID was not present in the authentication response');
      }

      if (!isDemoModeEnabled()) {
        try {
          const session = await provisionSessionViaApi(response.accessToken);
          if (session) {
            setTenantIdState(session.tenantId);
            if (session.userId) setUserId(session.userId);
            localStorage.setItem('aethos_tenant_id', session.tenantId);
            if (session.userId) localStorage.setItem('aethos_user_id', session.userId);

            toast.success('Logged in successfully!', {
              description: `Welcome back, ${graphUser.displayName}`,
            });
            return;
          }
        } catch (sessionError) {
          console.warn('Backend session provisioning unavailable; falling back to browser Supabase flow:', sessionError);
        }
      }

      // Check if Supabase is configured for local/frontend-only fallback.
      if (!supabase) {
        console.warn('Supabase not configured - skipping database operations');
        toast.success('Logged in successfully!', {
          description: 'Running in demo mode without database',
        });
        return;
      }

      const tenantName = graphUser.companyName || graphUser.displayName + '\'s Organization';

      // Just-in-time tenant provisioning for multitenant self-serve signups.
      const { data: tenant, error: tenantError } = await supabase
        .from('tenants')
        .upsert(
          {
            name: tenantName,
            microsoft_tenant_id: microsoftTenantId,
            subscription_tier: 'v1',
            status: 'active',
            metadata: {
              enrollment: 'jit',
              source: 'AuthContext',
              enrolled_at: new Date().toISOString(),
            },
          },
          { onConflict: 'microsoft_tenant_id' }
        )
        .select()
        .single();

      if (tenantError || !tenant) {
        console.error('Error provisioning tenant:', tenantError);
        throw tenantError || new Error('Unable to provision tenant');
      }

      if (tenant.created_at === tenant.updated_at) {
        toast.success('Welcome to Aethos!', {
          description: 'Your organization has been set up.',
        });
      }

      // Check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('microsoft_id', response.account.homeAccountId)
        .single();

      let dbUser;

      if (!existingUser) {
        const { count: tenantUserCount } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenant.id);

        // Create new user
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            tenant_id: tenant.id,
            email: graphUser.mail || graphUser.userPrincipalName,
            name: graphUser.displayName,
            microsoft_id: response.account.homeAccountId,
            role: tenantUserCount === 0 ? 'admin' : 'user',
            last_login: new Date().toISOString(),
            metadata: {
              enrollment: 'jit',
              source: 'AuthContext',
            },
          })
          .select()
          .single();

        if (userError) {
          console.error('Error creating user:', userError);
          throw userError;
        }

        dbUser = newUser;
      } else {
        // Update last login
        const { data: updatedUser } = await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', existingUser.id)
          .select()
          .single();

        dbUser = updatedUser;
      }

      // Set tenant context for RLS
      await setTenantContext(tenant.id, dbUser.id);

      setTenantIdState(tenant.id);
      setUserId(dbUser.id);

      // Store in localStorage for persistence
      localStorage.setItem('aethos_tenant_id', tenant.id);
      localStorage.setItem('aethos_user_id', dbUser.id);

      toast.success('Logged in successfully!', {
        description: `Welcome back, ${graphUser.displayName}`,
      });
    } catch (error) {
      console.error('Error in post-login flow:', error);
      toast.error('Authentication failed', {
        description: 'Unable to complete login. Please try again.',
      });
    }
  };

  /**
   * Login with Microsoft (popup flow)
   */
  const login = async () => {
    try {
      setIsLoading(true);
      const msal = await initializeMsal();

      if (!msal) {
        // MSAL not configured, exit early
        return;
      }

      const response = await msal.loginPopup(loginRequest);

      setUser(response.account);
      setAccessToken(response.accessToken);

      await handlePostLogin(response);
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.errorCode === 'popup_window_error') {
        toast.error('Login failed', {
          description: 'Please allow popups for this site and try again.',
        });
      } else if (error.errorCode === 'user_cancelled') {
        toast.info('Login cancelled', {
          description: 'You cancelled the login process.',
        });
      } else {
        toast.error('Login failed', {
          description: error.errorMessage || 'An unknown error occurred.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      const msal = await initializeMsal();

      if (!msal) {
        // MSAL not configured, exit early
        return;
      }

      await msal.logoutPopup();

      setUser(null);
      setAccessToken(null);
      setTenantIdState(null);
      setUserId(null);

      localStorage.removeItem('aethos_tenant_id');
      localStorage.removeItem('aethos_user_id');

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed', {
        description: 'An error occurred while logging out.',
      });
    }
  };

  /**
   * Get access token (silently refresh if needed)
   */
  const getAccessToken = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const msal = await initializeMsal();

      if (!msal) {
        // MSAL not configured, exit early
        return null;
      }

      const response = await msal.acquireTokenSilent({
        ...loginRequest,
        account: user,
      });

      setAccessToken(response.accessToken);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Need user interaction to refresh token
        try {
          const response = await msal!.acquireTokenPopup(loginRequest);
          setAccessToken(response.accessToken);
          return response.accessToken;
        } catch (popupError) {
          console.error('Error acquiring token via popup:', popupError);
          return null;
        }
      } else {
        console.error('Error acquiring token:', error);
        return null;
      }
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    tenantId,
    userId,
    isLoading,
    isAuthenticated: !!user && !!accessToken,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
