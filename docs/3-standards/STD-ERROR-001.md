# [STANDARD] Aethos Resilience & Error Handling Standards
## Graceful Failures and Intelligence Continuity

---
status: Active
type: Core Development Standard
phase: All Phases
audience: [Engineering, DevOps, Architecture]
priority: Critical
last_updated: 2026-02-27
document_id: STD-ERROR-001
location: `/docs/3-standards/STD-ERROR-001.md`
---

## 📋 Executive Summary

Aethos operates as an intelligence sidecar. Because we rely on external Microsoft 365 tenants and cloud infrastructure (Vercel + Supabase), our error handling must be "Resilient by Design." This standard mandates patterns that prevent cascading failures and ensure the user experience remains stable even during upstream outages.

**Architecture Context:** Vercel Serverless Functions + Supabase PostgreSQL. See `/docs/2-ARCHITECTURE/SIMPLIFIED_ARCHITECTURE.md`

---

## 🚨 MANDATORY CRITICAL RULES

1. **EXPONENTIAL BACKOFF:** All Graph and external API calls MUST implement exponential backoff for transient errors (429, 5xx).

2. **TIMEOUT ENFORCEMENT:** 
   - Frontend API calls: 30s max
   - Database queries: 10s max
   - Vercel Functions: 10s max (free tier limit)

3. **PII REDACTION:** Error logs must NEVER contain PII (Usernames, Emails, Site URLs). Log IDs and metadata pointers only.

4. **CINEMATIC FAILURES:** User-facing errors must follow the "Aethos Glass" visual language. No technical jargon; use Supernova Orange (#FF5733) indicators for warnings.

5. **FALLBACK CONTINUITY:** If the backend is unreachable, the UI must fall back to:
   - Cached data (with staleness indicator)
   - Read-only mode
   - Graceful degradation (show partial data)

6. **ERROR BOUNDARIES:** Wrap all major modules (Constellation, Nexus, Oracle) in React Error Boundaries to prevent total app crashes.

---

## 🏷️ Error Classification

### Transient Errors (Retriable)

**Should retry automatically:**

| Error Code | Description | Retry Strategy | Max Retries |
|------------|-------------|----------------|-------------|
| **429** | Too Many Requests (Graph throttling) | Exponential backoff with `Retry-After` header | 3 |
| **502** | Bad Gateway | Exponential backoff | 3 |
| **503** | Service Unavailable | Exponential backoff | 3 |
| **504** | Gateway Timeout | Exponential backoff | 2 |
| **Network Error** | Client connectivity drop | Exponential backoff | 2 |

### Permanent Errors (Non-Retriable)

**Should not retry, show user error:**

| Error Code | Description | User Action Required |
|------------|-------------|---------------------|
| **401** | Unauthorized (expired token) | Trigger re-authentication |
| **403** | Forbidden (missing permissions) | Request additional scopes |
| **404** | Not Found (resource deleted) | Show "Resource not found" message |
| **400** | Bad Request (invalid input) | Fix input and retry |
| **422** | Unprocessable Entity (validation error) | Fix validation errors |

### Catastrophic Errors (Alert Engineering)

**Should trigger alerts:**

| Error | Description | Action |
|-------|-------------|--------|
| **Database Connection Failed** | Supabase unreachable | Alert DevOps, show maintenance page |
| **Entra ID Down** | Microsoft auth unavailable | Show service status banner |
| **Vercel Function Crash** | Unhandled exception in serverless function | Auto-retry, log to Sentry |

---

## 🔄 Resilience Patterns

### The "Resilient Fetch" Pattern

**Base implementation (see STD-API-001.md):**

```typescript
// /src/app/services/api/resilientClient.ts

export async function resilientFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = 30000,
    retries = 3,
    backoff = 1000,
    ...fetchOptions
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
        await sleep(retryAfter * 1000);
        continue;
      }
      
      // Handle server errors with retry
      if (response.status >= 500) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      lastError = error as Error;
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      
      if (attempt < retries) {
        const delay = backoff * Math.pow(2, attempt);
        console.log(`Retry ${attempt + 1}/${retries} after ${delay}ms`);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}
```

### Circuit Breaker Pattern

```typescript
// /src/app/services/api/circuitBreaker.ts

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: Date;
  private threshold = 5; // Open after 5 failures
  private timeout = 60000; // Wait 1 minute before retry
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === 'OPEN') {
      if (this.lastFailureTime &&
          Date.now() - this.lastFailureTime.getTime() > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }
    }
    
    try {
      const result = await fn();
      
      // Success: reset circuit
      this.failureCount = 0;
      this.state = 'CLOSED';
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = new Date();
      
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
        console.error(`Circuit breaker OPENED after ${this.failureCount} failures`);
      }
      
      throw error;
    }
  }
}

// Create circuit breakers for external services
export const graphCircuit = new CircuitBreaker();
export const supabaseCircuit = new CircuitBreaker();
```

**Usage:**
```typescript
try {
  const sites = await graphCircuit.execute(() =>
    resilientFetch('https://graph.microsoft.com/v1.0/sites')
  );
} catch (error) {
  // Circuit is open, fall back to cached data
  const cachedSites = await supabase.from('containers').select('*');
  showWarning('Using cached data - Microsoft 365 temporarily unavailable');
  return cachedSites;
}
```

---

## 🎨 User Experience Standards

### Error UI Components

**Toast Notifications (using sonner):**

```typescript
// /src/app/components/shared/ToastManager.tsx

import { toast } from 'sonner';

export function showSuccess(message: string) {
  toast.success(message, {
    className: 'bg-[#00F0FF]/10 border-[#00F0FF]/20 text-[#00F0FF]'
  });
}

export function showError(message: string) {
  toast.error(message, {
    className: 'bg-[#FF5733]/10 border-[#FF5733]/20 text-[#FF5733]'
  });
}

export function showWarning(message: string) {
  toast.warning(message, {
    className: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
  });
}

// Usage
try {
  await syncWorkspace(workspaceId);
  showSuccess('Workspace synced successfully');
} catch (error) {
  showError('Failed to sync workspace - please try again');
}
```

**Loading States:**

```typescript
// /src/app/components/shared/LoadingSpinner.tsx

export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Aethos pulse animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-[#00F0FF]/20 animate-ping" />
        <div className="absolute inset-0 rounded-full bg-[#00F0FF]/40 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-[#00F0FF]" />
      </div>
      {message && (
        <p className="text-sm text-slate-400">{message}</p>
      )}
    </div>
  );
}

// Usage
{isLoading && <LoadingSpinner message="Syncing containers..." />}
```

**Error Boundaries:**

```typescript
// /src/app/components/shared/ErrorBoundary.tsx

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="w-16 h-16 rounded-full bg-[#FF5733]/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-[#FF5733]" />
          </div>
          <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
          <p className="text-sm text-slate-400 mb-6">
            We're having trouble loading this section. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00F0FF] text-black rounded-xl font-bold"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage in App.tsx
<ErrorBoundary>
  <ConstellationView />
</ErrorBoundary>
```

---

## 📊 Error Logging & Monitoring

### PII-Safe Logging

```typescript
// /src/app/services/logging/logger.ts

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
}

function sanitizePII(data: any): any {
  if (typeof data === 'string') {
    // Redact email patterns
    return data.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL_REDACTED]');
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = Array.isArray(data) ? [] : {};
    
    for (const key in data) {
      // Redact sensitive fields
      if (['email', 'upn', 'userPrincipalName', 'phoneNumber'].includes(key)) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizePII(data[key]);
      }
    }
    
    return sanitized;
  }
  
  return data;
}

export function logError(message: string, context?: Record<string, any>) {
  const sanitized = sanitizePII(context);
  
  console.error(message, sanitized);
  
  // Send to error tracking service
  // e.g., Sentry.captureException(new Error(message), { extra: sanitized });
}

// Usage
try {
  await fetchUserProfile(userId);
} catch (error) {
  logError('Failed to fetch user profile', {
    userId, // ✅ OK (GUID)
    error: error.message,
    // ❌ Don't log: email, userPrincipalName
  });
}
```

### Error Metrics

**Track error rates in Vercel Analytics or custom dashboard:**

- **Error Rate:** % of requests that fail
- **Retry Rate:** % of requests that succeed after retry
- **Circuit Breaker Trips:** How often circuit opens
- **Timeout Rate:** % of requests that timeout

---

## ✅ Compliance Checklist

Before deploying:

- [ ] All `fetch` calls wrapped in try/catch with retry logic
- [ ] Timeouts set on all external API calls (30s max)
- [ ] Database queries have timeouts (10s max)
- [ ] Error logs verified to be PII-free (no emails, UPNs, site URLs)
- [ ] Error messages use Supernova Orange (#FF5733) for visibility
- [ ] Circuit breakers implemented for external services
- [ ] Error boundaries wrap major UI modules
- [ ] Loading states show Aethos pulse animation
- [ ] Fallback UI for cached data when backend unavailable
- [ ] Error tracking service configured (Sentry, etc.)

---

## 📚 Related Standards

- **STD-API-001:** Resilient fetch implementation
- **STD-SEC-001:** PII redaction requirements
- **STD-M365-001:** Microsoft Graph throttling handling
- **STD-DESIGN-001:** Error UI components (Supernova Orange)
- **STD-PERF-001:** Timeout configuration

---

## 🔄 Maintenance

**Review Cycle:** Quarterly  
**Owner:** Aethos SRE / Tech Lead  
**Authority:** MANDATORY for all Aethos production code  
**Last Updated:** 2026-02-27 (Updated for Vercel + Supabase architecture, moved to /docs/3-standards/)
