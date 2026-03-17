#!/usr/bin/env bash
# =============================================================================
# deploy-spa.sh
#
# Deploys a SPA application's dist/ output to a remote server via rsync.
#
# What gets synced:
#   apps/<app-name>/dist/  ->  DEPLOY_HOST:<remote-path>/
#
# The --delete flag ensures the remote directory mirrors the local dist/
# exactly, removing old files that no longer exist in the build output.
#
# Required environment variables:
#   DEPLOY_HOST               - Target server hostname or IP
#   DEPLOY_USER               - SSH username
#   DEPLOY_<APP_UPPER>_PATH   - Remote path (e.g., DEPLOY_ADMIN_SPA_PATH)
#
# Optional:
#   DEPLOY_PORT   - SSH port (default: 22)
#   DRY_RUN       - Set to "true" to preview changes without deploying
#
# Usage:
#   bash scripts/deploy-spa.sh admin-spa
#   DRY_RUN=true bash scripts/deploy-spa.sh portal-spa
# =============================================================================

set -euo pipefail

APP_NAME="${1:?Usage: deploy-spa.sh <app-name>}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$REPO_ROOT/scripts"

# Validate app name to prevent path traversal
if [[ ! "$APP_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "ERROR: Invalid app name '$APP_NAME'. Only lowercase letters, digits, and hyphens are allowed." >&2
  exit 1
fi

APP_DIR="$REPO_ROOT/apps/$APP_NAME"
DIST_DIR="$APP_DIR/dist/"

# Convert app-name to UPPER_SNAKE for env var lookup (admin-spa -> ADMIN_SPA)
APP_UPPER=$(echo "$APP_NAME" | tr '[:lower:]-' '[:upper:]_')
DEPLOY_PATH_VAR="DEPLOY_${APP_UPPER}_PATH"

# Validate required env vars
source "$SCRIPT_DIR/validate-required-env.sh" DEPLOY_HOST DEPLOY_USER "$DEPLOY_PATH_VAR"

DEPLOY_PORT="${DEPLOY_PORT:-22}"
REMOTE_PATH="${!DEPLOY_PATH_VAR}"
DRY_RUN="${DRY_RUN:-false}"

# Verify dist directory exists
if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: dist/ directory not found at $DIST_DIR" >&2
  echo "Run 'bash scripts/build-spa.sh $APP_NAME' first." >&2
  exit 1
fi

# Build rsync command
RSYNC_OPTS=(-avz --delete)
SSH_ARGS=(-p "$DEPLOY_PORT" -i ~/.ssh/deploy_key)

if [ "$DRY_RUN" = "true" ]; then
  RSYNC_OPTS+=(--dry-run)
  echo "=== DRY RUN MODE — no files will be transferred ==="
fi

# Create timestamped backup of current deployment (for rollback)
BACKUP_PATH="${REMOTE_PATH}.backup.$(date +%s)"
echo "Creating backup at $BACKUP_PATH..."
ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" \
  "if [ -d \"${REMOTE_PATH}\" ]; then cp -r \"${REMOTE_PATH}\" \"${BACKUP_PATH}\"; echo 'Backup created.'; else echo 'No existing deployment to back up.'; fi" \
  2>/dev/null || echo "Warning: Could not create backup (directory may not exist yet)."

echo ""
echo "Deploying $APP_NAME to $DEPLOY_HOST:$REMOTE_PATH..."
echo "Source: $DIST_DIR"
echo ""

rsync "${RSYNC_OPTS[@]}" \
  -e "ssh ${SSH_ARGS[@]}" \
  "$DIST_DIR" \
  "${DEPLOY_USER}@${DEPLOY_HOST}:${REMOTE_PATH}/"

echo ""
echo "Deploy of $APP_NAME complete."
