#!/usr/bin/env bash
# ==============================================================================
# Monar Pass — one-command deploy
# ==============================================================================
# Run this from YOUR OWN computer (not the server), in the project folder:
#
#     ./deploy/deploy-hostinger.sh
#
# It will ask for the SSH password once, then do everything:
#   build → backup the live site → upload → keep .env & runtime data →
#   add the security variables → migrate the database → health check.
#
# If you prefer a key (no password prompt, works every time):
#   1. ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_monar -C "monar-deploy"
#   2. Copy the output of: cat ~/.ssh/id_ed25519_monar.pub
#      into hPanel → Advanced → SSH Keys → Add
#   3. KEY_FILE=~/.ssh/id_ed25519_monar ./deploy/deploy-hostinger.sh
# ==============================================================================
set -euo pipefail

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

# ── 0. Ask for the password once if no key is available ───────────────────────
SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=15)
USE_KEY=0
if [ -f "$KEY_FILE" ]; then
  SSH_OPTS+=(-i "$KEY_FILE" -o IdentitiesOnly=yes)
  USE_KEY=1
fi

if [ "$USE_KEY" -eq 0 ]; then
  echo "==> SSH password for $SSH_USER@$SSH_HOST will be requested (not stored)."
  export SSH_PASSWORD="${SSH_PASSWORD:-$(ssh-ask-pass 2>/dev/null || true)}"
  if [ -z "$SSH_PASSWORD" ]; then
    read -r -s -p "SSH password for $SSH_USER@$SSH_HOST: " SSH_PASSWORD
    echo
    export SSH_PASSWORD
  fi
  export SSHPASS="$SSH_PASSWORD"
  SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
fi

ssh_cmd() { ssh "${SSH_OPTS[@]}" "$SSH_USER@$SSH_HOST" "$@"; }
scp_cmd() { scp -P "$SSH_PORT" -o StrictHostKeyChecking=no ${KEY_FILE:+-i "$KEY_FILE"} ${KEY_FILE:+-o IdentitiesOnly=yes} "$@"; }

echo "==> [0/6] Checking the connection"
if ! ssh_cmd "echo connected" >/dev/null 2>&1; then
  cat <<'MSG'

❌ SSH se connect nahi ho saka.

  • Password check karein (hPanel → Account → Password).
  • hPanel → Advanced → SSH mein "Enabled" aur "Root/Account access" ON hona chahiye.
  • Agar aapne pehle kai galat attempts diye hain to Hostinger IP ko thodi der ke
    liye block kar deta hai — 15-30 min wait karke dobara try karein.
  • Best: apni SSH key add karein (upar wali instructions).

MSG
  exit 1
fi
echo "    ✓ connected"

echo "==> [1/6] Build"
if [ "$SKIP_BUILD" -eq 0 ]; then
  npm run build
else
  [ -d dist ] || { echo "dist/ missing — run without --skip-build"; exit 1; }
  echo "    (skipped)"
fi

echo "==> [2/6] Sanity check"
for f in dist/backend/config/.env dist/backend/data/admins.json; do
  [ -f "$f" ] && { echo "    ✗ $f would be uploaded — aborting"; exit 1; }
done
echo "    ✓ no secrets or runtime data in dist/"

echo "==> [3/6] Archive"
ARCHIVE="$(mktemp -d)/deploy.zip"
( cd dist && zip -qr "$ARCHIVE" . -x "*.DS_Store" -x "__MACOSX*" )
echo "    → $(du -h "$ARCHIVE" | cut -f1)"

echo "==> [4/6] Backup + upload"
ssh_cmd "cd '$REMOTE_DIR' && tar czf /tmp/monar_backup_\$(date +%Y%m%d_%H%M%S).tar.gz . 2>/dev/null || true"
scp_cmd "$ARCHIVE" "$SSH_USER@$SSH_HOST:/tmp/monar_deploy.zip"
echo "    ✓ uploaded"

echo "==> [5/6] Extract (keeping .env and the live data)"
ssh_cmd "
  set -e
  cd '$REMOTE_DIR'
  find . -mindepth 1 -maxdepth 1 ! -name 'backend' -exec rm -rf {} +
  if [ -d backend ]; then
    find backend -mindepth 1 -maxdepth 1 ! -name 'config' ! -name 'data' -exec rm -rf {} +
    if [ -f backend/config/.env ]; then cp backend/config/.env /tmp/monar_env_keep; fi
    find backend/config -mindepth 1 -exec rm -rf {} +
    mkdir -p backend/config
    if [ -f /tmp/monar_env_keep ]; then mv /tmp/monar_env_keep backend/config/.env; chmod 600 backend/config/.env; fi
    mkdir -p backend/data
    find backend/data -mindepth 1 ! -name '*.json' ! -name '.cred_key' -exec rm -rf {} +
  fi
  unzip -oq /tmp/monar_deploy.zip -d . 2>/dev/null \
    || python3 -c \"import zipfile;zipfile.ZipFile('/tmp/monar_deploy.zip').extractall('.')\"
  rm -f /tmp/monar_deploy.zip
  chown -R \$USER:\$USER . 2>/dev/null || true
  find . -type d -exec chmod 755 {} + 2>/dev/null || true
  find . -type f -exec chmod 644 {} + 2>/dev/null || true
  chmod 600 backend/config/.env 2>/dev/null || true
"

echo "==> [5b/6] Security variables in .env"
ssh_cmd "
  set -e
  cd '$REMOTE_DIR'
  ENVF=backend/config/.env
  [ -f \"\$ENVF\" ] || { echo 'FATAL: backend/config/.env missing'; exit 1; }
  add_if_missing () { grep -q \"^\$1=\" \"\$ENVF\" || printf '%s\n' \"\$2\" >> \"\$ENVF\"; }
  add_if_missing SITE_URL 'SITE_URL=$SITE_URL'
  add_if_missing ADMIN_ALLOW_DATE_PASSWORD 'ADMIN_ALLOW_DATE_PASSWORD=false'
  add_if_missing AUTH_FORCE_PASSWORD_CHANGE 'AUTH_FORCE_PASSWORD_CHANGE=true'
  add_if_missing AUTH_MAX_LOGIN_ATTEMPTS 'AUTH_MAX_LOGIN_ATTEMPTS=8'
  add_if_missing AUTH_LOCKOUT_MINUTES 'AUTH_LOCKOUT_MINUTES=15'
  add_if_missing WORLDFIRST_DEFAULT_RENT 'WORLDFIRST_DEFAULT_RENT=909.00'
  if ! grep -q '^ADMIN_CRED_KEY=' \"\$ENVF\" || grep -q '^ADMIN_CRED_KEY=change-me' \"\$ENVF\"; then
    KEY=\$(php -r 'echo bin2hex(random_bytes(32));')
    sed -i \"/^ADMIN_CRED_KEY=/d\" \"\$ENVF\"
    printf 'ADMIN_CRED_KEY=%s\n' \"\$KEY\" >> \"\$ENVF\"
  fi
  if ! grep -q '^ADMIN_SUPER_PASSWORD=' \"\$ENVF\" || grep -q '^ADMIN_SUPER_PASSWORD=change-me' \"\$ENVF\"; then
    PW=\$(php -r 'echo bin2hex(random_bytes(12));')
    sed -i \"/^ADMIN_SUPER_PASSWORD=/d\" \"\$ENVF\"
    printf 'ADMIN_SUPER_PASSWORD=%s\n' \"\$PW\" >> \"\$ENVF\"
    printf '\\n@@@@@@@@@@@@@@@@@@@@@@@@\\n'
    printf '  SUPER ADMIN PASSWORD (save it!): %s\\n' \"\$PW\"
    printf '  Login: /dev/   username: dev\\n'
    printf '@@@@@@@@@@@@@@@@@@@@@@@@\\n'
  else
    echo '    ADMIN_SUPER_PASSWORD already set — left untouched.'
  fi
"

echo "==> [5c/6] Database migration"
ssh_cmd "cd '$REMOTE_DIR' && php backend/migrations/migrate.php 2>&1 | tail -6" || echo "    (migration output above)"
ssh_cmd "cd '$REMOTE_DIR' && php backend/migrations/seed_residents.php 2>&1 | tail -4" || true

echo "==> [6/6] Verify"
for p in "" admin dev dashboard floor-plans contact; do
  printf "    /%-14s → HTTP %s\n" "$p" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$p/")"
done
printf "    .env leak    → HTTP %s (want 403)\n" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/config/.env")"
printf "    admins leak  → HTTP %s (want 403)\n" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/data/admins.json")"
printf "    wf history   → HTTP %s (want 401)\n" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/api/worldfirst.php?action=history")"
printf "    chat list    → HTTP %s (want 401)\n" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/api/chat.php?action=sessions")"

cat <<'MSG'

✅ Deploy complete.

  Reminders:
   • /dev/  login = "dev" + the super-admin password printed above
   • admin / manager accounts must set a new password on first login
   • Resident portal default: sarah.johnson@email.com / unit 2104 / Resident@2026
MSG
