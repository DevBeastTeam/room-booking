<?php
/**
 * Monarch Pass Apartments - Rental Applications API
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

// GET: List all rental applications
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM `applications` ORDER BY `id` DESC");
        $apps = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $apps]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

// POST: Submit new application
if ($method === 'POST') {
    try {
        $appId = $input['app_id'] ?? ('APP-' . rand(100, 999));
        $stmt = $pdo->prepare("
            INSERT INTO `applications` (
                `app_id`, `applicant_name`, `floor_plan_slug`, `unit_number`, `income`, `credit_score`, `status`, `date_submitted`
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $appId,
            $input['applicant_name'] ?? $input['name'] ?? 'Applicant',
            $input['floor_plan_slug'] ?? $input['plan'] ?? 'two-bedroom',
            $input['unit_number'] ?? $input['unit'] ?? null,
            $input['income'] ?? '$4,000/mo',
            (int)($input['credit_score'] ?? $input['credit'] ?? 700),
            $input['status'] ?? 'pending',
            $input['date_submitted'] ?? date('M d, Y')
        ]);
        echo json_encode(['success' => true, 'app_id' => $appId]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// PUT: Update application status (approve/reject/pending)
if ($method === 'PUT') {
    try {
        $appId = $input['app_id'] ?? $input['id'] ?? $_GET['app_id'] ?? '';
        $newStatus = $input['status'] ?? 'pending';
        if (!$appId) {
            echo json_encode(['success' => false, 'error' => 'Application ID required']);
            exit;
        }
        $stmt = $pdo->prepare("UPDATE `applications` SET `status` = ? WHERE `app_id` = ? OR `id` = ?");
        $stmt->execute([$newStatus, $appId, $appId]);
        echo json_encode(['success' => true, 'message' => "Application status updated to {$newStatus}"]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// DELETE: Delete application
if ($method === 'DELETE') {
    try {
        $appId = $input['app_id'] ?? $input['id'] ?? $_GET['app_id'] ?? '';
        if (!$appId) {
            echo json_encode(['success' => false, 'error' => 'Application ID required']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM `applications` WHERE `app_id` = ? OR `id` = ?");
        $stmt->execute([$appId, $appId]);
        echo json_encode(['success' => true, 'message' => 'Application deleted']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
