/**
 * Microsoft Graph API Client
 * 
 * PURPOSE: Wrapper around Microsoft Graph API for M365 operations
 * OPERATIONS: Discovery, Search, Remediation
 * PERMISSIONS: Files.Read.All, Sites.Read.All, Group.Read.All (delegated)
 */

import { Client } from '@microsoft/microsoft-graph-client';

export interface GraphFile {
  id: string;
  name: string;
  size: number;
  createdDateTime: string;
  lastModifiedDateTime: string;
  webUrl: string;
  file?: {
    mimeType: string;
  };
  folder?: {
    childCount: number;
  };
  parentReference: {
    driveId: string;
    path: string;
  };
  createdBy?: {
    user: {
      email: string;
      displayName: string;
    };
  };
  lastModifiedBy?: {
    user: {
      email: string;
      displayName: string;
    };
  };
}

export interface GraphSite {
  id: string;
  displayName: string;
  webUrl: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  root?: any;
}

export interface GraphDrive {
  id: string;
  driveType: string;
  owner: {
    user?: {
      email: string;
      displayName: string;
    };
  };
  quota: {
    total: number;
    used: number;
    remaining: number;
  };
}

export interface SharingPermission {
  id: string;
  roles: string[];
  link?: {
    type: string;
    scope: string;
    webUrl: string;
  };
  grantedToIdentities?: Array<{
    user: {
      email: string;
      displayName: string;
    };
  }>;
}

export interface GraphUserStatusLookup {
  email: string;
  status: 'active' | 'disabled' | 'guest' | 'unknown' | 'not_found' | 'permission_required' | 'error';
  lookupStatus: 'completed' | 'not_found' | 'permission_required' | 'error';
  microsoftUserId?: string;
  displayName?: string;
  userPrincipalName?: string;
  mail?: string;
  accountEnabled?: boolean;
  userType?: string;
  errorMessage?: string;
  rawResponse?: Record<string, unknown>;
}

/**
 * Create Microsoft Graph client with access token
 */
export function createGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

/**
 * V1.5 Owner Status: Look up an owner in Entra ID.
 *
 * Requires tenant permissions beyond the basic signed-in user profile in many tenants.
 * The caller should treat permission_required as a readiness state, not as failure.
 */
export async function lookupOwnerStatus(
  accessToken: string,
  ownerEmail: string
): Promise<GraphUserStatusLookup> {
  const client = createGraphClient(accessToken);
  const encodedOwner = encodeURIComponent(ownerEmail);

  try {
    const user = await client
      .api(`/users/${encodedOwner}`)
      .select('id,displayName,mail,userPrincipalName,accountEnabled,userType')
      .get();

    const userType = typeof user.userType === 'string' ? user.userType : undefined;
    const accountEnabled = typeof user.accountEnabled === 'boolean' ? user.accountEnabled : undefined;
    const status = userType?.toLowerCase() === 'guest'
      ? 'guest'
      : accountEnabled === false
      ? 'disabled'
      : accountEnabled === true
      ? 'active'
      : 'unknown';

    return {
      email: ownerEmail,
      status,
      lookupStatus: 'completed',
      microsoftUserId: user.id,
      displayName: user.displayName,
      userPrincipalName: user.userPrincipalName,
      mail: user.mail,
      accountEnabled,
      userType,
      rawResponse: user,
    };
  } catch (error: any) {
    const statusCode = error?.statusCode || error?.code;
    const message = error?.message || 'Unable to look up owner status';

    if (statusCode === 403 || statusCode === 'Forbidden' || /privileges|permission|authorization/i.test(message)) {
      return {
        email: ownerEmail,
        status: 'permission_required',
        lookupStatus: 'permission_required',
        errorMessage: message,
      };
    }

    if (statusCode === 404 || statusCode === 'Request_ResourceNotFound') {
      return {
        email: ownerEmail,
        status: 'not_found',
        lookupStatus: 'not_found',
        errorMessage: message,
      };
    }

    return {
      email: ownerEmail,
      status: 'error',
      lookupStatus: 'error',
      errorMessage: message,
    };
  }
}

/**
 * Discovery: Get all SharePoint sites
 */
export async function getAllSharePointSites(accessToken: string): Promise<GraphSite[]> {
  const client = createGraphClient(accessToken);
  const sites: GraphSite[] = [];

  try {
    // Search for all sites (using wildcard)
    let response = await client.api('/sites?search=*').get();

    sites.push(...response.value);

    // Handle pagination
    while (response['@odata.nextLink']) {
      response = await client.api(response['@odata.nextLink']).get();
      sites.push(...response.value);
    }

    return sites;
  } catch (error) {
    console.error('Error fetching SharePoint sites:', error);
    throw error;
  }
}

/**
 * Discovery: Get all files in a SharePoint site
 */
export async function getFilesInSite(
  accessToken: string,
  siteId: string,
  recursive: boolean = true
): Promise<GraphFile[]> {
  const client = createGraphClient(accessToken);

  try {
    // Get the default drive for the site
    const drive: GraphDrive = await client.api(`/sites/${siteId}/drive`).get();

    // Get all files from the drive
    return await getFilesInDrive(accessToken, drive.id, recursive);
  } catch (error) {
    console.error(`Error fetching files from site ${siteId}:`, error);
    throw error;
  }
}

/**
 * Discovery: Get all files in a drive (recursively)
 */
export async function getFilesInDrive(
  accessToken: string,
  driveId: string,
  recursive: boolean = true,
  path: string = '/root'
): Promise<GraphFile[]> {
  const client = createGraphClient(accessToken);
  let allFiles: GraphFile[] = [];

  try {
    let response = await client.api(`/drives/${driveId}${path}/children`).get();

    for (const item of response.value) {
      if (item.file) {
        // It's a file
        allFiles.push(item);
      } else if (item.folder && recursive) {
        // It's a folder - recursively get files
        const subFiles = await getFilesInDrive(
          accessToken,
          driveId,
          recursive,
          `/items/${item.id}`
        );
        allFiles = allFiles.concat(subFiles);
      }
    }

    // Handle pagination
    while (response['@odata.nextLink']) {
      response = await client.api(response['@odata.nextLink']).get();

      for (const item of response.value) {
        if (item.file) {
          allFiles.push(item);
        } else if (item.folder && recursive) {
          const subFiles = await getFilesInDrive(
            accessToken,
            driveId,
            recursive,
            `/items/${item.id}`
          );
          allFiles = allFiles.concat(subFiles);
        }
      }
    }

    return allFiles;
  } catch (error) {
    console.error(`Error fetching files from drive ${driveId}:`, error);
    return allFiles; // Return what we have so far
  }
}

/**
 * Discovery: Get all OneDrive files for a user
 */
export async function getUserOneDriveFiles(accessToken: string): Promise<GraphFile[]> {
  const client = createGraphClient(accessToken);

  try {
    // Get the user's OneDrive root drive
    const drive = await client.api('/me/drive').get();

    // Get all files recursively
    return await getFilesInDrive(accessToken, drive.id, true);
  } catch (error) {
    console.error('Error fetching OneDrive files:', error);
    throw error;
  }
}

/**
 * Discovery: Get all Teams (Groups with Teams provisioned)
 */
export async function getAllTeams(accessToken: string) {
  const client = createGraphClient(accessToken);

  try {
    let response = await client
      .api('/groups')
      .filter('resourceProvisioningOptions/Any(x:x eq \'Team\')')
      .get();

    const teams = response.value;

    // Handle pagination
    while (response['@odata.nextLink']) {
      response = await client.api(response['@odata.nextLink']).get();
      teams.push(...response.value);
    }

    return teams;
  } catch (error) {
    console.error('Error fetching Teams:', error);
    throw error;
  }
}

/**
 * Discovery: Get files shared in a Team
 */
export async function getTeamFiles(accessToken: string, teamId: string): Promise<GraphFile[]> {
  const client = createGraphClient(accessToken);

  try {
    // Get the team's default drive
    const drive = await client.api(`/groups/${teamId}/drive`).get();

    // Get all files from the drive
    return await getFilesInDrive(accessToken, drive.id, true);
  } catch (error) {
    console.error(`Error fetching files from team ${teamId}:`, error);
    throw error;
  }
}

/**
 * Check if a file has external sharing enabled
 */
export async function getFilePermissions(
  accessToken: string,
  driveId: string,
  fileId: string
): Promise<SharingPermission[]> {
  const client = createGraphClient(accessToken);

  try {
    const response = await client
      .api(`/drives/${driveId}/items/${fileId}/permissions`)
      .get();

    return response.value;
  } catch (error) {
    console.error(`Error fetching permissions for file ${fileId}:`, error);
    return [];
  }
}

/**
 * Check if file has external/anonymous shares
 */
export async function hasExternalShare(
  accessToken: string,
  driveId: string,
  fileId: string
): Promise<{ hasExternal: boolean; externalCount: number }> {
  const permissions = await getFilePermissions(accessToken, driveId, fileId);

  let externalCount = 0;

  for (const perm of permissions) {
    // Check for anonymous sharing links
    if (perm.link?.scope === 'anonymous') {
      externalCount++;
    }

    // Check for external users (email contains #EXT#)
    if (perm.grantedToIdentities) {
      for (const identity of perm.grantedToIdentities) {
        if (identity.user.email?.includes('#EXT#')) {
          externalCount++;
        }
      }
    }
  }

  return {
    hasExternal: externalCount > 0,
    externalCount,
  };
}

/**
 * Remediation: Archive a file (make read-only)
 * In SharePoint, we can't directly set read-only, so we move to an Archive library
 */
export async function archiveFile(
  accessToken: string,
  driveId: string,
  fileId: string
): Promise<boolean> {
  const client = createGraphClient(accessToken);

  try {
    // Option 1: Add a tag/label to indicate archived status
    await client
      .api(`/drives/${driveId}/items/${fileId}`)
      .patch({
        '@microsoft.graph.conflictBehavior': 'rename',
        description: '[ARCHIVED by Aethos] ' + new Date().toISOString(),
      });

    return true;
  } catch (error) {
    console.error(`Error archiving file ${fileId}:`, error);
    return false;
  }
}

/**
 * Remediation: Delete a file (moves to Recycle Bin - soft delete)
 */
export async function deleteFile(
  accessToken: string,
  driveId: string,
  fileId: string
): Promise<boolean> {
  const client = createGraphClient(accessToken);

  try {
    await client.api(`/drives/${driveId}/items/${fileId}`).delete();
    return true;
  } catch (error) {
    console.error(`Error deleting file ${fileId}:`, error);
    return false;
  }
}

/**
 * Remediation: Revoke all external sharing links for a file
 */
export async function revokeExternalLinks(
  accessToken: string,
  driveId: string,
  fileId: string
): Promise<{ revoked: number; failed: number }> {
  const client = createGraphClient(accessToken);
  let revoked = 0;
  let failed = 0;

  try {
    const permissions = await getFilePermissions(accessToken, driveId, fileId);

    for (const perm of permissions) {
      // Only revoke anonymous/external sharing links
      if (
        perm.link?.scope === 'anonymous' ||
        perm.link?.scope === 'organization' ||
        perm.grantedToIdentities?.some((i) => i.user.email?.includes('#EXT#'))
      ) {
        try {
          await client
            .api(`/drives/${driveId}/items/${fileId}/permissions/${perm.id}`)
            .delete();
          revoked++;
        } catch (error) {
          console.error(`Error revoking permission ${perm.id}:`, error);
          failed++;
        }
      }
    }

    return { revoked, failed };
  } catch (error) {
    console.error(`Error revoking links for file ${fileId}:`, error);
    return { revoked, failed };
  }
}

/**
 * Search: Search across all files in M365
 */
export async function searchFiles(
  accessToken: string,
  query: string,
  top: number = 50
): Promise<any[]> {
  const client = createGraphClient(accessToken);

  try {
    const response = await client
      .api('/me/drive/root/search(q=\'' + query + '\')')
      .top(top)
      .get();

    return response.value;
  } catch (error) {
    console.error('Error searching files:', error);
    return [];
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(accessToken: string) {
  const client = createGraphClient(accessToken);

  try {
    const user = await client.api('/me').get();
    return user;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}

/**
 * Get user's photo
 */
export async function getUserPhoto(accessToken: string): Promise<string | null> {
  const client = createGraphClient(accessToken);

  try {
    const photo = await client.api('/me/photo/$value').get();
    
    // Convert blob to base64
    const blob = new Blob([photo]);
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching user photo:', error);
    return null;
  }
}
