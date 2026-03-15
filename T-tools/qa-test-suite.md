# CX Mate — QA Test Suite

> **Owner:** QA Agent
> **Created:** 2026-03-13
> **Last updated:** 2026-03-13
> **Scope:** Every user-facing deliverable, API, and integration in the CX Mate platform.
> **Format:** Each test has: Test ID, Description, Steps, Expected Result, Priority, Automatable.

---

## Table of Contents

1. [Gate & Access](#1-gate--access)
2. [Onboarding Wizard](#2-onboarding-wizard)
3. [Journey Page](#3-journey-page)
4. [CX Report / Confrontation](#4-cx-report--confrontation)
5. [Playbook](#5-playbook)
6. [CX Review / QBR](#6-cx-review--qbr)
7. [Auth & Account](#7-auth--account)
8. [Billing & Pricing](#8-billing--pricing)
9. [Middleware & Routing](#9-middleware--routing)
10. [API Health & External Services](#10-api-health--external-services)
11. [Email Notifications](#11-email-notifications)
12. [Cross-Page Data Integrity](#12-cross-page-data-integrity)

---

## 1. Gate & Access

### 1.1 Gate Page UI

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| GATE-001 | Gate page renders correctly | 1. Set `SITE_PASSWORD` env var. 2. Clear cookies. 3. Navigate to `/gate`. | Page loads with: LogoMark + "CX Mate" brand, headline with teal accent, three value bullets (MapTrifold, Warning, Target icons), waitlist form (name, email, company fields), "or" divider, "Already have an access code?" link. Background color `#E8EDE5`. | P0 | Yes |
| GATE-002 | Waitlist form — required fields enforced | 1. Navigate to `/gate`. 2. Leave name empty, enter email. 3. Click "Get early access". | Submit button is disabled when name or email is empty. HTML5 `required` attribute prevents submission. | P0 | Yes |
| GATE-003 | Waitlist form — valid email required | 1. Navigate to `/gate`. 2. Enter name. 3. Enter invalid email (e.g. "notanemail"). 4. Click "Get early access". | HTML5 email validation prevents submission. If bypassed, API returns 400 with `"Invalid email address"`. | P1 | Yes |
| GATE-004 | Waitlist form — successful submission | 1. Navigate to `/gate`. 2. Enter name, valid email, optional company. 3. Click "Get early access". | Loading state shows "Submitting...", then success card appears with checkmark icon, "You're in." heading, and "We'll reach out with your invite soon." text. | P0 | Yes |
| GATE-005 | Waitlist form — duplicate email upsert | 1. Submit waitlist with email `test@example.com`. 2. Submit again with same email but different name/company. | Second submission succeeds (200 OK). Supabase record is upserted — name/company updated, no duplicate row created. | P1 | Yes |
| GATE-006 | Access code toggle visibility | 1. Navigate to `/gate`. 2. Click "Already have an access code?". | Access code input appears with text field (type=password) and "Enter" button. The toggle link disappears. | P1 | Yes |
| GATE-007 | Access code — valid site password | 1. Toggle access code input. 2. Enter the value of `SITE_PASSWORD`. 3. Click "Enter". | Response sets `beta_access=granted` cookie. User is redirected to `/` via `router.push("/")` + `router.refresh()`. | P0 | Yes |
| GATE-008 | Access code — valid invite code | 1. Create an invite code in Supabase `invite_codes` table (is_active=true, use_count=0, max_uses=5). 2. Enter that code on gate page. 3. Submit. | Access granted, cookie set, redirected to `/`. Invite code `use_count` incremented by 1 in Supabase. | P0 | Yes |
| GATE-009 | Access code — case-insensitive | 1. Create invite code "ABC123" in Supabase. 2. Enter "abc123" on gate page. 3. Submit. | Code is normalized to uppercase before lookup. Access granted. | P1 | Yes |
| GATE-010 | Access code — invalid code | 1. Enter "WRONGCODE" on gate page. 2. Submit. | Error text "Invalid code." appears below input. Password field is cleared. API returns 401. | P0 | Yes |
| GATE-011 | Access code — exhausted invite code | 1. Set invite code use_count = max_uses in Supabase. 2. Enter that code. 3. Submit. | Access denied. "Invalid code." error shown. use_count is NOT incremented. | P1 | Yes |
| GATE-012 | Access code — deactivated invite code | 1. Set invite code is_active=false in Supabase. 2. Enter that code. 3. Submit. | Access denied. "Invalid code." error shown. | P1 | Yes |
| GATE-013 | Access code — empty submission | 1. Toggle access code input. 2. Leave field empty. 3. Click "Enter". | Button is disabled when password is empty (`disabled={codeLoading \|\| !password}`). | P2 | Yes |

### 1.2 Gate API (`/api/gate`)

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| GATE-API-001 | POST with valid site password | Send POST to `/api/gate` with body `{"password":"<SITE_PASSWORD>"}`. | 200 OK, `{"success":true}`, `Set-Cookie: beta_access=granted; HttpOnly; SameSite=Lax; Path=/; Max-Age=2592000`. | P0 | Yes |
| GATE-API-002 | POST with missing password | Send POST to `/api/gate` with body `{}`. | 400, `{"success":false,"error":"No code provided"}`. | P1 | Yes |
| GATE-API-003 | POST with non-string password | Send POST to `/api/gate` with body `{"password":123}`. | 400, `{"success":false,"error":"No code provided"}`. | P2 | Yes |
| GATE-API-004 | Cookie attributes in production | Deploy to production. Submit valid password. Inspect Set-Cookie header. | Cookie has `Secure` flag (because `NODE_ENV === "production"`). | P1 | No |
| GATE-API-005 | Supabase unavailable fallback | Unset `SUPABASE_SERVICE_ROLE_KEY`. Submit an invite code (not site password). | `getAdminClient()` returns null. Invite code check is skipped. Returns 401 "Invalid code". No crash. | P1 | Yes |

### 1.3 Waitlist API (`/api/waitlist`)

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| WL-API-001 | POST with valid data | Send POST with `{"name":"Test","email":"test@example.com","company":"Acme"}`. | 200 OK, `{"success":true}`. Row created in `waitlist` table with status="pending". | P0 | Yes |
| WL-API-002 | POST missing name | Send POST with `{"email":"test@example.com"}`. | 400, `{"error":"Name and email are required"}`. | P1 | Yes |
| WL-API-003 | POST missing email | Send POST with `{"name":"Test"}`. | 400, `{"error":"Name and email are required"}`. | P1 | Yes |
| WL-API-004 | POST invalid email format | Send POST with `{"name":"Test","email":"bad"}`. | 400, `{"error":"Invalid email address"}`. | P1 | Yes |
| WL-API-005 | Email is lowercased and trimmed | Send POST with `{"name":"Test","email":"  Test@Example.COM  "}`. | Email stored as `"test@example.com"` in Supabase. | P1 | Yes |
| WL-API-006 | Optional fields stored correctly | Send POST with all fields: name, email, company, role, cx_challenge, referral_source. | All fields stored in Supabase. Null fields stored as null (not empty string). | P2 | Yes |
| WL-API-007 | Notification email sent | Configure `RESEND_API_KEY` and `DIGEST_EMAIL`. Submit waitlist. | Resend email sent to `DIGEST_EMAIL` from `CX Mate <noreply@cxmate.io>` with subject containing name and company. | P1 | No |
| WL-API-008 | Notification failure is non-fatal | Set invalid `RESEND_API_KEY`. Submit waitlist. | Waitlist submission succeeds (200 OK). Console warns about email failure. | P1 | Yes |

---

## 2. Onboarding Wizard

### 2.1 Field Collection & Validation

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| ONB-001 | All required fields enforced | Attempt to proceed past each wizard step without filling required fields. | Cannot advance past a step until required fields are filled. Required fields per Zod schema: companyName (min 1), vertical (min 1), companySize (min 1), customerDescription (min 1), customerSize (min 1), mainChannel (min 1), biggestChallenge (min 1), painPoints (min 1 item), primaryGoal (min 1), timeframe (min 1). | P0 | Yes |
| ONB-002 | Company name field | Enter company name with leading/trailing whitespace. | Value is trimmed before storage and submission. | P2 | Yes |
| ONB-003 | Company website field | Enter a website URL. | Value stored in `companyWebsite`. Used by enrichment API. Accepts URLs with or without `https://` prefix. | P1 | Yes |
| ONB-004 | Vertical / Industry selection | Select a vertical from dropdown or enter custom. | Stored in `vertical` field. Enrichment may suggest a `suggestedVertical` that overrides or supplements. | P1 | Yes |
| ONB-005 | Company size selection | Select company size option. | Stored in `companySize`. Options match OnboardingData type. | P1 | Yes |
| ONB-006 | Company maturity selection | Select maturity level. | Stored in `companyMaturity`. Options: "pre_launch", "first_customers", "growing", "scaling". | P0 | Yes |
| ONB-007 | Maturity-derived defaults | Select "pre_launch" maturity. Proceed to CX maturity fields. | `deriveFromMaturity("pre_launch")` sets: measuresNps=false, measuresCsat=false, hasCxTeam=false, hasOnboarding=false, hasSuccessManager=false, hasSupportTicketing=false, hasCustomerFeedback=false. | P1 | Yes |
| ONB-008 | Maturity-adaptive pain points | Select "first_customers" maturity. View pain points step. | Pain points list shows maturity-specific options from `MATURITY_PAIN_POINTS["first_customers"]` array. At least 1 must be selected. | P0 | Yes |
| ONB-009 | Maturity-adaptive goals | Select maturity, pick pain points. View goals step. | Goals list adapts to maturity stage from `MATURITY_GOALS` mapping. `PAIN_TO_GOAL_MAP` connections are respected. | P1 | Yes |
| ONB-010 | Customer description free text | Enter customer description. | Stored in `customerDescription`. Minimum 1 character required. | P1 | Yes |
| ONB-011 | Customer size selection | Select customer size range. | Stored in `customerSize`. | P1 | Yes |
| ONB-012 | Main channel selection | Select primary customer channel. | Stored in `mainChannel`. | P1 | Yes |
| ONB-013 | Biggest challenge free text | Enter biggest CX challenge. | Stored in `biggestChallenge`. Minimum 1 character. This field feeds directly into journey prompt. | P0 | Yes |
| ONB-014 | Timeframe selection | Select timeframe option. | Stored in `timeframe`. | P1 | Yes |
| ONB-015 | Optional fields accepted | Fill only required fields, skip all optional fields. Complete wizard. | Wizard completes successfully. Optional fields (companyWebsite, revenueModel, avgDealSize, salesCycle, churnRate, npsScore, competitors, techStack, etc.) stored as undefined/null. | P1 | Yes |
| ONB-016 | All 33+ fields reach journey prompt | Complete onboarding with all fields filled. Inspect the prompt sent to Claude. | `buildJourneyPrompt()` receives all fields from OnboardingData. No field is dropped between wizard submission and prompt construction. Verify: companyName, vertical, companySize, companyMaturity, customerDescription, customerSize, mainChannel, painPoints, biggestChallenge, primaryGoal, timeframe, revenueModel, avgDealSize, salesCycle, churnRate, npsScore, csatScore, competitors, techStack, teamSize, monthlyActiveUsers, topFeature, onboardingTime, supportVolume, retentionRate, hasCxTeam, hasOnboarding, hasSuccessManager, hasSupportTicketing, hasCustomerFeedback, measuresNps, measuresCsat, enrichmentData. | P0 | No |

### 2.2 Company Enrichment

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| ENR-001 | Enrichment with valid website | Enter company name "Stripe" and website "stripe.com". Trigger enrichment. | API fetches website content (8s timeout), sends to Claude (12s timeout, claude-haiku-4-5), returns enrichedData with: suggestedVertical, suggestedIndustry, suggestedCompanySize, description, suggestedCompetitors, suggestedCustomerSize, suggestedMainChannel, officialCompanyName, confidence, reasoning. | P0 | Yes |
| ENR-002 | Enrichment without website — auto-discovery | Enter company name "Notion" with no website. Trigger enrichment. | API tries `notion.com`, `notion.io`, `notion.ai`, `notion.co` in order. First successful fetch is used. If all fail, Claude enriches from company name alone. | P1 | Yes |
| ENR-003 | Enrichment — website timeout | Enter a website that takes >8s to respond. | Website fetch times out at 8s. Falls back to meta tag extraction or company-name-only enrichment. No crash. | P1 | Yes |
| ENR-004 | Enrichment — Claude timeout | Website fetched successfully but Claude API takes >12s. | Returns partial result or error gracefully. vercel.json `maxDuration: 30` applies. | P1 | Yes |
| ENR-005 | Enrichment — SSRF protection | Enter `http://localhost:3000` or `http://169.254.169.254` as website. | Request is rejected before fetch. Returns error. | P1 | Yes |
| ENR-006 | Enrichment — garbage content detection | Enter website that returns mostly HTML boilerplate (< meaningful text). | Detected as garbage content. Falls back to meta tags (title, description, og:description). | P2 | Yes |
| ENR-007 | Enrichment results populate form | Enrichment returns suggestedVertical, suggestedCompanySize, etc. | Suggestions are shown to user and can be accepted/modified. Fields pre-fill but user can override. | P0 | No |
| ENR-008 | Enrichment failure is non-blocking | Force enrichment to fail (invalid API key). | User can proceed with manual entry. Enrichment failure does not block wizard completion. | P0 | Yes |

### 2.3 Wizard Navigation & State

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| ONB-NAV-001 | Step forward/back navigation | Fill step 1, advance. Fill step 2, go back to step 1. | Step 1 fields retain their values. No data loss on back navigation. | P0 | Yes |
| ONB-NAV-002 | Cannot skip steps | Attempt to jump from step 1 directly to step 4 (e.g. via URL manipulation). | Wizard enforces sequential progression. | P1 | Yes |
| ONB-NAV-003 | Browser refresh during onboarding | Fill 3 steps, refresh the page. | Behavior depends on implementation — if sessionStorage is used for wizard state, data persists. If not, data is lost and user restarts. Document actual behavior. | P1 | No |
| ONB-NAV-004 | Wizard completion — anonymous mode | Complete wizard without being logged in. | Data stored in sessionStorage. User redirected to journey page with `?id=preview` parameter. | P0 | Yes |
| ONB-NAV-005 | Wizard completion — authenticated mode | Log in, then complete wizard. | Data stored in Supabase via API. User redirected to journey page with template ID. | P0 | Yes |

---

## 3. Journey Page

### 3.1 Data Loading

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| JRN-001 | Load journey in preview mode | Complete onboarding anonymously. Arrive at `/journey?id=preview`. | Journey data loaded from sessionStorage key. Page renders with all stages and moments. | P0 | Yes |
| JRN-002 | Load journey in authenticated mode | Complete onboarding while logged in. Navigate to journey page. | Journey data loaded from Supabase via `/api/journey/${templateId}`. | P0 | Yes |
| JRN-003 | Missing journey data — preview | Navigate to `/journey?id=preview` with empty sessionStorage. | Appropriate error state or redirect to onboarding. No blank page or crash. | P1 | Yes |
| JRN-004 | Missing journey data — authenticated | Navigate to `/journey/${invalidId}` while logged in. | Error state shown or redirect. No crash. | P1 | Yes |

### 3.2 Journey Content & Structure

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| JRN-005 | Journey stages render | Load a completed journey. | All stages render with: stage name, description, list of moments. Stages follow the lifecycle (e.g. Awareness, Consideration, Onboarding, Adoption, Retention, Expansion, Advocacy — adapted to company). | P0 | Yes |
| JRN-006 | Moments within stages | Expand a stage. | Each moment shows: title, description, customer action, company action, emotion, friction level, evidence/pain point connection. | P0 | Yes |
| JRN-007 | Pain points traced to moments | Complete onboarding with specific pain points. View journey. | `addressesPainPoints` field on moments references the user's selected pain points. At least one moment per pain point. | P0 | No |
| JRN-008 | Visual view mode | Click "visual" / timeline view toggle. | Journey displays as visual timeline with stage progression. | P1 | Yes |
| JRN-009 | Cards view mode | Click "cards" view toggle. | Journey displays as expandable card-based layout with stage details. | P1 | Yes |
| JRN-010 | Company name personalization | Complete onboarding for "Acme Corp". View journey. | Company name "Acme Corp" appears in journey content — stage descriptions, moment narratives. Not generic "your company". | P0 | No |

### 3.3 Cross-Links & Navigation

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| JRN-011 | Link to confrontation page | Click CX Report / confrontation link from journey page. | Navigates to `/confrontation` with correct data context. | P1 | Yes |
| JRN-012 | Link to playbook page | Click playbook link from journey page. | Navigates to `/playbook`. | P1 | Yes |
| JRN-013 | Evidence map built | Load journey page after onboarding. | Evidence map is constructed from onboarding data + journey output, connecting pain points to specific moments and insights. | P0 | No |

### 3.4 Background Playbook Pre-Generation

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| JRN-014 | Playbook pre-generation fires | Load journey page. Check network requests. | After journey loads, a fire-and-forget request is sent to generate playbook recommendations in the background. | P1 | Yes |
| JRN-015 | Pre-generation failure is non-blocking | Force playbook API to fail. Load journey page. | Journey page renders fully. Pre-generation failure is silent. User can still manually generate playbook later. | P1 | Yes |

### 3.5 PDF Export

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| JRN-016 | PDF export triggers print dialog | Click PDF export button on journey page. | Browser print dialog opens. PrintCover component is included. Print CSS applies. | P1 | No |
| JRN-017 | PDF export — tier gate | As a free user (with gates enabled), click PDF export. | Export is blocked or limited per tier access matrix (`pdf_export` requires full_analysis tier). | P2 | Yes |

---

## 4. CX Report / Confrontation

### 4.1 Confrontation Modes

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| CONF-001 | Early stage mode — pre_launch | Complete onboarding with maturity "pre_launch". Navigate to confrontation. | Confrontation renders in `early_stage` mode. Content is prescriptive (what will happen) not diagnostic (what is happening). | P0 | No |
| CONF-002 | Early stage mode — first_customers | Complete onboarding with maturity "first_customers". Navigate to confrontation. | Confrontation renders in `early_stage` mode (first_customers maps to early_stage). | P0 | No |
| CONF-003 | Growing mode | Complete onboarding with maturity "growing". Navigate to confrontation. | Confrontation renders in `growing` mode. Content reflects growth-stage CX challenges. | P0 | No |
| CONF-004 | Established mode | Complete onboarding with maturity "scaling". Navigate to confrontation. | Confrontation renders in `established` mode. Content reflects scale-stage CX challenges. | P0 | No |

### 4.2 Impact Projections

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| CONF-005 | HeroImpactCard renders | Load confrontation page. | Hero card at top shows dollar-value impact projection. Values parsed from journey output `impactProjections`. Range shown as +/-30%. | P0 | Yes |
| CONF-006 | Dollar values parsed correctly | Journey output contains impact projection like "$150,000". | HeroImpactCard extracts numeric value and displays range (e.g. "$105,000 - $195,000"). | P1 | Yes |
| CONF-007 | Missing impact projections | Journey output has no impactProjections or empty array. | HeroImpactCard handles gracefully — shows fallback or is hidden. No crash. | P1 | Yes |

### 4.3 Insight Cards

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| CONF-008 | Insights grouped by likelihood | Load confrontation page with multiple insights. | Insights are sorted into groups: high likelihood = "Urgent", medium = "Important", low = "On radar". | P0 | Yes |
| CONF-009 | Evidence annotations on insights | Load confrontation for a company with specific pain points. | Insights show evidence annotations: pain point badges linking back to onboarding selections, competitor context where relevant. | P0 | No |
| CONF-010 | Insight detail expansion | Click on an insight card. | Card expands to show full detail: description, evidence, recommended action, expected impact. | P1 | Yes |

### 4.4 Tier Gates (when GATES_DISABLED = false)

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| CONF-011 | Free user — UpgradeGate | Set `GATES_DISABLED = false`. Load confrontation as free user. | UpgradeGate component renders, blurring detailed content behind upgrade CTA. Headlines visible (`report_headlines` feature = free tier). | P1 | Yes |
| CONF-012 | Free user — LockedSection | As free user, scroll to detailed report sections. | LockedSection component blocks content entirely with lock icon and upgrade message. `report_details` feature requires full_analysis tier. | P1 | Yes |
| CONF-013 | Paid user — full access | Load confrontation as full_analysis or pro user. | All content visible. No UpgradeGate or LockedSection rendered. | P1 | Yes |

---

## 5. Playbook

### 5.1 Loading & Generation

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| PB-001 | Pre-generated playbook loads | Navigate from journey page (which pre-generates). Wait, then go to `/playbook`. | Playbook page polls sessionStorage every 2s. If pre-generated data found, loads immediately. | P0 | Yes |
| PB-002 | Polling timeout — manual generation | Navigate to `/playbook` without pre-generated data. Wait 12s. | Polling gives up after ~12s (6 polls at 2s intervals). Manual "Generate" button becomes available. | P1 | Yes |
| PB-003 | Manual generation — success | Click "Generate playbook" button. Wait for completion. | Loading state shown. API call made with 290s timeout. Recommendations load with full content. | P0 | No |
| PB-004 | Manual generation — timeout | Force API to take >290s. | Timeout error shown. User can retry. No infinite loading state. | P1 | No |

### 5.2 Recommendation Content

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| PB-005 | Recommendation fields present | Load playbook. Expand a recommendation. | Each recommendation has: action, priority, effort, owner, timing, template, expectedOutcome, measureWith, toolsUsed. | P0 | Yes |
| PB-006 | Company-specific recommendations | Complete onboarding for a B2B SaaS company. View playbook. | Recommendations reference the specific company context — vertical-specific suggestions, tool-specific integrations, company-name references. Not generic CX advice. | P0 | No |
| PB-007 | Recommendations link to journey moments | Expand a recommendation. | Recommendation connects back to specific journey moments that it addresses. Cross-reference is present. | P1 | No |

### 5.3 Filters & Status Tracking

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| PB-008 | Filter — all | Click "All" filter. | All recommendations shown. | P1 | Yes |
| PB-009 | Filter — must_do | Click "Must Do" filter. | Only high-priority recommendations shown. | P1 | Yes |
| PB-010 | Filter — quick_wins | Click "Quick Wins" filter. | Only low-effort, high-impact recommendations shown. | P1 | Yes |
| PB-011 | Status tracking — checkbox persistence | Check a recommendation as "done". Refresh page. | Checkbox state persists via localStorage key `cx-mate-rec-status`. | P1 | Yes |
| PB-012 | Status tracking — cycle | Click status on a recommendation multiple times. | Status cycles: not_started -> done (or similar cycle). | P2 | Yes |

### 5.4 Export

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| PB-013 | Export — Copy for NotebookLM | Click "Copy for NotebookLM" export option. | Playbook content copied to clipboard in NotebookLM-compatible format. Toast/confirmation shown. | P1 | No |
| PB-014 | Export — Open NotebookLM | Click "Open NotebookLM" option. | New tab opens to NotebookLM URL. Content should be ready to paste. | P2 | No |
| PB-015 | Export — Open in Claude | Click "Open in Claude" option. | New tab opens to Claude URL. Content formatted for Claude input. | P2 | No |
| PB-016 | Export — Open in ChatGPT | Click "Open in ChatGPT" option. | New tab opens to ChatGPT URL. Content formatted for ChatGPT input. | P2 | No |

### 5.5 Tier Gate

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| PB-017 | Free user — playbook locked | Set `GATES_DISABLED = false`. Navigate to playbook as free user. | Locked message shown with $149 CTA to upgrade. Playbook feature requires `full_analysis` tier. | P1 | Yes |
| PB-018 | Paid user — full playbook | Navigate to playbook as full_analysis user. | Full playbook content accessible. No lock overlay. | P1 | Yes |

---

## 6. CX Review / QBR

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| QBR-001 | QBR page exists | Navigate to QBR / CX Review page URL. | Page loads or shows appropriate "coming soon" / tier gate if not yet built. | P2 | No |
| QBR-002 | QBR data references journey | Load QBR after completing a full analysis. | QBR content references journey stages, moments, and recommendations from the same analysis. | P2 | No |
| QBR-003 | QBR shows progress over time | Run two analyses at different times. View QBR. | QBR shows comparison or progress tracking between analyses (if implemented). | P2 | No |

> **Note:** QBR/CX Review is part of the Annual Retainer tier (Pro). Tests will be expanded once this feature is fully implemented.

---

## 7. Auth & Account

### 7.1 Signup

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| AUTH-001 | Signup with email/password | Navigate to `/auth`. Enter email, password, company name. Click Sign Up. | Account created in Supabase Auth. `user_metadata` includes `company_name`. Confirmation email sent (if email confirmation enabled). | P0 | Yes |
| AUTH-002 | Signup — beta mode invite code | Set `NEXT_PUBLIC_BETA_MODE=true`. Navigate to `/auth`. | Invite code field appears on signup form. Code is required to complete signup. | P0 | Yes |
| AUTH-003 | Signup — valid invite code in beta mode | Enter valid invite code during signup. | `/api/invite/validate` returns `{valid:true}`. Signup proceeds. Invite code stored in user metadata. | P0 | Yes |
| AUTH-004 | Signup — invalid invite code in beta mode | Enter "BADCODE" during signup. | `/api/invite/validate` returns `{valid:false, error:"Invalid invite code"}`. Signup blocked with error message. | P0 | Yes |
| AUTH-005 | Signup — exhausted invite code in beta mode | Enter a code where use_count >= max_uses. | Validation returns error: "This invite code has been fully used". Signup blocked. | P1 | Yes |
| AUTH-006 | Signup — deactivated invite code in beta mode | Enter a code where is_active=false. | Validation returns error: "This invite code has been deactivated". Signup blocked. | P1 | Yes |
| AUTH-007 | Signup — duplicate email | Try to sign up with an already-registered email. | Appropriate error message. No duplicate account created. | P1 | Yes |

### 7.2 Login

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| AUTH-008 | Login with valid credentials | Navigate to `/auth`. Switch to login. Enter valid email/password. | Login succeeds. Redirected to dashboard or home. Session cookie set. | P0 | Yes |
| AUTH-009 | Login with invalid credentials | Enter wrong password. | Error message shown. No session created. | P0 | Yes |
| AUTH-010 | Login — retry on network failure | Force first auth request to fail with "Failed to fetch". | `withRetry` retries after 800ms. Second attempt succeeds if network recovers. Up to 2 retries with exponential backoff (800ms x attempt). | P1 | Yes |
| AUTH-011 | Login — all retries exhausted | Force all auth requests to fail. | Error shown after 2 retry attempts. No infinite retry loop. | P1 | Yes |

### 7.3 Session & Org Creation

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| AUTH-012 | Auth callback creates org | New user completes signup and confirms email. | Auth callback (`/auth/callback`) triggers admin client to create org record. `app_metadata.org_id` is set on the user. | P0 | No |
| AUTH-013 | Session persistence | Log in, close browser, reopen. | Session persists via Supabase auth cookies. User is still logged in. | P1 | No |
| AUTH-014 | Logout | Click logout. | Session destroyed. Cookies cleared. Redirected to gate (if password-protected) or home. | P1 | Yes |

---

## 8. Billing & Pricing

### 8.1 Pricing Page

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| BILL-001 | Pricing page renders | Navigate to `/pricing`. | Page loads showing plan tiers: Free, Full Analysis ($149 one-time), Pro ($99/mo). Freemius product ID 25475 configured. | P0 | Yes |
| BILL-002 | Full Analysis plan CTA | Click "Get Full Analysis" or equivalent CTA. | Freemius checkout overlay opens for plan ID 42170 (lifetime license). | P0 | No |
| BILL-003 | Pro plan CTA | Click "Go Pro" or equivalent CTA. | Freemius checkout overlay opens for plan ID 42172 (monthly subscription). | P0 | No |
| BILL-004 | Free tier features listed | View free tier on pricing page. | Shows: journey_map, report_headlines as included. report_details, playbook, pdf_export listed as locked/upgrade. | P1 | Yes |

### 8.2 Webhook Processing

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| BILL-WH-001 | Webhook signature verification | Send webhook with valid HMAC-SHA256 signature. | Webhook accepted and processed. | P0 | Yes |
| BILL-WH-002 | Webhook — invalid signature | Send webhook with tampered signature. | 401 Unauthorized. Webhook rejected. | P0 | Yes |
| BILL-WH-003 | license.created event | Send `license.created` webhook with plan_id=42170. | User's org `plan_tier` updated to "full_analysis" in Supabase. User found by email via `auth.admin.listUsers()` -> `app_metadata.org_id`. | P0 | Yes |
| BILL-WH-004 | license.plan.changed event | Send `license.plan.changed` webhook with new plan_id=42172. | User's org `plan_tier` updated to "pro". | P1 | Yes |
| BILL-WH-005 | subscription.cancelled event | Send `subscription.cancelled` webhook. | User's org `plan_tier` reset to "free". | P1 | Yes |
| BILL-WH-006 | subscription.expired event | Send `subscription.expired` webhook. | User's org `plan_tier` reset to "free". | P1 | Yes |
| BILL-WH-007 | Webhook — unknown user email | Send webhook with email not in auth system. | Error logged. No crash. Webhook returns appropriate error status. | P1 | Yes |

### 8.3 Plan Tier Hook

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| BILL-HOOK-001 | usePlanTier returns correct tier | Log in as user with full_analysis plan. | `usePlanTier()` returns `{tier:"full_analysis", isPaid:true, loading:false}`. | P0 | Yes |
| BILL-HOOK-002 | canAccess — free features | As free user, call `canAccess("journey_map")`. | Returns true (journey_map available at free tier). | P1 | Yes |
| BILL-HOOK-003 | canAccess — paid features | As free user, call `canAccess("playbook")`. | Returns false (playbook requires full_analysis). | P1 | Yes |
| BILL-HOOK-004 | Dev override | Set `window.__DEV_PLAN_TIER = "pro"`. Reload. | `usePlanTier()` returns `{tier:"pro"}` regardless of actual plan. Dev-only escape hatch. | P2 | Yes |
| BILL-HOOK-005 | GATES_DISABLED = true | With current config (`GATES_DISABLED = true` in tier-access.ts). Call `canAccess` for any feature. | All features return accessible. Gates are bypassed. | P0 | Yes |

### 8.4 Tier Access Matrix

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| TIER-001 | Free tier access | Check all features for free tier. | Allowed: journey_map, report_headlines. Denied: report_details, playbook, pdf_export, evidence_wall, unlimited_runs, cx_score, review_mining, integrations. | P1 | Yes |
| TIER-002 | Full Analysis tier access | Check all features for full_analysis tier. | Allowed: journey_map, report_headlines, report_details, playbook, pdf_export, evidence_wall. Denied: unlimited_runs, cx_score, review_mining, integrations. | P1 | Yes |
| TIER-003 | Pro tier access | Check all features for pro tier. | Allowed: all features including unlimited_runs, cx_score, review_mining, integrations. | P1 | Yes |

---

## 9. Middleware & Routing

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| MW-001 | Gate redirect when no cookie | Set `SITE_PASSWORD`. Clear `beta_access` cookie. Navigate to `/`. | Redirected to `/gate`. | P0 | Yes |
| MW-002 | Gate redirect — deep links | Clear cookie. Navigate to `/journey`, `/playbook`, `/dashboard`. | Each route redirects to `/gate`. | P0 | Yes |
| MW-003 | Allowed routes bypass gate | Clear cookie. Navigate to `/gate`. | Page loads (no redirect loop). | P0 | Yes |
| MW-004 | API gate route bypasses gate | Clear cookie. POST to `/api/gate`. | Request proceeds (not redirected to /gate page). | P0 | Yes |
| MW-005 | API waitlist route bypasses gate | Clear cookie. POST to `/api/waitlist`. | Request proceeds. | P0 | Yes |
| MW-006 | Billing webhook bypasses gate | Clear cookie. POST to `/api/billing/webhook/...`. | Request proceeds (pathname.startsWith("/api/billing/webhook") check). | P0 | Yes |
| MW-007 | Valid cookie grants access | Set `beta_access=granted` cookie. Navigate to `/`. | Page loads normally. No redirect. | P0 | Yes |
| MW-008 | Invalid cookie value rejected | Set `beta_access=wrong` cookie. Navigate to `/`. | Redirected to `/gate`. Cookie value must be exactly "granted". | P1 | Yes |
| MW-009 | No SITE_PASSWORD — gate disabled | Unset `SITE_PASSWORD` env var. Navigate to `/`. | Page loads normally. `isPasswordProtected()` returns false, gate is entirely bypassed. | P0 | Yes |
| MW-010 | Static files bypass middleware | Request `/_next/static/...`, `/_next/image/...`, `/favicon.ico`, `/*.svg`, `/*.png`. | Middleware matcher excludes these patterns. Files served directly. | P1 | Yes |
| MW-011 | Supabase session updated on every request | Navigate to any page with valid auth. | `updateSession(request)` is called, refreshing the Supabase auth cookie. | P1 | Yes |

---

## 10. API Health & External Services

### 10.1 Health Check API (`/api/health`)

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| HEALTH-001 | All services healthy | All env vars configured. All services reachable. GET `/api/health`. | Response: `{status:"healthy"}` with all services showing `"pass"` and latency values in ms. Services checked: Supabase Auth, Supabase DB, Claude API, Resend, PostHog, App URL. | P0 | Yes |
| HEALTH-002 | Degraded — one service down | Invalidate Resend API key. GET `/api/health`. | Response: `{status:"degraded"}`. Resend shows `"fail"`. Other services show `"pass"`. | P1 | Yes |
| HEALTH-003 | Unhealthy — critical service down | Invalidate Supabase URL. GET `/api/health`. | Response: `{status:"unhealthy"}`. Supabase Auth and Supabase DB show `"fail"`. | P1 | Yes |
| HEALTH-004 | Claude API health check | GET `/api/health` — inspect Claude check. | Health check sends a minimal request to Claude API using `CX_MATE_ANTHROPIC_API_KEY`. Returns pass/fail + latency. | P1 | Yes |
| HEALTH-005 | PostHog check | GET `/api/health` — inspect PostHog check. | PostHog availability checked. Returns pass/warn/fail based on configuration. | P2 | Yes |

### 10.2 External Service Timeouts

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| EXT-001 | Journey generation — client timeout | Start journey generation. Observe client behavior. | Client timeout set at 180s. If exceeded, user sees timeout error with retry option. | P1 | No |
| EXT-002 | Journey generation — server timeout | Check vercel.json config for onboarding route. | `maxDuration: 300` set for onboarding and recommendations routes. | P0 | Yes |
| EXT-003 | Enrichment — server timeout | Check vercel.json config for enrich-company route. | `maxDuration: 30` set for enrich-company route. | P1 | Yes |
| EXT-004 | Claude API — model and tokens | Inspect journey generation API call. | Model: `claude-sonnet-4-20250514`. Max tokens: 8192. API key from `CX_MATE_ANTHROPIC_API_KEY`. | P0 | Yes |
| EXT-005 | Claude JSON repair | Generate a journey. Inspect JSON parsing. | JSON repair handles: trailing commas, control characters, preamble text before JSON, malformed escapes. See `generate-journey.ts`. | P1 | No |

---

## 11. Email Notifications

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| EMAIL-001 | Waitlist signup notification | Submit waitlist form with all fields. | Email sent via Resend to `DIGEST_EMAIL`. From: `CX Mate <noreply@cxmate.io>`. Subject: `New waitlist signup: {name} from {company}`. Body includes: name, email, company, role, cx_challenge, referral_source. | P1 | No |
| EMAIL-002 | Waitlist notification — missing company | Submit waitlist without company field. | Email subject shows "unknown company" for missing company. Body shows "—" for empty fields. | P2 | No |
| EMAIL-003 | Missing Resend config — no crash | Unset `RESEND_API_KEY`. Submit waitlist. | Waitlist submission succeeds. Email silently skipped. Console warning logged. | P1 | Yes |
| EMAIL-004 | Missing DIGEST_EMAIL — no crash | Unset `DIGEST_EMAIL` but keep `RESEND_API_KEY`. Submit waitlist. | Email sending is skipped (both must be present). Waitlist still succeeds. | P2 | Yes |

---

## 12. Cross-Page Data Integrity

### 12.1 Onboarding -> Journey Chain

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| XDATA-001 | All onboarding fields reach journey prompt | Fill all onboarding fields. Generate journey. Inspect prompt sent to Claude. | Every field from OnboardingData is present in the prompt built by `buildJourneyPrompt()`. No field is silently dropped. Critical fields: companyName, vertical, companySize, companyMaturity, customerDescription, customerSize, mainChannel, painPoints, biggestChallenge, primaryGoal, timeframe, enrichmentData (if available). | P0 | No |
| XDATA-002 | Enrichment data flows to prompt | Complete onboarding with enrichment. Generate journey. | `enrichmentData` fields (suggestedVertical, suggestedCompetitors, description, etc.) appear in the prompt's company context section. | P1 | No |
| XDATA-003 | Pain points preserved end-to-end | Select 3 specific pain points in onboarding. View journey moments. View confrontation insights. | Selected pain points appear in: (1) journey prompt, (2) journey moment `addressesPainPoints` fields, (3) confrontation evidence annotations. | P0 | No |

### 12.2 Journey -> Confrontation Chain

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| XDATA-004 | Confrontation receives journey output | Generate journey. Navigate to confrontation. | Confrontation page receives: confrontationInsights, impactProjections from the journey generation output. | P0 | Yes |
| XDATA-005 | Confrontation mode matches maturity | Select "growing" in onboarding. View confrontation. | Confrontation is in "growing" mode (not early_stage or established). Maturity mapping: pre_launch/first_customers -> early_stage, growing -> growing, scaling -> established. | P0 | No |
| XDATA-006 | Impact projections flow correctly | Generate journey with financial context (avgDealSize, churnRate). View confrontation. | HeroImpactCard values reference the company's actual financial context, not generic numbers. | P1 | No |

### 12.3 Journey -> Playbook Chain

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| XDATA-007 | Playbook recommendations reference journey | Generate journey and playbook. Compare outputs. | Playbook recommendations reference specific journey stages and moments. Actions are contextual to the mapped journey, not generic. | P0 | No |
| XDATA-008 | Playbook tools match tech stack | Enter specific tech stack in onboarding (e.g. "HubSpot, Intercom"). View playbook. | Recommendations reference the user's actual tools, not generic "use a CRM" advice. `toolsUsed` field on recommendations matches. | P1 | No |

### 12.4 Preview vs Authenticated Mode Parity

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| XDATA-009 | Preview mode data consistency | Complete full flow anonymously (preview mode). | All pages (journey, confrontation, playbook) load from sessionStorage. Data is consistent across pages. No data loss between page navigations. | P0 | No |
| XDATA-010 | Authenticated mode data consistency | Complete full flow while logged in. | All pages load from Supabase. Data is consistent across pages. Refresh any page — data persists from database. | P0 | No |
| XDATA-011 | Preview to authenticated migration | Complete flow in preview mode. Then sign up/log in. | Preview data should be saveable to the authenticated account. Or user is prompted to re-run analysis. No silent data loss. | P1 | No |

### 12.5 Evidence Traceability

| ID | Description | Steps | Expected Result | Priority | Auto |
|----|-------------|-------|-----------------|----------|------|
| XDATA-012 | Evidence map connects all layers | Complete full analysis. Navigate across journey, confrontation, playbook. | Evidence map (built on journey page) connects: onboarding pain points -> journey moments -> confrontation insights -> playbook actions. Each layer references the prior. | P0 | No |
| XDATA-013 | No orphan pain points | Select 4 pain points. View journey. | Every selected pain point is addressed by at least one journey moment (via `addressesPainPoints`). No pain point is silently ignored. | P0 | No |
| XDATA-014 | Confrontation insights trace to moments | View confrontation insights. Cross-reference with journey moments. | Each insight has a traceable connection to one or more journey moments. Evidence annotations show which moment generated the insight. | P1 | No |

---

## Appendix A: Test Environment Setup

### Environment Variables Required

| Variable | Purpose | Required For |
|----------|---------|-------------|
| `SITE_PASSWORD` | Enables beta gate | Gate tests |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | All auth/data tests |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin access | Invite codes, waitlist, webhooks |
| `CX_MATE_ANTHROPIC_API_KEY` | Claude API access | Journey, enrichment, playbook |
| `RESEND_API_KEY` | Email sending | Email notification tests |
| `DIGEST_EMAIL` | Notification recipient | Email notification tests |
| `NEXT_PUBLIC_BETA_MODE` | Enables invite code on signup | Auth beta mode tests |
| `FREEMIUS_SECRET_KEY` | Webhook signature verification | Billing webhook tests |
| `NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY` | Freemius checkout | Pricing page tests |

### Supabase Tables Required

| Table | Fields Used | Tests |
|-------|-------------|-------|
| `invite_codes` | id, code, max_uses, use_count, is_active | GATE-008 through GATE-012, AUTH-003 through AUTH-006 |
| `waitlist` | name, email, company, role, cx_challenge, referral_source, status | WL-API-001 through WL-API-006 |
| `organizations` | id, plan_tier | BILL-WH-003 through BILL-WH-006 |

### Key Constants

| Constant | Value | Location |
|----------|-------|----------|
| `GATES_DISABLED` | `true` (current) | `src/lib/tier-access.ts` |
| Claude model | `claude-sonnet-4-20250514` | Journey/playbook generation |
| Claude enrichment model | `claude-haiku-4-5` | `src/app/api/enrich-company/route.ts` |
| Max tokens (journey) | `8192` | Journey generation |
| Max tokens (enrichment) | `1024` | Enrichment API |
| Website fetch timeout | `8000ms` | Enrichment API |
| Claude enrichment timeout | `12000ms` | Enrichment API |
| Client journey timeout | `180000ms` | Journey page |
| Server journey maxDuration | `300s` | `vercel.json` |
| Playbook poll interval | `2000ms` | Playbook page |
| Playbook poll max attempts | `~6` (12s / 2s) | Playbook page |
| Playbook generation timeout | `290000ms` | Playbook page |
| Beta cookie name | `beta_access` | Middleware + Gate API |
| Beta cookie max age | `2592000s` (30 days) | Gate API |
| Freemius product ID | `25475` | Pricing page |
| Full Analysis plan ID | `42170` | Pricing + webhooks |
| Pro plan ID | `42172` | Pricing + webhooks |
| Auth retry attempts | `2` | Auth page |
| Auth retry backoff | `800ms x (attempt+1)` | Auth page |

---

## Appendix B: Priority Definitions

| Priority | Meaning | SLA |
|----------|---------|-----|
| **P0** | Blocks core user flow or causes data loss. Must pass before any release. | Fix immediately |
| **P1** | Significant UX degradation or edge case that affects real users. | Fix before next sprint |
| **P2** | Minor polish, rare edge case, or future-feature prep. | Backlog |

---

## Appendix C: Automation Notes

- **Yes (automatable):** Can be tested with Playwright/Cypress E2E tests or API integration tests (supertest/fetch).
- **No (manual):** Requires human judgment (content quality, personalization check, visual inspection) or involves external services that cannot be easily mocked (Freemius overlay, print dialog, clipboard).
- Tests marked "No" should still be run manually before each release per the deploy checklist.

---

## Test Count Summary

| Section | P0 | P1 | P2 | Total |
|---------|-----|-----|-----|-------|
| 1. Gate & Access | 7 | 12 | 3 | 22 |
| 2. Onboarding Wizard | 7 | 15 | 4 | 26 |
| 3. Journey Page | 5 | 9 | 1 | 15 |
| 4. CX Report / Confrontation | 4 | 5 | 0 | 9 |
| 5. Playbook | 3 | 8 | 3 | 14 |
| 6. CX Review / QBR | 0 | 0 | 3 | 3 |
| 7. Auth & Account | 4 | 8 | 0 | 12 |
| 8. Billing & Pricing | 4 | 8 | 2 | 14 |
| 9. Middleware & Routing | 5 | 5 | 0 | 11* |
| 10. API Health & External | 3 | 5 | 1 | 9 |
| 11. Email Notifications | 0 | 2 | 2 | 4 |
| 12. Cross-Page Data Integrity | 6 | 5 | 0 | 11 |
| **TOTAL** | **48** | **82** | **19** | **150** |

*\*MW-011 counted as P1*
