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
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileId, artifactId, tenantId } = req.body;
    const targetFileId = fileId || artifactId;

    if (!targetFileId || !tenantId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if tenant has AI+ subscription
    const { data: tenant } = await supabase
      .from('tenants')
      .select('ai_features_enabled')
      .eq('id', tenantId)
      .single();

    if (!tenant?.ai_features_enabled) {
      return res.status(403).json({ error: 'AI+ features not enabled for this tenant' });
    }

    // Retrieve content chunks
    const { data: chunks } = await supabase
      .from('content_embeddings')
      .select('chunk_text, chunk_index')
      .eq('file_id', targetFileId)
      .eq('tenant_id', tenantId)
      .order('chunk_index', { ascending: true });

    if (!chunks || chunks.length === 0) {
      return res.status(404).json({ error: 'No content found for this file' });
    }

    const fullText = chunks.map((c) => c.chunk_text).join('\n\n');

    // Run regex-based detection
    const patternFindings = detectPIIPatterns(fullText);

    // Run AI-based detection for more complex PII
    const aiPIITypes = await detectPIIWithAI(fullText);

    // Calculate risk score
    const riskScore = Math.min(
      100,
      (patternFindings.length * 10 + aiPIITypes.length * 15)
    );

    const riskLevel =
      riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

    // Store PII detection results
    await supabase.from('pii_detections').insert({
      tenant_id: tenantId,
      file_id: targetFileId,
      risk_level: riskLevel,
      risk_score: riskScore,
      pattern_findings: patternFindings,
      ai_detected_types: aiPIITypes,
      total_findings: patternFindings.length + aiPIITypes.length,
      scanned_at: new Date().toISOString(),
    });

    // Update file with PII flag
    await supabase
      .from('files')
      .update({
        has_pii: patternFindings.length > 0 || aiPIITypes.length > 0,
        pii_risk_level: riskLevel,
      })
      .eq('id', targetFileId);

    return res.status(200).json({
      success: true,
      fileId: targetFileId,
      riskLevel,
      riskScore,
      findings: {
        patterns: patternFindings,
        aiDetected: aiPIITypes,
      },
      totalFindings: patternFindings.length + aiPIITypes.length,
    });
  } catch (error: any) {
    console.error('Error detecting PII:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
