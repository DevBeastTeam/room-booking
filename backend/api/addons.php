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
require_once __DIR__ . '/_auth.php';

// Public add-ons catalog read ho sakti hai, lekin edits 'addons' permission chahti hain
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    auth_require_permission('addons');
}
$pdo = getDatabaseConnection();

if (!$pdo) {
    http_response_code(500);
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
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($method === 'PUT' || $method === 'POST') {
    try {
        // Frontend numeric `id` bhejta hai, admin panel `addon_key` — dono chalti hain
        $addonKey = $input['addon_key'] ?? null;
        $addonId = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : null;
        if ($addonKey === null && $addonId === null) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Add-on key or numeric id required']);
            exit;
        }

        $check = $pdo->prepare("SELECT `id` FROM `addons` WHERE `addon_key` = ? OR `id` = ? LIMIT 1");
        $check->execute([$addonKey, $addonId]);
        if (!$check->fetch(PDO::FETCH_ASSOC)) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Add-on not found.']);
            exit;
        }

        // Numeric hi hone wale fields cast karo — warna ghalat value 0 overwrite kar deti hai
        $price = isset($input['price']) && is_numeric($input['price']) ? (int)$input['price'] : null;
        $activeCount = isset($input['active_count']) && is_numeric($input['active_count']) ? (int)$input['active_count'] : null;
        $isActive = isset($input['is_active']) ? (int)$input['is_active'] : null;

        $stmt = $pdo->prepare("
            UPDATE `addons` SET
                `name` = COALESCE(?, `name`),
                `price` = COALESCE(?, `price`),
                `active_count` = COALESCE(?, `active_count`),
                `description` = COALESCE(?, `description`),
                `is_active` = COALESCE(?, `is_active`)
            WHERE `addon_key` = ? OR `id` = ?
        ");
        $stmt->execute([
            $input['name'] ?? null,
            $price,
            $activeCount,
            $input['description'] ?? null,
            $isActive,
            $addonKey,
            $addonId
        ]);
        echo json_encode(['success' => true, 'message' => 'Add-on updated successfully']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
