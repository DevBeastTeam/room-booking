# 🚀 Deploy Runbook — Monar Pass Apartments

3 tareeqe hain. **A** sab se aasan hai (aapke browser me, 2 minute).

---

## 🅰️ Option A — hPanel File Manager (browser, sab se aasan)

**Step 1 — Upload**
1. hPanel → **Files → File Manager** → `public_html` kholein
2. **Upload** button → `deploy.zip` upload karein
   *(yeh file project folder me hai: `deploy.zip`, 497 KB — apne computer par is project wali jagah se lein)*
3. Upload hone ke baad `deploy.zip` par **right-click → Extract**
4. Destination **`public_html`** hi rakhein → **Extract** dabayein
5. Extract ke baad `deploy.zip` **delete** kar dein

**Step 2 — `.env` update** (bahut zaroori)
1. `public_html/backend/config/.env` kholein (right-click → Edit)
2. Neeche ki lines **add** karein (agar pehle se hain to chhor dein):

```ini
ADMIN_SUPER_PASSWORD=<apna ek mazboot password likhein>
ADMIN_ALLOW_DATE_PASSWORD=false
ADMIN_CRED_KEY=<32+ character ka random string>
AUTH_MAX_LOGIN_ATTEMPTS=8
AUTH_LOCKOUT_MINUTES=15
WORLDFIRST_DEFAULT_RENT=909.00
```

> `ADMIN_CRED_KEY` ke liye random string: kisi bhi password generator me 32+ characters,
> ya server terminal me: `php -r "echo bin2hex(random_bytes(32));"`

**Step 3 — Database migrate** (nayi tables chat/resident ke liye)
1. hPanel → **Advanced → Terminal** (ya **SSH**)
2. Ye chalayein:

```bash
cd ~/domains/monarpass.com/public_html
php backend/migrations/migrate.php
php backend/migrations/seed_residents.php
```

**Step 4 — Verify**

```bash
curl -I https://monarpass.com/                     # 200
curl -I https://monarpass.com/backend/config/.env  # 403  (blocked = sahi)
curl -s  https://monarpass.com/backend/api/worldfirst.php?action=history | head -c 60
# {"success":false,...,"code":"unauthorized"}       (401 = fix kaam kar gaya)
```

---

## 🅱️ Option B — SSH (aapko sirf **ek** command chalana hai)

SSH access ho to apne terminal me:

```bash
SSH_PASSWORD='hpanel ka password' ./deploy/deploy-hostinger.sh
```

Script khud: build → backup → upload → `.env` me missing vars inject + generated
`ADMIN_SUPER_PASSWORD` print → DB migrate ka command batayega → health check.

**Ya** SSH key ek baar add kar dein (phir har deploy 1 command):

```bash
mkdir -p ~/.ssh && echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKqHQAWzihYt8pqXp2KPgUFGLqOQ+plkhwZZhF8ya+Ed monarpass-deploy@bot" >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```

Uske baad: `./deploy/deploy-hostinger.sh`

---

## 🅲️ Option C — Git (agar hPanel me repo already connected hai)

Agar hPanel → **Advanced → Git** me yeh repo connected hai, to main ne already
GitHub par push kar diya hai (`master` → `cbd7122`+). Bas hPanel me **Pull**
dabana hai.

> Verify: `curl -s https://monarpass.com/backend/api/chat.php?action=sessions`
> `401` aana chahiye (404 = abhi purana code chal raha hai).

---

## ⚠️ Post-deploy zaroori

1. **`/dev/` login** ab `dev` + naya `ADMIN_SUPER_PASSWORD` se hoga.
   Purana "aaj ki tareekh" (`10`) **kaam nahi karega** — wo 31 me guess ho jata tha.
   Agar date wala chalana hai: `.env` me `ADMIN_ALLOW_DATE_PASSWORD=true`.

2. **`admin` / `manager`** ko pehli baar login par **naya password** set karna parega
   (8+ characters). Purana `12345678` abhi bhi aap ke chat me public hai.

3. **`resident`** ka default login: `sarah.johnson@email.com` / unit `2104` /
   `Resident@2026` (pehli login par password change karna parega).

4. **WorldFirst live payments** ke liye `.env` me ye set hone chahiye:
   `WORLDFIRST_ENV=live`, `WORLDFIRST_API_KEY`, `WORLDFIRST_PRIVATE_KEY`,
   `WORLDFIRST_WEBHOOK_SECRET`. Filhaal `sandbox` hai — live mode mein webhook
   signature verify hota hai aur payment gateway se confirm hona chahiye.

---

## 📦 Deploy package me kya hai

| | |
|---|---|
| Site | Astro static build (13 pages) |
| Backend | 21 PHP API endpoints + migrations |
| `.htaccess` | 6 files (config/data/migrations protection + security headers) |
| Sensitive files | ❌ **zero** — `.env`, `admins.json`, `data/*.json` build se hataye gaye hain |

Server par maujood `backend/config/.env` aur `backend/data/*.json`
(saare admin accounts + live inquiries/tours/transactions) **preserve** hote hain —
deploy unhe delete **nahi** karta.
