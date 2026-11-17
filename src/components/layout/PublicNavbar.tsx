'use client';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/src/components/ui';

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Crawford', href: '#crawford' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 min-h-[44px]"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#16A34A] text-white text-sm font-bold"
          >
            S
          </span>
          <span>Study OS</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-2"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            to="/auth?mode=login"
            className="inline-flex min-h-[44px] items-center px-3 text-sm font-semibold text-slate-700 hover:text-slate-900 whitespace-nowrap shrink-0"
          >
            Log in
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="primary" size="sm">
              Sign up
            </Button>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
            <Link
              to="/auth?mode=login"
              onClick={() => setMobileOpen(false)}
              className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
            >
              Log in
            </Link>
            <Link
              to="/auth?mode=signup"
              onClick={() => setMobileOpen(false)}
            >
              <Button variant="primary" fullWidth>
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
