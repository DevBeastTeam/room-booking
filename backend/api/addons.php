<?php
/**
 * Monarch Pass Apartments - Add-ons & Extra Services API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
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

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `addons` ORDER BY `id` ASC");
        $addons = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $addons]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($method === 'PUT' || $method === 'POST') {
    try {
        $key = $input['addon_key'] ?? $input['id'] ?? '';
        if (!$key) {
            echo json_encode(['success' => false, 'error' => 'Add-on key required']);
            exit;
        }
        $stmt = $pdo->prepare("
            UPDATE `addons` SET
                `name` = COALESCE(?, `name`),
                `price` = COALESCE(?, `price`),
                `active_count` = COALESCE(?, `active_count`),
                `description` = COALESCE(?, `description`),
                `is_active` = COALESCE(?, `is_active`)
            WHERE `addon_key` = ?
        ");
        $stmt->execute([
            $input['name'] ?? null,
            isset($input['price']) ? (int)$input['price'] : null,
            isset($input['active_count']) ? (int)$input['active_count'] : null,
            $input['description'] ?? null,
            isset($input['is_active']) ? (int)$input['is_active'] : null,
            $key
        ]);
        echo json_encode(['success' => true, 'message' => 'Add-on updated successfully']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
