import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone SE (2020) reference: 375 x 667 points (750 x 1334 pixels)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 667;

// Screen size categories
export const SCREEN_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    TABLET: 'tablet',
} as const;

export type ScreenSize = typeof SCREEN_SIZES[keyof typeof SCREEN_SIZES];

// Get current screen category
export const getScreenSize = (): ScreenSize => {
    if (SCREEN_WIDTH < 400) {
        return SCREEN_SIZES.SMALL;
    } else if (SCREEN_WIDTH < 430) {
        return SCREEN_SIZES.MEDIUM;
    } else if (SCREEN_WIDTH < 600) {
        return SCREEN_SIZES.LARGE;
    } else {
        return SCREEN_SIZES.TABLET;
    }
};

// Responsive width based on percentage (0–100)
export const wp = (percentage: number): number => {
    const value = (percentage * SCREEN_WIDTH) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive height based on percentage (0–100)
export const hp = (percentage: number): number => {
    const value = (percentage * SCREEN_HEIGHT) / 100;
    return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Responsive font size
export const rf = (size: number): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive spacing
export const rs = (size: number): number => {
    const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, SCREEN_HEIGHT / BASE_HEIGHT);
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

type ResponsiveDimensions = {
    screenSize: ScreenSize;
    screenWidth: number;
    screenHeight: number;
    containerPadding: number;
    productCardWidth: number;
    buttonHeight: number;
    modalWidth: number;
};

// Get responsive dimensions for containers
export const getResponsiveDimensions = (): ResponsiveDimensions => {
    const screenSize = getScreenSize();

    const containerPaddingMap: Record<ScreenSize, number> = {
        small: rs(16),
        medium: rs(20),
        large: rs(24),
        tablet: rs(32),
    };

    const productCardWidthMap: Record<ScreenSize, number> = {
        small: (SCREEN_WIDTH - rs(48)) / 2,
        medium: (SCREEN_WIDTH - rs(60)) / 2,
        large: (SCREEN_WIDTH - rs(72)) / 2,
        tablet: (SCREEN_WIDTH - rs(120)) / 3,
    };

    const buttonHeightMap: Record<ScreenSize, number> = {
        small: rs(44),
        medium: rs(48),
        large: rs(52),
        tablet: rs(56),
    };

    const modalWidthMap: Record<ScreenSize, number> = {
        small: SCREEN_WIDTH - rs(32),
        medium: SCREEN_WIDTH - rs(40),
        large: SCREEN_WIDTH - rs(48),
        tablet: Math.min(SCREEN_WIDTH - rs(80), 500),
    };

    return {
        screenSize,
        screenWidth: SCREEN_WIDTH,
        screenHeight: SCREEN_HEIGHT,
        containerPadding: containerPaddingMap[screenSize],
        productCardWidth: productCardWidthMap[screenSize],
        buttonHeight: buttonHeightMap[screenSize],
        modalWidth: modalWidthMap[screenSize],
    };
};

// Safe area helpers
export const getSafeAreaInsets = (): { top: number; bottom: number } => {
    return {
        top: hp(5),
        bottom: hp(3),
    };
};

// Typography scale based on screen size
export const getTypographyScale = (): number => {
    const screenSize = getScreenSize();

    const scales: Record<ScreenSize, number> = {
        small: 0.9,
        medium: 1.0,
        large: 1.1,
        tablet: 1.2,
    };

    return scales[screenSize];
};

export { SCREEN_WIDTH, SCREEN_HEIGHT };