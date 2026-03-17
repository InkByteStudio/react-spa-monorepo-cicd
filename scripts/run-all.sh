#!/usr/bin/env bash
set -euo pipefail

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ─── State ────────────────────────────────────────────────────────────────────
DOCKER_UP=false
RESULTS=()
STEP_NAMES=()
FAILED=0

# ─── Helpers ──────────────────────────────────────────────────────────────────
step() {
  local name="$1"
  shift
  STEP_NAMES+=("$name")
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}  ▶ ${name}${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""

  if "$@"; then
    RESULTS+=("PASS")
    echo ""
    echo -e "  ${GREEN}✔ ${name} — PASSED${NC}"
    return 0
  else
    RESULTS+=("FAIL")
    FAILED=1
    echo ""
    echo -e "  ${RED}✘ ${name} — FAILED${NC}"
    return 1
  fi
}

cleanup() {
  if $DOCKER_UP; then
    echo ""
    echo -e "${YELLOW}Tearing down Docker…${NC}"
    docker compose -f docker/docker-compose.yml down --remove-orphans 2>/dev/null
  fi
}
trap cleanup EXIT

print_summary() {
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}  SUMMARY${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  for i in "${!STEP_NAMES[@]}"; do
    local result="${RESULTS[$i]}"
    if [[ "$result" == "PASS" ]]; then
      echo -e "  ${GREEN}✔${NC}  ${STEP_NAMES[$i]}"
    else
      echo -e "  ${RED}✘${NC}  ${STEP_NAMES[$i]}"
    fi
  done
  echo ""
  if [[ $FAILED -eq 0 ]]; then
    echo -e "  ${GREEN}${BOLD}All steps passed!${NC}"
  else
    echo -e "  ${RED}${BOLD}Some steps failed. See output above.${NC}"
  fi
  echo ""
}

# ─── Change to repo root ─────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo -e "${BOLD}"
echo "  ┌─────────────────────────────────────────┐"
echo "  │   Multiapp Monorepo — Full Pipeline Run  │"
echo "  └─────────────────────────────────────────┘"
echo -e "${NC}"

# ─── Steps ────────────────────────────────────────────────────────────────────

# 1. Install
step "Install dependencies" pnpm install

# 2. Lint
step "Lint" pnpm lint

# 3. Typecheck
step "Typecheck" pnpm typecheck

# 4. Unit tests
step "Unit tests" pnpm test

# 5. Build
step "Build admin-spa" pnpm build:admin-spa
step "Build portal-spa" pnpm build:portal-spa
step "Build main-site" pnpm build:main-site

# 6. Docker up
if step "Start Docker (nginx)" docker compose -f docker/docker-compose.yml up -d; then
  DOCKER_UP=true
fi
# Give nginx a moment to start
sleep 2

# 7. Verify endpoints
step "Verify endpoints" bash -c '
  all_ok=true
  for endpoint in "/" "/admin/" "/portal/"; do
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080${endpoint}")
    if [[ "$status" == "200" ]]; then
      echo -e "  \033[0;32m✔\033[0m ${endpoint} → HTTP ${status}"
    else
      echo -e "  \033[0;31m✘\033[0m ${endpoint} → HTTP ${status}"
      all_ok=false
    fi
  done
  $all_ok
'

# 8. Install Playwright browsers (if needed)
step "Install Playwright browsers" npx playwright install chromium

# 9. E2E tests (update snapshots automatically for current platform)
step "E2E tests (Playwright)" pnpm test:e2e:update-snapshots

# 10. Docker down happens in trap

# ─── Summary ──────────────────────────────────────────────────────────────────
print_summary
exit $FAILED
