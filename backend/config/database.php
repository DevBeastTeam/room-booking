<?php
/**
 * ==============================================================================
 * Monarch Pass Apartments - Database Configuration & PDO Singleton Helper
 * ==============================================================================
 */

if (!function_exists('loadEnvFile')) {
    function loadEnvFile($envPath = __DIR__ . '/.env') {
        if (!file_exists($envPath)) {
            // Check parent config if path differs
            $altPath = dirname(__DIR__) . '/config/.env';
            if (file_exists($altPath)) {
                $envPath = $altPath;
            } else {
                return [];
            }
        }

        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $env = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }
            $parts = explode('=', $line, 2);
            if (count($parts) === 2) {
                $key = trim($parts[0]);
                $val = trim($parts[1]);
                if ((strpos($val, '"') === 0 && substr($val, -1) === '"') || 
                    (strpos($val, "'") === 0 && substr($val, -1) === "'")) {
                    $val = substr($val, 1, -1);
                }
                $env[$key] = $val;
                if (!isset($_SERVER[$key])) {
                    $_SERVER[$key] = $val;
                }
            }
        }
        return $env;
    }
}

$envVars = loadEnvFile(__DIR__ . '/.env');

if (!defined('DB_HOST')) define('DB_HOST', $envVars['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? 'localhost');
if (!defined('DB_PORT')) define('DB_PORT', $envVars['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? '3306');
if (!defined('DB_NAME')) define('DB_NAME', $envVars['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? 'roombookingdb');
if (!defined('DB_USER')) define('DB_USER', $envVars['DB_USER'] ?? $_SERVER['DB_USER'] ?? 'root');
if (!defined('DB_PASS')) define('DB_PASS', $envVars['DB_PASS'] ?? $_SERVER['DB_PASS'] ?? 'root');
if (!defined('DB_CHARSET')) define('DB_CHARSET', $envVars['DB_CHARSET'] ?? $_SERVER['DB_CHARSET'] ?? 'utf8mb4');

/**
 * Returns an active PDO instance, or null if MySQL is not reachable.
 */
function getDatabaseConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_PORT,
        DB_NAME,
        DB_CHARSET
    );

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci',
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log('Database Connection Error: ' . $e->getMessage());
        return null;
    }
}
