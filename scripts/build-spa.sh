#!/usr/bin/env bash
# =============================================================================
# build-spa.sh
#
# Builds a SPA application by name.
# Runs the app's build script via pnpm and verifies the dist/ output exists.
#
# Optionally accepts an environment mode (staging, production) which is passed
# to Vite's --mode flag. Vite loads .env.<mode> for environment-specific builds.
#
# Usage:
#   bash scripts/build-spa.sh admin-spa
#   bash scripts/build-spa.sh admin-spa staging
#   bash scripts/build-spa.sh portal-spa production
# =============================================================================

set -euo pipefail

APP_NAME="${1:?Usage: build-spa.sh <app-name> [mode]}"
BUILD_MODE="${2:-}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Validate app name to prevent path traversal
if [[ ! "$APP_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "ERROR: Invalid app name '$APP_NAME'. Only lowercase letters, digits, and hyphens are allowed." >&2
  exit 1
fi

APP_DIR="$REPO_ROOT/apps/$APP_NAME"

# Verify the app directory exists
if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: App directory not found: $APP_DIR" >&2
  exit 1
fi

if [ -n "$BUILD_MODE" ]; then
  echo "Building $APP_NAME (mode: $BUILD_MODE)..."
  pnpm --filter "@repo/$APP_NAME" build -- --mode "$BUILD_MODE"
else
  echo "Building $APP_NAME..."
  pnpm --filter "@repo/$APP_NAME" build
fi

# Verify dist output was created
if [ ! -d "$APP_DIR/dist" ]; then
  echo "ERROR: Build completed but dist/ directory was not created at $APP_DIR/dist" >&2
  exit 1
fi

FILE_COUNT=$(find "$APP_DIR/dist" -type f | wc -l)
echo "Build successful. $FILE_COUNT files in $APP_DIR/dist/"
