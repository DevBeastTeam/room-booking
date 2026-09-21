<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Inquiries & Contact API
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
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
$dataFile = $storageDir . '/inquiries.json';

// GET: Return all inquiries
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `inquiries` ORDER BY `created_at` DESC LIMIT 100");
            $rows = $stmt->fetchAll();
            echo json_encode([
                'success' => true,
                'source' => 'mysql',
                'count' => count($rows),
                'inquiries' => $rows
            ]);
            exit();
        } catch (Exception $e) {
            error_log("DB read error in contact.php: " . $e->getMessage());
        }
    }

    $existing = [];
    if (file_exists($dataFile)) {
        $existing = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    echo json_encode([
        'success' => true,
        'source' => 'json_file',
        'count' => count($existing),
        'inquiries' => $existing
    ]);
    exit();
}

// POST: Add new inquiry
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
    $email = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
    $phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
    $bedroom = isset($data['preferredBedroom']) ? trim(strip_tags($data['preferredBedroom'])) : (isset($data['bedrooms']) ? trim(strip_tags($data['bedrooms'])) : 'Any');
    $moveInDate = isset($data['moveInDate']) ? trim(strip_tags($data['moveInDate'])) : '';
    $message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';
    $category = isset($data['category']) ? trim(strip_tags($data['category'])) : (isset($data['subject']) ? trim(strip_tags($data['subject'])) : 'General Inquiry');

    if (empty($name) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name and Email are required.']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
        exit();
    }

    $inquiryId = 'INQ-' . strtoupper(substr(uniqid(), -6));
    $timestamp = date('Y-m-d H:i:s');

    $record = [
        'id' => $inquiryId,
        'tracking_id' => $inquiryId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'preferred_bedroom' => $bedroom,
        'move_in_date' => $moveInDate,
        'message' => $message,
        'category' => $category,
        'created_at' => $timestamp,
        'status' => 'new'
    ];

    $storedInMysql = false;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `inquiries` (
                    `tracking_id`, `name`, `email`, `phone`, 
                    `preferred_bedroom`, `move_in_date`, `category`, `message`, `status`
                ) VALUES (
                    :tracking_id, :name, :email, :phone, 
                    :preferred_bedroom, :move_in_date, :category, :message, 'new'
                )
            ");
            $stmt->execute([
                ':tracking_id' => $inquiryId,
                ':name' => $name,
                ':email' => $email,
                ':phone' => $phone,
                ':preferred_bedroom' => $bedroom,
                ':move_in_date' => $moveInDate,
                ':category' => $category,
                ':message' => $message
            ]);
            $storedInMysql = true;
        } catch (PDOException $e) {
            error_log("MySQL Insert Error: " . $e->getMessage());
        }
    }

    // JSON fallback
    $existing = [];
    if (file_exists($dataFile)) {
        $existing = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    array_unshift($existing, $record);
    @file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT));

    echo json_encode([
        'success' => true,
        'message' => 'Your inquiry has been successfully received.',
        'tracking_id' => $inquiryId,
        'storage' => [
            'mysql' => $storedInMysql,
            'database' => $storedInMysql ? DB_NAME : null,
            'json_backup' => true
        ],
        'inquiry' => $record
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
