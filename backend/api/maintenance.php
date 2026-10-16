<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Maintenance Work Orders API
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/config/database.php';
require_once __DIR__ . '/_auth.php';

// Resident dashboard se naya ticket submit karna (bina admin login) public hai,
// lekin tickets list (GET) aur status update (admin action) permission maangta hai.
// Body ek hi jagah parse hoti hai taake form-encoded POST auth check bypass na kare.
$__raw = file_get_contents('php://input');
$__parsed = json_decode($__raw, true) ?: [];
$__action = $__parsed['action'] ?? ($_POST['action'] ?? ($_GET['action'] ?? ''));
$__isAdminAction = ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($_GET['unit']))
    || ($__action === 'update_status');
if ($__isAdminAction) {
    auth_require_permission('maintenance');
}

$storageDir = dirname(__DIR__) . '/data';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}
$dataFile = $storageDir . '/maintenance.json';

// GET: Return all tickets or unit-specific tickets
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $unit = $_GET['unit'] ?? null;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            if ($unit) {
                $stmt = $pdo->prepare("SELECT * FROM `maintenance_tickets` WHERE `unit_number` = :unit ORDER BY `created_at` DESC");
                $stmt->execute([':unit' => $unit]);
            } else {
                $stmt = $pdo->query("SELECT * FROM `maintenance_tickets` ORDER BY `created_at` DESC");
            }
            $tickets = $stmt->fetchAll();
            echo json_encode([
                'success' => true,
                'source' => 'mysql',
                'count' => count($tickets),
                'tickets' => $tickets
            ]);
            exit();
        } catch (Exception $e) {
            error_log("DB error in maintenance.php: " . $e->getMessage());
        }
    }

    $existing = [];
    if (file_exists($dataFile)) {
        $existing = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    echo json_encode([
        'success' => true,
        'source' => 'json_file',
        'count' => count($existing),
        'tickets' => $existing
    ]);
    exit();
}

// POST: Create ticket or update status
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $rawInput = $__raw;
    $data = $__parsed ?: $_POST;

    // Check if status update (auth already enforced above — sirf admin pohanch sakta hai)
    if (($data['action'] ?? '') === 'update_status') {
        $ticketId = $data['ticket_id'] ?? '';
        $newStatus = $data['status'] ?? 'completed';

        if (empty($ticketId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Ticket ID is required.']);
            exit();
        }

        $pdo = getDatabaseConnection();
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("UPDATE `maintenance_tickets` SET `status` = :status WHERE `ticket_id` = :id");
                $stmt->execute([':status' => $newStatus, ':id' => $ticketId]);
                echo json_encode(['success' => true, 'message' => 'Status updated']);
                exit();
            } catch (Exception $e) {
                error_log("DB error in maintenance.php: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                exit();
            }
        }

        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection unavailable.']);
        exit();
    }

    // Otherwise create ticket
    // ticket_id UNIQUE index par takra sakta hai — retry loop
    $ticketId = null;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $checkStmt = $pdo->prepare("SELECT `id` FROM `maintenance_tickets` WHERE `ticket_id` = ?");
            for ($attempt = 0; $attempt < 10; $attempt++) {
                $candidate = 'MR-' . rand(100, 999);
                $checkStmt->execute([$candidate]);
                if (!$checkStmt->fetch()) {
                    $ticketId = $candidate;
                    break;
                }
            }
        } catch (PDOException $e) {
            error_log('Maintenance ticket id check error: ' . $e->getMessage());
        }
    }
    if ($ticketId === null) {
        $ticketId = 'MR-' . rand(100, 999) . '-' . substr(uniqid(), -4);
    }
    $unit = $data['unit'] ?? $data['unit_number'] ?? '2104';
    $tenant = $data['tenant'] ?? $data['tenant_name'] ?? 'Resident';
    $title = $data['title'] ?? 'Maintenance Request';
    $category = $data['category'] ?? 'General';
    $priority = $data['priority'] ?? 'Medium';
    $date = date('M d, Y');

    $record = [
        'id' => $ticketId,
        'ticket_id' => $ticketId,
        'unit_number' => $unit,
        'tenant_name' => $tenant,
        'title' => $title,
        'category' => $category,
        'priority' => $priority,
        'status' => 'pending',
        'notes' => $data['notes'] ?? $data['description'] ?? null,
        'date_submitted' => $date,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $storedInMysql = false;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `maintenance_tickets` (
                    `ticket_id`, `unit_number`, `tenant_name`, `title`, `category`, `priority`, `status`, `notes`, `date_submitted`
                ) VALUES (
                    :tid, :unit, :tenant, :title, :cat, :prio, 'pending', :notes, :dsub
                )
            ");
            $stmt->execute([
                ':tid' => $ticketId,
                ':unit' => $unit,
                ':tenant' => $tenant,
                ':title' => $title,
                ':cat' => $category,
                ':prio' => $priority,
                ':notes' => $record['notes'],
                ':dsub' => $date
            ]);
            $storedInMysql = true;
        } catch (PDOException $e) {
            error_log("Maintenance insert error: " . $e->getMessage());
        }
    }

    // JSON fallback
    $existing = [];
    if (file_exists($dataFile)) {
        $existing = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    array_unshift($existing, $record);
    @file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT));

    echo json_encode([
        'success' => true,
        'message' => 'Maintenance ticket created successfully.',
        'ticket' => $record,
        'storage' => ['mysql' => $storedInMysql, 'database' => DB_NAME]
    ]);
    exit();
}
