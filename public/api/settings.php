<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Site Settings Handler
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

$storageDir = __DIR__ . '/data';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}
$settingsFile = $storageDir . '/settings.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($settingsFile)) {
        echo file_get_contents($settingsFile);
    } else {
        echo json_encode(['siteName' => 'Monarch Pass Apartments']);
    }
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    if ($data) {
        @file_put_contents($settingsFile, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true, 'settings' => $data]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    }
    exit();
}
