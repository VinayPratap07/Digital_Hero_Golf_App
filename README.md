# Digital Heroes

Full-stack subscription, golf score, charity, and monthly prize-draw platform built according to the Digital Heroes Level 1 PRD.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase Auth + PostgreSQL
- Supabase Edge Functions
- Stripe Checkout + Webhooks
- TanStack Query

## Core Features

### User

- Signup / Login
- Monthly & yearly subscriptions
- Stableford score management (latest 5 scores)
- Charity selection with minimum 10% contribution
- Monthly draw participation
- View winnings and submit winner verification

### Admin

- User & subscription management
- Charity management
- Create, simulate and publish draws
- Winner verification and payout tracking
- Reports & analytics

## Draw System

- Random monthly draw implemented
- 3-match: 25%
- 4-match: 35%
- 5-match: 40%
- 5-match jackpot rolls over when unclaimed
- Draw flow: Create → Simulate → Publish

## Test Accounts

Use these accounts for evaluation:

**User**

- Email: Can be created through normal signup and login process

**Admin**

- Email: `admin@gmail.com`
- Password: `checkout`

## Important Routes

### User

- `/login`
- `/profile`
- `/join-us`
- `/monthly-draw`
- `/charity`
- `/select-charity`
- `/verification`

### Admin

- `/admin/dashboard`
- `/admin/users`
- `/admin/draws`
- `/admin/charities`
- `/admin/winners`
- `/admin/analytics`
- `/admin/verification`

## Evaluation Flow

1. Login as user
2. Check profile, subscription, scores and charity
3. Check monthly draw
4. Login as admin
5. Create → Simulate → Publish a draw
6. Check winners / verification
7. Check analytics

## Environment

Frontend:
`VITE_SUPABASE_URL`
`VITE_SUPABASE_ANON_KEY`

Server-side:
`SUPABASE_URL`
`SUPABASE_SERVICE_ROLE_KEY`
`SUPABASE_ANON_KEY`
`STRIPE_SECRET_KEY`
`STRIPE_MONTHLY_PRICE_ID`
`STRIPE_YEARLY_PRICE_ID`

Never expose service-role or Stripe secret keys in the frontend.

## PRD Alignment

The implementation covers the PRD's main requirements: subscription/payment, score management, monthly draws, prize pools, charity contributions, winner verification, user dashboard, admin controls, and analytics. The PRD also requires deployed user/admin test credentials for evaluation.
