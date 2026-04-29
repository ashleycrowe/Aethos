/**
 * Aethos Document Control System - React Context
 * 
 * Central state management for Document Control module
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DocumentLibrary,
  ControlledDocument,
  ApprovalWorkflow,
  DocumentControlContextValue,
  CreateLibraryRequest,
  CreateDocumentRequest,
  SubmitForApprovalRequest,
  ApproveDocumentRequest,
  RejectDocumentRequest,
  PublishDocumentRequest,
  DocumentStatus,
  ApprovalStatus,
} from '../types/document-control.types';
import {
  MOCK_LIBRARIES,
  MOCK_DOCUMENTS,
  MOCK_WORKFLOWS,
  simulateApprovalDelay,
} from '../utils/mockData';
import { generateDocumentNumber } from '../utils/documentNumbering';
import { calculateDocumentHealth } from '../utils/complianceValidation';

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

const DocumentControlContext = createContext<DocumentControlContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface DocumentControlProviderProps {
  children: React.ReactNode;
  demoMode?: boolean;
}

export const DocumentControlProvider: React.FC<DocumentControlProviderProps> = ({
  children,
  demoMode = true, // Default to demo mode for prototype
}) => {
  // State
  const [libraries, setLibraries] = useState<DocumentLibrary[]>([]);
  const [documents, setDocuments] = useState<ControlledDocument[]>([]);
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [currentLibrary, setCurrentLibrary] = useState<DocumentLibrary | undefined>();
  const [currentDocument, setCurrentDocument] = useState<ControlledDocument | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    if (demoMode) {
      // Load mock data in demo mode
      setLibraries(MOCK_LIBRARIES);
      setDocuments(MOCK_DOCUMENTS);
      setWorkflows(MOCK_WORKFLOWS);
    } else {
      // Load from API in production mode
      loadLibraries();
      loadDocuments();
      loadWorkflows();
    }
  }, [demoMode]);

  // ============================================================================
  // DATA LOADING (Production Mode)
  // ============================================================================

  const loadLibraries = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with real API call
      // const response = await fetch('/api/document-control/libraries');
      // const data = await response.json();
      // setLibraries(data);
    } catch (err) {
      setError('Failed to load libraries');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with real API call
      // const response = await fetch('/api/document-control/documents');
      // const data = await response.json();
      // setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkflows = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with real API call
      // const response = await fetch('/api/document-control/workflows');
      // const data = await response.json();
      // setWorkflows(data);
    } catch (err) {
      setError('Failed to load workflows');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // LIBRARY OPERATIONS
  // ============================================================================

  const createLibrary = useCallback(
    async (data: CreateLibraryRequest): Promise<DocumentLibrary> => {
      if (demoMode) {
        // Demo mode: Create mock library
        const newLibrary: DocumentLibrary = {
          id: `lib-${Date.now()}`,
          tenantId: 'demo-tenant',
          name: data.name,
          description: data.description,
          type: data.type,
          complianceStandard: data.complianceStandard,
          numberingPrefix: data.numberingPrefix,
          numberingPattern: '{prefix}-{year}-{sequence:3}',
          currentSequence: 0,
          managers: data.managers,
          allowedRoles: [],
          isPrivate: false,
          requireAcknowledgement: data.settings.requireAcknowledgement,
          defaultRetentionDays: data.settings.defaultRetentionDays,
          autoArchiveExpired: data.settings.autoArchiveExpired,
          allowPdfConversion: data.settings.allowPdfConversion,
          createdBy: 'current-user',
          createdAt: new Date(),
          updatedAt: new Date(),
          documentCount: 0,
        };

        setLibraries(prev => [...prev, newLibrary]);
        return newLibrary;
      } else {
        // Production mode: Call API
        // TODO: Replace with real API call
        // const response = await fetch('/api/document-control/libraries', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        // return await response.json();
        throw new Error('Production mode not implemented');
      }
    },
    [demoMode]
  );

  // ============================================================================
  // DOCUMENT OPERATIONS
  // ============================================================================

  const createDocument = useCallback(
    async (data: CreateDocumentRequest): Promise<ControlledDocument> => {
      const library = libraries.find(lib => lib.id === data.libraryId);
      if (!library) {
        throw new Error('Library not found');
      }

      if (demoMode) {
        // Demo mode: Create mock document
        const documentNumber = generateDocumentNumber(library);
        
        const newDocument: ControlledDocument = {
          id: `doc-${Date.now()}`,
          libraryId: data.libraryId,
          tenantId: 'demo-tenant',
          documentNumber,
          title: data.title,
          type: data.type,
          status: DocumentStatus.DRAFT,
          currentVersion: '1.0',
          versionId: `ver-${Date.now()}`,
          category: data.category,
          tags: data.tags || [],
          department: data.department,
          owner: 'current-user',
          contributors: ['current-user'],
          sourceProvider: data.sourceProvider,
          sourceFileId: data.sourceFileId,
          sourceFileName: data.sourceFileName,
          fileSize: 0,
          mimeType: 'application/octet-stream',
          complianceStandard: library.complianceStandard,
          requiresApproval: library.complianceStandard !== 'none',
          requiresAcknowledgement: library.requireAcknowledgement,
          relatedDocuments: [],
          healthScore: 0,
          healthScoreLevel: 'fair',
          healthIssues: ['Document in draft status'],
          createdBy: 'current-user',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Calculate initial health score
        const health = calculateDocumentHealth(newDocument, library);
        newDocument.healthScore = health.overall;
        newDocument.healthScoreLevel = health.level;

        setDocuments(prev => [...prev, newDocument]);
        
        // Update library document count
        setLibraries(prev =>
          prev.map(lib =>
            lib.id === data.libraryId
              ? { ...lib, documentCount: lib.documentCount + 1, currentSequence: lib.currentSequence + 1 }
              : lib
          )
        );

        return newDocument;
      } else {
        // Production mode: Call API
        // TODO: Replace with real API call
        throw new Error('Production mode not implemented');
      }
    },
    [demoMode, libraries]
  );

  // ============================================================================
  // APPROVAL OPERATIONS
  // ============================================================================

  const submitForApproval = useCallback(
    async (data: SubmitForApprovalRequest): Promise<void> => {
      if (demoMode) {
        // Demo mode: Simulate approval process
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === data.documentId
              ? { ...doc, status: DocumentStatus.IN_REVIEW }
              : doc
          )
        );

        // Simulate automatic approval after delay
        simulateApprovalDelay(() => {
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === data.documentId
                ? {
                    ...doc,
                    status: DocumentStatus.APPROVED,
                    approvedDate: new Date(),
                  }
                : doc
            )
          );
        }, 5000); // 5 second delay for demo
      } else {
        // Production mode: Call API
        // TODO: Replace with real API call
        throw new Error('Production mode not implemented');
      }
    },
    [demoMode]
  );

  const approveDocument = useCallback(
    async (data: ApproveDocumentRequest): Promise<void> => {
      if (demoMode) {
        // Demo mode: Approve immediately
        // In real implementation, this would update specific approval stage
        console.log('Document approved:', data);
      } else {
        // Production mode: Call API
        // TODO: Replace with real API call
        throw new Error('Production mode not implemented');
      }
    },
    [demoMode]
  );

  const rejectDocument = useCallback(
    async (data: RejectDocumentRequest): Promise<void> => {
      if (demoMode) {
        // Demo mode: Reject and return to draft
        setDocuments(prev =>
          prev.map(doc =>
            doc.versionId === data.approvalId
              ? { ...doc, status: DocumentStatus.REJECTED }
              : doc
          )
        );
      } else {
        // Production mode: Call API
        // TODO: Replace with real API call
        throw new Error('Production mode not implemented');
      }
    },
    [demoMode]
  );

  // ============================================================================
  // PUBLICATION OPERATIONS
  // ============================================================================

  const publishDocument = useCallback(
    async (data: PublishDocumentRequest): Promise<void> => {
      if (demoMode) {
        // Demo mode: Publish immediately
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === data.documentId
              ? {
                  ...doc,
                  status: DocumentStatus.PUBLISHED,
                  publishedDate: new Date(),
                  approvedDate: doc.approvedDate || new Date(),
                }
              : doc
          )
        );

        // TODO: Push to workspaces if specified
        if (data.pushToWorkspaces && data.pushToWorkspaces.length > 0) {
          console.log('Publishing to workspaces:', data.pushToWorkspaces);
        }
      } else {
        // Production mode: Call API
        // TODO: Replace with real API call
        throw new Error('Production mode not implemented');
      }
    },
    [demoMode]
  );

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: DocumentControlContextValue = {
    // State
    libraries,
    documents,
    workflows,
    currentLibrary,
    currentDocument,

    // Actions
    createLibrary,
    createDocument,
    submitForApproval,
    approveDocument,
    rejectDocument,
    publishDocument,

    // Loading
    isLoading,
    error,

    // Demo mode
    isDemoMode: demoMode,
  };

  return (
    <DocumentControlContext.Provider value={value}>
      {children}
    </DocumentControlContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useDocumentControl = (): DocumentControlContextValue => {
  const context = useContext(DocumentControlContext);
  if (!context) {
    throw new Error('useDocumentControl must be used within DocumentControlProvider');
  }
  return context;
};
