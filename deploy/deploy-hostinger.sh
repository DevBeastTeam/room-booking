#!/usr/bin/env bash
# ==============================================================================
# Monar Pass Apartments — Hostinger Deploy
# ==============================================================================
#   ./deploy/deploy-hostinger.sh            # full deploy (build + upload)
#   ./deploy/deploy-hostinger.sh --skip-build
#   SSH_HOST=... SSH_USER=... ./deploy/deploy-hostinger.sh
#
# Requires an SSH key or password access to:
#   user  : u114120454  (or root)
#   host  : 145.223.89.19
#   port  : 65002
#   path  : /home/u114120454/domains/monarpass.com/public_html/
# ==============================================================================
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
SSH_HOST="${SSH_HOST:-145.223.89.19}"
SSH_PORT="${SSH_PORT:-65002}"
SSH_USER="${SSH_USER:-u114120454}"
REMOTE_DIR="${REMOTE_DIR:-/home/u114120454/domains/monarpass.com/public_html}"
SITE_URL="${SITE_URL:-https://monarpass.com}"
KEY_FILE="${KEY_FILE:-$HOME/.ssh/id_ed25519_monar_deploy}"
SKIP_BUILD=0
[ "${1:-}" = "--skip-build" ] && SKIP_BUILD=1

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> [1/5] Build"
if [ "$SKIP_BUILD" -eq 0 ]; then
  npm run build
else
  echo "    (skipped)"
  [ -d dist ] || { echo "dist/ missing — run without --skip-build"; exit 1; }
fi

echo "==> [2/5] Sanity check: sensitive files must NOT be in dist/"
for f in dist/backend/config/.env dist/backend/data/admins.json; do
  if [ -f "$f" ]; then
    echo "    ✗ $f would be uploaded — aborting"; exit 1
  fi
done
echo "    ✓ no .env / admins.json in dist"

echo "==> [3/5] Create archive"
ARCHIVE="$(mktemp -d)/deploy.zip"
( cd dist && zip -qr "$ARCHIVE" . -x "*.DS_Store" -x "__MACOSX*" )
echo "    → $(du -h "$ARCHIVE" | cut -f1)"

SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=15)
if [ -f "$KEY_FILE" ]; then
  SSH_OPTS+=(-i "$KEY_FILE" -o IdentitiesOnly=yes)
fi

echo "==> [4/5] Upload to $SSH_USER@$SSH_HOST:$REMOTE_DIR"
# Back up the current live tree before overwriting.
ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST" \
  "cd '$REMOTE_DIR' && tar czf /tmp/monar_backup_\$(date +%Y%m%d_%H%M%S).tar.gz . 2>/dev/null || true"
scp -P "$SSH_PORT" ${KEY_FILE:+-i "$KEY_FILE"} -o StrictHostKeyChecking=no \
  "$ARCHIVE" "$SSH_USER@$SSH_HOST:/tmp/monar_deploy.zip"
ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST" "
  set -e
  cd '$REMOTE_DIR'
  # Wipe the app files but keep backend/config/.env (it lives only on the server)
  find . -mindepth 1 -maxdepth 1 ! -name 'backend' -exec rm -rf {} +
  if [ -d backend ]; then
    find backend -mindepth 1 -maxdepth 1 ! -name 'config' -exec rm -rf {} +
    [ -d backend/config ] && rm -f backend/config/.env
  fi
  unzip -oq /tmp/monar_deploy.zip -d .
  rm -f /tmp/monar_deploy.zip
  chown -R \$USER:\$USER . 2>/dev/null || true
  find . -type d -exec chmod 755 {} + 2>/dev/null || true
  find . -type f -exec chmod 644 {} + 2>/dev/null || true
  echo 'extracted'
"

echo "==> [5/5] Verify"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/")
echo "    home      → HTTP $CODE"
for p in admin dev dashboard floor-plans contact; do
  printf "    /%-14s → HTTP %s\n" "$p" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$p/")"
done
printf "    .env leak   → HTTP %s (expect 403)\n" \
  "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/config/.env")"
printf "    admins leak → HTTP %s (expect 403)\n" \
  "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/data/admins.json")"

echo
echo "✅ Deploy complete. Previous version backed up in /tmp/monar_backup_*.tar.gz on the server."
echo "   Reminder: set ADMIN_SUPER_PASSWORD in backend/config/.env if you have not yet."
