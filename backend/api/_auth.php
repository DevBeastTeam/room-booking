<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - Shared Authentication & Authorization (Super Admin System)
 * ==============================================================================
 * - Session based login (PHP sessions)
 * - Roles: 'super_admin' (developer /dev panel) and 'admin' (client panel)
 * - Per-admin tab permissions (server-side enforced)
 * - Admin accounts stored in backend/data/admins.json (works without MySQL)
 * - Passwords stored BOTH ways:
 *     password_hash  -> bcrypt, used for login verification
 *     password_enc   -> AES-256 reversible, so super admin can view/reset
 * - All admin actions logged to backend/data/admin_logs.json
 *
 * Har admin API file mein:
 *     require_once dirname(__DIR__) . '/_auth.php';
 *     auth_require_permission('settings'); // tab permission key
 * ==============================================================================
 */

require_once dirname(__DIR__) . '/config/database.php';

// Set application timezone (default Asia/Karachi or from env)
$appEnvVars = function_exists('loadEnvFile') ? loadEnvFile(dirname(__DIR__) . '/config/.env') : [];
$appTz = $appEnvVars['APP_TIMEZONE'] ?? ($_SERVER['APP_TIMEZONE'] ?? 'Asia/Karachi');
if (!empty($appTz)) {
    @date_default_timezone_set($appTz);
}

// ── Tab permission catalog (mirror of AdminPanel sidebar tabs) ────────────────
// Note: 'database' yahan nahi hai — Database Manager sirf dev panel (super
// admin) ke liye hai, client admin ke sidebar mein kabhi nahi dikhta.
const AUTH_TABS = [
    'floorplans', 'units', 'applications', 'residents', 'maintenance',
    'addons', 'emaillogs', 'livechat', 'support', 'pages',
    'settings', 'theme', 'adminactivity',
];

const AUTH_TAB_LABELS = [
    'overview'     => 'Overview',
    'floorplans'   => 'Floor Plans',
    'units'        => 'Units',
    'applications' => 'Applications',
    'residents'    => 'Residents',
    'maintenance'  => 'Maintenance',
    'addons'       => 'Add-ons',
    'emaillogs'    => 'Email Logs',
    'livechat'     => 'Live Chat',
    'support'      => 'Contact Support',
    'pages'        => 'Pages & Legal',
    'settings'     => 'Site Settings',
    'theme'        => 'Theme & Colors',
    'adminactivity' => 'Admin Activity',
];

const AUTH_ROLES = [
    'super_admin' => 'Super Admin (Developer)',
    'admin'       => 'Admin',
];

if (session_status() === PHP_SESSION_NONE) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'path'     => '/',
        'secure'   => $isHttps,
    ]);
    session_start();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function auth_data_dir() {
    $dir = dirname(__DIR__) . '/data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    return $dir;
}

function auth_store_path() {
    return auth_data_dir() . '/admins.json';
}

function auth_log_path() {
    return auth_data_dir() . '/admin_logs.json';
}

/**
 * Credential encryption key.
 *
 * Priority:
 *   1. ADMIN_CRED_KEY from .env  (recommended — set a long random string)
 *   2. A persistent random key stored in backend/data/.cred_key (0600)
 *      → auto-generated so a forgotten .env can never silently fall back
 *        to a publicly known key.
 *
 * The old hardcoded fallback ('monar-default-cred-key-change-in-env') is
 * intentionally gone: anyone with the source could decrypt stored passwords.
 */
function auth_cred_key() {
    static $key = null;
    if ($key !== null) return $key;

    $envVars = loadEnvFile(dirname(__DIR__) . '/config/.env');
    $configured = trim((string)($envVars['ADMIN_CRED_KEY'] ?? ''));

    if ($configured !== '' && !auth_is_default_cred_key($configured)) {
        $key = $configured;
        return $key;
    }

    // Fall back to a persistent, generated key file.
    $keyFile = auth_data_dir() . '/.cred_key';
    if (file_exists($keyFile)) {
        $stored = trim((string)@file_get_contents($keyFile));
        if ($stored !== '') {
            $key = $stored;
            return $key;
        }
    }
    $key = bin2hex(random_bytes(32));
    @file_put_contents($keyFile, $key);
    @chmod($keyFile, 0600);
    error_log('[auth] ADMIN_CRED_KEY missing/default — generated a persistent key at ' . $keyFile
        . '. Set ADMIN_CRED_KEY in backend/config/.env to a stable value.');
    return $key;
}

function auth_is_default_cred_key($value) {
    return $value === 'monar-default-cred-key-change-in-env'
        || $value === 'monar_secret_setup_key_2026'
        || $value === '';
}

/** Env accessor with caching (used across the API layer). */
function auth_env($key, $default = null) {
    static $vars = null;
    if ($vars === null) {
        $vars = loadEnvFile(dirname(__DIR__) . '/config/.env');
    }
    $val = $vars[$key] ?? null;
    if ($val === null || $val === '') {
        return $default;
    }
    return $val;
}

/** True when the value looks like an enabled flag ("1", "true", "yes", "on"). */
function auth_env_flag($key, $default = false) {
    $val = auth_env($key, null);
    if ($val === null) return $default;
    return in_array(strtolower((string)$val), ['1', 'true', 'yes', 'on'], true);
}

/**
 * Super admin password source.
 *
 * - ADMIN_SUPER_PASSWORD set  → strong, stable password (recommended).
 * - ADMIN_ALLOW_DATE_PASSWORD = 1 → the legacy "today's day number" password
 *   is accepted as well. Off by default because the date is guessable.
 */
function auth_super_password() {
    $pw = auth_env('ADMIN_SUPER_PASSWORD', null);
    if ($pw !== null && trim((string)$pw) !== '') {
        return (string)$pw;
    }
    return null;
}

function auth_date_password_enabled() {
    return auth_env_flag('ADMIN_ALLOW_DATE_PASSWORD', true);
}

/** Reversible AES-256-GCM encrypt (for super-admin credential viewing) */
function auth_encrypt($plain) {
    $key = hash('sha256', auth_cred_key(), true);
    $iv  = random_bytes(12);
    $tag = '';
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, '', 16);
    if ($cipher === false) return null;
    return base64_encode($iv . $tag . $cipher);
}

/** AES-256-GCM decrypt (reverse of auth_encrypt) */
function auth_decrypt($payload) {
    if (empty($payload)) return null;
    $key = hash('sha256', auth_cred_key(), true);
    $raw = base64_decode($payload, true);
    if ($raw === false || strlen($raw) < 30) return null;
    $iv     = substr($raw, 0, 12);
    $tag    = substr($raw, 12, 16);
    $cipher = substr($raw, 28);
    $plain  = openssl_decrypt($cipher, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    return $plain === false ? null : $plain;
}

function auth_json_out($success, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    $payload = array_merge(['success' => $success], $data);
    echo json_encode($payload);
    exit();
}

function auth_log($action, $detail = '') {
    $user = auth_current_user();
    $entry = [
        'id'       => 'LOG-' . strtoupper(substr(uniqid(), -8)),
        'actor'    => $user['username'] ?? 'system',
        'role'     => $user['role'] ?? 'system',
        'action'   => $action,
        'detail'   => $detail,
        'ip'       => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'timestamp'=> date('Y-m-d H:i:s'),
    ];
    $logs = [];
    $path = auth_log_path();
    if (file_exists($path)) {
        $logs = json_decode(file_get_contents($path), true) ?: [];
    }
    array_unshift($logs, $entry);
    $logs = array_slice($logs, 0, 200);
    @file_put_contents($path, json_encode($logs, JSON_PRETTY_PRINT));
}

// ── Admin store (JSON file, seeded on first use) ────────────────────────────────

function auth_seed_users() {
    // Default accounts. The two old admin accounts keep their current passwords
    // so nothing breaks; the super admin (dev) is new.
    $now = date('Y-m-d H:i:s');
    $definitions = [
        [
            'id'          => 'USR-DEV',
            'username'    => 'dev',
            'email'       => 'dev@gmail.com',
            'name'        => 'Developer (Super Admin)',
            'role'        => 'super_admin',
            'password'    => 'Dev@Monar2026',
            'permissions' => [],
            'active'      => true,
        ],
        [
            'id'          => 'USR-ADMIN',
            'username'    => 'admin',
            'email'       => 'admin@gmail.com',
            'name'        => 'Property Admin',
            'role'        => 'admin',
            'password'    => '12345678',
            'permissions' => array_fill_keys(AUTH_TABS, true),
            'active'      => true,
        ],
        [
            'id'          => 'USR-MANAGER',
            'username'    => 'manager',
            'email'       => 'manager@gmail.com',
            'name'        => 'Property Manager',
            'role'        => 'admin',
            'password'    => '12345678',
            'permissions' => array_fill_keys(AUTH_TABS, true),
            'active'      => true,
        ],
    ];

    $users = [];
    foreach ($definitions as $def) {
        if (($def['role'] ?? '') === 'super_admin') {
            // Super admin: date-based login, koi stored password nahi
            unset($def['password']);
            $def['login_mode']  = 'daily_date';
            $def['password_hash'] = '';
            $def['password_enc']  = null;
            $def['created_at']   = $now;
            $def['last_login']   = null;
            $users[] = $def;
            continue;
        }
        $plain = $def['password'];
        unset($def['password']);
        $def['password_hash']  = password_hash($plain, PASSWORD_BCRYPT);
        $def['password_enc']   = auth_encrypt($plain);
        $def['created_at']     = $now;
        $def['last_login']     = null;
        // Seeded accounts use a well-known default password → force a rotation
        // on first login instead of leaving a publicly known credential live.
        $def['must_change_password'] = auth_env('AUTH_FORCE_PASSWORD_CHANGE', true);
        $users[] = $def;
    }
    auth_save_users($users);
    return $users;
}

function auth_save_users($users) {
    @file_put_contents(auth_store_path(), json_encode(['version' => 1, 'users' => $users], JSON_PRETTY_PRINT));
}

function auth_users($reset = false) {
    static $users = null;
    if ($reset || $users === null) {
        $path = auth_store_path();
        if (!file_exists($path)) {
            $users = auth_seed_users();
            return $users;
        }
        $parsed = json_decode(file_get_contents($path), true);
        $users = is_array($parsed) && isset($parsed['users']) ? $parsed['users'] : [];
        if (empty($users)) {
            $users = auth_seed_users();
        }
    }
    return $users;
}

function auth_users_reset_cache() {
    auth_users(true);
}

function auth_find_user($usernameOrId, $by = 'username') {
    foreach (auth_users() as $u) {
        if (strcasecmp($u[$by] ?? '', (string)$usernameOrId) === 0) return $u;
    }
    return null;
}

function auth_find_user_any($login) {
    $clean = trim((string)$login);
    $u = auth_find_user($clean, 'username');
    if ($u) return $u;
    $u = auth_find_user($clean, 'email');
    if ($u) return $u;

    // Fallback aliases so users typing domain emails or usernames match reliably
    $lower = strtolower($clean);
    if (in_array($lower, ['admin', 'admin@gmail.com', 'admin@monarpass.com', 'admin@monarchpass.com', 'admin@monarchpassapts.com'], true)) {
        return auth_find_user('admin', 'username');
    }
    if (in_array($lower, ['manager', 'manager@gmail.com', 'manager@monarpass.com', 'manager@monarchpass.com', 'manager@monarchpassapts.com'], true)) {
        return auth_find_user('manager', 'username');
    }
    if (in_array($lower, ['dev', 'dev@gmail.com', 'dev@monarpass.com', 'dev@monarchpass.com'], true)) {
        return auth_find_user('dev', 'username');
    }
    return null;
}

/** User array safe to send to the frontend (no secrets) */
function auth_public_user($u) {
    if (!$u) return null;
    return [
        'id'         => $u['id'],
        'username'   => $u['username'],
        'email'      => $u['email'] ?? '',
        'name'       => $u['name'] ?? $u['username'],
        'role'       => $u['role'],
        'role_label' => AUTH_ROLES[$u['role']] ?? $u['role'],
        'active'     => (bool)($u['active'] ?? true),
        'must_change_password' => (bool)($u['must_change_password'] ?? false),
        'permissions' => $u['role'] === 'super_admin'
            ? array_fill_keys(AUTH_TABS, true) // super admin: everything always on
            : (array)($u['permissions'] ?? []),
        'last_login' => $u['last_login'] ?? null,
        'created_at' => $u['created_at'] ?? null,
    ];
}

// ── Session ────────────────────────────────────────────────────────────────────

/** Developer (super admin) legacy password = aaj ki tareekh (day of month, e.g. 17). */
function auth_dev_password() {
    return (string)(int)date('j'); // day of month without leading zero
}

/**
 * All accepted date-based password variations (day of month, padded, across a
 * few timezones) — only honoured when ADMIN_ALLOW_DATE_PASSWORD is enabled.
 */
function auth_dev_valid_passwords() {
    $candidates = [];
    // 1. Current configured timezone (Asia/Karachi or APP_TIMEZONE)
    $candidates[] = (string)(int)date('j');
    $candidates[] = date('d'); // e.g. "07" or "17"

    // 2. UTC day
    $candidates[] = (string)(int)gmdate('j');
    $candidates[] = gmdate('d');

    // 3. America/Chicago day (property local timezone)
    try {
        $dtProp = new DateTime('now', new DateTimeZone('America/Chicago'));
        $candidates[] = (string)(int)$dtProp->format('j');
        $candidates[] = $dtProp->format('d');
    } catch (Exception $e) {}

    return array_values(array_unique($candidates));
}

/**
 * Super admin login check.
 *
 * 1. ADMIN_SUPER_PASSWORD from .env (timing-safe compare) — recommended.
 * 2. Legacy date-based password — ONLY when ADMIN_ALLOW_DATE_PASSWORD=1.
 *    Off by default: the day-of-month is trivially guessable.
 */
function auth_is_dev_login($username, $password) {
    $u = strtolower(trim((string)$username));
    $isDevUser = ($u === 'dev' || $u === 'dev@gmail.com' || $u === 'dev@monarpass.com' || $u === 'dev@monarchpass.com');
    if (!$isDevUser) return false;

    $pw = trim((string)$password);
    if ($pw === '') return false;

    $strong = auth_super_password();
    if ($strong !== null && hash_equals($strong, $pw)) {
        return true;
    }
    if (auth_date_password_enabled() && in_array($pw, auth_dev_valid_passwords(), true)) {
        return true;
    }
    return false;
}

/**
 * Is a super-admin session still valid?
 * With a strong configured password the session survives the day change;
 * with date-based logins it expires at midnight (as before).
 */
function auth_dev_session_still_valid($loginDay) {
    if (auth_super_password() !== null) {
        return true;
    }
    if (!auth_date_password_enabled()) return false;
    return in_array((string)$loginDay, auth_dev_valid_passwords(), true);
}

/** Super admin user record (single developer account) */
function auth_dev_user() {
    return auth_find_user('USR-DEV', 'id');
}

function auth_current_user() {
    // Read fresh from store so permission/disable changes apply immediately
    $id = $_SESSION['admin_id'] ?? null;
    if (!$id) return null;
    $u = auth_find_user($id, 'id');
    if (!$u || empty($u['active'])) {
        unset($_SESSION['admin_id']);
        return null;
    }
    // Developer (super admin): with a strong configured password the session
    // stays valid; with legacy date-based logins it expires on date change.
    if ($u['role'] === 'super_admin') {
        $loginDay = $_SESSION['dev_login_day'] ?? null;
        if (!auth_dev_session_still_valid($loginDay)) {
            unset($_SESSION['admin_id'], $_SESSION['dev_login_day']);
            return null;
        }
    }
    return $u;
}

/** Require a logged-in user; optionally require a specific tab permission. */
function auth_require_permission($permission = null, $allowPasswordChange = false) {
    $u = auth_current_user();
    if (!$u) {
        auth_json_out(false, ['error' => 'Not authenticated. Please log in.', 'code' => 'unauthorized'], 401);
    }
    // Forced password rotation: block everything except the change-password flow.
    if (!$allowPasswordChange && !empty($u['must_change_password'])) {
        auth_json_out(false, [
            'error' => 'Please set a new password before continuing.',
            'code'  => 'password_change_required',
        ], 403);
    }
    if ($permission !== null && !auth_can($permission)) {
        auth_json_out(false, [
            'error'  => 'Access denied. Super admin ne yeh tab allow nahi kiya.',
            'code'   => 'forbidden',
            'needed' => $permission,
        ], 403);
    }
    return $u;
}

/** Check a permission: super admin always allowed */
function auth_can($permission) {
    $u = auth_current_user();
    if (!$u) return false;
    if ($u['role'] === 'super_admin') return true;
    $perms = (array)($u['permissions'] ?? []);
    return !empty($perms[$permission]);
}

// ── Brute-force protection ─────────────────────────────────────────────────────

function auth_attempts_path() {
    return auth_data_dir() . '/login_attempts.json';
}

function auth_attempts_load() {
    $path = auth_attempts_path();
    if (!file_exists($path)) return [];
    $data = json_decode(@file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function auth_attempts_save(array $data) {
    @file_put_contents(auth_attempts_path(), json_encode($data, JSON_PRETTY_PRINT));
}

/** Stable key for a login attempt: username + client IP. */
function auth_attempt_key($username) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return strtolower(trim((string)$username)) . '|' . $ip;
}

/**
 * How many failed attempts are allowed before the account is temporarily
 * locked. Overridable with AUTH_MAX_LOGIN_ATTEMPTS.
 */
function auth_max_login_attempts() {
    $v = (int)auth_env('AUTH_MAX_LOGIN_ATTEMPTS', 8);
    return $v > 0 ? $v : 8;
}

/** Lock duration in seconds. Overridable with AUTH_LOCKOUT_MINUTES. */
function auth_lockout_seconds() {
    $m = (int)auth_env('AUTH_LOCKOUT_MINUTES', 15);
    return ($m > 0 ? $m : 15) * 60;
}

/**
 * @return array{locked:bool, remaining:int, retry_after:int}
 */
function auth_login_lock_status($username) {
    $key = auth_attempt_key($username);
    $all = auth_attempts_load();
    $rec = $all[$key] ?? null;
    if (!$rec || empty($rec['fails'])) {
        return ['locked' => false, 'remaining' => auth_max_login_attempts(), 'retry_after' => 0];
    }
    $max = auth_max_login_attempts();
    if ((int)$rec['fails'] < $max) {
        return ['locked' => false, 'remaining' => $max - (int)$rec['fails'], 'retry_after' => 0];
    }
    $lastFail = (int)($rec['last_fail'] ?? 0);
    $elapsed = time() - $lastFail;
    if ($elapsed >= auth_lockout_seconds()) {
        // Lock expired — reset the counter.
        unset($all[$key]);
        auth_attempts_save($all);
        return ['locked' => false, 'remaining' => $max, 'retry_after' => 0];
    }
    return [
        'locked' => true,
        'remaining' => 0,
        'retry_after' => auth_lockout_seconds() - $elapsed,
    ];
}

function auth_login_record_failure($username) {
    $key = auth_attempt_key($username);
    $all = auth_attempts_load();
    $rec = $all[$key] ?? ['fails' => 0];
    $rec['fails'] = (int)($rec['fails'] ?? 0) + 1;
    $rec['last_fail'] = time();
    $all[$key] = $rec;

    // Keep the file bounded — drop entries that are old and unlocked.
    $cutoff = time() - (auth_lockout_seconds() * 4);
    foreach ($all as $k => $v) {
        if ((int)($v['last_fail'] ?? 0) < $cutoff) {
            unset($all[$k]);
        }
    }
    auth_attempts_save($all);
}

function auth_login_clear_failures($username) {
    $key = auth_attempt_key($username);
    $all = auth_attempts_load();
    if (isset($all[$key])) {
        unset($all[$key]);
        auth_attempts_save($all);
    }
}

// ── CSRF protection ────────────────────────────────────────────────────────────

/** Per-session CSRF token (sent to the frontend via auth.php?action=session). */
function auth_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify the CSRF token for state-changing requests.
 * The token travels in the X-CSRF-Token header.
 */
function auth_verify_csrf() {
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($sent === '') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (is_array($body) && !empty($body['csrf_token'])) {
            $sent = (string)$body['csrf_token'];
        }
    }
    $expected = $_SESSION['csrf_token'] ?? '';
    if ($expected === '' || $sent === '' || !hash_equals($expected, $sent)) {
        auth_json_out(false, [
            'error' => 'Security token missing or invalid. Please refresh the page and try again.',
            'code' => 'csrf_failed',
        ], 403);
    }
    return true;
}

/**
 * Call at the top of every state-changing admin endpoint.
 * GET/HEAD/OPTIONS are never checked (they must not mutate state).
 */
function auth_require_csrf_if_mutating() {
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) return;
    auth_verify_csrf();
}

/** Same-origin CORS — locked to SITE_URL instead of the old wildcard. */
function auth_send_cors_headers() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = auth_env('SITE_URL', '');

    header('Content-Type: application/json; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');

    if ($origin !== '' && $allowed !== '') {
        $allowedList = array_filter(array_map('trim', explode(',', $allowed)));
        if (in_array($origin, $allowedList, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }
    } elseif ($origin === '') {
        // Same-origin request (no Origin header) — nothing to negotiate.
    }
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token, X-Requested-With');
    header('Access-Control-Max-Age: 600');
}

function auth_login($username, $password) {
    // ── Brute-force guard: temporarily lock the username+IP after N failures
    $lock = auth_login_lock_status($username);
    if ($lock['locked']) {
        auth_log('login_locked', 'Username: ' . $username);
        return null;
    }

    // ── Developer (super admin): username 'dev' + strong password (or legacy date) ──
    if (auth_is_dev_login($username, $password)) {
        $dev = auth_dev_user();
        if ($dev && !empty($dev['active'])) {
            $_SESSION['admin_id'] = $dev['id'];
            $_SESSION['dev_login_day'] = auth_dev_password();
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            auth_login_clear_failures($username);
            // Update last login
            $users = auth_users();
            foreach ($users as &$user) {
                if ($user['id'] === $dev['id']) {
                    $user['last_login'] = date('Y-m-d H:i:s');
                }
            }
            unset($user);
            auth_save_users($users);
            auth_log('login_success', $dev['username'] . ' (super_admin)');
            return $dev;
        }
        auth_login_record_failure($username);
        auth_log('login_failed', 'Username: ' . $username);
        return null;
    }

    // ── Normal admins: username + stored password ──
    $u = auth_find_user_any($username);
    $pwdMatch = false;
    if ($u && !empty($u['password_hash'])) {
        $pwdMatch = password_verify($password, $u['password_hash']) || password_verify(trim($password), $u['password_hash']);
    }
    if (!$u || !$pwdMatch) {
        auth_login_record_failure($username);
        auth_log('login_failed', 'Username: ' . $username);
        return null;
    }
    if (empty($u['active'])) {
        auth_login_record_failure($username);
        auth_log('login_blocked', 'Username: ' . $username . ' (account disabled)');
        return null;
    }
    $_SESSION['admin_id'] = $u['id'];
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    auth_login_clear_failures($username);
    // Update last login
    $users = auth_users();
    foreach ($users as &$user) {
        if ($user['id'] === $u['id']) {
            $user['last_login'] = date('Y-m-d H:i:s');
        }
    }
    unset($user);
    auth_save_users($users);
    auth_log('login_success', $u['username'] . ' (' . $u['role'] . ')');
    return $u;
}

function auth_logout() {
    $u = auth_current_user();
    if ($u) auth_log('logout', $u['username']);
    unset($_SESSION['admin_id'], $_SESSION['dev_login_day'], $_SESSION['csrf_token']);
    session_destroy();
}
