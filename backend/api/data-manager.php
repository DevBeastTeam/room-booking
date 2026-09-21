<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Modular Database Manager API
 * ==============================================================================
 * Handles:
 *  - Live table statistics (row counts)
 *  - Modular Seeding (per-table or bulk demo data insertion)
 *  - Modular Clearing / Formatting (per-table or bulk table truncation)
 *  - Modular Export (JSON payload or file download)
 *  - Modular Import (JSON payload restoration)
 * ==============================================================================
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once dirname(__DIR__) . '/config/database.php';

$pdo = getDatabaseConnection();
if (!$pdo) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection unavailable',
        'details' => 'Please ensure MySQL server is running and credentials in backend/config/.env are correct.'
    ]);
    exit;
}

// Ensure all tables exist
function ensureTablesExist($pdo) {
    $schemaFile = dirname(__DIR__) . '/migrations/001_initial_schema.sql';
    if (file_exists($schemaFile)) {
        try {
            $sql = file_get_contents($schemaFile);
            $pdo->exec($sql);
        } catch (Exception $e) {
            // Ignore if already created
        }
    }
}
ensureTablesExist($pdo);

$action = $_GET['action'] ?? 'stats';

// ── 1. STATS: Live Row Counts ─────────────────────────────────────────────────
if ($action === 'stats') {
    $tableList = [
        'floor_plans', 'units', 'applications', 'residents',
        'maintenance_tickets', 'addons', 'email_logs', 'inquiries',
        'tours', 'site_settings', 'theme_config', 'legal_pages',
        'documents', 'notifications', 'transactions'
    ];
    $counts = [];
    foreach ($tableList as $t) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM `{$t}`");
            $counts[$t] = (int)$stmt->fetchColumn();
        } catch (Exception $e) {
            $counts[$t] = 0;
        }
    }
    echo json_encode([
        'success' => true,
        'timestamp' => date('Y-m-d H:i:s'),
        'counts' => $counts
    ]);
    exit;
}

// Read JSON input for POST actions
$input = json_decode(file_get_contents('php://input'), true) ?: [];
$requestedTables = $input['tables'] ?? [];

// Helper: Seed Definition Map
function seedModule($pdo, $table) {
    switch ($table) {
        case 'floor_plans':
            $pdo->exec("DELETE FROM `floor_plans`");
            $stmt = $pdo->prepare("
                INSERT INTO `floor_plans` (
                    `slug`, `name`, `beds`, `baths`, `sqft`, `total_units`, `occupied_units`, 
                    `price_12m`, `price_10m`, `price_6m`, `deposit`, `description`, `is_active`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ");
            $plans = [
                ['one-bedroom',   'One Bedroom',   1, 1.0, 614,  40, 27, 898,  950,  1020, 250, 'Efficient open-concept 1-bedroom home with modern kitchen and private patio.'],
                ['two-bedroom',   'Two Bedroom',   2, 1.0, 769,  55, 35, 909,  960,  1050, 250, 'Spacious dual-bedroom layout with oversized living room and ample storage.'],
                ['three-bedroom', 'Three Bedroom', 3, 2.0, 920,  30, 10, 1023, 1090, 1180, 250, 'Expansive 3-bedroom, 2-bathroom layout designed for families.'],
                ['four-bedroom',  'Four Bedroom',  4, 2.0, 1077, 25, 8,  1209, 1290, 1390, 250, 'Generous 4-bedroom floor plan offering maximum comfort and privacy.'],
            ];
            foreach ($plans as $p) { $stmt->execute($p); }
            return count($plans);

        case 'units':
            $pdo->exec("DELETE FROM `units`");
            $stmt = $pdo->prepare("
                INSERT INTO `units` (
                    `unit_number`, `floor_plan_slug`, `beds`, `floor`, `sqft`, `rent`, `status`, `tenant_name`, `move_in_date`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $units = [
                ['1002', 'three-bedroom', 3, 1, 920,  1023, 'available',   null,              null],
                ['1006', 'three-bedroom', 3, 1, 920,  1045, 'available',   null,              null],
                ['2104', 'two-bedroom',   2, 2, 769,  909,  'occupied',    'Sarah Johnson',    '2025-02-01'],
                ['2108', 'two-bedroom',   2, 2, 769,  925,  'occupied',    'Marcus Williams',  '2025-04-01'],
                ['2115', 'two-bedroom',   2, 2, 769,  909,  'maintenance', null,              null],
                ['3505', 'one-bedroom',   1, 3, 614,  898,  'available',   null,              null],
                ['3508', 'one-bedroom',   1, 3, 614,  908,  'occupied',    'Priya Sharma',     '2025-06-01'],
                ['3512', 'one-bedroom',   1, 3, 614,  918,  'available',   null,              null],
                ['3520', 'one-bedroom',   1, 3, 614,  898,  'occupied',    'James Okafor',     '2025-03-15'],
                ['4101', 'four-bedroom',  4, 4, 1077, 1209, 'occupied',    'Chen Family',      '2025-01-01'],
                ['4105', 'four-bedroom',  4, 4, 1077, 1240, 'available',   null,              null],
            ];
            foreach ($units as $u) { $stmt->execute($u); }
            return count($units);

        case 'applications':
            $pdo->exec("DELETE FROM `applications`");
            $stmt = $pdo->prepare("
                INSERT INTO `applications` (
                    `app_id`, `applicant_name`, `floor_plan_slug`, `unit_number`, `income`, `credit_score`, `status`, `date_submitted`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $apps = [
                ['APP-001', 'David Martinez',    'two-bedroom',   '2115', '$4,800/mo', 720, 'pending',  'Sep 15, 2026'],
                ['APP-002', 'Emily Chen',        'one-bedroom',   '3505', '$3,200/mo', 695, 'pending',  'Sep 16, 2026'],
                ['APP-003', 'Robert Thompson',   'three-bedroom', '1002', '$6,100/mo', 760, 'approved', 'Sep 10, 2026'],
                ['APP-004', 'Fatima Al-Hassan',  'one-bedroom',   '3512', '$2,900/mo', 620, 'rejected', 'Sep 8, 2026'],
                ['APP-005', 'Kevin Nguyen',      'four-bedroom',  '4105', '$7,200/mo', 780, 'pending',  'Sep 18, 2026'],
            ];
            foreach ($apps as $a) { $stmt->execute($a); }
            return count($apps);

        case 'residents':
            $pdo->exec("DELETE FROM `residents`");
            $stmt = $pdo->prepare("
                INSERT INTO `residents` (
                    `name`, `email`, `phone`, `unit_number`, `floor_plan_name`, `move_in_date`, `lease_end_date`, `rent`, `deposit`, `status`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $residents = [
                ['Sarah Johnson',   'sarah.j@example.com', '+1 817-555-1021', '2104', 'Two Bedroom',   '2025-02-01', '2026-02-01', 967,  250, 'current'],
                ['Marcus Williams', 'marcus.w@example.com','+1 817-555-1044', '2108', 'Two Bedroom',   '2025-04-01', '2026-04-01', 983,  250, 'current'],
                ['Priya Sharma',    'priya.s@example.com', '+1 817-555-1089', '3508', 'One Bedroom',   '2025-06-01', '2026-06-01', 966,  250, 'current'],
                ['James Okafor',    'james.o@example.com', '+1 817-555-1092', '3520', 'One Bedroom',   '2025-03-15', '2026-03-15', 956,  250, 'notice'],
                ['Chen Family',     'chen.fam@example.com','+1 817-555-1099', '4101', 'Four Bedroom',  '2025-01-01', '2026-01-01', 1267, 250, 'current'],
            ];
            foreach ($residents as $r) { $stmt->execute($r); }
            return count($residents);

        case 'maintenance_tickets':
            $pdo->exec("DELETE FROM `maintenance_tickets`");
            $stmt = $pdo->prepare("
                INSERT INTO `maintenance_tickets` (
                    `ticket_id`, `unit_number`, `tenant_name`, `title`, `category`, `priority`, `status`, `date_submitted`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $tickets = [
                ['MR-001', '2104', 'Sarah Johnson',   'AC not cooling properly',    'HVAC',       'High',   'in-progress', 'Sep 15, 2026'],
                ['MR-002', '2104', 'Sarah Johnson',   'Kitchen faucet dripping',    'Plumbing',   'Medium', 'completed',   'Aug 28, 2026'],
                ['MR-003', '2104', 'Sarah Johnson',   'Bathroom light flickering',  'Electrical', 'Low',    'pending',     'Sep 18, 2026'],
                ['MR-004', '2108', 'Marcus Williams', 'Dishwasher not draining',    'Appliance',  'Medium', 'pending',     'Sep 17, 2026'],
                ['MR-005', '3508', 'Priya Sharma',    'Parking lot light out',      'Exterior',   'Low',    'completed',   'Sep 10, 2026'],
                ['MR-006', '2115', 'Maintenance',     'Unit turnover — deep clean', 'Turnover',   'High',   'in-progress', 'Sep 19, 2026'],
            ];
            foreach ($tickets as $t) { $stmt->execute($t); }
            return count($tickets);

        case 'addons':
            $pdo->exec("DELETE FROM `addons`");
            $stmt = $pdo->prepare("
                INSERT INTO `addons` (
                    `addon_key`, `name`, `price`, `active_count`, `icon`, `description`, `is_active`
                ) VALUES (?, ?, ?, ?, ?, ?, 1)
            ");
            $addons = [
                ['carport', 'Reserved Covered Carport', 35, 55, 'Car',     'Dedicated covered carport space close to your building entrance.'],
                ['storage', 'Extra Storage Locker',     45, 30, 'Archive', 'Secure 5x5 climate-controlled storage locker.'],
                ['washer',  'In-Unit Washer & Dryer',   40, 42, 'Layers',  'Front-loading high efficiency washer and dryer set installed.'],
            ];
            foreach ($addons as $ad) { $stmt->execute($ad); }
            return count($addons);

        case 'email_logs':
            $pdo->exec("DELETE FROM `email_logs`");
            $stmt = $pdo->prepare("
                INSERT INTO `email_logs` (
                    `recipient`, `subject`, `template`, `status`, `content_summary`, `sent_at`
                ) VALUES (?, ?, ?, ?, ?, ?)
            ");
            $emails = [
                ['jordan.m@example.com', 'Tour Scheduled: Monarch Pass Apartments', 'tour_confirmation', 'sent', 'Confirmation for Saturday tour of unit 2104', date('Y-m-d H:i:s', strtotime('-1 day'))],
                ['sarah.j@example.com',  'Payment Receipt: September Rent',        'receipt',           'sent', 'Paddle receipt for $909.00 holding/rent payment', date('Y-m-d H:i:s', strtotime('-2 days'))],
                ['david.m@example.com',  'Application Under Review (APP-001)',     'application',       'sent', 'Notice of background screening commencement', date('Y-m-d H:i:s', strtotime('-3 days'))],
                ['support@monarchpass.com', 'New Maintenance Work Order (MR-001)', 'admin_alert',      'sent', 'High priority HVAC ticket created for unit 2104', date('Y-m-d H:i:s', strtotime('-4 days'))],
            ];
            foreach ($emails as $em) { $stmt->execute($em); }
            return count($emails);

        case 'inquiries':
            $pdo->exec("DELETE FROM `inquiries`");
            $stmt = $pdo->prepare("
                INSERT INTO `inquiries` (
                    `tracking_id`, `name`, `email`, `phone`, `preferred_bedroom`, `category`, `message`, `status`, `notes`, `created_at`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $inqs = [
                ['MSG-801', 'Jordan Miller', 'jordan.m@example.com', '+1 817-555-0192', 'Two Bedroom',   'Tour Request', 'Looking to move in next month and tour unit 2104 this Saturday morning.', 'new', '', date('Y-m-d H:i:s', strtotime('-1 day'))],
                ['MSG-802', 'Amina Vance',   'amina.v@example.com',  '+1 817-555-0348', 'One Bedroom',   'Pet Policy',   'Could you confirm the pet deposit and monthly pet rent for a 1-bedroom?', 'in-progress', 'Sent pet policy PDF via email', date('Y-m-d H:i:s', strtotime('-2 days'))],
                ['MSG-803', 'Carlos Mendez', 'carlos.m@example.com', '+1 817-555-0811', 'Three Bedroom', 'Application Help', 'Submitted online application yesterday. Can I email my paystubs directly?', 'resolved', 'Paystubs attached to profile', date('Y-m-d H:i:s', strtotime('-3 days'))],
                ['MSG-804', 'Brianna Hayes', 'b.hayes@outlook.com',  '+1 817-555-0672', 'Three Bedroom', 'Pricing & Availability', 'Are 6-month or 10-month lease terms available for 3-Bedroom layouts?', 'resolved', 'Explained lease tiers', date('Y-m-d H:i:s', strtotime('-4 days'))],
            ];
            foreach ($inqs as $iq) { $stmt->execute($iq); }
            return count($inqs);

        case 'tours':
            $pdo->exec("DELETE FROM `tours`");
            $stmt = $pdo->prepare("
                INSERT INTO `tours` (
                    `tracking_id`, `name`, `email`, `phone`, `preferred_bedroom`, `preferred_unit`, `tour_date`, `tour_time`, `tour_type`, `comments`, `status`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $tours = [
                ['TOUR-101', 'Jordan Miller', 'jordan.m@example.com', '+1 817-555-0192', 'Two Bedroom', '2104', date('Y-m-d', strtotime('+2 days')), '11:00 AM', 'in-person', 'Interested in top-floor balcony', 'scheduled'],
                ['TOUR-102', 'David Martinez', 'david.m@example.com', '+1 817-555-0211', 'Two Bedroom', '2115', date('Y-m-d', strtotime('+3 days')), '02:00 PM', 'virtual-video', 'Moving from out of state', 'scheduled'],
                ['TOUR-103', 'Rachel Green',   'rachel.g@example.com', '+1 817-555-0388', 'One Bedroom', '3505', date('Y-m-d', strtotime('-1 days')), '10:00 AM', 'in-person', 'Tour completed successfully', 'completed'],
            ];
            foreach ($tours as $tr) { $stmt->execute($tr); }
            return count($tours);

        case 'site_settings':
            $pdo->exec("DELETE FROM `site_settings`");
            $defaultSettings = [
                'siteName' => 'Monarch Pass Apartments',
                'tagline' => 'Spacious 1-4 Bedroom Apartments in Fort Worth',
                'logoUrl' => 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_325,h_60/s3/2/58193/pn_monarchpass_logo_pms%20web.png',
                'heroImageUrl' => 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg',
                'phone' => '+1 817-857-8782',
                'secondaryPhone' => '+1 817-531-1750',
                'email' => 'leasing@monarchpassapts.com',
                'supportEmail' => 'support@monarchpassapts.com',
                'address' => '4500 Campus Dr, Fort Worth, TX 76119',
                'city' => 'Fort Worth',
                'state' => 'TX',
                'zip' => '76119',
                'footerDescription' => 'Come explore the wonders of Monarch Pass and find the perfect home that fits your lifestyle!',
                'managedBy' => 'Cushman & Wakefield',
                'officeHours' => [
                    'monFri' => '10:00 AM - 6:00 PM',
                    'sat' => '10:00 AM - 5:00 PM',
                    'sun' => '1:00 PM - 5:00 PM',
                ],
                'social' => [
                    'facebook' => 'https://www.facebook.com/MonarchPassAPTS',
                    'instagram' => 'https://www.instagram.com/lifeatmonarchpass',
                ],
                'portals' => [
                    'resident' => '/dashboard',
                    'applicant' => '/floor-plans',
                ],
                'mapsUrl' => 'https://maps.app.goo.gl/E71XfBiE8dE9bAjV6',
            ];
            $stmt = $pdo->prepare("INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES ('general', ?)");
            $stmt->execute([json_encode($defaultSettings)]);
            return 1;

        case 'theme_config':
            $pdo->exec("DELETE FROM `theme_config`");
            $defaultTheme = [
                'theme' => 'teal',
                'colors' => [
                    'primary' => '#5ec4b6',
                    'primaryDark' => '#3da89a',
                    'accent' => '#f59e0b',
                    'bgDark' => '#0f1117',
                    'cardBg' => '#1a2235',
                    'cardHover' => '#1f2a42',
                    'border' => '#253048',
                ]
            ];
            $stmt = $pdo->prepare("INSERT INTO `theme_config` (`theme_key`, `theme_data`) VALUES ('active_theme', ?)");
            $stmt->execute([json_encode($defaultTheme)]);
            return 1;

        case 'legal_pages':
            $pdo->exec("DELETE FROM `legal_pages`");
            $stmt = $pdo->prepare("INSERT INTO `legal_pages` (`slug`, `title`, `last_updated`, `content`) VALUES (?, ?, ?, ?)");
            $legals = [
                ['terms', 'Terms & Conditions', 'September 2026', "1. Rental Eligibility: All applicants must satisfy background and income criteria (2.5x to 3x monthly rent).\n2. Pricing Disclaimer: Rates and availability subject to change until lease signing.\n3. Community Rules: Quiet hours 10:00 PM - 8:00 AM.\n4. Subletting: Unauthorized occupants strictly prohibited."],
                ['privacy', 'Privacy Policy', 'September 2026', "1. Data Collection: We collect contact info, lease applications, and maintenance tickets.\n2. Use: Used strictly for property leasing, communications, and payments.\n3. Security: TLS encryption and role-based access control enforced."],
                ['accessibility', 'Accessibility Statement', 'September 2026', "Monarch Pass Apartments is committed to digital accessibility complying with WCAG 2.1 Level AA standards."]
            ];
            foreach ($legals as $l) { $stmt->execute($l); }
            return count($legals);

        case 'documents':
            $pdo->exec("DELETE FROM `documents`");
            $stmt = $pdo->prepare("
                INSERT INTO `documents` (`name`, `category`, `file_size`, `doc_date`, `file_url`, `unit_number`)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $docs = [
                ['Lease Agreement 2025–2026.pdf', 'Lease', '1.2 MB', 'Feb 1, 2025', '#', '2104'],
                ['Move-In Inspection Report.pdf',  'Inspection', '0.8 MB', 'Feb 1, 2025', '#', '2104'],
                ['Community Rules & Regulations.pdf', 'Policy', '0.5 MB', 'Jan 15, 2025', '#', '2104'],
                ['Renter Insurance Policy.pdf',     'Insurance', '2.1 MB', 'Feb 5, 2025', '#', '2104'],
            ];
            foreach ($docs as $d) { $stmt->execute($d); }
            return count($docs);

        case 'notifications':
            $pdo->exec("DELETE FROM `notifications`");
            $stmt = $pdo->prepare("
                INSERT INTO `notifications` (`user_unit`, `type`, `message`, `time_text`, `is_read`)
                VALUES (?, ?, ?, ?, ?)
            ");
            $notes = [
                ['2104', 'info',    'Your rent for October is due in 12 days.',           '2h ago', 0],
                ['2104', 'success', 'Maintenance request MR-002 has been completed.',      '3d ago', 1],
                ['2104', 'warning', 'Community pool will be closed Oct 1–5 for cleaning.', '5d ago', 1],
                ['2104', 'info',    'Your lease renewal offer is ready to review.',        '1w ago', 1],
            ];
            foreach ($notes as $n) { $stmt->execute($n); }
            return count($notes);

        case 'transactions':
            $pdo->exec("DELETE FROM `transactions`");
            $stmt = $pdo->prepare("
                INSERT INTO `transactions` (
                    `txn_id`, `paddle_order_id`, `user_name`, `user_email`, `item_type`, `item_name`, `unit_number`, `amount`, `currency`, `status`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'USD', ?)
            ");
            $txns = [
                ['txn_demo_001', 'pdl_ord_901', 'Sarah Johnson', 'sarah.j@example.com', 'rent_payment', 'Monthly Rent Payment', '2104', 909.00, 'completed'],
                ['txn_demo_002', 'pdl_ord_902', 'David Martinez', 'david.m@example.com', 'holding_deposit', 'Holding Deposit ($250)', '2115', 250.00, 'completed'],
                ['txn_demo_003', 'pdl_ord_903', 'Emily Chen', 'emily.c@example.com', 'application_fee', 'Rental Application Fee', '3505', 50.00, 'completed'],
            ];
            foreach ($txns as $tx) { $stmt->execute($tx); }
            return count($txns);

        default:
            return 0;
    }
}

// ── 2. SEED: Populate selected tables with rich dummy data ─────────────────────
if ($action === 'seed') {
    if (empty($requestedTables)) {
        echo json_encode(['success' => false, 'error' => 'No tables specified for seeding']);
        exit;
    }

    $seededSummary = [];
    $pdo->beginTransaction();
    try {
        foreach ($requestedTables as $table) {
            $count = seedModule($pdo, $table);
            $seededSummary[$table] = $count;
        }
        $pdo->commit();
        echo json_encode([
            'success' => true,
            'message' => 'Selected tables successfully seeded with demo data',
            'seeded' => $seededSummary
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ── 3. CLEAR / FORMAT: Wipe selected tables ───────────────────────────────────
if ($action === 'clear') {
    if (empty($requestedTables)) {
        echo json_encode(['success' => false, 'error' => 'No tables specified for clearing']);
        exit;
    }

    $cleared = [];
    try {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        foreach ($requestedTables as $table) {
            // Clean table name for safety
            $cleanTable = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
            $pdo->exec("TRUNCATE TABLE `{$cleanTable}`");
            $cleared[] = $cleanTable;
        }
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

        echo json_encode([
            'success' => true,
            'message' => 'Selected tables formatted/truncated successfully',
            'cleared' => $cleared
        ]);
    } catch (Exception $e) {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ── 4. EXPORT: Dump selected tables to structured JSON ────────────────────────
if ($action === 'export') {
    if (empty($requestedTables)) {
        echo json_encode(['success' => false, 'error' => 'No tables specified for export']);
        exit;
    }

    $exportData = [
        'app' => 'Monarch Pass Apartments',
        'exportDate' => date('Y-m-d H:i:s'),
        'version' => '1.0.0',
        'tables' => []
    ];

    try {
        foreach ($requestedTables as $table) {
            $cleanTable = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
            $stmt = $pdo->query("SELECT * FROM `{$cleanTable}`");
            $exportData['tables'][$cleanTable] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode([
            'success' => true,
            'data' => $exportData
        ], JSON_PRETTY_PRINT);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// ── 5. IMPORT: Restore database from JSON payload ─────────────────────────────
if ($action === 'import') {
    $tablesPayload = $input['data']['tables'] ?? $input['tables'] ?? [];
    if (empty($tablesPayload)) {
        echo json_encode(['success' => false, 'error' => 'No valid table data found in import payload']);
        exit;
    }

    $imported = [];
    $pdo->beginTransaction();
    try {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        foreach ($tablesPayload as $table => $rows) {
            $cleanTable = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
            // Clear existing rows for this imported table
            $pdo->exec("DELETE FROM `{$cleanTable}`");

            if (!empty($rows)) {
                $columns = array_keys($rows[0]);
                $colNames = implode('`, `', $columns);
                $placeholders = implode(', ', array_fill(0, count($columns), '?'));
                $stmt = $pdo->prepare("INSERT INTO `{$cleanTable}` (`{$colNames}`) VALUES ({$placeholders})");

                foreach ($rows as $row) {
                    $stmt->execute(array_values($row));
                }
            }
            $imported[$cleanTable] = count($rows);
        }
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
        $pdo->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Imported database data successfully',
            'imported' => $imported
        ]);
    } catch (Exception $e) {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Fallback unknown action
echo json_encode(['success' => false, 'error' => 'Invalid action: ' . htmlspecialchars($action)]);
