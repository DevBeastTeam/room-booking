<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Theme Config API
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/config/database.php';

$pdo = getDatabaseConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT `theme_data` FROM `theme_config` WHERE `theme_key` = :key LIMIT 1");
            $stmt->execute([':key' => 'active_theme']);
            $row = $stmt->fetch();
            if ($row && !empty($row['theme_data'])) {
                echo $row['theme_data'];
                exit();
            }
        } catch (Exception $e) {
            error_log("Theme DB read error: " . $e->getMessage());
        }
    }

    echo json_encode(['success' => false, 'message' => 'Default theme active']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        exit();
    }

    $payload = json_encode($data, JSON_PRETTY_PRINT);
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `theme_config` (`theme_key`, `theme_data`)
                VALUES ('active_theme', :data)
                ON DUPLICATE KEY UPDATE `theme_data` = :data_update
            ");
            $stmt->execute([':data' => $payload, ':data_update' => $payload]);
            echo json_encode(['success' => true, 'theme' => $data]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'message' => 'Theme updated locally']);
    exit();
}
