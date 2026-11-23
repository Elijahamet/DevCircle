export const Themes = {
  dark: {
    // Mode identifier
    isDark: true,

    // Core Brand colors
    deepNavy: '#07111F',
    electricGreen: '#19E68C',
    white: '#F8FAFC',
    slate: '#182536',
    mutedGrey: '#94A3B8',
    border: '#263548',

    // Semantic mappings
    background: '#07111F',
    backgroundSecondary: '#0B1626',
    card: '#182536',
    cardHover: '#1E2F46',
    cardBorder: '#263548',
    inputBackground: '#182536',
    inputBorder: '#263548',
    inputBorderFocus: '#19E68C',

    // Primary highlights
    primary: '#19E68C',
    primaryPressed: '#14C777',
    primaryMuted: 'rgba(25, 230, 140, 0.12)',
    primaryBorder: 'rgba(25, 230, 140, 0.3)',

    // Text
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#07111F',

    // Accents and tags
    danger: '#EF4444',
    dangerMuted: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.15)',
    info: '#38BDF8',
    infoMuted: 'rgba(56, 189, 248, 0.15)',
    purple: '#A855F7',
    purpleMuted: 'rgba(168, 85, 247, 0.15)',
    gold: '#EAB308',

    // Code editor theme
    codeBg: '#0F1A28',
    codeBorder: '#1E2F46',
    codeHeader: '#142234',

    // Top & Tab Bar
    headerBg: '#07111F',
    headerBorder: '#121F30',
    tabBarBg: '#0A1524',
    tabBarBorder: '#1A293E',
    iconButtonBg: '#132235',
    iconButtonBorder: '#203248',
  },
  light: {
    // Mode identifier
    isDark: false,

    // Core Brand colors
    deepNavy: '#07111F',
    electricGreen: '#059669',
    white: '#FFFFFF',
    slate: '#FFFFFF',
    mutedGrey: '#64748B',
    border: '#E2E8F0',

    // Semantic mappings
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    card: '#FFFFFF',
    cardHover: '#F8FAFC',
    cardBorder: '#E2E8F0',
    inputBackground: '#F1F5F9',
    inputBorder: '#CBD5E1',
    inputBorderFocus: '#059669',

    // Primary highlights
    primary: '#059669',
    primaryPressed: '#047857',
    primaryMuted: 'rgba(5, 150, 105, 0.12)',
    primaryBorder: 'rgba(5, 150, 105, 0.3)',

    // Text
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',

    // Accents and tags
    danger: '#DC2626',
    dangerMuted: 'rgba(220, 38, 38, 0.12)',
    warning: '#D97706',
    warningMuted: 'rgba(217, 119, 6, 0.12)',
    info: '#0284C7',
    infoMuted: 'rgba(2, 132, 199, 0.12)',
    purple: '#9333EA',
    purpleMuted: 'rgba(147, 51, 234, 0.12)',
    gold: '#CA8A04',

    // Code editor theme (keep dark for high readability)
    codeBg: '#0F1A28',
    codeBorder: '#1E2F46',
    codeHeader: '#142234',

    // Top & Tab Bar
    headerBg: '#FFFFFF',
    headerBorder: '#E2E8F0',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    iconButtonBg: '#F1F5F9',
    iconButtonBorder: '#E2E8F0',
  },
} as const;

export type ThemeType = 'dark' | 'light';

export type ThemeColors = {
  [K in keyof typeof Themes.dark]: (typeof Themes.dark)[K] extends boolean ? boolean : string;
};

export const Colors = Themes.dark;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionBold: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  small: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
  code: {
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#38BDF8',
  },
} as const;
