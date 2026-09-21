<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Site Settings API
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

$storageDir = dirname(__DIR__) . '/data';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}
$settingsFile = $storageDir . '/settings.json';

// GET: Read settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT `setting_value` FROM `site_settings` WHERE `setting_key` = :key LIMIT 1");
            $stmt->execute([':key' => 'site_config']);
            $row = $stmt->fetch();
            if ($row && !empty($row['setting_value'])) {
                echo $row['setting_value'];
                exit();
            }
        } catch (Exception $e) {
            error_log("Database error in settings.php: " . $e->getMessage());
        }
    }

    if (file_exists($settingsFile)) {
        echo file_get_contents($settingsFile);
    } else {
        echo json_encode([
            'siteName' => 'Monarch Pass Apartments',
            'tagline' => 'Spacious 1-4 Bedroom Apartments in Fort Worth',
            'phone' => '+1 817-857-8782'
        ]);
    }
    exit();
}

// POST: Update settings
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    if (!$data) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
        exit();
    }

    $jsonPayload = json_encode($data, JSON_PRETTY_PRINT);
    $storedInMysql = false;

    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `site_settings` (`setting_key`, `setting_value`)
                VALUES (:key, :val)
                ON DUPLICATE KEY UPDATE `setting_value` = :val_update
            ");
            $stmt->execute([
                ':key' => 'site_config',
                ':val' => $jsonPayload,
                ':val_update' => $jsonPayload
            ]);
            $storedInMysql = true;
        } catch (PDOException $e) {
            error_log("Database write error in settings.php: " . $e->getMessage());
        }
    }

    @file_put_contents($settingsFile, $jsonPayload);

    echo json_encode([
        'success' => true,
        'storage' => [
            'mysql' => $storedInMysql,
            'database' => $storedInMysql ? DB_NAME : null,
            'json_backup' => true
        ],
        'settings' => $data
    ]);
    exit();
}
