#!/usr/bin/env bash
# Set every GitHub Actions secret for the monportfolio CI/CD pipeline via `gh`.
# Idempotent (gh secret set overwrites). Values are read from local files / this config
# block and piped to `gh` — never echoed. See docs/DEVOPS-SECRETS.md.
#
# Prereqs:  gh auth login   (scope: repo)   +   filled .env.staging / .env.prod
# Config:   scripts/secrets.local.env (gitignoré) surcharge les défauts ci-dessous.
# Run:      bash scripts/setup-secrets.sh
#
# Rien n'est poussé tant que la configuration n'est pas complète : valeurs placeholder
# (example.com, __X__) ou fichiers requis absents → arrêt AVANT le premier `gh secret set`.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"
# shellcheck disable=SC1091
[ -f scripts/secrets.local.env ] && . scripts/secrets.local.env

# ─────────────────────────────── CONFIG (edit me) ───────────────────────────────
# Which environments to configure. Drop "prod" for a staging-only setup, etc.
DEPLOY_TARGETS="${DEPLOY_TARGETS:-staging prod}"

# Target repo (owner/name). Empty → gh infers it from the current git remote.
REPO="${REPO:-}"

# Optional HTTPS clone URL for fresh-host init. Empty → skip (workflow default is used).
REPO_URL="${REPO_URL:-}"

# Per-environment host wiring. SSH_KEY_* points at a PRIVATE key FILE (PEM).
STAGING_HOST="${STAGING_HOST:-staging.example.com}"
STAGING_PATH="${STAGING_PATH:-/opt/monportfolio-staging}"
STAGING_SSH_USER="${STAGING_SSH_USER:-}"          # empty → workflow default (root)
STAGING_SSH_KEY_FILE="${STAGING_SSH_KEY_FILE:-$HOME/.ssh/monportfolio_deploy}"

PROD_HOST="${PROD_HOST:-example.com}"
PROD_PATH="${PROD_PATH:-/opt/monportfolio-prod}"
PROD_SSH_USER="${PROD_SSH_USER:-}"
PROD_SSH_KEY_FILE="${PROD_SSH_KEY_FILE:-$HOME/.ssh/monportfolio_deploy}"
# ─────────────────────────────────────────────────────────────────────────────────

GH=(gh secret set)
[ -n "$REPO" ] && GH+=(--repo "$REPO")

command -v gh >/dev/null || { echo "✖ gh CLI not found (https://cli.github.com)"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "✖ run 'gh auth login' first"; exit 1; }

# ─── Pré-validation : aucun secret poussé tant que tout n'est pas cohérent ───────────
fail() { echo "✖ $*" >&2; exit 1; }
is_placeholder() { case "$1" in ''|__*|*example.com|*example.org|*example.net) return 0;; esac; return 1; }

for env in $DEPLOY_TARGETS; do
  up=$(printf '%s' "$env" | tr '[:lower:]' '[:upper:]')
  eval "host=\${${up}_HOST}; path=\${${up}_PATH}; keyfile=\${${up}_SSH_KEY_FILE}"
  is_placeholder "$host" && fail "${up}_HOST non renseigné (scripts/secrets.local.env)"
  [ -n "$path" ]       || fail "${up}_PATH vide"
  [ -f ".env.${env}" ] || fail "ENV_${up} : .env.${env} absent (modèle .env.${env}.example)"
  [ -f "$keyfile" ]    || fail "${up}_SSH_KEY : clé privée absente ($keyfile) — ssh-keygen -t ed25519 -f $keyfile"
  grep -q '^COMPOSE_FILE=compose.yaml:compose.deploy.yaml' ".env.${env}" \
    || fail ".env.${env} : ligne COMPOSE_FILE=compose.yaml:compose.deploy.yaml manquante (cf. modèle)"
done

set_from_file() { # NAME FILE  → set secret from a dotenv/key file (whole content)
  local name="$1" file="$2"
  [ -f "$file" ] || fail "$name — fichier absent : $file"
  "${GH[@]}" "$name" < "$file" && echo "✓ $name  ← $file"
}
set_value() {     # NAME VALUE → set secret from a literal (skips empty = optional)
  local name="$1" value="$2"
  [ -n "$value" ] || { echo "· skip $name (empty, optional)"; return; }
  printf '%s' "$value" | "${GH[@]}" "$name" && echo "✓ $name"
}

echo "→ Setting secrets for: ${DEPLOY_TARGETS}"

# Shared. The edge (Let's Encrypt contact) is owned by the infra-vps repo: nothing here.
set_value REPO_URL "$REPO_URL"

for env in $DEPLOY_TARGETS; do
  up=$(printf '%s' "$env" | tr '[:lower:]' '[:upper:]')
  eval "host=\${${up}_HOST}; path=\${${up}_PATH}; user=\${${up}_SSH_USER}; keyfile=\${${up}_SSH_KEY_FILE}"
  set_from_file "ENV_${up}"     ".env.${env}"
  set_from_file "${up}_SSH_KEY" "$keyfile"
  set_value     "${up}_HOST"     "$host"
  set_value     "${up}_PATH"     "$path"
  set_value     "${up}_SSH_USER" "$user"
done

echo "✔ done. Verify: gh secret list${REPO:+ --repo $REPO}"
