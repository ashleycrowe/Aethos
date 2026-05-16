/**
 * PII Detection API - V1.5 AI+ Feature
 * 
 * PURPOSE: Detect personally identifiable information in documents
 * DETECTION: SSNs, credit cards, email addresses, phone numbers, addresses
 * COMPLIANCE: GDPR, HIPAA, SOC 2 requirements
 * 
 * WORKFLOW:
 * 1. Retrieve content chunks for artifact
 * 2. Run regex patterns + AI detection
 * 3. Flag sensitive content
 * 4. Store PII detection results
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import { recordAiCreditUsage, verifyAiCreditsAvailable } from '../_lib/aiCredits.js';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';

// PII Detection Patterns
const PII_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}\b/g,
  ip_address: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
};

function detectPIIPatterns(text: string): Array<{ type: string; value: string; position: number }> {
  const findings: Array<{ type: string; value: string; position: number }> = [];

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      findings.push({
        type,
        value: match[0],
        position: match.index || 0,
      });
    }
  }

  return findings;
}

async function detectPIIWithAI(text: string): Promise<string[]> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a PII detection assistant. Analyze the text and identify any personally identifiable information (PII) such as names, addresses, dates of birth, medical information, financial details, etc. Return a JSON array of PII types found (e.g., ["name", "address", "medical_record"]).',
        },
        {
          role: 'user',
          content: `Analyze this text for PII:\n\n${text.substring(0, 4000)}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response.pii_types || [];
  } catch (error) {
    console.error('AI PII detection error:', error);
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  try {
    const { tenantId, userId } = context;
    const { fileId, artifactId, aiAssist = false } = req.body;
    const targetFileId = fileId || artifactId;

    if (!targetFileId) {
      return sendApiError(res, 400, 'Missing required fields', 'VALIDATION_ERROR', {
        required: ['fileId'],
      });
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return sendApiError(res, 403, 'AI+ features are not enabled for this tenant.', 'TENANT_INACTIVE', {
        action: 'Enable ai_features_enabled for this tenant before scanning indexed content.',
      });
    }

    // Retrieve content chunks
    const { data: chunks } = await supabase
      .from('content_embeddings')
      .select('chunk_text, chunk_index')
      .eq('file_id', targetFileId)
      .eq('tenant_id', tenantId)
      .order('chunk_index', { ascending: true });

    if (!chunks || chunks.length === 0) {
      return sendApiError(res, 404, 'No indexed content found for this file.', 'RESOURCE_NOT_FOUND', {
        action: 'Run AI+ content indexing before PII detection.',
      });
    }

    const fullText = chunks.map((c) => c.chunk_text).join('\n\n');

    // Run regex-based detection
    const patternFindings = detectPIIPatterns(fullText);

    const shouldRunAiAssist = Boolean(aiAssist) || patternFindings.length > 0;
    const aiAssistConfigured = Boolean(process.env.OPENAI_API_KEY);
    const piiCreditCost = shouldRunAiAssist && aiAssistConfigured ? 5 : 0;

    const creditCheck = await verifyAiCreditsAvailable({
      tenantId,
      requiredCredits: piiCreditCost,
      actionType: piiCreditCost > 0 ? 'pii_scan_ai_assist' : 'pii_scan_regex',
    });

    if (!creditCheck.allowed) {
      return sendApiError(res, 402, creditCheck.message || 'Insufficient Intelligence Credits.', 'CREDIT_LIMIT_EXCEEDED', creditCheck);
    }

    // Run AI-based detection only when there is a reason to spend model calls.
    // Clean regex passes stay deterministic and free for credit accounting.
    const aiPIITypes =
      shouldRunAiAssist && aiAssistConfigured ? await detectPIIWithAI(fullText) : [];

    // Calculate risk score
    const riskScore = Math.min(
      100,
      (patternFindings.length * 10 + aiPIITypes.length * 15)
    );

    const riskLevel =
      riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

    const { error: deleteError } = await supabase
      .from('pii_detections')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('file_id', targetFileId);

    if (deleteError) {
      console.error('Error clearing existing PII detections:', deleteError);
      return sendApiError(res, 500, 'Unable to prepare file for PII rescan', 'DATABASE_ERROR', deleteError.message);
    }

    // Store PII detection results
    const { error: insertError } = await supabase.from('pii_detections').insert({
      tenant_id: tenantId,
      file_id: targetFileId,
      risk_level: riskLevel,
      risk_score: riskScore,
      pattern_findings: patternFindings,
      ai_detected_types: aiPIITypes,
      total_findings: patternFindings.length + aiPIITypes.length,
      scanned_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Error storing PII detection:', insertError);
      return sendApiError(res, 500, 'Unable to store PII detection result', 'DATABASE_ERROR', insertError.message);
    }

    // Update file with PII flag
    const { error: updateError } = await supabase
      .from('files')
      .update({
        has_pii: patternFindings.length > 0 || aiPIITypes.length > 0,
        pii_risk_level: riskLevel,
      })
      .eq('id', targetFileId);

    if (updateError) {
      console.error('Error updating PII file flags:', updateError);
      return sendApiError(res, 500, 'Unable to update file PII flags', 'DATABASE_ERROR', updateError.message);
    }

    await recordAiCreditUsage({
      tenantId,
      userId,
      fileId: targetFileId,
      actionType: shouldRunAiAssist && aiAssistConfigured ? 'pii_scan_ai_assist' : 'pii_scan_regex',
      creditCost: piiCreditCost,
      model: shouldRunAiAssist && aiAssistConfigured ? 'gpt-4o-mini' : null,
      metadata: {
        riskLevel,
        riskScore,
        patternFindingCount: patternFindings.length,
        aiDetectedTypeCount: aiPIITypes.length,
        aiAssistRequested: Boolean(aiAssist),
      },
    });

    return res.status(200).json({
      success: true,
      fileId: targetFileId,
      riskLevel,
      riskScore,
      findings: {
        patterns: patternFindings,
        aiDetected: aiPIITypes,
      },
      aiAssist: {
        requested: Boolean(aiAssist),
        used: shouldRunAiAssist && aiAssistConfigured,
        skippedReason:
          !shouldRunAiAssist
            ? 'No deterministic PII patterns found.'
            : !aiAssistConfigured
              ? 'OPENAI_API_KEY is not configured; regex-only scan completed.'
              : null,
      },
      totalFindings: patternFindings.length + aiPIITypes.length,
    });
  } catch (error: any) {
    console.error('Error detecting PII:', error);
    return sendApiError(res, 500, error.message || 'Internal server error', 'INTERNAL_ERROR');
  }
}
