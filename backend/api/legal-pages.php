<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - Legal Pages CMS API
 * ==============================================================================
 * Reads are public (the CMS content is shown to visitors); writes need the
 * 'pages' permission plus a valid CSRF token.
 *
 * MySQL is the source of truth; backend/data/legal_pages.json mirrors it so a
 * database outage degrades to the last known content instead of a 500.
 * ==============================================================================
 */

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') { http_response_code(200); exit; }

require_once dirname(__DIR__) . '/config/database.php';
require_once dirname(__DIR__) . '/config/store.php';
require_once __DIR__ . '/_auth.php';

auth_send_cors_headers();

// Public legal pages read ho sakti hain, lekin CMS edits 'pages' permission chahti hain
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    auth_require_permission('pages');
    auth_require_csrf_if_mutating();
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$STORE  = 'legal_pages';

/** Normalise a DB row / JSON mirror row to the same shape. */
function legal_page_normalize(array $row) {
    return [
        'slug'        => (string)($row['slug'] ?? ''),
        'title'       => (string)($row['title'] ?? ''),
        'last_updated'=> (string)($row['last_updated'] ?? ($row['lastUpdated'] ?? '')),
        'content'     => (string)($row['content'] ?? ''),
    ];
}

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $slug = $_GET['slug'] ?? null;

    $rows = [];
    $pdo  = getDatabaseConnection();
    if ($pdo) {
        try {
            if ($slug) {
                $stmt = $pdo->prepare("SELECT * FROM `legal_pages` WHERE `slug` = ?");
                $stmt->execute([$slug]);
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $row = legal_page_normalize($row);
                    echo json_encode(['success' => true, 'data' => $row]);
                    exit;
                }
            } else {
                $stmt = $pdo->query("SELECT * FROM `legal_pages` ORDER BY `id` ASC");
                $rows = array_map('legal_page_normalize', $stmt->fetchAll(PDO::FETCH_ASSOC));
                echo json_encode(['success' => true, 'data' => $rows]);
                exit;
            }
        } catch (Exception $e) {
            error_log('legal-pages.php read error: ' . $e->getMessage());
        }
    }

    // ── Fallback: the JSON mirror ─────────────────────────────────────────────
    $mirrored = array_map('legal_page_normalize', mp_store_rows($STORE));
    if ($slug) {
        foreach ($mirrored as $row) {
            if ($row['slug'] === $slug) {
                echo json_encode(['success' => true, 'data' => $row, 'source' => 'json_mirror']);
                exit;
            }
        }
        echo json_encode(['success' => true, 'data' => null, 'source' => 'json_mirror']);
        exit;
    }
    echo json_encode(['success' => true, 'data' => $mirrored, 'source' => 'json_mirror']);
    exit;
}

// ── POST / PUT (upsert) ───────────────────────────────────────────────────────
if ($method === 'POST' || $method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];

    $slug        = (string)($input['slug'] ?? 'terms');
    $title       = (string)($input['title'] ?? 'Legal Page');
    $lastUpdated = (string)($input['lastUpdated'] ?? ($input['last_updated'] ?? date('F Y')));
    $content     = (string)($input['content'] ?? '');

    if ($slug === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'A slug is required.']);
        exit;
    }

    $row = [
        'slug'         => $slug,
        'title'        => $title,
        'last_updated' => $lastUpdated,
        'content'      => $content,
    ];

    $pdo = getDatabaseConnection();
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `legal_pages` (`slug`, `title`, `last_updated`, `content`)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    `title` = VALUES(`title`),
                    `last_updated` = VALUES(`last_updated`),
                    `content` = VALUES(`content`)
            ");
            $stmt->execute([$slug, $title, $lastUpdated, $content]);
            mp_store_upsert($STORE, $row, 'slug');
            echo json_encode(['success' => true, 'slug' => $slug]);
            exit;
        } catch (Exception $e) {
            error_log('legal-pages.php write error: ' . $e->getMessage());
        }
    }

    // Database unavailable → still persist to the mirror so the edit is not lost.
    mp_store_upsert($STORE, $row, 'slug');
    echo json_encode(['success' => true, 'slug' => $slug, 'source' => 'json_mirror']);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
