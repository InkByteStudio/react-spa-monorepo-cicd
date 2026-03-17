# Multiapp Monorepo with CI/CD Auto-Deploy

> Production-ready monorepo boilerplate for React + TypeScript + Vite apps with automated CI/CD, E2E testing, and staging-to-production deployment pipelines.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![GitLab CI](https://img.shields.io/badge/GitLab_CI-CI/CD-FC6D26?logo=gitlab&logoColor=white)](https://docs.gitlab.com/ee/ci/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Maintained](https://img.shields.io/badge/Maintained-yes-green.svg)](https://github.com/InkByteStudio/react-spa-monorepo-cicd/graphs/commit-activity)

A reference architecture for running **multiple apps in a single monorepo** with **automated deployment on merge to main**. Contains a static site and two React SPAs that share components and utilities, with full CI/CD validation gates including E2E testing.

## Features

- **Monorepo with pnpm workspaces** — Multiple apps and shared packages in a single repository with efficient dependency management
- **React 19 + TypeScript + Vite 6** — Modern frontend stack with fast HMR and strict type checking
- **Shared component library** — Reusable React UI components and utility functions across all apps
- **Automated CI/CD pipelines** — GitHub Actions and GitLab CI with 7 validation gates before any deployment
- **Intelligent change detection** — Only validates and deploys apps affected by each change
- **Staging + production environments** — Branch-based deployment with environment-specific builds and approval gates
- **E2E testing with Playwright** — End-to-end tests, cross-app navigation tests, visual regression, and accessibility testing (axe-core)
- **Docker-based local development** — nginx routing for all apps with Docker Compose, matching production topology
- **Automated rollback** — Timestamped backups with one-command rollback via rsync over SSH
- **Code quality enforcement** — ESLint, Prettier, commitlint (Conventional Commits), Husky pre-commit hooks
- **Dependency management** — Dependabot configured for npm, GitHub Actions, and Docker image updates
- **Comprehensive documentation** — Architecture guides, deployment flow, setup instructions, and extension guides

---

## Architecture

```
                              Monorepo
    ┌──────────────────────────────────────────────────┐
    │                                                  │
    │   apps/                    packages/             │
    │   ├── main-site/           ├── shared-ui/        │
    │   │   (static HTML/CSS)    │   (React components)│
    │   ├── admin-spa/           └── shared-utils/     │
    │   │   (React + Vite)           (utilities)       │
    │   └── portal-spa/                                │
    │       (React + Vite)                             │
    │                                                  │
    └──────────────────────────────────────────────────┘
          │                              │
    open PR to main              push to staging
          │                              │
          ▼                              ▼
    ┌──────────────────────────────────────────────────┐
    │              CI/CD Pipeline                      │
    │                                                  │
    │  detect changes                                  │
    │       │                                          │
    │       ├── format check ──┐                       │
    │       ├── lint ──────────┤                       │
    │       ├── typecheck ─────┤  all must             │
    │       ├── unit tests ────┤  pass                 │
    │       ├── build ─────────┤                       │
    │       ├── security audit ┤                       │
    │       └── E2E tests ─────┘                       │
    │              │                                   │
    │              ▼                                   │
    │     deploy only changed apps                     │
    │     (staging or production depending on branch)  │
    │              │                                   │
    │              ▼                                   │
    │        health check                              │
    └──────────────────────────────────────────────────┘
          │                              │
     rsync over SSH                 rsync over SSH
          │                              │
          ▼                              ▼
    ┌────────────────────┐   ┌─────────────────────────┐
    │   Staging Server   │   │   Production Server     │
    │   (push to staging)│   │   (merge to main)       │
    │                    │   │                          │
    │   verify & approve │──▶│   /var/www/html/         │
    │   before prod      │   │   /var/www/html/admin/   │
    │                    │   │   /var/www/html/portal/   │
    └────────────────────┘   └─────────────────────────┘
```

## How CI/CD Works

### When Tests Run

Tests run at **three stages** — not just before merge:

| Trigger                    | What happens                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Pull request to `main`** | Full validation (lint, typecheck, unit tests, build, security audit, E2E). All gates must pass before the PR can be merged. |
| **Push to `staging`**      | Full validation runs again, then deploys to staging on success.                                                             |
| **Push to `main`** (merge) | Full validation runs again, then deploys to production on success.                                                          |

Tests re-run after merge because the merged code may differ from the PR (e.g., merge conflicts, concurrent PRs). This ensures nothing broken reaches production.

Changes to `packages/` automatically trigger both SPA apps. The main site is independent.

### Pipeline Stages

```
  detect changes
       │
       ├── format check ─────┐
       ├── lint ──────────────┤
       ├── typecheck ─────────┤  all must pass
       ├── unit tests ────────┤
       ├── build ─────────────┤
       ├── security audit ────┘
       │
       └── E2E tests (needs builds)
              │
              ▼
     deploy only changed apps (if on staging or main branch)
              │
              ▼
        health check
```

### Staging → Production Workflow

The recommended flow uses a `staging` branch for pre-production verification:

1. **Develop on a feature branch** — open a PR to `main`
2. **PR validation** — CI runs all gates (lint, typecheck, tests, build, E2E). All must pass.
3. **Deploy to staging** — merge your feature branch into the `staging` branch:
   ```bash
   git checkout staging
   git merge feature/my-change
   git push origin staging
   ```
   CI validates again, then deploys to your staging server with staging-specific config (`.env.staging`).
4. **Test on staging** — verify the deployment works in a production-like environment. Get final approval from stakeholders.
5. **Deploy to production** — merge your PR to `main` (or merge `staging` into `main`):
   ```bash
   git checkout main
   git merge staging
   git push origin main
   ```
   CI validates one final time, then deploys to production.
6. **Post-deploy health check** — CI automatically verifies each deployed app is responding.

### Required GitHub Secrets

Configure these in **Settings > Secrets and variables > Actions**:

| Secret          | Staging                          | Production                |
| --------------- | -------------------------------- | ------------------------- |
| SSH key         | `DEPLOY_SSH_KEY` (shared)        | `DEPLOY_SSH_KEY` (shared) |
| Host            | `DEPLOY_STAGING_HOST`            | `DEPLOY_HOST`             |
| Port            | `DEPLOY_STAGING_PORT`            | `DEPLOY_PORT`             |
| User            | `DEPLOY_STAGING_USER`            | `DEPLOY_USER`             |
| Admin SPA path  | `DEPLOY_STAGING_ADMIN_SPA_PATH`  | `DEPLOY_ADMIN_SPA_PATH`   |
| Portal SPA path | `DEPLOY_STAGING_PORTAL_SPA_PATH` | `DEPLOY_PORTAL_SPA_PATH`  |
| Main site path  | `DEPLOY_STAGING_MAIN_SITE_PATH`  | `DEPLOY_MAIN_SITE_PATH`   |

### GitHub Environment Protection Rules

For an approval gate before production deploy, configure **Settings > Environments**:

- **staging** — auto-deploy on push (no protection needed)
- **production** — add **required reviewers** so a team member must click "Approve" in the GitHub UI before the production deploy job runs

This gives you a manual approval step even though the pipeline is automated.

## What's Inside

| Path                     | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `apps/main-site/`        | Static HTML/CSS/JS site (served at `/`)                |
| `apps/admin-spa/`        | Admin dashboard — Vite + React + TypeScript            |
| `apps/portal-spa/`       | Customer portal — Vite + React + TypeScript            |
| `packages/shared-ui/`    | Shared React components (Button, etc.)                 |
| `packages/shared-utils/` | Shared utility functions (formatDate, relativeTime)    |
| `scripts/`               | Bash scripts for build, deploy, rollback, health check |
| `docker/`                | Docker + nginx config for local dev and E2E testing    |
| `e2e/`                   | Playwright E2E and visual regression tests             |
| `.github/workflows/`     | GitHub Actions CI/CD pipeline                          |
| `.gitlab-ci.yml`         | GitLab CI/CD pipeline                                  |

## Prerequisites

- [Node.js](https://nodejs.org/) v22 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) v10+
- [Docker](https://www.docker.com/) (for E2E tests)

## Quick Start

```bash
git clone <repo-url>
cd react-spa-monorepo-cicd

# Install pnpm (pick one):
npm install -g pnpm@10           # direct install
# OR
corepack enable                  # uses Node's built-in package manager shim

# Run the full pipeline — install, lint, typecheck, test, build, Docker, E2E:
bash scripts/run-all.sh
```

That single command runs all 11 pipeline steps and prints a pass/fail summary.

### Dev Servers

```bash
pnpm install
pnpm dev:admin-spa    # http://localhost:5173
pnpm dev:portal-spa   # http://localhost:5174
```

### Run E2E Tests Manually

```bash
pnpm build:admin-spa && pnpm build:portal-spa

docker compose -f docker/docker-compose.yml up -d
pnpm test:e2e
docker compose -f docker/docker-compose.yml down
```

## Deploy Model

Each app deploys to a **configurable remote path** via rsync over SSH. Default production paths:

```
DEPLOY_MAIN_SITE_PATH=/var/www/html
DEPLOY_ADMIN_SPA_PATH=/var/www/html/admin
DEPLOY_PORTAL_SPA_PATH=/var/www/html/portal
```

Staging paths are configured separately (see [Required GitHub Secrets](#required-github-secrets) above).

Deployments create **timestamped backups** automatically. Roll back with:

```bash
bash scripts/rollback-spa.sh admin-spa
```

### Environment-Specific Builds

SPAs support Vite's `--mode` flag for staging vs production. CI uses this automatically — staging branch builds with `staging` mode, main branch builds with `production` mode:

```bash
bash scripts/build-spa.sh admin-spa staging     # loads .env.staging
bash scripts/build-spa.sh admin-spa production   # loads .env.production
```

### Dry Run

Preview what would be deployed without transferring files:

```bash
DRY_RUN=true bash scripts/deploy-spa.sh admin-spa
```

## Available Scripts

| Script                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| `pnpm lint`              | Lint all TypeScript/React code                |
| `pnpm typecheck`         | Type-check all SPA apps and shared packages   |
| `pnpm test`              | Run all unit tests                            |
| `pnpm test:e2e`          | Run Playwright E2E tests (requires Docker)    |
| `pnpm build:admin-spa`   | Build the admin SPA                           |
| `pnpm build:portal-spa`  | Build the portal SPA                          |
| `pnpm build:main-site`   | Validate main site structure                  |
| `pnpm dev:admin-spa`     | Start admin SPA dev server                    |
| `pnpm dev:portal-spa`    | Start portal SPA dev server                   |
| `pnpm deploy:main-site`  | Deploy main site                              |
| `pnpm deploy:admin-spa`  | Deploy admin SPA                              |
| `pnpm deploy:portal-spa` | Deploy portal SPA                             |
| `pnpm run-all`           | Run full pipeline (lint → test → build → E2E) |

## Repo Layout

```
├── apps/
│   ├── main-site/              # Static HTML/CSS/JS
│   │   ├── index.html
│   │   ├── css/style.css
│   │   └── js/main.js
│   ├── admin-spa/              # Vite + React + TypeScript
│   └── portal-spa/             # Vite + React + TypeScript
├── packages/
│   ├── shared-ui/              # Shared React components
│   └── shared-utils/           # Shared utility functions
├── scripts/
│   ├── build-spa.sh            # Build a SPA (supports --mode)
│   ├── build-main-site.sh      # Validate main site structure
│   ├── deploy-spa.sh           # Deploy SPA via rsync (auto-backup)
│   ├── deploy-main-site.sh     # Deploy main site via rsync
│   ├── rollback-spa.sh         # Rollback to previous deployment
│   ├── health-check.sh         # Post-deploy verification
│   ├── ssh-setup.sh            # Configure SSH in CI
│   ├── validate-required-env.sh
│   ├── changed-files.sh
│   └── run-all.sh              # Full pipeline: single-command validation
├── docker/
│   ├── docker-compose.yml      # nginx serving all apps
│   ├── docker-compose.ci.yml   # CI-specific overrides
│   └── nginx/default.conf      # Routing: /, /admin/, /portal/
├── e2e/
│   ├── playwright.config.ts
│   └── tests/
│       ├── main-site.spec.ts
│       ├── admin-spa.spec.ts
│       ├── portal-spa.spec.ts
│       └── cross-app-navigation.spec.ts
├── config/
│   └── deploy-targets.example.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEPLOY_FLOW.md
│   ├── GITHUB_SETUP.md
│   ├── GITLAB_SETUP.md
│   ├── ADDING_A_NEW_SPA.md
│   └── MULTI_REPO.md
├── .github/
│   ├── workflows/validate-and-deploy.yml
│   └── dependabot.yml
└── .gitlab-ci.yml
```

## Multi-Repo Alternative

This monorepo approach works best when apps share code and teams. The same CI/CD patterns (deploy scripts, health checks, validation gates) also work when each app lives in its own repository. See [docs/MULTI_REPO.md](docs/MULTI_REPO.md) for details.

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — Why monorepo, change detection, package graph
- [Deploy Flow](docs/DEPLOY_FLOW.md) — Full lifecycle from PR to production, rollback
- [GitHub Setup](docs/GITHUB_SETUP.md) — Secrets, branch protection, environments
- [GitLab Setup](docs/GITLAB_SETUP.md) — CI/CD variables, branch rules
- [Adding a New SPA](docs/ADDING_A_NEW_SPA.md) — Step-by-step checklist
- [Multi-Repo Approach](docs/MULTI_REPO.md) — Adapting patterns for separate repos

## GitHub Repository Setup

After pushing this repo to GitHub, set the repository topics and description for maximum discoverability. Run this once with the [GitHub CLI](https://cli.github.com/):

```bash
# Set repository description and homepage
gh repo edit --description "Production-ready monorepo boilerplate: React 19 + TypeScript + Vite 6 + Playwright E2E + GitHub Actions CI/CD + Docker + staging/production deploy pipelines" --homepage "https://github.com/InkByteStudio/react-spa-monorepo-cicd"

# Set repository topics (used by GitHub search and Explore)
gh repo edit --add-topic react,typescript,vite,monorepo,cicd,github-actions,gitlab-ci,playwright,e2e-testing,docker,pnpm,boilerplate,template,devops,deployment,react-spa,nginx,rsync,staging,automated-deployment
```

## License

[MIT](LICENSE)
