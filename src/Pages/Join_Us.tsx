import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FiCheck, FiArrowRight, FiStar, FiLoader } from "react-icons/fi";
import { createCheckoutSession } from "../Services/Score.service";

type PlanType = "monthly" | "yearly";

interface PricingTier {
  id: PlanType;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  periodText: string;
  badge?: string;
  popular?: boolean;
  savings?: string;
  features: string[];
}

const TIERS: readonly PricingTier[] = [
  {
    id: "monthly",
    name: "Starter",
    duration: "1 Month",
    price: 1000,
    periodText: "per month",
    features: [
      "Access to standard club specs",
      "Member-only equipment discounts",
      "Community forum access",
      "Standard email support",
    ],
  },
  {
    id: "yearly",
    name: "Tour Elite",
    duration: "1 Year",
    price: 8000,
    originalPrice: 12000,
    periodText: "billed annually",
    badge: "Best Value",
    popular: true,
    savings: "Save ₹4,000 (33% off)",
    features: [
      "Full access to custom fitting tools",
      "1x Free custom club fitting consultation",
      "Free workshop grip replacements",
      "Direct line to master clubmakers",
      "VIP tournament & demo day invites",
    ],
  },
] as const;

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const formatRupees = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const checkoutMutation = useMutation({
    mutationFn: (plan: PlanType) => createCheckoutSession(plan),
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      console.error("Missing redirect URL in checkout response:", data);
      setSelectedPlan(null);
    },
    onError: (error) => {
      console.error("Failed to create checkout session:", error);
      setSelectedPlan(null);
    },
  });

  const handleSubscribe = (plan: PlanType) => {
    setSelectedPlan(plan);
    checkoutMutation.mutate(plan);
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-between px-4 py-14 selection:bg-neutral-900 selection:text-white sm:px-6 sm:py-24">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-96 w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-neutral-200/40 via-neutral-100/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        {/* Header */}
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl md:text-5xl">
            Invest in your game.
          </h1>
          <p className="text-sm font-normal leading-relaxed text-neutral-600 sm:text-base">
            Choose the membership timeline that works for you. All plans include
            full access to custom fitting tools, workshop rates, and member
            perks.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {TIERS.map((tier) => {
            const isTierProcessing =
              checkoutMutation.isPending && selectedPlan === tier.id;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 sm:p-8 ${
                  tier.popular
                    ? "border-2 border-neutral-950 bg-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] md:-translate-y-2"
                    : "border border-black/[0.08] bg-white/80 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.05)] hover:border-black/[0.15] hover:bg-white"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-neutral-950 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md">
                    <FiStar className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                    <span>{tier.badge}</span>
                  </div>
                )}

                {/* Plan Info */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold tracking-tight text-neutral-950">
                      {tier.name}
                    </span>
                    {tier.savings && (
                      <span className="rounded-full border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        {tier.savings}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
                      {formatRupees(tier.price)}
                    </span>
                    {tier.originalPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        {formatRupees(tier.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs font-normal text-neutral-500">
                    {tier.periodText} ({tier.duration})
                  </p>

                  <div className="my-6 h-px w-full bg-neutral-100" />

                  {/* Feature List */}
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[13px] text-neutral-700"
                      >
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                          <FiCheck className="h-2.5 w-2.5 text-neutral-900" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dynamic Button CTA */}
                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={checkoutMutation.isPending}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-xs font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px] ${
                      tier.popular
                        ? "bg-neutral-950 text-white shadow-md hover:bg-neutral-800"
                        : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                    }`}
                  >
                    {isTierProcessing ? (
                      <>
                        <FiLoader className="h-3.5 w-3.5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Subscribe{" "}
                          {tier.id === "yearly" ? "Annually" : "Monthly"}
                        </span>
                        <FiArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
