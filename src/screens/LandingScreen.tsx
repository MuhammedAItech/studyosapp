'use client';

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Flame,
  ArrowRight,
  GraduationCap,
  Clock,
  BookOpen,
} from 'lucide-react';
import { PublicNavbar } from '@/src/components/layout/PublicNavbar';
import {
  Button,
  Card,
  Badge,
  ScreenSkeleton,
  EmptyState,
  ErrorState,
} from '@/src/components/ui';
import { LANDING_FEATURES, PRICING_TIERS } from '@/src/data/exams';
import { useStudyStore } from '@/src/lib/store';

export function LandingScreen() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { hydrated, showToast } = useStudyStore();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!hydrated || !hash) return;
    const id = hash.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [hydrated, hash]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <ScreenSkeleton />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="mx-auto max-w-md px-4 py-12">
          <ErrorState
            message="Could not load Study OS landing page."
            onRetry={() => setHasError(false)}
          />
        </div>
      </div>
    );
  }

  if (LANDING_FEATURES.length === 0 || PRICING_TIERS.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <PublicNavbar />
        <div className="mx-auto max-w-md px-4 py-12">
          <EmptyState
            title="Study OS info unavailable"
            description="Continue to sign in or create your exam prep workspace."
            actionLabel="Go to Sign up"
            onAction={() => navigate('/auth?mode=signup')}
          />
        </div>
      </div>
    );
  }

  const handleSelectPlan = (planName: string) => {
    showToast(`${planName} selected for demo signup`, 'info');
    navigate('/auth?mode=signup');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNavbar />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-16 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#16A34A]">
                <span>JAMB</span>
                <span aria-hidden="true">·</span>
                <span>WAEC</span>
                <span aria-hidden="true">·</span>
                <span>NECO</span>
                <span aria-hidden="true">·</span>
                <span>Crawford University Pilot</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight [text-wrap:balance]">
                Your calm daily workspace for passing Nigerian exams.
              </h1>

              <p className="max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
                Study OS pairs Notion-clean daily study plans with focused JAMB,
                WAEC, and NECO drills, plus a real-feel CBT simulator and
                Crawford University course prep.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/auth?mode=signup">
                  <Button variant="primary" size="lg">
                    Get started free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button variant="outline" size="lg">
                    I already have an account
                  </Button>
                </Link>
              </div>
            </div>

            {/* Clean Notion + Duolingo preview card (SVG/CSS only, zero external images) */}
            <div className="lg:col-span-5">
              <Card className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Exam Countdown
                    </p>
                    <p className="text-xl font-bold text-slate-900 tabular-nums">
                      JAMB in 47 days
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5">
                    <Flame className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-sm font-bold text-amber-900 tabular-nums">
                      6d
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-slate-500">
                    Today&apos;s plan (Sample)
                  </p>
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0" />
                    <span className="line-through text-slate-400">
                      Review Quadratic Equations formulas
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800">
                    <BookOpen className="h-4 w-4 text-[#16A34A] shrink-0" />
                    <span>Solve 5 Use of English Concord questions</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800">
                    <Clock className="h-4 w-4 text-slate-500 shrink-0" />
                    <span>Timed JAMB CBT mini-drill (20m)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 4 Feature Blocks */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 border-t border-slate-200/80"
        >
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Built for focus on low-data Nigerian mobile networks
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Clean typography, fast screens, and distraction-free CBT practice.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {LANDING_FEATURES.map((feature) => (
              <Card key={feature.number} className="space-y-2">
                <p className="text-xs font-bold text-[#16A34A] tabular-nums">
                  {feature.number}
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Crawford University Pilot */}
        <section
          id="crawford"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 border-t border-slate-200/80"
        >
          <Card className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#16A34A]">
                  <GraduationCap className="h-5 w-5" />
                  <span>Crawford University Pilot</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  From UTME admission straight into 100L–300L semester success
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  During onboarding, Crawford University students can attach
                  pilot courses like CSC 201, GST 102, and BUS 301 to keep
                  semester revision organized in the same workspace.
                </p>
              </div>
              <div className="lg:col-span-5 flex flex-wrap gap-2 lg:justify-end">
                <Badge tone="primary">CSC 201 · Programming</Badge>
                <Badge tone="neutral">GST 102 · Use of English</Badge>
                <Badge tone="neutral">BUS 301 · Management</Badge>
                <Badge tone="neutral">ECO 101 · Microeconomics</Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Pricing Table */}
        <section
          id="pricing"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 border-t border-slate-200/80"
        >
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Simple student pricing in Naira
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Start on the free plan and upgrade only when your exam sprint
              begins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={
                  tier.popular
                    ? 'border-[#16A34A] ring-1 ring-[#16A34A] flex flex-col justify-between'
                    : 'flex flex-col justify-between'
                }
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {tier.name}
                    </h3>
                    {tier.popular && <Badge tone="primary">Popular</Badge>}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-900 tabular-nums">
                      {tier.price}
                    </span>
                    <span className="text-xs text-slate-500">{tier.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tier.description}
                  </p>
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5">
                  <Button
                    variant={tier.popular ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => handleSelectPlan(tier.name)}
                  >
                    Choose {tier.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-8 sm:px-6 text-sm text-slate-500">
          <div>
            <span className="font-bold text-slate-900">Study OS</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>Interactive Demo for JAMB, WAEC, NECO &amp; Crawford University</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#pricing" className="hover:text-slate-900">
              Pricing
            </a>
            <Link to="/auth?mode=login" className="hover:text-slate-900">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
