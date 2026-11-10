<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - Resident Portal API (authenticated resident self-service)
 * ==============================================================================
 * Endpoints (same-origin, JSON in / JSON out):
 *   POST ?action=login             { email, unit_number, password }          (public)
 *   POST ?action=logout            {}                                        (resident session)
 *   GET  ?action=session           {}                                        (public)
 *   GET  ?action=overview          {}                                        (resident session)
 *   POST ?action=change_password   { current, new }        + X-CSRF-Token    (resident session)
 *   POST ?action=submit_maintenance{ title, category, priority, notes } + X-CSRF-Token
 *   POST ?action=toggle_addon      { addon_key, active }   + X-CSRF-Token
 *   POST ?action=cancel_autopay    {}                      + X-CSRF-Token
 *   POST ?action=create_account    { unit_number, email, full_name, password } (super admin)
 *
 * Residents are NOT admins:
 *   - dedicated PHP session namespace (cookie: mp_resident_session)
 *   - dedicated session keys ($_SESSION['resident'], $_SESSION['resident_csrf'])
 *   - dedicated CSRF token (admin ka $_SESSION['csrf_token'] bilkul use nahi hota)
 *   - EVERY query is scoped to the logged-in resident's own unit_number
 *
 * Storage:
 *   MySQL (PDO, prepared statements only) jab available ho,
 *   warna JSON fallback  ->  backend/data/residents.json
 *   (isi pattern ka use worldfirst.php / maintenance.php karte hain)
 * ==============================================================================
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/config/database.php';

// ── Request parsing (session namespace decide karne se pehle chahiye) ─────────
$__raw  = file_get_contents('php://input');
$__json = json_decode($__raw, true);
if (!is_array($__json)) {
    $__json = [];
}
$__action = strtolower(trim((string)(
    $_GET['action'] ?? ($__json['action'] ?? ($_POST['action'] ?? 'session'))
)));

// Resident requests apna alag session use karte hain (alag cookie + alag keys).
// Sirf create_account admin session mein chalta hai (super admin hi call kar sakta hai).
if ($__action !== 'create_account' && session_status() === PHP_SESSION_NONE) {
    $__https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('mp_resident_session');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'secure'   => $__https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

require_once __DIR__ . '/_auth.php';

auth_send_cors_headers();

// ── Constants ─────────────────────────────────────────────────────────────────
const RESIDENT_CATEGORIES = ['HVAC', 'Plumbing', 'Electrical', 'Appliance', 'Exterior', 'Turnover', 'General'];
const RESIDENT_PRIORITIES = ['Low', 'Medium', 'High', 'Emergency'];

// ── Resident session helpers ──────────────────────────────────────────────────

/** Per-resident-session CSRF token (admin token se bilkul alag). */
function resident_csrf_token() {
    if (empty($_SESSION['resident_csrf']) || !is_string($_SESSION['resident_csrf'])) {
        $_SESSION['resident_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['resident_csrf'];
}

/** Verify the resident CSRF token for state-changing requests. */
function resident_verify_csrf() {
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if ($sent === '') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (is_array($body) && !empty($body['csrf_token'])) {
            $sent = (string)$body['csrf_token'];
        }
    }
    $expected = $_SESSION['resident_csrf'] ?? '';
    if ($expected === '' || $sent === '' || !hash_equals((string)$expected, (string)$sent)) {
        auth_json_out(false, [
            'error' => 'Security token missing or invalid. Please refresh the page and try again.',
            'code'  => 'csrf_failed',
        ], 403);
    }
    return true;
}

/** Require an active resident session. */
function resident_require_login() {
    $resident = $_SESSION['resident'] ?? null;
    if (!is_array($resident) || empty($resident['id']) || empty($resident['unit'])) {
        auth_json_out(false, [
            'error' => 'Please log in to access the resident portal.',
            'code'  => 'unauthorized',
        ], 401);
    }
    return $resident;
}

/**
 * Resident activity log.
 * Ye `backend/data/residents.json` ke andar hi rehta hai (gitignored store),
 * taake alag se koi untracked personal-data file na bann jaye.
 */
function resident_log($action, $detail = '') {
    $store = resident_store_read();
    if (!isset($store['logs']) || !is_array($store['logs'])) {
        $store['logs'] = [];
    }
    array_unshift($store['logs'], [
        'id'        => 'RLOG-' . strtoupper(substr(uniqid(), -8)),
        'actor'     => $_SESSION['resident']['unit'] ?? 'guest',
        'action'    => $action,
        'detail'    => $detail,
        'ip'        => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'timestamp' => date('Y-m-d H:i:s'),
    ]);
    $store['logs'] = array_slice($store['logs'], 0, 200);
    resident_store_write($store);
}

// ── JSON fallback store (backend/data/residents.json) ─────────────────────────

function resident_store_path() {
    return dirname(__DIR__) . '/data/residents.json';
}

function resident_store_read() {
    $default = [
        'version'  => 1,
        'accounts' => [],
        'activity' => [],
        'logs'     => [],
        'data'     => [],
    ];
    $path = resident_store_path();
    if (!file_exists($path)) {
        return $default;
    }
    $parsed = json_decode(@file_get_contents($path), true);
    if (!is_array($parsed)) {
        return $default;
    }
    $store = array_merge($default, $parsed);
    if (!isset($store['accounts']) || !is_array($store['accounts'])) $store['accounts'] = [];
    if (!isset($store['activity']) || !is_array($store['activity'])) $store['activity'] = [];
    if (!isset($store['logs']) || !is_array($store['logs']))         $store['logs']     = [];
    if (!isset($store['data']) || !is_array($store['data']))         $store['data']     = [];
    return $store;
}

function resident_store_write(array $store) {
    $path = resident_store_path();
    $dir  = dirname($path);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    @file_put_contents($path, json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

/** Demo / fallback rows of a given table. */
function resident_json_data(string $key) {
    $store = resident_store_read();
    $rows  = $store['data'][$key] ?? [];
    return is_array($rows) ? $rows : [];
}

/** Fallback rows filtered by a callback. */
function resident_json_filter(string $key, callable $filter) {
    return array_values(array_filter(resident_json_data($key), $filter));
}

// ── Account lookups ───────────────────────────────────────────────────────────

/**
 * Find a resident account by email + unit number.
 * MySQL pehle, warna JSON fallback store.
 */
function resident_find_account($pdo, string $email, string $unit) {
    $email = strtolower(trim($email));
    $unit  = trim($unit);

    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "SELECT * FROM `resident_accounts`
                 WHERE LOWER(`email`) = :email AND `unit_number` = :unit
                 LIMIT 1"
            );
            $stmt->execute([':email' => $email, ':unit' => $unit]);
            $row = $stmt->fetch();
            if ($row) {
                return $row;
            }
        } catch (Exception $e) {
            error_log('[resident] account lookup failed: ' . $e->getMessage());
        }
    }

    foreach (resident_store_read()['accounts'] as $account) {
        if (strcasecmp((string)($account['email'] ?? ''), $email) !== 0) continue;
        if ((string)($account['unit_number'] ?? '') !== $unit) continue;
        return $account;
    }
    return null;
}

/** Find a resident account by unit number only (password change ke liye). */
function resident_find_account_by_unit($pdo, string $unit) {
    $unit = trim($unit);
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `resident_accounts` WHERE `unit_number` = :unit LIMIT 1");
            $stmt->execute([':unit' => $unit]);
            $row = $stmt->fetch();
            if ($row) {
                return $row;
            }
        } catch (Exception $e) {
            error_log('[resident] account-by-unit lookup failed: ' . $e->getMessage());
        }
    }
    foreach (resident_store_read()['accounts'] as $account) {
        if ((string)($account['unit_number'] ?? '') === $unit) {
            return $account;
        }
    }
    return null;
}

/** Update an account (password / flags) in MySQL + JSON fallback. */
function resident_update_account($pdo, array $account, array $fields) {
    $unit  = (string)($account['unit_number'] ?? '');
    $email = (string)($account['email'] ?? '');

    if ($pdo && $unit !== '') {
        try {
            if (isset($fields['password_hash'])) {
                $stmt = $pdo->prepare(
                    "UPDATE `resident_accounts`
                     SET `password_hash` = :hash,
                         `password_enc`  = :enc,
                         `must_change_password` = :must,
                         `last_login`    = :last_login
                     WHERE `unit_number` = :unit AND LOWER(`email`) = :email"
                );
                $stmt->execute([
                    ':hash'      => $fields['password_hash'],
                    ':enc'       => $fields['password_enc'] ?? null,
                    ':must'      => (int)($fields['must_change_password'] ?? 0),
                    ':last_login'=> $fields['last_login'] ?? null,
                    ':unit'      => $unit,
                    ':email'     => strtolower($email),
                ]);
            } else {
                $stmt = $pdo->prepare(
                    "UPDATE `resident_accounts`
                     SET `must_change_password` = :must, `last_login` = :last_login
                     WHERE `unit_number` = :unit AND LOWER(`email`) = :email"
                );
                $stmt->execute([
                    ':must'      => (int)($fields['must_change_password'] ?? 0),
                    ':last_login'=> $fields['last_login'] ?? null,
                    ':unit'      => $unit,
                    ':email'     => strtolower($email),
                ]);
            }
        } catch (Exception $e) {
            error_log('[resident] account update failed: ' . $e->getMessage());
        }
    }

    // JSON mirror update
    $store = resident_store_read();
    $mirrorFound = false;
    foreach ($store['accounts'] as $k => $row) {
        if ((string)($row['unit_number'] ?? '') !== $unit) continue;
        $mirrorFound = true;
        if (isset($fields['password_hash'])) {
            $store['accounts'][$k]['password_hash'] = $fields['password_hash'];
            if (array_key_exists('password_enc', $fields)) {
                $store['accounts'][$k]['password_enc'] = $fields['password_enc'];
            }
        }
        if (array_key_exists('must_change_password', $fields)) {
            $store['accounts'][$k]['must_change_password'] = (int)$fields['must_change_password'];
        }
        if (array_key_exists('last_login', $fields)) {
            $store['accounts'][$k]['last_login'] = $fields['last_login'];
        }
    }
    // Account MySQL mein hai magar JSON mirror mein nahi → mirror bana do
    // (taake MySQL kabhi unavailable ho to login fallback toota na)
    if (!$mirrorFound && $unit !== '' && !empty($account)) {
        $store['accounts'][] = array_merge($account, [
            'unit_number'          => $unit,
            'email'                => $email,
            'must_change_password' => (int)($fields['must_change_password'] ?? ($account['must_change_password'] ?? 0)),
            'last_login'           => $fields['last_login'] ?? ($account['last_login'] ?? null),
        ]);
    }
    resident_store_write($store);
}

/** Insert / update an activity row (resident_activity table + JSON mirror). */
function resident_record_activity($pdo, array $entry) {
    $now = $entry['occurred_at'] ?? date('Y-m-d H:i:s');

    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "INSERT INTO `resident_activity`
                    (`unit_number`, `kind`, `title`, `detail`, `amount`, `status`, `occurred_at`)
                 VALUES (:unit, :kind, :title, :detail, :amount, :status, :occurred_at)"
            );
            $stmt->execute([
                ':unit'        => $entry['unit_number'],
                ':kind'        => $entry['kind'],
                ':title'       => $entry['title'],
                ':detail'      => $entry['detail'] ?? null,
                ':amount'      => $entry['amount'] ?? null,
                ':status'      => $entry['status'] ?? null,
                ':occurred_at' => $now,
            ]);
        } catch (Exception $e) {
            error_log('[resident] activity insert failed: ' . $e->getMessage());
        }
    }

    $store = resident_store_read();
    array_unshift($store['activity'], [
        'id'          => count($store['activity']) + 1,
        'unit_number' => $entry['unit_number'],
        'kind'        => $entry['kind'],
        'title'       => $entry['title'],
        'detail'      => $entry['detail'] ?? null,
        'amount'      => $entry['amount'] ?? null,
        'status'      => $entry['status'] ?? null,
        'occurred_at' => $now,
    ]);
    $store['activity'] = array_slice($store['activity'], 0, 200);
    resident_store_write($store);
}

// ── Resident profile / lease ──────────────────────────────────────────────────

/** Raw row of the `residents` table (MySQL → JSON fallback). */
function resident_row($pdo, string $unit) {
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `residents` WHERE `unit_number` = :unit LIMIT 1");
            $stmt->execute([':unit' => $unit]);
            $row = $stmt->fetch();
            if ($row) {
                return $row;
            }
        } catch (Exception $e) {
            error_log('[resident] residents lookup failed: ' . $e->getMessage());
        }
    }
    foreach (resident_json_data('residents') as $row) {
        if ((string)($row['unit_number'] ?? '') === $unit) {
            return $row;
        }
    }
    return null;
}

/** Raw row of the `units` table (MySQL → JSON fallback). */
function resident_unit_row($pdo, string $unit) {
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `units` WHERE `unit_number` = :unit LIMIT 1");
            $stmt->execute([':unit' => $unit]);
            $row = $stmt->fetch();
            if ($row) {
                return $row;
            }
        } catch (Exception $e) {
            error_log('[resident] units lookup failed: ' . $e->getMessage());
        }
    }
    foreach (resident_json_data('units') as $row) {
        if ((string)($row['unit_number'] ?? '') === $unit) {
            return $row;
        }
    }
    return null;
}

/** Floor plan row (slug se, warna name se). */
function resident_floor_plan($pdo, ?string $slug, ?string $name) {
    if ($pdo) {
        try {
            if ($slug !== null && $slug !== '') {
                $stmt = $pdo->prepare("SELECT * FROM `floor_plans` WHERE `slug` = :slug LIMIT 1");
                $stmt->execute([':slug' => $slug]);
                $row = $stmt->fetch();
                if ($row) {
                    return $row;
                }
            }
            if ($name !== null && $name !== '') {
                $stmt = $pdo->prepare("SELECT * FROM `floor_plans` WHERE `name` = :name LIMIT 1");
                $stmt->execute([':name' => $name]);
                $row = $stmt->fetch();
                if ($row) {
                    return $row;
                }
            }
        } catch (Exception $e) {
            error_log('[resident] floor plan lookup failed: ' . $e->getMessage());
        }
    }
    $plans = resident_json_data('floor_plans');
    foreach ($plans as $row) {
        if ($slug && ($row['slug'] ?? '') === $slug) {
            return $row;
        }
    }
    foreach ($plans as $row) {
        if ($name && strcasecmp((string)($row['name'] ?? ''), $name) === 0) {
            return $row;
        }
    }
    return null;
}

/** Human friendly account status. */
function resident_status_label($status) {
    $map = [
        'current' => 'Good Standing',
        'notice'  => 'On Notice',
        'past'    => 'Past Resident',
    ];
    $key = strtolower(trim((string)$status));
    return $map[$key] ?? ucfirst($key !== '' ? $key : 'current');
}

/**
 * Full resident profile (login response aur overview dono yahin se bante hain).
 */
function resident_profile($pdo, string $unit, array $account) {
    $row   = resident_row($pdo, $unit) ?: [];
    $unitR = resident_unit_row($pdo, $unit) ?: [];
    $plan  = resident_floor_plan(
        $pdo,
        $unitR['floor_plan_slug'] ?? null,
        $row['floor_plan_name'] ?? null
    ) ?: [];

    $rent  = (float)($row['rent'] ?? $unitR['rent'] ?? $plan['price_12m'] ?? 0);
    $base  = (float)($unitR['rent'] ?? $plan['price_12m'] ?? $rent);
    $fees  = round(max(0.0, $rent - $base), 2);

    $moveIn   = $row['move_in_date'] ?? ($unitR['move_in_date'] ?? null);
    $leaseEnd = $row['lease_end_date'] ?? null;

    return [
        'id'          => $account['id'] ?? null,
        'name'        => (string)($account['full_name'] ?? $row['name'] ?? 'Resident'),
        'email'       => (string)($account['email'] ?? $row['email'] ?? ''),
        'phone'       => (string)($row['phone'] ?? ''),
        'unit_number' => $unit,
        'floor_plan'  => (string)($plan['name'] ?? $row['floor_plan_name'] ?? 'Apartment'),
        'beds'        => (int)($unitR['beds'] ?? $plan['beds'] ?? 0),
        'baths'       => (float)($plan['baths'] ?? 0),
        'sqft'        => (int)($unitR['sqft'] ?? $plan['sqft'] ?? 0),
        'rent'        => $rent,
        'lease_start' => $moveIn,
        'lease_end'   => $leaseEnd,
        'move_in_date'=> $moveIn,
        'deposit'     => (float)($row['deposit'] ?? $plan['deposit'] ?? 0),
        'status'      => resident_status_label($row['status'] ?? 'current'),
        'status_code' => (string)($row['status'] ?? 'current'),
        'rent_breakdown' => [
            'base'  => $base,
            'fees'  => $fees,
            'total' => $rent,
        ],
        'must_change_password' => !empty($account['must_change_password']),
        'last_login' => $account['last_login'] ?? null,
    ];
}

/** Lease block (start / end / term / rent breakdown). */
function resident_lease($profile) {
    $start = $profile['lease_start'] ?? null;
    $end   = $profile['lease_end'] ?? null;

    $term = null;
    if ($start && $end) {
        try {
            $s = new DateTime($start);
            $e = new DateTime($end);
            $term = max(1, (int)round(($e->getTimestamp() - $s->getTimestamp()) / (30.4375 * 86400)));
        } catch (Exception $ex) {
            $term = null;
        }
    }

    return [
        'start'          => $start,
        'end'            => $end,
        'term'           => $term,
        'rent_breakdown' => $profile['rent_breakdown'],
    ];
}

// ── Overview datasets ─────────────────────────────────────────────────────────

/**
 * Rows of a shared JSON fallback file (backend/data/<name>.json).
 * Yehi files worldfirst.php / maintenance.php likhte hain — resident portal
 * ko unhi se data milna chahiye, warna dono stores out of sync ho jayenge.
 */
function resident_shared_json(string $file) {
    $path = dirname(__DIR__) . '/data/' . $file;
    if (!file_exists($path)) {
        return [];
    }
    $parsed = json_decode(@file_get_contents($path), true);
    return is_array($parsed) ? $parsed : [];
}

function resident_payments($pdo, string $unit) {
    $rows = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "SELECT * FROM `transactions`
                 WHERE `unit_number` = :unit
                 ORDER BY `created_at` DESC, `id` DESC
                 LIMIT 100"
            );
            $stmt->execute([':unit' => $unit]);
            $rows = $stmt->fetchAll() ?: [];
        } catch (Exception $e) {
            error_log('[resident] transactions lookup failed: ' . $e->getMessage());
        }
    }
    if (empty($rows)) {
        // Shared WorldFirst JSON store (MySQL ke bina yahin likha jata hai)
        $rows = array_values(array_filter(
            resident_shared_json('transactions.json'),
            function ($r) use ($unit) {
                return (string)($r['unit_number'] ?? '') === $unit;
            }
        ));
    }
    if (empty($rows)) {
        $rows = resident_json_filter('transactions', function ($r) use ($unit) {
            return (string)($r['unit_number'] ?? '') === $unit;
        });
    }

    usort($rows, function ($a, $b) {
        return strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? ''));
    });

    return array_map(function ($r) {
        return [
            'txn_id'               => $r['txn_id'] ?? ($r['id'] ?? ''),
            'item_name'            => $r['item_name'] ?? ($r['item_type'] ?? 'Payment'),
            'item_type'            => $r['item_type'] ?? 'rent_payment',
            'unit_number'          => $r['unit_number'] ?? null,
            'amount'               => (float)($r['amount'] ?? 0),
            'currency'             => $r['currency'] ?? 'USD',
            'status'               => $r['status'] ?? 'pending',
            'payment_mode'         => $r['payment_mode'] ?? 'one_time',
            'subscription_interval'=> $r['subscription_interval'] ?? null,
            'subscription_status'  => $r['subscription_status'] ?? 'none',
            'next_billing_date'    => $r['next_billing_date'] ?? null,
            'created_at'           => $r['created_at'] ?? null,
        ];
    }, $rows);
}

function resident_maintenance($pdo, string $unit) {
    $rows = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "SELECT * FROM `maintenance_tickets`
                 WHERE `unit_number` = :unit
                 ORDER BY `created_at` DESC, `id` DESC
                 LIMIT 100"
            );
            $stmt->execute([':unit' => $unit]);
            $rows = $stmt->fetchAll() ?: [];
        } catch (Exception $e) {
            error_log('[resident] maintenance lookup failed: ' . $e->getMessage());
        }
    }
    if (empty($rows)) {
        // Shared maintenance JSON store
        $rows = array_values(array_filter(
            resident_shared_json('maintenance.json'),
            function ($r) use ($unit) {
                return (string)($r['unit_number'] ?? '') === $unit;
            }
        ));
    }
    if (empty($rows)) {
        $rows = resident_json_filter('maintenance_tickets', function ($r) use ($unit) {
            return (string)($r['unit_number'] ?? '') === $unit;
        });
    }

    return array_map(function ($r) {
        return [
            'id'        => $r['ticket_id'] ?? ($r['id'] ?? ''),
            'title'     => $r['title'] ?? 'Maintenance Request',
            'category'  => $r['category'] ?? 'General',
            'priority'  => $r['priority'] ?? 'Medium',
            'status'    => $r['status'] ?? 'pending',
            'notes'     => $r['notes'] ?? '',
            'date'      => $r['date_submitted'] ?? ($r['created_at'] ?? ''),
            'created_at'=> $r['created_at'] ?? null,
        ];
    }, $rows);
}

function resident_documents($pdo, string $unit) {
    $rows = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "SELECT * FROM `documents` WHERE `unit_number` = :unit ORDER BY `id` ASC LIMIT 100"
            );
            $stmt->execute([':unit' => $unit]);
            $rows = $stmt->fetchAll() ?: [];
        } catch (Exception $e) {
            error_log('[resident] documents lookup failed: ' . $e->getMessage());
        }
    }
    if (empty($rows)) {
        $rows = resident_json_filter('documents', function ($r) use ($unit) {
            return (string)($r['unit_number'] ?? '') === $unit;
        });
    }

    return array_map(function ($r) {
        return [
            'id'        => $r['id'] ?? ($r['name'] ?? ''),
            'name'      => $r['name'] ?? 'Document.pdf',
            'category'  => $r['category'] ?? 'General',
            'size'      => $r['file_size'] ?? '1.0 MB',
            'date'      => $r['doc_date'] ?? ($r['created_at'] ?? ''),
            'file_url'  => $r['file_url'] ?? null,
        ];
    }, $rows);
}

function resident_notifications($pdo, string $unit) {
    $rows = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "SELECT * FROM `notifications` WHERE `user_unit` = :unit ORDER BY `id` DESC LIMIT 100"
            );
            $stmt->execute([':unit' => $unit]);
            $rows = $stmt->fetchAll() ?: [];
        } catch (Exception $e) {
            error_log('[resident] notifications lookup failed: ' . $e->getMessage());
        }
    }
    if (empty($rows)) {
        $rows = resident_json_filter('notifications', function ($r) use ($unit) {
            return (string)($r['user_unit'] ?? '') === $unit;
        });
    }

    return array_map(function ($r) {
        return [
            'id'      => $r['id'] ?? null,
            'type'    => $r['type'] ?? 'info',
            'msg'     => $r['message'] ?? '',
            'time'    => $r['time_text'] ?? 'Just now',
            'is_read' => !empty($r['is_read']),
        ];
    }, $rows);
}

function resident_activity($pdo, string $unit) {
    $rows = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "SELECT * FROM `resident_activity`
                 WHERE `unit_number` = :unit
                 ORDER BY `occurred_at` DESC, `id` DESC
                 LIMIT 60"
            );
            $stmt->execute([':unit' => $unit]);
            $rows = $stmt->fetchAll() ?: [];
        } catch (Exception $e) {
            error_log('[resident] activity lookup failed: ' . $e->getMessage());
        }
    }
    if (empty($rows)) {
        $rows = array_values(array_filter(
            resident_store_read()['activity'],
            function ($r) use ($unit) {
                return (string)($r['unit_number'] ?? '') === $unit;
            }
        ));
    }

    return array_map(function ($r) {
        return [
            'id'          => $r['id'] ?? null,
            'kind'        => $r['kind'] ?? 'notice',
            'title'       => $r['title'] ?? '',
            'detail'      => $r['detail'] ?? '',
            'amount'      => $r['amount'] !== null ? (float)$r['amount'] : null,
            'status'      => $r['status'] ?? null,
            'occurred_at' => $r['occurred_at'] ?? null,
        ];
    }, $rows);
}

/** Add-on catalog + resident ka apna active/inactive state. */
function resident_addons($pdo, string $unit) {
    $catalog = [];
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `addons` WHERE `is_active` = 1 ORDER BY `id` ASC");
            $stmt->execute();
            $catalog = $stmt->fetchAll() ?: [];
        } catch (Exception $e) {
            error_log('[resident] addons lookup failed: ' . $e->getMessage());
        }
    }
    if (empty($catalog)) {
        $catalog = resident_json_data('addons');
    }

    // Latest addon activity decides active state
    $states = [];
    foreach (resident_activity($pdo, $unit) as $entry) {
        if (($entry['kind'] ?? '') !== 'addon') continue;
        $key = (string)($entry['detail'] ?? '');
        if ($key === '') continue;
        $states[$key] = ($entry['status'] ?? '') === 'active';
    }

    return array_map(function ($a) use ($states) {
        $key = (string)($a['addon_key'] ?? ($a['id'] ?? ''));
        return [
            'id'     => $key,
            'name'   => $a['name'] ?? 'Add-on',
            'price'  => (float)($a['price'] ?? 0),
            'icon'   => $a['icon'] ?? 'Package',
            'active' => array_key_exists($key, $states) ? (bool)$states[$key] : false,
        ];
    }, $catalog);
}

/** Complete dashboard payload. */
function resident_overview($pdo, string $unit, array $account) {
    $profile = resident_profile($pdo, $unit, $account);

    return [
        'resident'      => $profile,
        'lease'         => resident_lease($profile),
        'payments'      => resident_payments($pdo, $unit),
        'maintenance'   => resident_maintenance($pdo, $unit),
        'addons'        => resident_addons($pdo, $unit),
        'documents'     => resident_documents($pdo, $unit),
        'notifications' => resident_notifications($pdo, $unit),
        'activity'      => resident_activity($pdo, $unit),
    ];
}

// ── Action: LOGIN (public) ────────────────────────────────────────────────────
if ($__action === 'login') {
    $email    = trim((string)($__json['email'] ?? ($_POST['email'] ?? '')));
    $unit     = trim((string)($__json['unit_number'] ?? ($_POST['unit_number'] ?? '')));
    $password = (string)($__json['password'] ?? ($_POST['password'] ?? ''));

    if ($email === '' || $unit === '' || $password === '') {
        auth_json_out(false, ['error' => 'Email, unit number and password are all required.', 'code' => 'missing_fields'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        auth_json_out(false, ['error' => 'Please enter a valid email address.', 'code' => 'invalid_email'], 400);
    }

    // Brute-force protection (same helper the admin login uses)
    $lockKey = 'resident|' . strtolower($email) . '|' . $unit;
    $lock = auth_login_lock_status($lockKey);
    if ($lock['locked']) {
        $mins = (int)ceil($lock['retry_after'] / 60);
        auth_json_out(false, [
            'error' => "Too many failed login attempts. Please try again in {$mins} minute(s).",
            'code'  => 'rate_limited',
        ], 429);
    }

    $pdo     = getDatabaseConnection();
    $account = resident_find_account($pdo, $email, $unit);

    $hash = (string)($account['password_hash'] ?? '');
    if (!$account || $hash === '' || !password_verify($password, $hash)) {
        auth_login_record_failure($lockKey);
        resident_log('login_failed', $email . ' / unit ' . $unit);
        auth_json_out(false, ['error' => 'Invalid email, unit number or password.', 'code' => 'invalid_credentials'], 401);
    }
    if (empty($account['active'])) {
        auth_login_record_failure($lockKey);
        resident_log('login_blocked', $email . ' / unit ' . $unit . ' (account disabled)');
        auth_json_out(false, ['error' => 'This portal account has been disabled. Please contact the leasing office.', 'code' => 'account_disabled'], 403);
    }

    auth_login_clear_failures($lockKey);

    // Fresh resident session
    session_regenerate_id(true);
    $_SESSION['resident'] = [
        'id'     => $account['id'] ?? ($unit . '-' . time()),
        'unit'   => $unit,
        'email'  => $account['email'] ?? $email,
        'name'   => $account['full_name'] ?? '',
    ];
    $_SESSION['resident_csrf'] = bin2hex(random_bytes(32));

    $now = date('Y-m-d H:i:s');
    resident_update_account($pdo, $account, [
        'last_login'           => $now,
        'must_change_password' => !empty($account['must_change_password']) ? 1 : 0,
    ]);
    $account['last_login'] = $now;

    resident_log('login_success', $email . ' / unit ' . $unit);

    auth_json_out(true, [
        'message'     => 'Login successful',
        'resident'    => resident_profile($pdo, $unit, $account),
        'csrf_token'  => resident_csrf_token(),
        'must_change_password' => !empty($account['must_change_password']),
    ]);
}

// ── Action: LOGOUT ────────────────────────────────────────────────────────────
if ($__action === 'logout') {
    if (session_status() === PHP_SESSION_ACTIVE) {
        resident_log('logout', (string)($_SESSION['resident']['unit'] ?? ''));
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool)$params['secure'], (bool)$params['httponly']);
        }
        session_destroy();
    }
    auth_json_out(true, ['message' => 'Logged out', 'authenticated' => false]);
}

// ── Action: SESSION ───────────────────────────────────────────────────────────
if ($__action === 'session') {
    $pdo      = getDatabaseConnection();
    $resident = $_SESSION['resident'] ?? null;

    if (!is_array($resident) || empty($resident['unit'])) {
        auth_json_out(true, [
            'authenticated' => false,
            'resident'      => null,
            'csrf_token'    => null,
        ]);
    }

    $account = resident_find_account_by_unit($pdo, (string)$resident['unit']);
    if (!$account || empty($account['active'])) {
        $_SESSION = [];
        auth_json_out(true, ['authenticated' => false, 'resident' => null, 'csrf_token' => null]);
    }

    auth_json_out(true, [
        'authenticated' => true,
        'resident'      => resident_profile($pdo, (string)$resident['unit'], $account),
        'csrf_token'    => resident_csrf_token(),
        'must_change_password' => !empty($account['must_change_password']),
    ]);
}

// ── Action: OVERVIEW ──────────────────────────────────────────────────────────
if ($__action === 'overview') {
    $resident = resident_require_login();
    $pdo      = getDatabaseConnection();
    $unit     = (string)$resident['unit'];
    $account  = resident_find_account_by_unit($pdo, $unit);

    if (!$account) {
        $_SESSION = [];
        auth_json_out(false, [
            'error' => 'Your portal account is no longer available. Please log in again.',
            'code'  => 'unauthorized',
        ], 401);
    }

    auth_json_out(true, array_merge(
        resident_overview($pdo, $unit, $account),
        ['csrf_token' => resident_csrf_token()]
    ));
}

// ── Action: CHANGE PASSWORD ───────────────────────────────────────────────────
if ($__action === 'change_password') {
    $resident = resident_require_login();
    resident_verify_csrf();

    $current = (string)($__json['current'] ?? ($_POST['current'] ?? ''));
    $new     = (string)($__json['new'] ?? ($_POST['new'] ?? ''));

    if ($current === '' || $new === '') {
        auth_json_out(false, ['error' => 'Current and new password are both required.', 'code' => 'missing_fields'], 400);
    }
    if (strlen($new) < 8) {
        auth_json_out(false, ['error' => 'New password must be at least 8 characters.', 'code' => 'weak_password'], 400);
    }
    if (strcasecmp($current, $new) === 0) {
        auth_json_out(false, ['error' => 'New password must be different from the current one.', 'code' => 'weak_password'], 400);
    }

    $pdo     = getDatabaseConnection();
    $unit    = (string)$resident['unit'];
    $account = resident_find_account_by_unit($pdo, $unit);

    if (!$account || empty($account['password_hash']) || !password_verify($current, $account['password_hash'])) {
        auth_json_out(false, ['error' => 'Current password is incorrect.', 'code' => 'invalid_credentials'], 400);
    }

    $hash = password_hash($new, PASSWORD_BCRYPT);
    resident_update_account($pdo, $account, [
        'password_hash'        => $hash,
        'password_enc'         => auth_encrypt($new),
        'must_change_password' => 0,
        'last_login'           => date('Y-m-d H:i:s'),
    ]);

    resident_log('change_password', $unit);
    auth_json_out(true, ['message' => 'Password updated successfully']);
}

// ── Action: SUBMIT MAINTENANCE ────────────────────────────────────────────────
if ($__action === 'submit_maintenance') {
    $resident = resident_require_login();
    resident_verify_csrf();

    $title    = trim((string)($__json['title'] ?? ''));
    $category = trim((string)($__json['category'] ?? 'General'));
    $priority = trim((string)($__json['priority'] ?? 'Medium'));
    $notes    = trim((string)($__json['notes'] ?? ($__json['description'] ?? '')));

    if ($title === '') {
        auth_json_out(false, ['error' => 'Please provide a short title for the issue.', 'code' => 'missing_fields'], 400);
    }
    if (!in_array($category, RESIDENT_CATEGORIES, true)) {
        $category = 'General';
    }
    if (!in_array($priority, RESIDENT_PRIORITIES, true)) {
        $priority = 'Medium';
    }

    $pdo  = getDatabaseConnection();
    $unit = (string)$resident['unit'];
    $name = (string)($resident['name'] ?? 'Resident');

    $ticketId = 'MR-' . date('ymd') . '-' . strtoupper(substr(uniqid(), -5));
    $now      = date('Y-m-d H:i:s');

    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "INSERT INTO `maintenance_tickets`
                    (`ticket_id`, `unit_number`, `tenant_name`, `title`, `category`, `priority`, `status`, `notes`, `date_submitted`)
                 VALUES (:tid, :unit, :tenant, :title, :cat, :prio, 'pending', :notes, :dsub)"
            );
            $stmt->execute([
                ':tid'    => $ticketId,
                ':unit'   => $unit,
                ':tenant' => $name,
                ':title'  => $title,
                ':cat'    => $category,
                ':prio'   => $priority,
                ':notes'  => $notes,
                ':dsub'   => date('M d, Y'),
            ]);
        } catch (Exception $e) {
            error_log('[resident] maintenance insert failed: ' . $e->getMessage());
            $ticketId = 'MR-' . strtoupper(substr(uniqid(), -8));
        }
    }

    // JSON mirrors: shared maintenance.json (admin panel bhi yahi padhta hai)
    // + portal ka apna residents.json store.
    $ticketRecord = [
        'id'            => $ticketId,
        'ticket_id'     => $ticketId,
        'unit_number'   => $unit,
        'tenant_name'   => $name,
        'title'         => $title,
        'category'      => $category,
        'priority'      => $priority,
        'status'        => 'pending',
        'notes'         => $notes,
        'date_submitted'=> date('M d, Y'),
        'created_at'    => $now,
    ];

    $sharedPath = dirname(__DIR__) . '/data/maintenance.json';
    $shared = resident_shared_json('maintenance.json');
    array_unshift($shared, $ticketRecord);
    @file_put_contents($sharedPath, json_encode(array_slice($shared, 0, 300), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    $store = resident_store_read();
    array_unshift($store['data']['maintenance_tickets'], $ticketRecord);
    $store['data']['maintenance_tickets'] = array_slice($store['data']['maintenance_tickets'], 0, 200);
    resident_store_write($store);

    resident_record_activity($pdo, [
        'unit_number' => $unit,
        'kind'        => 'maintenance',
        'title'       => $title,
        'detail'      => $category . ' · ' . $priority,
        'status'      => 'pending',
    ]);

    resident_log('submit_maintenance', $unit . ' · ' . $title);

    auth_json_out(true, [
        'message' => 'Maintenance request submitted successfully.',
        'ticket'  => [
            'id'       => $ticketId,
            'title'    => $title,
            'category' => $category,
            'priority' => $priority,
            'status'   => 'pending',
            'notes'    => $notes,
            'date'     => date('M d, Y'),
        ],
    ]);
}

// ── Action: TOGGLE ADDON ──────────────────────────────────────────────────────
if ($__action === 'toggle_addon') {
    $resident = resident_require_login();
    resident_verify_csrf();

    $key    = trim((string)($__json['addon_key'] ?? ($__json['id'] ?? '')));
    $active = !empty($__json['active']) ? 1 : 0;

    if ($key === '') {
        auth_json_out(false, ['error' => 'Add-on key is required.', 'code' => 'missing_fields'], 400);
    }

    $pdo  = getDatabaseConnection();
    $unit = (string)$resident['unit'];

    // Add-on catalog se naam nikalo (MySQL → JSON fallback)
    $catalog = resident_addons($pdo, $unit);
    $found   = null;
    foreach ($catalog as $a) {
        if ((string)$a['id'] === $key) {
            $found = $a;
            break;
        }
    }
    if (!$found) {
        auth_json_out(false, ['error' => 'Unknown add-on.', 'code' => 'not_found'], 404);
    }

    resident_record_activity($pdo, [
        'unit_number' => $unit,
        'kind'        => 'addon',
        'title'       => $found['name'],
        'detail'      => $key,
        'amount'      => $found['price'],
        'status'      => $active ? 'active' : 'inactive',
    ]);

    resident_log('toggle_addon', $unit . ' · ' . $key . ' => ' . ($active ? 'active' : 'inactive'));

    auth_json_out(true, [
        'message' => ($active ? 'Add-on activated.' : 'Add-on removed.'),
        'addon'   => [
            'id'     => $found['id'],
            'name'   => $found['name'],
            'price'  => $found['price'],
            'icon'   => $found['icon'],
            'active' => (bool)$active,
        ],
    ]);
}

// ── Action: CANCEL AUTOPAY (resident-scoped) ──────────────────────────────────
if ($__action === 'cancel_autopay') {
    $resident = resident_require_login();
    resident_verify_csrf();

    $pdo  = getDatabaseConnection();
    $unit = (string)$resident['unit'];

    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "UPDATE `transactions`
                 SET `subscription_status` = 'cancelled'
                 WHERE `unit_number` = :unit
                   AND `payment_mode` = 'subscription'
                   AND `subscription_status` = 'active'"
            );
            $stmt->execute([':unit' => $unit]);
        } catch (Exception $e) {
            error_log('[resident] autopay cancel failed: ' . $e->getMessage());
        }
    }

    $store = resident_store_read();
    if (isset($store['data']['transactions']) && is_array($store['data']['transactions'])) {
        foreach ($store['data']['transactions'] as $k => $t) {
            if ((string)($t['unit_number'] ?? '') !== $unit) continue;
            if (($t['payment_mode'] ?? '') !== 'subscription') continue;
            $store['data']['transactions'][$k]['subscription_status'] = 'cancelled';
        }
        resident_store_write($store);
    }

    // Shared WorldFirst JSON store
    $sharedTxns = resident_shared_json('transactions.json');
    foreach ($sharedTxns as $k => $t) {
        if ((string)($t['unit_number'] ?? '') !== $unit) continue;
        if (($t['payment_mode'] ?? '') !== 'subscription') continue;
        $sharedTxns[$k]['subscription_status'] = 'cancelled';
    }
    if (!empty($sharedTxns)) {
        @file_put_contents(
            dirname(__DIR__) . '/data/transactions.json',
            json_encode(array_values($sharedTxns), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );
    }

    resident_record_activity($pdo, [
        'unit_number' => $unit,
        'kind'        => 'payment',
        'title'       => 'Auto-Pay cancelled',
        'detail'      => 'Recurring rent debits stopped',
        'status'      => 'cancelled',
    ]);

    resident_log('cancel_autopay', $unit);

    auth_json_out(true, ['message' => 'Auto-Pay subscription cancelled.']);
}

// ── Action: CREATE ACCOUNT (super admin only) ─────────────────────────────────
if ($__action === 'create_account') {
    // Admin session namespace (PHPSESSID) — _auth.php ne isko start kiya hua hai.
    $admin = auth_current_user();
    if (!$admin || $admin['role'] !== 'super_admin') {
        auth_json_out(false, [
            'error' => 'Super admin access only.',
            'code'  => 'forbidden',
        ], 403);
    }
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        auth_json_out(false, ['error' => 'This action requires a POST request.', 'code' => 'method_not_allowed'], 405);
    }
    auth_verify_csrf();

    $unit     = trim((string)($__json['unit_number'] ?? ($_POST['unit_number'] ?? '')));
    $email    = trim((string)($__json['email'] ?? ($_POST['email'] ?? '')));
    $fullName = trim((string)($__json['full_name'] ?? ($_POST['full_name'] ?? '')));
    $password = (string)($__json['password'] ?? ($_POST['password'] ?? ''));
    $mustChange = array_key_exists('must_change_password', $__json)
        ? (int)(bool)$__json['must_change_password']
        : 1;

    if ($unit === '' || $email === '' || $fullName === '' || $password === '') {
        auth_json_out(false, ['error' => 'Unit number, email, full name and password are all required.', 'code' => 'missing_fields'], 400);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        auth_json_out(false, ['error' => 'Please provide a valid email address.', 'code' => 'invalid_email'], 400);
    }
    if (strlen($password) < 8) {
        auth_json_out(false, ['error' => 'Password must be at least 8 characters.', 'code' => 'weak_password'], 400);
    }

    $pdo = getDatabaseConnection();
    if (resident_find_account_by_unit($pdo, $unit)) {
        auth_json_out(false, ['error' => 'A portal account already exists for unit ' . $unit . '.', 'code' => 'duplicate'], 409);
    }

    $now  = date('Y-m-d H:i:s');
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $enc  = auth_encrypt($password);
    $id   = 'RES-' . strtoupper(substr(uniqid(), -8));

    if ($pdo) {
        try {
            $stmt = $pdo->prepare(
                "INSERT INTO `resident_accounts`
                    (`unit_number`, `email`, `full_name`, `password_hash`, `password_enc`, `active`, `must_change_password`, `created_at`)
                 VALUES (:unit, :email, :name, :hash, :enc, 1, :must, :created)"
            );
            $stmt->execute([
                ':unit'   => $unit,
                ':email'  => $email,
                ':name'   => $fullName,
                ':hash'   => $hash,
                ':enc'    => $enc,
                ':must'   => $mustChange,
                ':created'=> $now,
            ]);
            $id = (string)$pdo->lastInsertId();
        } catch (Exception $e) {
            error_log('[resident] account insert failed: ' . $e->getMessage());
            auth_json_out(false, ['error' => 'Could not create the account: ' . $e->getMessage(), 'code' => 'db_error'], 500);
        }
    }

    // JSON mirror
    $store = resident_store_read();
    $store['accounts'][] = [
        'id'                  => $id,
        'unit_number'         => $unit,
        'email'               => $email,
        'full_name'           => $fullName,
        'password_hash'       => $hash,
        'password_enc'        => $enc,
        'active'              => 1,
        'must_change_password'=> $mustChange,
        'created_at'          => $now,
        'last_login'          => null,
    ];
    resident_store_write($store);

    auth_log('resident_account_created', 'Unit: ' . $unit . ' (' . $email . ')');
    resident_log('create_account', $unit . ' (' . $email . ')');

    auth_json_out(true, [
        'message'  => 'Resident portal account created.',
        'account'  => [
            'id'                  => $id,
            'unit_number'         => $unit,
            'email'               => $email,
            'full_name'           => $fullName,
            'active'              => 1,
            'must_change_password'=> (bool)$mustChange,
            'created_at'          => $now,
        ],
    ]);
}

auth_json_out(false, ['error' => 'Unknown resident action requested', 'code' => 'unknown_action'], 400);
