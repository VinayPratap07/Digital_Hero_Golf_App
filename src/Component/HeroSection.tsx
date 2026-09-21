import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { MdOutlineAssignment } from "react-icons/md";
import { Link } from "react-router-dom";

interface StatItem {
  value: string;
  label: string;
}

const STATS: readonly StatItem[] = [
  { value: "30+ Years", label: "Custom Fitting Heritage" },
  { value: "100+", label: "Charities" },
  { value: "2cr+", label: "Amount Raised this month" },
] as const;

export default function HeroSection() {
  return (
    <section className="relative w-full px-3 sm:px-6 pt-4 mt-16 sm:pt-4 pb-8">
      {/* Outer Card Container */}
      <div className="relative min-h-[85svh] w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col justify-between items-center text-center px-4 sm:px-8 py-16 sm:py-20">
        {/* Background Layer with Subtle Scale */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=2000&q=80')`,
          }}
          aria-hidden="true"
        />

        {/* Ambient Overlays for Depth and Contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/70 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Tag / Pill Badge */}
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white text-md font-medium tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Since 1995 • Handcrafted Performance</span>
          </div>
        </div>

        {/* Center Content Body */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center my-auto py-8">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-bold tracking-tight text-white leading-[1.12] tracking-tighter">
            More Than Just A Game
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-md sm:text-base md:text-lg text-neutral-300 font-normal max-w-2xl leading-relaxed text-balance">
            Play golf. Earn points. Support charities.
            <br />
            Win amazing prizes
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-sm sm:max-w-md">
            {/* Primary Action Button */}
            <Link
              to="/signup"
              className="w-full sm:w-auto flex-1 group inline-flex items-center justify-center gap-2 bg-white text-neutral-950 hover:bg-neutral-100 text-xs sm:text-base font-semibold px-6 py-3.5 rounded-full shadow-lg transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Get Started</span>
              <FiArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Frosted Glass CTA */}
            <a
              href="#spec-sheet"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium px-6 py-3.5 rounded-full shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <MdOutlineAssignment className="w-4 h-4 text-white/80" />
              <span>Learn More</span>
            </a>
          </div>

          {/* Micro Reassurance */}
          <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
            <span className="inline-flex items-center gap-1.5">
              <FiCheckCircle className="text-emerald-400 w-3.5 h-3.5" /> Direct
              Workshop Pricing
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FiCheckCircle className="text-emerald-400 w-3.5 h-3.5" /> Built
              to Exact Specs
            </span>
          </div>
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="relative z-10 w-full max-w-3xl pt-6 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-base sm:text-xl font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-md sm:text-md text-neutral-400 font-light mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
