---
status: Active
type: Core Development Standard
phase: All Phases
audience: [Engineering, Architecture, Product]
working_group: [Technical]
priority: Critical
last_updated: 2026-02-27
location: /docs/3-standards/
tags: [development, typescript, react, vite, tooling]
document_id: STD-DEV-001
---

# [STANDARD] Aethos Development & Platform Standards
## Engineering Governance for Vercel + Supabase Architecture

**Version:** 2.0  
**Date:** February 27, 2026  
**Status:** 🟢 ACTIVE  
**Owner:** Engineering Team  
**Description:** Development workflows, tooling, and platform standards for the simplified Aethos stack.  
**Authority:** MANDATORY  
**Document ID:** STD-DEV-001

---

## 🚨 MANDATORY CRITICAL RULES

1. ✅ **TYPESCRIPT STRICT** - Zero `any` types in production code. Strict null checks enabled.
2. ✅ **MICROSOFT GRAPH SDK** - Use official Microsoft Graph SDK for all M365 API calls.
3. ✅ **REACT 18+** - Functional components with hooks. No class components.
4. ✅ **VERCEL SERVERLESS** - All API routes use Vercel Serverless Functions (not Express servers).
5. ✅ **SUPABASE CLIENT** - Use official `@supabase/supabase-js` client for database operations.

---

## 🛠️ Technology Stack

**Frontend:**
- React 18.3+
- TypeScript 5.0+
- Vite 5.0+
- Tailwind CSS v4
- Motion (formerly Framer Motion)
- Lucide React (icons)

**Backend:**
- Vercel Serverless Functions (Node.js 18+)
- Microsoft Graph SDK
- Supabase JavaScript Client

**Database:**
- Supabase PostgreSQL
- Row-Level Security (RLS)

**Deployment:**
- Vercel (hosting + serverless)
- GitHub Actions (CI/CD)

---

## 📁 Project Structure

```
/src/
  ├── app/
  │   ├── App.tsx                  # Main entry point
  │   ├── components/              # React components
  │   ├── context/                 # React Context providers
  │   ├── services/                # Business logic & API clients
  │   ├── types/                   # TypeScript types
  │   └── utils/                   # Helper functions
  ├── styles/
  │   ├── theme.css                # Tailwind theme
  │   └── fonts.css                # Font imports
  ├── imports/                     # Figma-imported assets
  └── api/                         # Vercel Serverless Functions
      ├── metadata/
      ├── sync/
      └── auth/

/docs/                             # Documentation
/e2e/                              # Playwright tests
```

---

## ⚛️ React Standards

**Component Patterns:**
```typescript
// ✅ GOOD: Functional component with explicit types
interface WorkspaceCardProps {
  workspace: Workspace;
  onSelect: (id: string) => void;
}

export function WorkspaceCard({ workspace, onSelect }: WorkspaceCardProps) {
  const { isDaylight } = useTheme();
  
  return (
    <button onClick={() => onSelect(workspace.id)}>
      {workspace.name}
    </button>
  );
}

// ❌ BAD: Implicit any, missing types
export function WorkspaceCard({ workspace, onSelect }) {
  return <button onClick={() => onSelect(workspace.id)}>{workspace.name}</button>;
}
```

**Context Usage:**
```typescript
// Create context with explicit types
interface UserContextType {
  user: User;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook with error handling
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
```

---

## 🔐 API Route Standards

**Vercel Serverless Function Pattern:**
```typescript
// /api/workspaces/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    // Extract tenant ID from headers/auth
    const tenantId = request.headers.get('x-tenant-id');
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'Missing tenant ID' },
        { status: 401 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Query with RLS
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Configure runtime
export const config = {
  runtime: 'edge', // or 'nodejs'
};
```

---

## 📊 TypeScript Configuration

**tsconfig.json (Required Settings):**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## ✅ COMPLIANCE CHECKLIST

- [ ] TypeScript strict mode enabled (no `any` types)
- [ ] All components have explicit prop types
- [ ] API routes use proper error handling
- [ ] Environment variables documented in README
- [ ] Supabase RLS policies tested
- [ ] Microsoft Graph SDK used (not raw REST)
- [ ] No sensitive data in client-side code

---

**Document ID:** STD-DEV-001  
**Status:** 🟢 ACTIVE STANDARD  
**Location:** `/docs/3-standards/STD-DEV-001.md`
