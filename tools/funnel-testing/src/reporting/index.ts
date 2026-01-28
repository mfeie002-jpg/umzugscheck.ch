import { RunResult } from '../shared/schemas';
import { createObjectCsvWriter } from 'csv-writer';
import { readJSON, ensureDir, listDir } from '../shared/fs';
import { join } from 'path';

export async function generateSummaryCSV(runsDir: string, outputDir: string) {
  await ensureDir(outputDir);

  const runDirs = await listDir(runsDir);
  const results: RunResult[] = [];

  for (const dir of runDirs) {
    if (dir === '_state') continue;
    try {
      const result = await readJSON<RunResult>(join(runsDir, dir, 'result.json'));
      results.push(result);
    } catch {
      // Skip if no result
    }
  }

  const csvWriter = createObjectCsvWriter({
    path: join(outputDir, 'summary.csv'),
    header: [
      { id: 'run_id', title: 'Run ID' },
      { id: 'gateway_id', title: 'Gateway ID' },
      { id: 'persona_id', title: 'Persona ID' },
      { id: 'policy', title: 'Policy' },
      { id: 'conversionConfidence', title: 'Confidence %' },
      { id: 'verdict', title: 'Verdict' },
      { id: 'stepsCompleted', title: 'Steps' },
      { id: 'dropoffReason', title: 'Dropoff Reason' },
      { id: 'totalTimeMs', title: 'Time (ms)' },
    ],
  });

  const records = results.map((r) => ({
    run_id: r.run_id,
    gateway_id: r.config.gateway.gateway_id,
    persona_id: r.config.persona.persona_id,
    policy: r.config.policy,
    conversionConfidence: r.conversionConfidence,
    verdict: r.verdict,
    stepsCompleted: r.stepsCompleted,
    dropoffReason: r.dropoffReason || '',
    totalTimeMs: r.totalTimeMs,
  }));

  await csvWriter.writeRecords(records);
  console.log(`✓ Summary CSV written to ${join(outputDir, 'summary.csv')}`);
}

export async function generateLeaderboard(runsDir: string, outputDir: string) {
  await ensureDir(outputDir);

  const runDirs = await listDir(runsDir);
  const results: RunResult[] = [];

  for (const dir of runDirs) {
    if (dir === '_state') continue;
    try {
      const result = await readJSON<RunResult>(join(runsDir, dir, 'result.json'));
      results.push(result);
    } catch {
      // Skip
    }
  }

  // Group by gateway
  const byGateway = new Map<string, RunResult[]>();
  for (const r of results) {
    const key = r.config.gateway.gateway_id;
    if (!byGateway.has(key)) byGateway.set(key, []);
    byGateway.get(key)!.push(r);
  }

  // Calculate averages
  const scores = Array.from(byGateway.entries())
    .map(([id, runs]) => ({
      gateway_id: id,
      avgConfidence: runs.reduce((sum, r) => sum + r.conversionConfidence, 0) / runs.length,
      successCount: runs.filter((r) => r.verdict === 'success').length,
      totalRuns: runs.length,
    }))
    .sort((a, b) => b.avgConfidence - a.avgConfidence);

  // Find dropoff reasons
  const dropoffs = new Map<string, number>();
  for (const r of results) {
    if (r.dropoffReason) {
      const key = r.dropoffReason;
      dropoffs.set(key, (dropoffs.get(key) || 0) + 1);
    }
  }

  const markdown = `# Funnel Testing Leaderboard

## Top Performers

| Gateway | Avg Confidence | Success | Total Runs |
|---------|----------------|---------|-----------|
${scores
  .slice(0, 10)
  .map((s) => `| ${s.gateway_id} | ${s.avgConfidence.toFixed(1)}% | ${s.successCount} | ${s.totalRuns} |`)
  .join('\n')}

## Bottom Performers

| Gateway | Avg Confidence | Success | Total Runs |
|---------|----------------|---------|-----------|
${scores
  .slice(-5)
  .map((s) => `| ${s.gateway_id} | ${s.avgConfidence.toFixed(1)}% | ${s.successCount} | ${s.totalRuns} |`)
  .join('\n')}

## Common Dropoff Reasons

| Reason | Count |
|--------|-------|
${Array.from(dropoffs.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([reason, count]) => `| ${reason} | ${count} |`)
  .join('\n')}
`;

  await ensureDir(outputDir);
  const fs = await import('fs/promises');
  await fs.writeFile(join(outputDir, 'leaderboard.md'), markdown);
  console.log(`✓ Leaderboard written to ${join(outputDir, 'leaderboard.md')}`);
}

export async function generateHeatmap(runsDir: string, outputDir: string) {
  await ensureDir(outputDir);

  const runDirs = await listDir(runsDir);
  const results: RunResult[] = [];

  for (const dir of runDirs) {
    if (dir === '_state') continue;
    try {
      const result = await readJSON<RunResult>(join(runsDir, dir, 'result.json'));
      results.push(result);
    } catch {
      // Skip
    }
  }

  const personas = new Set<string>();
  const gateways = new Set<string>();

  for (const r of results) {
    personas.add(r.config.persona.persona_id);
    gateways.add(r.config.gateway.gateway_id);
  }

  const personaArray = Array.from(personas).sort();
  const gatewayArray = Array.from(gateways).sort();

  const heatmap = new Map<string, Map<string, number>>();

  for (const p of personaArray) {
    const row = new Map<string, number>();
    for (const g of gatewayArray) {
      const relevant = results.filter(
        (r) => r.config.persona.persona_id === p && r.config.gateway.gateway_id === g
      );
      const avg =
        relevant.length > 0
          ? relevant.reduce((sum, r) => sum + r.conversionConfidence, 0) / relevant.length
          : 0;
      row.set(g, avg);
    }
    heatmap.set(p, row);
  }

  const csvWriter = createObjectCsvWriter({
    path: join(outputDir, 'persona_gateway_heatmap.csv'),
    header: [
      { id: 'persona_id', title: 'Persona' },
      ...gatewayArray.map((g) => ({ id: g, title: g })),
    ],
  });

  const records = personaArray.map((p) => {
    const row: Record<string, any> = { persona_id: p };
    for (const g of gatewayArray) {
      row[g] = (heatmap.get(p)?.get(g) || 0).toFixed(1);
    }
    return row;
  });

  await csvWriter.writeRecords(records);
  console.log(`✓ Heatmap written to ${join(outputDir, 'persona_gateway_heatmap.csv')}`);
}

export async function generateDropoffCSV(runsDir: string, outputDir: string) {
  await ensureDir(outputDir);

  const runDirs = await listDir(runsDir);
  const results: RunResult[] = [];

  for (const dir of runDirs) {
    if (dir === '_state') continue;
    try {
      const result = await readJSON<RunResult>(join(runsDir, dir, 'result.json'));
      results.push(result);
    } catch {
      // Skip
    }
  }

  const csvWriter = createObjectCsvWriter({
    path: join(outputDir, 'dropoffs.csv'),
    header: [
      { id: 'reason', title: 'Dropoff Reason' },
      { id: 'count', title: 'Count' },
      { id: 'percentage', title: 'Percentage' },
    ],
  });

  const dropoffs = new Map<string, number>();
  for (const r of results) {
    if (r.dropoffReason) {
      dropoffs.set(r.dropoffReason, (dropoffs.get(r.dropoffReason) || 0) + 1);
    }
  }

  const total = results.length;
  const records = Array.from(dropoffs.entries())
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  await csvWriter.writeRecords(records);
  console.log(`✓ Dropoff CSV written to ${join(outputDir, 'dropoffs.csv')}`);
}
