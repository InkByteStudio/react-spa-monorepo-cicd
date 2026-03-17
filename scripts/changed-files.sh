#!/usr/bin/env bash
# =============================================================================
# changed-files.sh
#
# Checks if any files changed under a given path prefix.
# Supports GitHub Actions, GitLab CI, and local development.
#
# Usage:
#   bash scripts/changed-files.sh apps/admin-spa
#   bash scripts/changed-files.sh packages/shared-ui
#
# Outputs "true" or "false" to stdout.
#
# In CI, this compares against the merge base. Locally, it compares HEAD~1.
# Note: Primary change detection is handled by CI-native mechanisms
# (dorny/paths-filter for GitHub, rules:changes for GitLab).
# This script is a utility for manual checks or custom workflows.
# =============================================================================

set -euo pipefail

PATH_PREFIX="${1:?Usage: changed-files.sh <path-prefix>}"

# Determine the base commit to compare against
if [ -n "${GITHUB_BASE_REF:-}" ]; then
  # GitHub Actions pull request
  BASE="origin/$GITHUB_BASE_REF"
elif [ -n "${CI_MERGE_REQUEST_DIFF_BASE_SHA:-}" ]; then
  # GitLab merge request pipeline
  BASE="$CI_MERGE_REQUEST_DIFF_BASE_SHA"
elif [ -n "${CI_COMMIT_BEFORE_SHA:-}" ] && [ "$CI_COMMIT_BEFORE_SHA" != "0000000000000000000000000000000000000000" ]; then
  # GitLab push pipeline
  BASE="$CI_COMMIT_BEFORE_SHA"
else
  # Local fallback — compare against previous commit
  BASE="HEAD~1"
fi

# Check for changes
CHANGED_FILES=$(git diff --name-only "$BASE" HEAD -- "$PATH_PREFIX" 2>/dev/null || true)

if [ -n "$CHANGED_FILES" ]; then
  echo "true"
else
  echo "false"
fi
