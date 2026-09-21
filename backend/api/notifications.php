<?php
/**
 * Monarch Pass Apartments - Resident Notifications API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once dirname(__DIR__) . '/config/database.php';
$pdo = getDatabaseConnection();
if (!$pdo) { echo json_encode(['success' => false, 'error' => 'Database connection failed']); exit; }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $unit = $_GET['unit'] ?? '2104';
    try {
        $stmt = $pdo->prepare("SELECT * FROM `notifications` WHERE `user_unit` = ? ORDER BY `id` DESC");
        $stmt->execute([$unit]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($method === 'POST') {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO `notifications` (`user_unit`, `type`, `message`, `time_text`, `is_read`)
            VALUES (?, ?, ?, ?, 0)
        ");
        $stmt->execute([
            $input['user_unit'] ?? '2104',
            $input['type'] ?? 'info',
            $input['message'] ?? '',
            $input['time_text'] ?? 'Just now',
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// PUT: Mark as read
if ($method === 'PUT') {
    try {
        $id = (int)($input['id'] ?? 0);
        if ($id) {
            $stmt = $pdo->prepare("UPDATE `notifications` SET `is_read` = 1 WHERE `id` = ?");
            $stmt->execute([$id]);
        } else {
            // Mark all as read for unit
            $unit = $input['user_unit'] ?? '2104';
            $stmt = $pdo->prepare("UPDATE `notifications` SET `is_read` = 1 WHERE `user_unit` = ?");
            $stmt->execute([$unit]);
        }
        echo json_encode(['success' => true, 'message' => 'Notification(s) marked as read']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    try {
        $id = (int)($input['id'] ?? 0);
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM `notifications` WHERE `id` = ?");
            $stmt->execute([$id]);
        } else {
            $unit = $input['user_unit'] ?? '2104';
            $stmt = $pdo->prepare("DELETE FROM `notifications` WHERE `user_unit` = ?");
            $stmt->execute([$unit]);
        }
        echo json_encode(['success' => true, 'message' => 'Notification(s) deleted']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
