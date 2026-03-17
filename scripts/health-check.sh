#!/usr/bin/env bash
# =============================================================================
# health-check.sh
#
# Verifies that deployed apps are accessible and returning valid responses.
# Called as a post-deploy step in CI to catch deploy failures.
#
# Environment variables:
#   HEALTH_CHECK_URL      - Base URL to check (e.g., https://example.com)
#   HEALTH_CHECK_PATH     - Path to check (e.g., /admin/)
#   HEALTH_CHECK_CONTENT  - Optional string to search for in response body
#                           (e.g., "<div id=\"root\">" or "<title>Admin</title>")
#
# If HEALTH_CHECK_URL is not set, exits successfully (no-op).
#
# Usage:
#   HEALTH_CHECK_URL=https://example.com HEALTH_CHECK_PATH=/admin/ bash scripts/health-check.sh
#   HEALTH_CHECK_URL=https://example.com HEALTH_CHECK_CONTENT='<div id="root">' bash scripts/health-check.sh
# =============================================================================

set -euo pipefail

URL="${HEALTH_CHECK_URL:-}"
PATH_TO_CHECK="${HEALTH_CHECK_PATH:-/}"
EXPECTED_CONTENT="${HEALTH_CHECK_CONTENT:-}"

if [ -z "$URL" ]; then
  echo "HEALTH_CHECK_URL not set — skipping health check."
  exit 0
fi

FULL_URL="${URL}${PATH_TO_CHECK}"
echo "Running health check: $FULL_URL"

if [ -n "$EXPECTED_CONTENT" ]; then
  echo "Expected content: $EXPECTED_CONTENT"
fi

MAX_RETRIES=3
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  RESPONSE_FILE=$(mktemp)
  HTTP_STATUS=$(curl -sS --fail-with-body -o "$RESPONSE_FILE" -w "%{http_code}" "$FULL_URL" 2>/dev/null || echo "000")

  if [ "$HTTP_STATUS" = "200" ]; then
    # If expected content is set, verify it exists in the response body
    if [ -n "$EXPECTED_CONTENT" ]; then
      if grep -qF "$EXPECTED_CONTENT" "$RESPONSE_FILE" 2>/dev/null; then
        echo "Health check passed (HTTP $HTTP_STATUS, content verified)"
        rm -f "$RESPONSE_FILE"
        exit 0
      else
        echo "Attempt $i/$MAX_RETRIES: HTTP $HTTP_STATUS but expected content not found"
        rm -f "$RESPONSE_FILE"
        if [ "$i" -lt "$MAX_RETRIES" ]; then
          echo "Retrying in ${RETRY_DELAY}s..."
          sleep "$RETRY_DELAY"
        fi
        continue
      fi
    fi

    echo "Health check passed (HTTP $HTTP_STATUS)"
    rm -f "$RESPONSE_FILE"
    exit 0
  fi

  rm -f "$RESPONSE_FILE"
  echo "Attempt $i/$MAX_RETRIES: HTTP $HTTP_STATUS"

  if [ "$i" -lt "$MAX_RETRIES" ]; then
    echo "Retrying in ${RETRY_DELAY}s..."
    sleep "$RETRY_DELAY"
  fi
done

echo "Health check FAILED after $MAX_RETRIES attempts (last status: $HTTP_STATUS)" >&2
exit 1
