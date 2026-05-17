import { VercelRequest, VercelResponse } from '@vercel/node';
import { requireApiContext, sendApiError, supabase } from '../_lib/apiAuth.js';
import { categoriesForRole, getOperationsRole } from '../_lib/operationsHub.js';

function groupCount(rows: any[], key: string) {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const value = row[key] || 'unknown';
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const context = await requireApiContext(req, res, { methods: ['POST'] });
  if (!context) return;

  const role = await getOperationsRole(context.userId);
  const categories = categoriesForRole(role);
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: visibleTickets, error } = await supabase
    .from('support_tickets')
    .select('*')
    .in('category', categories)
    .order('created_at', { ascending: false })
    .limit(250);

  if (error) {
    return sendApiError(res, 500, 'Unable to load Operations Hub intelligence', 'DATABASE_ERROR', error.message);
  }

  const tickets = visibleTickets || [];
  const featureRequests = groupCount(
    tickets.filter((ticket) => ticket.category === 'feature'),
    'product_area_tag'
  );
  const frustrations = groupCount(
    tickets.filter((ticket) => ticket.category === 'issue' && ['negative', 'urgent'].includes(ticket.sentiment)),
    'product_area_tag'
  );
  const recentByArea = groupCount(
    tickets.filter((ticket) => ticket.created_at >= since24h),
    'product_area_tag'
  );
  const anomalyAlerts = recentByArea
    .filter((area) => area.count >= 5)
    .map((area) => ({
      productAreaTag: area.name,
      count24h: area.count,
      severity: area.count >= 10 ? 'high' : 'medium',
      message: `${area.count} tickets tagged ${area.name} in the last 24 hours.`,
    }));

  const { data: articles } = await supabase
    .from('knowledge_articles')
    .select('id,title,category,product_area_tag,updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(20);

  const { data: creditSettings } = role === 'sales_success' || role === 'product_admin'
    ? await supabase
      .from('tenant_ai_settings')
      .select('tenant_id,monthly_credit_limit,trial_credit_grant,indexing_file_limit,credits_enforced,allow_overage')
      .limit(20)
    : { data: [] as any[] };

  return res.status(200).json({
    success: true,
    role,
    tickets,
    articles: articles || [],
    featureRequests,
    frustrations,
    anomalyAlerts,
    creditSettings: creditSettings || [],
  });
}
