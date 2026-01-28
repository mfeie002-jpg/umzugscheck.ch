import fs from 'fs-extra';
import path from 'path';
import { RunResult, Gateway, Persona } from '../shared/types';
import { toCsv } from '../shared/csv';

interface ReportInputs {
  runsDir: string;
  reportsDir: string;
  gateways: Gateway[];
  personas: Persona[];
}

export const generateReports = (inputs: ReportInputs): void => {
  const { runsDir, reportsDir, gateways, personas } = inputs;
  fs.ensureDirSync(reportsDir);

  const results: RunResult[] = [];
  const runDirs = fs.readdirSync(runsDir).filter((dir) => !dir.startsWith('_'));

  for (const run of runDirs) {
    const resultPath = path.join(runsDir, run, 'result.json');
    if (fs.existsSync(resultPath)) {
      results.push(fs.readJSONSync(resultPath));
    }
  }

  const summaryRows = results.map((r) => ({
    run_id: r.run_id,
    gateway_id: r.config.gateway.gateway_id,
    persona_id: r.config.persona.persona_id,
    policy: r.config.policy,
    verdict: r.verdict,
    intent_match: r.scores.intent_match,
    trust: r.scores.trust,
    friction: r.scores.friction,
    clarity: r.scores.clarity,
    mobile_usability: r.scores.mobile_usability,
    conversion_confidence: r.scores.conversion_confidence,
    marketing_fit: r.scores.marketing_fit,
    steps: r.steps.length,
    dropoff_reason: r.dropoff_reason || '',
    missing_offers: r.marketing.missing_offers.join('|'),
    unexpected_offers: r.marketing.unexpected_offers.join('|')
  }));

  fs.writeFileSync(path.join(reportsDir, 'summary.csv'), toCsv(summaryRows));

  const dropoffCounts: Record<string, number> = {};
  for (const r of results) {
    if (!r.dropoff_reason) continue;
    dropoffCounts[r.dropoff_reason] = (dropoffCounts[r.dropoff_reason] || 0) + 1;
  }
  const dropoffRows = Object.entries(dropoffCounts).map(([reason, count]) => ({
    reason,
    count
  }));
  fs.writeFileSync(path.join(reportsDir, 'dropoffs.csv'), toCsv(dropoffRows));

  const gatewayScores: Record<string, { total: number; count: number }> = {};
  for (const r of results) {
    const id = r.config.gateway.gateway_id;
    if (!gatewayScores[id]) gatewayScores[id] = { total: 0, count: 0 };
    gatewayScores[id].total += r.scores.conversion_confidence;
    gatewayScores[id].count += 1;
  }

  const gatewayAverages = Object.entries(gatewayScores)
    .map(([id, stats]) => ({
      gateway_id: id,
      average: stats.total / Math.max(1, stats.count)
    }))
    .sort((a, b) => b.average - a.average);

  const top = gatewayAverages.slice(0, 5);
  const bottom = gatewayAverages.slice(-5).reverse();

  const leaderboardLines = [
    '# Funnel Tester Leaderboard',
    '',
    '## Top Gateways',
    ...top.map((row) => `- ${row.gateway_id}: ${row.average.toFixed(2)}`),
    '',
    '## Bottom Gateways',
    ...bottom.map((row) => `- ${row.gateway_id}: ${row.average.toFixed(2)}`),
    '',
    '## Common Dropoffs',
    ...dropoffRows.slice(0, 5).map((row) => `- ${row.reason}: ${row.count}`),
    ''
  ];

  fs.writeFileSync(path.join(reportsDir, 'leaderboard.md'), leaderboardLines.join('\n'));

  const heatmapHeader = ['persona_id', ...gateways.map((g) => g.gateway_id)];
  const heatmapRows: string[] = [heatmapHeader.join(',')];

  for (const persona of personas) {
    const row: string[] = [persona.persona_id];
    for (const gateway of gateways) {
      const relevant = results.filter(
        (r) => r.config.persona.persona_id === persona.persona_id && r.config.gateway.gateway_id === gateway.gateway_id
      );
      if (relevant.length === 0) {
        row.push('');
        continue;
      }
      const avg = relevant.reduce((sum, r) => sum + r.scores.conversion_confidence, 0) / relevant.length;
      row.push(avg.toFixed(2));
    }
    heatmapRows.push(row.join(','));
  }

  fs.writeFileSync(path.join(reportsDir, 'persona_gateway_heatmap.csv'), heatmapRows.join('\n'));
};
