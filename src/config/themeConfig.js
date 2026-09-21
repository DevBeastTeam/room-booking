/**
 * ============================================================================
 * MONARCH PASS APARTMENTS - DUAL LUXURY THEME CONFIGURATION (LIGHT & DARK)
 * ============================================================================
 * 
 * Supports full runtime theme switching between Dark Luxury & Light Luxury,
 * with separate color management for BOTH modes in the Admin Panel.
 * ============================================================================
 */

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
 * Retrieves palettes for both dark and light modes
 */
export function getPalettes() {
  if (typeof window === 'undefined') {
    return { dark: { ...DEFAULT_DARK_PALETTE }, light: { ...DEFAULT_LIGHT_PALETTE } };
  }
  try {
    const raw = localStorage.getItem(THEME_PALETTES_KEY);
    if (!raw) {
      return { dark: { ...DEFAULT_DARK_PALETTE }, light: { ...DEFAULT_LIGHT_PALETTE } };
    }
    const parsed = JSON.parse(raw);
    return {
      dark: { ...DEFAULT_DARK_PALETTE, ...(parsed.dark || {}) },
      light: { ...DEFAULT_LIGHT_PALETTE, ...(parsed.light || {}) },
    };
  } catch {
    return { dark: { ...DEFAULT_DARK_PALETTE }, light: { ...DEFAULT_LIGHT_PALETTE } };
  }
}

/**
 * Saves both palettes and updates DOM
 */
export function savePalettes(palettes) {
  if (typeof window === 'undefined') return false;
  try {
    const merged = {
      dark: { ...DEFAULT_DARK_PALETTE, ...(palettes.dark || {}) },
      light: { ...DEFAULT_LIGHT_PALETTE, ...(palettes.light || {}) },
    };
    localStorage.setItem(THEME_PALETTES_KEY, JSON.stringify(merged));
    applyThemeToDOM(merged, getThemeMode());
    window.dispatchEvent(new CustomEvent('theme-updated', { detail: merged }));
    return true;
  } catch (err) {
    console.error('Failed to save theme palettes:', err);
    return false;
  }
}

/**
 * Resets both palettes back to original defaults
 */
export function resetPalettes() {
  if (typeof window === 'undefined') return { dark: DEFAULT_DARK_PALETTE, light: DEFAULT_LIGHT_PALETTE };
  try {
    localStorage.removeItem(THEME_PALETTES_KEY);
    const defaults = { dark: { ...DEFAULT_DARK_PALETTE }, light: { ...DEFAULT_LIGHT_PALETTE } };
    applyThemeToDOM(defaults, getThemeMode());
    window.dispatchEvent(new CustomEvent('theme-updated', { detail: defaults }));
    return defaults;
  } catch {
    return { dark: DEFAULT_DARK_PALETTE, light: DEFAULT_LIGHT_PALETTE };
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

// Automatically apply theme on module load
if (typeof window !== 'undefined') {
  applyThemeToDOM();
}

export default THEME_CONFIG;
