#!/usr/bin/env bash
# Parallel test runner for funnel testing tool

set -e

# Configuration
CONCURRENT_RUNS=${1:-4}  # Default to 4 parallel runs
TOTAL_RUNS=${2:-20}      # Default to 20 total runs
SEED=${3:-$(date +%s)}   # Use timestamp as seed if not provided

echo "🚀 Parallel Funnel Test Execution"
echo "   Concurrent: $CONCURRENT_RUNS"
echo "   Total Runs: $TOTAL_RUNS"
echo "   Seed: $SEED"
echo ""

# Generate all run configs
echo "📋 Generating $TOTAL_RUNS run configurations..."
for i in $(seq 1 $TOTAL_RUNS); do
  npm run dispatch -- --seed "${SEED}_$i" > /dev/null 2>&1
done

# Get list of all run IDs
RUN_IDS=$(find runs -maxdepth 1 -type d -name 'run_*' | xargs -n 1 basename)

# Execute runs in parallel
echo "🏃 Executing runs ($CONCURRENT_RUNS at a time)..."
echo "$RUN_IDS" | xargs -P $CONCURRENT_RUNS -I {} npm run run -- --run_id {}

# Generate reports
echo "📊 Generating aggregated reports..."
npm run report

echo "✅ Parallel execution complete!"
echo "   Results: ./reports/"
