/**
 * Aethos Document Control - Home/Dashboard Page
 * 
 * Main landing page for Document Control module
 */

import React from 'react';
import { Plus, Library, FileCheck, Shield, Activity } from 'lucide-react';
import { DocumentLibraryGrid, DocumentHealthDashboard } from '../components';
import { DocumentCard } from '../components/DocumentCard';
import { useDocumentControl } from '../context/DocumentControlContext';

type ViewMode = 'libraries' | 'documents' | 'analytics';

export const DocumentControlHome: React.FC = () => {
  const { libraries, documents, isDemoMode } = useDocumentControl();
  const [viewMode, setViewMode] = React.useState<ViewMode>('libraries');

  const stats = {
    libraries: libraries.length,
    documents: documents.length,
    published: documents.filter(d => d.status === 'published').length,
    avgHealthScore: Math.round(
      documents.reduce((sum, doc) => sum + doc.healthScore, 0) / documents.length || 0
    ),
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] p-8">
      {/* Page Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              📋 Document Control System
            </h1>
            <p className="text-white/60">
              Manage controlled documents with full compliance tracking
            </p>
            {isDemoMode && (
              <div className="mt-2 inline-flex items-center gap-2 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 rounded-lg px-3 py-1 text-xs font-bold uppercase">
                <Activity className="w-3.5 h-3.5" />
                Demo Mode Active
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00F0FF]/50 transition-all">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
              <Library className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div className="text-3xl font-black text-white">{stats.libraries}</div>
          </div>
          <div className="text-sm text-white/60">Document Libraries</div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#00F0FF]/50 transition-all">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.documents}</div>
          </div>
          <div className="text-sm text-white/60">Total Documents</div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats.published}</div>
          </div>
          <div className="text-sm text-white/60">Published</div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#00F0FF]" />
            </div>
            <div className="text-3xl font-black text-[#00F0FF]">{stats.avgHealthScore}%</div>
          </div>
          <div className="text-sm text-white/60">Avg Health Score</div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setViewMode('libraries')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
            viewMode === 'libraries'
              ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          <Library className="w-5 h-5" />
          Libraries
        </button>
        <button
          onClick={() => setViewMode('documents')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
            viewMode === 'documents'
              ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          <FileCheck className="w-5 h-5" />
          All Documents ({documents.length})
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all ${
            viewMode === 'analytics'
              ? 'bg-[#00F0FF] text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
          }`}
        >
          <Activity className="w-5 h-5" />
          Analytics
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {viewMode === 'libraries' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Document Libraries</h2>
            </div>
            <DocumentLibraryGrid />
          </section>
        )}

        {viewMode === 'documents' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">All Documents</h2>
              <p className="text-white/60 text-sm">
                Showing {documents.length} documents across {libraries.length} libraries
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          </section>
        )}

        {viewMode === 'analytics' && (
          <section>
            <h2 className="text-2xl font-black text-white mb-6">Health Analytics</h2>
            <DocumentHealthDashboard />
          </section>
        )}
      </div>
    </div>
  );
};