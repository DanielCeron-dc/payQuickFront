import React, { ReactNode } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
    TouchableOpacityProps,
    StyleProp,
    ViewStyle,
    TextStyle,
    GestureResponderEvent,
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';
type Size = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    onPress?: (event: GestureResponderEvent) => void;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
    ...props
}) => {
    const getButtonStyle = (): StyleProp<ViewStyle> => {
        const baseStyle: Array<ViewStyle | object> = [styles.button];

        // Variant styles
        switch (variant) {
            case 'primary':
                baseStyle.push(styles.primary);
                break;
            case 'secondary':
                baseStyle.push(styles.secondary);
                break;
            case 'outline':
                baseStyle.push(styles.outline);
                break;
            case 'danger':
                baseStyle.push(styles.danger);
                break;
            default:
                baseStyle.push(styles.primary);
        }

        // Size styles
        switch (size) {
            case 'small':
                baseStyle.push(styles.small);
                break;
            case 'medium':
                baseStyle.push(styles.medium);
                break;
            case 'large':
                baseStyle.push(styles.large);
                break;
            default:
                baseStyle.push(styles.medium);
        }

        if (disabled) baseStyle.push(styles.disabled);

        return baseStyle;
    };

    const getTextStyle = (): StyleProp<TextStyle> => {
        const baseStyle: Array<TextStyle | object> = [styles.text];

        switch (variant) {
            case 'primary':
            case 'danger':
                baseStyle.push(styles.primaryText);
                break;
            case 'secondary':
                baseStyle.push(styles.secondaryText);
                break;
            case 'outline':
                baseStyle.push(styles.outlineText);
                break;
        }

        switch (size) {
            case 'small':
                baseStyle.push(styles.smallText);
                break;
            case 'medium':
                baseStyle.push(styles.mediumText);
                break;
            case 'large':
                baseStyle.push(styles.largeText);
                break;
        }

        if (disabled) baseStyle.push(styles.disabledText);

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator
                        color={variant === 'outline' ? COLORS.primary : COLORS.surface}
                        size="small"
                        style={styles.loader}
                    />
                ) : (
                    <>
                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOW.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.md,
    },
    text: {
        fontWeight: FONTS.semibold,
        textAlign: 'center',
    },
    iconContainer: {
        marginRight: SPACING.sm,
    },
    loader: {
        marginRight: SPACING.sm,
    },

    // Variants
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    danger: {
        backgroundColor: COLORS.error,
    },

    // Sizes
    small: {
        minHeight: 32,
    },
    medium: {
        minHeight: 44,
    },
    large: {
        minHeight: 66,
    },

    // Text variants
    primaryText: {
        color: COLORS.surface,
    },
    secondaryText: {
        color: COLORS.surface,
    },
    outlineText: {
        color: COLORS.primary,
    },

    // Text sizes
    smallText: {
        fontSize: SIZES.sm,
    },
    mediumText: {
        fontSize: SIZES.md,
    },
    largeText: {
        fontSize: SIZES.lg,
    },

    // Disabled
    disabled: {
        backgroundColor: COLORS.disabled,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledText: {
        color: COLORS.surface,
        opacity: 0.7,
    },
});

export default Button;