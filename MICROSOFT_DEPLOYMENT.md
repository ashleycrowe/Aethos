# Aethos: Microsoft App Store Deployment & Enrollment Guide

## 1. Microsoft Entra ID Configuration (Azure Portal)
Aethos operates as a "Provider-Hosted" application. Before submitting to the Microsoft App Store, you must register the application in your Azure Tenant.

- **Application Type**: Multi-tenant.
- **Redirect URIs**: `https://your-app-domain.com/api/auth/callback`.
- **API Permissions (Application Scopes)**:
  - `Sites.Read.All` (To scan SharePoint for Ghost Towns).
  - `Group.Read.All` (To map Teams and Planner).
  - `User.Read` (To identify site owners).
- **Client Secret**: Generated in "Certificates & Secrets" and stored in Azure Key Vault.

## 2. Microsoft Partner Center Submission
To appear in the Microsoft 365 App Store (AppSource):
- Create a new "Office Add-in" or "Azure Application" listing.
- Provide the URL to the Aethos hosted instance.
- Upload icons and descriptions following the "Aethos Glass" brand guidelines.

## 3. The Enrollment Flow (User Experience)
1. **Discovery**: Admin finds Aethos in the Microsoft 365 Admin Center or AppSource.
2. **Installation**: Admin clicks "Get it now."
3. **Granting Consent**: A popup appears requesting access to the tenant's Graph API data. Aethos uses the "Admin Consent" flow to authorize scanning across all users.
4. **Onboarding**: The user is redirected to the Aethos Onboarding Wizard (implemented in this prototype).
5. **Initial Scan**: Aethos performs its first "Digital MRI" scan, populating the Cosmos DB Sidecar with metadata pointers.

## 4. Technical Deployment Stack
- **Frontend**: Vercel or Azure Static Web Apps.
- **Backend API**: Azure Functions (Auto-scaling).
- **Database**: Azure Cosmos DB (Multi-region for low latency).
- **Identity**: MSAL.js for frontend auth; MSAL Node for backend token exchange.
