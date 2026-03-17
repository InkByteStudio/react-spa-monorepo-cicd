#!/usr/bin/env bash
# =============================================================================
# ssh-setup.sh
#
# Configures SSH for deployment in CI environments.
# Writes the deploy key, sets permissions, and adds the host to known_hosts.
#
# Required environment variables:
#   DEPLOY_SSH_KEY  - Private SSH key content (PEM format)
#   DEPLOY_HOST     - Target server hostname or IP
#   DEPLOY_PORT     - SSH port (default: 22)
#
# Usage:
#   bash scripts/ssh-setup.sh
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Validate required variables
source "$SCRIPT_DIR/validate-required-env.sh" DEPLOY_SSH_KEY DEPLOY_HOST

DEPLOY_PORT="${DEPLOY_PORT:-22}"

echo "Setting up SSH for deployment to $DEPLOY_HOST:$DEPLOY_PORT..."

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Write the deploy key (use printf to avoid shell interpretation)
printf '%s\n' "$DEPLOY_SSH_KEY" > ~/.ssh/deploy_key
chmod 600 ~/.ssh/deploy_key

# Add the host to known_hosts (skip if already present)
touch ~/.ssh/known_hosts
if ! grep -q "$DEPLOY_HOST" ~/.ssh/known_hosts 2>/dev/null; then
  ssh-keyscan -p "$DEPLOY_PORT" "$DEPLOY_HOST" >> ~/.ssh/known_hosts 2>/dev/null
fi
chmod 644 ~/.ssh/known_hosts

# Create or update SSH config for deploy-target (overwrite if exists)
if grep -q "Host deploy-target" ~/.ssh/config 2>/dev/null; then
  # Remove existing deploy-target block (Host line + indented lines following it)
  sed -i '/^Host deploy-target$/,/^Host \|^$/{ /^Host deploy-target$/d; /^[[:space:]]/d; }' ~/.ssh/config
fi
cat >> ~/.ssh/config <<EOF

Host deploy-target
    HostName $DEPLOY_HOST
    Port $DEPLOY_PORT
    User ${DEPLOY_USER:-deploy}
    IdentityFile ~/.ssh/deploy_key
EOF
chmod 600 ~/.ssh/config

echo "SSH setup complete."
