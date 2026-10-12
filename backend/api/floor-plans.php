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
require_once __DIR__ . '/_auth.php';

// Public site GET kar sakti hai, lekin edits 'floorplans' permission chahti hain
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    auth_require_permission('floorplans');
}

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

    // Default static fallback if DB offline — shape matches the MySQL SELECT * columns
    $defaultPlans = [
        ['id' => 1, 'slug' => 'one-bedroom',   'name' => 'One Bedroom',   'beds' => 1, 'baths' => 1.0, 'sqft' => 614,  'total_units' => 40, 'occupied_units' => 27, 'price_12m' => 898,  'price_10m' => 950,  'price_6m' => 1020, 'deposit' => 250, 'description' => 'Efficient open-concept 1-bedroom home with modern kitchen and private patio.', 'image_url' => null, 'is_active' => 1, 'updated_at' => null],
        ['id' => 2, 'slug' => 'two-bedroom',   'name' => 'Two Bedroom',   'beds' => 2, 'baths' => 1.0, 'sqft' => 769,  'total_units' => 55, 'occupied_units' => 35, 'price_12m' => 909,  'price_10m' => 960,  'price_6m' => 1050, 'deposit' => 250, 'description' => 'Spacious dual-bedroom layout with oversized living room and ample storage.', 'image_url' => null, 'is_active' => 1, 'updated_at' => null],
        ['id' => 3, 'slug' => 'three-bedroom', 'name' => 'Three Bedroom', 'beds' => 3, 'baths' => 2.0, 'sqft' => 920,  'total_units' => 30, 'occupied_units' => 10, 'price_12m' => 1023, 'price_10m' => 1090, 'price_6m' => 1180, 'deposit' => 250, 'description' => 'Expansive 3-bedroom, 2-bathroom layout designed for families.', 'image_url' => null, 'is_active' => 1, 'updated_at' => null],
        ['id' => 4, 'slug' => 'four-bedroom',  'name' => 'Four Bedroom',  'beds' => 4, 'baths' => 2.0, 'sqft' => 1077, 'total_units' => 25, 'occupied_units' => 8,  'price_12m' => 1209, 'price_10m' => 1290, 'price_6m' => 1390, 'deposit' => 250, 'description' => 'Generous 4-bedroom floor plan offering maximum comfort and privacy.', 'image_url' => null, 'is_active' => 1, 'updated_at' => null],
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

    if ($action === 'update_plan') {
        $slug = trim((string)($data['slug'] ?? $data['id'] ?? ''));
        if ($slug === '') {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'slug (or id) is required to update a floor plan.']);
            exit();
        }
        if (!$pdo) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database connection unavailable.']);
            exit();
        }
        try {
            $fields = [];
            $params = [':slug' => $slug];
            foreach (['price_12m', 'price_10m', 'price_6m', 'deposit', 'total_units', 'occupied_units', 'description'] as $col) {
                if (array_key_exists($col, $data)) {
                    $fields[] = "`{$col}` = :{$col}";
                    $params[":{$col}"] = $data[$col];
                }
            }
            if (empty($fields)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'No updatable fields provided.']);
                exit();
            }
            $sql = "UPDATE `floor_plans` SET " . implode(', ', $fields) . " WHERE `slug` = :slug";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            if ($stmt->rowCount() === 0) {
                http_response_code(404);
                echo json_encode(['success' => false, 'error' => 'Floor plan not found.']);
                exit();
            }
            echo json_encode(['success' => true, 'message' => 'Floor plan updated']);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit();
        }
    }

    if ($action === 'update_unit') {
        if (empty($data['unit_number'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'unit_number is required to update a unit.']);
            exit();
        }
        if (!$pdo) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Database connection unavailable.']);
            exit();
        }
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
