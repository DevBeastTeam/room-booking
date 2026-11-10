<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - Resident Portal Seeder (CLI)
 * ==============================================================================
 * Creates the first resident portal account for unit 2104 so that
 * /dashboard has a real, authenticated user to log in with.
 *
 * Usage:
 *     php backend/migrations/seed_residents.php
 *
 * Behaviour:
 *   - Reads DB credentials from backend/config/.env
 *   - MySQL available  → INSERT/UPDATE `resident_accounts`
 *   - MySQL unavailable→ same account is written to the JSON fallback store
 *                        (backend/data/residents.json) together with the demo
 *                        rows the resident overview needs
 * ==============================================================================
 */

require_once dirname(__DIR__) . '/config/database.php';

if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json; charset=UTF-8');
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error'   => 'seed_residents.php is a CLI-only script. Run: php backend/migrations/seed_residents.php',
    ]);
    exit;
}

// ── Seed definitions ──────────────────────────────────────────────────────────
$SEED_UNIT      = '2104';
$SEED_EMAIL     = 'sarah.johnson@email.com';
$SEED_NAME      = 'Sarah Johnson';
$SEED_PASSWORD  = 'Resident@2026';
$SEED_MUST_CHANGE = 1;

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'database'  => DB_NAME,
    'host'      => DB_HOST,
    'account'   => [
        'unit_number'  => $SEED_UNIT,
        'email'        => $SEED_EMAIL,
        'full_name'    => $SEED_NAME,
        'must_change_password' => (bool)$SEED_MUST_CHANGE,
    ],
    'steps'     => [],
    'success'   => false,
];

$envVars = loadEnvFile(dirname(__DIR__) . '/config/.env');

/**
 * Reversible AES-256-GCM encrypt — same scheme as the admin credential store.
 * Kept local (instead of pulling in _auth.php) so the CLI script never has to
 * start a PHP session.
 */
function seed_cred_key() {
    static $key = null;
    if ($key !== null) {
        return $key;
    }
    $envVars = loadEnvFile(dirname(__DIR__) . '/config/.env');
    $configured = trim((string)($envVars['ADMIN_CRED_KEY'] ?? ''));
    if ($configured !== '' && $configured !== 'monar-default-cred-key-change-in-env'
        && $configured !== 'monar_secret_setup_key_2026') {
        $key = $configured;
        return $key;
    }
    $keyFile = dirname(__DIR__) . '/data/.cred_key';
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
    return $key;
}

function seed_encrypt($plain) {
    $key = hash('sha256', seed_cred_key(), true);
    $iv  = random_bytes(12);
    $tag = '';
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, '', 16);
    if ($cipher === false) {
        return null;
    }
    return base64_encode($iv . $tag . $cipher);
}

// ── 1. Ensure the schema tables exist (idempotent, same SQL as the migration) ─
try {
    $pdo = getDatabaseConnection();
} catch (Exception $e) {
    $pdo = null;
}

if ($pdo) {
    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `resident_accounts` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `unit_number` VARCHAR(32) NOT NULL UNIQUE,
                `email` VARCHAR(191) NOT NULL,
                `full_name` VARCHAR(191) NOT NULL,
                `password_hash` VARCHAR(255) NOT NULL,
                `password_enc` VARCHAR(255) DEFAULT NULL,
                `active` TINYINT(1) NOT NULL DEFAULT 1,
                `must_change_password` TINYINT(1) NOT NULL DEFAULT 0,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `last_login` DATETIME DEFAULT NULL,
                INDEX `idx_email` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `resident_activity` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `unit_number` VARCHAR(32) NOT NULL,
                `kind` ENUM('payment','lease','maintenance','addon','document','notice') DEFAULT 'notice',
                `title` VARCHAR(191) NOT NULL,
                `detail` VARCHAR(255) DEFAULT NULL,
                `amount` DECIMAL(10,2) DEFAULT NULL,
                `status` VARCHAR(32) DEFAULT NULL,
                `occurred_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX `idx_unit` (`unit_number`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
        $results['steps'][] = "Resident portal tables verified / created.";
    } catch (Exception $e) {
        $results['steps'][] = "Notice while creating tables: " . $e->getMessage();
    }
} else {
    $results['steps'][] = "MySQL not reachable — using the JSON fallback store only.";
}

// ── 2. Create / update the resident account ───────────────────────────────────
$passwordHash = password_hash($SEED_PASSWORD, PASSWORD_BCRYPT);
$passwordEnc  = seed_encrypt($SEED_PASSWORD);
$now          = date('Y-m-d H:i:s');

$storedInMysql = false;
if ($pdo) {
    try {
        $check = $pdo->prepare("SELECT `id` FROM `resident_accounts` WHERE `unit_number` = :unit LIMIT 1");
        $check->execute([':unit' => $SEED_UNIT]);
        $existingId = $check->fetchColumn();

        if ($existingId) {
            $stmt = $pdo->prepare("
                UPDATE `resident_accounts`
                SET `email` = :email, `full_name` = :name, `password_hash` = :hash,
                    `password_enc` = :enc, `active` = 1, `must_change_password` = :must
                WHERE `unit_number` = :unit
            ");
            $stmt->execute([
                ':email' => $SEED_EMAIL,
                ':name'  => $SEED_NAME,
                ':hash'  => $passwordHash,
                ':enc'   => $passwordEnc,
                ':must'  => $SEED_MUST_CHANGE,
                ':unit'  => $SEED_UNIT,
            ]);
            $results['steps'][] = "Updated existing resident_accounts row for unit {$SEED_UNIT}.";
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO `resident_accounts`
                    (`unit_number`, `email`, `full_name`, `password_hash`, `password_enc`, `active`, `must_change_password`, `created_at`)
                VALUES (:unit, :email, :name, :hash, :enc, 1, :must, :created)
            ");
            $stmt->execute([
                ':unit'    => $SEED_UNIT,
                ':email'   => $SEED_EMAIL,
                ':name'    => $SEED_NAME,
                ':hash'    => $passwordHash,
                ':enc'     => $passwordEnc,
                ':must'    => $SEED_MUST_CHANGE,
                ':created' => $now,
            ]);
            $results['steps'][] = "Created resident_accounts row for unit {$SEED_UNIT}.";
        }
        $storedInMysql = true;
    } catch (Exception $e) {
        $results['steps'][] = "Error writing resident_accounts: " . $e->getMessage();
    }
}

// ── 3. JSON fallback store (works without MySQL) ──────────────────────────────
$storePath = dirname(__DIR__) . '/data/residents.json';
$storeDir  = dirname($storePath);
if (!is_dir($storeDir)) {
    @mkdir($storeDir, 0755, true);
}

$store = file_exists($storePath)
    ? (json_decode(@file_get_contents($storePath), true) ?: [])
    : [];
if (!is_array($store)) {
    $store = [];
}
$store['version']  = $store['version'] ?? 1;
$store['accounts'] = is_array($store['accounts'] ?? null) ? $store['accounts'] : [];
$store['activity'] = is_array($store['activity'] ?? null) ? $store['activity'] : [];
$store['data']     = is_array($store['data'] ?? null) ? $store['data'] : [];

$accountFound = false;
foreach ($store['accounts'] as $k => $row) {
    if ((string)($row['unit_number'] ?? '') === $SEED_UNIT) {
        $store['accounts'][$k]['email']                = $SEED_EMAIL;
        $store['accounts'][$k]['full_name']            = $SEED_NAME;
        $store['accounts'][$k]['password_hash']        = $passwordHash;
        $store['accounts'][$k]['password_enc']         = $passwordEnc;
        $store['accounts'][$k]['active']               = 1;
        $store['accounts'][$k]['must_change_password'] = $SEED_MUST_CHANGE;
        $accountFound = true;
        break;
    }
}
if (!$accountFound) {
    $store['accounts'][] = [
        'id'                   => 'RES-' . strtoupper(substr(uniqid(), -8)),
        'unit_number'          => $SEED_UNIT,
        'email'                => $SEED_EMAIL,
        'full_name'            => $SEED_NAME,
        'password_hash'        => $passwordHash,
        'password_enc'         => $passwordEnc,
        'active'               => 1,
        'must_change_password' => $SEED_MUST_CHANGE,
        'created_at'           => $now,
        'last_login'           => null,
    ];
}

// Demo rows so the resident portal has content even without MySQL.
$defaults = [
    'residents' => [[
        'id' => 1, 'name' => $SEED_NAME, 'email' => $SEED_EMAIL, 'phone' => '(817) 555-0142',
        'unit_number' => $SEED_UNIT, 'floor_plan_name' => 'Two Bedroom',
        'move_in_date' => '2026-02-01', 'lease_end_date' => '2027-01-31',
        'rent' => 967, 'deposit' => 250, 'status' => 'current',
    ]],
    'units' => [[
        'id' => 1, 'unit_number' => $SEED_UNIT, 'floor_plan_slug' => 'two-bedroom',
        'beds' => 2, 'floor' => 2, 'sqft' => 769, 'rent' => 909,
        'status' => 'occupied', 'tenant_name' => $SEED_NAME, 'move_in_date' => '2025-02-01',
    ]],
    'floor_plans' => [[
        'id' => 1, 'slug' => 'two-bedroom', 'name' => 'Two Bedroom',
        'beds' => 2, 'baths' => 2.0, 'sqft' => 769,
        'price_12m' => 909, 'price_10m' => 960, 'price_6m' => 1050, 'deposit' => 250,
    ]],
    'maintenance_tickets' => [
        [
            'id' => 1, 'ticket_id' => 'MR-001', 'unit_number' => $SEED_UNIT, 'tenant_name' => $SEED_NAME,
            'title' => 'AC not cooling properly', 'category' => 'HVAC', 'priority' => 'High',
            'status' => 'in-progress', 'notes' => 'Technician scheduled', 'date_submitted' => 'Sep 15, 2026',
        ],
        [
            'id' => 2, 'ticket_id' => 'MR-002', 'unit_number' => $SEED_UNIT, 'tenant_name' => $SEED_NAME,
            'title' => 'Kitchen faucet dripping', 'category' => 'Plumbing', 'priority' => 'Medium',
            'status' => 'completed', 'notes' => 'Fixed — faucet replaced', 'date_submitted' => 'Aug 28, 2026',
        ],
        [
            'id' => 3, 'ticket_id' => 'MR-003', 'unit_number' => $SEED_UNIT, 'tenant_name' => $SEED_NAME,
            'title' => 'Bathroom light flickering', 'category' => 'Electrical', 'priority' => 'Low',
            'status' => 'pending', 'notes' => 'Awaiting assignment', 'date_submitted' => 'Sep 18, 2026',
        ],
    ],
    'addons' => [
        ['id' => 1, 'addon_key' => 'carport', 'name' => 'Reserved Covered Carport', 'price' => 35, 'icon' => 'Car', 'is_active' => 1],
        ['id' => 2, 'addon_key' => 'storage', 'name' => 'Extra Storage Locker', 'price' => 45, 'icon' => 'Archive', 'is_active' => 1],
        ['id' => 3, 'addon_key' => 'washer',  'name' => 'In-Unit Washer & Dryer', 'price' => 40, 'icon' => 'Layers', 'is_active' => 1],
    ],
    'documents' => [
        ['id' => 1, 'name' => 'Lease Agreement 2026-2027.pdf', 'category' => 'Lease', 'file_size' => '1.2 MB', 'doc_date' => 'Feb 1, 2026', 'unit_number' => $SEED_UNIT],
        ['id' => 2, 'name' => 'Move-In Inspection Report.pdf', 'category' => 'Inspection', 'file_size' => '0.8 MB', 'doc_date' => 'Feb 1, 2026', 'unit_number' => $SEED_UNIT],
        ['id' => 3, 'name' => 'Community Rules & Regulations.pdf', 'category' => 'Policy', 'file_size' => '0.5 MB', 'doc_date' => 'Jan 15, 2026', 'unit_number' => $SEED_UNIT],
        ['id' => 4, 'name' => 'Renter Insurance Policy.pdf', 'category' => 'Insurance', 'file_size' => '2.1 MB', 'doc_date' => 'Feb 5, 2026', 'unit_number' => $SEED_UNIT],
    ],
    'notifications' => [
        ['id' => 1, 'user_unit' => $SEED_UNIT, 'type' => 'info', 'message' => 'Your rent for this month is due on the 1st.', 'time_text' => '2h ago', 'is_read' => 0],
        ['id' => 2, 'user_unit' => $SEED_UNIT, 'type' => 'success', 'message' => 'Maintenance request MR-002 has been completed.', 'time_text' => '3d ago', 'is_read' => 0],
        ['id' => 3, 'user_unit' => $SEED_UNIT, 'type' => 'warning', 'message' => 'Community pool will be closed for cleaning.', 'time_text' => '5d ago', 'is_read' => 0],
        ['id' => 4, 'user_unit' => $SEED_UNIT, 'type' => 'info', 'message' => 'Your lease renewal offer is ready to review.', 'time_text' => '1w ago', 'is_read' => 0],
    ],
    'transactions' => [
        [
            'id' => 1, 'txn_id' => 'WF-TXN-DEMO001', 'payment_gateway' => 'worldfirst',
            'payment_mode' => 'one_time', 'subscription_interval' => null, 'subscription_status' => 'none',
            'next_billing_date' => null, 'user_name' => $SEED_NAME, 'user_email' => $SEED_EMAIL,
            'item_type' => 'rent_payment', 'item_name' => 'Monthly Apartment Rent',
            'unit_number' => $SEED_UNIT, 'amount' => 967.00, 'currency' => 'USD',
            'status' => 'completed', 'created_at' => date('Y-m-d H:i:s', strtotime('-1 month')),
        ],
    ],
];

foreach ($defaults as $table => $rows) {
    if (empty($store['data'][$table])) {
        $store['data'][$table] = $rows;
    }
}

if (empty($store['activity'])) {
    $store['activity'] = [[
        'id' => 1, 'unit_number' => $SEED_UNIT, 'kind' => 'lease',
        'title' => 'Lease activated', 'detail' => 'Two Bedroom · 12 month term',
        'amount' => null, 'status' => 'active', 'occurred_at' => date('Y-m-d H:i:s', strtotime('-3 months')),
    ]];
}

@file_put_contents($storePath, json_encode($store, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
$results['steps'][] = "JSON fallback store updated: " . basename($storePath);

$results['success'] = true;
$results['message']  = "Resident portal account ready for unit {$SEED_UNIT} ({$SEED_EMAIL}).";

// ── CLI output ────────────────────────────────────────────────────────────────
echo "\n=== Monar Pass Resident Portal Seeder ===\n";
echo "Database: " . $results['database'] . " (" . $results['host'] . ")\n";
echo "Unit:     " . $SEED_UNIT . "\n";
echo "Email:    " . $SEED_EMAIL . "\n";
echo "Password: " . $SEED_PASSWORD . "  (must_change_password = 1)\n";
echo "Status:   " . ($results['success'] ? "SUCCESS [OK]" : "FAILED") . "\n";
echo "MySQL:    " . ($storedInMysql ? "written" : "not available — JSON fallback used") . "\n";
if (!empty($results['steps'])) {
    echo "Steps:\n";
    foreach ($results['steps'] as $s) {
        echo "  - " . $s . "\n";
    }
}
if (!$results['success']) {
    echo "Error: " . ($results['error'] ?? 'Unknown error') . "\n";
}
echo "=========================================\n\n";
