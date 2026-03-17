#!/usr/bin/env bash
# =============================================================================
# rollback-spa.sh
#
# Restores a SPA deployment from a timestamped backup created by deploy-spa.sh.
#
# Backups are created automatically before each deployment at:
#   <deploy-path>.backup.<timestamp>
#
# Usage:
#   bash scripts/rollback-spa.sh admin-spa              # restore most recent backup
#   bash scripts/rollback-spa.sh admin-spa 1710600000   # restore specific backup
#   DRY_RUN=true bash scripts/rollback-spa.sh admin-spa # preview only
#
# Required environment variables:
#   DEPLOY_HOST               - Target server hostname or IP
#   DEPLOY_USER               - SSH username
#   DEPLOY_<APP_UPPER>_PATH   - Remote path (e.g., DEPLOY_ADMIN_SPA_PATH)
#
# Optional:
#   DEPLOY_PORT            - SSH port (default: 22)
#   DRY_RUN                - Set to "true" to preview without restoring
#   HEALTH_CHECK_URL       - If set, runs a health check after rollback
#   HEALTH_CHECK_PATH      - Path for health check (default: /)
#   HEALTH_CHECK_CONTENT   - Optional content to verify in response
# =============================================================================

set -euo pipefail

APP_NAME="${1:?Usage: rollback-spa.sh <app-name> [timestamp]}"
TIMESTAMP="${2:-}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$REPO_ROOT/scripts"

# Validate app name to prevent path traversal
if [[ ! "$APP_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "ERROR: Invalid app name '$APP_NAME'. Only lowercase letters, digits, and hyphens are allowed." >&2
  exit 1
fi

# Convert app-name to UPPER_SNAKE for env var lookup
APP_UPPER=$(echo "$APP_NAME" | tr '[:lower:]-' '[:upper:]_')
DEPLOY_PATH_VAR="DEPLOY_${APP_UPPER}_PATH"

# Validate required env vars
source "$SCRIPT_DIR/validate-required-env.sh" DEPLOY_HOST DEPLOY_USER "$DEPLOY_PATH_VAR"

DEPLOY_PORT="${DEPLOY_PORT:-22}"
REMOTE_PATH="${!DEPLOY_PATH_VAR}"
DRY_RUN="${DRY_RUN:-false}"
SSH_ARGS=(-p "$DEPLOY_PORT" -i ~/.ssh/deploy_key)

echo "Looking for backups of $APP_NAME at $DEPLOY_HOST:$REMOTE_PATH..."

if [ -z "$TIMESTAMP" ]; then
  # Find the most recent backup
  LATEST=$(ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "ls -1d '${REMOTE_PATH}'.backup.* 2>/dev/null | sort -t. -k3 -n | tail -1" || true)

  if [ -z "$LATEST" ]; then
    echo "ERROR: No backups found for $REMOTE_PATH" >&2
    exit 1
  fi

  echo "Most recent backup: $LATEST"
  BACKUP_PATH="$LATEST"
else
  # Validate timestamp is numeric only
  if [[ ! "$TIMESTAMP" =~ ^[0-9]+$ ]]; then
    echo "ERROR: Invalid timestamp '$TIMESTAMP'. Must be numeric." >&2
    exit 1
  fi

  BACKUP_PATH="${REMOTE_PATH}.backup.${TIMESTAMP}"

  # Verify it exists
  if ! ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "test -d '$BACKUP_PATH'" 2>/dev/null; then
    echo "ERROR: Backup not found: $BACKUP_PATH" >&2
    echo ""
    echo "Available backups:"
    ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "ls -1d '${REMOTE_PATH}'.backup.* 2>/dev/null" || echo "  (none)"
    exit 1
  fi

  echo "Using backup: $BACKUP_PATH"
fi

if [ "$DRY_RUN" = "true" ]; then
  echo ""
  echo "=== DRY RUN — would restore $BACKUP_PATH to $REMOTE_PATH ==="
  echo "Files in backup:"
  ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "ls -la '$BACKUP_PATH/'"
  exit 0
fi

echo ""
echo "Restoring $BACKUP_PATH -> $REMOTE_PATH..."

# Create a pre-rollback snapshot of the current state (safety net)
PRE_ROLLBACK="${REMOTE_PATH}.pre-rollback.$(date +%s)"
echo "Saving current state to $PRE_ROLLBACK..."
ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" \
  "if [ -d \"${REMOTE_PATH}\" ]; then cp -r \"${REMOTE_PATH}\" \"${PRE_ROLLBACK}\"; fi"

# Replace current deployment with backup
ssh "${SSH_ARGS[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}" "rm -rf \"${REMOTE_PATH}\" && cp -r \"${BACKUP_PATH}\" \"${REMOTE_PATH}\""

echo "Rollback of $APP_NAME complete."

# Post-rollback health check
if [ -n "${HEALTH_CHECK_URL:-}" ]; then
  echo ""
  echo "Running post-rollback health check..."
  bash "$SCRIPT_DIR/health-check.sh" || echo "WARNING: Post-rollback health check failed." >&2
fi
