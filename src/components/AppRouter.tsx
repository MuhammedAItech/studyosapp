'use client';

import React, { useSyncExternalStore } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { StudyStoreProvider } from '@/src/lib/store';
import { ErrorState, ScreenSkeleton, ToastViewport } from '@/src/components/ui';
import { AppShell } from '@/src/components/layout/AppShell';
import { LandingScreen } from '@/src/screens/LandingScreen';
import { AuthScreen } from '@/src/screens/AuthScreen';
import { OnboardingScreen } from '@/src/screens/OnboardingScreen';
import { HomeScreen } from '@/src/screens/HomeScreen';
import { PracticeSubjectsScreen } from '@/src/screens/PracticeSubjectsScreen';
import { PracticeTopicsScreen } from '@/src/screens/PracticeTopicsScreen';
import { PracticeQuestionScreen } from '@/src/screens/PracticeQuestionScreen';
import { PracticeResultsScreen } from '@/src/screens/PracticeResultsScreen';
import { CbtSimulatorScreen } from '@/src/screens/CbtSimulatorScreen';
import { TutorScreen } from '@/src/screens/TutorScreen';
import { PlanScreen } from '@/src/screens/PlanScreen';
import { TimerScreen } from '@/src/screens/TimerScreen';
import { ShellPlaceholderScreen } from '@/src/screens/ShellPlaceholderScreen';

const emptySubscribe = () => () => {};

function NotFoundScreen() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <ErrorState
        title="Page not found"
        message="That Study OS route does not exist."
        onBack={() => navigate('/')}
      />
    </div>
  );
}

export function AppRouter() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ScreenSkeleton />
      </div>
    );
  }

  return (
    <StudyStoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />

          <Route path="/app/cbt" element={<CbtSimulatorScreen />} />

          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/home" replace />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="practice" element={<PracticeSubjectsScreen />} />
            <Route
              path="practice/:subjectId"
              element={<PracticeTopicsScreen />}
            />
            <Route
              path="practice/:subjectId/:topicId"
              element={<PracticeQuestionScreen />}
            />
            <Route
              path="practice/:subjectId/:topicId/results"
              element={<PracticeResultsScreen />}
            />
            <Route path="tutor" element={<TutorScreen />} />
            <Route path="plan" element={<PlanScreen />} />
            <Route path="timer" element={<TimerScreen />} />
            <Route
              path="profile"
              element={<ShellPlaceholderScreen section="Profile" />}
            />
          </Route>

          <Route path="*" element={<NotFoundScreen />} />
        </Routes>
        <ToastViewport />
      </BrowserRouter>
    </StudyStoreProvider>
  );
}
