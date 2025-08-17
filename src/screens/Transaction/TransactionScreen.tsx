import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Animated,
    ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import Button from '../../components/common/Button';
import { clearTransaction } from '../../store/paymentSlice';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';
import { getResponsiveDimensions } from '../../utils/responsive';

// ---- Types ----
type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

interface PaymentMethod {
    cardType: CardType;
    last4: string;
}

interface TransactionItem {
    name: string;
    quantity: number;
    price: number;
}

type TransactionStatus = 'success' | 'failed' | 'error';

interface Transaction {
    id: string;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    timestamp: number | string | Date;
    status: TransactionStatus;
    items?: TransactionItem[];
}

interface PaymentState {
    lastTransaction: Transaction | null;
}

interface RootState {
    payment: PaymentState;
}

interface Props {
    navigation: { navigate: (route: string) => void };
}

const TransactionScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useDispatch();
    const transaction = useSelector<RootState, Transaction | null>(
        (state) => state.payment.lastTransaction
    );


    console.log('TransactionScreen rendered with transaction:', transaction);
    const { containerPadding } = getResponsiveDimensions();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim, slideAnim]);

    const handleContinueShopping = () => {
        dispatch(clearTransaction());
        navigation.navigate('Home');
    };

    const formatDate = (timestamp: number | string | Date): string => {
        const date =
            typeof timestamp === 'number' || typeof timestamp === 'string'
                ? new Date(timestamp)
                : timestamp;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderSuccessContent = () => {
        if (!transaction) return null;

        return (
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                    },
                ]}>
                <LinearGradient
                    colors={[COLORS.success, '#059669']}
                    style={styles.iconContainer}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <Text style={styles.successIcon}>✅</Text>
                </LinearGradient>

                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.subtitle}>
                    Your payment has been processed successfully
                </Text>

                <View style={styles.transactionCard}>
                    <Text style={styles.cardTitle}>Transaction Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue}>{transaction.id}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Amount</Text>
                        <Text style={styles.detailValue}>
                            ${transaction.amount.toFixed(2)} {transaction.currency}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method</Text>
                        <Text style={styles.detailValue}>
                            {transaction.paymentMethod.cardType.toUpperCase()} ending in {transaction.paymentMethod.last4}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date &amp; Time</Text>
                        <Text style={styles.detailValue}>{formatDate(transaction.timestamp)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>Completed</Text>
                        </View>
                    </View>
                </View>

                {!!transaction.items?.length && (
                    <View style={styles.itemsCard}>
                        <Text style={styles.cardTitle}>Items Purchased</Text>
                        {transaction.items.map((item, index) => (
                            <View key={index} style={styles.itemRow}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                <View style={styles.thankYouContainer}>
                    <Text style={styles.thankYouText}>
                        Thank you for shopping with PayQuick! 🎉
                    </Text>
                    <Text style={styles.receiptText}>
                        A receipt has been sent to your email
                    </Text>
                </View>
            </Animated.View>
        );
    };

    const renderFailureContent = () => (
        <Animated.View
            style={[
                styles.content,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
                },
            ]}>
            <LinearGradient
                colors={[COLORS.error, '#dc2626']}
                style={styles.iconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Text style={styles.errorIcon}>❌</Text>
            </LinearGradient>

            <Text style={styles.title}>Payment Failed</Text>
            <Text style={styles.subtitle}>
                We couldn't process your payment. Please try again.
            </Text>

            <View style={styles.errorCard}>
                <Text style={styles.errorTitle}>What happened?</Text>
                <Text style={styles.errorMessage}>
                    Your payment was declined. This could be due to insufficient funds,
                    an expired card, or a network issue.
                </Text>

                <Text style={styles.errorSteps}>What you can do:</Text>
                <Text style={styles.errorStep}>• Check your card details</Text>
                <Text style={styles.errorStep}>• Try a different payment method</Text>
                <Text style={styles.errorStep}>• Contact your bank if needed</Text>
            </View>
        </Animated.View>
    );

    const renderContent = () => {
        if (!transaction) return renderFailureContent();
        return transaction.status === 'success' ? renderSuccessContent() : renderFailureContent();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { padding: containerPadding }]}
                showsVerticalScrollIndicator={false}>
                {renderContent()}

                <Animated.View
                    style={[
                        styles.buttonContainer,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}>
                    <Button
                        title="Continue Shopping"
                        onPress={handleContinueShopping}
                        size="large"
                        style={styles.continueButton}
                        icon={<Text style={styles.shopIcon}>🛍️</Text>}
                    />
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: SPACING.xxl,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: SPACING.xxl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        ...SHADOW.lg,
    },
    successIcon: { fontSize: 40 },
    errorIcon: { fontSize: 35 },
    title: {
        fontSize: SIZES.xxl,
        fontWeight: FONTS.bold as any,
        color: COLORS.text,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xxl,
        paddingHorizontal: SPACING.lg,
        lineHeight: 22,
    },
    transactionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: '100%',
        marginBottom: SPACING.lg,
        ...SHADOW.md,
    },
    itemsCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: '100%',
        marginBottom: SPACING.lg,
        ...SHADOW.md,
    },
    cardTitle: {
        fontSize: SIZES.lg,
        fontWeight: FONTS.bold as any,
        color: COLORS.text,
        marginBottom: SPACING.lg,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    detailLabel: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        fontWeight: FONTS.medium as any,
        flex: 1,
    },
    detailValue: {
        fontSize: SIZES.md,
        color: COLORS.text,
        fontWeight: FONTS.semibold as any,
        flex: 1,
        textAlign: 'right',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.success,
        marginRight: SPACING.sm,
    },
    statusText: {
        fontSize: SIZES.md,
        color: COLORS.success,
        fontWeight: FONTS.semibold as any,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    itemName: {
        fontSize: SIZES.md,
        color: COLORS.text,
        fontWeight: FONTS.medium as any,
        flex: 2,
    },
    itemQuantity: {
        fontSize: SIZES.sm,
        color: COLORS.textSecondary,
        fontWeight: FONTS.medium as any,
        flex: 1,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: SIZES.md,
        color: COLORS.primary,
        fontWeight: FONTS.semibold as any,
        flex: 1,
        textAlign: 'right',
    },
    thankYouContainer: {
        alignItems: 'center',
        marginTop: SPACING.lg,
    },
    thankYouText: {
        fontSize: SIZES.lg,
        fontWeight: FONTS.bold as any,
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    receiptText: {
        fontSize: SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    errorCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: '100%',
        marginBottom: SPACING.lg,
        ...SHADOW.md,
    },
    errorTitle: {
        fontSize: SIZES.lg,
        fontWeight: FONTS.bold as any,
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    errorMessage: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: SPACING.lg,
    },
    errorSteps: {
        fontSize: SIZES.md,
        fontWeight: FONTS.semibold as any,
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    errorStep: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        paddingLeft: SPACING.sm,
    },
    buttonContainer: {
        marginTop: SPACING.xl,
        width: '100%',
    },
    continueButton: {
        width: '100%',
    },
    shopIcon: {
        fontSize: SIZES.md,
    },
});

export default TransactionScreen;