<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Tour Scheduling API
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
$dataFile = $storageDir . '/tours.json';

// GET: Return all scheduled tours
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `tours` ORDER BY `tour_date` ASC, `tour_time` ASC LIMIT 100");
            $rows = $stmt->fetchAll();
            echo json_encode([
                'success' => true,
                'source' => 'mysql',
                'count' => count($rows),
                'tours' => $rows
            ]);
            exit();
        } catch (Exception $e) {
            error_log("DB read error in schedule.php: " . $e->getMessage());
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
        'tours' => $existing
    ]);
    exit();
}

// POST: Schedule a tour
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $firstName = isset($data['firstName']) ? trim(strip_tags($data['firstName'])) : '';
    $lastName = isset($data['lastName']) ? trim(strip_tags($data['lastName'])) : '';
    $fullName = trim($firstName . ' ' . $lastName);
    if (empty($fullName) && isset($data['name'])) {
        $fullName = trim(strip_tags($data['name']));
    }

    $email = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
    $phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
    $date = isset($data['date']) ? trim(strip_tags($data['date'])) : (isset($data['tourDate']) ? trim(strip_tags($data['tourDate'])) : '');
    $time = isset($data['time']) ? trim(strip_tags($data['time'])) : (isset($data['tourTime']) ? trim(strip_tags($data['tourTime'])) : '');
    $tourTypeRaw = isset($data['tourType']) ? trim(strip_tags($data['tourType'])) : 'In-Person Tour';
    $bedroom = isset($data['bedroom']) ? trim(strip_tags($data['bedroom'])) : (isset($data['bedrooms']) ? trim(strip_tags($data['bedrooms'])) : 'Any');
    $unit = isset($data['unit']) ? trim(strip_tags($data['unit'])) : (isset($data['selectedUnit']) ? trim(strip_tags($data['selectedUnit'])) : '');
    $notes = isset($data['notes']) ? trim(strip_tags($data['notes'])) : (isset($data['message']) ? trim(strip_tags($data['message'])) : '');

    if (empty($fullName) || empty($email) || empty($date)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name, Email, and Tour Date are required.']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
        exit();
    }

    $mappedTourType = 'in-person';
    $tourTypeLower = strtolower($tourTypeRaw);
    if (strpos($tourTypeLower, 'virtual') !== false || strpos($tourTypeLower, 'video') !== false) {
        $mappedTourType = 'virtual-video';
    } elseif (strpos($tourTypeLower, 'self') !== false) {
        $mappedTourType = 'self-guided';
    }

    $formattedDate = $date;
    $timestamp = strtotime($date);
    if ($timestamp !== false) {
        $formattedDate = date('Y-m-d', $timestamp);
    }

    $tourId = 'TOUR-' . strtoupper(substr(uniqid(), -6));
    $createdAt = date('Y-m-d H:i:s');

    $tourRecord = [
        'id' => $tourId,
        'tracking_id' => $tourId,
        'name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'date' => $formattedDate,
        'time' => $time,
        'tourType' => $tourTypeRaw,
        'bedroom' => $bedroom,
        'unit' => $unit,
        'notes' => $notes,
        'created_at' => $createdAt,
        'status' => 'scheduled'
    ];

    $storedInMysql = false;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `tours` (
                    `tracking_id`, `name`, `email`, `phone`,
                    `preferred_bedroom`, `preferred_unit`, `tour_date`,
                    `tour_time`, `tour_type`, `comments`, `status`
                ) VALUES (
                    :tracking_id, :name, :email, :phone,
                    :preferred_bedroom, :preferred_unit, :tour_date,
                    :tour_time, :tour_type, :comments, 'scheduled'
                )
            ");
            $stmt->execute([
                ':tracking_id' => $tourId,
                ':name' => $fullName,
                ':email' => $email,
                ':phone' => $phone,
                ':preferred_bedroom' => $bedroom,
                ':preferred_unit' => $unit,
                ':tour_date' => $formattedDate,
                ':tour_time' => $time,
                ':tour_type' => $mappedTourType,
                ':comments' => $notes
            ]);
            $storedInMysql = true;
        } catch (PDOException $e) {
            error_log("MySQL Tour Insert Error: " . $e->getMessage());
        }
    }

    // JSON fallback
    $existing = [];
    if (file_exists($dataFile)) {
        $existing = json_decode(file_get_contents($dataFile), true) ?: [];
    }
    array_unshift($existing, $tourRecord);
    @file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT));

    echo json_encode([
        'success' => true,
        'message' => 'Tour appointment scheduled successfully!',
        'tracking_id' => $tourId,
        'storage' => [
            'mysql' => $storedInMysql,
            'database' => $storedInMysql ? DB_NAME : null,
            'json_backup' => true
        ],
        'tour' => $tourRecord
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
