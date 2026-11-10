<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - Authentication API (Super Admin + Admin)
 * ==============================================================================
 * Actions (GET or POST):
 *   login                     { username, password }            -> public
 *   logout                    {}                                -> session
 *   session                   {}                                -> session info
 *   change_password           { current, new }                  -> session
 *   admins                    {}                                -> super_admin (list)
 *   admins_credentials        { id }                            -> super_admin (view password)
 *   admins_create             { username, password, name, email, permissions } -> super_admin
 *   admins_update             { id, name, email, permissions }  -> super_admin
 *   admins_toggle             { id }                            -> super_admin (enable/disable)
 *   admins_reset_password     { id, password }                  -> super_admin
 *   logs                      {}                                -> super_admin (activity log)
 * ==============================================================================
 */

require_once __DIR__ . '/_auth.php';

// Same-origin CORS (locked to SITE_URL) instead of the old wildcard.
auth_send_cors_headers();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true) ?: [];
$action = $_GET['action'] ?? ($_POST['action'] ?? ($data['action'] ?? 'session'));

/** Guard: only the single super admin can use management actions */
function auth_require_super() {
    $u = auth_require_permission(null, true);
    if ($u['role'] !== 'super_admin') {
        auth_json_out(false, ['error' => 'Super admin access only.', 'code' => 'forbidden'], 403);
    }
    return $u;
}

/**
 * Management actions must be POST + carry a valid CSRF token.
 * Without this, a GET-based request could mutate state (and a cross-site
 * <img src> could trigger it, since SameSite cookies only block cross-site POST).
 */
function auth_require_secure_mutation() {
    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($method !== 'POST') {
        auth_json_out(false, ['error' => 'This action requires a POST request.', 'code' => 'method_not_allowed'], 405);
    }
    auth_verify_csrf();
}

/** Keep plaintext password in sync (hash + reversible enc) */
function auth_set_password(&$user, $plainPassword) {
    $user['password_hash'] = password_hash($plainPassword, PASSWORD_BCRYPT);
    $user['password_enc']  = auth_encrypt($plainPassword);
}

// ── 1. LOGIN (public) ─────────────────────────────────────────────────────────
if ($action === 'login') {
    $username = trim($data['username'] ?? '');
    $password = (string)($data['password'] ?? '');

    if ($username === '' || $password === '') {
        auth_json_out(false, ['error' => 'Username aur password dono required hain.'], 400);
    }

    // Brute-force lockout check before touching credentials.
    $lock = auth_login_lock_status($username);
    if ($lock['locked']) {
        $mins = (int)ceil($lock['retry_after'] / 60);
        auth_json_out(false, [
            'error' => "Too many failed login attempts. Please try again in {$mins} minute(s).",
            'code'  => 'rate_limited',
            'retry_after' => $lock['retry_after'],
        ], 429);
    }

    $user = auth_login($username, $password);
    if (!$user) {
        $existing = auth_find_user_any($username);
        if ($existing && empty($existing['active'])) {
            auth_json_out(false, ['error' => 'This account has been disabled. Contact the super admin.'], 403);
        }
        $lock2 = auth_login_lock_status($username);
        $remaining = max(0, $lock2['remaining']);
        $msg = 'Invalid username or password.';
        if ($remaining > 0 && $remaining <= 3) {
            $msg .= " ({$remaining} attempt(s) left before a temporary lock.)";
        }
        auth_json_out(false, ['error' => $msg, 'code' => 'invalid_credentials'], 401);
    }

    auth_json_out(true, [
        'message' => 'Login successful',
        'user'    => auth_public_user($user),
        'csrf_token' => auth_csrf_token(),
        'must_change_password' => !empty($user['must_change_password']),
    ]);
}

// ── 2. LOGOUT ─────────────────────────────────────────────────────────────────
if ($action === 'logout') {
    auth_logout();
    auth_json_out(true, ['message' => 'Logged out']);
}

// ── 3. SESSION STATUS ─────────────────────────────────────────────────────────
if ($action === 'session') {
    $u = auth_current_user();
    auth_json_out(true, [
        'authenticated' => (bool)$u,
        'user'          => auth_public_user($u),
        'csrf_token'    => $u ? auth_csrf_token() : null,
        'must_change_password' => $u ? !empty($u['must_change_password']) : false,
    ]);
}

// ── 4. CHANGE OWN PASSWORD ────────────────────────────────────────────────────
if ($action === 'change_password') {
    // Allowed even while a forced rotation is pending.
    $u = auth_require_permission(null, true);
    if ($u['role'] === 'super_admin') {
        auth_json_out(false, ['error' => 'Super admin ka password .env se ADMIN_SUPER_PASSWORD mein set hota hai.'], 403);
    }
    $current = (string)($data['current'] ?? '');
    $new = (string)($data['new'] ?? '');

    if (strlen($new) < 8) {
        auth_json_out(false, ['error' => 'New password must be at least 8 characters.'], 400);
    }
    if (!password_verify($current, $u['password_hash'] ?? '')) {
        auth_json_out(false, ['error' => 'Current password is incorrect.'], 400);
    }
    if (password_verify($new, $u['password_hash'] ?? '')) {
        auth_json_out(false, ['error' => 'New password must be different from the current one.'], 400);
    }

    $users = auth_users();
    foreach ($users as &$user) {
        if ($user['id'] === $u['id']) {
            auth_set_password($user, $new);
            $user['must_change_password'] = false;
        }
    }
    unset($user);
    auth_save_users($users);
    auth_users_reset_cache();
    auth_log('change_password', $u['username']);
    auth_json_out(true, [
        'message' => 'Password updated successfully',
        'user' => auth_public_user(auth_find_user($u['id'], 'id')),
    ]);
}

// ── 5. LIST ADMINS (super admin only) ─────────────────────────────────────────
if ($action === 'admins') {
    auth_require_super();
    $list = array_map('auth_public_user', auth_users());
    auth_json_out(true, [
        'count'  => count($list),
        'admins' => $list,
        'tabs'   => AUTH_TAB_LABELS,
    ]);
}

// ── 6. VIEW CREDENTIALS (super admin only) ────────────────────────────────────
if ($action === 'admins_credentials') {
    auth_require_super();
    $id = $data['id'] ?? ($_GET['id'] ?? ($_POST['id'] ?? ''));
    $u = $id ? auth_find_user($id, 'id') : null;
    if (!$u) {
        auth_json_out(false, ['error' => 'Admin not found.'], 404);
    }
    if ($u['role'] === 'super_admin') {
        auth_json_out(false, ['error' => 'Super admin ka login date-based hai — koi stored password nahi.'], 403);
    }
    $plain = auth_decrypt($u['password_enc'] ?? '');
    auth_log('view_credentials', 'Admin: ' . $u['username']);
    auth_json_out(true, [
        'id'       => $u['id'],
        'username' => $u['username'],
        'email'    => $u['email'] ?? '',
        'password' => $plain !== null ? $plain : '(previous password cannot be recovered — please reset)',
    ]);
}

// ── 7. CREATE ADMIN (super admin only) ────────────────────────────────────────
if ($action === 'admins_create') {
    auth_require_secure_mutation();
    auth_require_super();

    $username = trim($data['username'] ?? '');
    $password = (string)($data['password'] ?? '');
    $name     = trim($data['name'] ?? '');
    $email    = trim($data['email'] ?? '');

    if ($username === '' || $password === '' || $name === '') {
        auth_json_out(false, ['error' => 'Username, password and name are required.'], 400);
    }
    if (strlen($password) < 6) {
        auth_json_out(false, ['error' => 'Password must be at least 6 characters.'], 400);
    }
    if (auth_find_user_any($username)) {
        auth_json_out(false, ['error' => 'This username already exists.'], 409);
    }

    // Only ONE super admin is allowed (the developer). New users are 'admin' role.
    $permissions = [];
    foreach (AUTH_TABS as $tab) {
        $permissions[$tab] = !empty($data['permissions'][$tab]);
    }

    $now = date('Y-m-d H:i:s');
    $user = [
        'id'            => 'USR-' . strtoupper(substr(uniqid(), -6)),
        'username'      => $username,
        'email'         => $email,
        'name'          => $name,
        'role'          => 'admin',
        'permissions'   => $permissions,
        'active'        => true,
        'created_at'    => $now,
        'last_login'    => null,
    ];
    auth_set_password($user, $password);

    $users = auth_users();
    $users[] = $user;
    auth_save_users($users);
    auth_users_reset_cache();
    auth_log('admin_created', 'Admin: ' . $username);
    auth_json_out(true, ['message' => 'Admin created', 'admin' => auth_public_user($user)]);
}

// ── 8. UPDATE ADMIN (name/email/permissions) ──────────────────────────────────
if ($action === 'admins_update') {
    auth_require_secure_mutation();
    auth_require_super();
    $id = $data['id'] ?? ($_GET['id'] ?? ($_POST['id'] ?? ''));
    $u = $id ? auth_find_user($id, 'id') : null;
    if (!$u) {
        auth_json_out(false, ['error' => 'Admin not found.'], 404);
    }
    // Super admin account cannot be modified here
    if ($u['role'] === 'super_admin') {
        auth_json_out(false, ['error' => 'The super admin account cannot be modified.'], 403);
    }

    $users = auth_users();
    foreach ($users as &$user) {
        if ($user['id'] !== $u['id']) continue;
        if (isset($data['name']))  $user['name']  = trim($data['name']);
        if (isset($data['email'])) $user['email'] = trim($data['email']);
        if (isset($data['permissions']) && is_array($data['permissions'])) {
            $perms = [];
            foreach (AUTH_TABS as $tab) {
                $perms[$tab] = !empty($data['permissions'][$tab]);
            }
            $user['permissions'] = $perms;
        }
    }
    unset($user);
    auth_save_users($users);
    auth_users_reset_cache();
    auth_log('admin_updated', 'Admin: ' . $u['username']);
    auth_json_out(true, ['message' => 'Admin updated', 'admin' => auth_public_user(auth_find_user($id, 'id'))]);
}

// ── 9. ENABLE / DISABLE ADMIN (super admin only) ──────────────────────────────
if ($action === 'admins_toggle') {
    auth_require_secure_mutation();
    auth_require_super();
    $id = $data['id'] ?? ($_GET['id'] ?? ($_POST['id'] ?? ''));
    $u = $id ? auth_find_user($id, 'id') : null;
    if (!$u) {
        auth_json_out(false, ['error' => 'Admin not found.'], 404);
    }
    if ($u['role'] === 'super_admin') {
        auth_json_out(false, ['error' => 'The super admin account cannot be disabled.'], 403);
    }
    if (($u['id'] ?? '') === ($_SESSION['admin_id'] ?? '') && ($data['active'] ?? null) === false) {
        auth_json_out(false, ['error' => 'You cannot disable yourself.'], 400);
    }

    $users = auth_users();
    $newState = true;
    foreach ($users as &$user) {
        if ($user['id'] !== $u['id']) continue;
        // Explicitly bheja hua state honor karo, warna toggle karo
        if (is_array($data) && array_key_exists('active', $data)) {
            $user['active'] = (bool)$data['active'];
        } else {
            $user['active'] = !empty($user['active']) ? false : true;
        }
        $newState = (bool)$user['active'];
    }
    unset($user);
    auth_save_users($users);
    auth_users_reset_cache();
    auth_log('admin_toggled', 'Admin: ' . $u['username'] . ' -> ' . ($newState ? 'enabled' : 'disabled'));
    auth_json_out(true, [
        'message' => $newState ? 'Admin enabled' : 'Admin disabled',
        'admin'   => auth_public_user(auth_find_user($id, 'id')),
    ]);
}

// ── 10. RESET ADMIN PASSWORD (super admin only) ───────────────────────────────
if ($action === 'admins_reset_password') {
    auth_require_secure_mutation();
    auth_require_super();
    $id = $data['id'] ?? ($_GET['id'] ?? ($_POST['id'] ?? ''));
    $password = (string)($data['password'] ?? ($_POST['password'] ?? ''));
    $u = $id ? auth_find_user($id, 'id') : null;
    if (!$u) {
        auth_json_out(false, ['error' => 'Admin not found.'], 404);
    }
    if ($u['role'] === 'super_admin') {
        auth_json_out(false, ['error' => 'Super admin ka password date-based hai — reset nahi hota.'], 403);
    }
    if (strlen($password) < 6) {
        auth_json_out(false, ['error' => 'Password must be at least 6 characters.'], 400);
    }

    $users = auth_users();
    foreach ($users as &$user) {
        if ($user['id'] !== $u['id']) continue;
        auth_set_password($user, $password);
    }
    unset($user);
    auth_save_users($users);
    auth_users_reset_cache();
    auth_log('admin_password_reset', 'Admin: ' . $u['username']);
    auth_json_out(true, ['message' => 'Password reset successfully']);
}

// ── 11. DELETE ADMIN (super admin only) ───────────────────────────────────────
if ($action === 'admins_delete') {
    auth_require_secure_mutation();
    auth_require_super();
    $id = $data['id'] ?? ($_GET['id'] ?? ($_POST['id'] ?? ''));
    $u = $id ? auth_find_user($id, 'id') : null;
    if (!$u) {
        auth_json_out(false, ['error' => 'Admin not found.'], 404);
    }
    if ($u['role'] === 'super_admin' || ($u['id'] ?? '') === 'USR-DEV') {
        auth_json_out(false, ['error' => 'Super admin account cannot be deleted.'], 403);
    }
    if (($u['id'] ?? '') === ($_SESSION['admin_id'] ?? '')) {
        auth_json_out(false, ['error' => 'You cannot delete your own logged-in account.'], 400);
    }

    $users = auth_users();
    $filtered = array_values(array_filter($users, fn($user) => ($user['id'] ?? '') !== $u['id']));
    auth_save_users($filtered);
    auth_users_reset_cache();
    auth_log('admin_deleted', 'Admin: ' . $u['username'] . ' (' . $u['id'] . ')');
    auth_json_out(true, ['message' => 'Admin account deleted successfully']);
}

// ── 12. ACTIVITY LOG (super admin only) ───────────────────────────────────────
if ($action === 'logs') {
    auth_require_super();
    $logs = [];
    if (file_exists(auth_log_path())) {
        $logs = json_decode(file_get_contents(auth_log_path()), true) ?: [];
    }
    auth_json_out(true, ['count' => count($logs), 'logs' => $logs]);
}

// ── 12. ADMIN ACTIVITY (koi bhi logged-in admin — logs + login times) ─────────
if ($action === 'activity') {
    auth_require_permission('adminactivity', true);
    $list = array_map('auth_public_user', auth_users());
    $logs = [];
    if (file_exists(auth_log_path())) {
        $logs = json_decode(file_get_contents(auth_log_path()), true) ?: [];
    }
    auth_json_out(true, [
        'admins' => $list,
        'logs'   => array_slice($logs, 0, 100),
        'summary' => [
            'total'        => count($list),
            'super_admins' => count(array_filter($list, fn($a) => $a['role'] === 'super_admin')),
            'active'       => count(array_filter($list, fn($a) => $a['active'] && $a['role'] !== 'super_admin')),
            'disabled'     => count(array_filter($list, fn($a) => !$a['active'] && $a['role'] !== 'super_admin')),
        ],
    ]);
}

// ── 13. CATALOG (labels for permission matrix) ────────────────────────────────
if ($action === 'catalog') {
    // Login zaroori — koi bhi logged-in admin catalog dekh sakta hai
    auth_require_permission(null, true);
    auth_json_out(true, ['tabs' => AUTH_TAB_LABELS, 'tab_keys' => AUTH_TABS]);
}

auth_json_out(false, ['error' => 'Unknown action requested'], 400);
