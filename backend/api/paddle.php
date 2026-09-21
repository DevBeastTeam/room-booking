<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Paddle Payment Gateway Handler (Billing v2 API)
 * Credentials imported from laravel-web
 * ==============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/config/database.php';

$envVars = loadEnvFile(dirname(__DIR__) . '/config/.env');

$paddleEnv = strtolower($envVars['PADDLE_ENV'] ?? 'live');
$isSandbox = ($paddleEnv === 'sandbox');

if ($isSandbox && !empty($envVars['PADDLE_SANDBOX_API_KEY'])) {
    $paddleApiKey = $envVars['PADDLE_SANDBOX_API_KEY'];
    $paddleClientToken = $envVars['PADDLE_SANDBOX_CLIENT_SIDE_TOKEN'] ?? '';
    $baseApiUrl = 'https://sandbox-api.paddle.com/';
} else {
    // Keys MUST be set in backend/config/.env — never hardcode here
    $paddleApiKey = $envVars['PADDLE_API_KEY'] ?? '';
    $paddleClientToken = $envVars['PADDLE_CLIENT_SIDE_TOKEN'] ?? '';
    $baseApiUrl = 'https://api.paddle.com/';
}

$currency = strtoupper($envVars['PADDLE_CURRENCY'] ?? 'USD');
$vendorId = $envVars['PADDLE_VENDOR_ID'] ?? '333354';

$action = $_GET['action'] ?? ($_POST['action'] ?? 'config');

// ── 1. Return Public Client Configuration ────────────────────────────────────
if ($action === 'config') {
    echo json_encode([
        'success' => true,
        'environment' => $paddleEnv,
        'is_sandbox' => $isSandbox,
        'client_side_token' => $paddleClientToken,
        'vendor_id' => $vendorId,
        'currency' => $currency,
        'default_fees' => [
            'application_fee' => 50.00,
            'holding_deposit' => 250.00,
            'pet_deposit' => 300.00,
        ]
    ]);
    exit();
}

// ── 2. Create Paddle Transaction ─────────────────────────────────────────────
if ($action === 'create_transaction') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true) ?: $_POST;

    $itemType = $data['item_type'] ?? 'holding_deposit';
    $itemName = $data['item_name'] ?? 'Apartment Holding Deposit';
    $amount = (float) ($data['amount'] ?? 250.00);
    $unitNumber = trim($data['unit_number'] ?? '');
    $customerName = trim($data['customer_name'] ?? 'Guest Prospect');
    $customerEmail = trim(filter_var($data['customer_email'] ?? '', FILTER_SANITIZE_EMAIL));
    $customerPhone = trim($data['customer_phone'] ?? '');

    if (empty($customerEmail) || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid email address is required.']);
        exit();
    }

    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Amount must be greater than $0.']);
        exit();
    }

    $amountInCents = (int) round($amount * 100);
    $localTxnId = 'TXN-' . strtoupper(substr(uniqid(), -8));

    // Call Paddle Billing v2 API
    $paddlePayload = [
        'items' => [
            [
                'quantity' => 1,
                'price' => [
                    'description' => "Monarch Pass - {$itemName} (Unit: " . ($unitNumber ?: 'General') . ")",
                    'unit_price' => [
                        'amount' => (string) $amountInCents,
                        'currency_code' => $currency,
                    ],
                    'billing_cycle' => null, // Explicitly one-time payment (Non-recurring)
                    'product' => [
                        'name' => "Monarch Pass - {$itemName}",
                        'tax_category' => 'standard',
                    ]
                ]
            ]
        ],
        'customer' => [
            'email' => $customerEmail,
            'name' => $customerName
        ],
        'custom_data' => [
            'local_txn_id' => $localTxnId,
            'unit_number' => $unitNumber,
            'item_type' => $itemType,
            'community' => 'Monarch Pass Apartments'
        ]
    ];

    $ch = curl_init($baseApiUrl . 'transactions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($paddlePayload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $paddleApiKey
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $paddleData = json_decode($response, true);
    $paddleTxnId = $paddleData['data']['id'] ?? null;
    $paddleCheckoutUrl = $paddleData['data']['checkout']['url'] ?? null;

    if (empty($paddleCheckoutUrl) && !empty($paddleTxnId)) {
        $checkoutHost = $isSandbox ? 'https://sandbox-buy.paddle.com' : 'https://buy.paddle.com';
        $paddleCheckoutUrl = $checkoutHost . '/checkout?_ptxn=' . $paddleTxnId;
    }

    $finalTxnId = $paddleTxnId ?: $localTxnId;

    // Save transaction to MySQL
    $storedInDb = false;
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `transactions` (
                    `txn_id`, `paddle_order_id`, `user_name`, `user_email`, `user_phone`,
                    `item_type`, `item_name`, `unit_number`, `amount`, `currency`,
                    `status`, `paddle_checkout_url`
                ) VALUES (
                    :txn_id, :paddle_order_id, :user_name, :user_email, :user_phone,
                    :item_type, :item_name, :unit_number, :amount, :currency,
                    'pending', :checkout_url
                )
            ");
            $stmt->execute([
                ':txn_id' => $finalTxnId,
                ':paddle_order_id' => $paddleTxnId,
                ':user_name' => $customerName,
                ':user_email' => $customerEmail,
                ':user_phone' => $customerPhone,
                ':item_type' => $itemType,
                ':item_name' => $itemName,
                ':unit_number' => $unitNumber,
                ':amount' => $amount,
                ':currency' => $currency,
                ':checkout_url' => $paddleCheckoutUrl
            ]);
            $storedInDb = true;
        } catch (Exception $e) {
            error_log("Database transaction insert error: " . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'txn_id' => $finalTxnId,
        'paddle_txn_id' => $paddleTxnId,
        'checkout_url' => $paddleCheckoutUrl,
        'amount' => $amount,
        'currency' => $currency,
        'item_name' => $itemName,
        'unit_number' => $unitNumber,
        'customer' => [
            'name' => $customerName,
            'email' => $customerEmail,
        ],
        'environment' => $paddleEnv,
        'client_side_token' => $paddleClientToken,
        'database_recorded' => $storedInDb
    ]);
    exit();
}

// ── 3. Verify Transaction Status ─────────────────────────────────────────────
if ($action === 'verify_transaction') {
    $txnId = $_GET['txn_id'] ?? ($_POST['txn_id'] ?? '');
    if (empty($txnId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Transaction ID is required']);
        exit();
    }

    $isCompleted = false;
    $paddleStatus = null;

    if (strpos($txnId, 'txn_') === 0) {
        $ch = curl_init($baseApiUrl . 'transactions/' . $txnId);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $paddleApiKey
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $resp = curl_exec($ch);
        curl_close($ch);

        $parsed = json_decode($resp, true);
        $paddleStatus = $parsed['data']['status'] ?? null;
        if (in_array($paddleStatus, ['completed', 'paid', 'billed'])) {
            $isCompleted = true;
        }
    } else {
        $isCompleted = true;
        $paddleStatus = 'completed';
    }

    $pdo = getDatabaseConnection();
    if ($pdo && $isCompleted) {
        try {
            $stmt = $pdo->prepare("UPDATE `transactions` SET `status` = 'completed' WHERE `txn_id` = :id OR `paddle_order_id` = :id2");
            $stmt->execute([':id' => $txnId, ':id2' => $txnId]);
        } catch (Exception $e) {
            error_log("Failed to update txn in DB: " . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true,
        'verified' => $isCompleted,
        'status' => $paddleStatus ?: ($isCompleted ? 'completed' : 'pending'),
        'txn_id' => $txnId
    ]);
    exit();
}

// ── 4. Transaction History ───────────────────────────────────────────────────
if ($action === 'history') {
    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `transactions` ORDER BY `created_at` DESC LIMIT 50");
            $rows = $stmt->fetchAll();
            echo json_encode([
                'success' => true,
                'count' => count($rows),
                'transactions' => $rows
            ]);
            exit();
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'transactions' => []]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unknown action requested']);
