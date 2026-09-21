import React from "react";
import {
  FiHeart,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({
  number,
  title,
  description,
  icon,
}) => (
  <div className="relative flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-7 shadow-sm transition-all duration-200 hover:border-neutral-950 hover:shadow-md">
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 text-lg">
          {icon}
        </div>
        <span className="font-mono text-2xl font-bold tracking-tight text-neutral-300">
          {number}
        </span>
      </div>
      <h3 className="mb-2 text-lg font-bold text-neutral-900">{title}</h3>
      <p className="text-xs leading-relaxed text-neutral-600">{description}</p>
    </div>
  </div>
);

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#edf3ef] text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-4xl px-6 pb-16 pt-24 text-center sm:pt-28">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm backdrop-blur-sm">
          <FiHeart className="text-neutral-900" /> Purpose-Driven Performance
        </div>

        <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-6xl">
          Play with purpose. <br />
          <span className="text-neutral-900">Win with impact.</span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Digital Heroes bridges athletic consistency with real-world change.
          Turn your monthly Stableford scores into life-changing charity funding
          and monthly reward draws.
        </p>
      </section>

      {/* Philosophy & Metrics Section */}
      <section className="mx-auto max-w-5xl px-6 py-6">
        <div className="relative rounded-[2rem] border-2 border-neutral-950 bg-white p-8 shadow-sm sm:p-12">
          {/* Badge */}
          <div className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase shadow-sm">
            <span>★</span> PHILOSOPHY
          </div>

          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-3 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                Feel, Not Fairway.
              </h2>
              <p className="mb-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Traditional golf tools stop at handicaps and leaderboards. We
                believe performance carries far greater value when tied directly
                to human impact.
              </p>
              <p className="mb-6 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                No outdated traditions, no tartan patterns, and no gatekeeping.
                Just a modern engine empowering golfers to channel active
                gameplay into verifiable social good.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-700">
                  <FiCheck className="h-4 w-4 shrink-0 text-neutral-950 stroke-[3]" />
                  <span>
                    Minimum 10% direct allocation from every membership
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-700">
                  <FiCheck className="h-4 w-4 shrink-0 text-neutral-950 stroke-[3]" />
                  <span>Rolling 5-score Stableford tracking (1–45 points)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-700">
                  <FiCheck className="h-4 w-4 shrink-0 text-neutral-950 stroke-[3]" />
                  <span>Tiered monthly prize pools with rollover jackpots</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 text-center">
                <span className="mb-1 block font-mono text-3xl font-black text-neutral-950">
                  10%+
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Charity Pledge
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 text-center">
                <span className="mb-1 block font-mono text-3xl font-black text-neutral-950">
                  5
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Scores Retained
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 text-center">
                <span className="mb-1 block font-mono text-3xl font-black text-neutral-950">
                  40%
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  5-Match Pool
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 text-center">
                <span className="mb-1 block font-mono text-3xl font-black text-neutral-950">
                  100%
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Verified Proof
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            How The Engine Operates
          </h2>
          <p className="mx-auto max-w-md text-xs text-neutral-500 sm:text-sm">
            Three simple steps designed to keep your focus on your game while
            automating rewards and philanthropy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <StepCard
            number="01"
            title="Subscribe & Select"
            description="Choose a monthly or annual membership and pick a partner cause from our verified directory. At least 10% goes directly to them."
            icon={<FiHeart />}
          />
          <StepCard
            number="02"
            title="Log Your Stableford"
            description="Input your latest round (1–45 points). Our automated rolling mechanism always retains your last 5 scores, replacing the oldest."
            icon={<FiTrendingUp />}
          />
          <StepCard
            number="03"
            title="Draw & Verification"
            description="Enter the monthly draw automatically. Match 3, 4, or 5 numbers for cash pools, backed by full scorecard verification."
            icon={<FiAward />}
          />
        </div>
      </section>

      {/* Platform Integrity Card */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-sm md:flex-row md:p-10">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600">
              <GoShieldCheck className="text-base text-neutral-900" />{" "}
              Transparent Platform Integrity
            </div>
            <h3 className="mb-2.5 text-xl font-bold text-neutral-950 sm:text-2xl">
              Strict Verification. Equal Distribution.
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Every winning ticket requires verified scorecard proof from your
              round before payouts are released. Prize pools are split equally
              among tier winners, with unclaimed pools rolling over to the next
              draw.
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href="/charities"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 px-5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-200/70"
            >
              Explore Causes
            </a>
            <a
              href="/subscribe"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 text-xs font-semibold text-white transition hover:bg-neutral-800 active:scale-95"
            >
              <span>Get Started</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
