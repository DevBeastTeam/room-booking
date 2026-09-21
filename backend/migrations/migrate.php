<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Automated Migration & Seeder Runner
 * ==============================================================================
 * Run from terminal: php backend/migrations/migrate.php
 * Or via web: http://localhost/backend/migrations/migrate.php (with setup key)
 */

if (php_sapi_name() !== 'cli') {
    header('Content-Type: application/json; charset=UTF-8');
    // Allow query parameter or default dev access
}

require_once dirname(__DIR__) . '/config/database.php';

$results = [
    'timestamp' => date('Y-m-d H:i:s'),
    'database' => DB_NAME,
    'host' => DB_HOST,
    'steps' => [],
    'success' => false
];

try {
    // 1. Try to connect to MySQL server root to ensure database exists
    $dsnNoDb = sprintf('mysql:host=%s;port=%s;charset=%s', DB_HOST, DB_PORT, DB_CHARSET);
    try {
        $rootPdo = new PDO($dsnNoDb, DB_USER, DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $rootPdo->exec(sprintf(
            "CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
            DB_NAME
        ));
        $results['steps'][] = "Database `" . DB_NAME . "` verified / created.";
    } catch (PDOException $e) {
        $results['steps'][] = "Notice on CREATE DATABASE: " . $e->getMessage();
    }

    // 2. Connect to the specific database
    $pdo = getDatabaseConnection();
    if (!$pdo) {
        throw new Exception("Could not connect to database `" . DB_NAME . "` with user `" . DB_USER . "` on " . DB_HOST);
    }
    $results['steps'][] = "Connected to database `" . DB_NAME . "` successfully.";

    // 3. Run Schema SQL
    $schemaFile = __DIR__ . '/001_initial_schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found: " . $schemaFile);
    }
    $sql = file_get_contents($schemaFile);
    $pdo->exec($sql);
    $results['steps'][] = "All 8 database tables verified / created (001_initial_schema.sql).";

    // 4. Migrate Existing JSON Inquiries
    $inquiriesJson = dirname(__DIR__) . '/data/inquiries.json';
    if (!file_exists($inquiriesJson)) {
        $inquiriesJson = dirname(dirname(__DIR__)) . '/public/api/data/inquiries.json';
    }
    if (file_exists($inquiriesJson)) {
        $inquiries = json_decode(file_get_contents($inquiriesJson), true) ?: [];
        $migratedCount = 0;
        $stmt = $pdo->prepare("
            INSERT IGNORE INTO `inquiries` (
                `tracking_id`, `name`, `email`, `phone`, 
                `preferred_bedroom`, `move_in_date`, `category`, `message`, `status`, `created_at`
            ) VALUES (
                :tracking_id, :name, :email, :phone, 
                :preferred_bedroom, :move_in_date, :category, :message, :status, :created_at
            )
        ");
        foreach ($inquiries as $inq) {
            $tid = $inq['tracking_id'] ?? $inq['id'] ?? ('INQ-' . strtoupper(substr(uniqid(), -6)));
            $stmt->execute([
                ':tracking_id' => $tid,
                ':name' => $inq['name'] ?? 'Guest Prospect',
                ':email' => $inq['email'] ?? 'unknown@example.com',
                ':phone' => $inq['phone'] ?? null,
                ':preferred_bedroom' => $inq['preferredBedroom'] ?? $inq['bedrooms'] ?? 'Any',
                ':move_in_date' => $inq['moveInDate'] ?? null,
                ':category' => $inq['category'] ?? $inq['subject'] ?? 'General Inquiry',
                ':message' => $inq['message'] ?? null,
                ':status' => $inq['status'] ?? 'new',
                ':created_at' => $inq['created_at'] ?? date('Y-m-d H:i:s')
            ]);
            if ($stmt->rowCount() > 0) {
                $migratedCount++;
            }
        }
        $results['steps'][] = "Migrated {$migratedCount} inquiries from inquiries.json.";
    }

    // 5. Migrate Existing JSON Tours
    $toursJson = dirname(__DIR__) . '/data/tours.json';
    if (!file_exists($toursJson)) {
        $toursJson = dirname(dirname(__DIR__)) . '/public/api/data/tours.json';
    }
    if (file_exists($toursJson)) {
        $tours = json_decode(file_get_contents($toursJson), true) ?: [];
        $migratedToursCount = 0;
        $stmtTour = $pdo->prepare("
            INSERT IGNORE INTO `tours` (
                `tracking_id`, `name`, `email`, `phone`,
                `preferred_bedroom`, `preferred_unit`, `tour_date`,
                `tour_time`, `tour_type`, `comments`, `status`, `created_at`
            ) VALUES (
                :tracking_id, :name, :email, :phone,
                :preferred_bedroom, :preferred_unit, :tour_date,
                :tour_time, :tour_type, :comments, :status, :created_at
            )
        ");
        foreach ($tours as $t) {
            $tid = $t['tracking_id'] ?? $t['id'] ?? ('TOUR-' . strtoupper(substr(uniqid(), -6)));
            $date = $t['date'] ?? date('Y-m-d');
            $tType = 'in-person';
            if (isset($t['tourType']) && stripos($t['tourType'], 'virtual') !== false) {
                $tType = 'virtual-video';
            } elseif (isset($t['tourType']) && stripos($t['tourType'], 'self') !== false) {
                $tType = 'self-guided';
            }
            $stmtTour->execute([
                ':tracking_id' => $tid,
                ':name' => $t['name'] ?? 'Prospect',
                ':email' => $t['email'] ?? 'unknown@example.com',
                ':phone' => $t['phone'] ?? '',
                ':preferred_bedroom' => $t['bedroom'] ?? 'Any',
                ':preferred_unit' => $t['unit'] ?? null,
                ':tour_date' => $date,
                ':tour_time' => $t['time'] ?? '10:00 AM',
                ':tour_type' => $tType,
                ':comments' => $t['notes'] ?? null,
                ':status' => $t['status'] ?? 'scheduled',
                ':created_at' => $t['created_at'] ?? date('Y-m-d H:i:s')
            ]);
            if ($stmtTour->rowCount() > 0) {
                $migratedToursCount++;
            }
        }
        $results['steps'][] = "Migrated {$migratedToursCount} tours from tours.json.";
    }

    // 6. Seed Default Floor Plans
    $fpCount = $pdo->query("SELECT COUNT(*) FROM `floor_plans`")->fetchColumn();
    if ($fpCount == 0) {
        $plans = [
            ['one-bedroom',   'One Bedroom',   1, 1.0, 614,  40, 27, 898,  950,  1020, 250, 'Efficient open-concept 1-bedroom home with modern kitchen and private patio.'],
            ['two-bedroom',   'Two Bedroom',   2, 1.0, 769,  55, 35, 909,  960,  1050, 250, 'Spacious dual-bedroom layout with oversized living room and ample storage.'],
            ['three-bedroom', 'Three Bedroom', 3, 2.0, 920,  30, 10, 1023, 1090, 1180, 250, 'Expansive 3-bedroom, 2-bathroom layout designed for families.'],
            ['four-bedroom',  'Four Bedroom',  4, 2.0, 1077, 25, 8,  1209, 1290, 1390, 250, 'Generous 4-bedroom floor plan offering maximum comfort and privacy.'],
        ];
        $fpStmt = $pdo->prepare("
            INSERT INTO `floor_plans` (
                `slug`, `name`, `beds`, `baths`, `sqft`, `total_units`, `occupied_units`, 
                `price_12m`, `price_10m`, `price_6m`, `deposit`, `description`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($plans as $p) {
            $fpStmt->execute($p);
        }
        $results['steps'][] = "Seeded 4 default floor plans (One, Two, Three, Four Bedroom).";
    }

    // 7. Seed Units Inventory
    $unitCount = $pdo->query("SELECT COUNT(*) FROM `units`")->fetchColumn();
    if ($unitCount == 0) {
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
        $uStmt = $pdo->prepare("
            INSERT INTO `units` (
                `unit_number`, `floor_plan_slug`, `beds`, `floor`, `sqft`, `rent`, `status`, `tenant_name`, `move_in_date`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($units as $u) {
            $uStmt->execute($u);
        }
        $results['steps'][] = "Seeded 11 unit records into `units` table.";
    }

    // 8. Seed Maintenance Tickets
    $maintCount = $pdo->query("SELECT COUNT(*) FROM `maintenance_tickets`")->fetchColumn();
    if ($maintCount == 0) {
        $tickets = [
            ['MR-001', '2104', 'Sarah Johnson',   'AC not cooling properly',    'HVAC',       'High',   'in-progress', 'Sep 15'],
            ['MR-002', '2104', 'Sarah Johnson',   'Kitchen faucet dripping',    'Plumbing',   'Medium', 'completed',   'Aug 28'],
            ['MR-003', '2104', 'Sarah Johnson',   'Bathroom light flickering',  'Electrical', 'Low',    'pending',     'Sep 18'],
            ['MR-004', '2108', 'Marcus Williams', 'Dishwasher not draining',    'Appliance',  'Medium', 'pending',     'Sep 17'],
            ['MR-005', '3508', 'Priya Sharma',    'Parking lot light out',      'Exterior',   'Low',    'completed',   'Sep 10'],
            ['MR-006', '2115', 'Maintenance',     'Unit turnover — deep clean', 'Turnover',   'High',   'in-progress', 'Sep 19'],
        ];
        $mStmt = $pdo->prepare("
            INSERT INTO `maintenance_tickets` (
                `ticket_id`, `unit_number`, `tenant_name`, `title`, `category`, `priority`, `status`, `date_submitted`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($tickets as $m) {
            $mStmt->execute($m);
        }
        $results['steps'][] = "Seeded 6 sample maintenance tickets.";
    }

    // 9. Seed Applications
    $appCount = $pdo->query("SELECT COUNT(*) FROM `applications`")->fetchColumn();
    if ($appCount == 0) {
        $apps = [
            ['APP-001', 'David Martinez',   'two-bedroom',   '2115', '$4,800/mo', 720, 'pending',  'Sep 15, 2026'],
            ['APP-002', 'Emily Chen',       'one-bedroom',   '3505', '$3,200/mo', 695, 'pending',  'Sep 16, 2026'],
            ['APP-003', 'Robert Thompson',  'three-bedroom', '1002', '$6,100/mo', 760, 'approved', 'Sep 10, 2026'],
            ['APP-004', 'Fatima Al-Hassan', 'one-bedroom',   '3512', '$2,900/mo', 620, 'rejected', 'Sep 8, 2026'],
            ['APP-005', 'Kevin Nguyen',     'four-bedroom',  '4105', '$7,200/mo', 780, 'pending',  'Sep 18, 2026'],
        ];
        $aStmt = $pdo->prepare("
            INSERT INTO `applications` (
                `app_id`, `applicant_name`, `floor_plan_slug`, `unit_number`, `income`, `credit_score`, `status`, `date_submitted`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        foreach ($apps as $a) {
            $aStmt->execute($a);
        }
        $results['steps'][] = "Seeded 5 rental applications.";
    }

    $results['success'] = true;
    $results['message'] = "Migration and seeding completed successfully for `" . DB_NAME . "`!";
} catch (Exception $e) {
    $results['success'] = false;
    $results['error'] = $e->getMessage();
}

if (php_sapi_name() === 'cli') {
    echo "\n=== Monarch Pass Database Migration Runner ===\n";
    echo "Database: " . $results['database'] . " (" . $results['host'] . ")\n";
    echo "Status:   " . ($results['success'] ? "SUCCESS [OK]" : "FAILED") . "\n";
    if (!empty($results['steps'])) {
        echo "Steps:\n";
        foreach ($results['steps'] as $s) {
            echo "  ✓ " . $s . "\n";
        }
    }
    if (!$results['success']) {
        echo "Error: " . ($results['error'] ?? 'Unknown error') . "\n";
    }
    echo "==============================================\n\n";
} else {
    echo json_encode($results, JSON_PRETTY_PRINT);
}
