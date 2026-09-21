import React from "react";
import {
  HiOutlineTrophy,
  HiOutlineHeart,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlineArrowTrendingUp,
  HiOutlineDocumentCheck,
} from "react-icons/hi2";

interface Step {
  stepNumber: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
}

const steps: readonly Step[] = [
  {
    stepNumber: "01",
    title: "Subscribe & Select Cause",
    description:
      "Pick a flexible plan. At least 10% of every fee goes straight to your selected verified charity.",
    badge: "10%+ Direct Impact",
    icon: <HiOutlineHeart className="h-5 w-5 text-neutral-950" />,
  },
  {
    stepNumber: "02",
    title: "Log 5 Stableford Scores",
    description:
      "Submit your official rounds (1–45 pts). Your rolling 5-score card automatically drops the oldest entry.",
    badge: "Rolling 5-Score Card",
    icon: <HiOutlineArrowTrendingUp className="h-5 w-5 text-neutral-950" />,
  },
  {
    stepNumber: "03",
    title: "Enter the Monthly Draw",
    description:
      "Logged rounds turn into draw entries. Match 3, 4, or 5 numbers to unlock payouts from our prize pool.",
    badge: "3-Tier Cash Pools",
    icon: <HiOutlineTrophy className="h-5 w-5 text-neutral-950" />,
  },
  {
    stepNumber: "04",
    title: "Verify & Claim Payout",
    description:
      "Hit a winning match? Upload a quick score screenshot to verify your round and receive your cash prize directly.",
    badge: "Instant Verification",
    icon: <HiOutlineDocumentCheck className="h-5 w-5 text-neutral-950" />,
  },
] as const;

export const HowItWorks = () => {
  return (
    <section className="relative w-full bg-[#edf3ef] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-neutral-900 transition-colors">
      <div className="mx-auto max-w-6xl space-y-16">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
            <span>Play • Give Back • Win</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl md:text-5xl">
            How Your Rounds Create Impact
          </h2>

          <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
            A purpose-driven golf platform where tracking your performance
            supports causes you care about and qualifies you for monthly cash
            prize pools.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div
              key={item.stepNumber}
              className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:border-neutral-950 hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Step Header */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-wider text-neutral-400">
                    STEP {item.stepNumber}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-950 transition-transform group-hover:scale-105">
                    {item.icon}
                  </div>
                </div>

                {/* Badge */}
                <div>
                  <span className="inline-block rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                    {item.badge}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-1.5 pt-1">
                  <h3 className="text-sm font-bold tracking-tight text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-neutral-600">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Indicator */}
              <div className="mt-5 flex items-center border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-950">
                <span>Learn more</span>
                <HiOutlineArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Impact & Prize Pool Showcase Card */}
        <div className="relative rounded-[2rem] border-2 border-neutral-950 bg-white p-7 shadow-sm sm:p-12">
          {/* Top Edge Badge */}
          <div className="absolute -top-3.5 left-8 inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
            <span>★</span> ALLOCATION
          </div>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Mission Details */}
            <div className="space-y-4 lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                <span>Transparent Breakdown</span>
              </div>

              <h3 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
                Where your contribution goes
              </h3>

              <p className="max-w-lg text-xs leading-relaxed text-neutral-600 sm:text-sm">
                Every subscription creates verifiable social good while directly
                backing the monthly competitive prize pool.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700 sm:text-sm">
                  <HiOutlineCheck className="mt-0.5 h-4 w-4 shrink-0 stroke-[3] text-neutral-950" />
                  <span>
                    <strong className="font-bold text-neutral-950">10%+</strong>{" "}
                    of your plan funds verified partner charities
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700 sm:text-sm">
                  <HiOutlineCheck className="mt-0.5 h-4 w-4 shrink-0 stroke-[3] text-neutral-950" />
                  <span>
                    <strong className="font-bold text-neutral-950">40%</strong>{" "}
                    fuels the 5-match rolling jackpot pool
                  </span>
                </div>
                <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700 sm:text-sm">
                  <HiOutlineCheck className="mt-0.5 h-4 w-4 shrink-0 stroke-[3] text-neutral-950" />
                  <span>
                    <strong className="font-bold text-neutral-950">
                      35% & 25%
                    </strong>{" "}
                    awarded across 4 and 3-number match winners
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Pool Split Surface */}
            <div className="space-y-3 rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-5 sm:p-6 lg:col-span-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Monthly Prize Pool Distribution
              </span>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-neutral-950 sm:text-sm">
                      5-Number Match
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Carries forward if unclaimed
                    </p>
                  </div>
                  <span className="rounded-md bg-neutral-950 px-2.5 py-1 font-mono text-xs font-bold text-white">
                    40% Pool
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-neutral-950 sm:text-sm">
                      4-Number Match
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Split equally among round winners
                    </p>
                  </div>
                  <span className="rounded-md bg-neutral-200 px-2.5 py-1 font-mono text-xs font-bold text-neutral-800">
                    35% Pool
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-neutral-950 sm:text-sm">
                      3-Number Match
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Split equally among round winners
                    </p>
                  </div>
                  <span className="rounded-md bg-neutral-200 px-2.5 py-1 font-mono text-xs font-bold text-neutral-800">
                    25% Pool
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#charity"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-neutral-800 active:scale-95"
                >
                  <span>Select Your Charity</span>
                  <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
