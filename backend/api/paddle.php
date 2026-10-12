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
require_once __DIR__ . '/_auth.php';

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

// Payment history sirf logged-in admins ko (config/create/verify public rehte hain)
if ($action === 'history') {
    auth_require_permission();
}

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

    // item_type must match transactions.item_type ENUM, warna INSERT strict mode mein fail hota hai
    if (!in_array($itemType, ['application_fee', 'holding_deposit', 'rent_payment'], true)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid item_type. Allowed values: application_fee, holding_deposit, rent_payment.'
        ]);
        exit();
    }

    $amountInCents = (int) round($amount * 100);
    $localTxnId = 'TXN-' . strtoupper(substr(uniqid(), -8));

    $paddleTxnId = null;
    $paddleCheckoutUrl = null;
    $demoMode = empty($paddleApiKey);

    if ($demoMode) {
        // No Paddle API key configured → demo/sandbox testing. Koi Paddle call nahi,
        // local row 'pending' rehti hai (simulated payment).
    } else {
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
        $curlError = curl_error($ch);
        curl_close($ch);

        // Key configured hai lekin Paddle request fail hui → payment confirmed NAHI hui
        if ($response === false || $httpCode < 200 || $httpCode >= 300) {
            http_response_code(502);
            echo json_encode([
                'success' => false,
                'error' => 'Paddle API request failed. Please try again.',
                'details' => $curlError !== '' ? $curlError : ('HTTP ' . $httpCode)
            ]);
            exit();
        }

        $paddleData = json_decode($response, true);
        $paddleTxnId = $paddleData['data']['id'] ?? null;
        $paddleCheckoutUrl = $paddleData['data']['checkout']['url'] ?? null;

        if (empty($paddleTxnId)) {
            http_response_code(502);
            echo json_encode([
                'success' => false,
                'error' => 'Paddle API did not return a transaction id. Please try again.'
            ]);
            exit();
        }

        if (empty($paddleCheckoutUrl)) {
            $checkoutHost = $isSandbox ? 'https://sandbox-buy.paddle.com' : 'https://buy.paddle.com';
            $paddleCheckoutUrl = $checkoutHost . '/checkout?_ptxn=' . $paddleTxnId;
        }
    }

    $finalTxnId = $paddleTxnId ?: $localTxnId;

    // Save transaction to MySQL (always 'pending' — payment abhi confirm nahi hui)
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

    $responsePayload = [
        'success' => true,
        'demo_mode' => $demoMode,
        'txn_id' => $finalTxnId,
        'paddle_txn_id' => $paddleTxnId,
        'checkout_url' => $paddleCheckoutUrl,
        'amount' => $amount,
        'currency' => $currency,
        'item_type' => $itemType,
        'item_name' => $itemName,
        'unit_number' => $unitNumber,
        'customer' => [
            'name' => $customerName,
            'email' => $customerEmail,
        ],
        'environment' => $paddleEnv,
        'client_side_token' => $paddleClientToken,
        'database_recorded' => $storedInDb
    ];

    if ($demoMode) {
        $responsePayload['message'] = 'No Paddle API key configured — demo mode. Payment simulated locally, transaction is still pending.';
    }

    echo json_encode($responsePayload);
    exit();
}

// ── 3. Verify Transaction Status ─────────────────────────────────────────────
if ($action === 'verify_transaction') {
    $txnId = trim($_GET['txn_id'] ?? ($_POST['txn_id'] ?? ''));
    if (empty($txnId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Transaction ID is required']);
        exit();
    }

    $pdo = getDatabaseConnection();

    // Local transaction row (amount/messages ke liye)
    $localRow = null;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `transactions` WHERE `txn_id` = :id OR `paddle_order_id` = :id2 LIMIT 1");
            $stmt->execute([':id' => $txnId, ':id2' => $txnId]);
            $localRow = $stmt->fetch();
        } catch (Exception $e) {
            error_log("Failed to read txn in DB: " . $e->getMessage());
        }
    }

    $rowAmount = $localRow ? (float)$localRow['amount'] : null;

    // ── (b) Demo mode (no API key): locally generated 'TXN-...' id confirm karo ──
    if (empty($paddleApiKey)) {
        if ($localRow && strpos($txnId, 'TXN-') === 0) {
            if ($localRow['status'] === 'pending') {
                try {
                    $stmt = $pdo->prepare("UPDATE `transactions` SET `status` = 'completed' WHERE `txn_id` = :id");
                    $stmt->execute([':id' => $txnId]);
                } catch (Exception $e) {
                    error_log("Failed to update txn in DB: " . $e->getMessage());
                }
            }
            echo json_encode([
                'success' => true,
                'verified' => true,
                'status' => 'completed',
                'simulated' => true,
                'txn_id' => $txnId,
                'amount' => $rowAmount,
                'message' => 'Demo mode: local transaction simulated as completed (no Paddle API key configured).'
            ]);
            exit();
        }

        http_response_code(404);
        echo json_encode([
            'success' => false,
            'verified' => false,
            'status' => 'not_found',
            'simulated' => true,
            'txn_id' => $txnId,
            'amount' => $rowAmount,
            'message' => 'Transaction not found.'
        ]);
        exit();
    }

    // ── (a) Paddle id: API se confirm karo ──
    if (strpos($txnId, 'txn_') === 0) {
        $ch = curl_init($baseApiUrl . 'transactions/' . rawurlencode($txnId));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $paddleApiKey
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $resp = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $parsed = json_decode($resp, true);
        $paddleStatus = $parsed['data']['status'] ?? null;
        $paddleTotal = $parsed['data']['details']['totals']['total'] ?? null;
        if ($rowAmount === null && is_numeric($paddleTotal)) {
            $rowAmount = round(((float)$paddleTotal) / 100, 2);
        }

        if (in_array($paddleStatus, ['completed', 'paid', 'billed'])) {
            if ($pdo) {
                try {
                    $stmt = $pdo->prepare("UPDATE `transactions` SET `status` = 'completed' WHERE `txn_id` = :id OR `paddle_order_id` = :id2");
                    $stmt->execute([':id' => $txnId, ':id2' => $txnId]);
                } catch (Exception $e) {
                    error_log("Failed to update txn in DB: " . $e->getMessage());
                }
            }
            echo json_encode([
                'success' => true,
                'verified' => true,
                'status' => 'completed',
                'simulated' => false,
                'txn_id' => $txnId,
                'amount' => $rowAmount,
                'message' => 'Payment verified via Paddle.'
            ]);
            exit();
        }

        // Paddle ne explicitly 404 diya → transaction exist hi nahi karti
        if ($httpCode === 404) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'verified' => false,
                'status' => 'not_found',
                'simulated' => false,
                'txn_id' => $txnId,
                'amount' => $rowAmount,
                'message' => 'Transaction not found on Paddle.'
            ]);
            exit();
        }

        echo json_encode([
            'success' => true,
            'verified' => false,
            'status' => 'pending',
            'simulated' => false,
            'txn_id' => $txnId,
            'amount' => $rowAmount,
            'message' => 'Payment is still pending on Paddle (status: ' . ($paddleStatus ?: 'unknown') . ').'
        ]);
        exit();
    }

    // Koi bhi unknown id format → not_found
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'verified' => false,
        'status' => 'not_found',
        'simulated' => false,
        'txn_id' => $txnId,
        'amount' => $rowAmount,
        'message' => 'Unknown transaction id. Expected a Paddle (txn_...) or local (TXN-...) id.'
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
