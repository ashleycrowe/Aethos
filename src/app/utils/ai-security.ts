/**
 * AIPrivacyService (STD-AI-001 Implementation)
 * Sanitizes metadata before it leaves the Aethos environment for AI processing.
 */

export const sanitizeMetadataForAI = (metadata: any): any => {
  const sanitized = JSON.parse(JSON.stringify(metadata));
  
  // Rule: Redact specific emails and replace with obscured identifiers
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  
  const processValue = (val: any): any => {
    if (typeof val === 'string') {
      return val.replace(emailRegex, '[IDENTITY_PROTECTED]');
    }
    if (Array.isArray(val)) {
      return val.map(processValue);
    }
    if (val !== null && typeof val === 'object') {
      Object.keys(val).forEach(key => {
        val[key] = processValue(val[key]);
      });
    }
    return val;
  };

  return processValue(sanitized);
};

export const validatePromptSafety = (input: string): { safe: boolean; error?: string } => {
  const forbiddenPatterns = [
    /system:/gi,
    /ignore (previous|all) (instructions|prompts)/gi,
    /you are now/gi,
    /act as admin/gi
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(input)) {
      return { safe: false, error: 'Input contains restricted orchestration commands.' };
    }
  }

  return { safe: true };
};
