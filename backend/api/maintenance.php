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
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    // Check if status update
    if (isset($data['action']) && $data['action'] === 'update_status') {
        $ticketId = $data['ticket_id'] ?? '';
        $newStatus = $data['status'] ?? 'completed';

        $pdo = getDatabaseConnection();
        if ($pdo && !empty($ticketId)) {
            try {
                $stmt = $pdo->prepare("UPDATE `maintenance_tickets` SET `status` = :status WHERE `ticket_id` = :id");
                $stmt->execute([':status' => $newStatus, ':id' => $ticketId]);
                echo json_encode(['success' => true, 'message' => 'Status updated']);
                exit();
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => $e->getMessage()]);
                exit();
            }
        }
    }

    // Otherwise create ticket
    $ticketId = 'MR-' . rand(100, 999);
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
        'date_submitted' => $date,
        'created_at' => date('Y-m-d H:i:s')
    ];

    $storedInMysql = false;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `maintenance_tickets` (
                    `ticket_id`, `unit_number`, `tenant_name`, `title`, `category`, `priority`, `status`, `date_submitted`
                ) VALUES (
                    :tid, :unit, :tenant, :title, :cat, :prio, 'pending', :dsub
                )
            ");
            $stmt->execute([
                ':tid' => $ticketId,
                ':unit' => $unit,
                ':tenant' => $tenant,
                ':title' => $title,
                ':cat' => $category,
                ':prio' => $priority,
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
