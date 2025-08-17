import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { validateHolderName } from '../../utils/creditCard';

type Props = {
    value: string;
    onChange: (holderName: string) => void;
    error?: string | null;
    label?: string;
    placeholder?: string;
    testID?: string;
};

const CardHolderNameInput: React.FC<Props> = ({
    value,
    onChange,
    error,
    label = 'Cardholder Name',
    placeholder = 'John Doe',
    testID,
}) => {
    const [focused, setFocused] = useState(false);
    const [touched, setTouched] = useState(false);
    
    const shouldShowError = validateHolderName(value) === false && touched;

    return (
        <View style={styles.container} testID={testID}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrap, focused && styles.inputFocused, shouldShowError && styles.inputError]}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => { setFocused(false); setTouched(true); }}
                    placeholder={placeholder}
                    autoCapitalize="words"
                    style={styles.input}
                    accessibilityLabel="Cardholder name"
                    returnKeyType="next"
                    autoComplete="cc-name"
                    importantForAutofill="yes"
                />
            </View>
            {shouldShowError && <Text style={styles.errorText}>{error || 'Invalid cardholder name'}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: SPACING.lg },
    label: { fontSize: SIZES.sm, fontWeight: FONTS.semibold as any, color: COLORS.text, marginBottom: SPACING.sm },
    inputWrap: {
        flexDirection: 'row', 
        alignItems: 'center',
        borderWidth: 1, 
        borderColor: COLORS.border, 
        borderRadius: BORDER_RADIUS.md, 
        backgroundColor: COLORS.surface,
    },
    input: { flex: 1, padding: SPACING.md, fontSize: SIZES.md, color: COLORS.text },
    inputFocused: { borderColor: COLORS.primary },
    inputError: { borderColor: COLORS.error },
    errorText: { fontSize: SIZES.sm, color: COLORS.error, marginTop: SPACING.xs },
});

export default CardHolderNameInput;
