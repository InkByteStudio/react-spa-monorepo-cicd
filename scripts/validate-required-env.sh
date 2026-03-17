#!/usr/bin/env bash
# =============================================================================
# validate-required-env.sh
#
# Validates that all required environment variables are set and non-empty.
#
# Usage:
#   source scripts/validate-required-env.sh DEPLOY_HOST DEPLOY_USER DEPLOY_SSH_KEY
#   -- or --
#   bash scripts/validate-required-env.sh DEPLOY_HOST DEPLOY_USER DEPLOY_SSH_KEY
#
# Exits with code 1 if any variable is missing or empty.
# =============================================================================

set -euo pipefail

missing=0

for var_name in "$@"; do
  if [ -z "${!var_name:-}" ]; then
    echo "ERROR: Required environment variable '$var_name' is not set or is empty." >&2
    missing=1
  fi
done

if [ "$missing" -eq 1 ]; then
  echo "" >&2
  echo "Set the missing variables and try again." >&2
  echo "See docs/DEPLOY_FLOW.md for required configuration." >&2
  exit 1
fi

echo "All required environment variables are set."
