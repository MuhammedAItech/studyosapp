'use client';

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
  ScreenSkeleton,
} from '@/src/components/ui';
import { validateAuthForm } from '@/src/lib/study-logic';
import { useStudyStore } from '@/src/lib/store';

const AUTH_PROVIDERS: ReadonlyArray<'google' | 'apple' | 'email'> = [
  'google',
  'apple',
  'email',
];

export function AuthScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, hydrated, loginMockUser, logoutUser, showToast } =
    useStudyStore();

  const mode: 'login' | 'signup' =
    searchParams.get('mode') === 'login' ? 'login' : 'signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(true);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <ScreenSkeleton />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <ErrorState
          message={authError}
          onRetry={() => setAuthError(null)}
          onBack={() => navigate('/')}
        />
      </div>
    );
  }

  if (AUTH_PROVIDERS.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <EmptyState
          title="No sign-in methods available"
          description="Return to the landing page and try again."
          actionLabel="Back to Home"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  const handleOAuthPlaceholder = (provider: 'google' | 'apple') => {
    loginMockUser({
      provider,
      consentConfirmed: true,
    });
    showToast(
      `Signed in with ${provider === 'google' ? 'Google' : 'Apple'} (demo)`,
      'success'
    );
    navigate('/onboarding');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateAuthForm({
      mode,
      name,
      email,
      password,
      consentChecked,
    });
    setErrors(validation.errors);
    if (!validation.valid) return;

    loginMockUser({
      name: mode === 'signup' ? name : email.split('@')[0],
      email,
      provider: 'email',
      consentConfirmed: consentChecked,
    });
    showToast(
      mode === 'signup' ? 'Account created (demo)' : 'Welcome back (demo)',
      'success'
    );
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-sm font-bold text-slate-900">Study OS</span>
        </div>

        {state.user && (
          <Card padding="sm" className="border-green-200 bg-green-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-green-900">
                Signed in as {state.user.name}
              </p>
              <p className="text-xs text-green-800 truncate">{state.user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  navigate(state.onboarding.completed ? '/app/home' : '/onboarding')
                }
              >
                Continue
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logoutUser();
                  showToast('Signed out', 'info');
                }}
              >
                Sign out
              </Button>
            </div>
          </Card>
        )}

        <Card className="space-y-6">
          <div className="space-y-2">
            <div
              role="tablist"
              aria-label="Authentication mode"
              className="grid grid-cols-2 rounded-xl bg-slate-100 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => {
                  setSearchParams({ mode: 'signup' });
                  setErrors({});
                }}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                onClick={() => {
                  setSearchParams({ mode: 'login' });
                  setErrors({});
                }}
                className={`min-h-[44px] rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Log in
              </button>
            </div>

            <h1 className="pt-2 text-2xl font-bold tracking-tight text-slate-900">
              {mode === 'signup'
                ? 'Create your Study OS account'
                : 'Welcome back to Study OS'}
            </h1>
            <p className="text-sm text-slate-500">
              Demo auth: any provider button signs in a mock student profile.
            </p>
          </div>

          <div className="space-y-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => handleOAuthPlaceholder('google')}
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-8.97Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => handleOAuthPlaceholder('apple')}
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 fill-slate-900"
                viewBox="0 0 24 24"
              >
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43Zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45Z" />
              </svg>
              <span>Continue with Apple</span>
            </Button>

            <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowEmailForm((prev) => !prev)}
            >
              <Mail className="h-4 w-4" />
              <span>
                {showEmailForm ? 'Continue with Email below' : 'Use Email'}
              </span>
            </Button>
          </div>

          {showEmailForm && (
            <form
              onSubmit={handleEmailSubmit}
              className="space-y-4 border-t border-slate-100 pt-5"
              noValidate
            >
              {mode === 'signup' && (
                <Input
                  label="Full name"
                  type="text"
                  placeholder="e.g. Chinedu Okafor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  autoComplete="name"
                />
              )}

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete={
                  mode === 'signup' ? 'new-password' : 'current-password'
                }
              />

              <div className="space-y-1.5">
                <label className="flex min-h-[44px] items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  <span className="text-sm text-slate-700">
                    I&apos;m 18+ or have parental consent
                    {mode === 'signup' ? '.' : ' (optional on log in).'}
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-xs font-medium text-[#DC2626]" role="alert">
                    {errors.consent}
                  </p>
                )}
              </div>

              <Button type="submit" variant="primary" fullWidth size="lg">
                {mode === 'signup' ? 'Create account with Email' : 'Log in with Email'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
