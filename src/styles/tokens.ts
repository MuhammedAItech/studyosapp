export const tokens = {
  colors: {
    primary: {
      DEFAULT: '#16A34A',
      hover: '#15803D',
      soft: '#DCFCE7',
      tint: '#F0FDF4',
      text: '#166534',
    },
    accent: {
      DEFAULT: '#F59E0B',
      hover: '#D97706',
      soft: '#FEF3C7',
      tint: '#FFFBEB',
      text: '#92400E',
    },
    neutral: {
      canvas: '#F8FAFC',
      surface: '#FFFFFF',
      subtle: '#F1F5F9',
      border: '#E2E8F0',
      muted: '#64748B',
      body: '#334155',
      ink: '#0F172A',
    },
    semantic: {
      success: '#16A34A',
      successSoft: '#DCFCE7',
      error: '#DC2626',
      errorSoft: '#FEE2E2',
      warning: '#D97706',
      warningSoft: '#FEF3C7',
    },
  },
  spacing: {
    unit: 8,
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '40px',
    '2xl': '48px',
  },
  radii: {
    sm: '8px',
    md: '12px',
    card: '16px',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
    soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
  },
} as const;

export type DesignTokens = typeof tokens;
