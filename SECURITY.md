# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.** Instead, send an email to **[INSERT CONTACT EMAIL]** with:

- A description of the vulnerability
- Steps to reproduce it
- Any potential impact

You should receive an acknowledgment within 48 hours. We will work with you to understand the issue and coordinate a fix before any public disclosure.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |

## Security Best Practices for Users

- Never commit `.env` files or secrets to the repository
- Use GitHub Secrets for all deployment credentials (SSH keys, host info)
- Enable GitHub environment protection rules for production deployments
- Keep dependencies up to date — Dependabot is configured to submit weekly PRs
- Run `pnpm audit` regularly to check for known vulnerabilities
