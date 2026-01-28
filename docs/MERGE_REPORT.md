# Merge Report

This repository consolidates all relevant repositories and content into a single source of truth.  

## Base Repository
The live production repository (mfeie002-jpg/umzugscheck.ch) serves as the base.  

## Added Systems
- Programmatic SEO / Canton engine (`src/canton`).
- Modern funnel architecture (`src/funnels`).
- Administrative tools (`src/admin`).
- Experiments and variant components (`src/experiments`).
- Legacy code and archives (`src/archive`).

## Conflict Handling
If a file from another repository conflicted with the base, the base version was kept. The conflicting version is stored in `_alternatives/<source_repo>/<original_path>`.

## Missing Artifacts
Some uploaded ZIPs containing flows and landing pages were not available in this environment. Placeholder directories have been created for these assets (`src/experiments` and `src/canton`).
