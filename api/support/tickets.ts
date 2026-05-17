import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import { categoriesForRole, getOperationsRole, TicketCategory, triageTicketWithAI } from '../_lib/operationsHub.js';

const VALID_CATEGORIES: TicketCategory[] = ['question', 'issue', 'feature', 'billing', 'landing_page'];

function normalizeCategory(value: unknown): TicketCategory {
  return VALID_CATEGORIES.includes(value as TicketCategory) ? (value as TicketCategory) : 'question';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['GET', 'POST'] });
  if (!context) return;

  if (req.method === 'GET') {
    const role = await getOperationsRole(context.userId);
    const categories = categoriesForRole(role);
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .in('category', categories)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return sendApiError(res, 500, 'Unable to load support tickets', 'DATABASE_ERROR', error.message);
    }

    return res.status(200).json({
      success: true,
      role,
      tickets: data || [],
    });
  }

  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
  const category = normalizeCategory(req.body?.category);

  if (!title || !description) {
    return sendApiError(res, 400, 'Ticket title and description are required', 'VALIDATION_ERROR', {
      required: ['title', 'description'],
    });
  }

  const triage = await triageTicketWithAI({
    title,
    description,
    category,
    uiContextDump: req.body?.uiContextDump || {},
  });

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      tenant_id: context.tenantId,
      user_id: context.userId || null,
      title,
      description,
      category,
      status: 'triaged',
      priority: triage.priority,
      product_area_tag: triage.product_area_tag,
      sentiment: triage.sentiment,
      ui_context_dump: req.body?.uiContextDump || {},
      source: req.body?.source || 'in_app',
    })
    .select('*')
    .single();

  if (error) {
    return sendApiError(res, 500, 'Unable to create support ticket', 'DATABASE_ERROR', error.message);
  }

  return res.status(201).json({
    success: true,
    ticket: data,
    triage,
  });
}
