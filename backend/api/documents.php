<?php
/**
 * Monarch Pass Apartments - Resident Documents API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once dirname(__DIR__) . '/config/database.php';
$pdo = getDatabaseConnection();
if (!$pdo) { echo json_encode(['success' => false, 'error' => 'Database connection failed']); exit; }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $unit = $_GET['unit'] ?? null;
    try {
        if ($unit) {
            $stmt = $pdo->prepare("SELECT * FROM `documents` WHERE `unit_number` = ? ORDER BY `id` ASC");
            $stmt->execute([$unit]);
        } else {
            $stmt = $pdo->query("SELECT * FROM `documents` ORDER BY `id` ASC");
        }
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
            INSERT INTO `documents` (`name`, `category`, `file_size`, `doc_date`, `file_url`, `unit_number`)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['name'] ?? 'Document.pdf',
            $input['category'] ?? 'Lease',
            $input['file_size'] ?? '1.0 MB',
            $input['doc_date'] ?? date('M d, Y'),
            $input['file_url'] ?? '#',
            $input['unit_number'] ?? '2104',
        ]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    try {
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if (!$id) { echo json_encode(['success' => false, 'error' => 'Document ID required']); exit; }
        $stmt = $pdo->prepare("DELETE FROM `documents` WHERE `id` = ?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true, 'message' => 'Document deleted']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
