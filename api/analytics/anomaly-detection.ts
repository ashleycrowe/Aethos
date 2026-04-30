/**
 * Anomaly Detection API - V3 Feature
 * 
 * PURPOSE: Detect unusual activity patterns and predict security risks
 * DETECTION: Unusual sharing, storage spikes, access anomalies
 * ALGORITHM: Statistical analysis + pattern matching
 * 
 * WORKFLOW:
 * 1. Establish baseline activity patterns
 * 2. Monitor for deviations from baseline
 * 3. Flag anomalies with risk scores
 * 4. Generate predictive alerts
 */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface AnomalyDetectionResult {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFiles: string[];
  riskScore: number;
  recommendation: string;
}

// Calculate storage growth rate
async function detectStorageAnomalies(tenantId: string): Promise<AnomalyDetectionResult[]> {
  const anomalies: AnomalyDetectionResult[] = [];

  // Get storage snapshots from last 30 days
  const { data: snapshots } = await supabase
    .from('storage_snapshots')
    .select('*')
    .eq('tenant_id', tenantId)
    .gte('snapshot_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('snapshot_date', { ascending: true });

  if (!snapshots || snapshots.length < 7) {
    return anomalies; // Not enough data
  }

  // Calculate daily growth rates
  const growthRates: number[] = [];
  for (let i = 1; i < snapshots.length; i++) {
    const growth = snapshots[i].total_bytes - snapshots[i - 1].total_bytes;
    const growthRate = (growth / snapshots[i - 1].total_bytes) * 100;
    growthRates.push(growthRate);
  }

  // Calculate mean and standard deviation
  const mean = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const variance = growthRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / growthRates.length;
  const stdDev = Math.sqrt(variance);

  // Detect spike (> 2 standard deviations from mean)
  const latestGrowth = growthRates[growthRates.length - 1];
  if (latestGrowth > mean + 2 * stdDev) {
    anomalies.push({
      type: 'storage_spike',
      severity: latestGrowth > mean + 3 * stdDev ? 'critical' : 'high',
      description: `Unusual storage growth detected: ${latestGrowth.toFixed(2)}% increase (normal: ${mean.toFixed(2)}%)`,
      affectedFiles: [],
      riskScore: Math.min(100, Math.round((latestGrowth / mean) * 30)),
      recommendation: 'Review recently added large files and consider archiving unused content',
    });
  }

  return anomalies;
}

// Detect unusual sharing patterns
async function detectSharingAnomalies(tenantId: string): Promise<AnomalyDetectionResult[]> {
  const anomalies: AnomalyDetectionResult[] = [];

  // Get files with external shares created in last 7 days
  const { data: recentShares } = await supabase
    .from('files')
    .select('id, name, owner_email, created_at, metadata')
    .eq('tenant_id', tenantId)
    .eq('has_external_share', true)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  if (!recentShares || recentShares.length === 0) {
    return anomalies;
  }

  // Group by owner
  const sharesByOwner: Record<string, number> = {};
  recentShares.forEach((file) => {
    const owner = file.owner_email || 'unknown';
    sharesByOwner[owner] = (sharesByOwner[owner] || 0) + 1;
  });

  // Detect users with unusually high share activity
  const avgSharesPerUser = Object.values(sharesByOwner).reduce((sum, count) => sum + count, 0) / Object.keys(sharesByOwner).length;

  for (const [owner, shareCount] of Object.entries(sharesByOwner)) {
    if (shareCount > avgSharesPerUser * 3) {
      // 3x average is anomalous
      const affectedFiles = recentShares.filter((a) => (a.owner_email || 'unknown') === owner).map((a) => a.id);

      anomalies.push({
        type: 'unusual_sharing_activity',
        severity: shareCount > avgSharesPerUser * 5 ? 'high' : 'medium',
        description: `User ${owner} has shared ${shareCount} files externally in the past 7 days (avg: ${avgSharesPerUser.toFixed(1)})`,
        affectedFiles,
        riskScore: Math.min(100, Math.round((shareCount / avgSharesPerUser) * 20)),
        recommendation: 'Review external sharing permissions and verify if activity is legitimate',
      });
    }
  }

  return anomalies;
}

// Detect drift (content moving outside operational anchors)
async function detectDriftAnomalies(tenantId: string): Promise<AnomalyDetectionResult[]> {
  const anomalies: AnomalyDetectionResult[] = [];

  // Get files not in any workspace
  const { data: orphanedFiles } = await supabase.rpc('find_orphaned_files', {
    tenant_id_param: tenantId,
  });

  if (orphanedFiles && orphanedFiles.length > 100) {
    anomalies.push({
      type: 'organizational_drift',
      severity: orphanedFiles.length > 500 ? 'high' : 'medium',
      description: `${orphanedFiles.length} files are not organized in any workspace`,
      affectedFiles: orphanedFiles.slice(0, 100).map((a: any) => a.id),
      riskScore: Math.min(100, Math.round(orphanedFiles.length / 10)),
      recommendation: 'Create workspaces and use tag-based sync rules to organize content',
    });
  }

  return anomalies;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'Missing tenantId' });
    }

    // Run all anomaly detection algorithms
    const [storageAnomalies, sharingAnomalies, driftAnomalies] = await Promise.all([
      detectStorageAnomalies(tenantId),
      detectSharingAnomalies(tenantId),
      detectDriftAnomalies(tenantId),
    ]);

    const allAnomalies = [...storageAnomalies, ...sharingAnomalies, ...driftAnomalies];

    // Sort by severity and risk score
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    allAnomalies.sort((a, b) => {
      if (a.severity !== b.severity) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return b.riskScore - a.riskScore;
    });

    // Store anomalies in database
    for (const anomaly of allAnomalies) {
      await supabase.from('anomaly_detections').insert({
        tenant_id: tenantId,
        anomaly_type: anomaly.type,
        severity: anomaly.severity,
        description: anomaly.description,
        risk_score: anomaly.riskScore,
        affected_file_ids: anomaly.affectedFiles,
        recommendation: anomaly.recommendation,
        detected_at: new Date().toISOString(),
        status: 'open',
      });
    }

    // Create high-priority notifications for critical/high anomalies
    const criticalAnomalies = allAnomalies.filter((a) => a.severity === 'critical' || a.severity === 'high');

    for (const anomaly of criticalAnomalies) {
      await supabase.from('notifications').insert({
        tenant_id: tenantId,
        type: 'anomaly_alert',
        priority: anomaly.severity === 'critical' ? 'critical' : 'high',
        title: `Anomaly Detected: ${anomaly.type.replace(/_/g, ' ').toUpperCase()}`,
        message: anomaly.description,
        metadata: { recommendation: anomaly.recommendation, riskScore: anomaly.riskScore },
        created_at: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      anomalies: allAnomalies,
      summary: {
        total: allAnomalies.length,
        critical: allAnomalies.filter((a) => a.severity === 'critical').length,
        high: allAnomalies.filter((a) => a.severity === 'high').length,
        medium: allAnomalies.filter((a) => a.severity === 'medium').length,
        low: allAnomalies.filter((a) => a.severity === 'low').length,
      },
    });
  } catch (error: any) {
    console.error('Anomaly detection error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
