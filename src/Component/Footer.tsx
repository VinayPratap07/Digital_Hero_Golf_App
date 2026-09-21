import { NavLink } from "react-router-dom";
import { FiMail, FiShield, FiHeart, FiAward } from "react-icons/fi";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

interface FooterLink {
  name: string;
  href: string;
  isExternal?: boolean;
}

const PRODUCT_LINKS: FooterLink[] = [
  { name: "Monthly Draw", href: "/monthly-draw" },
  { name: "Charity Partners", href: "/charity" },
  { name: "Leaderboard", href: "/winners" },
  { name: "Membership Plans", href: "/join-us" },
];

const COMPANY_LINKS: FooterLink[] = [
  { name: "About Us", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Transparency & Odds", href: "/fairness" },
  { name: "Careers", href: "/careers" },
];

const LEGAL_LINKS: FooterLink[] = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Draw Rules", href: "/rules" },
  { name: "Responsible Play", href: "/responsible-play" },
];

const SOCIAL_LINKS = [
  { name: "Twitter", href: "https://twitter.com", icon: FaTwitter },
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { name: "GitHub", href: "https://github.com", icon: FaGithub },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200/80 bg-[#edf3ef] text-neutral-600 select-none">
      {/* Top Banner: Trust & Impact Callout */}
      <div className="border-b border-neutral-200/80 bg-white/60 px-6 py-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-950 shadow-sm">
                <FiShield className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-950">
                  100% Verifiable Draws
                </p>
                <p className="text-xs text-neutral-500">
                  Transparent algorithmic and random distribution
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-950 shadow-sm">
                <FiHeart className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-950">
                  Charity First
                </p>
                <p className="text-xs text-neutral-500">
                  A set portion of every pass funds certified causes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/80 bg-white text-neutral-950 shadow-sm">
                <FiAward className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-950">
                  Guaranteed Payouts
                </p>
                <p className="text-xs text-neutral-500">
                  Audited score proof and instant prize transfers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter Column (Spans 5 cols) */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-950 text-xs font-black text-white shadow-sm">
                D
              </div>
              <span className="text-base font-extrabold tracking-tight text-neutral-950">
                Digital Heroes
              </span>
            </div>

            <p className="max-w-sm text-xs leading-relaxed text-neutral-600 sm:text-sm">
              The premier subscription golf community where regular rounds
              compete for monthly pools while supporting certified charitable
              initiatives.
            </p>

            {/* Newsletter Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                Monthly Draw Updates
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex max-w-md items-center rounded-full border border-neutral-300/80 bg-white p-1.5 shadow-sm transition focus-within:border-neutral-950"
              >
                <div className="pl-3 text-neutral-400">
                  <FiMail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  className="w-full bg-transparent px-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800 active:scale-95"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Navigation Links (Spans 7 cols) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                Product
              </span>
              <ul className="flex flex-col gap-2.5 text-xs font-medium sm:text-sm">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.href}
                      className="text-neutral-600 transition-colors hover:text-neutral-950"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                Organization
              </span>
              <ul className="flex flex-col gap-2.5 text-xs font-medium sm:text-sm">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.href}
                      className="text-neutral-600 transition-colors hover:text-neutral-950"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-950">
                Compliance
              </span>
              <ul className="flex flex-col gap-2.5 text-xs font-medium sm:text-sm">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.href}
                      className="text-neutral-600 transition-colors hover:text-neutral-950"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Socials */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200/80 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-500 text-center sm:text-left">
            © {currentYear} Digital Heroes Foundation. All rights reserved.
            Registered gaming and non-profit partner.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200/80 bg-white text-neutral-600 shadow-sm transition hover:border-neutral-950 hover:text-neutral-950"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
