// ── Site Data Service (database backed with localStorage cache + defaults) ──────
//
// The MySQL database (site_settings / legal_pages tables) is the source of truth.
// localStorage is only a fast/offline cache; the async loaders below reconcile
// the cache with the backend so admin edits actually reach the public site.

import { apiGet, apiPost, getCsrfToken, setCsrfToken } from './apiClient.js';

export const DEFAULT_SITE_SETTINGS = {
  siteName: 'Monar Pass Apartments',
  tagline: 'Spacious 1-4 Bedroom Apartments in Fort Worth',
  // First-party Monar Pass logo (public/logo.svg). The old CDN default still
  // carried the previous "MONARCH PASS" wordmark.
  logoUrl: '/logo.svg',
  heroImageUrl: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg',
  phone: '+1 817-857-8782', // Header click-to-call
  secondaryPhone: '+1 817-531-1750', // Office / Footer phone
  email: 'leasing@monarpass.com',
  supportEmail: 'support@monarpass.com',
  address: '4500 Campus Dr, Fort Worth, TX 76119',
  city: 'Fort Worth',
  state: 'TX',
  zip: '76119',
  footerDescription: 'Come explore the wonders of Monar Pass and find the perfect home that fits your lifestyle!',
  managedBy: 'Cushman & Wakefield',
  managedBySub: 'Excellence in Multifamily Living',
  copyrightText: '© 2026 Cushman & Wakefield All Rights Reserved. | Powered by RentCafe (© 2026 Yardi Systems, Inc. All Rights Reserved.)',
  officeHours: {
    monFri: '10:00 AM - 6:00 PM',
    sat: '10:00 AM - 5:00 PM',
    sun: '1:00 PM - 5:00 PM',
  },
  social: {
    facebook: 'https://www.facebook.com/MonarPassAPTS',
    instagram: 'https://www.instagram.com/lifeatmonarpass',
  },
  portals: {
    resident: 'https://monarpassapts.securecafe.com/residentservices/ladera-palms-0/userlogin.aspx',
    applicant: 'https://monarpassapts.securecafe.com/onlineleasing/ladera-palms-0/guestlogin.aspx',
  },
  mapsUrl: 'https://maps.app.goo.gl/E71XfBiE8dE9bAjV6',
};

export const DEFAULT_LEGAL_PAGES = {
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: 'September 2026',
    content: `Welcome to Monar Pass Apartments. By using this website, scheduling a tour, or submitting a rental application, you agree to comply with and be bound by the following terms of service.

1. Rental Application & Eligibility
All applicants must be at least 18 years of age and satisfy our established credit, criminal background, and income qualification criteria (minimum 2.5x to 3x monthly rent). Application fees are non-refundable once background screening commences.

2. Pricing & Availability Disclaimer
Quoted rental prices, promotional discounts, and apartment availability are updated daily and subject to change without prior notice until a full lease agreement has been signed by all parties.

3. Community Policies & Quiet Hours
Residents and their guests must respect our designated community quiet hours (10:00 PM – 8:00 AM). Common area amenities (pool, fitness center, clubhouse) are for resident use in accordance with posted rules.

4. Maintenance Requests & Emergencies
Standard maintenance requests submitted through our online resident portal are typically processed within 24 to 48 business hours. For emergency situations (gas leak, flooding, electrical hazard), contact our 24/7 on-call dispatch immediately.

5. Occupancy Limitations
Subletting or unauthorized long-term occupants not listed on the lease contract is strictly prohibited under local municipal regulations and Cushman & Wakefield community guidelines.`,
  },
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'September 2026',
    content: `At Monar Pass Apartments, managed by Cushman & Wakefield, we are dedicated to protecting your privacy and ensuring the security of your personal data.

1. Information We Collect
When you interact with our website or resident portal, we may collect:
• Contact information (such as your full name, email address, phone number).
• Rental preferences (desired move-in date, preferred floor plan, budget).
• Application details (employment history, verified income, identification records).
• Technical data (IP address, browser type, and cookie identifiers for site performance).

2. How We Use Your Information
Your information is utilized solely to:
• Facilitate guided property tours and respond to inquiries.
• Process rental applications and execute lease agreements.
• Deliver resident notifications, billing statements, and maintenance updates.
• Improve our digital services and maintain portal security.

3. Information Sharing & Third Parties
We never sell, rent, or trade your personal data with third-party advertisers. Information is only shared with authorized service providers (credit screening bureaus, payment gateway processors) essential to processing your lease.

4. Data Protection & Security
We utilize industry-standard TLS encryption, strict role-based admin access, and regular vulnerability audits to ensure your sensitive records remain confidential.

5. Contact Our Privacy Officer
For inquiries regarding your personal data or to request data removal, please contact our leasing office at leasing@monarpass.com or call +1 817-857-8782.`,
  },
  accessibility: {
    title: 'Accessibility Statement',
    lastUpdated: 'September 2026',
    content: `Monar Pass Apartments, managed by Cushman & Wakefield, is committed to digital accessibility, and to ensuring that everyone, including persons with disabilities, has full and equal access to our digital offerings.

1. Accessibility Standard
We are continually improving the user experience for everyone, and applying the relevant accessibility standards. We aim to conform to Web Content Accessibility Guidelines (WCAG) 2.1, Level AA standards.

2. Measures Taken
• Screen reader friendly semantic markup and descriptive aria-labels.
• Integrated floating accessibility tool offering high contrast, font magnification, dyslexia-friendly fonts, and motion pausing.
• Keyboard navigability across menus, forms, galleries, and interactive lease calculators.
• Clear headings, descriptive link text, and alternative text for all community images.

3. Feedback & Assistance
If you encounter accessibility difficulties with any part of our website or resident services, please contact our on-site team directly:
• Phone: +1 817-857-8782
• Email: leasing@monarpass.com
• Address: 4500 Campus Dr, Fort Worth, TX 76119
We welcome your feedback and will provide whatever assistance is necessary to ensure you have complete access.`,
  },
};

export const DEFAULT_SUPPORT_INQUIRIES = [
  {
    id: 'MSG-801',
    name: 'Jordan Miller',
    email: 'jordan.m@example.com',
    phone: '+1 817-555-0192',
    category: 'Tour Request',
    subject: 'Schedule tour for 2-Bedroom unit',
    message: 'Hi! I am looking to move in next month and would love to tour unit 2104 this Saturday morning around 11:00 AM. Is a leasing agent available?',
    date: 'Sep 20, 2026 10:15 AM',
    status: 'new',
    notes: '',
  },
  {
    id: 'MSG-802',
    name: 'Amina Vance',
    email: 'amina.v@example.com',
    phone: '+1 817-555-0348',
    category: 'Pet Policy',
    subject: 'Question regarding pet deposit & fees',
    message: 'Hello, I have a 15-pound hypoallergenic dog. Could you confirm what the one-time pet deposit and monthly pet rent are for a 1-bedroom layout?',
    date: 'Sep 19, 2026 03:40 PM',
    status: 'in-progress',
    notes: 'Sent pet policy PDF on Sep 19 via email',
  },
  {
    id: 'MSG-803',
    name: 'Carlos Mendez',
    email: 'carlos.m@example.com',
    phone: '+1 817-555-0811',
    category: 'Application Help',
    subject: 'Upload income verification documents',
    message: 'I submitted my online application yesterday (APP-003) but had trouble uploading my recent paystub. Can I email it directly to you?',
    date: 'Sep 18, 2026 09:20 AM',
    status: 'resolved',
    notes: 'Paystub received and attached to applicant profile.',
  },
  {
    id: 'MSG-804',
    name: 'Brianna Hayes',
    email: 'b.hayes@outlook.com',
    phone: '+1 817-555-0672',
    category: 'Pricing & Availability',
    subject: 'Lease term options for 3-Bedroom',
    message: 'Are 6-month or 10-month lease terms currently available for the 3-Bedroom layouts? Also, is covered parking included?',
    date: 'Sep 17, 2026 04:15 PM',
    status: 'resolved',
    notes: 'Explained lease term calculator and pricing tiers.',
  },
];

const SETTINGS_KEY = 'monarch_site_settings';
const LEGAL_PAGES_KEY = 'monarch_legal_pages';
const SUPPORT_INQUIRIES_KEY = 'monarch_support_inquiries';

const SETTINGS_API_URL = '/backend/api/settings.php';
const LEGAL_PAGES_API_URL = '/backend/api/legal-pages.php';
const AUTH_SESSION_URL = '/backend/api/auth.php';

// In-memory caches (filled from the database, falling back to localStorage).
let cachedSettings = null;
let cachedLegalPages = null;
let settingsLoadPromise = null;
let legalPagesLoadPromise = null;

// Bumped whenever a local write happens so an in-flight server load that
// started earlier cannot clobber the fresher local value.
let settingsWriteSeq = 0;
let legalPagesWriteSeq = 0;

/**
 * Ensures a CSRF token is available before a mutating request.
 * Normally set at login (AdminGate) — this is only a safety net.
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
    /* offline — the backend will simply reject the write */
  }
  return null;
}

/**
 * Dispatches a custom event and replays it a couple of times.
 *
 * Astro islands hydrate asynchronously, so a listener may register *after* the
 * server response arrived. Replaying the very same payload object keeps those
 * listeners in sync (React bails out when the state object is identical).
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
 * Monarch → Monar brand migration.
 * Rewrites stale "Monarch" placeholders that may live in localStorage OR in the
 * database (an admin could have saved them before the rebrand).
 */
function migrateBrandValues(parsed) {
  const hasMonarch = (parsed.siteName && parsed.siteName.includes('Monarch')) ||
    (parsed.facebook && parsed.facebook.includes('Monarch')) ||
    (parsed.instagram && parsed.instagram.includes('monarch')) ||
    (parsed.social?.facebook && parsed.social.facebook.includes('Monarch')) ||
    (parsed.social?.instagram && parsed.social.instagram.includes('monarch')) ||
    (parsed.portals?.resident && parsed.portals.resident.includes('monarch')) ||
    (parsed.portals?.applicant && parsed.portals.applicant.includes('monarch'));
  const hasLegacyDefaults = parsed.phone === '+1 817-646-5785' || parsed.officeHours?.sun === 'Closed';

  if (hasMonarch) {
    parsed.siteName = 'Monar Pass Apartments';
    if (parsed.email && parsed.email.includes('monarch')) {
      parsed.email = 'leasing@monarpass.com';
    }
    if (parsed.supportEmail && parsed.supportEmail.includes('monarch')) {
      parsed.supportEmail = 'support@monarpass.com';
    }
    if (parsed.footerDescription && parsed.footerDescription.includes('Monarch')) {
      parsed.footerDescription = 'Come explore the wonders of Monar Pass and find the perfect home that fits your lifestyle!';
    }
    if (parsed.social?.facebook && parsed.social.facebook.includes('Monarch')) {
      parsed.social.facebook = 'https://www.facebook.com/MonarPassAPTS';
    }
    if (parsed.social?.instagram && parsed.social.instagram.includes('monarch')) {
      parsed.social.instagram = 'https://www.instagram.com/lifeatmonarpass';
    }
    if (parsed.portals?.resident && parsed.portals.resident.includes('monarch')) {
      parsed.portals.resident = parsed.portals.resident.replaceAll('monarchpassapts', 'monarpassapts');
    }
    if (parsed.portals?.applicant && parsed.portals.applicant.includes('monarch')) {
      parsed.portals.applicant = parsed.portals.applicant.replaceAll('monarchpassapts', 'monarpassapts');
    }
  }

  return { changed: hasMonarch || hasLegacyDefaults, hasMonarch };
}

/**
 * Merges a partial settings object over the defaults.
 * Plain nested objects (social / portals / officeHours) are merged one level
 * deep so a partial payload never drops sibling fields. Nested objects are
 * cloned so callers can never mutate the shared defaults.
 */
function mergeSettings(base, override) {
  const result = { ...base };
  if (!override || typeof override !== 'object') return result;
  Object.keys(override).forEach(key => {
    const next = override[key];
    const current = result[key];
    if (
      next && typeof next === 'object' && !Array.isArray(next) &&
      current && typeof current === 'object' && !Array.isArray(current)
    ) {
      result[key] = { ...current, ...next };
    } else if (next !== undefined) {
      result[key] = next;
    }
  });
  // Detach nested objects that were not overridden (shared with the defaults).
  Object.keys(result).forEach(key => {
    const value = result[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = { ...value };
    }
  });
  return result;
}

/** Reads + migrates the cached settings from localStorage. */
function readStoredSettings() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const { changed } = migrateBrandValues(parsed);
    const merged = mergeSettings(DEFAULT_SITE_SETTINGS, parsed);
    if (changed) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      } catch { /* storage unavailable */ }
    }
    return merged;
  } catch {
    return null;
  }
}

// ── Site Settings ─────────────────────────────────────────────────────────────
/**
 * Returns the site settings (synchronous — safe for render paths).
 * Order: in-memory cache (populated from the DB) → localStorage → defaults.
 * Call loadSiteSettingsFromServer() to refresh from the database.
 */
export function getSiteSettings() {
  if (typeof window === 'undefined') return mergeSettings(DEFAULT_SITE_SETTINGS, {});
  if (cachedSettings) return mergeSettings(DEFAULT_SITE_SETTINGS, cachedSettings);
  const stored = readStoredSettings();
  if (stored) {
    cachedSettings = stored;
    return mergeSettings(DEFAULT_SITE_SETTINGS, stored);
  }
  return mergeSettings(DEFAULT_SITE_SETTINGS, {});
}

/**
 * Loads the site settings from the database (GET /backend/api/settings.php —
 * public), merges them with the defaults, caches them in localStorage and
 * notifies listeners via the 'site-settings-updated' event.
 */
export async function loadSiteSettingsFromServer() {
  if (typeof window === 'undefined') return null;
  if (settingsLoadPromise) return settingsLoadPromise;

  settingsLoadPromise = (async () => {
    const startedAt = settingsWriteSeq;
    try {
      const { ok, data } = await apiGet(SETTINGS_API_URL);
      if (!ok || !data || typeof data !== 'object') return null;

      // settings.php returns the raw setting_value JSON (no success wrapper).
      // Guard against a wrapped/errored payload.
      if (data.success === false) return null;

      // Tolerate a { success, settings: {...} } wrapper just in case.
      const payload = (data.settings && typeof data.settings === 'object') ? data.settings : data;

      const parsed = { ...payload };
      delete parsed.success;
      migrateBrandValues(parsed);
      const merged = mergeSettings(DEFAULT_SITE_SETTINGS, parsed);

      // A local save happened while we were fetching → keep the local value.
      if (startedAt !== settingsWriteSeq) return null;

      return applyServerSettings(merged);
    } catch (err) {
      console.debug('Site settings load failed:', err);
      return null;
    } finally {
      settingsLoadPromise = null;
    }
  })();

  return settingsLoadPromise;
}

export function saveSiteSettings(settings) {
  if (typeof window === 'undefined') return false;
  try {
    settingsWriteSeq += 1;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    cachedSettings = settings;
    window.dispatchEvent(new CustomEvent('site-settings-updated', {
      detail: mergeSettings(DEFAULT_SITE_SETTINGS, settings),
    }));

    // Sync to MySQL backend asynchronously (CSRF token attached by apiClient).
    syncSettingsToBackend(settings);
    return true;
  } catch {
    return false;
  }
}

/**
 * Replaces the cached settings with a server payload (used by the loader).
 * Keeps the dispatched detail identical to the cached value so React can
 * bail out of a re-render when nothing changed.
 */
function applyServerSettings(merged) {
  cachedSettings = merged;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
  } catch { /* storage unavailable — in-memory cache is enough */ }
  emitUpdate('site-settings-updated', merged);
  return merged;
}

async function syncSettingsToBackend(settings) {
  try {
    await ensureCsrfToken();
    const { ok, data } = await apiPost(SETTINGS_API_URL, settings);
    if (!ok) {
      console.debug('Settings backend sync note:', (data && (data.error || data.message)) || 'not authorised');
    }
  } catch (err) {
    console.debug('Settings backend sync error:', err);
  }
}

export function resetSiteSettings() {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    settingsWriteSeq += 1;
    localStorage.removeItem(SETTINGS_KEY);
    cachedSettings = null;
    window.dispatchEvent(new CustomEvent('site-settings-updated', { detail: DEFAULT_SITE_SETTINGS }));
    syncSettingsToBackend(DEFAULT_SITE_SETTINGS);
    return DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

// ── Legal Pages ───────────────────────────────────────────────────────────────
/** Reads + migrates the cached legal pages from localStorage. */
function readStoredLegalPages() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LEGAL_PAGES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    let changed = false;
    ['terms', 'privacy', 'accessibility'].forEach(key => {
      if (parsed[key]?.content && parsed[key].content.includes('Monarch')) {
        parsed[key].content = parsed[key].content
          .replaceAll('Monarch Pass', 'Monar Pass')
          .replaceAll('leasing@monarchpassapts.com', 'leasing@monarpass.com');
        changed = true;
      }
    });
    const merged = { ...DEFAULT_LEGAL_PAGES, ...parsed };
    if (changed) {
      try {
        localStorage.setItem(LEGAL_PAGES_KEY, JSON.stringify(merged));
      } catch { /* storage unavailable */ }
    }
    return merged;
  } catch {
    return null;
  }
}

/**
 * Returns the legal pages (synchronous — safe for render paths).
 * Order: in-memory cache (populated from the DB) → localStorage → defaults.
 * Call loadLegalPagesFromServer() to refresh from the database.
 */
export function getLegalPages() {
  if (typeof window === 'undefined') return DEFAULT_LEGAL_PAGES;
  if (cachedLegalPages) return { ...DEFAULT_LEGAL_PAGES, ...cachedLegalPages };
  const stored = readStoredLegalPages();
  if (stored) {
    cachedLegalPages = stored;
    return { ...DEFAULT_LEGAL_PAGES, ...stored };
  }
  return DEFAULT_LEGAL_PAGES;
}

/**
 * Loads the legal pages from the database (GET /backend/api/legal-pages.php —
 * public) so admin edits reach visitors, with localStorage as the fallback.
 */
export async function loadLegalPagesFromServer() {
  if (typeof window === 'undefined') return null;
  if (legalPagesLoadPromise) return legalPagesLoadPromise;

  legalPagesLoadPromise = (async () => {
    const startedAt = legalPagesWriteSeq;
    try {
      const { ok, data } = await apiGet(LEGAL_PAGES_API_URL);
      if (!ok || !data) return null;
      if (data.success === false) return null;

      // legal-pages.php returns { success, data: [ { slug, title, last_updated, content } ] }
      const rows = Array.isArray(data.data) ? data.data : null;
      if (!rows || rows.length === 0) return null;

      const parsed = {};
      rows.forEach(row => {
        if (!row || !row.slug) return;
        parsed[row.slug] = {
          title: row.title || DEFAULT_LEGAL_PAGES[row.slug]?.title || '',
          lastUpdated: row.last_updated || row.lastUpdated || DEFAULT_LEGAL_PAGES[row.slug]?.lastUpdated || '',
          content: row.content || '',
        };
      });
      if (Object.keys(parsed).length === 0) return null;

      ['terms', 'privacy', 'accessibility'].forEach(key => {
        if (parsed[key]?.content && parsed[key].content.includes('Monarch')) {
          parsed[key].content = parsed[key].content
            .replaceAll('Monarch Pass', 'Monar Pass')
            .replaceAll('leasing@monarchpassapts.com', 'leasing@monarpass.com');
        }
      });

      const merged = { ...DEFAULT_LEGAL_PAGES, ...parsed };

      // A local save happened while we were fetching → keep the local value.
      if (startedAt !== legalPagesWriteSeq) return null;

      cachedLegalPages = merged;
      try {
        localStorage.setItem(LEGAL_PAGES_KEY, JSON.stringify(merged));
      } catch { /* storage unavailable — in-memory cache is enough */ }

      emitUpdate('legal-pages-updated', merged);
      return merged;
    } catch (err) {
      console.debug('Legal pages load failed:', err);
      return null;
    } finally {
      legalPagesLoadPromise = null;
    }
  })();

  return legalPagesLoadPromise;
}

/**
 * Saves the legal pages — localStorage (instant) + backend (source of truth).
 */
export function saveLegalPages(pages) {
  if (typeof window === 'undefined') return false;
  try {
    legalPagesWriteSeq += 1;
    localStorage.setItem(LEGAL_PAGES_KEY, JSON.stringify(pages));
    cachedLegalPages = pages;
    window.dispatchEvent(new CustomEvent('legal-pages-updated', { detail: pages }));
    syncLegalPagesToBackend(pages);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pushes each legal page to the backend (one POST per slug — the endpoint
 * upserts a single row per request).
 */
async function syncLegalPagesToBackend(pages) {
  if (!pages || typeof pages !== 'object') return;
  const slugs = Object.keys(pages).filter(key => pages[key] && typeof pages[key] === 'object');
  if (slugs.length === 0) return;
  try {
    await ensureCsrfToken();
    await Promise.all(slugs.map(slug => {
      const page = pages[slug];
      return apiPost(LEGAL_PAGES_API_URL, {
        slug,
        title: page.title || '',
        lastUpdated: page.lastUpdated || '',
        content: page.content || '',
      });
    }));
  } catch (err) {
    console.debug('Legal pages backend sync error:', err);
  }
}

// ── Support Inquiries ─────────────────────────────────────────────────────────
export function getSupportInquiries() {
  if (typeof window === 'undefined') return DEFAULT_SUPPORT_INQUIRIES;
  try {
    const raw = localStorage.getItem(SUPPORT_INQUIRIES_KEY);
    if (!raw) return DEFAULT_SUPPORT_INQUIRIES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SUPPORT_INQUIRIES;
  }
}

export function saveSupportInquiries(inquiries) {
  try {
    localStorage.setItem(SUPPORT_INQUIRIES_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent('support-inquiries-updated', { detail: inquiries }));
    return true;
  } catch {
    return false;
  }
}

export function addSupportInquiry(inquiry) {
  try {
    const current = getSupportInquiries();
    const newInquiry = {
      id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      status: 'new',
      notes: '',
      ...inquiry,
    };
    const updated = [newInquiry, ...current];
    saveSupportInquiries(updated);

    // Sync to MySQL backend
    if (typeof fetch !== 'undefined') {
      fetch('/backend/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone || '',
          preferredBedroom: inquiry.bedrooms || 'Any',
          category: inquiry.topic || inquiry.subject || 'Support Inquiry',
          message: inquiry.message || ''
        })
      }).catch(err => console.debug('Inquiry backend sync note:', err));
    }

    return newInquiry;
  } catch (err) {
    console.error('Failed to add support inquiry', err);
    return null;
  }
}

export const saveSupportInquiry = addSupportInquiry;

// ── Maintenance API Helpers ───────────────────────────────────────────────────
export async function submitMaintenanceTicketDB(ticketData) {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch('/backend/api/maintenance.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Maintenance DB sync note:', err);
    return null;
  }
}

// ── Floor Plans API Helpers ───────────────────────────────────────────────────
export async function fetchFloorPlansDB() {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch('/backend/api/floor-plans.php');
    return await res.json();
  } catch (err) {
    console.warn('Floor plans DB fetch note:', err);
    return null;
  }
}

// ── WorldFirst Payment Gateway API Helpers ─────────────────────────────────────
export async function fetchWorldFirstConfig() {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch('/backend/api/worldfirst.php?action=config');
    return await res.json();
  } catch (err) {
    console.warn('WorldFirst config note:', err);
    return null;
  }
}

export async function createWorldFirstPayment(paymentData) {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch('/backend/api/worldfirst.php?action=create_payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await res.json();
  } catch (err) {
    console.error('WorldFirst payment error:', err);
    return null;
  }
}

export async function verifyWorldFirstPayment(txnId) {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch(`/backend/api/worldfirst.php?action=verify_payment&txn_id=${encodeURIComponent(txnId)}`);
    return await res.json();
  } catch (err) {
    console.error('WorldFirst verify error:', err);
    return null;
  }
}

export async function cancelWorldFirstSubscription(txnId) {
  if (typeof fetch === 'undefined') return null;
  try {
    const res = await fetch(`/backend/api/worldfirst.php?action=cancel_subscription&txn_id=${encodeURIComponent(txnId)}`);
    return await res.json();
  } catch (err) {
    console.error('WorldFirst cancel subscription error:', err);
    return null;
  }
}

export async function fetchWorldFirstTransactions(filters = {}) {
  if (typeof fetch === 'undefined') return { success: false, transactions: [] };
  try {
    const params = new URLSearchParams();
    params.set('action', 'history');
    if (filters.email) params.set('email', filters.email);
    if (filters.status) params.set('status', filters.status);
    if (filters.mode) params.set('mode', filters.mode);

    const token = typeof localStorage !== 'undefined' ? (localStorage.getItem('admin_token') || localStorage.getItem('dev_token')) : null;
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/backend/api/worldfirst.php?${params.toString()}`, { headers });
    return await res.json();
  } catch (err) {
    console.error('WorldFirst fetch transactions error:', err);
    return { success: false, transactions: [] };
  }
}

// Backwards compatibility aliases
export const fetchPaddleConfig = fetchWorldFirstConfig;
export const createPaddleTransaction = createWorldFirstPayment;
export const verifyPaddleTransaction = verifyWorldFirstPayment;

// ── Bootstrap ─────────────────────────────────────────────────────────────────
// On the client the database is the source of truth, so kick off the public
// GETs as soon as this module is evaluated. The synchronous getters keep
// working (localStorage / defaults) until the responses arrive, at which point
// the 'site-settings-updated' / 'legal-pages-updated' events refresh the UI.
if (typeof window !== 'undefined') {
  loadSiteSettingsFromServer();
  loadLegalPagesFromServer();
}

