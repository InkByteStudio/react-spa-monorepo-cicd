# GitLab Setup

## 1. Import the Repository

### Option A: Import from GitHub

1. Go to **GitLab > New Project > Import project > GitHub**
2. Authenticate with GitHub and select the repository
3. GitLab will mirror the repo including all branches

### Option B: Push directly

```bash
cd multiapp-monorepo-cicd
git remote add gitlab git@gitlab.com:YOUR_GROUP/YOUR_REPO.git
git push gitlab main
```

## 2. Add CI/CD Variables

Go to **Settings > CI/CD > Variables > Add variable**:

| Variable                 | Type     | Protected | Masked | Value                  |
| ------------------------ | -------- | --------- | ------ | ---------------------- |
| `DEPLOY_SSH_KEY`         | File     | Yes       | Yes    | Private key content    |
| `DEPLOY_HOST`            | Variable | Yes       | Yes    | `deploy.example.com`   |
| `DEPLOY_PORT`            | Variable | Yes       | No     | `22`                   |
| `DEPLOY_USER`            | Variable | Yes       | Yes    | `deploy`               |
| `DEPLOY_MAIN_SITE_PATH`  | Variable | Yes       | No     | `/var/www/html`        |
| `DEPLOY_ADMIN_SPA_PATH`  | Variable | Yes       | No     | `/var/www/html/admin`  |
| `DEPLOY_PORTAL_SPA_PATH` | Variable | Yes       | No     | `/var/www/html/portal` |

**Important:** Mark deploy variables as **Protected** so they are only available on the `main` branch. This prevents feature branches from deploying to production.

### Note on `DEPLOY_SSH_KEY`

GitLab supports **File** type variables. When set as File type, GitLab writes the content to a temporary file and sets the variable to the file path. The `ssh-setup.sh` script handles both formats — if `DEPLOY_SSH_KEY` is a file path, it copies the file; if it's raw content, it writes it.

## 3. Configure Branch Protection

Go to **Settings > Repository > Protected branches**:

- **Branch**: `main`
- **Allowed to merge**: Maintainers (or specific roles)
- **Allowed to push and merge**: No one (force merge requests)

## 4. Set Up Merge Request Approval Rules (Optional)

Go to **Settings > Merge requests > Approval rules**:

- Require at least 1 approval before merge
- Require all pipelines to succeed

## 5. How the MR > Merge > Deploy Flow Works

1. Developer pushes a feature branch and opens a **Merge Request**
2. GitLab evaluates `rules:changes` for each job — only jobs matching changed paths run
3. The **validate** stage runs lint, typecheck, tests, and build for affected apps
4. **E2E tests** run against all apps in Docker
5. If the pipeline passes, the MR can be merged
6. On merge to main, a new pipeline runs:
   - **validate** stage: confirms the merged code is valid
   - **build** stage: builds affected apps and saves artifacts
   - **e2e** stage: runs Playwright tests against Docker environment
   - **deploy** stage: deploys artifacts to the production server via rsync
7. Deploy jobs use the build artifacts from the previous stage, avoiding a redundant build

### Pipeline Caching

The `.gitlab-ci.yml` caches the pnpm store using the `pnpm-lock.yaml` as the cache key. This speeds up subsequent runs since dependencies are already downloaded.

### Change Detection

GitLab's `rules:changes` compares the current commit against:

- For **merge request pipelines**: the merge request diff
- For **branch pipelines**: the previous commit on the same branch

This is native to GitLab and requires no external tools.
