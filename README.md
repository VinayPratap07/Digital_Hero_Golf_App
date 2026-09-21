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

## Table Schemas

### `profiles`

Stores application user profiles and roles.

| Column       | Type        |
| ------------ | ----------- |
| `id`         | uuid        |
| `name`       | text        |
| `role`       | text        |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

> `id` references `auth.users.id`.

### `subscriptions`

Stores user subscription and Stripe information.

| Column                   | Type        |
| ------------------------ | ----------- |
| `id`                     | uuid        |
| `user_id`                | uuid        |
| `plan`                   | text        |
| `status`                 | text        |
| `current_period_start`   | timestamptz |
| `current_period_end`     | timestamptz |
| `created_at`             | timestamptz |
| `updated_at`             | timestamptz |
| `stripe_customer_id`     | text        |
| `stripe_subscription_id` | text        |

### `golf_scores`

Stores user Stableford scores.

| Column       | Type        |
| ------------ | ----------- |
| `id`         | uuid        |
| `user_id`    | uuid        |
| `score_date` | date        |
| `score`      | int4        |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

### `charities`

Stores available charities.

| Column        | Type        |
| ------------- | ----------- |
| `id`          | uuid        |
| `name`        | text        |
| `description` | text        |
| `image_url`   | text        |
| `is_active`   | boolean     |
| `created_at`  | timestamptz |
| `isFeatured`  | boolean     |

### `charity_events`

Stores charity events.

| Column        | Type        |
| ------------- | ----------- |
| `id`          | uuid        |
| `charity_id`  | uuid        |
| `title`       | text        |
| `description` | text        |
| `event_date`  | timestamptz |
| `location`    | text        |
| `created_at`  | timestamptz |

### `charity_selections`

Stores the charity selected by each user.

| Column                    | Type        |
| ------------------------- | ----------- |
| `id`                      | uuid        |
| `user_id`                 | uuid        |
| `charity_id`              | uuid        |
| `contribution_percentage` | numeric     |
| `created_at`              | timestamptz |
| `updated_at`              | timestamptz |

### `charity_contributions`

Stores charity contribution records.

| Column                    | Type        |
| ------------------------- | ----------- |
| `id`                      | uuid        |
| `user_id`                 | uuid        |
| `charity_id`              | uuid        |
| `subscription_id`         | uuid        |
| `amount`                  | numeric     |
| `contribution_percentage` | numeric     |
| `created_at`              | timestamptz |
| `stripe_invoice_id`       | text        |

### `draws`

Stores monthly draw information.

| Column            | Type        |
| ----------------- | ----------- |
| `id`              | uuid        |
| `year`            | int4        |
| `month`           | int4        |
| `draw_type`       | text        |
| `status`          | text        |
| `draw_numbers`    | int4[]      |
| `simulation_data` | jsonb       |
| `created_at`      | timestamptz |
| `published_at`    | timestamptz |

### `draw_entries`

Stores user entries for each draw.

| Column       | Type        |
| ------------ | ----------- |
| `id`         | uuid        |
| `draw_id`    | uuid        |
| `user_id`    | uuid        |
| `scores`     | int4[]      |
| `created_at` | timestamptz |

### `draw_results`

Stores draw results and winnings.

| Column            | Type        |
| ----------------- | ----------- |
| `id`              | uuid        |
| `draw_id`         | uuid        |
| `user_id`         | uuid        |
| `draw_entry_id`   | uuid        |
| `match_type`      | text        |
| `matched_numbers` | int4[]      |
| `prize_amount`    | numeric     |
| `created_at`      | timestamptz |

### `prize_pools`

Stores prize pool allocation.

| Column            | Type    |
| ----------------- | ------- |
| `id`              | uuid    |
| `draw_id`         | uuid    |
| `match_type`      | int4    |
| `percentage`      | numeric |
| `pool_amount`     | numeric |
| `rollover_amount` | numeric |

### `winner_verifications`

Stores winner verification requests.

| Column           | Type        |
| ---------------- | ----------- |
| `id`             | uuid        |
| `draw_result_id` | uuid        |
| `proof_url`      | text        |
| `status`         | text        |
| `admin_notes`    | text        |
| `reviewed_by`    | uuid        |
| `reviewed_at`    | timestamptz |
| `created_at`     | timestamptz |

### `payouts`

Stores winner payout information.

| Column              | Type        |
| ------------------- | ----------- |
| `id`                | uuid        |
| `draw_result_id`    | uuid        |
| `amount`            | numeric     |
| `status`            | text        |
| `payment_reference` | text        |
| `paid_at`           | timestamptz |
| `created_at`        | timestamptz |

## PRD Alignment

The implementation covers the PRD's main requirements: subscription/payment, score management, monthly draws, prize pools, charity contributions, winner verification, user dashboard, admin controls, and analytics. The PRD also requires deployed user/admin test credentials for evaluation.
