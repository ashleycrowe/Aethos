import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import { categoriesForRole, getOperationsRole } from '../_lib/operationsHub.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) {
    return sendApiError(res, 400, 'Search query is required', 'VALIDATION_ERROR', {
      required: ['query'],
    });
  }

  const role = await getOperationsRole(context.userId);
  const categories = categoriesForRole(role);
  const searchTerm = query.replace(/[^\w\s-]/g, '').trim().split(/\s+/).join(' & ');

  const [ticketResult, articleResult] = await Promise.all([
    supabase
      .from('support_tickets')
      .select('id,title,description,category,status,product_area_tag,sentiment,resolution_summary,created_at')
      .in('category', categories)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,resolution_summary.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('knowledge_articles')
      .select('id,title,content,category,product_area_tag,updated_at')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('updated_at', { ascending: false })
      .limit(20),
  ]);

  if (ticketResult.error) {
    return sendApiError(res, 500, 'Unable to search support tickets', 'DATABASE_ERROR', ticketResult.error.message);
  }

  if (articleResult.error) {
    return sendApiError(res, 500, 'Unable to search knowledge articles', 'DATABASE_ERROR', articleResult.error.message);
  }

  return res.status(200).json({
    success: true,
    role,
    query,
    parsedSearchTerm: searchTerm,
    tickets: ticketResult.data || [],
    articles: articleResult.data || [],
  });
}
