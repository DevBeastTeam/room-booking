<?php
/**
 * Monarch Pass Apartments - Residents API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once dirname(__DIR__) . '/config/database.php';
$pdo = getDatabaseConnection();

if (!$pdo) {
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: List all residents
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `residents` ORDER BY `id` ASC");
        $residents = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $residents]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

// POST: Add new resident
if ($method === 'POST') {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO `residents` (
                `name`, `email`, `phone`, `unit_number`, `floor_plan_name`, `move_in_date`, `lease_end_date`, `rent`, `deposit`, `status`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['name'] ?? 'New Resident',
            $input['email'] ?? null,
            $input['phone'] ?? null,
            $input['unit_number'] ?? '0000',
            $input['floor_plan_name'] ?? 'Two Bedroom',
            $input['move_in_date'] ?? date('Y-m-d'),
            $input['lease_end_date'] ?? date('Y-m-d', strtotime('+1 year')),
            (int)($input['rent'] ?? 909),
            (int)($input['deposit'] ?? 250),
            $input['status'] ?? 'current'
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// PUT: Update resident
if ($method === 'PUT') {
    try {
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'Resident ID required']);
            exit;
        }
        $stmt = $pdo->prepare("
            UPDATE `residents` SET
                `name` = COALESCE(?, `name`),
                `email` = COALESCE(?, `email`),
                `phone` = COALESCE(?, `phone`),
                `unit_number` = COALESCE(?, `unit_number`),
                `floor_plan_name` = COALESCE(?, `floor_plan_name`),
                `lease_end_date` = COALESCE(?, `lease_end_date`),
                `rent` = COALESCE(?, `rent`),
                `status` = COALESCE(?, `status`)
            WHERE `id` = ?
        ");
        $stmt->execute([
            $input['name'] ?? null,
            $input['email'] ?? null,
            $input['phone'] ?? null,
            $input['unit_number'] ?? null,
            $input['floor_plan_name'] ?? null,
            $input['lease_end_date'] ?? null,
            isset($input['rent']) ? (int)$input['rent'] : null,
            $input['status'] ?? null,
            $id
        ]);
        echo json_encode(['success' => true, 'message' => 'Resident updated']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// DELETE: Delete resident
if ($method === 'DELETE') {
    try {
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'Resident ID required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM `residents` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Resident deleted']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
