/**
 * Aethos Document Control System - Module Entry Point
 * 
 * A comprehensive document management add-on with full compliance tracking
 * 
 * Features:
 * - Module 1: Document Libraries & Classification
 * - Module 2: Collaborative Drafting
 * - Module 3: Approval Workflows
 * - Module 4: Publication & Distribution
 * - Module 5: Acknowledgement Tracking
 * - Module 6: Version Control & Lineage
 * - Module 7: Compliance & Audit
 * - Module 8: Oracle Integration (Semantic Search)
 * 
 * Pricing: +$299/mo base, +$199/mo Advanced Compliance
 */

// Context & Hooks
export { DocumentControlProvider, useDocumentControl } from './context/DocumentControlContext';

// Components
export * from './components';

// Pages
export * from './pages';

// Types
export type * from './types/document-control.types';

// Utils
export { generateDocumentNumber, validateDocumentNumber } from './utils/documentNumbering';
export { calculateDocumentHealth, detectComplianceGaps } from './utils/complianceValidation';
export {
  MOCK_LIBRARIES,
  MOCK_DOCUMENTS,
  MOCK_WORKFLOWS,
  MOCK_COMPLIANCE_GAPS,
  DEMO_USERS,
} from './utils/mockData';
