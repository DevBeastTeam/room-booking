<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Floor Plans & Units Inventory API
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/config/database.php';

$pdo = getDatabaseConnection();

// GET: Return floor plans and units
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($pdo) {
        try {
            $fpStmt = $pdo->query("SELECT * FROM `floor_plans` WHERE `is_active` = 1 ORDER BY `beds` ASC");
            $plans = $fpStmt->fetchAll();

            $unitStmt = $pdo->query("SELECT * FROM `units` ORDER BY `unit_number` ASC");
            $units = $unitStmt->fetchAll();

            echo json_encode([
                'success' => true,
                'source' => 'mysql',
                'floor_plans' => $plans,
                'units' => $units
            ]);
            exit();
        } catch (Exception $e) {
            error_log("DB error in floor-plans.php: " . $e->getMessage());
        }
    }

    // Default static fallback if DB offline
    $defaultPlans = [
        ['id' => 'one-bedroom',   'name' => 'One Bedroom',   'beds' => 1, 'baths' => 1, 'sqft' => 614,  'total' => 40, 'occupied' => 27, 'price12' => 898,  'price10' => 950,  'price6' => 1020, 'deposit' => 250],
        ['id' => 'two-bedroom',   'name' => 'Two Bedroom',   'beds' => 2, 'baths' => 1, 'sqft' => 769,  'total' => 55, 'occupied' => 35, 'price12' => 909,  'price10' => 960,  'price6' => 1050, 'deposit' => 250],
        ['id' => 'three-bedroom', 'name' => 'Three Bedroom', 'beds' => 3, 'baths' => 2, 'sqft' => 920,  'total' => 30, 'occupied' => 10, 'price12' => 1023, 'price10' => 1090, 'price6' => 1180, 'deposit' => 250],
        ['id' => 'four-bedroom',  'name' => 'Four Bedroom',  'beds' => 4, 'baths' => 2, 'sqft' => 1077, 'total' => 25, 'occupied' => 8,  'price12' => 1209, 'price10' => 1290, 'price6' => 1390, 'deposit' => 250],
    ];
    echo json_encode([
        'success' => true,
        'source' => 'fallback',
        'floor_plans' => $defaultPlans,
        'units' => []
    ]);
    exit();
}

// POST or PUT: Update unit status or floor plan pricing
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $action = $data['action'] ?? 'update_unit';

    if ($pdo && $action === 'update_unit' && !empty($data['unit_number'])) {
        try {
            $stmt = $pdo->prepare("UPDATE `units` SET `status` = :status, `tenant_name` = :tenant WHERE `unit_number` = :unit");
            $stmt->execute([
                ':status' => $data['status'] ?? 'available',
                ':tenant' => $data['tenant_name'] ?? null,
                ':unit' => $data['unit_number']
            ]);
            echo json_encode(['success' => true, 'message' => 'Unit status updated']);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'message' => 'Action handled']);
    exit();
}
