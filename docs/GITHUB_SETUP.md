# GitHub Setup

## 1. Create the Repository

```bash
# Create a new repo on GitHub, then:
cd multiapp-monorepo-cicd
git init
git add .
git commit -m "Initial monorepo setup"
git remote add origin git@github.com:YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

## 2. Add Actions Secrets

Go to **Settings > Secrets and variables > Actions > New repository secret** and add:

| Secret Name              | Description                                      | Example                         |
| ------------------------ | ------------------------------------------------ | ------------------------------- |
| `DEPLOY_SSH_KEY`         | Private SSH key for the deploy user (PEM format) | Contents of `~/.ssh/deploy_key` |
| `DEPLOY_HOST`            | Target server hostname or IP                     | `deploy.example.com`            |
| `DEPLOY_PORT`            | SSH port (omit for default 22)                   | `22`                            |
| `DEPLOY_USER`            | SSH username on the target server                | `deploy`                        |
| `DEPLOY_MAIN_SITE_PATH`  | Remote path for the main static site             | `/var/www/html`                 |
| `DEPLOY_ADMIN_SPA_PATH`  | Remote path for admin SPA static files           | `/var/www/html/admin`           |
| `DEPLOY_PORTAL_SPA_PATH` | Remote path for portal SPA static files          | `/var/www/html/portal`          |

### Generating a Deploy Key

On the **target server**:

```bash
# Create a deploy user (if not exists)
sudo adduser --disabled-password deploy

# Generate a key pair
sudo -u deploy ssh-keygen -t ed25519 -f /home/deploy/.ssh/deploy_key -N ""

# Authorize the public key
sudo -u deploy bash -c 'cat ~/.ssh/deploy_key.pub >> ~/.ssh/authorized_keys'

# Copy the private key — this goes into the DEPLOY_SSH_KEY secret
sudo cat /home/deploy/.ssh/deploy_key
```

## 3. Enable Branch Protection

Go to **Settings > Branches > Add rule**:

- **Branch name pattern**: `main`
- **Require a pull request before merging**: Checked
- **Require status checks to pass before merging**: Checked
  - Add required checks: `lint`, `typecheck`, `unit-tests`, `e2e-tests`
- **Require branches to be up to date before merging**: Recommended

## 4. Configure Environments (Optional)

Go to **Settings > Environments > New environment**:

- **Name**: `production`
- **Required reviewers**: Add team leads for manual deploy approval
- **Wait timer**: Optional delay before deployment starts

The deploy jobs reference `environment: production`, so they will follow these rules.

## 5. How the PR > Merge > Deploy Flow Works

1. Developer pushes a feature branch and opens a **Pull Request**
2. The `detect-changes` job identifies which apps have changes
3. Validation jobs run in parallel: `lint`, `typecheck`, `unit-tests`, `build`
4. E2E tests run against all apps in Docker
5. If all checks pass, the PR can be merged
6. On merge to main, the workflow runs again:
   - `detect-changes` identifies the same changed apps
   - All validation and E2E gates run again
   - `deploy-*` jobs run (only for changed apps)
7. Each deploy job configures SSH, builds the app, and rsync's the output to the server

### Concurrency

The workflow uses `concurrency` to prevent overlapping runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

If a new commit is pushed to the same branch/PR while a run is in progress, the previous run is cancelled.
