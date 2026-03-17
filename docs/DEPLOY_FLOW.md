# Deploy Flow

## Overview

This document explains what happens at each stage of the development and deployment lifecycle.

## Stage 1: Feature Branch Push

When a developer pushes commits to a feature branch:

- **GitHub**: Nothing happens until a PR is opened
- **GitLab**: Nothing happens until an MR is opened (assuming only MR pipelines are configured)

## Stage 2: Pull Request / Merge Request

When a PR (GitHub) or MR (GitLab) is opened or updated:

1. **Change detection** determines which apps were modified
2. **Validation** runs only for changed apps:
   - **SPA apps**: lint → typecheck → test → build
   - **Main site**: directory structure validation
3. **E2E tests** run against all apps in Docker (nginx serving static builds)
4. Results appear as status checks on the PR/MR
5. The PR/MR can only be merged if all checks pass (with branch protection enabled)

**No deployment happens at this stage.**

## Stage 3: Merge into Main

When the PR/MR is merged into `main`:

1. A new pipeline runs on the `main` branch
2. **Change detection** identifies the same changed paths
3. **Validation** runs again (confirming the merged code is valid)
4. **Build** produces production artifacts:
   - SPA apps: `vite build` creates optimized output in `dist/`
   - Main site: no build step (code is deployed as-is)
5. **E2E tests** run against all apps in Docker
6. **Deployment** syncs the built output to the production server

## Stage 4: Deployment

### SPA Deployment

```
apps/<app-name>/dist/  →  rsync  →  DEPLOY_HOST:<remote-path>/
```

- Uses `rsync -avz --delete` to ensure the remote directory mirrors the local build
- The `--delete` flag only affects files within the target directory
- SSH connection uses the deploy key configured via `scripts/ssh-setup.sh`

### Main Site Deployment

```
apps/main-site/  →  rsync  →  DEPLOY_HOST:<DEPLOY_MAIN_SITE_PATH>/
```

- Single rsync call syncs the entire main site directory
- Uses `--delete` to remove old files that no longer exist locally

## Dry Run

To preview what would be deployed without actually transferring files:

```bash
# SPA dry run
DRY_RUN=true \
  DEPLOY_HOST=example.com \
  DEPLOY_USER=deploy \
  DEPLOY_ADMIN_SPA_PATH=/var/www/html/admin \
  bash scripts/deploy-spa.sh admin-spa

# Main site dry run
DRY_RUN=true \
  DEPLOY_HOST=example.com \
  DEPLOY_USER=deploy \
  DEPLOY_MAIN_SITE_PATH=/var/www/html \
  bash scripts/deploy-main-site.sh
```

The `DRY_RUN=true` flag adds `--dry-run` to the rsync command, showing exactly which files would be transferred, created, or deleted — without making any changes.

## Rollback

### Option 1: Git Revert (Recommended)

```bash
# Revert the problematic merge commit
git revert -m 1 <merge-commit-sha>
git push origin main
```

This creates a new commit that undoes the changes. CI will detect the affected apps and redeploy the previous working state.

### Option 2: Redeploy a Previous Commit

```bash
# Check out the last known good commit
git checkout <good-commit-sha>

# Build and deploy manually
bash scripts/build-spa.sh admin-spa
bash scripts/deploy-spa.sh admin-spa
```

### Option 3: Automated Rollback Script

```bash
# Restore from the most recent backup
bash scripts/rollback-spa.sh admin-spa

# Restore a specific backup by timestamp
bash scripts/rollback-spa.sh admin-spa 1710600000

# Preview what would be restored
DRY_RUN=true bash scripts/rollback-spa.sh admin-spa
```

The deploy scripts automatically create timestamped backups before each deployment.

## Environment Variables Reference

| Variable                 | Used By                    | Description                      |
| ------------------------ | -------------------------- | -------------------------------- |
| `DEPLOY_HOST`            | All deploy scripts         | Target server hostname or IP     |
| `DEPLOY_PORT`            | All deploy scripts         | SSH port (default: 22)           |
| `DEPLOY_USER`            | All deploy scripts         | SSH username                     |
| `DEPLOY_SSH_KEY`         | `ssh-setup.sh`             | Private SSH key content          |
| `DEPLOY_MAIN_SITE_PATH`  | `deploy-main-site.sh`      | Remote main site path            |
| `DEPLOY_ADMIN_SPA_PATH`  | `deploy-spa.sh admin-spa`  | Remote admin SPA path            |
| `DEPLOY_PORTAL_SPA_PATH` | `deploy-spa.sh portal-spa` | Remote portal SPA path           |
| `DRY_RUN`                | All deploy scripts         | Set to `"true"` for preview mode |

## Troubleshooting

### Deploy fails with "Permission denied"

- Verify the deploy key has been added to the server's `authorized_keys`
- Check that the `DEPLOY_USER` has write access to the target directories
- Ensure the SSH key is in PEM format (starts with `-----BEGIN`)

### Changes deployed but site unchanged

- Check for CDN or browser caching — Vite uses content hashes in filenames, so cache busting should work automatically for SPAs
- For the main site, clear any server-side cache (page cache, CDN)

### Pipeline runs but no deploy happens

- Verify the change detection paths match your file changes
- Check that the pipeline is running on the `main` branch (not a feature branch)
- Confirm all required secrets/variables are set in CI settings
