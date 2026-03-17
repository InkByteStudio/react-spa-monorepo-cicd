# Architecture

## Why a Monorepo?

This project uses a monorepo because:

1. **Shared code** — The SPA apps share UI components and utilities. With a monorepo, importing `@repo/shared-ui` is as simple as a workspace dependency. No publishing, no version conflicts.

2. **Atomic changes** — A change to a shared component and the apps that consume it can be reviewed and merged as a single pull request.

3. **Unified CI** — One pipeline definition handles validation and deployment for all apps. Change detection ensures only affected apps are processed.

4. **Consistent tooling** — TypeScript, ESLint, Vitest, and pnpm are configured once at the root and inherited by all packages.

## How the Main Site and SPAs Coexist

The main site and the SPA apps are completely independent at runtime. They share a repository but have different:

- **Technologies** — The main site is static HTML/CSS/JS; SPAs are TypeScript + React
- **Build processes** — The main site has no build step; SPAs use Vite
- **Deployment targets** — Each app deploys to its own configurable remote path
- **Dependencies** — The main site has no Node.js dependencies; SPAs share `@repo/shared-ui` and `@repo/shared-utils`

This independence is reflected in CI — changes to the main site never trigger SPA validation, and vice versa.

## Package Dependency Graph

```
packages/shared-utils     (pure TypeScript utilities, no dependencies)
         │
         ▼
packages/shared-ui        (React components, depends on shared-utils)
         │
    ┌────┴────┐
    ▼         ▼
admin-spa  portal-spa     (both depend on shared-ui + shared-utils)

main-site                 (standalone, no shared package dependencies)
```

## How Shared Packages Work

Shared packages (`@repo/shared-ui`, `@repo/shared-utils`) are consumed **as raw TypeScript source** — they have no build step.

Each package's `package.json` points `main` and `types` to `src/index.ts`. When a SPA app imports from `@repo/shared-ui`, pnpm's workspace protocol resolves the import to the package's source directory. Vite then transpiles the TypeScript during its normal transform pipeline.

For IDE support, each SPA's `tsconfig.json` uses TypeScript project references to point at the shared packages, enabling proper type-checking and editor navigation.

## How Change Detection Works

### GitHub Actions

Uses [`dorny/paths-filter`](https://github.com/dorny/paths-filter) to detect which files changed:

| Filter       | Paths                               | Triggers                       |
| ------------ | ----------------------------------- | ------------------------------ |
| `admin-spa`  | `apps/admin-spa/**`, `packages/**`  | admin-spa validation + deploy  |
| `portal-spa` | `apps/portal-spa/**`, `packages/**` | portal-spa validation + deploy |
| `main-site`  | `apps/main-site/**`                 | main-site validation + deploy  |

The `packages/**` glob is intentionally broad. A change to any shared package triggers both SPA apps. This is simpler and safer than tracking per-package dependencies, and the cost of an occasional unnecessary deploy (a cheap rsync) is much lower than the risk of missing one.

### GitLab CI

Uses native `rules:changes` with the same path patterns. Each job is gated by change rules — if no files match, the job is skipped entirely.

### On Pull Request / Merge Request

Only **validation** runs (lint, typecheck, test, build). No deployment.

### On Push to Main (after merge)

Both **validation** and **deployment** run. The deploy jobs depend on successful validation.

## Deployment Model

All deployment uses **rsync over SSH**:

- **SPA apps**: The `dist/` directory (Vite build output) is rsync'd to the configured remote path. The `--delete` flag ensures the remote directory exactly mirrors the build output.

- **Main site**: The `apps/main-site/` directory is rsync'd to its configured remote path.

Both CI systems (GitHub Actions and GitLab CI) call the same bash scripts in `scripts/`, ensuring consistent behavior.
