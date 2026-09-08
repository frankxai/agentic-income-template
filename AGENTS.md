# AgenticIncomeTemplate Agent Contract

## Scope

- Public, free, MIT-licensed clone-and-deploy starter (not a live commercial site itself).
- Genericized shell behind the `agentic-income` network of comparison sites — see `README.md` for the clone/brand/deploy flow.
- The only brand-specific file a clone should touch first is `lib/site.ts`.
- This repo has no checkout, no customer data, and no production deployment of its own; changes here affect every future clone, so keep them generic.

## Before Editing

1. Read `CLAUDE.md` (web-excellence gate) before touching anything under `app/`, `components/`, or other UI paths.
2. Preserve the honest-comparison post shape described in `README.md` (answer box → sortable table → honest pick → FAQ + FAQPage JSON-LD → one disclosure) and the `lib/affiliate.ts` contract: a real link when a program is joined, plain text when it isn't — never a dead link.
3. Preserve unrelated work and use an isolated branch/worktree.

## Public Language

- Keep example/starter content clearly generic — no invented brand, revenue, or traffic claims.
- Do not hardcode a specific affiliate program's terms as if verified; `data/programs.json` is a starter catalog and should say so.
- State honestly when a feature (analytics, email capture, catalog sync) is a stub versus wired up.

## Quality Gates

```bash
pnpm install
pnpm run lint
pnpm run build
```

For visual work, inspect desktop, mobile, and reduced-motion output per the web-excellence gate in `CLAUDE.md`.

## Deployment

- This repo itself is never deployed to a production domain — it is cloned, then deployed by the person who clones it.
- Do not add secrets, real API keys, or a real affiliate account's credentials here.
