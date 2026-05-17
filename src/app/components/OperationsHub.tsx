import React from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  CreditCard,
  Headphones,
  Lightbulb,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { getOperationsHub, searchOperationsHub, type OperationsHubResponse, type SupportSearchResponse } from '@/lib/api';

type ViewId = 'sales_success' | 'support' | 'product_admin';

const viewLabels: Record<ViewId, string> = {
  sales_success: 'Sales / Success',
  support: 'Support',
  product_admin: 'Product Intelligence',
};

const roleTabs: Array<{ id: ViewId; label: string; icon: React.ElementType }> = [
  { id: 'sales_success', label: 'Success', icon: CreditCard },
  { id: 'support', label: 'Support', icon: Headphones },
  { id: 'product_admin', label: 'Product', icon: BarChart3 },
];

function canUseView(actualRole: ViewId, requested: ViewId) {
  return actualRole === 'product_admin' || actualRole === requested;
}

export const OperationsHub = () => {
  const { getAccessToken } = useAuth();
  const [data, setData] = React.useState<OperationsHubResponse | null>(null);
  const [activeView, setActiveView] = React.useState<ViewId>('support');
  const [isLoading, setIsLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<SupportSearchResponse | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getOperationsHub({ accessToken: await getAccessToken() });
      setData(response);
      setActiveView((current) => (canUseView(response.role, current) ? current : response.role));
    } catch (error) {
      toast.error('Operations Hub unavailable', {
        description: error instanceof Error ? error.message : 'Unable to load support intelligence.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const runSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      const response = await searchOperationsHub({
        query: query.trim(),
        accessToken: await getAccessToken(),
      });
      setSearchResults(response);
    } catch (error) {
      toast.error('Support search unavailable', {
        description: error instanceof Error ? error.message : 'Unable to search tickets and articles.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const visibleTickets = data?.tickets || [];
  const salesTickets = visibleTickets.filter((ticket) => ticket.category === 'billing' || ticket.category === 'landing_page');
  const supportTickets = visibleTickets.filter((ticket) => ticket.category === 'question' || ticket.category === 'issue');

  return (
    <div className="min-h-full space-y-6 overflow-x-hidden px-3 pb-24 sm:px-6 lg:px-8">
      <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6 lg:backdrop-blur-2xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#1AFFFF]">Internal Operations</p>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Product Intelligence & Unified Support Hub</h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              A zero-touch support layer where tickets, enablement materials, and product signals feed roadmap decisions without burying the team in manual triage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#1AFFFF]/25 bg-[#1AFFFF]/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-[#1AFFFF] transition hover:bg-[#1AFFFF]/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {roleTabs.map((tab) => {
            const Icon = tab.icon;
            const disabled = data ? !canUseView(data.role, tab.id) : false;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={disabled}
                onClick={() => setActiveView(tab.id)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-black uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  activeView === tab.id
                    ? 'border-white bg-white text-black'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {activeView === 'sales_success' && (
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
              <CreditCard className="h-5 w-5 text-[#1AFFFF]" />
              Sales / Success Queue
            </h2>
            <div className="space-y-3">
              {salesTickets.slice(0, 8).map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
              {salesTickets.length === 0 && <EmptyState text="No billing or landing page tickets visible for your role." />}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
              <SlidersHorizontal className="h-5 w-5 text-amber-200" />
              Licensing Control Panel
            </h2>
            <p className="mb-4 text-sm leading-6 text-slate-400">
              Mock control surface for beta support. Values mirror tenant AI+ credit settings when available.
            </p>
            <div className="space-y-3">
              {(data?.creditSettings || []).slice(0, 4).map((setting) => (
                <div key={setting.tenant_id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{setting.tenant_id}</p>
                  <p className="mt-2 text-sm text-white">{setting.monthly_credit_limit.toLocaleString()} monthly credits</p>
                  <div className="mt-3 flex gap-2">
                    <button className="min-h-9 flex-1 rounded-xl border border-white/10 bg-white/[0.04] text-[10px] font-black uppercase tracking-[0.12em] text-slate-300">Add Pack</button>
                    <button className="min-h-9 flex-1 rounded-xl border border-amber-300/25 bg-amber-300/10 text-[10px] font-black uppercase tracking-[0.12em] text-amber-200">Review</button>
                  </div>
                </div>
              ))}
              {(data?.creditSettings || []).length === 0 && <EmptyState text="No AI+ credit settings visible yet." />}
            </div>
          </div>
        </section>
      )}

      {activeView === 'support' && (
        <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
              <Headphones className="h-5 w-5 text-[#1AFFFF]" />
              Support Queue
            </h2>
            <div className="space-y-3">
              {supportTickets.slice(0, 10).map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
              {supportTickets.length === 0 && <EmptyState text="No question or issue tickets visible for your role." />}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
              <BookOpen className="h-5 w-5 text-emerald-300" />
              Answer Finder
            </h2>
            <form onSubmit={runSearch} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resolved tickets and knowledge articles"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#1AFFFF]/40"
                />
              </div>
              <button className="min-h-11 rounded-xl bg-[#1AFFFF] px-4 text-xs font-black uppercase tracking-[0.14em] text-black">
                {isSearching ? 'Searching' : 'Search'}
              </button>
            </form>
            <div className="grid gap-4 md:grid-cols-2">
              <ResultColumn title="Tickets" items={(searchResults?.tickets || []).map((ticket) => ({
                id: ticket.id,
                title: ticket.title,
                body: ticket.resolution_summary || ticket.description,
                meta: `${ticket.category} · ${ticket.product_area_tag || 'unknown'}`,
              }))} />
              <ResultColumn title="Articles" items={(searchResults?.articles || []).map((article) => ({
                id: article.id,
                title: article.title,
                body: article.content || '',
                meta: `${article.category} · ${article.product_area_tag || 'general'}`,
              }))} />
            </div>
          </div>
        </section>
      )}

      {activeView === 'product_admin' && (
        <section className="grid gap-5 xl:grid-cols-3">
          <InsightPanel
            icon={Lightbulb}
            title="Most Requested Features"
            tone="cyan"
            rows={(data?.featureRequests || []).map((item) => ({ label: item.name, value: item.count }))}
          />
          <InsightPanel
            icon={AlertTriangle}
            title="Frequent Frustrations"
            tone="amber"
            rows={(data?.frustrations || []).map((item) => ({ label: item.name, value: item.count }))}
          />
          <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
              <ShieldCheck className="h-5 w-5 text-rose-200" />
              Anomaly Alerts
            </h2>
            <div className="space-y-3">
              {(data?.anomalyAlerts || []).map((alert) => (
                <div key={alert.productAreaTag} className="rounded-2xl border border-rose-200/20 bg-black/15 p-4">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-rose-100">{alert.productAreaTag}</p>
                  <p className="mt-2 text-xs leading-5 text-rose-100/80">{alert.message}</p>
                </div>
              ))}
              {(data?.anomalyAlerts || []).length === 0 && <EmptyState text="No 24-hour ticket volume anomalies detected." />}
            </div>
          </div>
        </section>
      )}

      <p className="text-center text-[10px] uppercase tracking-[0.18em] text-slate-600">
        Current Operations Role: {data ? viewLabels[data.role] : 'Loading'}
      </p>
    </div>
  );
};

const TicketRow = ({ ticket }: { ticket: OperationsHubResponse['tickets'][number] }) => (
  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
    <div className="mb-2 flex items-start justify-between gap-3">
      <p className="text-sm font-black text-white">{ticket.title}</p>
      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
        {ticket.sentiment || 'neutral'}
      </span>
    </div>
    <p className="line-clamp-2 text-xs leading-5 text-slate-400">{ticket.description}</p>
    <div className="mt-3 flex flex-wrap gap-2 text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">
      <span>{ticket.category}</span>
      <span>{ticket.product_area_tag || 'unknown'}</span>
      <span>{ticket.status}</span>
    </div>
  </div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-slate-500">{text}</div>
);

const ResultColumn = ({ title, items }: { title: string; items: Array<{ id: string; title: string; body: string; meta: string }> }) => (
  <div>
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">{title}</p>
    <div className="space-y-3">
      {items.slice(0, 5).map((item) => (
        <div key={item.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
          <p className="text-sm font-black text-white">{item.title}</p>
          <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{item.body}</p>
          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">{item.meta}</p>
        </div>
      ))}
      {items.length === 0 && <EmptyState text={`No ${title.toLowerCase()} found yet.`} />}
    </div>
  </div>
);

const InsightPanel = ({
  icon: Icon,
  title,
  tone,
  rows,
}: {
  icon: React.ElementType;
  title: string;
  tone: 'cyan' | 'amber';
  rows: Array<{ label: string; value: number }>;
}) => (
  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
    <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-white">
      <Icon className={`h-5 w-5 ${tone === 'cyan' ? 'text-[#1AFFFF]' : 'text-amber-200'}`} />
      {title}
    </h2>
    <div className="space-y-3">
      {rows.slice(0, 8).map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/15 p-4">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-slate-300">{row.label}</span>
          <span className="text-lg font-black text-white">{row.value}</span>
        </div>
      ))}
      {rows.length === 0 && <EmptyState text="No signal yet." />}
    </div>
  </div>
);

export default OperationsHub;
