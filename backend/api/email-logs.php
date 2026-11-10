<?php
/**
 * Monar Pass Apartments - Email Logs API
 */

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/store.php';
require_once __DIR__ . '/_auth.php';

auth_send_cors_headers();

// Email Logs tab permission
auth_require_permission('emaillogs');
auth_require_csrf_if_mutating();
$pdo = getDatabaseConnection();
$STORE = 'email_logs';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `email_logs` ORDER BY `id` DESC LIMIT 100");
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        mp_store_write($STORE, $logs);
        echo json_encode(['success' => true, 'data' => $logs]);
    } catch (Exception $e) {
        http_response_code(500);
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
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    try {
        $pdo->exec("TRUNCATE TABLE `email_logs`");
        echo json_encode(['success' => true, 'message' => 'Email logs cleared']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
