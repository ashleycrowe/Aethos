/**
 * Aethos Document Control System - Compliance Validation Utilities
 * 
 * Validates documents against ISO 9001, FDA 21 CFR Part 11, SOC 2, and other standards
 */

import {
  ControlledDocument,
  DocumentLibrary,
  ComplianceStandard,
  ComplianceGap,
  DocumentHealthMetrics,
  HealthScoreLevel,
  DocumentStatus,
} from '../types/document-control.types';

// ============================================================================
// HEALTH SCORE CALCULATION
// ============================================================================

/**
 * Calculate comprehensive document health metrics
 */
export const calculateDocumentHealth = (
  document: ControlledDocument,
  library: DocumentLibrary,
  acknowledgementRate?: number,
  viewCount?: number
): DocumentHealthMetrics => {
  const compliance = calculateComplianceScore(document, library);
  const freshness = calculateFreshnessScore(document);
  const usage = calculateUsageScore(document, acknowledgementRate, viewCount);
  const risk = calculateRiskScore(document, library);
  
  // Overall score is weighted average
  const overall = Math.round(
    compliance.score * 0.35 +
    freshness.score * 0.25 +
    usage.score * 0.20 +
    risk.score * 0.20
  );
  
  return {
    overall,
    level: getHealthScoreLevel(overall),
    breakdown: {
      compliance,
      freshness,
      usage,
      risk,
    },
  };
};

/**
 * Compliance score: Does document meet all regulatory requirements?
 */
const calculateComplianceScore = (
  document: ControlledDocument,
  library: DocumentLibrary
): { score: number; issues: string[] } => {
  const issues: string[] = [];
  let score = 100;
  
  // Check if approval is required but missing
  if (document.requiresApproval && document.status === DocumentStatus.PUBLISHED && !document.approvedDate) {
    issues.push('Published without formal approval');
    score -= 30;
  }
  
  // Check if owner is assigned
  if (!document.owner) {
    issues.push('No document owner assigned');
    score -= 20;
  }
  
  // Check if next review date is set (for published docs)
  if (document.status === DocumentStatus.PUBLISHED && !document.nextReviewDate) {
    issues.push('No next review date scheduled');
    score -= 15;
  }
  
  // Check compliance standard specific requirements
  if (library.complianceStandard !== ComplianceStandard.NONE) {
    const standardIssues = validateComplianceStandard(document, library);
    issues.push(...standardIssues);
    score -= standardIssues.length * 10;
  }
  
  return {
    score: Math.max(0, score),
    issues,
  };
};

/**
 * Freshness score: How recently has document been reviewed/updated?
 */
const calculateFreshnessScore = (
  document: ControlledDocument
): { score: number; daysSinceReview: number; isExpired: boolean } => {
  const now = new Date();
  let score = 100;
  let daysSinceReview = 0;
  let isExpired = false;
  
  // Check expiration
  if (document.expirationDate) {
    const daysUntilExpiration = Math.floor(
      (document.expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilExpiration < 0) {
      // Expired
      isExpired = true;
      score = 0;
      daysSinceReview = Math.abs(daysUntilExpiration);
    } else if (daysUntilExpiration < 30) {
      // Expiring soon
      score -= 40;
    } else if (daysUntilExpiration < 90) {
      score -= 20;
    }
  }
  
  // Check last update
  if (!isExpired && document.updatedAt) {
    const daysSinceUpdate = Math.floor(
      (now.getTime() - document.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    daysSinceReview = daysSinceUpdate;
    
    if (daysSinceUpdate > 365) {
      score -= 30; // Over a year old
    } else if (daysSinceUpdate > 180) {
      score -= 15; // Over 6 months old
    }
  }
  
  return {
    score: Math.max(0, score),
    daysSinceReview,
    isExpired,
  };
};

/**
 * Usage score: Are people actually reading/acknowledging this document?
 */
const calculateUsageScore = (
  document: ControlledDocument,
  acknowledgementRate: number = 1.0,
  viewCount: number = 100
): { score: number; acknowledgementRate: number; viewCount: number } => {
  let score = 100;
  
  // Check acknowledgement rate (if required)
  if (document.requiresAcknowledgement) {
    if (acknowledgementRate < 0.5) {
      // Less than 50% = critical
      score = 20;
    } else if (acknowledgementRate < 0.7) {
      score = 50;
    } else if (acknowledgementRate < 0.9) {
      score = 75;
    } else {
      score = 100;
    }
  } else {
    // Check view count as proxy
    if (viewCount < 5) {
      score = 30; // Ghost document
    } else if (viewCount < 20) {
      score = 60;
    } else {
      score = 100;
    }
  }
  
  return {
    score,
    acknowledgementRate,
    viewCount,
  };
};

/**
 * Risk score: What's the risk of this document causing issues?
 */
const calculateRiskScore = (
  document: ControlledDocument,
  library: DocumentLibrary
): { score: number; level: 'low' | 'medium' | 'high' | 'critical'; factors: string[] } => {
  const factors: string[] = [];
  let riskPoints = 0; // Higher = worse
  
  // Status-based risk
  if (document.status === DocumentStatus.EXPIRED) {
    factors.push('Document is expired');
    riskPoints += 40;
  } else if (document.status === DocumentStatus.DRAFT) {
    factors.push('Still in draft status');
    riskPoints += 20;
  }
  
  // Missing critical metadata
  if (!document.owner) {
    factors.push('No owner assigned');
    riskPoints += 15;
  }
  
  if (!document.category) {
    factors.push('No category assigned');
    riskPoints += 5;
  }
  
  // Compliance-specific risks
  if (library.complianceStandard !== ComplianceStandard.NONE) {
    if (!document.nextReviewDate) {
      factors.push('No scheduled review date');
      riskPoints += 20;
    }
    
    if (document.requiresApproval && !document.approvedDate) {
      factors.push('Published without approval');
      riskPoints += 30;
    }
  }
  
  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'critical';
  if (riskPoints >= 60) {
    level = 'critical';
  } else if (riskPoints >= 40) {
    level = 'high';
  } else if (riskPoints >= 20) {
    level = 'medium';
  } else {
    level = 'low';
  }
  
  // Convert risk points to score (inverse - lower risk = higher score)
  const score = Math.max(0, 100 - riskPoints);
  
  return {
    score,
    level,
    factors,
  };
};

/**
 * Get health score level from numeric score
 */
const getHealthScoreLevel = (score: number): HealthScoreLevel => {
  if (score >= 90) return HealthScoreLevel.EXCELLENT;
  if (score >= 75) return HealthScoreLevel.GOOD;
  if (score >= 60) return HealthScoreLevel.FAIR;
  if (score >= 40) return HealthScoreLevel.POOR;
  return HealthScoreLevel.CRITICAL;
};

// ============================================================================
// COMPLIANCE STANDARD VALIDATION
// ============================================================================

/**
 * Validate document against specific compliance standard
 */
const validateComplianceStandard = (
  document: ControlledDocument,
  library: DocumentLibrary
): string[] => {
  switch (library.complianceStandard) {
    case ComplianceStandard.ISO_9001:
      return validateISO9001(document);
    case ComplianceStandard.FDA_21_CFR_PART_11:
      return validateFDA21CFRPart11(document);
    case ComplianceStandard.SOC_2:
      return validateSOC2(document);
    case ComplianceStandard.GDPR:
      return validateGDPR(document);
    case ComplianceStandard.HIPAA:
      return validateHIPAA(document);
    default:
      return [];
  }
};

/**
 * ISO 9001 Quality Management System requirements
 */
const validateISO9001 = (document: ControlledDocument): string[] => {
  const issues: string[] = [];
  
  // ISO 9001 requires:
  // - Document identification (number/version)
  // - Approval before use
  // - Review and update
  // - Controlled distribution
  
  if (!document.documentNumber) {
    issues.push('ISO 9001: Missing document identification number');
  }
  
  if (!document.currentVersion) {
    issues.push('ISO 9001: Missing version control');
  }
  
  if (document.status === DocumentStatus.PUBLISHED && !document.approvedDate) {
    issues.push('ISO 9001: Document must be approved before publication');
  }
  
  if (!document.nextReviewDate) {
    issues.push('ISO 9001: Periodic review date not scheduled');
  }
  
  return issues;
};

/**
 * FDA 21 CFR Part 11 Electronic Records requirements
 */
const validateFDA21CFRPart11 = (document: ControlledDocument): string[] => {
  const issues: string[] = [];
  
  // FDA 21 CFR Part 11 requires:
  // - Electronic signatures
  // - Audit trails
  // - System validation
  // - Access controls
  
  if (document.requiresApproval && !document.approvedDate) {
    issues.push('FDA 21 CFR Part 11: Missing electronic signature/approval');
  }
  
  if (!document.owner) {
    issues.push('FDA 21 CFR Part 11: No responsible person assigned');
  }
  
  // Note: Audit trail validation would be done at system level
  
  return issues;
};

/**
 * SOC 2 security requirements
 */
const validateSOC2 = (document: ControlledDocument): string[] => {
  const issues: string[] = [];
  
  // SOC 2 requires:
  // - Access controls
  // - Change management
  // - Version control
  // - Retention policies
  
  if (!document.owner) {
    issues.push('SOC 2: Document must have assigned owner for accountability');
  }
  
  if (!document.currentVersion) {
    issues.push('SOC 2: Version control required for change tracking');
  }
  
  return issues;
};

/**
 * GDPR data protection requirements
 */
const validateGDPR = (document: ControlledDocument): string[] => {
  const issues: string[] = [];
  
  // GDPR considerations:
  // - Data minimization
  // - Access controls
  // - Retention limits
  
  if (document.tags.some(tag => tag.toLowerCase().includes('personal') || tag.toLowerCase().includes('pii'))) {
    if (!document.expirationDate) {
      issues.push('GDPR: Documents containing personal data should have retention limit');
    }
  }
  
  return issues;
};

/**
 * HIPAA healthcare requirements
 */
const validateHIPAA = (document: ControlledDocument): string[] => {
  const issues: string[] = [];
  
  // HIPAA requires:
  // - Access controls
  // - Audit controls
  // - Integrity controls
  
  if (!document.owner) {
    issues.push('HIPAA: Protected health information must have assigned custodian');
  }
  
  return issues;
};

// ============================================================================
// COMPLIANCE GAP DETECTION
// ============================================================================

/**
 * Detect compliance gaps across a library
 */
export const detectComplianceGaps = (
  documents: ControlledDocument[],
  library: DocumentLibrary
): ComplianceGap[] => {
  const gaps: ComplianceGap[] = [];
  const now = new Date();
  
  documents.forEach(doc => {
    // Check for expired documents
    if (doc.status === DocumentStatus.EXPIRED) {
      const daysExpired = Math.floor(
        (now.getTime() - (doc.expirationDate?.getTime() || 0)) / (1000 * 60 * 60 * 24)
      );
      
      gaps.push({
        id: `gap-expired-${doc.id}`,
        tenantId: doc.tenantId,
        severity: daysExpired > 90 ? 'critical' : daysExpired > 30 ? 'high' : 'medium',
        type: 'expired_document',
        documentId: doc.id,
        libraryId: library.id,
        title: `${doc.documentNumber}: Document Expired`,
        description: `Document expired ${daysExpired} days ago and has not been reviewed or renewed.`,
        recommendation: 'Immediately review and update the document, or archive if no longer needed.',
        isResolved: false,
        detectedAt: now,
        detectedBy: 'system',
      });
    }
    
    // Check for missing approvals
    if (doc.requiresApproval && doc.status === DocumentStatus.PUBLISHED && !doc.approvedDate) {
      gaps.push({
        id: `gap-approval-${doc.id}`,
        tenantId: doc.tenantId,
        severity: 'high',
        type: 'missing_approval',
        documentId: doc.id,
        libraryId: library.id,
        title: `${doc.documentNumber}: Missing Approval`,
        description: 'Document is published but lacks required approval signature.',
        recommendation: 'Withdraw document from publication and complete approval process.',
        isResolved: false,
        detectedAt: now,
        detectedBy: 'system',
      });
    }
    
    // Check for missing owner
    if (!doc.owner) {
      gaps.push({
        id: `gap-owner-${doc.id}`,
        tenantId: doc.tenantId,
        severity: 'medium',
        type: 'missing_owner',
        documentId: doc.id,
        libraryId: library.id,
        title: `${doc.documentNumber}: No Owner Assigned`,
        description: 'Document lacks an assigned owner for accountability and maintenance.',
        recommendation: 'Assign a document owner from the appropriate department.',
        isResolved: false,
        detectedAt: now,
        detectedBy: 'system',
      });
    }
    
    // Check for overdue reviews
    if (doc.nextReviewDate && doc.nextReviewDate < now && doc.status === DocumentStatus.PUBLISHED) {
      const daysOverdue = Math.floor(
        (now.getTime() - doc.nextReviewDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      gaps.push({
        id: `gap-review-${doc.id}`,
        tenantId: doc.tenantId,
        severity: daysOverdue > 90 ? 'high' : 'medium',
        type: 'overdue_review',
        documentId: doc.id,
        libraryId: library.id,
        title: `${doc.documentNumber}: Review Overdue`,
        description: `Scheduled review is ${daysOverdue} days overdue.`,
        recommendation: 'Initiate periodic review process to ensure document remains current.',
        isResolved: false,
        detectedAt: now,
        detectedBy: 'system',
      });
    }
  });
  
  return gaps;
};

/**
 * Ghost document detection (low engagement)
 */
export const detectGhostDocuments = (
  documents: ControlledDocument[],
  acknowledgementRates: Map<string, number>
): ComplianceGap[] => {
  const gaps: ComplianceGap[] = [];
  const now = new Date();
  
  documents
    .filter(doc => doc.status === DocumentStatus.PUBLISHED && doc.requiresAcknowledgement)
    .forEach(doc => {
      const ackRate = acknowledgementRates.get(doc.id) || 0;
      
      if (ackRate < 0.1) {
        // Less than 10% acknowledged = ghost document
        gaps.push({
          id: `gap-ghost-${doc.id}`,
          tenantId: doc.tenantId,
          severity: 'medium',
          type: 'orphaned_document',
          documentId: doc.id,
          libraryId: doc.libraryId,
          title: `${doc.documentNumber}: Ghost Document Detected`,
          description: `Only ${Math.round(ackRate * 100)}% of intended audience has viewed/acknowledged this document.`,
          recommendation: 'Re-promote the document, send reminders, or archive if no longer relevant.',
          isResolved: false,
          detectedAt: now,
          detectedBy: 'ai',
        });
      } else if (ackRate < 0.7) {
        // 10-70% = low acknowledgement
        gaps.push({
          id: `gap-lowack-${doc.id}`,
          tenantId: doc.tenantId,
          severity: 'low',
          type: 'low_acknowledgement',
          documentId: doc.id,
          libraryId: doc.libraryId,
          title: `${doc.documentNumber}: Low Acknowledgement Rate`,
          description: `Only ${Math.round(ackRate * 100)}% acknowledgement rate (target: 90%).`,
          recommendation: 'Send reminder notifications to employees who have not acknowledged.',
          isResolved: false,
          detectedAt: now,
          detectedBy: 'ai',
        });
      }
    });
  
  return gaps;
};
