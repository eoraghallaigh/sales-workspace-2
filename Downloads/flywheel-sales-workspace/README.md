# Flywheel Sales Workspace

A single workspace to view and engage all of a rep's prospects. This is the interactive prototype Eoin Ó Raghallaigh maintains for the Flywheel Product team — a Vite + React + TypeScript app rendered with Tailwind and shadcn/ui, themed against the Trellis design system.

## Run locally

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:8080. There's no backend — fixtures live in `src/data/`.

## Capture iteration screenshots

```sh
npm run capture -- <iteration-id>
```

Routes captured are defined in `src/data/cycles/screenshotConfig.ts`. Output lands in `public/about/iterations/<iteration-id>/`.

## Ship a change

The `/ship` Claude Code slash command commits, opens a PR against `master`, merges, and mirrors `master` to the public `github` remote so Netlify rebuilds. Iteration entries are appended to `src/data/cycles/iterations/<currentCycleSlug>.ts`.
