/**
 * Aethos Document Control System - Document Numbering Utilities
 * 
 * Auto-generates document numbers based on configurable patterns
 */

import { DocumentLibrary } from '../types/document-control.types';

/**
 * Generate the next document number for a library
 * 
 * Pattern syntax:
 * - {prefix} - Library numbering prefix (e.g., "SOP-HR")
 * - {year} - Current year (e.g., "2026")
 * - {month} - Current month zero-padded (e.g., "03")
 * - {sequence:N} - Sequential number with N digits (e.g., {sequence:3} = "001")
 * 
 * Example patterns:
 * - "{prefix}-{year}-{sequence:3}" → "SOP-HR-2026-001"
 * - "{prefix}-{year}{month}-{sequence:4}" → "POL-IT-202603-0001"
 * - "{prefix}-{sequence:5}" → "QMS-00001"
 */
export const generateDocumentNumber = (library: DocumentLibrary): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  let pattern = library.numberingPattern;
  
  // Replace {prefix}
  pattern = pattern.replace('{prefix}', library.numberingPrefix);
  
  // Replace {year}
  pattern = pattern.replace('{year}', year);
  
  // Replace {month}
  pattern = pattern.replace('{month}', month);
  
  // Replace {sequence:N} where N is the number of digits
  const sequenceMatch = pattern.match(/\{sequence:(\d+)\}/);
  if (sequenceMatch) {
    const digits = parseInt(sequenceMatch[1]);
    const sequenceNumber = (library.currentSequence + 1).toString().padStart(digits, '0');
    pattern = pattern.replace(sequenceMatch[0], sequenceNumber);
  }
  
  return pattern;
};

/**
 * Validate a document number against a library's pattern
 */
export const validateDocumentNumber = (
  documentNumber: string,
  library: DocumentLibrary
): { valid: boolean; error?: string } => {
  // Convert pattern to regex
  let regexPattern = library.numberingPattern;
  
  // Escape special characters
  regexPattern = regexPattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  
  // Replace placeholders with regex
  regexPattern = regexPattern.replace('\\{prefix\\}', library.numberingPrefix);
  regexPattern = regexPattern.replace('\\{year\\}', '\\d{4}');
  regexPattern = regexPattern.replace('\\{month\\}', '\\d{2}');
  
  const sequenceMatch = regexPattern.match(/\\\{sequence:(\\d+)\\\}/);
  if (sequenceMatch) {
    const digits = sequenceMatch[1];
    regexPattern = regexPattern.replace(sequenceMatch[0], `\\d{${digits}}`);
  }
  
  const regex = new RegExp(`^${regexPattern}$`);
  
  if (!regex.test(documentNumber)) {
    return {
      valid: false,
      error: `Document number must match pattern: ${library.numberingPattern}`,
    };
  }
  
  return { valid: true };
};

/**
 * Parse document number components
 */
export const parseDocumentNumber = (
  documentNumber: string,
  library: DocumentLibrary
): {
  prefix?: string;
  year?: string;
  month?: string;
  sequence?: number;
} | null => {
  const validation = validateDocumentNumber(documentNumber, library);
  if (!validation.valid) {
    return null;
  }
  
  const parts: any = {};
  
  // Extract prefix
  if (documentNumber.startsWith(library.numberingPrefix)) {
    parts.prefix = library.numberingPrefix;
  }
  
  // Extract year (4 digits)
  const yearMatch = documentNumber.match(/\d{4}/);
  if (yearMatch) {
    parts.year = yearMatch[0];
  }
  
  // Extract sequence (last set of digits)
  const sequenceMatch = documentNumber.match(/(\d+)$/);
  if (sequenceMatch) {
    parts.sequence = parseInt(sequenceMatch[1]);
  }
  
  return parts;
};

/**
 * Generate suggested numbering patterns
 */
export const getSuggestedPatterns = (prefix: string): Array<{
  pattern: string;
  example: string;
  description: string;
}> => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  
  return [
    {
      pattern: '{prefix}-{year}-{sequence:3}',
      example: `${prefix}-${year}-001`,
      description: 'Standard format with year and 3-digit sequence',
    },
    {
      pattern: '{prefix}-{year}{month}-{sequence:3}',
      example: `${prefix}-${year}${month}-001`,
      description: 'Format with year+month and 3-digit sequence',
    },
    {
      pattern: '{prefix}-{sequence:4}',
      example: `${prefix}-0001`,
      description: 'Simple format with 4-digit sequence only',
    },
    {
      pattern: '{prefix}-{year}-{sequence:4}',
      example: `${prefix}-${year}-0001`,
      description: 'Standard format with year and 4-digit sequence',
    },
    {
      pattern: '{prefix}-{sequence:5}',
      example: `${prefix}-00001`,
      description: 'Simple format with 5-digit sequence (large libraries)',
    },
  ];
};

/**
 * Validate naming convention (file name)
 */
export const validateNamingConvention = (
  fileName: string,
  conventions?: {
    allowSpaces?: boolean;
    allowSpecialChars?: boolean;
    maxLength?: number;
    requireExtension?: boolean;
    bannedWords?: string[];
  }
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const defaultConventions = {
    allowSpaces: true,
    allowSpecialChars: false,
    maxLength: 255,
    requireExtension: true,
    bannedWords: ['untitled', 'new', 'copy', 'draft', 'temp', 'test'],
    ...conventions,
  };
  
  // Check for banned words
  const lowerFileName = fileName.toLowerCase();
  for (const word of defaultConventions.bannedWords || []) {
    if (lowerFileName.includes(word)) {
      errors.push(`File name contains banned word: "${word}"`);
    }
  }
  
  // Check spaces
  if (!defaultConventions.allowSpaces && fileName.includes(' ')) {
    errors.push('File name cannot contain spaces');
  }
  
  // Check special characters
  if (!defaultConventions.allowSpecialChars) {
    const specialChars = /[^a-zA-Z0-9._-\s]/;
    if (specialChars.test(fileName)) {
      errors.push('File name contains invalid special characters');
    }
  }
  
  // Check length
  if (fileName.length > defaultConventions.maxLength!) {
    errors.push(`File name exceeds maximum length of ${defaultConventions.maxLength} characters`);
  }
  
  // Check extension
  if (defaultConventions.requireExtension) {
    const hasExtension = /\.[a-z0-9]+$/i.test(fileName);
    if (!hasExtension) {
      errors.push('File name must have an extension');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Suggest a standardized file name
 */
export const suggestStandardFileName = (
  originalName: string,
  documentNumber: string,
  version?: string
): string => {
  // Remove extension
  const extension = originalName.match(/\.[a-z0-9]+$/i)?.[0] || '';
  let baseName = originalName.replace(extension, '');
  
  // Remove banned words
  const bannedWords = ['untitled', 'new', 'copy', 'draft', 'temp', 'test', 'final', 'final2'];
  for (const word of bannedWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    baseName = baseName.replace(regex, '');
  }
  
  // Remove special characters, replace spaces with underscores
  baseName = baseName.replace(/[^a-zA-Z0-9\s-]/g, '');
  baseName = baseName.replace(/\s+/g, '_');
  baseName = baseName.replace(/_+/g, '_');
  baseName = baseName.replace(/^_|_$/g, '');
  
  // If base name is empty, use document number
  if (!baseName) {
    baseName = documentNumber;
  }
  
  // Add version if provided
  const versionSuffix = version ? `_v${version}` : '';
  
  return `${documentNumber}_${baseName}${versionSuffix}${extension}`;
};
