"use client";

import Link from "next/link";

const navItems = [
  { label: "Agent", icon: "smart_toy", href: "/agent" },
  { label: "Finance", icon: "account_balance_wallet", href: "/finance" },
  { label: "Study", icon: "menu_book", href: "/study" },
  { label: "Calendar", icon: "calendar_today", href: "/calendar" },
];

const bottomItems = [
  { label: "Help", icon: "help" },
  { label: "Settings", icon: "settings" },
];

export default function Sidebar({ activePage }: { activePage: string }) {
  return (
    <aside
      aria-label="Sidebar Navigation"
      className="hidden md:flex flex-col h-full py-6 fixed left-0 top-0 w-sidebar-width bg-surface-container border-r border-white/5 shadow-xl z-40"
    >
      <nav aria-label="Main Navigation" className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === `/${activePage}`;
          return (
            <Link
              key={item.href}
              className={`group cursor-pointer px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-all duration-200 rounded-r-lg font-label-md text-label-md ${
                isActive
                  ? "bg-primary/10 text-primary border-l-4 border-primary"
                  : "text-on-surface-variant"
              }`}
              href={item.href}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 mt-auto pt-4 border-t border-white/5 space-y-1">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            className="group cursor-pointer text-on-surface-variant px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-all duration-200 rounded-r-lg font-label-md text-label-md"
            href="#"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}
