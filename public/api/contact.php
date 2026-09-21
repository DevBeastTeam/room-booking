<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Contact Form & Inquiry Handler
 * ==============================================================================
 */

// Enable CORS for local testing / production
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

// Read JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

// Validate fields
$name = isset($data['name']) ? trim(strip_tags($data['name'])) : '';
$email = isset($data['email']) ? trim(filter_var($data['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($data['phone']) ? trim(strip_tags($data['phone'])) : '';
$bedroom = isset($data['preferredBedroom']) ? trim(strip_tags($data['preferredBedroom'])) : 'Any';
$moveInDate = isset($data['moveInDate']) ? trim(strip_tags($data['moveInDate'])) : '';
$message = isset($data['message']) ? trim(strip_tags($data['message'])) : '';
$category = isset($data['category']) ? trim(strip_tags($data['category'])) : 'General Inquiry';

if (empty($name) || empty($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name and Email are required fields.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
    exit();
}

// Generate unique tracking ID
$inquiryId = 'INQ-' . strtoupper(substr(uniqid(), -6));
$timestamp = date('Y-m-d H:i:s');

$record = [
    'id' => $inquiryId,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'preferredBedroom' => $bedroom,
    'moveInDate' => $moveInDate,
    'message' => $message,
    'category' => $category,
    'created_at' => $timestamp,
    'status' => 'new'
];

// Persistent storage in JSON file
$storageDir = __DIR__ . '/data';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}

$dataFile = $storageDir . '/inquiries.json';
$existing = [];
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $existing = json_decode($content, true) ?: [];
}

array_unshift($existing, $record);
@file_put_contents($dataFile, json_encode($existing, JSON_PRETTY_PRINT));

// Optional Email Notification to On-Site Leasing Office
$recipient = 'leasing@monarchpassapts.com';
$subject = "New Inquiry: {$name} - Monarch Pass Apartments ({$inquiryId})";
$body = "A new contact inquiry has been received on the website.\n\n"
      . "ID: {$inquiryId}\n"
      . "Name: {$name}\n"
      . "Email: {$email}\n"
      . "Phone: {$phone}\n"
      . "Preferred Layout: {$bedroom}\n"
      . "Target Move-in: {$moveInDate}\n"
      . "Category: {$category}\n\n"
      . "Message:\n{$message}\n\n"
      . "---\nMonarch Pass Apartments Web Notification System";

$headers = "From: noreply@" . ($_SERVER['SERVER_NAME'] ?? 'monarchpassapts.com') . "\r\n"
         . "Reply-To: {$email}\r\n"
         . "X-Mailer: PHP/" . phpversion();

@mail($recipient, $subject, $body, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your inquiry has been received by our leasing team.',
    'inquiry' => $record
]);
