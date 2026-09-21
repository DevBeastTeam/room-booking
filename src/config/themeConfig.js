/**
 * ============================================================================
 * MONARCH PASS APARTMENTS - CENTRAL THEME & BRAND COLOR CONFIGURATION
 * ============================================================================
 * 
 * Instructions for Admin / Developers:
 * ------------------------------------
 * You can change ANY color in this file. The entire application (Header,
 * Navigation, Buttons, Badges, Tabs, Modals, Footer, Widgets, and Promo banners)
 * will automatically adopt the new colors!
 * 
 * Example: To change the website's primary theme from Teal to Blue or Burgundy:
 *   - Change `primary`: '#0f766e' -> '#1e40af'
 *   - Change `primaryHover`: '#0d6460' -> '#1d4ed8'
 *   - Change `primaryLight`: '#f0fdfa' -> '#eff6ff'
 * ============================================================================
 */

export const THEME_CONFIG = {
  // Brand Identity
  brandName: 'Monarch Pass Apartments',

  // ── Primary Theme Colors ──
  primary: '#0f766e',            // Main brand color (Deep Teal / Pine)
  primaryHover: '#0d6460',       // Hover state for primary buttons & active items
  primaryDark: '#134e4a',        // Deep shade for high contrast & dark badges
  primaryLight: '#f0fdfa',       // Soft background tint for active tabs & cards
  primaryBorder: '#99f6e4',      // Subtle active border outlines

  // ── Secondary Theme Colors (Signature Accent) ──
  secondary: '#68c7b7',          // Monarch Pass signature aqua teal
  secondaryHover: '#52b6a5',     // Secondary hover state
  secondaryDark: '#3d9c8d',      // Darker secondary variant
  secondaryLight: '#eef9f7',     // Soft tint for alerts & banners
  secondaryMuted: 'rgba(104, 199, 183, 0.22)', // Pill badges & highlights

  // ── Navigation & Overlay Menu ──
  navOverlayBg: '#68c7b7',       // Fullscreen navigation drawer background
  navOverlayBgRgba: 'rgba(104, 199, 183, 0.98)',
  navText: '#ffffff',
  navTextActive: '#ffffff',

  // ── Surface, Backgrounds & Neutrals ──
  dark: '#212529',               // Dark charcoal for footer & header utility elements
  darkSurface: '#1e293b',        // Slate dark for modals & hero card backgrounds
  textMain: '#1e293b',           // Body copy & main headings
  textMuted: '#64748b',          // Secondary text & subtitle labels
  textLight: '#94a3b8',          // Light muted text (footer/dates)
  bgPage: '#ffffff',             // Main document background
  bgSurface: '#f8fafc',          // Container & card background
  borderLight: '#e2e8f0',        // Dividers, input borders, card outlines
  borderMedium: '#cbd5e1',       // Stronger border outlines

  // ── Promotional & Special Accents ──
  promoBanner: '#68c7b7',        // Summer savings banner background & nudge strip
  promoButton: '#0f766e',        // Promotional CTA button
  promoButtonHover: '#0d6460',
  accentAmber: '#f59e0b',        // Warning badges & review stars
  accentGold: '#b45309',         // Admin panel button & highlight badges

  // ── System & Feedback States ──
  success: '#10b981',            // Green success alerts & available indicators
  successLight: '#d1fae5',
  warning: '#f59e0b',            // Amber warning indicators
  warningLight: '#fef3c7',
  danger: '#ef4444',             // Red error alerts & notice badges
  dangerLight: '#fee2e2',
  info: '#0284c7',               // Sky blue informational callouts
  infoLight: '#e0f2fe',
};

/**
 * Injects all colors into :root CSS custom properties so regular CSS
 * rules and inline styles using `var(--...)` react immediately.
 */
export function applyThemeToDOM(colors = THEME_CONFIG) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Primary
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--primary-hover', colors.primaryHover);
  root.style.setProperty('--primary-dark', colors.primaryDark);
  root.style.setProperty('--primary-light', colors.primaryLight);
  root.style.setProperty('--primary-border', colors.primaryBorder);

  // Secondary
  root.style.setProperty('--secondary-color', colors.secondary);
  root.style.setProperty('--secondary-hover', colors.secondaryHover);
  root.style.setProperty('--secondary-dark', colors.secondaryDark);
  root.style.setProperty('--secondary-light', colors.secondaryLight);
  root.style.setProperty('--secondary-muted', colors.secondaryMuted);

  // Navigation
  root.style.setProperty('--nav-overlay-bg', colors.navOverlayBg);
  root.style.setProperty('--nav-overlay-bg-rgba', colors.navOverlayBgRgba);
  root.style.setProperty('--nav-text', colors.navText);

  // Neutrals & Surface
  root.style.setProperty('--dark-color', colors.dark);
  root.style.setProperty('--dark-surface', colors.darkSurface);
  root.style.setProperty('--text-main', colors.textMain);
  root.style.setProperty('--text-muted', colors.textMuted);
  root.style.setProperty('--text-light', colors.textLight);
  root.style.setProperty('--bg-page', colors.bgPage);
  root.style.setProperty('--bg-surface', colors.bgSurface);
  root.style.setProperty('--border-light', colors.borderLight);
  root.style.setProperty('--border-medium', colors.borderMedium);

  // Promo & Accents
  root.style.setProperty('--promo-banner', colors.promoBanner);
  root.style.setProperty('--promo-button', colors.promoButton);
  root.style.setProperty('--accent-gold', colors.accentGold);
  root.style.setProperty('--accent-amber', colors.accentAmber);

  // Status
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-danger', colors.danger);
  root.style.setProperty('--color-info', colors.info);
}

// Automatically apply theme on module load
if (typeof window !== 'undefined') {
  applyThemeToDOM(THEME_CONFIG);
}

export default THEME_CONFIG;
