import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { validateCVV } from '../../utils/creditCard';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

type Props = {
    value: string;
    onChange: (cvv: string) => void;
    cardType?: CardType;      
    error?: string | null;
    label?: string;
    placeholder?: string;
    testID?: string;
};

const CvvInput: React.FC<Props> = ({
    value,
    onChange,
    cardType = 'unknown',
    error,
    label = 'CVV',
    placeholder = '123',
    testID,
}) => {
    const [focused, setFocused] = useState(false);
    const maxLen = useMemo(() => (cardType === 'amex' ? 4 : 3), [cardType]);

    const isInvalid = !!error || (value.length > 0 && !validateCVV(value, cardType as any));

    return (
        <View style={styles.container} testID={testID}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrap, focused && styles.inputFocused, isInvalid && styles.inputError]}>
                <TextInput
                    value={value}
                    onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, maxLen))}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    keyboardType="number-pad"
                    maxLength={maxLen}
                    secureTextEntry
                    style={styles.input}
                    accessibilityLabel="CVV"
                    returnKeyType="next"
                    autoComplete="cc-csc"
                    importantForAutofill="yes"
                />
            </View>
            {isInvalid && <Text style={styles.errorText}>{error || 'Invalid CVV'}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: SPACING.lg },
    label: { fontSize: SIZES.sm, fontWeight: FONTS.semibold as any, color: COLORS.text, marginBottom: SPACING.sm },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface,
    },
    input: { flex: 1, padding: SPACING.md, fontSize: SIZES.md, color: COLORS.text },
    inputFocused: { borderColor: COLORS.primary },
    inputError: { borderColor: COLORS.error },
    errorText: { fontSize: SIZES.sm, color: COLORS.error, marginTop: SPACING.xs },
});

export default CvvInput;