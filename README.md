# Digital Heroes

> A full-stack subscription, golf performance, charity, and monthly prize-draw platform.

## 1. Project Overview

Digital Heroes is a full-stack web application built around:

- Monthly and yearly subscriptions
- Golf Stableford score tracking
- Charity selection and contributions
- Monthly prize draws
- Prize pools and jackpot rollover
- Winner verification
- Winner payouts
- Admin management
- Analytics and reporting
- Stripe subscription/payment integration

The application is built with React, TypeScript, TanStack Query, Supabase, PostgreSQL, Supabase Auth, Supabase Edge Functions, and Stripe.

This project was also my first substantial project working with **Supabase and PostgreSQL**, including authentication, relational database design, RLS, PostgreSQL functions/RPCs, triggers, Edge Functions, webhooks, and service-role operations.

---

# 2. Technology Stack

## Frontend

- React
- TypeScript
- React Router
- TanStack Query
- Vite
- Tailwind CSS
- Axios / Supabase Client

## Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Edge Functions
- PostgreSQL RPC functions
- PostgreSQL triggers
- Row Level Security (RLS)

## Payments

- Stripe
- Stripe Checkout
- Stripe Webhooks

---

# 3. Architecture

```text
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │ React + TypeScript   │
                         │ TanStack Query       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          Direct Supabase Queries             Edge Functions
          protected by RLS                    privileged logic
                                                     │
                                                     ▼
                                            PostgreSQL / Supabase
                                                     │
                                                     ▼
                                                   Stripe
```

The frontend uses direct Supabase queries for operations that can safely be protected by RLS.

Sensitive operations such as:

- Admin operations
- Stripe operations
- Draw creation
- Draw simulation
- Draw publishing
- Winner verification
- Payout workflows

are handled through Edge Functions and/or PostgreSQL functions.

The Supabase service-role key is never intended to be exposed to the frontend.

---

# 4. Database Schema

Main application tables:

```text
profiles
subscriptions
golf_scores

charities
charity_events
charity_selections
charity_contributions

draws
draw_entries
prize_pools
draw_results

winner_verifications
payouts
```

## Profiles

Stores application-level user information and role.

Roles:

```text
user
admin
```

Authentication itself is handled by Supabase Auth.

New users are initialized through the database trigger flow:

```text
Supabase Auth User Created
          |
          v
      profiles row
          |
          v
   default subscription
```

---

# 5. Subscription System

Users can subscribe using:

```text
Monthly Plan
Yearly Plan
```

Subscription information includes fields such as:

```text
user_id
status
plan
stripe_customer_id
stripe_subscription_id
current_period_start
current_period_end
```

The application synchronizes subscription state using Stripe webhooks.

Relevant Stripe events include:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
```

The subscription lifecycle is mapped into the application's local subscription statuses.

---

# 6. Golf Score System

Users can manage their golf Stableford scores.

Each score contains information such as:

```text
id
user_id
score_date
score
created_at
updated_at
```

Score requirements:

- Score between 1 and 45
- Date required
- Latest 5 scores retained for draw participation
- Duplicate same-date score restrictions
- Newer scores replace older scores when the five-score limit is reached

The draw system snapshots the eligible user's scores into `draw_entries`, so later score changes do not modify an already-created draw entry.

---

# 7. Charity System

Charity-related tables:

```text
charities
charity_events
charity_selections
charity_contributions
```

Users can select an active charity and specify their contribution percentage.

The project requirement defines a minimum charity contribution of:

```text
10%
```

Users can contribute more than the minimum.

The charity system supports:

- Charity listing
- Charity selection
- Contribution tracking
- Charity events
- Per-charity contribution analytics

---

# 8. Draw System

The monthly draw lifecycle is:

```text
DRAFT
   |
   v
SIMULATED
   |
   v
PUBLISHED
   |
   v
COMPLETED
```

Draw types:

```text
random
algorithmic
```

The currently implemented draw type is:

```text
random
```

Algorithmic/weighted draw functionality is planned but not currently implemented.

---

# 9. Prize Pool

The prize pool is divided as follows:

| Match | Allocation |
|---|---:|
| 5 matches | 40% |
| 4 matches | 35% |
| 3 matches | 25% |

The `prize_pools` table contains:

```text
draw_id
match_type
percentage
pool_amount
rollover_amount
```

The 5-match jackpot rolls over when there is no 5-match winner.

The PostgreSQL function used for prize-pool calculation is:

```text
calculate_draw_prize_pool
```

### Current development/test pool

The current implementation uses:

```text
100000
```

as a temporary base pool amount.

This is **not final production business logic**. The final rules for allocating subscription revenue to the prize pool, charity, and monthly/yearly plans still need to be finalized.

---

# 10. Draw Creation

Admin Edge Function:

```text
create-draw
```

The function:

1. Authenticates the admin.
2. Validates year and month.
3. Checks whether a draw already exists.
4. Finds eligible active subscribers.
5. Creates the draw.
6. Creates draw entries.
7. Snapshots the latest user scores.
8. Creates the prize-pool records.

---

# 11. Draw Simulation

Admin Edge Function:

```text
simulate-draw
```

The simulation:

- Generates five unique numbers from 1–45.
- Calculates matching numbers for draw entries.
- Determines 3/4/5 match categories.
- Calculates simulated prize distribution.
- Stores simulation information.
- Changes the draw status from `DRAFT` to `SIMULATED`.

Simulation does not publish the draw.

---

# 12. Draw Publishing

Admin Edge Function:

```text
publish-draw
```

Publishing:

1. Validates that the draw has been simulated.
2. Retrieves the simulated winning numbers.
3. Saves the winning numbers.
4. Calculates the final prize pools.
5. Calculates draw results.
6. Calculates 5-match rollover where applicable.
7. Changes the draw status to `PUBLISHED`.

The winning numbers/results should not be exposed to normal users before publication.

---

# 13. User Draw Page

The public monthly draw page can display the current draw information even before publication.

For a draft/simulated draw:

```text
5 Match Prize Pool
4 Match Prize Pool
3 Match Prize Pool
```

are visible.

Winning numbers remain hidden until the draw is published.

After publication, users can see:

- Winning numbers
- Their matched numbers
- Their match category
- Their prize
- Whether they won

The draw information endpoint is designed to work for both guests and authenticated users.

---

# 14. Winner Verification

Only winners need to submit verification.

User workflow:

```text
Winner
   |
   v
Submit proof/screenshot
   |
   v
winner_verifications
   |
   v
Admin review
   |
   +-------> REJECTED
   |
   v
APPROVED
   |
   v
Payout created
```

Admin can approve or reject winner verification.

---

# 15. Payouts

The `payouts` table tracks winner payments.

Important information includes:

```text
draw_result_id
amount
status
payment_reference
paid_at
```

Current payout statuses:

```text
pending
paid
```

The admin panel provides payout-related information and winner management.

---

# 16. Admin Panel

The admin panel contains the following areas:

```text
Dashboard
Users
Draws
Charities
Winners
Analytics
Winner Verification
```

Admin authorization is enforced server-side by checking the authenticated user's profile role.

A user with a non-admin role cannot access protected admin Edge Functions.

---

# 17. Admin Routes

The React Router configuration currently exposes the following admin routes.

## Admin Dashboard

```text
/admin/dashboard
```

Provides the main administrative overview.

---

## User Management

```text
/admin/users
```

Admin can manage users and inspect user-related information.

The admin user-management backend can expose:

- Profile
- Email
- Subscription
- Charity selection
- Charity
- Charity contributions
- Golf scores
- Draw entries
- Wins
- Winner verification
- Payout information
- User statistics

---

## Draw Management

```text
/admin/draws
```

Used for:

- Creating draws
- Viewing draws
- Simulating draws
- Publishing draws
- Managing draw lifecycle

---

## Charity Management

```text
/admin/charities
```

Used for:

- Viewing charities
- Adding charities
- Editing charities
- Deleting/managing charities
- Managing charity content/media

---

## Winners

```text
/admin/winners
```

Used for:

- Viewing winners
- Viewing winning results
- Reviewing prize information
- Managing winner-related information

---

## Analytics

```text
/admin/analytics
```

Provides administrative statistics such as:

- Total users
- Active subscribers
- Subscription breakdown
- Golf score statistics
- Charity contributions
- Prize pool totals
- Rollover totals
- Draw statistics
- Draw participation
- Winners
- Winner verification status
- Payout status
- Monthly statistics

---

## Winner Verification

```text
/admin/verification
```

Used by admins to:

- View pending winner verification requests
- Review submitted proof
- Approve verification
- Reject verification
- Trigger the payout workflow after approval

---

# 18. Public/User Routes

The current frontend routes are:

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/charity` | Charity page |
| `/join-us` | Subscription page |
| `/monthly-draw` | Monthly draw |
| `/verification` | Winner verification |
| `/about-us` | About page |
| `/profile` | User profile |
| `/select-charity` | Charity selection |
| `/payment-gateway` | Payment flow |
| `/login` | Login |
| `/signup` | Signup |

---

# 19. Admin Access

Admin routes should be accessed after logging in with an account whose profile has:

```text
role = admin
```

Example:

```text
http://localhost:5173/admin/dashboard
```

For the deployed application, replace `http://localhost:5173` with the deployed website URL.

### Important

The frontend route itself is not the security boundary.

The admin Edge Functions independently verify:

```text
Authenticated user
        |
        v
profiles.role
        |
        v
admin
```

Therefore, manually entering an admin URL does not grant admin privileges.

---

# 20. Tester Credentials

The PRD requires both user and admin test credentials.

## Test User

```text
Email:
<INSERT TEST USER EMAIL>

Password:
<INSERT TEST USER PASSWORD>
```

## Test Admin

```text
Email:
<INSERT TEST ADMIN EMAIL>

Password:
<INSERT TEST ADMIN PASSWORD>
```

### Important

These credentials must correspond to real Supabase Auth users in the deployed project.

They are intentionally left as placeholders here because the supplied project documentation does not contain actual test-account credentials. Do not invent credentials in the README; replace the placeholders with the real accounts created in the Supabase Auth dashboard before handing the project to a tester.

Suggested dedicated accounts:

```text
tester@digitalheroes.com
admin@digitalheroes.com
```

Use strong passwords for the actual deployed accounts.

---

# 21. Suggested Tester Flow

## A. User Testing

Login using the test-user account.

### Step 1 — Profile

Open:

```text
/profile
```

Verify:

- User information
- Subscription information
- Golf information
- Charity information

### Step 2 — Subscription

Open:

```text
/join-us
```

Test:

```text
Monthly subscription
Yearly subscription
```

The application uses Stripe Checkout.

### Step 3 — Golf Scores

Add golf scores and verify:

- Valid score range
- Score date
- Latest five scores
- Update
- Delete

### Step 4 — Charity

Open:

```text
/charity
```

or:

```text
/select-charity
```

Select a charity and verify the contribution percentage.

### Step 5 — Monthly Draw

Open:

```text
/monthly-draw
```

Verify that the current prize pools can be displayed before publication.

After an admin publishes a draw, verify:

- Winning numbers
- Match result
- Prize amount

### Step 6 — Winner Verification

If the test user is a winner:

```text
/verification
```

Submit the required proof.

---

# 22. Suggested Admin Testing Flow

Login using the test-admin account.

Then open:

```text
/admin/dashboard
```

Test each section.

### Users

```text
/admin/users
```

Verify:

- User list
- User details
- Subscription
- Golf scores
- Charity
- Draw entries
- Wins
- Verification
- Payout information

### Draws

```text
/admin/draws
```

Test:

```text
Create
    ↓
Simulate
    ↓
Publish
```

### Charities

```text
/admin/charities
```

Test charity management.

### Winners

```text
/admin/winners
```

Verify winner records.

### Verification

```text
/admin/verification
```

Test:

```text
Pending
   ↓
Approve / Reject
```

### Analytics

```text
/admin/analytics
```

Verify dashboard statistics.

---

# 23. Admin Analytics

The analytics API is designed to provide enough data for the admin dashboard.

## Users

```text
Total users
Total profiles
Admins
Active subscribers
Inactive subscribers
Subscriber percentage
```

## Subscriptions

```text
Total subscriptions
Active
Inactive
Cancelled
Trialing
Past due
Monthly
Yearly
Active monthly
Active yearly
```

## Golf

```text
Total scores
Users with scores
Average score
Highest score
Lowest score
```

## Charities

```text
Total charities
Active charities
Inactive charities
Charity events
Charity selections
Users with charity selection
Contribution total
Per-charity breakdown
```

## Draws

```text
Total draws
Draft draws
Simulated draws
Published draws
Completed draws
Random draws
Algorithmic draws
```

## Draw participation

```text
Total draw entries
Unique participants
Average entries per draw
Participation rate
```

## Prize pools

```text
Total prize pool
Total rollover
Total awards
3-match pool
4-match pool
5-match pool
```

## Winners

```text
Total winning results
Unique winners
3-match winners
4-match winners
5-match winners
Prize amount by match type
```

## Winner verification

```text
Pending
Approved
Rejected
```

## Payouts

```text
Total payouts
Total payout amount
Paid payouts
Paid amount
Pending payouts
Pending amount
Failed payouts
Failed amount
Payout rate
```

## Monthly statistics

The API also supports monthly data for dashboard charts covering:

- New users
- Golf scores
- Draw entries
- Prize pool
- Rollover
- Prizes awarded
- Charity contributions
- Payouts

---

# 24. Stripe Integration

The application uses Stripe for subscription checkout and subscription lifecycle synchronization.

Edge Functions:

```text
create-checkout
stripe-webhook
```

The checkout flow is:

```text
Frontend
   |
   v
create-checkout Edge Function
   |
   v
Stripe Checkout
   |
   v
Stripe subscription
   |
   v
stripe-webhook
   |
   v
Supabase subscriptions
```

### Stripe Test Mode

During development, Stripe test-mode products/prices must be used with the test secret key.

The checkout function expects environment variables similar to:

```text
STRIPE_SECRET_KEY
STRIPE_MONTHLY_PRICE_ID
STRIPE_YEARLY_PRICE_ID
```

Price IDs must be actual Stripe Price IDs beginning with:

```text
price_
```

Do not use Product IDs (`prod_...`) as Price IDs.

---

# 25. Supabase Edge Functions

## User Functions

```text
set-charity-selection
get-latest-draw
get-my-profile
submit-winner-verification
```

## Admin Functions

```text
create-draw
simulate-draw
publish-draw
get-pending-verifications
review-winner-verification
admin users endpoint
admin-update-user
admin-delete-user
```

## Stripe Functions

```text
create-checkout
stripe-webhook
```

---

# 26. PostgreSQL Functions / RPC

Important database functions:

```text
calculate_draw_prize_pool
calculate_draw_results
```

These functions keep important draw calculations on the database side rather than trusting frontend calculations.

---

# 27. Security Model

The intended security architecture is:

```text
Frontend
   |
   | JWT
   v
Edge Function
   |
   +--> Authenticate user
   |
   +--> Verify role
   |
   +--> Validate input
   |
   v
Service Role / PostgreSQL
```

Important security principles:

- Supabase service-role key must never be exposed to the frontend.
- Admin functions verify the user's role.
- Sensitive business logic is handled server-side.
- RLS protects direct database access.
- Stripe secrets remain server-side.
- Winner verification and payout operations are privileged operations.
- Public draw information should not expose simulated winning numbers before publication.

---

# 28. Current Completed Functionality

The project currently contains:

```text
✓ Supabase authentication
✓ Profile creation
✓ Default subscription creation
✓ Subscription retrieval
✓ Stripe checkout
✓ Stripe customer reuse
✓ Stripe webhook integration
✓ Subscription status synchronization
✓ Charity listing
✓ Charity selection
✓ Golf score CRUD
✓ Draw creation
✓ Draw entry snapshots
✓ Prize pool creation
✓ Draw simulation
✓ Draw result calculation
✓ Draw publishing
✓ Prize rollover
✓ Latest draw API
✓ Public draw information
✓ User profile aggregation
✓ Winner proof submission
✓ Admin pending verification list
✓ Admin winner approval/rejection
✓ Payout creation after approval
✓ Expanded admin user information
✓ Admin analytics
```

---

# 29. Known / Planned Limitations

The following items are not final production business logic yet.

## Prize Pool Funding

Current test base pool:

```text
100000
```

The final subscription-revenue allocation rules still need to be defined.

## Algorithmic Draw

The PRD supports:

```text
Random
Algorithmic / weighted
```

Currently implemented:

```text
Random
```

Algorithmic draw weighting is still pending.

## Draw Eligibility

The current draw creation process uses active subscribers.

The exact final rule for users with fewer than five golf scores still needs final business confirmation.

## Yearly Subscription Allocation

The exact monthly allocation of yearly subscription revenue still needs to be finalized.

## Charity Contribution Webhook

The `invoice.paid` charity contribution workflow has been drafted and requires final deployment/testing confirmation.

## Payout Management

The payout workflow supports creation after winner approval. Final admin handling for marking pending payouts as paid should be tested end-to-end.

## Final Security Audit

RLS policies, Edge Function authorization, public endpoints, and privileged service-role operations should receive a final security audit before production launch.

---

# 30. PRD Requirement Coverage

The project is designed around the following major requirements:

### User Panel

```text
✓ Signup / Login
✓ Subscription
✓ Golf score entry
✓ Charity selection
✓ Monthly draw
✓ User dashboard/profile
✓ Winner verification
```

### Admin Panel

```text
✓ User management
✓ Draw management
✓ Charity management
✓ Winner management
✓ Winner verification
✓ Analytics
```

### Draw System

```text
✓ Monthly draw
✓ Random draw
✓ Simulation
✓ Publishing
✓ Prize tiers
✓ Equal winner distribution
✓ Jackpot rollover
```

### Charity

```text
✓ Charity selection
✓ Minimum contribution requirement
✓ Contribution tracking
✓ Charity analytics
```

### Payments

```text
✓ Stripe Checkout
✓ Monthly subscription
✓ Yearly subscription
✓ Stripe webhook synchronization
```

---

# 31. Local Development

Start the frontend with:

```bash
npm install
npm run dev
```

The development frontend is configured around:

```text
http://localhost:5173
```

Admin dashboard:

```text
http://localhost:5173/admin/dashboard
```

---

# 32. Environment Variables

The frontend requires the appropriate Supabase public configuration.

Typical frontend variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Supabase Edge Functions require server-side secrets such as:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY

STRIPE_SECRET_KEY
STRIPE_MONTHLY_PRICE_ID
STRIPE_YEARLY_PRICE_ID
```

Never commit secrets to Git.

---

# 33. Recommended Final Testing Checklist

## Authentication

```text
[ ] Signup
[ ] Login
[ ] Logout
[ ] Invalid credentials
[ ] Protected routes
```

## Subscription

```text
[ ] Monthly checkout
[ ] Yearly checkout
[ ] Stripe customer creation
[ ] Existing Stripe customer reuse
[ ] Successful payment
[ ] Subscription webhook
[ ] Subscription status update
```

## Golf

```text
[ ] Add score
[ ] Edit score
[ ] Delete score
[ ] Invalid score rejected
[ ] Latest five scores retained
```

## Charity

```text
[ ] View active charities
[ ] Select charity
[ ] Minimum 10% contribution
[ ] Change charity
[ ] Contribution recorded
```

## Draw

```text
[ ] Create draw
[ ] Create draw entries
[ ] Snapshot scores
[ ] Prize pool created
[ ] Simulate draw
[ ] Publish draw
[ ] Calculate results
[ ] 5-match rollover
[ ] User sees published result
```

## Winner

```text
[ ] Winner identified
[ ] Submit verification
[ ] Admin sees pending verification
[ ] Admin approves
[ ] Admin rejects
[ ] Payout created
```

## Admin

```text
[ ] Dashboard
[ ] Users
[ ] Draws
[ ] Charities
[ ] Winners
[ ] Verification
[ ] Analytics
```

## Security

```text
[ ] Non-admin cannot access admin operations
[ ] Unauthenticated requests rejected where required
[ ] Service-role key not exposed
[ ] RLS policies verified
[ ] Public draw endpoint does not expose simulation data
```

---

# 34. Project Structure

A simplified frontend structure:

```text
src/
├── Admin/
│   ├── Admin.tsx
│   ├── Dashboard.tsx
│   ├── User.tsx
│   ├── Draws.tsx
│   ├── Charities.tsx
│   ├── Winners.tsx
│   ├── Analytics.tsx
│   └── VerifyWinner.tsx
│
├── Pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── HomePage.tsx
│   ├── CharityPage.tsx
│   ├── Join_Us.tsx
│   ├── MonthlyDrawPage.tsx
│   ├── SelectCharityPage.tsx
│   ├── WinnerVerificaitonPage.tsx
│   ├── ProfilePage.tsx
│   ├── PaymentPage.tsx
│   └── AboutUsPage.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

# 35. Frontend Route Configuration

Current route structure:

```text
/
├── /charity
├── /join-us
├── /monthly-draw
├── /verification
├── /about-us
│
├── /admin
│   ├── /dashboard
│   ├── /users
│   ├── /draws
│   ├── /charities
│   ├── /winners
│   ├── /analytics
│   └── /verification
│
├── /profile
├── /select-charity
├── /payment-gateway
├── /login
└── /signup
```

---

# 36. Final Notes for Evaluator

Digital Heroes is a full-stack application where the frontend, database, authentication, backend business logic, and payment system are integrated together.

The recommended evaluation order is:

```text
1. Login
      ↓
2. User profile
      ↓
3. Subscription
      ↓
4. Golf scores
      ↓
5. Charity selection
      ↓
6. Monthly draw
      ↓
7. Admin login
      ↓
8. Create / simulate / publish draw
      ↓
9. Winner verification
      ↓
10. Analytics
```

For administrative testing, use:

```text
/admin/dashboard
/admin/users
/admin/draws
/admin/charities
/admin/winners
/admin/analytics
/admin/verification
```

The application separates normal user functionality from privileged administrative operations and uses Supabase authentication, PostgreSQL, RLS, Edge Functions, and Stripe to implement the core platform.

---

# 37. Tester Credentials — FINAL ENTRY

Replace the following placeholders before submitting the project:

### User Account

```text
Email: YOUR_TEST_USER_EMAIL
Password: YOUR_TEST_USER_PASSWORD
```

### Admin Account

```text
Email: YOUR_TEST_ADMIN_EMAIL
Password: YOUR_TEST_ADMIN_PASSWORD
```

### Admin URL

```text
http://localhost:5173/admin/dashboard
```

For the final deployed project, replace the localhost URL with the live Vercel URL.

