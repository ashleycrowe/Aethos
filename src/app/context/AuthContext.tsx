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
import { supabase, setTenantContext } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/microsoftGraph';
import { toast } from 'sonner';

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_MICROSOFT_TENANT_ID || 'common'
    }`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage' as const,
    storeAuthStateInCookie: false,
  },
};

// Check if MSAL is configured
const isMsalConfigured = !!(
  import.meta.env.VITE_MICROSOFT_CLIENT_ID &&
  import.meta.env.VITE_MICROSOFT_TENANT_ID
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
      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured - skipping database operations');
        toast.success('Logged in successfully!', {
          description: 'Running in demo mode without database',
        });
        return;
      }

      // Get full user details from Microsoft Graph
      const graphUser = await getCurrentUser(response.accessToken);

      // Check if tenant exists in Supabase
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('*')
        .eq('microsoft_tenant_id', response.tenantId)
        .single();

      let tenant;

      if (!existingTenant) {
        // Create new tenant
        const { data: newTenant, error: tenantError } = await supabase
          .from('tenants')
          .insert({
            name: graphUser.companyName || graphUser.displayName + '\'s Organization',
            microsoft_tenant_id: response.tenantId,
            subscription_tier: 'v1',
            status: 'active',
          })
          .select()
          .single();

        if (tenantError) {
          console.error('Error creating tenant:', tenantError);
          throw tenantError;
        }

        tenant = newTenant;
        toast.success('Welcome to Aethos!', {
          description: 'Your organization has been set up.',
        });
      } else {
        tenant = existingTenant;
      }

      // Check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('microsoft_id', response.account.homeAccountId)
        .single();

      let dbUser;

      if (!existingUser) {
        // Create new user
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert({
            tenant_id: tenant.id,
            email: graphUser.mail || graphUser.userPrincipalName,
            name: graphUser.displayName,
            microsoft_id: response.account.homeAccountId,
            role: 'admin', // First user is admin
            last_login: new Date().toISOString(),
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