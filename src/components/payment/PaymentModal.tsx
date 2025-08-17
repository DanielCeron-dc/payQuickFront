import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../common/Button';
import { updateCardInfo, setCardType,  ICardInfo, ICardType } from '../../store/paymentSlice';
import {
    validateExpiryDate,
    validateCVV,
    validateHolderName,
    validateCardNumber,
} from '../../utils/creditCard';

import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';
import { getResponsiveDimensions, hp } from '../../utils/responsive';
import CardNumberInput from './CardNumberInput';
import ExpiryInput from './ExpiryInput';
import CvvInput from './CvvInput';
import CardHolderNameInput from './CardHolderNameInput';
import { AppDispatch, RootState } from '../../store';


type Step = 'card' | 'summary';

interface Props {
    step: Step;
    total: number;
    onClose?: () => void;
    onPaymentSuccess: (cardInfo: ICardInfo) => void;
    onStepChange: (next: Step) => void;
    loading?: boolean;
}


type FieldErrors = Partial<Record<'number' | 'expiryDate' | 'cvv' | 'holderName', string>>;

const PaymentModal: React.FC<Props> = ({
    step,
    total,
    onPaymentSuccess,
    onStepChange,
    loading = false,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const cardInfo = useSelector<RootState, ICardInfo>((state) => state.payment.cardInfo);
    const cardType = useSelector<RootState, ICardType>((state) => state.payment.cardType);

    const [errors, setErrors] = useState<FieldErrors>({});
    const [isValid, setIsValid] = useState<boolean>(false);
    const { modalWidth } = getResponsiveDimensions();

    const validateForm = useCallback(() => {
        const newErrors: FieldErrors = {};

        if (!validateCardNumber(cardInfo.number)) newErrors.number = 'Invalid card number';
        if (!validateExpiryDate(cardInfo.expiryDate)) newErrors.expiryDate = 'Invalid expiry date';
        if (!validateCVV(cardInfo.cvv, cardType)) newErrors.cvv = 'Invalid CVV';
        if (!validateHolderName(cardInfo.holderName)) newErrors.holderName = 'Invalid cardholder name';

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0);
    }, [cardInfo, cardType]);

    useEffect(() => {
        validateForm();
    }, [validateForm]);


    const handleContinue = (): void => {
        if (step === 'card' && isValid) {
            onStepChange('summary');
        } else if (step === 'summary') {
            onPaymentSuccess(cardInfo);
        }
    };


    const renderCardForm = (): React.ReactElement => (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Credit Card Information</Text>
                <Text style={styles.subtitle}>Enter your payment details securely</Text>
            </View>

            <View style={styles.form}>
                <CardNumberInput
                    value={cardInfo.number}
                    onChange={(formatted) => dispatch(updateCardInfo({ number: formatted }))}
                    onTypeChange={(t) => {
                        const supported = (['visa', 'mastercard', 'amex'] as const).includes(t as any) ? t : 'visa';
                        dispatch(setCardType(supported as any));
                    }}
                />

                <View style={styles.row}>
                    <View style={[styles.halfInput]}>
                        <ExpiryInput
                            value={cardInfo.expiryDate}
                            onChange={(formatted) => dispatch(updateCardInfo({ expiryDate: formatted }))}
                            error={errors.expiryDate ?? null}
                        />
                    </View>

                    <View style={[styles.halfInput]}>
                        <CvvInput
                            value={cardInfo.cvv}
                            onChange={(cvv) => dispatch(updateCardInfo({ cvv }))}
                            cardType={cardType}
                            error={errors.cvv ?? null}
                        />
                    </View>
                </View>

                <CardHolderNameInput
                    value={cardInfo.holderName}
                    onChange={(holderName) => dispatch(updateCardInfo({ holderName }))}
                    error={errors.holderName ?? null}
                />

                <View style={styles.securityNote}>
                    <Text style={styles.securityText}>🔒 Your payment information is encrypted and secure</Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderPaymentSummary = (): React.ReactElement => (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Payment Summary</Text>
                <Text style={styles.subtitle}>Review your payment details</Text>
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Card Number</Text>
                    <Text style={styles.summaryValue}>**** **** **** {cardInfo.number.slice(-4)}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Cardholder</Text>
                    <Text style={styles.summaryValue}>{cardInfo.holderName}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Card Type</Text>
                    <Text style={styles.summaryValue}>
                        {cardType === 'visa' ? 'VISA' : cardType === 'mastercard' ? 'MasterCard' : 'Unknown'}
                    </Text>
                </View>

                <View style={[styles.summaryRow, styles.totalSummaryRow]}>
                    <Text style={styles.totalSummaryLabel}>Total Amount</Text>
                    <Text style={styles.totalSummaryValue}>${total.toFixed(2)}</Text>
                </View>
            </View>
        </ScrollView>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={[styles.modal, { width: modalWidth }]}>
                {step === 'card' ? renderCardForm() : renderPaymentSummary()}

                <View style={styles.buttonContainer}>
                    {step === 'summary' && (
                        <Button
                            title="Back to Card Info"
                            onPress={() => onStepChange('card')}
                            variant="outline"
                            size="large"
                        />
                    )}

                    <Button
                        title={step === 'card' ? 'Review Payment' : 'Complete Payment'}
                        onPress={handleContinue}
                        disabled={step === 'card' ? !isValid : false}
                        loading={loading}
                        size="large"
                    />

                </View>


            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: hp(90),
        minHeight: hp(50),
        flexShrink: 1,
    },
    header: {
        padding: SPACING.xl,
        paddingBottom: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: SIZES.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: SPACING.sm,
    },
    form: {
        padding: SPACING.xl,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    errorText: {
        fontSize: SIZES.sm,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    securityNote: {
        backgroundColor: COLORS.background,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginTop: SPACING.lg,
    },
    securityText: {
        fontSize: SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontWeight: FONTS.medium as any,
    },
    summaryCard: {
        margin: SPACING.xl,
        padding: SPACING.lg,
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOW.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    summaryLabel: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        fontWeight: FONTS.medium as any,
    },
    summaryValue: {
        fontSize: SIZES.md,
        color: COLORS.text,
        fontWeight: FONTS.semibold as any,
    },
    totalSummaryRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.md,
        marginBottom: 0,
    },
    totalSummaryLabel: {
        fontSize: SIZES.lg,
        color: COLORS.text,
        fontWeight: FONTS.bold as any,
    },
    totalSummaryValue: {
        fontSize: SIZES.xl,
        color: COLORS.primary,
        fontWeight: FONTS.bold as any,
    },
    buttonContainer: {
        flexDirection: 'column',
        padding: SPACING.xl,
        paddingTop: SPACING.md,
        gap: SPACING.md,
        flexShrink: 0,
    },
});

export default PaymentModal;