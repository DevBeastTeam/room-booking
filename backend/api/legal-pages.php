<?php
/**
 * Monarch Pass Apartments - Legal Pages CMS API
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once dirname(__DIR__) . '/config/database.php';
$pdo = getDatabaseConnection();
if (!$pdo) { echo json_encode(['success' => false, 'error' => 'Database connection failed']); exit; }

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $slug = $_GET['slug'] ?? null;
    try {
        if ($slug) {
            $stmt = $pdo->prepare("SELECT * FROM `legal_pages` WHERE `slug` = ?");
            $stmt->execute([$slug]);
            $page = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['success' => true, 'data' => $page]);
        } else {
            $stmt = $pdo->query("SELECT * FROM `legal_pages` ORDER BY `id` ASC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];

if ($method === 'POST' || $method === 'PUT') {
    try {
        $slug  = $input['slug'] ?? 'terms';
        $title = $input['title'] ?? 'Legal Page';
        $lastUpdated = $input['lastUpdated'] ?? date('F Y');
        $content = $input['content'] ?? '';

        // Upsert pattern
        $stmt = $pdo->prepare("
            INSERT INTO `legal_pages` (`slug`, `title`, `last_updated`, `content`)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                `title` = VALUES(`title`),
                `last_updated` = VALUES(`last_updated`),
                `content` = VALUES(`content`)
        ");
        $stmt->execute([$slug, $title, $lastUpdated, $content]);
        echo json_encode(['success' => true, 'slug' => $slug]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}
