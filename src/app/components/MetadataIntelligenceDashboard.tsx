import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Brain, TrendingUp, AlertCircle, CheckCircle, FileQuestion,
  FolderOpen, Sparkles, ArrowRight, Download, Settings, Zap, Info
} from 'lucide-react';
import { isDemoModeEnabled } from '@/app/config/demoMode';
import { useAuth } from '@/app/context/AuthContext';
import { useVersion } from '@/app/context/VersionContext';
import { recordMetadataSuggestionDecision } from '@/lib/api';
import { toast } from 'sonner';

interface MetadataQuality {
  totalFiles: number;
  filesWithDescriptions: number;
  filesWithTags: number;
  filesWithMeaningfulNames: number;
  avgNameLength: number;
}

interface EnrichmentStatus {
  filesCategorized: number;
  departmentsInferred: number;
  keywordsGenerated: number;
  timePeriodsExtracted: number;
  avgConfidenceScore: number;
  filesNowDiscoverable: number;
}

interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

interface ImprovementOpportunity {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  count: number;
  action: string;
  icon: React.ReactNode;
}

interface AIReadinessBlocker {
  id: string;
  label: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface ConservativeMetadataSuggestion {
  id: string;
  type: 'title' | 'tag' | 'category' | 'owner';
  label: string;
  count: number;
  sourceSignals: string[];
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  nextAction: string;
  actionTarget?: 'metadata_review' | 'remediation' | 'workspace';
  remediationIssue?: 'external_share' | 'stale' | 'missing_owner' | 'high_risk' | 'onedrive_silo';
}

type MetadataDecisionStatus = 'accepted' | 'edited' | 'rejected' | 'blocked';

const ACCEPTED_DECISION_STATUSES = new Set<MetadataDecisionStatus>(['accepted', 'edited']);

interface MetadataDecisionSummary {
  totalDecisions: number;
  accepted: number;
  edited: number;
  rejected: number;
  blocked: number;
  acceptedAffectedFiles: number;
  latestDecisionAt: string | null;
}

function openRemediation(issue?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab: 'archival', issue },
  }));
}

function openAppTab(tab: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('aethos:navigate', {
    detail: { tab },
  }));
}

export const MetadataIntelligenceDashboard: React.FC = () => {
  const { tenantId, getAccessToken } = useAuth();
  const { isDemoMode: globalDemoMode } = useVersion();
  const [selectedView, setSelectedView] = useState<'overview' | 'categories' | 'opportunities'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(isDemoModeEnabled());
  const [error, setError] = useState<string | null>(null);
  const [sourceMetadataScore, setSourceMetadataScore] = useState(0);
  const [aethosEnrichmentScore, setAethosEnrichmentScore] = useState(0);
  const [aiReadinessBlockers, setAiReadinessBlockers] = useState<AIReadinessBlocker[]>([]);
  const [metadataSuggestions, setMetadataSuggestions] = useState<ConservativeMetadataSuggestion[]>([]);
  const [metadataDecisionSummary, setMetadataDecisionSummary] = useState<MetadataDecisionSummary>({
    totalDecisions: 0,
    accepted: 0,
    edited: 0,
    rejected: 0,
    blocked: 0,
    acceptedAffectedFiles: 0,
    latestDecisionAt: null,
  });
  const [suggestionDecisions, setSuggestionDecisions] = useState<Record<string, MetadataDecisionStatus>>({});
  const [editedSuggestionValues, setEditedSuggestionValues] = useState<Record<string, string>>({});
  const [savingSuggestionId, setSavingSuggestionId] = useState<string | null>(null);

  // State for real data from API
  const [intelligenceScore, setIntelligenceScore] = useState(0);
  const [sourceQuality, setSourceQuality] = useState<MetadataQuality>({
    totalFiles: 0,
    filesWithDescriptions: 0,
    filesWithTags: 0,
    filesWithMeaningfulNames: 0,
    avgNameLength: 0
  });
  const [enrichmentStatus, setEnrichmentStatus] = useState<EnrichmentStatus>({
    filesCategorized: 0,
    departmentsInferred: 0,
    keywordsGenerated: 0,
    timePeriodsExtracted: 0,
    avgConfidenceScore: 0,
    filesNowDiscoverable: 0
  });
  const demoCategories: CategoryBreakdown[] = [
    { category: 'Financial Planning', count: 1234, percentage: 31, color: '#00F0FF' },
    { category: 'HR Documents', count: 567, percentage: 14, color: '#FF5733' },
    { category: 'Engineering', count: 432, percentage: 11, color: '#9B59B6' },
    { category: 'Sales', count: 389, percentage: 10, color: '#3498DB' },
    { category: 'Marketing', count: 301, percentage: 8, color: '#E74C3C' },
    { category: 'Operations', count: 245, percentage: 6, color: '#2ECC71' },
    { category: 'Legal', count: 189, percentage: 5, color: '#F39C12' },
    { category: 'Uncategorized', count: 643, percentage: 16, color: '#95A5A6' }
  ];
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const demoOpportunities: ImprovementOpportunity[] = [
    {
      priority: 'high',
      title: 'Low Confidence Files',
      description: '456 files with confidence <0.5',
      count: 456,
      action: 'Enable Content Reading for better results',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      priority: 'medium',
      title: 'Generic File Names',
      description: '2,347 files named "Document1", "Untitled", etc.',
      count: 2347,
      action: 'Low discoverability - consider renaming',
      icon: <FileQuestion className="w-5 h-5" />
    },
    {
      priority: 'low',
      title: 'No Path Context',
      description: '890 files in root folders',
      count: 890,
      action: 'Consider reorganizing source systems',
      icon: <FolderOpen className="w-5 h-5" />
    }
  ];
  const [opportunities, setOpportunities] = useState<ImprovementOpportunity[]>([]);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchIntelligenceMetrics = async () => {
      if (globalDemoMode) {
        setIsDemoMode(true);
        setIntelligenceScore(68);
        setSourceMetadataScore(42);
        setAethosEnrichmentScore(68);
        setAiReadinessBlockers([
          { id: 'generic_names', label: 'Generic names', count: 2347, severity: 'medium', recommendation: 'Suggest clearer titles from filename and path context.' },
          { id: 'missing_owner', label: 'Missing owners', count: 312, severity: 'high', recommendation: 'Assign stewardship before remediation.' },
          { id: 'missing_tags', label: 'Missing tags/categories', count: 1829, severity: 'medium', recommendation: 'Generate Aethos-side suggestions for review.' },
        ]);
        setMetadataSuggestions([
          {
            id: 'suggest-clearer-titles',
            type: 'title',
            label: 'Suggest clearer titles',
            count: 2347,
            sourceSignals: ['filename', 'path'],
            confidence: 'medium',
            rationale: 'Generic filenames reduce search quality. Aethos can suggest clearer titles from path and filename context for human review.',
            nextAction: 'Review title suggestions',
            actionTarget: 'metadata_review',
          },
          {
            id: 'suggest-tags-categories',
            type: 'tag',
            label: 'Suggest tags and categories',
            count: 1829,
            sourceSignals: ['filename', 'path', 'extension', 'owner'],
            confidence: 'medium',
            rationale: 'Metadata-only context can produce conservative Aethos-side tags and categories for approval.',
            nextAction: 'Generate suggestions',
            actionTarget: 'metadata_review',
          },
        ]);
        setMetadataDecisionSummary({
          totalDecisions: 7,
          accepted: 3,
          edited: 1,
          rejected: 2,
          blocked: 1,
          acceptedAffectedFiles: 1380,
          latestDecisionAt: '2026-05-12T00:00:00.000Z',
        });
        setSourceQuality({
          totalFiles: 4567,
          filesWithDescriptions: 548,
          filesWithTags: 365,
          filesWithMeaningfulNames: 502,
          avgNameLength: 18
        });
        setEnrichmentStatus({
          filesCategorized: 4293,
          departmentsInferred: 3973,
          keywordsGenerated: 4567,
          timePeriodsExtracted: 3471,
          avgConfidenceScore: 0.84,
          filesNowDiscoverable: 3456
        });
        setCategories(demoCategories);
        setOpportunities(demoOpportunities);
        setIsLoading(false);
        return;
      }

      try {
        setIsDemoMode(false);
        setIsLoading(true);
        setError(null);

        const accessToken = await getAccessToken();

        const response = await fetch('/api/intelligence/metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ tenantId }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        // Update state with real data
        setIntelligenceScore(data.intelligenceScore);
        setSourceMetadataScore(data.sourceMetadataScore ?? 0);
        setAethosEnrichmentScore(data.aethosEnrichmentScore ?? data.intelligenceScore ?? 0);
        setAiReadinessBlockers(data.aiReadinessBlockers || []);
        setMetadataSuggestions(data.metadataSuggestions || []);
        setMetadataDecisionSummary(data.metadataDecisionSummary || {
          totalDecisions: 0,
          accepted: 0,
          edited: 0,
          rejected: 0,
          blocked: 0,
          acceptedAffectedFiles: 0,
          latestDecisionAt: null,
        });
        setSourceQuality(data.sourceQuality);
        setEnrichmentStatus(data.enrichmentStatus);
        setCategories(data.categories);
        setOpportunities(data.opportunities);

      } catch (err) {
        console.warn('Failed to fetch live intelligence metrics:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsDemoMode(false);
        setIntelligenceScore(0);
        setSourceMetadataScore(0);
        setAethosEnrichmentScore(0);
        setAiReadinessBlockers([]);
        setMetadataSuggestions([]);
        setMetadataDecisionSummary({
          totalDecisions: 0,
          accepted: 0,
          edited: 0,
          rejected: 0,
          blocked: 0,
          acceptedAffectedFiles: 0,
          latestDecisionAt: null,
        });
        setSourceQuality({
          totalFiles: 0,
          filesWithDescriptions: 0,
          filesWithTags: 0,
          filesWithMeaningfulNames: 0,
          avgNameLength: 0
        });
        setEnrichmentStatus({
          filesCategorized: 0,
          departmentsInferred: 0,
          keywordsGenerated: 0,
          timePeriodsExtracted: 0,
          avgConfidenceScore: 0,
          filesNowDiscoverable: 0
        });
        setCategories([]);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntelligenceMetrics();
  }, [tenantId, getAccessToken, globalDemoMode]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-[#00F0FF]';
    if (score >= 60) return 'text-[#F39C12]';
    return 'text-[#FF5733]';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'border-[#FF5733]';
      case 'medium': return 'border-[#F39C12]';
      case 'low': return 'border-[#00F0FF]';
      default: return 'border-[#95A5A6]';
    }
  };

  const getPercentage = (value: number, total: number) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  const openMetadataSuggestions = () => setSelectedView('opportunities');

  const applyLocalSuggestionDecision = (
    suggestion: ConservativeMetadataSuggestion,
    decisionStatus: MetadataDecisionStatus,
    previousStatus?: MetadataDecisionStatus
  ) => {
    setSuggestionDecisions((current) => ({ ...current, [suggestion.id]: decisionStatus }));
    setMetadataDecisionSummary((current) => {
      const next = { ...current };
      if (!previousStatus) {
        next.totalDecisions += 1;
      } else {
        next[previousStatus] = Math.max(0, next[previousStatus] - 1);
        if (ACCEPTED_DECISION_STATUSES.has(previousStatus)) {
          next.acceptedAffectedFiles = Math.max(0, next.acceptedAffectedFiles - suggestion.count);
        }
      }

      next[decisionStatus] += 1;
      if (ACCEPTED_DECISION_STATUSES.has(decisionStatus)) {
        next.acceptedAffectedFiles += suggestion.count;
      }
      next.latestDecisionAt = new Date().toISOString();
      return next;
    });
  };

  const getEditedSuggestionValue = (suggestion: ConservativeMetadataSuggestion) =>
    (editedSuggestionValues[suggestion.id] || '').trim();

  const buildSuggestionReviewPacket = (suggestion: ConservativeMetadataSuggestion) => [
    `Aethos metadata review packet: ${suggestion.label}`,
    `Files affected: ${suggestion.count.toLocaleString()}`,
    `Confidence: ${suggestion.confidence}`,
    `Signals used: ${suggestion.sourceSignals.join(', ')}`,
    `Rationale: ${suggestion.rationale}`,
    'Default action: review first. No Microsoft 365 writeback is performed by this packet.',
  ].join('\n');

  const copySuggestionReviewPacket = async (suggestion: ConservativeMetadataSuggestion) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast.error('Clipboard is unavailable in this browser');
      return;
    }

    try {
      await navigator.clipboard.writeText(buildSuggestionReviewPacket(suggestion));
      toast.success('Metadata review packet copied');
    } catch {
      toast.error('Unable to copy metadata review packet');
    }
  };

  const handleSuggestionAction = (suggestion: ConservativeMetadataSuggestion) => {
    if (suggestion.actionTarget === 'remediation' && suggestion.remediationIssue) {
      openRemediation(suggestion.remediationIssue);
      return;
    }

    if (suggestion.actionTarget === 'workspace') {
      openAppTab('nexus');
      return;
    }

    void copySuggestionReviewPacket(suggestion);
  };

  const recordSuggestionDecision = async (
    suggestion: ConservativeMetadataSuggestion,
    decisionStatus: MetadataDecisionStatus,
    options: { quiet?: boolean; manageSavingState?: boolean; editedValue?: Record<string, unknown> } = {}
  ) => {
    const manageSavingState = options.manageSavingState ?? !options.quiet;
    const previousStatus = suggestionDecisions[suggestion.id];
    const editedLabel = decisionStatus === 'edited'
      ? String(options.editedValue?.label || getEditedSuggestionValue(suggestion)).trim()
      : '';

    if (decisionStatus === 'edited' && !editedLabel) {
      toast.error('Add an edited value before marking edited');
      return;
    }

    if (isDemoMode) {
      applyLocalSuggestionDecision(suggestion, decisionStatus, previousStatus);
      if (!options.quiet) toast.success(`Demo decision marked ${decisionStatus}`);
      return;
    }

    try {
      if (manageSavingState) setSavingSuggestionId(suggestion.id);
      const accessToken = await getAccessToken();
      await recordMetadataSuggestionDecision({
        accessToken,
        suggestionId: suggestion.id,
        suggestionType: suggestion.type,
        decisionStatus,
        affectedCount: suggestion.count,
        confidence: suggestion.confidence,
        sourceSignals: suggestion.sourceSignals,
        rationale: suggestion.rationale,
        suggestedValue: {
          label: suggestion.label,
          nextAction: suggestion.nextAction,
        },
        editedValue: decisionStatus === 'edited'
          ? {
              label: editedLabel,
              originalLabel: suggestion.label,
            }
          : undefined,
        metadata: {
          actionTarget: suggestion.actionTarget || 'metadata_review',
          remediationIssue: suggestion.remediationIssue,
          editedValueSource: decisionStatus === 'edited' ? 'review_input' : undefined,
          source: 'MetadataIntelligenceDashboard',
        },
      });
      applyLocalSuggestionDecision(suggestion, decisionStatus, previousStatus);
      if (!options.quiet) toast.success(`Metadata suggestion ${decisionStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to record metadata decision');
      throw error;
    } finally {
      if (manageSavingState) setSavingSuggestionId(null);
    }
  };

  const recordBulkSuggestionDecision = async (decisionStatus: MetadataDecisionStatus) => {
    const pendingSuggestions = metadataSuggestions.filter((suggestion) => (
      suggestionDecisions[suggestion.id] !== decisionStatus
      && (decisionStatus !== 'edited' || getEditedSuggestionValue(suggestion))
    ));
    if (pendingSuggestions.length === 0) {
      toast.message(decisionStatus === 'edited'
        ? 'Add edited values before bulk marking edited'
        : 'No suggestions need that decision');
      return;
    }

    try {
      setSavingSuggestionId('bulk');
      for (const suggestion of pendingSuggestions) {
        const editedLabel = getEditedSuggestionValue(suggestion);
        await recordSuggestionDecision(suggestion, decisionStatus, {
          quiet: true,
          editedValue: decisionStatus === 'edited'
            ? {
                label: editedLabel,
                originalLabel: suggestion.label,
              }
            : undefined,
        });
      }
      toast.success(`${pendingSuggestions.length} suggestion${pendingSuggestions.length === 1 ? '' : 's'} marked ${decisionStatus}`);
    } catch {
      // Individual errors are already surfaced by recordSuggestionDecision.
    } finally {
      setSavingSuggestionId(null);
    }
  };

  const getOpportunityIssue = (title: string) => {
    const normalized = title.toLowerCase();
    if (normalized.includes('owner')) return 'missing_owner';
    if (normalized.includes('stale')) return 'stale';
    if (normalized.includes('external')) return 'external_share';
    if (normalized.includes('risk')) return 'high_risk';
    return null;
  };

  const handleOpportunityReview = (opp: ImprovementOpportunity) => {
    const issue = getOpportunityIssue(opp.title);
    if (issue) {
      openRemediation(issue);
      return;
    }

    openMetadataSuggestions();
  };

  const hasLiveData = sourceQuality.totalFiles > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto"
    >
      <div className="space-y-6 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-xl bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px]
                border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
                flex items-center justify-center"
            >
              <Brain className="w-6 h-6 text-[#00F0FF]" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white font-['Inter']">Metadata Quality</h1>
                {isDemoMode && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-[#F39C12]/20 text-[#F39C12] border border-[#F39C12]/30"
                  >
                    Demo Mode
                  </motion.span>
                )}
              </div>
              <p className="text-sm text-[#A0A8B8]">Metadata quality and AI readiness analytics</p>
              <p className={`mt-2 w-fit rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                isDemoMode
                  ? 'border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              }`}>
                Data source: {isDemoMode ? 'Demo fixtures' : 'Live tenant'}
              </p>
              {isDemoMode && (
                <p className="text-xs text-[#6B7280] mt-1">
                  Showing optimized fixture data for demo walkthroughs
                </p>
              )}
              {!isDemoMode && error && (
                <p className="text-xs text-[#FF5733] mt-1">
                  Live metrics unavailable: {error}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px]
                border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
                hover:border-white/20 transition-all duration-200 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openMetadataSuggestions}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#9B59B6]
                hover:opacity-90 transition-all duration-200 text-white font-medium flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Review Suggestions
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#00F0FF]/30 border-t-[#00F0FF] rounded-full animate-spin"></div>
              <span className="text-[#A0A8B8]">Loading intelligence metrics...</span>
            </div>
          </motion.div>
        )}

        {!isLoading && (
          <>
            {!isDemoMode && error && (
              <div className="rounded-xl border border-[#FF5733]/30 bg-[#FF5733]/10 p-5 text-sm text-[#FFB4A3]">
                Live Mode is active, so sample metrics are hidden. Run Microsoft Discovery from Admin or
                check the intelligence metrics API before expecting this screen to populate.
              </div>
            )}

            {/* Intelligence Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
            rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold text-white">AI Readiness Score</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  intelligenceScore >= 80 ? 'bg-[#00F0FF]/20 text-[#00F0FF]' :
                  intelligenceScore >= 60 ? 'bg-[#F39C12]/20 text-[#F39C12]' :
                  'bg-[#FF5733]/20 text-[#FF5733]'
                }`}>
                  {getScoreLabel(intelligenceScore)}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                {isDemoMode || hasLiveData
                  ? 'Metadata, ownership, freshness, exposure, and Aethos-side enrichment signals combined for AI readiness.'
                  : 'Run live discovery to calculate tenant-specific metadata quality'}
              </p>
              <div className="flex items-end gap-4">
                <div className={`text-6xl font-bold ${getScoreColor(intelligenceScore)}`}>
                  {intelligenceScore}
                  <span className="text-2xl">/100</span>
                </div>
                <div className="flex items-center gap-2 text-[#00F0FF] mb-2">
                  <Info className="w-5 h-5" />
                  <span className="text-sm font-medium">Aethos-side only</span>
                </div>
              </div>
            </div>
            
            {/* Progress Ring Visual */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${intelligenceScore * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#9B59B6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#00F0FF]" />
              </div>
            </div>
          </div>

          {/* Horizontal progress bar */}
          <div className="mt-6 h-3 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] transition-all duration-1000 rounded-full"
              style={{ width: `${intelligenceScore}%` }}
            />
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              ['Source Metadata', sourceMetadataScore, 'Filename, owner, freshness, exposure, and current discoverability.'],
              ['Aethos Enrichment', aethosEnrichmentScore, 'Aethos-side tags, categories, and intelligence fields.'],
            ].map(([label, score, detail]) => (
              <div key={label as string} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label as string}</p>
                  <p className="text-lg font-black text-white">{score as number}/100</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{detail as string}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/10 p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">V1 Claim Boundary</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Aethos identifies metadata and ownership gaps that can weaken Microsoft 365 search and Copilot readiness.
              Source-system writeback remains explicit, reviewed, and outside the default V1 flow.
            </p>
          </div>
          </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex gap-2 p-1 bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px]
            border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
            w-fit"
        >
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              selectedView === 'overview'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('categories')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              selectedView === 'categories'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setSelectedView('opportunities')}
            className={`px-6 py-2 rounded-md transition-all font-medium ${
              selectedView === 'opportunities'
                ? 'bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Opportunities
          </button>
          </motion.div>
        {selectedView === 'overview' && (
          <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
              rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                  AI Readiness Blockers
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">What Native AI Will Struggle With</h3>
              </div>
              <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                isDemoMode
                  ? 'border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              }`}>
                Data source: {isDemoMode ? 'Demo fixtures' : 'Live tenant'}
              </span>
            </div>

            {aiReadinessBlockers.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                {aiReadinessBlockers.map((blocker) => (
                  <div key={blocker.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-widest ${
                        blocker.severity === 'high'
                          ? 'bg-[#FF5733]/10 text-[#FF5733]'
                          : blocker.severity === 'medium'
                          ? 'bg-[#F39C12]/10 text-[#F39C12]'
                          : 'bg-[#10B981]/10 text-[#10B981]'
                      }`}>
                        {blocker.severity}
                      </span>
                      <span className="text-lg font-black text-white">{blocker.count.toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-black text-white">{blocker.label}</p>
                    <p className="mt-2 text-[11px] leading-5 text-slate-500">{blocker.recommendation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                Run Discovery to calculate tenant-specific AI readiness blockers.
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Metadata Quality */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
                rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Source Metadata Quality</h3>
                <div className="w-8 h-8 rounded-lg bg-[#FF5733]/20 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-[#FF5733]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Files with descriptions</span>
                    <span className="text-white font-medium">
                  {getPercentage(sourceQuality.filesWithDescriptions, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5733] rounded-full"
                      style={{ width: `${getPercentage(sourceQuality.filesWithDescriptions, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Files with tags/categories</span>
                    <span className="text-white font-medium">
                  {getPercentage(sourceQuality.filesWithTags, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5733] rounded-full"
                      style={{ width: `${getPercentage(sourceQuality.filesWithTags, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Files with meaningful names</span>
                    <span className="text-white font-medium">
                  {getPercentage(sourceQuality.filesWithMeaningfulNames, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5733] rounded-full"
                      style={{ width: `${getPercentage(sourceQuality.filesWithMeaningfulNames, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Average name length</span>
                    <span className="text-white font-medium">{sourceQuality.avgNameLength} chars</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#FF5733]/10 rounded-lg border border-[#FF5733]/30">
                <p className="text-sm text-[#FF5733] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {isDemoMode || hasLiveData
                    ? 'Without Aethos, many files are hard to discover'
                    : 'Live tenant metadata quality has not been calculated yet'}
                </p>
              </div>
            </motion.div>

            {/* Aethos Enrichment Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
                rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Aethos Enrichment Impact</h3>
                <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#00F0FF]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Files auto-categorized</span>
                    <span className="text-white font-medium">
                  {getPercentage(enrichmentStatus.filesCategorized, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${getPercentage(enrichmentStatus.filesCategorized, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Departments inferred</span>
                    <span className="text-white font-medium">
                  {getPercentage(enrichmentStatus.departmentsInferred, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${getPercentage(enrichmentStatus.departmentsInferred, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Keywords generated</span>
                    <span className="text-white font-medium">
                  {getPercentage(enrichmentStatus.keywordsGenerated, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${getPercentage(enrichmentStatus.keywordsGenerated, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Time periods extracted</span>
                    <span className="text-white font-medium">
                  {getPercentage(enrichmentStatus.timePeriodsExtracted, sourceQuality.totalFiles)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${getPercentage(enrichmentStatus.timePeriodsExtracted, sourceQuality.totalFiles)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Avg confidence score</span>
                    <span className="text-white font-medium">{enrichmentStatus.avgConfidenceScore.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#00F0FF]/10 rounded-lg border border-[#00F0FF]/30">
                <p className="text-sm text-[#00F0FF] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Aethos made {enrichmentStatus.filesNowDiscoverable.toLocaleString()} files discoverable
                </p>
              </div>
            </motion.div>
          </div>
          </div>
        )}

        {selectedView === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
              rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
              <button className="text-sm text-[#00F0FF] hover:underline flex items-center gap-1">
                <Info className="w-4 h-4" />
                How categories are determined
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category List */}
              <div className="space-y-3">
                {categories.map((cat, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-white font-medium">{cat.category}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{cat.count.toLocaleString()} files</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${cat.percentage}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                      <span className="text-sm text-slate-400 w-12 text-right">{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Chart */}
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {categories.map((cat, index) => {
                      const previousPercentage = categories
                        .slice(0, index)
                        .reduce((sum, c) => sum + c.percentage, 0);
                      const circumference = 2 * Math.PI * 35;
                      const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -((previousPercentage / 100) * circumference);

                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r="35"
                          fill="none"
                          stroke={cat.color}
                          strokeWidth="12"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-white">{sourceQuality.totalFiles.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">Total Files</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#F39C12]/10 rounded-lg border border-[#F39C12]/30">
              <p className="text-sm text-[#F39C12] flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {categories.find(c => c.category === 'Uncategorized')?.count.toLocaleString()} files remain uncategorized - 
                enable Content Reading for better results
              </p>
            </div>
          </motion.div>
        )}

        {selectedView === 'opportunities' && (
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
                rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]"
            >
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                    Metadata Suggestions
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">Review-First, Aethos-Side Suggestions</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    These suggestions use filename, path, owner, extension, and activity metadata. They do not read file bodies and do not write back to Microsoft 365.
                  </p>
                </div>
                <span className={`w-fit rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                  isDemoMode
                    ? 'border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#F59E0B]'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                }`}>
                  Data source: {isDemoMode ? 'Demo fixtures' : 'Live tenant'}
                </span>
              </div>

              {metadataSuggestions.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Bulk Review</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Apply one lifecycle decision to all visible metadata suggestions.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
                      {([
                        ['accepted', 'Accept All'],
                        ['edited', 'Mark Edited'],
                        ['rejected', 'Reject All'],
                        ['blocked', 'Block All'],
                      ] as [MetadataDecisionStatus, string][]).map(([status, label]) => {
                        const pendingCount = metadataSuggestions.filter(
                          (suggestion) => suggestionDecisions[suggestion.id] !== status
                        ).length;
                        const isSaving = savingSuggestionId === 'bulk';
                        return (
                          <button
                            key={status}
                            type="button"
                            disabled={isSaving || pendingCount === 0}
                            onClick={() => void recordBulkSuggestionDecision(status)}
                            className={`min-h-[40px] rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-widest transition ${
                              pendingCount === 0
                                ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600'
                                : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-[#00F0FF]/30 hover:text-[#00F0FF]'
                            } ${isSaving ? 'cursor-wait opacity-60' : ''}`}
                          >
                            {isSaving ? 'Saving' : label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
                    {[
                      ['Decisions', metadataDecisionSummary.totalDecisions],
                      ['Accepted', metadataDecisionSummary.accepted],
                      ['Edited', metadataDecisionSummary.edited],
                      ['Rejected', metadataDecisionSummary.rejected],
                      ['Blocked', metadataDecisionSummary.blocked],
                      ['Files Improved', metadataDecisionSummary.acceptedAffectedFiles],
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label as string}</p>
                        <p className="mt-2 text-xl font-black text-white">{(value as number).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/10 p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">Accepted Metadata Impact</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Accepted or edited suggestions can seed Aethos-side workspace review and search context. Microsoft 365 writeback remains explicit and outside the default V1.5 flow.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {metadataSuggestions.map((suggestion) => (
                      <div key={suggestion.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[#00F0FF]/20 bg-[#00F0FF]/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#00F0FF]">
                          {suggestion.type}
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                          {suggestion.confidence} confidence
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-base font-black text-white">{suggestion.label}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{suggestion.rationale}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">{suggestion.count.toLocaleString()}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">files</p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {suggestion.sourceSignals.map((signal) => (
                          <span key={signal} className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                            {signal}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleSuggestionAction(suggestion)}
                          className="min-h-[40px] rounded-xl bg-white px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#0B0F19] transition hover:bg-[#00F0FF]"
                        >
                          {suggestion.nextAction}
                        </button>
                        <span className="text-[10px] leading-5 text-slate-500">
                          {suggestionDecisions[suggestion.id]
                            ? `Decision recorded: ${suggestionDecisions[suggestion.id]}.`
                            : 'Pending lifecycle: accept, edit, reject, or block.'}
                        </span>
                      </div>
                      <div className="mt-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500" htmlFor={`edited-value-${suggestion.id}`}>
                          Edited Value
                        </label>
                        <input
                          id={`edited-value-${suggestion.id}`}
                          type="text"
                          value={editedSuggestionValues[suggestion.id] || ''}
                          onChange={(event) => setEditedSuggestionValues((current) => ({
                            ...current,
                            [suggestion.id]: event.target.value,
                          }))}
                          placeholder={suggestion.label}
                          className="mt-2 min-h-[40px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00F0FF]/40"
                        />
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(['accepted', 'edited', 'rejected', 'blocked'] as MetadataDecisionStatus[]).map((status) => {
                          const selected = suggestionDecisions[suggestion.id] === status;
                          const isSaving = savingSuggestionId === suggestion.id;
                          const needsEditedValue = status === 'edited' && !getEditedSuggestionValue(suggestion);
                          return (
                            <button
                              key={status}
                              type="button"
                              disabled={isSaving || needsEditedValue}
                              onClick={() => void recordSuggestionDecision(suggestion, status)}
                              className={`min-h-[34px] rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-widest transition ${
                                selected
                                  ? 'border-[#00F0FF]/40 bg-[#00F0FF]/15 text-[#00F0FF]'
                                  : needsEditedValue
                                    ? 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-700'
                                    : 'border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/20 hover:text-white'
                              } ${isSaving ? 'cursor-wait opacity-60' : ''}`}
                            >
                              {isSaving ? 'Saving' : status}
                            </button>
                          );
                        })}
                      </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  Run Discovery to produce conservative metadata suggestions.
                </div>
              )}
            </motion.div>

            {opportunities.map((opp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`bg-[rgba(20,24,36,0.7)] backdrop-blur-[20px] border border-white/10
                  rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]
                  border-l-4 ${getPriorityColor(opp.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        opp.priority === 'high' ? 'bg-[#FF5733]/20' :
                        opp.priority === 'medium' ? 'bg-[#F39C12]/20' :
                        'bg-[#00F0FF]/20'
                      }`}>
                        {opp.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{opp.title}</h3>
                        <p className="text-sm text-slate-400">{opp.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-white">{opp.count.toLocaleString()}</div>
                        <div className="text-sm text-slate-400">files affected</div>
                      </div>
                      <div className="h-8 w-px bg-white/10" />
                      <div className="text-sm text-slate-400">{opp.action}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpportunityReview(opp)}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10
                      hover:bg-white/10 transition-all text-white text-sm font-medium"
                    >
                      Review Files
                    </button>
                    {opp.priority === 'high' && (
                      <button
                        onClick={() => handleOpportunityReview(opp)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#9B59B6]
                        hover:opacity-90 transition-all text-white text-sm font-medium flex items-center gap-2"
                      >
                        Review Driver
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-[rgba(20,24,36,0.8)] backdrop-blur-[24px] border border-white/20
                rounded-xl p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Want Better Results?</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Start with reviewed Aethos-side metadata suggestions. Content-aware enrichment remains an explicit AI+ step after V1 metadata review is working.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Review suggestions</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Approve tags</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Improve workspaces</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={openMetadataSuggestions}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#9B59B6]
                  hover:opacity-90 transition-all text-white font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  Review Suggestions
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </>
        )}
      </div>
    </motion.div>
  );
};
