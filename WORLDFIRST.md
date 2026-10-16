# WorldFirst Payment Gateway & Auto-Subscription Integration Guide

> **Project:** Monarch Pass Luxury Student Housing  
> **Gateway:** WorldFirst Pay Solution (Ant International / Alibaba Group)  
> **Status:** Sandbox Ready (with Production Live Switch)  
> **Replaces:** Paddle Payment Gateway  

---

## 1. Overview

This project integrates the **WorldFirst Open Platform API** (`WorldFirst Pay Solution`) to handle luxury student housing payments, reservation deposits, monthly rent, and amenity add-ons.

### Key Capabilities:
1. **One-Time Manual Payments:**
   - Security deposits, application fees, or single-month upfront payments.
2. **Auto-Subscriptions / Recurring Billing:**
   - Automated recurring rental debits.
   - **`monthly` (Every 30 Days):** Standard residential billing cycle for tenants.
   - **`3_days` (Fast Test Cycle):** Quick 3-day renewal interval requested by developer to test automatic debit triggers and recurring subscription lifecycles in Sandbox mode without waiting a full month.
3. **Sandbox Testing Simulator:**
   - Full mock checkout simulation with simulated card entry, 3DS authentication, and instant webhook event emission.
4. **Dev / Super Admin Audit Trail:**
   - All transactions, subscription statuses (`active`, `cancelled`, `past_due`), and next renewal dates are tracked in the MySQL `transactions` table and visible inside the **Dev Panel (`/dev`)**.

---

## 2. WorldFirst Portal Accounts & Direct Key Generation Links

Follow these direct links to register, retrieve your sandbox credentials, and transition to live:

| Key Name | Description | Direct Portal Link |
| :--- | :--- | :--- |
| **Merchant Account ID** | Your unique WorldFirst business entity ID (`WF_US_XXXXXXX`) | [WorldFirst Account Profile](https://portal.worldfirst.com/account/details) |
| **Client ID / App ID** | Application identifier for the Monarch Pass booking engine | [WorldFirst App Management](https://open.worldfirst.com/platform/app/manage) |
| **API Key / Secret** | Primary API token used to authorize server-to-server requests | [WorldFirst Developer Keys](https://open.worldfirst.com/platform/developer/keys) |
| **RSA Private Key** | Your private key to sign JSON-RPC request payloads | [RSA Keypair Signature Guide](https://open.worldfirst.com/docs/api/security/signature) |
| **WorldFirst Public Key** | Ant International's public certificate to verify webhook callbacks | [WorldFirst Public Certificates](https://open.worldfirst.com/platform/developer/keys) |
| **Webhook Secret** | HMAC secret to validate inbound notification events | [WorldFirst Webhook Configuration](https://open.worldfirst.com/platform/app/webhooks) |

---

## 3. Environment Variables Configuration

In `backend/config/.env` (and documented in `backend/config/.env.example`), the following variables configure the gateway:

```ini
# ==============================================================================
# WorldFirst (WorldFirst Pay / Ant International) Payment Gateway
# Mode: 'sandbox' (testing) or 'live' (production)
# ==============================================================================
WORLDFIRST_ENV=sandbox

# 1. Partner App / Client ID (from https://open.worldfirst.com/platform/app/manage)
WORLDFIRST_CLIENT_ID=wf_client_sandbox_monarch2026

# 2. Merchant ID (from https://portal.worldfirst.com/account/details)
WORLDFIRST_MERCHANT_ID=WF_US_8839210

# 3. API Key / Client Secret (from https://open.worldfirst.com/platform/developer/keys)
WORLDFIRST_API_KEY=wf_sdbx_sec_7a9f82d1b0c34e8e91f6a2b4c8d0e1f2

# 4. Merchant RSA 2048-bit Private Key (PKCS#8 PEM string or one-line)
WORLDFIRST_PRIVATE_KEY=""

# 5. WorldFirst Public Key
WORLDFIRST_PUBLIC_KEY=""

# 6. Webhook Signing Secret (from https://open.worldfirst.com/platform/app/webhooks)
WORLDFIRST_WEBHOOK_SECRET=wf_whsec_sdbx_98fa71e2

# 7. Currency
WORLDFIRST_CURRENCY=USD

# 8. Subscription Defaults
WORLDFIRST_SUBSCRIPTION_ENABLED=true
WORLDFIRST_SUBSCRIPTION_DEFAULT_INTERVAL=monthly
```

---

## 4. How Manual (One-Time) Payments Work

1. **User Action:**
   - Tenant clicks **"Reserve & Pay"** or **"Pay Rent"** anywhere on the site (Header, Floor Plans, Cost Breakdown, User Dashboard).
   - In the modal (`WorldFirstCheckoutModal.jsx`), the user leaves **Auto-Subscription** toggled **OFF**.
2. **Backend Request:**
   - Frontend calls `siteDataService.createWorldFirstPayment({ mode: 'one_time', amount, itemTitle, userEmail })`.
   - `backend/api/worldfirst.php?action=create_payment` generates:
     - Order ID: `WF-ORD-xxxx-xxxx`
     - Transaction ID: `WF-TXN-xxxx-xxxx`
     - Database record inserted with `payment_mode = 'one_time'`, `status = 'pending'`, `subscription_status = 'none'`.
3. **Execution:**
   - **Sandbox:** User enters mock card info or clicks **"Simulate WorldFirst Instant Pay"**.
   - **Live:** Tenant is redirected to WorldFirst's hosted PCI-DSS checkout page (`checkout_url`).
4. **Fulfillment:**
   - Upon completion, `verify_payment` confirms the transaction and updates status to `completed`.
   - Event logged to Dev Panel Analytics under `worldfirst_payment_started`.

---

## 5. How Auto-Subscriptions (Recurring Billing) Work

1. **User Action:**
   - Tenant toggles **"Enable Auto-Pay (Recurring Billing)"** ON.
   - Tenant selects recurrence interval:
     - **30 Days (Monthly Rent):** Standard lease billing schedule.
     - **3 Days (Fast Testing Cycle):** Developer test option to observe renewal transitions within 72 hours.
2. **Mandate Creation:**
   - Request sent to `create_payment` with:
     ```json
     {
       "mode": "subscription",
       "interval": "3_days",
       "amount": 899.00,
       "userEmail": "tenant@example.com"
     }
     ```
   - WorldFirst initializes a Recurring Debit Agreement Token (`agreement_id`).
   - The transaction row is recorded with:
     - `payment_mode`: `'subscription'`
     - `subscription_interval`: `'3_days'` or `'monthly'`
     - `subscription_status`: `'active'`
     - `next_billing_date`: `YYYY-MM-DD HH:MM:SS` (computed as `+3 days` or `+30 days` from current time).
3. **Scheduled Renewals:**
   - On the `next_billing_date`, WorldFirst fires a webhook callback `notifyRecurringPayment` to:
     ```
     https://yourdomain.com/backend/api/worldfirst.php?action=webhook
     ```
   - The backend validates the HMAC/RSA signature, logs the newly billed cycle, and advances `next_billing_date` by the same interval.
4. **Subscription Cancellation:**
   - Tenant can cancel auto-pay anytime from their **User Dashboard** or via:
     ```http
     POST /backend/api/worldfirst.php?action=cancel_subscription
     Content-Type: application/json

     {
       "transaction_id": "WF-TXN-xxxx-xxxx"
     }
     ```
   - `subscription_status` is updated to `'cancelled'`.

---

## 6. Sandbox Testing Credentials & Cards

Use these test cards in Sandbox checkout mode:

| Card Type | Card Number | Expiry | CVC | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **WorldFirst Test Visa** | `4000 0012 3456 0001` | Any future date (e.g. `12/28`) | `123` | **Success (200 OK)** |
| **WorldFirst Test MasterCard** | `5555 5555 5555 4444` | Any future date (e.g. `08/29`) | `456` | **Success (200 OK)** |
| **Declined Card (Test)** | `4000 0012 3456 0002` | Any future date | `123` | **Card Declined (Do Not Honor)** |
| **Insufficient Funds (Test)** | `4000 0012 3456 0003` | Any future date | `123` | **Insufficient Balance** |

---

## 7. Webhook Setup on WorldFirst Developer Portal

To receive real-time payment notifications:
1. Go to [WorldFirst Webhooks](https://open.worldfirst.com/platform/app/webhooks).
2. Set Notification Endpoint to:
   ```
   https://yourdomain.com/backend/api/worldfirst.php?action=webhook
   ```
3. Subscribe to events:
   - `PAYMENT_COMPLETED`
   - `PAYMENT_FAILED`
   - `SUBSCRIPTION_CREATED`
   - `SUBSCRIPTION_RENEWED`
   - `SUBSCRIPTION_CANCELLED`
4. Copy the **Signing Secret** and paste it into `WORLDFIRST_WEBHOOK_SECRET` in `backend/config/.env`.

---

## 8. Backend API Endpoints Reference

All endpoints live in [`backend/api/worldfirst.php`](file:///home/hasan/Documents/reactjs/room-booking/backend/api/worldfirst.php):

| Endpoint | Method | Params / Payload | Description |
| :--- | :--- | :--- | :--- |
| `?action=config` | `GET` | None | Returns gateway status, sandbox flag, currency, fees, and subscription options. |
| `?action=create_payment` | `POST` | `amount, item_title, mode, interval, customer_email` | Initiates one-time payment or auto-subscription mandate. |
| `?action=verify_payment` | `POST` | `transaction_id, order_id` | Verifies and finalizes transaction authorization. |
| `?action=cancel_subscription` | `POST` | `transaction_id` | Deactivates recurring auto-pay agreement. |
| `?action=webhook` | `POST` | Raw JSON Payload with `X-Signature` header | WorldFirst asynchronous server notification handler. |
| `?action=history` | `GET` | Requires Super Admin token | Audits all WorldFirst transactions and subscriptions. |

---

## 9. Switching from Sandbox to Production

When ready to take real customer credit card and bank transfer payments:
1. Complete WorldFirst KYB business verification at [portal.worldfirst.com](https://portal.worldfirst.com).
2. In `backend/config/.env`, change:
   ```ini
   WORLDFIRST_ENV=live
   ```
3. Update `WORLDFIRST_CLIENT_ID`, `WORLDFIRST_MERCHANT_ID`, and `WORLDFIRST_API_KEY` with your Live Production credentials.
4. Set the live webhook URL on the production WorldFirst dashboard.
