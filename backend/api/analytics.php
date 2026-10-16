<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Analytics API (Visitor tracking + event records)
 * ==============================================================================
 * Public actions (no auth):
 *   track      { type, path, visitor_id, meta }   -> record visit / buy click
 *
 * Super admin actions:
 *   stats      { from, to, type }                 -> dashboard numbers + charts
 *   events     { from, to, type, limit, search }  -> A-Z event log
 *
 * Storage: backend/data/analytics.json (works without MySQL)
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

$dataFile = auth_data_dir() . '/analytics.json';
$MAX_EVENTS = 20000; // keep last N events

const ANALYTICS_TYPES = [
    'pageview', 'buy_click', 'tour_scheduled', 'inquiry', 'paddle_started', 'worldfirst_payment_started',
];

function analytics_load($dataFile) {
    if (!file_exists($dataFile)) return [];
    $parsed = json_decode(file_get_contents($dataFile), true);
    return is_array($parsed) ? $parsed : [];
}

function analytics_save($dataFile, $events) {
    @file_put_contents($dataFile, json_encode($events, JSON_PRETTY_PRINT));
}

function analytics_device($ua) {
    $ua = strtolower($ua ?? '');
    if ($ua === '') return 'unknown';
    if (preg_match('/ipad|tablet|playbook|silk/', $ua)) return 'tablet';
    if (preg_match('/mobi|iphone|android.*mobile|windows phone/', $ua)) return 'mobile';
    return 'desktop';
}

/** Only the developer (super admin) can read analytics */
function analytics_require_super() {
    $u = auth_require_permission();
    if ($u['role'] !== 'super_admin') {
        auth_json_out(false, ['error' => 'Sirf super admin analytics dekh sakta hai.'], 403);
    }
    return $u;
}

$action = $_GET['action'] ?? ($_POST['action'] ?? 'track');

// ── TRACK (public — public pages se hi call hota hai) ──────────────────────────
if ($action === 'track') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];

    $type  = in_array($input['type'] ?? '', ANALYTICS_TYPES, true) ? $input['type'] : 'pageview';
    $path  = substr(trim($input['path'] ?? '/'), 0, 200);
    $visitorId = substr(trim($input['visitor_id'] ?? ''), 0, 64);
    $meta  = is_array($input['meta'] ?? null) ? $input['meta'] : [];

    // Never track admin/dev/internal paths
    if (preg_match('#^/(admin|dev|database)(/|$)#', $path)) {
        auth_json_out(true, ['recorded' => false]);
    }

    if ($visitorId === '') {
        $visitorId = 'anon-' . substr(md5(($_SERVER['REMOTE_ADDR'] ?? '') . ($_SERVER['HTTP_USER_AGENT'] ?? '')), 0, 12);
    }

    $event = [
        'id'          => 'EVT-' . strtoupper(substr(uniqid(), -8)),
        'type'        => $type,
        'ts'          => date('Y-m-d H:i:s'),
        'date'        => date('Y-m-d'),
        'path'        => $path,
        'visitor_id'  => $visitorId,
        'device'      => analytics_device($_SERVER['HTTP_USER_AGENT'] ?? ''),
        'referrer'    => substr((string)($_SERVER['HTTP_REFERER'] ?? ''), 0, 200),
        'meta'        => array_map(fn($v) => is_scalar($v) ? substr((string)$v, 0, 120) : '', $meta),
    ];

    $events = analytics_load($dataFile);
    $events[] = $event;
    if (count($events) > $MAX_EVENTS) {
        $events = array_slice($events, -$MAX_EVENTS);
    }
    analytics_save($dataFile, $events);

    auth_json_out(true, ['recorded' => true, 'id' => $event['id']]);
}

// ── STATS (super admin) ────────────────────────────────────────────────────────
if ($action === 'stats') {
    analytics_require_super();

    $from = $_GET['from'] ?? date('Y-m-d', strtotime('-30 days'));
    $to   = $_GET['to'] ?? date('Y-m-d');
    $typeFilter = $_GET['type'] ?? '';

    $events = analytics_load($dataFile);
    $events = array_values(array_filter($events, function ($e) use ($from, $to, $typeFilter) {
        $d = $e['date'] ?? substr($e['ts'] ?? '', 0, 10);
        if ($d < $from || $d > $to) return false;
        if ($typeFilter !== '' && ($e['type'] ?? '') !== $typeFilter) return false;
        return true;
    }));

    $pageviews = array_values(array_filter($events, fn($e) => $e['type'] === 'pageview'));
    $buyClicks = array_values(array_filter($events, fn($e) => $e['type'] === 'buy_click'));

    // Unique visitors (all events + pageviews)
    $visitors = [];
    foreach ($events as $e) { $visitors[$e['visitor_id'] ?? 'anon'] = true; }
    $buyVisitors = [];
    foreach ($buyClicks as $e) { $buyVisitors[$e['visitor_id'] ?? 'anon'] = true; }

    // Per-day series
    $byDay = [];
    $device = [];
    $topPages = [];
    foreach ($events as $e) {
        $day = $e['date'] ?? substr($e['ts'] ?? '', 0, 10);
        if (!isset($byDay[$day])) $byDay[$day] = ['date' => $day, 'pageview' => 0, 'buy_click' => 0, 'unique' => []];
        $t = $e['type'] ?? 'pageview';
        if (isset($byDay[$day][$t])) $byDay[$day][$t]++;
        $byDay[$day]['unique'][$e['visitor_id'] ?? 'anon'] = true;

        $dev = $e['device'] ?? 'unknown';
        $device[$dev] = ($device[$dev] ?? 0) + 1;

        if ($t === 'pageview') {
            $p = $e['path'] ?? '/';
            $topPages[$p] = ($topPages[$p] ?? 0) + 1;
        }
    }
    $series = array_values(array_map(function ($d) {
        return ['date' => $d['date'], 'pageview' => $d['pageview'], 'buy_click' => $d['buy_click'], 'unique' => count($d['unique'])];
    }, $byDay));
    usort($series, fn($a, $b) => strcmp($a['date'], $b['date']));

    arsort($topPages);
    $topPages = array_slice($topPages, 0, 10, true);

    auth_json_out(true, [
        'from' => $from,
        'to' => $to,
        'totals' => [
            'unique_visitors' => count($visitors),
            'page_views'      => count($pageviews),
            'buy_clicks'      => count($buyClicks),
            'unique_buyers'   => count($buyVisitors),
            'total_events'    => count($events),
        ],
        'series'   => $series,
        'devices'  => $device,
        'topPages' => $topPages,
    ]);
}

// ── EVENTS: A-Z log (super admin) ──────────────────────────────────────────────
if ($action === 'events') {
    analytics_require_super();

    $from = $_GET['from'] ?? date('Y-m-d', strtotime('-90 days'));
    $to   = $_GET['to'] ?? date('Y-m-d');
    $typeFilter = $_GET['type'] ?? '';
    $search = strtolower(trim($_GET['search'] ?? ''));
    $limit = min((int)($_GET['limit'] ?? 200), 1000);

    $events = analytics_load($dataFile);
    $events = array_values(array_filter($events, function ($e) use ($from, $to, $typeFilter, $search) {
        $d = $e['date'] ?? substr($e['ts'] ?? '', 0, 10);
        if ($d < $from || $d > $to) return false;
        if ($typeFilter !== '' && ($e['type'] ?? '') !== $typeFilter) return false;
        if ($search !== '') {
            $haystack = strtolower(($e['path'] ?? '') . ' ' . ($e['visitor_id'] ?? '') . ' ' . json_encode($e['meta'] ?? []));
            if (strpos($haystack, $search) === false) return false;
        }
        return true;
    }));

    // Latest first
    $events = array_reverse($events);
    $total = count($events);
    $events = array_slice($events, 0, $limit);

    auth_json_out(true, [
        'total'  => $total,
        'events' => $events,
    ]);
}

auth_json_out(false, ['error' => 'Unknown action'], 400);
