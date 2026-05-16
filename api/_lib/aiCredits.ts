import { supabase } from './apiAuth.js';

export type AiCreditAction =
  | 'semantic_search'
  | 'summarize_document'
  | 'pii_scan_regex'
  | 'pii_scan_ai_assist'
  | 'metadata_suggestion'
  | 'oracle_answer'
  | 'content_indexing'
  | 'large_document_summary';

type RecordAiCreditUsageInput = {
  tenantId: string;
  userId?: string | null;
  fileId?: string | null;
  actionType: AiCreditAction;
  creditCost: number;
  model?: string | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  cached?: boolean;
  status?: 'succeeded' | 'failed' | 'skipped' | 'queued';
  metadata?: Record<string, unknown>;
};

type VerifyAiCreditsInput = {
  tenantId: string;
  requiredCredits: number;
  actionType: AiCreditAction;
};

type VerifyAiCreditsResult = {
  allowed: boolean;
  enforced: boolean;
  remainingCredits: number | null;
  requiredCredits?: number;
  actionType?: AiCreditAction;
  message?: string;
};

export async function verifyAiCreditsAvailable(input: VerifyAiCreditsInput): Promise<VerifyAiCreditsResult> {
  const requiredCredits = Math.max(0, input.requiredCredits);

  if (requiredCredits === 0) {
    return { allowed: true, enforced: false, remainingCredits: null };
  }

  await supabase
    .from('tenant_ai_settings')
    .upsert({ tenant_id: input.tenantId }, { onConflict: 'tenant_id' });

  const { data: settings, error: settingsError } = await supabase
    .from('tenant_ai_settings')
    .select('monthly_credit_limit, credits_enforced, allow_overage')
    .eq('tenant_id', input.tenantId)
    .single();

  if (settingsError || !settings?.credits_enforced || settings.allow_overage) {
    return {
      allowed: true,
      enforced: Boolean(settings?.credits_enforced),
      remainingCredits: null,
    };
  }

  const periodMonth = new Date();
  periodMonth.setUTCDate(1);
  periodMonth.setUTCHours(0, 0, 0, 0);
  const periodMonthDate = periodMonth.toISOString().slice(0, 10);

  const { data: balance } = await supabase
    .from('ai_credit_balances')
    .select('credits_used, credits_reserved, monthly_credit_limit')
    .eq('tenant_id', input.tenantId)
    .eq('period_month', periodMonthDate)
    .single();

  const monthlyLimit = balance?.monthly_credit_limit ?? settings.monthly_credit_limit ?? 0;
  const creditsUsed = balance?.credits_used ?? 0;
  const creditsReserved = balance?.credits_reserved ?? 0;
  const remainingCredits = Math.max(0, monthlyLimit - creditsUsed - creditsReserved);

  if (remainingCredits < requiredCredits) {
    return {
      allowed: false,
      enforced: true,
      remainingCredits,
      requiredCredits,
      actionType: input.actionType,
      message:
        'Your workspace is out of Intelligence Credits. Upgrade your AI+ package or purchase an expansion pack to continue.',
    };
  }

  return {
    allowed: true,
    enforced: true,
    remainingCredits,
  };
}

export async function recordAiCreditUsage(input: RecordAiCreditUsageInput) {
  const { error } = await supabase.rpc('record_ai_credit_usage', {
    p_tenant_id: input.tenantId,
    p_user_id: input.userId || null,
    p_file_id: input.fileId || null,
    p_action_type: input.actionType,
    p_credit_cost: input.creditCost,
    p_model: input.model || null,
    p_input_tokens: input.inputTokens ?? null,
    p_output_tokens: input.outputTokens ?? null,
    p_cached: Boolean(input.cached),
    p_status: input.status || 'succeeded',
    p_metadata: input.metadata || {},
  });

  if (error) {
    console.error('Unable to record AI+ credit usage:', error);
    return false;
  }

  return true;
}
