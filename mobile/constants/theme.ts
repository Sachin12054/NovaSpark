export const Colors = {
  background: '#080b11',
  surface: '#0f1422',
  surfaceLight: '#161c2e',
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  surfaceBorderActive: 'rgba(99, 102, 241, 0.4)',
  
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  primaryGlow: 'rgba(99, 102, 241, 0.15)',

  emerald: '#22c55e',
  emeraldDark: '#16a34a',
  emeraldLight: '#4ade80',
  emeraldGlow: 'rgba(34, 197, 94, 0.15)',

  amber: '#f59e0b',
  amberDark: '#d97706',
  amberGlow: 'rgba(245, 158, 11, 0.15)',

  violet: '#8b5cf6',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  
  error: '#ef4444',
  errorBackground: 'rgba(239, 68, 68, 0.15)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const Typography = {
  titleLarge: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    color: Colors.textDim,
    lineHeight: 16,
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 13,
  }
};
