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
require_once __DIR__ . '/_auth.php';

// Residents tab permission
auth_require_permission('residents');
$pdo = getDatabaseConnection();

if (!$pdo) {
    http_response_code(500);
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
        http_response_code(500);
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
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// PUT: Update resident
if ($method === 'PUT') {
    try {
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Resident ID required']);
            exit;
        }
        $checkStmt = $pdo->prepare("SELECT `id` FROM `residents` WHERE `id` = ?");
        $checkStmt->execute([$id]);
        if (!$checkStmt->fetch()) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Resident not found.']);
            exit;
        }
        // Rent sirf tab update ho jab input mein valid number ho — warna stored rent overwrite ho jati hai
        $rent = isset($input['rent']) && is_numeric($input['rent']) ? (int)$input['rent'] : null;
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
            $rent,
            $input['status'] ?? null,
            $id
        ]);
        echo json_encode(['success' => true, 'message' => 'Resident updated']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// DELETE: Delete resident
if ($method === 'DELETE') {
    try {
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Resident ID required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM `residents` WHERE `id` = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Resident not found.']);
            exit;
        }
        echo json_encode(['success' => true, 'message' => 'Resident deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
