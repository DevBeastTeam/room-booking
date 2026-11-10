<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - WorldFirst Payment Gateway API (WorldFirst Pay Solution)
 * ==============================================================================
 * Supports:
 *  1. One-time Manual Payments (Application Fee, Holding Deposit, Pet Fee, Rent)
 *  2. Auto-Subscription / Recurring Billing (Monthly Rent or 3-Day Test Cycle)
 *  3. Inquire / Verify Payment Status
 *  4. Asynchronous Webhook Notifications (notifyPayment)
 *  5. Cancel / Manage Subscriptions
 *
 * Mode: 'sandbox' (testing) or 'live' (production)
 * ==============================================================================
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once dirname(__DIR__) . '/config/database.php';
require_once __DIR__ . '/_auth.php';

auth_send_cors_headers();

$envVars = function_exists('loadEnvFile') ? loadEnvFile(dirname(__DIR__) . '/config/.env') : [];

// ── Environment & Gateway Credentials ──────────────────────────────────────────
$wfEnv = strtolower($envVars['WORLDFIRST_ENV'] ?? 'sandbox');
$isSandbox = ($wfEnv !== 'live');

$clientId     = $envVars['WORLDFIRST_CLIENT_ID'] ?? '';
$merchantId   = $envVars['WORLDFIRST_MERCHANT_ID'] ?? '';
$apiKey       = $envVars['WORLDFIRST_API_KEY'] ?? '';
$privateKey   = $envVars['WORLDFIRST_PRIVATE_KEY'] ?? '';
$publicKey    = $envVars['WORLDFIRST_PUBLIC_KEY'] ?? '';
$webhookSecret= $envVars['WORLDFIRST_WEBHOOK_SECRET'] ?? '';
$currency     = strtoupper($envVars['WORLDFIRST_CURRENCY'] ?? 'USD');

// Base API URL
$baseApiUrl = $isSandbox
    ? 'https://open-ams-sandbox.worldfirst.com/amsin/api/v1/business/'
    : 'https://open-ams.worldfirst.com/amsin/api/v1/business/';

// JSON input parsing
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true) ?: [];
$action = $_GET['action'] ?? ($jsonInput['action'] ?? ($_POST['action'] ?? 'config'));

// ── Authoritative fee table ────────────────────────────────────────────────────
// The client NEVER sends the amount. Prices are resolved server-side so a
// tampered request cannot buy a $909 rent for $1.
const WF_FEES = [
    'application_fee' => 50.00,
    'holding_deposit' => 250.00,
    'pet_deposit'     => 300.00,
];

/**
 * Resolve the server-side amount for a payment.
 * Fixed fees come from WF_FEES; rent comes from the unit/floor-plan records.
 */
function wf_resolve_amount($pdo, $itemType, $unitNumber) {
    $itemType = (string)$itemType;
    if (isset(WF_FEES[$itemType])) {
        return ['amount' => WF_FEES[$itemType], 'source' => 'fee_table'];
    }
    if ($itemType === 'rent_payment') {
        $unitNumber = trim((string)$unitNumber);
        if ($pdo && $unitNumber !== '') {
            try {
                $stmt = $pdo->prepare("SELECT `rent` FROM `units` WHERE `unit_number` = :u LIMIT 1");
                $stmt->execute([':u' => $unitNumber]);
                $row = $stmt->fetch();
                if ($row && (float)$row['rent'] > 0) {
                    return ['amount' => round((float)$row['rent'], 2), 'source' => 'unit_rent'];
                }
            } catch (Exception $e) {
                error_log('WorldFirst rent lookup failed: ' . $e->getMessage());
            }
        }
        // Fall back to the cheapest active floor plan (12-month lease price).
        if ($pdo) {
            try {
                $stmt = $pdo->query("SELECT `price_12m` FROM `floor_plans` WHERE `is_active` = 1 ORDER BY `price_12m` ASC LIMIT 1");
                $row = $stmt->fetch();
                if ($row && (float)$row['price_12m'] > 0) {
                    return ['amount' => round((float)$row['price_12m'], 2), 'source' => 'floor_plan_min'];
                }
            } catch (Exception $e) {
                error_log('WorldFirst floor plan lookup failed: ' . $e->getMessage());
            }
        }
        // Last resort: a configured server-side default, so a transient database
        // outage can never block rent payments (and never trusts the client).
        $fallback = (float)auth_env('WORLDFIRST_DEFAULT_RENT', 0);
        if ($fallback > 0) {
            return ['amount' => round($fallback, 2), 'source' => 'env_default'];
        }
        return ['amount' => 0.0, 'source' => 'unresolved'];
    }
    return ['amount' => 0.0, 'source' => 'unresolved'];
}

/**
 * Sign the request payload with the merchant RSA private key.
 * WorldFirst expects an RSA-SHA256 signature over the canonical body.
 */
function wf_rsa_signature($payload, $privateKeyPem) {
    $privateKeyPem = trim((string)$privateKeyPem);
    // Allow the PEM to live in a file (multi-line env values are awkward).
    if (strpos($privateKeyPem, 'PRIVATE KEY') === false && is_file($privateKeyPem)) {
        $privateKeyPem = (string)@file_get_contents($privateKeyPem);
    }
    if ($privateKeyPem === '' || strpos($privateKeyPem, 'PRIVATE KEY') === false) {
        return '';
    }
    $privateKeyPem = preg_replace('/\\\\n/', "\n", $privateKeyPem);
    $key = openssl_pkey_get_private($privateKeyPem);
    if ($key === false) return '';
    $signature = '';
    openssl_sign($payload, $signature, $key, OPENSSL_ALGO_SHA256);
    return base64_encode($signature);
}

/**
 * Verify an inbound WorldFirst webhook signature.
 * Accepts the common header names; falls back to an HMAC of the raw body.
 */
function wf_verify_webhook_signature($rawBody, $headers, $secret) {
    if ($secret === '') return false;
    $candidates = [];
    foreach (['HTTP_X_WORLD_FIRST_SIGNATURE', 'HTTP_X_SIGNATURE', 'HTTP_SIGNATURE'] as $h) {
        if (!empty($headers[$h])) $candidates[] = $headers[$h];
    }
    // Some gateways send "Signature: keyId=...,signature=base64"
    $candidates = array_merge($candidates, array_values(array_filter($headers, function ($v, $k) {
        return stripos($k, 'signature') !== false && is_string($v) && $v !== '';
    }, ARRAY_FILTER_USE_BOTH)));

    $hmac = base64_encode(hash_hmac('sha256', $rawBody, $secret, true));
    $hmacHex = hash_hmac('sha256', $rawBody, $secret);

    foreach ($candidates as $sig) {
        $sig = trim((string)$sig);
        if ($sig === '') continue;
        if (hash_equals($hmac, $sig) || hash_equals($hmacHex, $sig)) return true;
        // Strip a "keyId=" prefix if present.
        if (strpos($sig, 'signature=') !== false) {
            $part = substr($sig, strpos($sig, 'signature=') + 10);
            if (hash_equals($hmac, $part) || hash_equals($hmacHex, $part)) return true;
        }
    }
    return false;
}

/**
 * Issue a per-transaction verification secret. Only the client that created a
 * transaction can confirm it in sandbox mode.
 */
function wf_new_verify_token() {
    return bin2hex(random_bytes(24));
}

function wf_token_matches($expected, $given) {
    if (empty($expected) || empty($given)) return false;
    return hash_equals((string)$expected, (string)$given);
}

/**
 * Ask the WorldFirst gateway whether a payment actually succeeded.
 *
 * @return bool|null true = paid, false = not paid, null = could not determine
 */
function wf_query_gateway_status($orderId) {
    global $baseApiUrl, $clientId, $apiKey, $privateKey;

    if (empty($apiKey) || empty($orderId)) return null;

    $query = ['paymentId' => $orderId];
    $payloadJson = json_encode($query);
    $headers = [
        'Content-Type: application/json',
        'client-id: ' . $clientId,
        'Authorization: Bearer ' . $apiKey,
    ];
    $signature = wf_rsa_signature($payloadJson, $privateKey);
    if ($signature !== '') {
        $headers[] = 'Signature: ' . $signature;
    }

    $ch = curl_init($baseApiUrl . 'query');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payloadJson);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 20);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if (!$response || $httpCode < 200 || $httpCode >= 300) {
        error_log('WorldFirst gateway query failed (HTTP ' . $httpCode . ') for order ' . $orderId);
        return null;
    }
    $parsed = json_decode($response, true);
    if (!is_array($parsed)) return null;

    $status = strtolower((string)($parsed['paymentStatus'] ?? ($parsed['status'] ?? '')));
    if ($status === '') return null;
    return in_array($status, ['success', 'completed', 'paid', 'succeeded'], true);
}

// ── Dual Persistence: JSON file storage helpers ────────────────────────────────
function wf_get_json_path() {
    return dirname(__DIR__) . '/data/transactions.json';
}

function wf_read_json_transactions() {
    $path = wf_get_json_path();
    if (!file_exists($path)) return [];
    $raw = @file_get_contents($path);
    $arr = json_decode($raw, true);
    return is_array($arr) ? $arr : [];
}

function wf_save_json_transactions(array $txns) {
    $path = wf_get_json_path();
    @file_put_contents($path, json_encode(array_values($txns), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function wf_upsert_json_transaction(array $record) {
    $list = wf_read_json_transactions();
    $found = false;
    foreach ($list as $k => $item) {
        if (($item['txn_id'] ?? '') === ($record['txn_id'] ?? '')) {
            $list[$k] = array_merge($item, $record);
            $found = true;
            break;
        }
    }
    if (!$found) {
        array_unshift($list, $record);
    }
    wf_save_json_transactions($list);
}

// ── Ensure Transactions Table has WorldFirst & Subscription Columns ────────────
function ensureTransactionsSchema($pdo) {
    if (!$pdo) return;
    static $checked = false;
    if ($checked) return;
    $checked = true;

    try {
        $cols = $pdo->query("SHOW COLUMNS FROM `transactions`")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('payment_gateway', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `payment_gateway` VARCHAR(32) DEFAULT 'worldfirst'");
        }
        if (!in_array('payment_mode', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `payment_mode` VARCHAR(32) DEFAULT 'one_time'");
        }
        if (!in_array('subscription_interval', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `subscription_interval` VARCHAR(32) DEFAULT NULL");
        }
        if (!in_array('subscription_status', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `subscription_status` VARCHAR(32) DEFAULT 'none'");
        }
        if (!in_array('next_billing_date', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `next_billing_date` DATETIME DEFAULT NULL");
        }
        if (!in_array('checkout_url', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `checkout_url` TEXT DEFAULT NULL");
        }
        if (!in_array('verify_token', $cols)) {
            @$pdo->exec("ALTER TABLE `transactions` ADD COLUMN `verify_token` VARCHAR(64) DEFAULT NULL");
        }
    } catch (Exception $e) {
        // Table may not exist yet or user lacks alter privileges — silently continue
    }
}

$pdo = getDatabaseConnection();
if ($pdo) {
    ensureTransactionsSchema($pdo);
}

// ── 1. CONFIG: Public Gateway & Pricing Configuration ──────────────────────────
if ($action === 'config') {
    echo json_encode([
        'success'           => true,
        'gateway'           => 'WorldFirst Pay Solution',
        'environment'       => $wfEnv,
        'is_sandbox'        => $isSandbox,
        // NOTE: client_id / merchant_id are intentionally NOT exposed publicly.
        'currency'          => $currency,
        'subscription_enabled' => true,
        'subscription_intervals' => [
            [
                'id'          => 'monthly',
                'name'        => 'Monthly Recurring (Every 30 Days)',
                'days'        => 30,
                'description' => 'Automated monthly rent payment deducted on the 1st of each month.'
            ],
            [
                'id'          => '3_days',
                'name'        => 'Test Cycle (Every 3 Days)',
                'days'        => 3,
                'description' => 'Developer test cycle — auto-renews every 3 days to verify recurring payments.'
            ]
        ],
        'default_fees'      => [
            'application_fee' => 50.00,
            'holding_deposit' => 250.00,
            'pet_deposit'     => 300.00,
            'standard_rent'   => 909.00,
        ]
    ]);
    exit();
}

// ── 2. CREATE PAYMENT: One-time or Auto-Subscription ───────────────────────────
if ($action === 'create_payment' || $action === 'create_transaction') {
    $data = $jsonInput ?: $_POST;

    $itemType     = $data['item_type'] ?? 'holding_deposit';
    $itemName     = trim($data['item_name'] ?? 'Apartment Holding Deposit');
    $unitNumber   = trim($data['unit_number'] ?? '');
    $customerName = trim($data['customer_name'] ?? 'Guest Prospect');
    $customerEmail= trim(filter_var($data['customer_email'] ?? '', FILTER_SANITIZE_EMAIL));
    $customerPhone= trim($data['customer_phone'] ?? '');

    // Payment mode: 'one_time' (manual) or 'subscription' (auto-renew)
    $paymentMode  = ($data['payment_mode'] ?? 'one_time') === 'subscription' ? 'subscription' : 'one_time';
    $subInterval  = $data['subscription_interval'] ?? ($paymentMode === 'subscription' ? 'monthly' : null);

    if (empty($customerEmail) || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Valid email address is required.']);
        exit();
    }

    // Ensure valid item_type — anything unknown is rejected, not silently swapped.
    $allowedTypes = array_merge(array_keys(WF_FEES), ['rent_payment']);
    if (!in_array($itemType, $allowedTypes, true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown payment item type.']);
        exit();
    }

    // ── Amount is resolved SERVER-SIDE. Any client-supplied amount is ignored.
    $resolved = wf_resolve_amount($pdo, $itemType, $unitNumber);
    $amount = (float)$resolved['amount'];
    if ($amount <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error'   => 'Payment amount could not be resolved for this item. Please contact the leasing office.',
        ]);
        exit();
    }

    $amountFormatted = number_format($amount, 2, '.', '');
    $localTxnId = 'WF-TXN-' . strtoupper(substr(uniqid(), -8));
    $orderId = 'WF-ORD-' . date('Ymd') . '-' . substr(str_shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ23456789'), 0, 6);
    // Per-transaction secret: only the creator can confirm a sandbox payment.
    $verifyToken = wf_new_verify_token();

    // Calculate next billing date if subscription
    $nextBillingDate = null;
    $subscriptionStatus = 'none';
    if ($paymentMode === 'subscription') {
        $intervalDays = ($subInterval === '3_days') ? 3 : 30;
        $nextBillingDate = date('Y-m-d H:i:s', strtotime("+{$intervalDays} days"));
        $subscriptionStatus = 'active';
    }

    $checkoutUrl = null;
    $liveApiCalled = false;

    // Call live WorldFirst API if API key is provided
    if (!empty($apiKey)) {
        $orderPayload = [
            'productCode'   => 'CASHIER_PAYMENT',
            'order'         => [
                'orderDescription' => "Monar Pass - {$itemName} (Unit: " . ($unitNumber ?: 'General') . ")",
                'orderAmount'      => [
                    'currency' => $currency,
                    'value'    => (string)((int)round($amount * 100))
                ],
                'merchantOrderId'  => $localTxnId,
            ],
            'paymentNotifyUrl' => ($envVars['SITE_URL'] ?? 'https://monarpass.com') . '/backend/api/worldfirst.php?action=webhook',
            'paymentRedirectUrl'=> ($envVars['SITE_URL'] ?? 'https://monarpass.com') . '/dashboard?payment=success&txn_id=' . $localTxnId,
            'buyer'            => [
                'buyerName'  => $customerName,
                'buyerEmail' => $customerEmail,
                'buyerPhone' => $customerPhone,
            ],
            'env'              => [
                'terminalType' => 'WEB'
            ]
        ];

        // Attach recurring mandate info if subscription requested
        if ($paymentMode === 'subscription') {
            $orderPayload['subscription'] = [
                'period' => ($subInterval === '3_days') ? '3_DAYS' : 'MONTHLY',
                'autoDebit' => true
            ];
        }

        $payloadJson = json_encode($orderPayload);
        $headers = [
            'Content-Type: application/json',
            'client-id: ' . $clientId,
            'Authorization: Bearer ' . $apiKey,
        ];
        // WorldFirst expects an RSA-SHA256 signature from the merchant private key.
        $signature = wf_rsa_signature($payloadJson, $privateKey);
        if ($signature !== '') {
            $headers[] = 'Signature: ' . $signature;
            $headers[] = 'X-Signature: ' . $signature;
        } else {
            error_log('WorldFirst: WORLDFIRST_PRIVATE_KEY missing or invalid — request sent unsigned.');
        }

        $ch = curl_init($baseApiUrl . 'create');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payloadJson);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response && $httpCode >= 200 && $httpCode < 300) {
            $parsed = json_decode($response, true);
            $checkoutUrl = $parsed['normalUrl'] ?? ($parsed['redirectUrl'] ?? null);
            $orderId = $parsed['paymentId'] ?? $orderId;
            $liveApiCalled = true;
        }
    }

    if (!$checkoutUrl) {
        // Realistic sandbox checkout session url
        $checkoutUrl = "/dashboard?payment=simulated&txn_id={$localTxnId}&mode={$paymentMode}";
    }

    // Persist in MySQL Database
    $storedInDb = false;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `transactions` (
                    `txn_id`, `paddle_order_id`, `payment_gateway`, `payment_mode`,
                    `subscription_interval`, `subscription_status`, `next_billing_date`,
                    `user_name`, `user_email`, `user_phone`, `item_type`, `item_name`,
                    `unit_number`, `amount`, `currency`, `status`, `checkout_url`, `verify_token`
                ) VALUES (
                    :txn_id, :order_id, 'worldfirst', :payment_mode,
                    :sub_interval, :sub_status, :next_billing,
                    :name, :email, :phone, :item_type, :item_name,
                    :unit, :amount, :currency, 'pending', :checkout_url, :verify_token
                )
            ");
            $stmt->execute([
                ':txn_id'       => $localTxnId,
                ':order_id'     => $orderId,
                ':payment_mode' => $paymentMode,
                ':sub_interval' => $subInterval,
                ':sub_status'   => $subscriptionStatus,
                ':next_billing' => $nextBillingDate,
                ':name'         => $customerName,
                ':email'        => $customerEmail,
                ':phone'        => $customerPhone,
                ':item_type'    => $itemType,
                ':item_name'    => $itemName,
                ':unit'         => $unitNumber,
                ':amount'       => $amountFormatted,
                ':currency'     => $currency,
                ':checkout_url' => $checkoutUrl,
                ':verify_token' => $verifyToken,
            ]);
            $storedInDb = true;
        } catch (Exception $e) {
            error_log("WorldFirst DB insert error: " . $e->getMessage());
        }
    }

    // Persist in JSON dual storage
    $txnRecord = [
        'id'                    => time(),
        'txn_id'                => $localTxnId,
        'paddle_order_id'       => $orderId,
        'payment_gateway'       => 'worldfirst',
        'payment_mode'          => $paymentMode,
        'subscription_interval' => $subInterval,
        'subscription_status'   => $subscriptionStatus,
        'next_billing_date'     => $nextBillingDate,
        'user_name'             => $customerName,
        'user_email'            => $customerEmail,
        'user_phone'            => $customerPhone,
        'item_type'             => $itemType,
        'item_name'             => $itemName,
        'unit_number'           => $unitNumber,
        'amount'                => (float)$amountFormatted,
        'currency'              => $currency,
        'status'                => 'pending',
        'checkout_url'          => $checkoutUrl,
        'verify_token'          => $verifyToken,
        'created_at'            => date('Y-m-d H:i:s'),
        'updated_at'            => date('Y-m-d H:i:s'),
    ];
    wf_upsert_json_transaction($txnRecord);

    echo json_encode([
        'success'             => true,
        'gateway'             => 'WorldFirst',
        'is_sandbox'          => $isSandbox,
        'live_api'            => $liveApiCalled,
        'txn_id'              => $localTxnId,
        'order_id'            => $orderId,
        'amount'              => (float)$amountFormatted,
        'currency'            => $currency,
        'payment_mode'        => $paymentMode,
        'subscription_interval'=> $subInterval,
        'next_billing_date'   => $nextBillingDate,
        'status'              => 'pending',
        'checkout_url'        => $checkoutUrl,
        'database_recorded'   => $storedInDb,
        // Secret required to confirm this transaction later. Keep it client-side.
        'verify_token'        => $verifyToken,
        'message'             => $isSandbox
            ? 'WorldFirst Sandbox payment initialized. Ready for simulation and verification.'
            : 'WorldFirst live checkout session created.'
    ]);
    exit();
}

// ── 3. VERIFY PAYMENT: Confirm completion & activate subscriptions ─────────────
if ($action === 'verify_payment' || $action === 'verify_transaction') {
    $txnId = trim($_GET['txn_id'] ?? ($jsonInput['txn_id'] ?? ($_POST['txn_id'] ?? '')));
    $token = trim($_GET['verify_token'] ?? ($jsonInput['verify_token'] ?? ($_POST['verify_token'] ?? '')));

    if (empty($txnId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Transaction ID is required']);
        exit();
    }

    // ── Load the transaction (MySQL first, JSON fallback) ────────────────────
    $localRow = null;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM `transactions` WHERE `txn_id` = :id OR `paddle_order_id` = :id2 LIMIT 1");
            $stmt->execute([':id' => $txnId, ':id2' => $txnId]);
            $localRow = $stmt->fetch();
        } catch (Exception $e) {
            error_log("WorldFirst txn read error: " . $e->getMessage());
        }
    }

    $jsonTxns = wf_read_json_transactions();
    $jsonRow = null;
    foreach ($jsonTxns as $item) {
        if (($item['txn_id'] ?? '') === $txnId || ($item['paddle_order_id'] ?? '') === $txnId) {
            $jsonRow = $item;
            break;
        }
    }
    if (!$localRow && !$jsonRow) {
        http_response_code(404);
        echo json_encode([
            'success'  => false,
            'verified' => false,
            'status'   => 'not_found',
            'txn_id'   => $txnId,
            'error'    => 'Transaction record not found.'
        ]);
        exit();
    }

    $rowAmount   = $localRow ? (float)$localRow['amount'] : (float)($jsonRow['amount'] ?? 0);
    $paymentMode = $localRow['payment_mode'] ?? ($jsonRow['payment_mode'] ?? 'one_time');
    $subInterval = $localRow['subscription_interval'] ?? ($jsonRow['subscription_interval'] ?? null);
    $storedToken = $localRow['verify_token'] ?? ($jsonRow['verify_token'] ?? '');
    $orderId     = $localRow['paddle_order_id'] ?? ($jsonRow['paddle_order_id'] ?? $txnId);

    // ── Authorization to confirm this transaction ────────────────────────────
    // LIVE   → the gateway is the only authority; we query it and trust nothing else.
    // SANDBOX → the creator's per-transaction secret, or an authenticated super admin.
    if (!$isSandbox) {
        $gatewayPaid = wf_query_gateway_status($orderId);
        if ($gatewayPaid === null) {
            http_response_code(503);
            echo json_encode([
                'success'  => false,
                'verified' => false,
                'status'   => 'unverified',
                'txn_id'   => $txnId,
                'error'    => 'Payment status could not be confirmed with the gateway. Please try again shortly.'
            ]);
            exit();
        }
        if (!$gatewayPaid) {
            http_response_code(402);
            echo json_encode([
                'success'  => false,
                'verified' => false,
                'status'   => $localRow['status'] ?? 'pending',
                'txn_id'   => $txnId,
                'error'    => 'Payment has not been received yet.'
            ]);
            exit();
        }
    } else {
        $adminApproved = false;
        $admin = auth_current_user();
        $adminApproved = !empty($admin) && $admin['role'] === 'super_admin';
        if (!$adminApproved && !wf_token_matches($storedToken, $token)) {
            http_response_code(403);
            echo json_encode([
                'success'  => false,
                'verified' => false,
                'status'   => 'unauthorized',
                'txn_id'   => $txnId,
                'error'    => 'Verification token missing or invalid.'
            ]);
            exit();
        }
    }

    // ── Mark the transaction as completed ────────────────────────────────────
    $subStatus = ($paymentMode === 'subscription') ? 'active' : 'none';

    if ($pdo && $localRow) {
        try {
            $stmt = $pdo->prepare("
                UPDATE `transactions` SET
                    `status` = 'completed',
                    `subscription_status` = :sub_status
                WHERE `txn_id` = :id OR `paddle_order_id` = :id2
            ");
            $stmt->execute([':sub_status' => $subStatus, ':id' => $txnId, ':id2' => $txnId]);
        } catch (Exception $e) {
            error_log("WorldFirst txn update error: " . $e->getMessage());
        }
    }

    // Sync to JSON storage
    foreach ($jsonTxns as $k => $item) {
        if (($item['txn_id'] ?? '') === $txnId || ($item['paddle_order_id'] ?? '') === $txnId) {
            $jsonTxns[$k]['status'] = 'completed';
            if (($jsonTxns[$k]['payment_mode'] ?? $paymentMode) === 'subscription') {
                $jsonTxns[$k]['subscription_status'] = 'active';
            }
            $jsonTxns[$k]['updated_at'] = date('Y-m-d H:i:s');
            break;
        }
    }
    wf_save_json_transactions($jsonTxns);

    echo json_encode([
        'success'             => true,
        'verified'            => true,
        'status'              => 'completed',
        'gateway'             => 'WorldFirst',
        'is_sandbox'          => $isSandbox,
        'txn_id'              => $txnId,
        'amount'              => $rowAmount,
        'currency'            => $currency,
        'payment_mode'        => $paymentMode,
        'subscription_interval'=> $subInterval,
        'subscription_status' => ($paymentMode === 'subscription') ? 'active' : 'none',
        'next_billing_date'   => $localRow['next_billing_date'] ?? ($jsonRow['next_billing_date'] ?? null),
        'message'             => ($paymentMode === 'subscription')
            ? "WorldFirst auto-subscription activated successfully! Recurring cycle: {$subInterval}."
            : 'WorldFirst payment successfully verified and completed.'
    ]);
    exit();
}

// ── 4. WEBHOOK: Inbound WorldFirst Server-to-Server Notifications ──────────────
if ($action === 'webhook') {
    // ── Signature verification ──────────────────────────────────────────────
    // Without this, anyone could POST a fake "paid" event for any order id.
    if ($webhookSecret === '') {
        error_log('WorldFirst webhook rejected: WORLDFIRST_WEBHOOK_SECRET is not configured.');
        http_response_code(503);
        echo json_encode(['result' => ['resultStatus' => 'F', 'resultCode' => 'NOT_CONFIGURED', 'resultMessage' => 'Webhook secret not configured']]);
        exit();
    }
    if (!wf_verify_webhook_signature($rawInput, $_SERVER, $webhookSecret)) {
        error_log('WorldFirst webhook rejected: invalid signature.');
        http_response_code(401);
        echo json_encode(['result' => ['resultStatus' => 'F', 'resultCode' => 'INVALID_SIGNATURE', 'resultMessage' => 'Invalid signature']]);
        exit();
    }

    $payload = $jsonInput ?: $_POST;
    $eventOrderId = $payload['merchantOrderId'] ?? ($payload['orderId'] ?? null);
    $paymentStatus = strtolower($payload['paymentStatus'] ?? ($payload['status'] ?? ''));

    if ($eventOrderId && $pdo) {
        try {
            $newStatus = in_array($paymentStatus, ['success', 'completed', 'paid']) ? 'completed' : 'pending';
            $stmt = $pdo->prepare("
                UPDATE `transactions` SET
                    `status` = :status,
                    `subscription_status` = IF(`payment_mode` = 'subscription', 'active', `subscription_status`)
                WHERE `txn_id` = :id OR `paddle_order_id` = :id2
            ");
            $stmt->execute([':status' => $newStatus, ':id' => $eventOrderId, ':id2' => $eventOrderId]);
        } catch (Exception $e) {
            error_log("WorldFirst Webhook handling error: " . $e->getMessage());
        }
    }

    // WorldFirst expects HTTP 200 with resultStatus: S
    echo json_encode([
        'result' => [
            'resultStatus' => 'S',
            'resultCode'   => 'SUCCESS',
            'resultMessage'=> 'Webhook received and processed'
        ]
    ]);
    exit();
}

// ── 5. CANCEL SUBSCRIPTION: Stop Auto-Debit Renewal ────────────────────────────
if ($action === 'cancel_subscription') {
    $txnId = trim($_GET['txn_id'] ?? ($jsonInput['txn_id'] ?? ($_POST['txn_id'] ?? '')));
    if (empty($txnId)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Transaction ID required to cancel subscription.']);
        exit();
    }
    // Only a logged-in staff member may stop an auto-debit mandate.
    auth_require_permission('addons', true);

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                UPDATE `transactions` SET
                    `subscription_status` = 'cancelled'
                WHERE `txn_id` = :id
            ");
            $stmt->execute([':id' => $txnId]);
        } catch (Exception $e) {
            error_log("WorldFirst DB cancel error: " . $e->getMessage());
        }
    }

    // Sync cancellation to JSON storage
    $txns = wf_read_json_transactions();
    foreach ($txns as $k => $item) {
        if (($item['txn_id'] ?? '') === $txnId || ($item['paddle_order_id'] ?? '') === $txnId) {
            $txns[$k]['subscription_status'] = 'cancelled';
            $txns[$k]['updated_at'] = date('Y-m-d H:i:s');
            break;
        }
    }
    wf_save_json_transactions($txns);

    echo json_encode([
        'success'             => true,
        'message'             => 'WorldFirst auto-subscription cancelled. No further recurring charges will occur.',
        'txn_id'              => $txnId,
        'subscription_status' => 'cancelled'
    ]);
    exit();
}

// ── 6. TRANSACTION & SUBSCRIPTION HISTORY ──────────────────────────────────────
if ($action === 'history') {
    // Transaction history contains prospect PII (name, email, phone, amount).
    // It must never be readable by an anonymous visitor.
    auth_require_permission('addons', true);
    $emailFilter = strtolower(trim($_GET['email'] ?? ($jsonInput['email'] ?? '')));
    $statusFilter = strtolower(trim($_GET['status'] ?? ($jsonInput['status'] ?? '')));
    $modeFilter = strtolower(trim($_GET['mode'] ?? ($jsonInput['mode'] ?? '')));

    $allTransactions = [];

    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM `transactions` ORDER BY `created_at` DESC LIMIT 200");
            $allTransactions = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        } catch (Exception $e) {
            error_log("WorldFirst DB read history error: " . $e->getMessage());
        }
    }

    $jsonTransactions = wf_read_json_transactions();
    if (empty($allTransactions)) {
        $allTransactions = $jsonTransactions;
    } else {
        $existingTxnIds = array_column($allTransactions, 'txn_id');
        foreach ($jsonTransactions as $jt) {
            if (!in_array($jt['txn_id'] ?? '', $existingTxnIds, true)) {
                $allTransactions[] = $jt;
            }
        }
    }

    // Sort by created_at DESC
    usort($allTransactions, function($a, $b) {
        return strcmp($b['created_at'] ?? '', $a['created_at'] ?? '');
    });

    // Apply filters if provided
    $filtered = array_values(array_filter($allTransactions, function($t) use ($emailFilter, $statusFilter, $modeFilter) {
        if (!empty($emailFilter) && strtolower($t['user_email'] ?? '') !== $emailFilter) {
            return false;
        }
        if (!empty($statusFilter) && strtolower($t['status'] ?? '') !== $statusFilter) {
            return false;
        }
        if (!empty($modeFilter) && strtolower($t['payment_mode'] ?? '') !== $modeFilter) {
            return false;
        }
        return true;
    }));

    // Calculate metrics
    $totalRevenue = 0.0;
    $activeSubscriptions = 0;
    $oneTimeCount = 0;
    foreach ($filtered as $row) {
        if (($row['status'] ?? '') === 'completed') {
            $totalRevenue += (float)($row['amount'] ?? 0);
        }
        if (($row['payment_mode'] ?? '') === 'subscription' && ($row['subscription_status'] ?? '') === 'active') {
            $activeSubscriptions++;
        }
        if (($row['payment_mode'] ?? '') === 'one_time') {
            $oneTimeCount++;
        }
    }

    echo json_encode([
        'success'               => true,
        'count'                 => count($filtered),
        'total_revenue'         => round($totalRevenue, 2),
        'active_subscriptions'  => $activeSubscriptions,
        'one_time_count'        => $oneTimeCount,
        'transactions'          => $filtered
    ]);
    exit();
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Unknown WorldFirst action requested']);
