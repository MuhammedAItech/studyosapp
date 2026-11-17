'use client';

import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  MessageSquare,
  CalendarDays,
  User,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudyStore } from '@/src/lib/store';

const NAV_ITEMS = [
  { label: 'Home', to: '/app/home', icon: Home },
  { label: 'Practice', to: '/app/practice', icon: BookOpen },
  { label: 'Tutor', to: '/app/tutor', icon: MessageSquare },
  { label: 'Plan', to: '/app/plan', icon: CalendarDays },
  { label: 'Profile', to: '/app/profile', icon: User },
];

export function AppShell() {
  const { state } = useStudyStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row">
      {/* Desktop Left Sidebar (>=1024px) */}
      <aside
        aria-label="App navigation"
        className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 border-r border-slate-200 bg-white px-4 py-6 justify-between"
      >
        <div>
          <Link
            to="/app/home"
            className="flex items-center gap-2.5 px-3 py-2 text-lg font-bold tracking-tight text-slate-900"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#16A34A] text-white text-sm font-bold"
            >
              S
            </span>
            <span>Study OS</span>
          </Link>

          <nav className="mt-6 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                      isActive
                        ? 'bg-green-50 text-[#16A34A]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200/70 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-xs font-semibold text-amber-900 tabular-nums">
                {state.streakDays}d streak
              </span>
            </div>
            <span className="text-xs font-bold text-amber-800 tabular-nums">
              {state.xp} XP
            </span>
          </div>
          <Link
            to="/"
            className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            Back to Landing
          </Link>
        </div>
      </aside>

      {/* Main Content Area (NO top bar) */}
      <main className="flex-1 lg:pl-64 pb-24 lg:pb-10">
        <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Tab Bar (<1024px) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-sm"
      >
        <div className="grid grid-cols-5 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-1.5 text-[11px] font-semibold transition-colors',
                    isActive ? 'text-[#16A34A]' : 'text-slate-500 hover:text-slate-800'
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate max-w-full">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
