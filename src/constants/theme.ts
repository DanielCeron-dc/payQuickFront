// theme.ts
import type { TextStyle } from 'react-native';
import { rf, rs, getTypographyScale } from '../utils/responsive';

// ---- Types ----
type ColorName =
    | 'primary' | 'primaryDark' | 'secondary' | 'background' | 'surface'
    | 'text' | 'textSecondary' | 'border' | 'error' | 'success'
    | 'warning' | 'disabled';

type FontWeight = NonNullable<TextStyle['fontWeight']>;

type ShadowStyle = {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
};

type ShadowSize = 'sm' | 'md' | 'lg';
export type SizeKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
type RadiusKey = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// ---- Theme Objects ----
export const COLORS: Record<ColorName, string> = {
    primary: '#f163bbff',
    primaryDark: '#e5468eff',
    secondary: '#10b981',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    disabled: '#9ca3af',
} as const;

export const FONTS: Record<
    'light' | 'regular' | 'medium' | 'semibold' | 'bold',
    FontWeight
> = {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
} as const;

const typographyScale = getTypographyScale();

export const SIZES: Record<SizeKey, number> = {
    xs: rf(8 * typographyScale),
    sm: rf(12 * typographyScale),
    md: rf(16 * typographyScale),
    lg: rf(20 * typographyScale),
    xl: rf(24 * typographyScale),
    xxl: rf(32 * typographyScale),
    xxxl: rf(40 * typographyScale),
} as const;

export const SPACING: Record<SizeKey, number> = {
    xs: rs(4),
    sm: rs(8),
    md: rs(12),
    lg: rs(16),
    xl: rs(20),
    xxl: rs(24),
    xxxl: rs(32),
} as const;

export const BORDER_RADIUS: Record<RadiusKey, number> = {
    sm: rs(4),
    md: rs(8),
    lg: rs(12),
    xl: rs(16),
    xxl: rs(20),
} as const;

export const SHADOW: Record<ShadowSize, ShadowStyle> = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
} as const;

// ---- Convenience Theme Type ----
export type Theme = {
    COLORS: typeof COLORS;
    FONTS: typeof FONTS;
    SIZES: typeof SIZES;
    SPACING: typeof SPACING;
    BORDER_RADIUS: typeof BORDER_RADIUS;
    SHADOW: typeof SHADOW;
};