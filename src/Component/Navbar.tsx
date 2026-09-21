import { useState, useEffect, useCallback } from "react";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

interface NavLinkItem {
  readonly name: string;
  readonly href: string;
}

interface ActionItem {
  readonly label: string;
  readonly href: string;
}

const NAV_LINKS: readonly NavLinkItem[] = [
  { name: "Home", href: "/" },
  { name: "Monthly", href: "/monthly-draw" },
  { name: "Charity", href: "/charity" },
  { name: "About", href: "/about-us" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const { isAuthenticated, hasActiveSubscription, isLoading } = useAuth();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobileMenu();
    };

    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileMenuOpen, closeMobileMenu]);

  // Consistently returns ActionItem[]
  const getActionConfig = (): readonly ActionItem[] => {
    if (!isAuthenticated) {
      return [
        { label: "Get Started", href: "/signup" },
        { label: "Join Now", href: "/join-us" },
      ];
    }
    if (!hasActiveSubscription) {
      return [
        { label: "Join Now", href: "/join-us" },
        { label: "Profile", href: "/profile" },
      ];
    }
    return [{ label: "Profile", href: "/profile" }];
  };

  const actions = getActionConfig();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 pointer-events-none transition-all duration-300 sm:pt-2.5">
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto relative flex items-center justify-between rounded-full border border-neutral-200/80 bg-white/85 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-out ${
          isScrolled
            ? "w-full max-w-4xl px-4 py-2 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)]"
            : "w-full max-w-6xl px-6 py-2.5 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Brand */}
        <NavLink
          to="/"
          className="group flex items-center gap-2 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-950 text-[11px] font-black text-white transition-transform group-hover:scale-105">
            D
          </div>
          <span className="select-none text-sm font-bold tracking-tight text-neutral-950">
            Digital Heroes
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `relative rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-normal transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 ${
                  isActive
                    ? "bg-neutral-100 text-neutral-950 font-bold"
                    : "text-neutral-600 hover:bg-neutral-100/70 hover:text-neutral-950"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Dynamic Desktop Action Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-full bg-neutral-200/80" />
          ) : (
            actions.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className="group inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-neutral-800 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
              >
                <span>{item.label}</span>
                <FiArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </NavLink>
            ))
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 md:hidden"
        >
          {mobileMenuOpen ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMenu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 pointer-events-auto md:hidden"
        >
          <div
            className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div className="absolute inset-x-4 top-20 mx-auto max-w-sm flex flex-col gap-3 rounded-3xl border border-neutral-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-950 font-bold"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="my-0.5 h-px w-full bg-neutral-100" />

            {/* Dynamic Mobile Action Buttons */}
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <div className="h-10 w-full animate-pulse rounded-full bg-neutral-200/80" />
              ) : (
                actions.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-neutral-950 py-3 text-xs font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
                  >
                    <span>{item.label}</span>
                    <FiArrowUpRight className="h-3.5 w-3.5" />
                  </NavLink>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
