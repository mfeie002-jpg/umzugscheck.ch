# One Repo Guidelines

This repository is the single source of truth for **umzugscheck.ch**.  
All future development should happen here.  

## Contributing
- Do not import or merge entire ZIP archives directly.  
- New features belong in `src/funnels`, `src/admin`, `src/canton` or `src/experiments` depending on their purpose.  
- Content and SEO pages belong in `src/canton` or `public/landing`.
- Old or experimental code must be stored under `src/archive` or `_alternatives`.
- Documentation belongs in `docs/`.

## Running the Project
Run `npm install` followed by `npm run dev` in the project root.
