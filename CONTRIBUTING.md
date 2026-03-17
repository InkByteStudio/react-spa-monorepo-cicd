# Contributing

Thanks for your interest in contributing! This guide covers the process for submitting changes.

## Prerequisites

- [Node.js](https://nodejs.org/) v22 (see `.nvmrc`)
- [pnpm](https://pnpm.io/) v10+
- [Docker](https://www.docker.com/) (for E2E tests)

## Getting Started

```bash
git clone <repo-url>
cd react-spa-monorepo-cicd
pnpm install
```

## Development Workflow

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/my-change
   ```

2. **Make your changes** — the monorepo uses pnpm workspaces, so shared packages in `packages/` are available to all apps.

3. **Run validation locally** before pushing:

   ```bash
   bash scripts/run-all.sh
   ```

   This runs formatting, linting, typechecking, unit tests, builds, and E2E tests.

4. **Open a pull request** to `main`.

## Code Standards

- **Formatting** — Prettier runs automatically via pre-commit hook (`husky` + `lint-staged`). You can also run `pnpm format` manually.
- **Linting** — ESLint with TypeScript support. Run `pnpm lint` to check.
- **Type checking** — Strict TypeScript. Run `pnpm typecheck`.
- **Commit messages** — Follow [Conventional Commits](https://www.conventionalcommits.org/). Enforced by `commitlint`. Examples:
  - `feat: add user profile page`
  - `fix: resolve routing issue in admin SPA`
  - `docs: update deployment guide`

## Running Tests

```bash
pnpm test              # Unit tests (Vitest)
pnpm test:coverage     # Unit tests with coverage

# E2E tests (requires Docker)
pnpm build:admin-spa && pnpm build:portal-spa
docker compose -f docker/docker-compose.yml up -d
pnpm test:e2e
docker compose -f docker/docker-compose.yml down
```

## Project Structure

See the [Architecture docs](docs/ARCHITECTURE.md) for details on the monorepo layout, shared packages, and change detection.

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include a clear description of what changed and why
- Ensure all CI checks pass
- Update documentation if your change affects setup, configuration, or user-facing behavior

## Adding a New App

See [Adding a New SPA](docs/ADDING_A_NEW_SPA.md) for the step-by-step checklist.

## Questions?

Open an issue if something is unclear or you need help getting started.
