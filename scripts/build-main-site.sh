#!/usr/bin/env bash
# =============================================================================
# build-main-site.sh
#
# Validates the main site structure.
# The main site is static HTML/CSS/JS — there is no build step.
# This script verifies the expected files exist.
#
# Usage:
#   bash scripts/build-main-site.sh
# =============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="$REPO_ROOT/apps/main-site"

echo "Validating main site structure..."

ERRORS=0

if [ ! -f "$SITE_DIR/index.html" ]; then
  echo "ERROR: index.html not found" >&2
  ERRORS=$((ERRORS + 1))
fi

if [ ! -f "$SITE_DIR/css/style.css" ]; then
  echo "ERROR: css/style.css not found" >&2
  ERRORS=$((ERRORS + 1))
fi

if [ "$ERRORS" -gt 0 ]; then
  echo "Validation failed with $ERRORS error(s)." >&2
  exit 1
fi

echo "Main site structure validation passed."
