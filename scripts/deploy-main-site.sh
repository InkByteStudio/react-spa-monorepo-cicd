#!/usr/bin/env bash
# =============================================================================
# deploy-main-site.sh
#
# Deploys the main static site to a remote server via rsync.
#
# What gets synced:
#   apps/main-site/  ->  DEPLOY_HOST:<DEPLOY_MAIN_SITE_PATH>/
#
# The --delete flag ensures the remote directory mirrors the local source
# exactly, removing old files that no longer exist locally.
#
# A timestamped backup of the current deployment is created before syncing,
# enabling rollback via rollback-main-site.sh.
#
# Required environment variables:
#   DEPLOY_HOST            - Target server hostname or IP
#   DEPLOY_USER            - SSH username
#   DEPLOY_MAIN_SITE_PATH  - Remote path for the main site
#
# Optional:
#   DEPLOY_PORT   - SSH port (default: 22)
#   DRY_RUN       - Set to "true" to preview changes without deploying
#
# Usage:
#   bash scripts/deploy-main-site.sh
#   DRY_RUN=true bash scripts/deploy-main-site.sh
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$REPO_ROOT/scripts"
SITE_DIR="$REPO_ROOT/apps/main-site/"

# Validate required env vars
source "$SCRIPT_DIR/validate-required-env.sh" DEPLOY_HOST DEPLOY_USER DEPLOY_MAIN_SITE_PATH

DEPLOY_PORT="${DEPLOY_PORT:-22}"
DRY_RUN="${DRY_RUN:-false}"

RSYNC_OPTS=(-avz --delete)
SSH_ARGS=(-p "$DEPLOY_PORT" -i ~/.ssh/deploy_key)

if [ "$DRY_RUN" = "true" ]; then
  RSYNC_OPTS+=(--dry-run)
  echo "=== DRY RUN MODE — no files will be transferred ==="
  echo ""
fi

# Create timestamped backup of current deployment (for rollback)
BACKUP_PATH="${DEPLOY_MAIN_SITE_PATH}.backup.$(date +%s)"
echo "Creating backup at $BACKUP_PATH..."
ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" \
  "if [ -d \"${DEPLOY_MAIN_SITE_PATH}\" ]; then cp -r \"${DEPLOY_MAIN_SITE_PATH}\" \"${BACKUP_PATH}\"; echo 'Backup created.'; else echo 'No existing deployment to back up.'; fi" \
  2>/dev/null || echo "Warning: Could not create backup (directory may not exist yet)."

echo ""
echo "Deploying main site to $DEPLOY_HOST:$DEPLOY_MAIN_SITE_PATH..."
echo "Source: $SITE_DIR"
echo ""

rsync "${RSYNC_OPTS[@]}" \
  -e "ssh ${SSH_ARGS[@]}" \
  "$SITE_DIR" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_MAIN_SITE_PATH}/"

echo ""
echo "Main site deploy complete."
