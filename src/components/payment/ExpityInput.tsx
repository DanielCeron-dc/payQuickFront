import React, { useCallback,  useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputKeyPressEvent } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { validateExpiryDate } from '../../utils/creditCard';


type Props = {
    value: string;                // "MM/YY"
    onChange: (formatted: string) => void;
    error?: string | null;
    label?: string;
    placeholder?: string;
    testID?: string;
};

const ExpiryInput: React.FC<Props> = ({
    value,
    onChange,
    error,
    label = 'Expiry Date',
    placeholder = 'MM/YY',
    testID,
}) => {
    const [focused, setFocused] = useState(false);
    const isInvalid = !!error || (value.length > 0 && !validateExpiryDate(value));

    const handleChange = useCallback((text: string) => {
        // keep only digits, then add slash (MM/YY)
        const digits = text.replace(/\D/g, '').slice(0, 4);

        let next = digits;
        if (digits.length >= 3) next = digits.slice(0, 2) + '/' + digits.slice(2);
        // clamp month softly: if first digit > 1, prefix 0; if month > 12, cap to 12
        if (digits.length >= 1) {
            const d0 = digits[0];
            if (parseInt(d0, 10) > 1) next = '0' + d0 + (digits[1] ? '/' + digits.slice(1, 3) : '');
        }
        if (digits.length >= 2) {
            const mm = parseInt(next.slice(0, 2), 10);
            if (mm > 12) next = '12' + next.slice(2);
        }

        onChange(next);
    }, [onChange]);

    const onKeyPress = useCallback((e: TextInputKeyPressEvent) => {
        // If deleting the slash, remove it cleanly
        if (e.nativeEvent.key === 'Backspace' && value.endsWith('/')) {
            onChange(value.slice(0, -1));
        }
    }, [value, onChange]);

    return (
        <View style={styles.container} testID={testID}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrap, focused && styles.inputFocused, isInvalid && styles.inputError]}>
                <TextInput
                    value={value}
                    onChangeText={handleChange}
                    onKeyPress={onKeyPress}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    keyboardType="number-pad"
                    maxLength={5}
                    style={styles.input}
                    accessibilityLabel="Expiry date"
                    returnKeyType="next"
                    autoComplete="cc-exp"
                    importantForAutofill="yes"
                />
            </View>
            {isInvalid && <Text style={styles.errorText}>{error || 'Invalid expiry date'}</Text>}
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

export default ExpiryInput;