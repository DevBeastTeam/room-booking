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

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Unit-specific listing hi — bina unit poora document dump nahi hota
    $unit = $_GET['unit'] ?? null;
    if ($unit === null || trim($unit) === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'unit parameter is required.']);
        exit;
    }
    $pdo = getDatabaseConnection();
    if (!$pdo) { http_response_code(500); echo json_encode(['success' => false, 'error' => 'Database connection failed']); exit; }
    try {
        $stmt = $pdo->prepare("SELECT * FROM `documents` WHERE `unit_number` = ? ORDER BY `id` ASC");
        $stmt->execute([trim($unit)]);
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$pdo = getDatabaseConnection();
if (!$pdo) { http_response_code(500); echo json_encode(['success' => false, 'error' => 'Database connection failed']); exit; }

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
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($method === 'DELETE') {
    try {
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if (!$id) { http_response_code(400); echo json_encode(['success' => false, 'error' => 'Document ID required']); exit; }
        $stmt = $pdo->prepare("DELETE FROM `documents` WHERE `id` = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Document not found.']);
            exit;
        }
        echo json_encode(['success' => true, 'message' => 'Document deleted']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
