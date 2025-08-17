import React, { useMemo, useState, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { detectCardType, formatCardNumber, validateCardNumber } from '../../utils/creditCard';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

type Props = {
    value: string;                          // formatted (with spaces)
    onChange: (formatted: string) => void; 
    onTypeChange?: (type: CardType) => void;
    label?: string;
    placeholder?: string;
    testID?: string;
};

const CardNumberInput: React.FC<Props> = ({
    value,
    onChange,
    onTypeChange,
    label = 'Card Number',
    placeholder = '1234 5678 9012 3456',
    testID,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [touched, setTouched] = useState(false);

    const digitsOnly = useMemo(() => value.replace(/\D/g, ''), [value]);
    const type: CardType = useMemo(() => {
        const t = (detectCardType(digitsOnly) as CardType) || 'unknown';
        return t;
    }, [digitsOnly]);

    const expectedLen = useMemo(() => (type === 'amex' ? 15 : 16), [type]);
    const isComplete = digitsOnly.length === expectedLen;
    const isValidNumber = useMemo(
      () => (isComplete ? validateCardNumber(value) : false),
      [isComplete, value]
    );

    const maxLen = useMemo(() => {
        // With spaces: Visa/Mastercard 19 (16 + 3 spaces), Amex 17 (15 + 2 spaces)
        if (type === 'amex') return 17;
        return 19;
    }, [type]);

    const icon = useMemo(() => {
        if (type === 'visa') return '💳 VISA';
        if (type === 'mastercard') return '💳 MasterCard';
        if (type === 'amex') return '💳 AmEx';
        return '💳';
    }, [type]);

    // Notify parent if type changes
    React.useEffect(() => {
        onTypeChange?.(type);
    }, [type, onTypeChange]);

    const handleChange = useCallback((text: string) => {
        // Normalize -> format -> lift state
        const digits = text.replace(/\D/g, '');
        const formatted = formatCardNumber(digits);
        onChange(formatted);
    }, [onChange]);

    const handleKeyPress = useCallback((e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        // Small safeguard for Android backspace quirks on empty groups
        if (e.nativeEvent.key === 'Backspace' && value.endsWith(' ')) {
            onChange(value.slice(0, -1));
        }
    }, [value, onChange]);

    const shouldShowError =  validateCardNumber(value) === false && touched;

    return (
        <View style={styles.container} testID={testID}>
            <Text style={styles.label}>{label}</Text>

            <View style={[
                styles.inputWrap,
                isFocused && styles.inputFocused,
                shouldShowError && styles.inputError
            ]}>
                <TextInput
                    value={value}
                    onChangeText={handleChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => { setIsFocused(false); setTouched(true); }}
                    placeholder={placeholder}
                    keyboardType="number-pad"
                    maxLength={maxLen}
                    style={styles.input}
                    textContentType="creditCardNumber"      // iOS
                    autoComplete="cc-number"               // Android (RN >= 0.71)
                    importantForAutofill="yes"
                    accessibilityLabel="Card number"
                    returnKeyType="next"
                />
                <Text style={styles.icon}>{icon}</Text>
            </View>

            {shouldShowError && (
                <Text style={styles.errorText}>
                    {'Invalid card number'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: SPACING.lg },
    label: {
        fontSize: SIZES.sm,
        fontWeight: FONTS.semibold as any,
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surface,
    },
    input: {
        flex: 1,
        padding: SPACING.md,
        fontSize: SIZES.md,
        color: COLORS.text,
    },
    inputFocused: { borderColor: COLORS.primary },
    inputError: { borderColor: COLORS.error },
    icon: {
        marginRight: SPACING.md,
        fontSize: SIZES.sm,
        fontWeight: FONTS.bold as any,
        color: COLORS.primary,
        minWidth: 72,
        textAlign: 'right',
    },
    errorText: {
        fontSize: SIZES.sm,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
});

export default CardNumberInput;