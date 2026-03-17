# Multi-Repo Approach

This monorepo keeps all apps in a single repository. The same CI/CD patterns work when each app lives in its own repository. This document explains how to adapt.

## When to Use Multi-Repo

- **Separate teams** own each app with independent release cycles
- **Access control** requires different permissions per app
- **CI/CD isolation** — one app's broken pipeline shouldn't block another
- **Repository size** — very large apps benefit from separate repos

## Key Differences

| Concern          | Monorepo                                | Multi-Repo                                         |
| ---------------- | --------------------------------------- | -------------------------------------------------- |
| Change detection | `dorny/paths-filter` / `rules:changes`  | Not needed — any push triggers the pipeline        |
| Shared packages  | pnpm workspace (`workspace:*`)          | Publish to npm/GitHub Packages, import via version |
| Atomic changes   | Single PR updates shared code + app     | Two PRs: one to publish package, one to consume    |
| CI config        | One workflow file with conditional jobs | One workflow file per repo (simpler)               |
| Deploy scripts   | Same `scripts/` directory, shared       | Copy `scripts/deploy-spa.sh` into each repo        |

## How to Adapt

### 1. Deploy Scripts

Copy these scripts into each app's repository:

- `scripts/deploy-spa.sh` — deploy the built SPA
- `scripts/ssh-setup.sh` — configure SSH in CI
- `scripts/validate-required-env.sh` — validate env vars
- `scripts/build-spa.sh` — build the SPA
- `scripts/health-check.sh` — post-deploy verification
- `scripts/rollback-spa.sh` — rollback to previous version

These scripts are self-contained and work without the monorepo structure.

### 2. CI Pipeline (GitHub Actions Example)

Each repo gets a simpler workflow — no change detection needed:

```yaml
name: Validate and Deploy

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: [lint, typecheck, unit-tests, build]
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - name: Configure SSH
        run: bash scripts/ssh-setup.sh
        env:
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
      - name: Deploy
        run: bash scripts/deploy-spa.sh my-app
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_MY_APP_PATH: ${{ secrets.DEPLOY_MY_APP_PATH }}
```

### 3. Shared Packages

Instead of `workspace:*` references:

1. Publish `@repo/shared-ui` and `@repo/shared-utils` to a package registry (npm, GitHub Packages, GitLab Package Registry)
2. Each app installs them as regular dependencies: `"@repo/shared-ui": "^1.0.0"`
3. When shared packages change, publish a new version, then update consumers

### 4. Coordinated Deploys

If multiple repos deploy to the same server:

- Each repo has its own `DEPLOY_*_PATH` secret pointing to its target directory
- Deploys are independent — no coordination needed for static file deployments
- The nginx config on the server maps paths to directories (same as monorepo)
- Rollback is per-app, not all-or-nothing

## Tradeoffs

**Monorepo advantages:**

- Single PR for cross-cutting changes
- Shared packages always in sync
- One CI config to maintain
- Change detection avoids unnecessary work

**Multi-repo advantages:**

- Simpler CI per repo (no change detection)
- Independent team autonomy
- Faster CI runs (smaller codebase per pipeline)
- Clearer ownership boundaries
