import React, { useState } from 'react';
import { 
  Brain, TrendingUp, AlertCircle, CheckCircle, FileQuestion, 
  FolderOpen, Sparkles, ArrowRight, Download, Settings, Zap, Info
} from 'lucide-react';
import { GlassCard } from './GlassCard';

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

export const MetadataIntelligenceDashboard: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'categories' | 'opportunities'>('overview');

  // Mock data - in production, this would come from API
  const intelligenceScore = 68;
  
  const sourceQuality: MetadataQuality = {
    totalFiles: 4567,
    filesWithDescriptions: 548, // 12%
    filesWithTags: 365, // 8%
    filesWithMeaningfulNames: 502, // 11%
    avgNameLength: 18
  };

  const enrichmentStatus: EnrichmentStatus = {
    filesCategorized: 4293, // 94%
    departmentsInferred: 3973, // 87%
    keywordsGenerated: 4567, // 100%
    timePeriodsExtracted: 3471, // 76%
    avgConfidenceScore: 0.84,
    filesNowDiscoverable: 3456
  };

  const categories: CategoryBreakdown[] = [
    { category: 'Financial Planning', count: 1234, percentage: 31, color: '#00F0FF' },
    { category: 'HR Documents', count: 567, percentage: 14, color: '#FF5733' },
    { category: 'Engineering', count: 432, percentage: 11, color: '#9B59B6' },
    { category: 'Sales', count: 389, percentage: 10, color: '#3498DB' },
    { category: 'Marketing', count: 301, percentage: 8, color: '#E74C3C' },
    { category: 'Operations', count: 245, percentage: 6, color: '#2ECC71' },
    { category: 'Legal', count: 189, percentage: 5, color: '#F39C12' },
    { category: 'Uncategorized', count: 643, percentage: 16, color: '#95A5A6' }
  ];

  const opportunities: ImprovementOpportunity[] = [
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
      case 'high': return 'bg-[#FF5733]/20 border-[#FF5733]/50 text-[#FF5733]';
      case 'medium': return 'bg-[#F39C12]/20 border-[#F39C12]/50 text-[#F39C12]';
      case 'low': return 'bg-[#00F0FF]/20 border-[#00F0FF]/50 text-[#00F0FF]';
      default: return 'bg-slate-500/20 border-slate-500/50 text-slate-400';
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#9B59B6]/20 
              flex items-center justify-center backdrop-blur-xl border border-[#00F0FF]/30">
              <Brain className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Metadata Intelligence</h1>
              <p className="text-sm text-slate-400">AI-powered enrichment & discovery analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 
              hover:bg-white/10 transition-all text-white flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] 
              hover:opacity-90 transition-all text-white font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              AI Settings
            </button>
          </div>
        </div>

        {/* Intelligence Score Card */}
        <GlassCard className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold text-white">Metadata Intelligence Score</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  intelligenceScore >= 80 ? 'bg-[#00F0FF]/20 text-[#00F0FF]' :
                  intelligenceScore >= 60 ? 'bg-[#F39C12]/20 text-[#F39C12]' :
                  'bg-[#FF5733]/20 text-[#FF5733]'
                }`}>
                  {getScoreLabel(intelligenceScore)}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Most files are discoverable - Aethos enrichment is working effectively
              </p>
              <div className="flex items-end gap-4">
                <div className={`text-6xl font-bold ${getScoreColor(intelligenceScore)}`}>
                  {intelligenceScore}
                  <span className="text-2xl">/100</span>
                </div>
                <div className="flex items-center gap-2 text-[#00F0FF] mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium">+12 from last scan</span>
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
        </GlassCard>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/10 w-fit">
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
        </div>

        {/* Content based on selected view */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Metadata Quality */}
            <GlassCard className="p-6">
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
                      {Math.round((sourceQuality.filesWithDescriptions / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5733] rounded-full"
                      style={{ width: `${(sourceQuality.filesWithDescriptions / sourceQuality.totalFiles) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Files with tags/categories</span>
                    <span className="text-white font-medium">
                      {Math.round((sourceQuality.filesWithTags / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5733] rounded-full"
                      style={{ width: `${(sourceQuality.filesWithTags / sourceQuality.totalFiles) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Files with meaningful names</span>
                    <span className="text-white font-medium">
                      {Math.round((sourceQuality.filesWithMeaningfulNames / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF5733] rounded-full"
                      style={{ width: `${(sourceQuality.filesWithMeaningfulNames / sourceQuality.totalFiles) * 100}%` }}
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
                  Without Aethos, 89% of your files are unsearchable
                </p>
              </div>
            </GlassCard>

            {/* Aethos Enrichment Status */}
            <GlassCard className="p-6">
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
                      {Math.round((enrichmentStatus.filesCategorized / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${(enrichmentStatus.filesCategorized / sourceQuality.totalFiles) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Departments inferred</span>
                    <span className="text-white font-medium">
                      {Math.round((enrichmentStatus.departmentsInferred / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${(enrichmentStatus.departmentsInferred / sourceQuality.totalFiles) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Keywords generated</span>
                    <span className="text-white font-medium">
                      {Math.round((enrichmentStatus.keywordsGenerated / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${(enrichmentStatus.keywordsGenerated / sourceQuality.totalFiles) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Time periods extracted</span>
                    <span className="text-white font-medium">
                      {Math.round((enrichmentStatus.timePeriodsExtracted / sourceQuality.totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] rounded-full"
                      style={{ width: `${(enrichmentStatus.timePeriodsExtracted / sourceQuality.totalFiles) * 100}%` }}
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
            </GlassCard>
          </div>
        )}

        {selectedView === 'categories' && (
          <GlassCard className="p-6">
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
          </GlassCard>
        )}

        {selectedView === 'opportunities' && (
          <div className="space-y-4">
            {opportunities.map((opp, index) => (
              <GlassCard 
                key={index}
                className={`p-6 border-l-4 ${getPriorityColor(opp.priority)}`}
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
                    <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 
                      hover:bg-white/10 transition-all text-white text-sm font-medium">
                      Review Files
                    </button>
                    {opp.priority === 'high' && (
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] 
                        hover:opacity-90 transition-all text-white text-sm font-medium flex items-center gap-2">
                        Enable AI+
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}

            {/* Summary Card */}
            <GlassCard className="p-6 bg-gradient-to-br from-[#00F0FF]/10 to-[#9B59B6]/10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Want Better Results?</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Enable Content Oracle to read file contents and improve categorization accuracy from 68% to 95%+
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Semantic search</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Document summaries</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00F0FF]">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Topic extraction</span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#9B59B6] 
                  hover:opacity-90 transition-all text-white font-medium flex items-center gap-2 whitespace-nowrap">
                  Enable Content Oracle
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};