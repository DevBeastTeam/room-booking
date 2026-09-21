// ── Site Data Service (localStorage backed with default fallbacks) ─────────────

export const DEFAULT_SITE_SETTINGS = {
  siteName: 'Monarch Pass Apartments',
  tagline: 'Spacious 1-4 Bedroom Apartments in Fort Worth',
  logoUrl: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_325,h_60/s3/2/58193/pn_monarchpass_logo_pms%20web.png',
  heroImageUrl: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto/s3/2/58193/54-web-or-mls-4500%20Campus%20Dr%201005-S2104-020.jpg',
  phone: '+1 817-857-8782', // Header click-to-call
  secondaryPhone: '+1 817-531-1750', // Office / Footer phone
  email: 'leasing@monarchpassapts.com',
  supportEmail: 'support@monarchpassapts.com',
  address: '4500 Campus Dr, Fort Worth, TX 76119',
  city: 'Fort Worth',
  state: 'TX',
  zip: '76119',
  footerDescription: 'Come explore the wonders of Monarch Pass and find the perfect home that fits your lifestyle!',
  managedBy: 'Cushman & Wakefield',
  managedBySub: 'Excellence in Multifamily Living',
  copyrightText: '© 2026 Cushman & Wakefield All Rights Reserved. | Powered by RentCafe (© 2026 Yardi Systems, Inc. All Rights Reserved.)',
  officeHours: {
    monFri: '10:00 AM - 6:00 PM',
    sat: '10:00 AM - 5:00 PM',
    sun: '1:00 PM - 5:00 PM',
  },
  social: {
    facebook: 'https://www.facebook.com/MonarchPassAPTS',
    instagram: 'https://www.instagram.com/lifeatmonarchpass',
  },
  portals: {
    resident: 'https://monarchpassapts.securecafe.com/residentservices/ladera-palms-0/userlogin.aspx',
    applicant: 'https://monarchpassapts.securecafe.com/onlineleasing/ladera-palms-0/guestlogin.aspx',
  },
  mapsUrl: 'https://maps.app.goo.gl/E71XfBiE8dE9bAjV6',
};

export const DEFAULT_LEGAL_PAGES = {
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: 'September 2026',
    content: `Welcome to Monarch Pass Apartments. By using this website, scheduling a tour, or submitting a rental application, you agree to comply with and be bound by the following terms of service.

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
    content: `At Monarch Pass Apartments, managed by Cushman & Wakefield, we are dedicated to protecting your privacy and ensuring the security of your personal data.

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
For inquiries regarding your personal data or to request data removal, please contact our leasing office at leasing@monarchpassapts.com or call +1 817-857-8782.`,
  },
  accessibility: {
    title: 'Accessibility Statement',
    lastUpdated: 'September 2026',
    content: `Monarch Pass Apartments, managed by Cushman & Wakefield, is committed to digital accessibility, and to ensuring that everyone, including persons with disabilities, has full and equal access to our digital offerings.

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
• Email: leasing@monarchpassapts.com
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

// ── Site Settings ─────────────────────────────────────────────────────────────
export function getSiteSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    // Auto-migrate if stored values had previous test placeholders
    if (parsed.phone === '+1 817-646-5785' || parsed.officeHours?.sun === 'Closed') {
      const merged = { ...parsed, ...DEFAULT_SITE_SETTINGS };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
      return merged;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('site-settings-updated', { detail: settings }));
    return true;
  } catch {
    return false;
  }
}

export function resetSiteSettings() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    window.dispatchEvent(new CustomEvent('site-settings-updated', { detail: DEFAULT_SITE_SETTINGS }));
    return DEFAULT_SITE_SETTINGS;
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

// ── Legal Pages ───────────────────────────────────────────────────────────────
export function getLegalPages() {
  try {
    const raw = localStorage.getItem(LEGAL_PAGES_KEY);
    if (!raw) return DEFAULT_LEGAL_PAGES;
    return { ...DEFAULT_LEGAL_PAGES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LEGAL_PAGES;
  }
}

export function saveLegalPages(pages) {
  try {
    localStorage.setItem(LEGAL_PAGES_KEY, JSON.stringify(pages));
    window.dispatchEvent(new CustomEvent('legal-pages-updated', { detail: pages }));
    return true;
  } catch {
    return false;
  }
}

// ── Support Inquiries ─────────────────────────────────────────────────────────
export function getSupportInquiries() {
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
    return newInquiry;
  } catch (err) {
    console.error('Failed to add support inquiry', err);
    return null;
  }
}

export const saveSupportInquiry = addSupportInquiry;

