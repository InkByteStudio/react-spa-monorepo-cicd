# Adding a New SPA

This guide walks through adding a new SPA application to the monorepo. We'll use `reports-spa` as an example.

## 1. Create the App

The fastest way is to copy an existing SPA:

```bash
cp -r apps/admin-spa apps/reports-spa
```

Then update these files:

### `apps/reports-spa/package.json`

```json
{
  "name": "@repo/reports-spa",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@repo/shared-ui": "workspace:*",
    "@repo/shared-utils": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### `apps/reports-spa/index.html`

Update the `<title>` tag.

### `apps/reports-spa/src/App.tsx`

Write your app's root component.

## 2. Install Dependencies

```bash
pnpm install
```

This links the new workspace and installs any new dependencies.

## 3. Verify Locally

```bash
# Dev server
pnpm --filter @repo/reports-spa dev

# Type check
pnpm typecheck

# Tests
pnpm --filter @repo/reports-spa test run

# Build
pnpm --filter @repo/reports-spa build
```

## 4. Update Root `package.json`

Add convenience scripts:

```json
{
  "scripts": {
    "build:reports-spa": "pnpm --filter @repo/reports-spa build",
    "dev:reports-spa": "pnpm --filter @repo/reports-spa dev",
    "deploy:reports-spa": "bash scripts/deploy-spa.sh reports-spa"
  }
}
```

## 5. Update `vitest.workspace.ts`

Add the new app's vitest config:

```ts
export default [
  "apps/admin-spa/vitest.config.ts",
  "apps/portal-spa/vitest.config.ts",
  "apps/reports-spa/vitest.config.ts",
  "packages/shared-ui/vitest.config.ts",
  "packages/shared-utils/vitest.config.ts",
];
```

## 6. Update GitHub Actions

In `.github/workflows/validate-and-deploy.yml`:

### Add to `detect-changes` filters:

```yaml
reports-spa:
  - "apps/reports-spa/**"
  - "packages/**"
```

### Add to `detect-changes` outputs:

```yaml
outputs:
  reports-spa: ${{ steps.filter.outputs.reports-spa }}
```

### Add build job:

```yaml
build-reports-spa:
  needs: detect-changes
  if: needs.detect-changes.outputs.reports-spa == 'true'
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version-file: ".nvmrc"
        cache: "pnpm"
    - run: pnpm install --frozen-lockfile
    - name: Build reports-spa
      run: bash scripts/build-spa.sh reports-spa
    - uses: actions/upload-artifact@v4
      with:
        name: reports-spa-dist
        path: apps/reports-spa/dist/
        retention-days: 1
```

### Add deploy job:

```yaml
deploy-reports-spa:
  needs: [detect-changes, lint, typecheck, unit-tests, e2e-tests, security-audit]
  if: >-
    github.event_name == 'push' &&
    github.ref == 'refs/heads/main' &&
    needs.detect-changes.outputs.reports-spa == 'true'
  runs-on: ubuntu-latest
  environment: production
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version-file: ".nvmrc"
        cache: "pnpm"
    - run: pnpm install --frozen-lockfile
    - name: Build reports-spa
      run: bash scripts/build-spa.sh reports-spa
    - name: Configure SSH
      run: bash scripts/ssh-setup.sh
      env:
        DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
        DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
        DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
        DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
    - name: Deploy reports-spa
      run: bash scripts/deploy-spa.sh reports-spa
      env:
        DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
        DEPLOY_PORT: ${{ secrets.DEPLOY_PORT }}
        DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        DEPLOY_REPORTS_SPA_PATH: ${{ secrets.DEPLOY_REPORTS_SPA_PATH }}
```

### Add the secret:

In GitHub Settings > Secrets, add `DEPLOY_REPORTS_SPA_PATH` (e.g., `/var/www/html/reports`).

## 7. Update GitLab CI

In `.gitlab-ci.yml`:

### Add change detection templates:

```yaml
.reports-spa-mr-or-main:
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      changes:
        - apps/reports-spa/**/*
        - packages/**/*
    - if: '$CI_COMMIT_BRANCH == "main"'
      changes:
        - apps/reports-spa/**/*
        - packages/**/*

.reports-spa-deploy-only:
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      changes:
        - apps/reports-spa/**/*
        - packages/**/*
```

### Add validate, build, and deploy jobs:

```yaml
validate:reports-spa:
  stage: validate
  extends: .reports-spa-mr-or-main
  script:
    - pnpm typecheck
    - pnpm --filter @repo/reports-spa test run
    - pnpm --filter @repo/reports-spa build

build:reports-spa:
  stage: build
  extends: .reports-spa-deploy-only
  script:
    - bash scripts/build-spa.sh reports-spa
  artifacts:
    paths:
      - apps/reports-spa/dist/
    expire_in: 1 hour

deploy:reports-spa:
  stage: deploy
  extends: .reports-spa-deploy-only
  before_script: []
  needs:
    - job: build:reports-spa
      artifacts: true
  script:
    - bash scripts/ssh-setup.sh
    - bash scripts/deploy-spa.sh reports-spa
  environment:
    name: production
```

### Add the CI/CD variable:

In GitLab Settings > CI/CD > Variables, add `DEPLOY_REPORTS_SPA_PATH`.

## 8. Update Docker + E2E Tests

### Add nginx location for the new SPA in `docker/nginx/default.conf`:

```nginx
location /reports/ {
    alias /usr/share/nginx/html/reports/;
    try_files $uri $uri/ /reports/index.html;
}
```

### Add volume mount in `docker/docker-compose.yml`:

```yaml
- ./apps/reports-spa/dist:/usr/share/nginx/html/reports:ro
```

### Add E2E test file `e2e/tests/reports-spa.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("reports-spa loads", async ({ page }) => {
  await page.goto("/reports/");
  await expect(page).toHaveTitle(/Reports/);
});
```

## 9. Update Deploy Targets (Optional)

If using `config/deploy-targets.json`:

```json
{
  "reports-spa": {
    "host": "your-server.example.com",
    "port": 22,
    "user": "deploy",
    "remote_path": "/var/www/html/reports"
  }
}
```

## Checklist

- [ ] App directory created under `apps/`
- [ ] `package.json` has unique `@repo/` name
- [ ] `pnpm install` succeeds
- [ ] App builds and tests pass locally
- [ ] Root `package.json` scripts updated
- [ ] `vitest.workspace.ts` updated
- [ ] GitHub Actions workflow updated (filter, build job, deploy job)
- [ ] GitLab CI updated (templates, validate, build, deploy jobs)
- [ ] Docker nginx config updated with new location
- [ ] E2E test file created
- [ ] Deploy secret/variable added in CI settings
