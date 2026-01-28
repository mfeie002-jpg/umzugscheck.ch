import { generateSummaryCSV, generateLeaderboard, generateHeatmap, generateDropoffCSV } from '../reporting';

async function main() {
  console.log('📊 Generating reports...\n');

  await generateSummaryCSV('./runs', './reports');
  await generateLeaderboard('./runs', './reports');
  await generateHeatmap('./runs', './reports');
  await generateDropoffCSV('./runs', './reports');

  console.log('\n✅ All reports generated in ./reports/');
}

main().catch(console.error);
