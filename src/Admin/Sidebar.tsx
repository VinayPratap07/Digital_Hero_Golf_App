import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiTarget,
  FiHeart,
  FiAward,
  FiBarChart2,
  FiLogOut,
} from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import { supabase } from "../Lib/SupaBase";
import { useQueryClient } from "@tanstack/react-query";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAVIGATION_SECTIONS: NavSection[] = [
  {
    items: [{ name: "Dashboard", href: "/admin/dashboard", icon: FiGrid }],
  },
  {
    title: "Management",
    items: [{ name: "Users", href: "/admin/users", icon: FiUsers }],
  },
  {
    title: "Operations",
    items: [
      { name: "Draw Management", href: "/admin/draws", icon: FiTarget },
      { name: "Charities", href: "/admin/charities", icon: FiHeart },
      { name: "Verify", href: "/admin/verification", icon: FiAward },
    ],
  },
  {
    title: "Insights",
    items: [{ name: "Analytics", href: "/admin/analytics", icon: FiBarChart2 }],
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      queryClient.clear();
      navigate("/");
    }
  };

  return (
    // shrink-0 prevents flex siblings from squeezing it.
    // sticky top-0 locks it in place during document scrolls.
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-neutral-800 bg-neutral-950 px-4 py-6 text-neutral-300 select-none">
      {/* min-h-0 is required for overflow-y-auto to activate in flex parents */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pr-1">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-black text-neutral-950 shadow-sm">
            D
          </div>
          <span className="text-sm font-bold tracking-wider text-white uppercase">
            Digital Heroes
          </span>
        </div>

        <div className="h-px w-full shrink-0 bg-neutral-900" />

        {/* Dynamic Nav Groups */}
        <nav className="flex flex-col gap-5">
          {NAVIGATION_SECTIONS.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {section.title && (
                <span className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? "bg-neutral-800 text-white font-semibold shadow-inner"
                          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-white" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Settings & Logout */}
      <div className="shrink-0 flex flex-col gap-1 border-t border-neutral-900 pt-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
              isActive
                ? "bg-neutral-800 text-white font-semibold"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`
          }
        >
          <FaHome className="h-4 w-4 shrink-0 transition-colors group-hover:text-white" />
          <span>Home</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/90 transition-all duration-150 hover:bg-red-500/10 hover:text-red-300"
        >
          <FiLogOut className="h-4 w-4 shrink-0 transition-colors group-hover:text-red-300" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
