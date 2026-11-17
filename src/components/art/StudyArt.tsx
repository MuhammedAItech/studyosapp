'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function SabiMascot({
  mood = 'happy',
  size = 80,
  className,
}: {
  mood?: 'happy' | 'thinking' | 'celebrate' | 'focused';
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {/* Halo rings inspired by Brainly + Duolingo mascot stage */}
      <circle cx="48" cy="50" r="42" fill="#DCFCE7" />
      <circle cx="48" cy="50" r="33" fill="#BBF7D0" />

      {/* Mortarboard graduation cap */}
      <path d="M48 11L72 20L48 29L24 20L48 11Z" fill="#0F172A" />
      <path d="M34 24V31C34 34 40 37 48 37C56 37 62 34 62 31V24" fill="#1E293B" />
      <path d="M68 22V33" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="68" cy="34.5" r="2.5" fill="#F59E0B" />

      {/* Mascot body (owl-inspired Nigerian scholar character "Sabi") */}
      <rect x="23" y="29" width="50" height="48" rx="24" fill="#16A34A" />
      <path
        d="M31 55C31 46 38.6 40 48 40C57.4 40 65 46 65 55V68C65 73 57.4 77 48 77C38.6 77 31 73 31 68V55Z"
        fill="#F0FDF4"
      />

      {/* Ear tufts */}
      <path d="M26 32L21 24L32 29Z" fill="#15803D" />
      <path d="M70 32L75 24L64 29Z" fill="#15803D" />

      {/* Big expressive Duolingo-style eyes */}
      <circle cx="38" cy="46" r="8.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2" />
      <circle cx="58" cy="46" r="8.5" fill="#FFFFFF" stroke="#15803D" strokeWidth="2" />
      {mood === 'thinking' ? (
        <>
          <circle cx="40" cy="44" r="4" fill="#0F172A" />
          <circle cx="60" cy="44" r="4" fill="#0F172A" />
        </>
      ) : mood === 'celebrate' ? (
        <>
          <path d="M34 46C35.5 43 40.5 43 42 46" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 46C55.5 43 60.5 43 62 46" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="38.5" cy="46" r="4" fill="#0F172A" />
          <circle cx="57.5" cy="46" r="4" fill="#0F172A" />
          <circle cx="37" cy="44.5" r="1.4" fill="#FFFFFF" />
          <circle cx="56" cy="44.5" r="1.4" fill="#FFFFFF" />
        </>
      )}

      {/* Beak */}
      <path d="M44 51L52 51L48 57Z" fill="#F59E0B" />

      {/* Cheeks */}
      <circle cx="31" cy="53" r="3" fill="#86EFAC" />
      <circle cx="65" cy="53" r="3" fill="#86EFAC" />

      {/* Wings */}
      {mood === 'celebrate' ? (
        <>
          <path d="M23 50L12 39C10 37 12 33 16 35L25 43Z" fill="#15803D" />
          <path d="M73 50L84 39C86 37 84 33 80 35L71 43Z" fill="#15803D" />
        </>
      ) : (
        <>
          <ellipse cx="22" cy="56" rx="5" ry="11" fill="#15803D" />
          <ellipse cx="74" cy="56" rx="5" ry="11" fill="#15803D" />
        </>
      )}

      {/* Little amber feet */}
      <rect x="35" y="75" width="9" height="5" rx="2.5" fill="#F59E0B" />
      <rect x="52" y="75" width="9" height="5" rx="2.5" fill="#F59E0B" />
    </svg>
  );
}

export function FlameStreakArt({
  size = 56,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <circle cx="32" cy="32" r="30" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="2" />
      <path
        d="M34.5 11C35.5 19 44 23.5 44 34C44 41.7 38.6 48 32 48C25.4 48 20 42 20 34.5C20 28.5 23.5 24 27 21C26.7 25 28.5 27.5 30.5 28C29.5 22 31.5 15.5 34.5 11Z"
        fill="#F59E0B"
      />
      <path
        d="M32.5 27C35.5 30.5 38 33.5 38 38C38 42.4 35.3 45.5 32 45.5C28.7 45.5 26 42.4 26 38C26 34.8 27.7 32.3 30 30.5C30.2 32.5 31.3 33.5 32.5 34C32 31.5 32 29 32.5 27Z"
        fill="#FEF3C7"
      />
    </svg>
  );
}

export function TimerRingSvg({
  progressRatio,
  formattedTime,
  label,
}: {
  progressRatio: number;
  formattedTime: string;
  label: string;
}) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progressRatio));
  const dashOffset = circumference * (1 - clamped);

  return (
    <div className="relative mx-auto flex h-56 w-56 items-center justify-center">
      <svg
        width="224"
        height="224"
        viewBox="0 0 224 224"
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="112"
          cy="112"
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="12"
        />
        <circle
          cx="112"
          cy="112"
          r={radius}
          fill="none"
          stroke="#16A34A"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
          {formattedTime}
        </span>
        <span className="mt-1 text-xs font-semibold text-slate-500">
          {label}
        </span>
      </div>
    </div>
  );
}
