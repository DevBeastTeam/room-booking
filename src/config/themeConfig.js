/**
 * ============================================================================
 * MONAR PASS APARTMENTS - DUAL LUXURY THEME CONFIGURATION (LIGHT & DARK)
 * ============================================================================
 * 
 * Supports full runtime theme switching between Dark Luxury & Light Luxury,
 * with separate color management for BOTH modes in the Admin Panel.
 *
 * Source of truth is the MySQL `theme_config` table (via /backend/api/theme.php).
 * localStorage is only a cache so the very first paint is not blank; the async
 * loader below always reconciles the cache with the database.
 * ============================================================================
 */

import { apiGet, apiPost, getCsrfToken, setCsrfToken } from '../services/apiClient.js';

export const DEFAULT_DARK_PALETTE = {
  mode: 'dark',
  name: 'Obsidian & Champagne Gold (Dark Luxury)',
  // Canvas & Surfaces
  bgPage: '#08090f',
  bgSurface: '#0c101c',
  bgElevated: '#101422',
  cardBg: 'rgba(16, 20, 34, 0.85)',
  // Brand Gold Accents
  primary: '#c9a96e',          // Champagne Gold
  primaryHover: '#dfc285',
  primaryDark: '#9a7a44',
  primaryLight: 'rgba(201, 169, 110, 0.15)',
  primaryBorder: 'rgba(201, 169, 110, 0.3)',
  secondary: '#dfc285',        // Soft Gold / Amber
  secondaryHover: '#f4efe6',
  secondaryDark: '#b5a898',
  // Typography
  textMain: '#f4efe6',         // Warm Cream
  textMuted: '#b5a999',        // Soft Warm Taupe
  textLight: '#8c8273',
  // Outlines & Dividers
  border: 'rgba(201, 169, 110, 0.25)',
  glassBorder: 'rgba(201, 169, 110, 0.15)',
  // Navigation
  navBg: 'rgba(8, 9, 15, 0.95)',
  navOverlayBg: 'rgba(8, 9, 15, 0.98)',
  navText: '#f4efe6',
  // Badges & Buttons
  btnBg: '#c9a96e',
  btnText: '#08090f',
  promoBanner: '#c9a96e',
  promoButton: '#0c101c',
};

export const DEFAULT_LIGHT_PALETTE = {
  mode: 'light',
  name: 'Warm Alabaster & Antique Gold (Light Luxury)',
  // Canvas & Surfaces
  bgPage: '#fbf9f5',           // Soft Alabaster Silk
  bgSurface: '#ffffff',        // Crisp Pearl Porcelain
  bgElevated: '#f4efe6',       // Warm Ivory
  cardBg: 'rgba(255, 255, 255, 0.94)',
  // Brand Gold Accents
  primary: '#a47c2a',          // Deep Antique Gold (rich contrast on light)
  primaryHover: '#876219',
  primaryDark: '#6b4c10',
  primaryLight: 'rgba(164, 124, 42, 0.12)',
  primaryBorder: 'rgba(164, 124, 42, 0.28)',
  secondary: '#b8860b',        // Dark Goldenrod
  secondaryHover: '#332306',
  secondaryDark: '#664604',
  // Typography
  textMain: '#181b22',         // Deep Obsidian Charcoal
  textMuted: '#586072',        // Sophisticated Slate
  textLight: '#7e8799',
  // Outlines & Dividers
  border: 'rgba(164, 124, 42, 0.22)',
  glassBorder: 'rgba(164, 124, 42, 0.16)',
  // Navigation
  navBg: 'rgba(251, 249, 245, 0.96)',
  navOverlayBg: 'rgba(251, 249, 245, 0.98)',
  navText: '#181b22',
  // Badges & Buttons
  btnBg: '#a47c2a',
  btnText: '#ffffff',
  promoBanner: '#a47c2a',
  promoButton: '#ffffff',
};

export const THEME_MODE_KEY = 'monarch_theme_mode';
export const THEME_PALETTES_KEY = 'monarch_theme_palettes';
export const THEME_STORAGE_KEY = 'monarch_custom_theme_config'; // backward compatibility

const THEME_API_URL = '/backend/api/theme.php';
const AUTH_SESSION_URL = '/backend/api/auth.php';

// In-memory cache of the last known palettes (DB > localStorage > defaults).
// getPalettes() stays synchronous for render paths; loadPalettesFromServer()
// refreshes this cache from the database.
let cachedPalettes = null;
let serverLoadPromise = null;

function defaultPalettes() {
  return { dark: { ...DEFAULT_DARK_PALETTE }, light: { ...DEFAULT_LIGHT_PALETTE } };
}

/** Reads the palettes cached in localStorage (offline / first-paint fallback). */
function readStoredPalettes() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(THEME_PALETTES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      dark: { ...DEFAULT_DARK_PALETTE, ...(parsed.dark || {}) },
      light: { ...DEFAULT_LIGHT_PALETTE, ...(parsed.light || {}) },
    };
  } catch {
    return null;
  }
}

/**
 * Legacy DB shape → full palette pair.
 * The `theme_config` table may contain { theme, colors: { primary, primaryDark,
 * accent, bgDark, cardBg, cardHover, border } } (written by the data manager).
 */
function legacyColorsToPalettes(colors) {
  const c = colors && typeof colors === 'object' ? colors : {};
  const primary = c.primary || DEFAULT_DARK_PALETTE.primary;
  const accent = c.accent || DEFAULT_DARK_PALETTE.secondary;
  const primaryDark = c.primaryDark || adjustHexBrightness(primary, -20);
  const bgDark = c.bgDark || DEFAULT_DARK_PALETTE.bgPage;
  const cardBg = c.cardBg || DEFAULT_DARK_PALETTE.cardBg;
  const cardHover = c.cardHover || DEFAULT_DARK_PALETTE.bgElevated;
  const border = c.border || DEFAULT_DARK_PALETTE.border;

  const darkTones = generateHarmoniousPalette(primary, accent, 'dark');
  const dark = {
    ...DEFAULT_DARK_PALETTE,
    ...darkTones,
    primary,
    primaryDark,
    secondary: accent,
    bgPage: bgDark,
    bgSurface: c.bgSurface || bgDark,
    bgElevated: cardHover,
    cardBg,
    border,
    glassBorder: c.glassBorder || border,
    navBg: c.navBg || bgDark,
    navOverlayBg: c.navOverlayBg || bgDark,
    navText: DEFAULT_DARK_PALETTE.navText,
    textMain: DEFAULT_DARK_PALETTE.textMain,
    textMuted: DEFAULT_DARK_PALETTE.textMuted,
    textLight: DEFAULT_DARK_PALETTE.textLight,
    btnBg: primary,
    btnText: DEFAULT_DARK_PALETTE.btnText,
    promoBanner: primary,
    promoButton: DEFAULT_DARK_PALETTE.promoButton,
  };

  // A light palette needs a darker primary/accent to stay readable on a pale canvas.
  const lightPrimary = c.primaryLight || adjustHexBrightness(primary, -30);
  const lightAccent = c.accentLight || adjustHexBrightness(accent, -25);
  const lightTones = generateHarmoniousPalette(lightPrimary, lightAccent, 'light');

  const light = {
    ...DEFAULT_LIGHT_PALETTE,
    ...lightTones,
    primary: lightPrimary,
    secondary: lightAccent,
    bgPage: c.bgLight || DEFAULT_LIGHT_PALETTE.bgPage,
    bgSurface: c.bgSurfaceLight || DEFAULT_LIGHT_PALETTE.bgSurface,
    bgElevated: c.bgElevatedLight || DEFAULT_LIGHT_PALETTE.bgElevated,
    cardBg: c.cardBgLight || DEFAULT_LIGHT_PALETTE.cardBg,
    border: c.borderLight || lightTones.border,
    glassBorder: c.glassBorderLight || lightTones.glassBorder,
    navBg: DEFAULT_LIGHT_PALETTE.navBg,
    navOverlayBg: DEFAULT_LIGHT_PALETTE.navOverlayBg,
    navText: DEFAULT_LIGHT_PALETTE.navText,
    textMain: DEFAULT_LIGHT_PALETTE.textMain,
    textMuted: DEFAULT_LIGHT_PALETTE.textMuted,
    textLight: DEFAULT_LIGHT_PALETTE.textLight,
    btnBg: lightPrimary,
    btnText: DEFAULT_LIGHT_PALETTE.btnText,
    promoBanner: lightPrimary,
    promoButton: DEFAULT_LIGHT_PALETTE.promoButton,
  };

  return { dark, light };
}

/**
 * Normalises whatever the backend returns into a { dark, light } palette pair.
 * Returns null when the payload carries no usable theme data.
 */
function normalizeServerPalettes(payload) {
  if (!payload || typeof payload !== 'object') return null;

  // theme.php returns { success:false, message:'Default theme active' } when the
  // table has no row yet → treat it as "no theme stored".
  if (payload.success === false && !payload.dark && !payload.light && !payload.colors) {
    return null;
  }

  if (payload.dark || payload.light) {
    return {
      dark: { ...DEFAULT_DARK_PALETTE, ...(payload.dark || {}) },
      light: { ...DEFAULT_LIGHT_PALETTE, ...(payload.light || {}) },
    };
  }

  if (payload.colors && typeof payload.colors === 'object') {
    return legacyColorsToPalettes(payload.colors);
  }

  return null;
}

/**
 * Ensures a CSRF token is available before a mutating request.
 * The token is normally set at login (AdminGate) — this is just a safety net.
 */
async function ensureCsrfToken() {
  const existing = getCsrfToken();
  if (existing) return existing;
  try {
    const { ok, data } = await apiGet(AUTH_SESSION_URL, { action: 'session' });
    if (ok && data && data.csrf_token) {
      setCsrfToken(data.csrf_token);
      return data.csrf_token;
    }
  } catch {
    /* offline — the request will simply be rejected by the backend */
  }
  return null;
}

/**
 * Dispatches a custom event and replays it a couple of times.
 * Astro islands hydrate asynchronously, so a listener may register after the
 * server response arrived — the replay keeps those listeners in sync.
 */
function emitUpdate(eventName, detail) {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    [250, 1000].forEach(delay => {
      setTimeout(() => {
        try {
          window.dispatchEvent(new CustomEvent(eventName, { detail }));
        } catch { /* window torn down */ }
      }, delay);
    });
  } catch { /* CustomEvent unavailable */ }
}

/**
 * Returns active theme mode ('dark' or 'light')
 */
export function getThemeMode() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const mode = localStorage.getItem(THEME_MODE_KEY);
    return mode === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * Sets active theme mode ('dark' or 'light') and applies to DOM
 */
export function setThemeMode(mode) {
  if (typeof window === 'undefined') return mode;
  const targetMode = mode === 'light' ? 'light' : 'dark';
  try {
    localStorage.setItem(THEME_MODE_KEY, targetMode);
  } catch {}
  applyThemeToDOM(undefined, targetMode);
  window.dispatchEvent(new CustomEvent('theme-mode-changed', { detail: { mode: targetMode } }));
  return targetMode;
}

/**
 * Toggles between 'dark' and 'light'
 */
export function toggleThemeMode() {
  const current = getThemeMode();
  const next = current === 'dark' ? 'light' : 'dark';
  return setThemeMode(next);
}

/**
 * Retrieves palettes for both dark and light modes.
 *
 * Synchronous (used inside render paths) → returns the last known palettes:
 *   1. the cache filled by loadPalettesFromServer() (database),
 *   2. the localStorage cache,
 *   3. the hardcoded defaults.
 * Call loadPalettesFromServer() to refresh the cache from the database.
 */
export function getPalettes() {
  if (typeof window === 'undefined') {
    return defaultPalettes();
  }
  if (cachedPalettes) {
    return {
      dark: { ...cachedPalettes.dark },
      light: { ...cachedPalettes.light },
    };
  }
  const stored = readStoredPalettes();
  if (stored) {
    cachedPalettes = stored;
    return { dark: { ...stored.dark }, light: { ...stored.light } };
  }
  return defaultPalettes();
}

/**
 * Loads the palettes from the database (GET /backend/api/theme.php — public),
 * merges them with the defaults, caches them in localStorage, re-applies the
 * theme to the DOM and notifies listeners via the 'theme-updated' event.
 *
 * @returns {Promise<{dark:object,light:object}|null>} the merged palettes or null
 */
export async function loadPalettesFromServer() {
  if (typeof window === 'undefined') return null;
  if (serverLoadPromise) return serverLoadPromise;

  serverLoadPromise = (async () => {
    try {
      const { ok, data } = await apiGet(THEME_API_URL);
      if (!ok || !data) return null;

      const normalized = normalizeServerPalettes(data);
      if (!normalized) return null;

      const merged = {
        dark: { ...DEFAULT_DARK_PALETTE, ...normalized.dark },
        light: { ...DEFAULT_LIGHT_PALETTE, ...normalized.light },
      };

      cachedPalettes = merged;
      try {
        localStorage.setItem(THEME_PALETTES_KEY, JSON.stringify(merged));
      } catch { /* storage unavailable — the in-memory cache is enough */ }

      applyThemeToDOM(merged, getThemeMode());
      emitUpdate('theme-updated', merged);
      return merged;
    } catch (err) {
      console.debug('Theme load from server failed:', err);
      return null;
    } finally {
      serverLoadPromise = null;
    }
  })();

  return serverLoadPromise;
}

/**
 * Saves both palettes and updates DOM
 */
export function savePalettes(palettes) {
  if (typeof window === 'undefined') return false;
  try {
    const merged = {
      dark: { ...DEFAULT_DARK_PALETTE, ...((palettes && palettes.dark) || {}) },
      light: { ...DEFAULT_LIGHT_PALETTE, ...((palettes && palettes.light) || {}) },
    };
    localStorage.setItem(THEME_PALETTES_KEY, JSON.stringify(merged));
    cachedPalettes = merged;
    applyThemeToDOM(merged, getThemeMode());
    window.dispatchEvent(new CustomEvent('theme-updated', { detail: merged }));
    syncPalettesToBackend(merged);
    return true;
  } catch (err) {
    console.error('Failed to save theme palettes:', err);
    return false;
  }
}

// Palettes MySQL (theme_config table) par bhi save karo.
// GET theme.php public hai (login zaroori nahi), lekin POST ke liye admin
// session + 'theme' permission + valid CSRF token chahiye.
async function syncPalettesToBackend(merged) {
  try {
    await ensureCsrfToken();
    const { ok, data } = await apiPost(THEME_API_URL, merged);
    if (!ok) {
      console.debug('Theme backend sync note:', (data && (data.error || data.message)) || 'not authorised');
    }
  } catch (err) {
    console.debug('Theme backend sync error:', err);
  }
}

/**
 * Resets both palettes back to original defaults
 */
export function resetPalettes() {
  if (typeof window === 'undefined') return defaultPalettes();
  try {
    localStorage.removeItem(THEME_PALETTES_KEY);
    const defaults = defaultPalettes();
    cachedPalettes = defaults;
    applyThemeToDOM(defaults, getThemeMode());
    window.dispatchEvent(new CustomEvent('theme-updated', { detail: defaults }));
    syncPalettesToBackend(defaults);
    return defaults;
  } catch {
    return defaultPalettes();
  }
}

/**
 * Injects CSS custom properties for active mode + individual mode scopes
 */
export function applyThemeToDOM(palettesInput, modeInput) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const mode = modeInput || getThemeMode();
  const palettes = palettesInput || getPalettes();
  const active = mode === 'light' ? palettes.light : palettes.dark;
  const dark = palettes.dark;
  const light = palettes.light;

  // Set data-theme attribute on root
  root.setAttribute('data-theme', mode);

  // Active theme variables
  root.style.setProperty('--theme-mode', mode);
  root.style.setProperty('--bg-page', active.bgPage);
  root.style.setProperty('--bg-surface', active.bgSurface);
  root.style.setProperty('--bg-elevated', active.bgElevated);
  root.style.setProperty('--card-bg', active.cardBg);

  root.style.setProperty('--primary-color', active.primary);
  root.style.setProperty('--primary-hover', active.primaryHover);
  root.style.setProperty('--primary-dark', active.primaryDark);
  root.style.setProperty('--primary-light', active.primaryLight);
  root.style.setProperty('--primary-border', active.primaryBorder);

  root.style.setProperty('--secondary-color', active.secondary);
  root.style.setProperty('--secondary-hover', active.secondaryHover);
  root.style.setProperty('--secondary-dark', active.secondaryDark);

  root.style.setProperty('--text-main', active.textMain);
  root.style.setProperty('--text-muted', active.textMuted);
  root.style.setProperty('--text-light', active.textLight);

  root.style.setProperty('--border-color', active.border);
  root.style.setProperty('--card-border', active.border);
  root.style.setProperty('--glass-border', active.glassBorder);

  root.style.setProperty('--nav-bg', active.navBg);
  root.style.setProperty('--nav-overlay-bg', active.navOverlayBg);
  root.style.setProperty('--nav-text', active.navText);

  root.style.setProperty('--footer-bg', mode === 'light' ? active.bgElevated : '#06070c');
  root.style.setProperty('--modal-bg', active.bgSurface);
  root.style.setProperty('--input-bg', mode === 'light' ? '#ffffff' : 'rgba(12, 16, 28, 0.9)');
  root.style.setProperty('--input-border', active.border);
  root.style.setProperty('--card-inner-bg', mode === 'light' ? 'rgba(244, 239, 230, 0.7)' : 'rgba(12, 16, 28, 0.85)');
  root.style.setProperty(
    '--hero-gradient',
    mode === 'light'
      ? 'linear-gradient(rgba(251, 249, 245, 0.85), rgba(244, 239, 230, 0.94))'
      : 'linear-gradient(rgba(8, 9, 15, 0.82), rgba(8, 9, 15, 0.92))'
  );

  root.style.setProperty('--btn-gold-bg', `linear-gradient(135deg, ${active.primary} 0%, ${active.primaryDark || active.primary} 100%)`);
  root.style.setProperty('--btn-gold-text', active.btnText || (mode === 'light' ? '#ffffff' : '#08090f'));

  root.style.setProperty('--promo-banner', active.promoBanner);
  root.style.setProperty('--promo-button', active.promoButton);

  // Scoped variables for dark mode
  root.style.setProperty('--dark-bg-page', dark.bgPage);
  root.style.setProperty('--dark-bg-surface', dark.bgSurface);
  root.style.setProperty('--dark-bg-elevated', dark.bgElevated);
  root.style.setProperty('--dark-card-bg', dark.cardBg);
  root.style.setProperty('--dark-primary', dark.primary);
  root.style.setProperty('--dark-text-main', dark.textMain);
  root.style.setProperty('--dark-text-muted', dark.textMuted);
  root.style.setProperty('--dark-border', dark.border);

  // Scoped variables for light mode
  root.style.setProperty('--light-bg-page', light.bgPage);
  root.style.setProperty('--light-bg-surface', light.bgSurface);
  root.style.setProperty('--light-bg-elevated', light.bgElevated);
  root.style.setProperty('--light-card-bg', light.cardBg);
  root.style.setProperty('--light-primary', light.primary);
  root.style.setProperty('--light-text-main', light.textMain);
  root.style.setProperty('--light-text-muted', light.textMuted);
  root.style.setProperty('--light-border', light.border);
}

// ── Backward-Compatibility Shims ──────────────────────────────────────────────
export const THEME_CONFIG = DEFAULT_DARK_PALETTE;

export function getStoredTheme() {
  const mode = getThemeMode();
  const palettes = getPalettes();
  return mode === 'light' ? palettes.light : palettes.dark;
}

export function saveStoredTheme(colors) {
  const mode = getThemeMode();
  const palettes = getPalettes();
  palettes[mode] = { ...palettes[mode], ...colors };
  return savePalettes(palettes);
}

export function resetStoredTheme() {
  resetPalettes();
  return getStoredTheme();
}

/**
 * Utility: Adjust hex brightness by percentage (-100 to 100)
 */
export function adjustHexBrightness(hex, percent) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

/**
 * Utility: Convert hex color to rgba string
 */
export function hexToRgba(hex, alpha = 0.98) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return hex;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Utility: Automatically generates a full, balanced palette of shades
 * for either dark or light mode given primary and secondary color hex codes.
 */
export function generateHarmoniousPalette(primaryHex, secondaryHex, mode = 'dark') {
  const p = primaryHex || (mode === 'light' ? '#a47c2a' : '#c9a96e');
  const s = secondaryHex || (mode === 'light' ? '#b8860b' : '#dfc285');

  if (mode === 'light') {
    return {
      primary: p,
      primaryHover: adjustHexBrightness(p, -15),
      primaryDark: adjustHexBrightness(p, -30),
      primaryLight: hexToRgba(p, 0.12),
      primaryBorder: hexToRgba(p, 0.28),
      secondary: s,
      secondaryHover: adjustHexBrightness(s, -15),
      secondaryDark: adjustHexBrightness(s, -30),
      border: hexToRgba(p, 0.22),
      glassBorder: hexToRgba(p, 0.16),
      btnBg: p,
      btnText: '#ffffff',
      promoBanner: p,
      promoButton: '#ffffff',
    };
  }

  return {
    primary: p,
    primaryHover: adjustHexBrightness(p, 12),
    primaryDark: adjustHexBrightness(p, -20),
    primaryLight: hexToRgba(p, 0.15),
    primaryBorder: hexToRgba(p, 0.3),
    secondary: s,
    secondaryHover: adjustHexBrightness(s, 12),
    secondaryDark: adjustHexBrightness(s, -20),
    border: hexToRgba(p, 0.25),
    glassBorder: hexToRgba(p, 0.15),
    btnBg: p,
    btnText: '#08090f',
    promoBanner: p,
    promoButton: '#0c101c',
  };
}

// Automatically apply theme on module load, then reconcile with the database
// so admin palette changes actually reach the public site.
if (typeof window !== 'undefined') {
  applyThemeToDOM();
  loadPalettesFromServer();
}

export default THEME_CONFIG;
