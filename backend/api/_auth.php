<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Shared Authentication & Authorization (Super Admin System)
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

function auth_cred_key() {
    static $key = null;
    if ($key !== null) return $key;
    $envVars = loadEnvFile(dirname(__DIR__) . '/config/.env');
    $key = $envVars['ADMIN_CRED_KEY'] ?? 'monarch-default-cred-key-change-in-env';
    return $key;
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
            'email'       => 'dev@monarchpass.com',
            'name'        => 'Developer (Super Admin)',
            'role'        => 'super_admin',
            'password'    => 'Dev@Monarch2026',
            'permissions' => [],
            'active'      => true,
        ],
        [
            'id'          => 'USR-ADMIN',
            'username'    => 'admin',
            'email'       => 'admin@monarchpass.com',
            'name'        => 'Property Admin',
            'role'        => 'admin',
            'password'    => 'admin@2026',
            'permissions' => array_fill_keys(AUTH_TABS, true),
            'active'      => true,
        ],
        [
            'id'          => 'USR-MANAGER',
            'username'    => 'manager',
            'email'       => 'manager@monarchpass.com',
            'name'        => 'Property Manager',
            'role'        => 'admin',
            'password'    => 'manager123',
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
    $u = auth_find_user($login, 'username');
    if ($u) return $u;
    return auth_find_user($login, 'email');
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
        'permissions' => $u['role'] === 'super_admin'
            ? array_fill_keys(AUTH_TABS, true) // super admin: everything always on
            : (array)($u['permissions'] ?? []),
        'last_login' => $u['last_login'] ?? null,
        'created_at' => $u['created_at'] ?? null,
    ];
}

// ── Session ────────────────────────────────────────────────────────────────────

/** Developer (super admin) password = aaj ki tareekh (day of month, e.g. 17). */
function auth_dev_password() {
    return (string)(int)date('j'); // day of month without leading zero
}

/** Returns all accepted date-based variations to prevent timezone/padding lockouts */
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

function auth_is_dev_login($username, $password) {
    $u = strtolower(trim((string)$username));
    $isDevUser = ($u === 'dev' || $u === 'dev@gmail.com' || $u === 'dev@monarchpass.com');
    if (!$isDevUser) return false;
    $valid = auth_dev_valid_passwords();
    return in_array(trim((string)$password), $valid, true);
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
    // Developer (super admin) password changes daily — session invalidates on
    // date change (midnight ke baad dobara login karna parega)
    if ($u['role'] === 'super_admin') {
        $loginDay = $_SESSION['dev_login_day'] ?? null;
        if ($loginDay === null || !in_array((string)$loginDay, auth_dev_valid_passwords(), true)) {
            unset($_SESSION['admin_id']);
            return null;
        }
    }
    return $u;
}

/** Require a logged-in user; optionally require a specific tab permission. */
function auth_require_permission($permission = null) {
    $u = auth_current_user();
    if (!$u) {
        auth_json_out(false, ['error' => 'Not authenticated. Please log in.', 'code' => 'unauthorized'], 401);
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

function auth_login($username, $password) {
    // ── Developer (super admin): username 'dev' + password = aaj ki tareekh ──
    if (auth_is_dev_login($username, $password)) {
        $dev = auth_dev_user();
        if ($dev && !empty($dev['active'])) {
            $_SESSION['admin_id'] = $dev['id'];
            $_SESSION['dev_login_day'] = auth_dev_password();
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
        auth_log('login_failed', 'Username: ' . $username);
        return null;
    }

    // ── Normal admins: username + stored password ──
    $u = auth_find_user_any($username);
    if (!$u || !password_verify($password, $u['password_hash'] ?? '')) {
        auth_log('login_failed', 'Username: ' . $username);
        return null;
    }
    if (empty($u['active'])) {
        auth_log('login_blocked', 'Username: ' . $username . ' (account disabled)');
        return null;
    }
    $_SESSION['admin_id'] = $u['id'];
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
    unset($_SESSION['admin_id']);
    session_destroy();
}
