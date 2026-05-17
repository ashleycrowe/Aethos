import OpenAI from 'openai';
import { supabase } from './apiAuth.js';

export type OperationsRole = 'sales_success' | 'support' | 'product_admin';
export type TicketCategory = 'question' | 'issue' | 'feature' | 'billing' | 'landing_page';
export type ProductAreaTag =
  | 'oracle'
  | 'workspaces'
  | 'billing'
  | 'sync'
  | 'ai_plus'
  | 'admin'
  | 'remediation'
  | 'metadata'
  | 'auth'
  | 'unknown';
export type TicketSentiment = 'positive' | 'neutral' | 'negative' | 'urgent';

export type TicketTriage = {
  product_area_tag: ProductAreaTag;
  sentiment: TicketSentiment;
  priority: 'low' | 'normal' | 'high' | 'urgent';
};

const PRODUCT_AREAS: ProductAreaTag[] = [
  'oracle',
  'workspaces',
  'billing',
  'sync',
  'ai_plus',
  'admin',
  'remediation',
  'metadata',
  'auth',
  'unknown',
];

const SENTIMENTS: TicketSentiment[] = ['positive', 'neutral', 'negative', 'urgent'];
const PRIORITIES: TicketTriage['priority'][] = ['low', 'normal', 'high', 'urgent'];

function normalizeChoice<T extends string>(value: unknown, allowed: T[], fallback: T): T {
  if (typeof value !== 'string') return fallback;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function heuristicTriage(input: { title: string; description: string; category: TicketCategory }): TicketTriage {
  const text = `${input.title} ${input.description} ${input.category}`.toLowerCase();
  const product_area_tag: ProductAreaTag =
    text.includes('oracle') || text.includes('search')
      ? 'oracle'
      : text.includes('workspace') || text.includes('nexus')
        ? 'workspaces'
        : text.includes('bill') || text.includes('price') || text.includes('credit') || text.includes('license')
          ? 'billing'
          : text.includes('sync') || text.includes('discovery') || text.includes('graph')
            ? 'sync'
            : text.includes('ai') || text.includes('summary') || text.includes('semantic')
              ? 'ai_plus'
              : text.includes('admin') || text.includes('login') || text.includes('auth')
                ? 'auth'
                : text.includes('metadata') || text.includes('tag')
                  ? 'metadata'
                  : text.includes('archive') || text.includes('remediation')
                    ? 'remediation'
                    : 'unknown';

  const urgent = text.includes('urgent') || text.includes('blocked') || text.includes('down') || text.includes('cannot');
  const negative = urgent || text.includes('broken') || text.includes('failed') || text.includes('frustrat');

  return {
    product_area_tag,
    sentiment: urgent ? 'urgent' : negative ? 'negative' : input.category === 'feature' ? 'positive' : 'neutral',
    priority: urgent ? 'urgent' : negative ? 'high' : 'normal',
  };
}

export async function triageTicketWithAI(input: {
  title: string;
  description: string;
  category: TicketCategory;
  uiContextDump?: unknown;
}): Promise<TicketTriage> {
  const fallback = heuristicTriage(input);

  if (!process.env.OPENAI_API_KEY) return fallback;

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You triage Aethos support tickets. Return JSON only with product_area_tag, sentiment, and priority. product_area_tag must be one of: oracle, workspaces, billing, sync, ai_plus, admin, remediation, metadata, auth, unknown. sentiment must be positive, neutral, negative, or urgent. priority must be low, normal, high, or urgent.',
        },
        {
          role: 'user',
          content: JSON.stringify({
            title: input.title,
            description: input.description,
            category: input.category,
            ui_context_dump: input.uiContextDump || {},
          }),
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      product_area_tag: normalizeChoice(parsed.product_area_tag, PRODUCT_AREAS, fallback.product_area_tag),
      sentiment: normalizeChoice(parsed.sentiment, SENTIMENTS, fallback.sentiment),
      priority: normalizeChoice(parsed.priority, PRIORITIES, fallback.priority),
    };
  } catch (error) {
    console.error('Operations Hub triage failed, using heuristic fallback:', error);
    return fallback;
  }
}

export async function getOperationsRole(userId?: string | null): Promise<OperationsRole> {
  if (!userId) return 'support';

  const { data: explicitRole } = await supabase
    .from('operations_user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (explicitRole?.role) return explicitRole.role as OperationsRole;

  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  return user?.role === 'admin' || user?.role === 'architect' ? 'product_admin' : 'support';
}

export function categoriesForRole(role: OperationsRole): TicketCategory[] {
  if (role === 'sales_success') return ['billing', 'landing_page'];
  if (role === 'support') return ['question', 'issue'];
  return ['question', 'issue', 'feature', 'billing', 'landing_page'];
}
