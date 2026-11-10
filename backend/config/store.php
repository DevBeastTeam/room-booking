<?php
/**
 * ==============================================================================
 * Monar Pass Apartments - JSON Fallback Store
 * ==============================================================================
 * Every CMS endpoint writes to MySQL first and mirrors to a JSON file under
 * backend/data/. This helper centralises that fallback so a transient database
 * outage degrades the page instead of throwing a 500 at the visitor.
 *
 *   $rows = mp_store_rows('legal_pages');   // read a collection
 *   mp_store_write('legal_pages', $rows);   // write a collection
 * ==============================================================================
 */

if (!function_exists('mp_store_dir')) {
    /** Directory holding the JSON mirrors. */
    function mp_store_dir() {
        $dir = dirname(__DIR__) . '/data';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }
}

if (!function_exists('mp_store_path')) {
    function mp_store_path($name) {
        return mp_store_dir() . '/' . preg_replace('/[^a-z0-9_\-]/i', '', (string)$name) . '.json';
    }
}

if (!function_exists('mp_store_read')) {
    /**
     * Read a JSON mirror.
     * @return array|mixed the decoded value, or $default when unreadable
     */
    function mp_store_read($name, $default = []) {
        $path = mp_store_path($name);
        if (!file_exists($path)) return $default;
        $raw = @file_get_contents($path);
        if ($raw === false || trim((string)$raw) === '') return $default;
        $data = json_decode($raw, true);
        if ($data === null) return $default;
        return $data;
    }
}

if (!function_exists('mp_store_rows')) {
    /** Read a JSON mirror as a list of rows. */
    function mp_store_rows($name) {
        $data = mp_store_read($name, []);
        return is_array($data) ? array_values($data) : [];
    }
}

if (!function_exists('mp_store_write')) {
    /** Write a JSON mirror. Returns true on success. */
    function mp_store_write($name, $data) {
        $path = mp_store_path($name);
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if ($json === false) return false;
        $ok = @file_put_contents($path, $json);
        if ($ok !== false) {
            @chmod($path, 0644);
        }
        return $ok !== false;
    }
}

if (!function_exists('mp_store_upsert')) {
    /**
     * Insert or replace a row in a mirrored collection, keyed by $keyField.
     *
     * @param string $name     collection name
     * @param array  $row      the row to store
     * @param string $keyField the field that identifies a row
     */
    function mp_store_upsert($name, array $row, $keyField = 'id') {
        $rows = mp_store_rows($name);
        $key  = $row[$keyField] ?? null;
        $found = false;
        foreach ($rows as $i => $existing) {
            if ((string)($existing[$keyField] ?? '') === (string)$key) {
                $rows[$i] = array_merge($existing, $row);
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($rows, $row);
        }
        mp_store_write($name, $rows);
        return $row;
    }
}

if (!function_exists('mp_store_delete')) {
    /** Delete rows from a mirrored collection where $keyField matches $key. */
    function mp_store_delete($name, $key, $keyField = 'id') {
        $rows = mp_store_rows($name);
        $kept = array_values(array_filter($rows, function ($r) use ($key, $keyField) {
            return (string)($r[$keyField] ?? '') !== (string)$key;
        }));
        mp_store_write($name, $kept);
        return count($kept);
    }
}
