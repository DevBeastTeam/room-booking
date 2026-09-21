<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Tour Booking & Appointment Handler
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit();
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$firstName = isset($data['firstName']) ? trim(strip_tags($data['firstName'])) : '';
$lastName = isset($data['lastName']) ? trim(strip_tags($data['lastName'])) : '';
$fullName = trim($firstName . ' ' . $lastName);
if (empty($fullName) && isset($data['name'])) {
    $fullName = trim(strip_tags($data['name']));
}

$email = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$date = isset($data['date']) ? trim(strip_tags($data['date'])) : '';
$time = isset($data['time']) ? trim(strip_tags($data['time'])) : '';
$tourType = isset($data['tourType']) ? trim(strip_tags($data['tourType'])) : 'In-Person Tour';
$bedroom = isset($data['bedroom']) ? trim(strip_tags($data['bedroom'])) : 'Any';
$notes = isset($data['notes']) ? trim(strip_tags($data['notes'])) : '';

if (empty($fullName) || empty($email) || empty($date)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, Email, and Tour Date are required.']);
    exit();
}

$tourId = 'TOUR-' . strtoupper(substr(uniqid(), -6));
$timestamp = date('Y-m-d H:i:s');

$tourRecord = [
    'id' => $tourId,
    'name' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'date' => $date,
    'time' => $time,
    'tourType' => $tourType,
    'bedroom' => $bedroom,
    'notes' => $notes,
    'created_at' => $timestamp,
    'status' => 'confirmed'
];

$storageDir = __DIR__ . '/data';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}

$dataFile = $storageDir . '/tours.json';
$existing = [];
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $existing = json_decode($content, true) ?: [];
}

array_unshift($existing, $tourRecord);
@file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT));

// Send confirmation email
$recipient = 'leasing@monarchpassapts.com';
$subject = "Tour Scheduled: {$fullName} on {$date} ({$tourId})";
$body = "A new apartment tour has been confirmed:\n\n"
      . "Tour ID: {$tourId}\n"
      . "Prospect: {$fullName}\n"
      . "Email: {$email}\n"
      . "Phone: {$phone}\n"
      . "Date & Time: {$date} at {$time}\n"
      . "Tour Mode: {$tourType}\n"
      . "Preferred Floor Plan: {$bedroom}\n"
      . "Notes: {$notes}\n\n"
      . "---\nMonarch Pass Tour Management";

$headers = "From: noreply@" . ($_SERVER['SERVER_NAME'] ?? 'monarchpassapts.com') . "\r\n"
         . "Reply-To: {$email}\r\n"
         . "X-Mailer: PHP/" . phpversion();

@mail($recipient, $subject, $body, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Tour successfully scheduled! A confirmation has been sent to your email.',
    'tour' => $tourRecord
]);
