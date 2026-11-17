import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Study OS — Exam Prep for JAMB, WAEC, NECO & Crawford University',
  description:
    'Mobile-first exam prep workspace for Nigerian students preparing for JAMB, WAEC, NECO, and Crawford University courses.',
  openGraph: {
    title: 'Study OS — Exam Prep for JAMB, WAEC, NECO & Crawford University',
    description:
      'Mobile-first exam prep workspace for Nigerian students preparing for JAMB, WAEC, NECO, and Crawford University courses.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study OS — Exam Prep for JAMB, WAEC, NECO & Crawford University',
    description:
      'Mobile-first exam prep workspace for Nigerian students preparing for JAMB, WAEC, NECO, and Crawford University courses.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body
        className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-green-100 selection:text-green-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
