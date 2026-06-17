# Repository Guidelines

## Project Structure & Module Organization

This is a Node.js 20 TypeScript AGI application for Asterisk. Source lives in `src/`, with the entry point at `src/index.ts`.

- `src/agi/` contains AGI protocol parsing and command helpers.
- `src/config/` loads database and runtime configuration.
- `src/db/` contains CDR lookup logic.
- `src/util/` contains shared types and phone-number utilities.
- `tools/` contains local and deployment helpers, including the mock runner.
- `dist/` is generated build output; do not edit it by hand.

No dedicated test directory exists yet. Add tests near covered code or under a future `tests/` directory.

## Build, Test, and Development Commands

- `npm run build` bundles `src/index.ts` with `tsup` into `dist/index.js`.
- `npm run mock` builds the project, then runs `tools/mock-asterisk.ts` through `tsx` for local AGI simulation.
- `npm run biome` runs Biome checks, formatting, import organization, and safe writes.
- `npm run deploy` builds, copies `dist/index.js` to the configured Asterisk host, then runs remote setup.

There is currently no `npm test` script. When adding tests, add a package script and document required services or fixtures.

## Coding Style & Naming Conventions

Use TypeScript and keep modules focused by responsibility. File names use kebab-case, for example `cdr-last-channel.ts` and `config.service.ts`. Prefer named exports for shared helpers and explicit interfaces for cross-module data.

Biome enforces 2-space indentation, single quotes, semicolons, bracket spacing, organized imports, and a 100-column line width. Run `npm run biome` before submitting.

## Testing Guidelines

Prioritize tests around phone normalization, AGI command behavior, configuration loading, and CDR query filtering. Keep database tests isolated with fixtures or mocks.

Use descriptive test names that state behavior, such as `normalizesRussianMobileNumbers`.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so use clear, imperative commit subjects such as `Add CDR lookup fallback` or `Fix phone normalization`. Keep commits scoped to one logical change.

Pull requests should include a short summary, validation steps such as `npm run build` and `npm run biome`, linked issues when applicable, and deployment or configuration notes.

## Security & Configuration Tips

Do not commit real `.env` values or server credentials. Deployment scripts target a specific remote host; confirm it before `npm run deploy`. Database failures must leave `SALES_PHONE=0`.
