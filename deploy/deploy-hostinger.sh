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

echo "==> [1/6] Build"
if [ "$SKIP_BUILD" -eq 0 ]; then
  npm run build
else
  echo "    (skipped)"
  [ -d dist ] || { echo "dist/ missing — run without --skip-build"; exit 1; }
fi

echo "==> [2/6] Sanity check: sensitive files must NOT be in dist/"
for f in dist/backend/config/.env dist/backend/data/admins.json; do
  if [ -f "$f" ]; then
    echo "    ✗ $f would be uploaded — aborting"; exit 1
  fi
done
echo "    ✓ no .env / admins.json in dist"

echo "==> [3/6] Create archive"
ARCHIVE="$(mktemp -d)/deploy.zip"
( cd dist && zip -qr "$ARCHIVE" . -x "*.DS_Store" -x "__MACOSX*" )
echo "    → $(du -h "$ARCHIVE" | cut -f1)"

SSH_OPTS=(-p "$SSH_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=15)
if [ -f "$KEY_FILE" ]; then
  SSH_OPTS+=(-i "$KEY_FILE" -o IdentitiesOnly=yes)
fi

# Password auth support: SSH_PASSWORD=<hpanel password> ./deploy-hostinger.sh
SSH_PASS_ARGS=()
if [ -n "${SSH_PASSWORD:-}" ]; then
  command -v sshpass >/dev/null 2>&1 || { echo "sshpass is required for password auth"; exit 1; }
  export SSHPASS="$SSH_PASSWORD"
  SSH_PASS_ARGS=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
  echo "    (using password auth as $SSH_USER)"
else
  echo "    (using SSH key $KEY_FILE as $SSH_USER)"
fi

ssh_cmd() { ssh "${SSH_OPTS[@]}" "${SSH_PASS_ARGS[@]}" "$SSH_USER@$SSH_HOST" "$@"; }
scp_cmd() { scp -P "$SSH_PORT" -o StrictHostKeyChecking=no ${KEY_FILE:+-i "$KEY_FILE"} ${KEY_FILE:+-o IdentitiesOnly=yes} "${SSH_PASS_ARGS[@]}" "$@"; }

echo "==> [4/6] Upload to $SSH_USER@$SSH_HOST:$REMOTE_DIR"
# Preflight: fail fast with a clear message if SSH is not usable.
if ! ssh_cmd "echo connected" >/dev/null 2>&1; then
  echo
  echo "❌ SSH se connect nahi ho saka."
  echo "   - key add karein: hPanel → Advanced → SSH Keys → Add"
  echo "   - ya password dein: SSH_PASSWORD='...' ./deploy/deploy-hostinger.sh"
  echo "   - host=$SSH_HOST port=$SSH_PORT user=$SSH_USER"
  exit 1
fi
# Back up the current live tree before overwriting.
ssh_cmd \
  "cd '$REMOTE_DIR' && tar czf /tmp/monar_backup_\$(date +%Y%m%d_%H%M%S).tar.gz . 2>/dev/null || true"
scp_cmd "$ARCHIVE" "$SSH_USER@$SSH_HOST:/tmp/monar_deploy.zip"
ssh_cmd "
  set -e
  cd '$REMOTE_DIR'
  # ── Wipe the app files, but PRESERVE the two things that only live here ──
  #    backend/config/.env  → DB + WorldFirst secrets (must never be lost)
  #    backend/data/*.json  → admins.json, transactions, inquiries, tours, chat
  #                          (wiping these resets every admin account and
  #                           destroys the property's live data)
  find . -mindepth 1 -maxdepth 1 ! -name 'backend' -exec rm -rf {} +

  if [ -d backend ]; then
    # Code directories: wipe completely so stale files never linger.
    find backend -mindepth 1 -maxdepth 1 ! -name 'config' ! -name 'data' -exec rm -rf {} +

    # config: keep ONLY the real .env, everything else is re-deployed.
    if [ -f backend/config/.env ]; then
      cp backend/config/.env /tmp/monar_env_keep
    fi
    find backend/config -mindepth 1 -exec rm -rf {} +
    mkdir -p backend/config
    if [ -f /tmp/monar_env_keep ]; then
      mv /tmp/monar_env_keep backend/config/.env
      chmod 600 backend/config/.env
    fi

    # data: keep the runtime JSON stores + credential key, wipe the rest.
    mkdir -p backend/data
    find backend/data -mindepth 1 ! -name '*.json' ! -name '.cred_key' -exec rm -rf {} +
  fi

  unzip -oq /tmp/monar_deploy.zip -d . 2>/dev/null \
    || python3 -c \"import zipfile;zipfile.ZipFile('/tmp/monar_deploy.zip').extractall('.')\" \
    || php -r \"\$z=new ZipArchive;\$z->open('/tmp/monar_deploy.zip');\$z->extractTo('.');\$z->close();\"
  rm -f /tmp/monar_deploy.zip
  chown -R \$USER:\$USER . 2>/dev/null || true
  find . -type d -exec chmod 755 {} + 2>/dev/null || true
  find . -type f -exec chmod 644 {} + 2>/dev/null || true
  chmod 600 backend/config/.env 2>/dev/null || true
  echo 'extracted'
"

echo "==> [5/6] Make sure the server .env has the security variables"
# The new auth layer needs these. If the server's .env predates them, add them
# now — otherwise the super admin would be locked out after the update.
ssh_cmd "
  set -e
  cd '$REMOTE_DIR'
  ENVF=backend/config/.env
  [ -f \"\$ENVF\" ] || { echo 'FATAL: backend/config/.env missing on the server'; exit 1; }

  add_if_missing () {
    grep -q \"^\$1=\" \"\$ENVF\" || printf '%s\n' \"\$2\" >> \"\$ENVF\"
  }

  add_if_missing SITE_URL 'SITE_URL=$SITE_URL'
  add_if_missing ADMIN_ALLOW_DATE_PASSWORD 'ADMIN_ALLOW_DATE_PASSWORD=false'
  add_if_missing AUTH_FORCE_PASSWORD_CHANGE 'AUTH_FORCE_PASSWORD_CHANGE=true'
  add_if_missing AUTH_MAX_LOGIN_ATTEMPTS 'AUTH_MAX_LOGIN_ATTEMPTS=8'
  add_if_missing AUTH_LOCKOUT_MINUTES 'AUTH_LOCKOUT_MINUTES=15'
  add_if_missing WORLDFIRST_DEFAULT_RENT 'WORLDFIRST_DEFAULT_RENT=909.00'

  # Credential + super-admin keys: generate once and never overwrite.
  if ! grep -q '^ADMIN_CRED_KEY=' \"\$ENVF\" || grep -q '^ADMIN_CRED_KEY=change-me' \"\$ENVF\"; then
    KEY=\$(php -r 'echo bin2hex(random_bytes(32));')
    sed -i \"/^ADMIN_CRED_KEY=/d\" \"\$ENVF\"
    printf 'ADMIN_CRED_KEY=%s\n' \"\$KEY\" >> \"\$ENVF\"
  fi
  if ! grep -q '^ADMIN_SUPER_PASSWORD=' \"\$ENVF\" || grep -q '^ADMIN_SUPER_PASSWORD=change-me' \"\$ENVF\"; then
    PW=\$(php -r 'echo bin2hex(random_bytes(12));')
    sed -i \"/^ADMIN_SUPER_PASSWORD=/d\" \"\$ENVF\"
    printf 'ADMIN_SUPER_PASSWORD=%s\n' \"\$PW\" >> \"\$ENVF\"
    printf '\n@@@@@@@@@@@@@@@@@@@@@@@@\n'
    printf '  SUPER ADMIN PASSWORD (save it!): %s\n' \"\$PW\"
    printf '  Login: /dev/  username: dev\n'
    printf '@@@@@@@@@@@@@@@@@@@@@@@@\n'
  else
    echo 'ADMIN_SUPER_PASSWORD already set — left untouched.'
  fi
  echo '.env is ready.'
"

echo "==> [6/6] Verify"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/")
echo "    home      → HTTP $CODE"
for p in admin dev dashboard floor-plans contact; do
  printf "    /%-14s → HTTP %s\n" "$p" "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/$p/")"
done
printf "    .env leak   → HTTP %s (expect 403)\n" \
  "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/config/.env")"
printf "    admins leak → HTTP %s (expect 403)\n" \
  "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/data/admins.json")"
printf "    wf history  → HTTP %s (expect 401)\n" \
  "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/api/worldfirst.php?action=history")"
printf "    chat list   → HTTP %s (expect 401)\n" \
  "$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/backend/api/chat.php?action=sessions")"

echo
echo "✅ Deploy complete. Previous version backed up in /tmp/monar_backup_*.tar.gz on the server."
echo "   Next: run the DB migration for the new tables —"
echo "     ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'cd $REMOTE_DIR && php backend/migrations/migrate.php'"
echo "   and seed the resident portal login —"
echo "     ssh -p $SSH_PORT $SSH_USER@$SSH_HOST 'cd $REMOTE_DIR && php backend/migrations/seed_residents.php'"

