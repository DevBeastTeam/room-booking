<?php
/**
 * Monarch Pass Apartments - Email Logs API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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
        $stmt = $pdo->query("SELECT * FROM `email_logs` ORDER BY `id` DESC LIMIT 100");
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $logs]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($method === 'POST') {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO `email_logs` (`recipient`, `subject`, `template`, `status`, `content_summary`, `sent_at`)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['recipient'] ?? 'unknown@example.com',
            $input['subject'] ?? 'Notification',
            $input['template'] ?? 'general',
            $input['status'] ?? 'sent',
            $input['content_summary'] ?? '',
            date('Y-m-d H:i:s')
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    try {
        $pdo->exec("TRUNCATE TABLE `email_logs`");
        echo json_encode(['success' => true, 'message' => 'Email logs cleared']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
