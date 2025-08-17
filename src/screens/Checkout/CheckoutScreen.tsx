import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import type { ListRenderItem } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Button from '../../components/common/Button';
import { ICartItem, clearCart } from '../../store/cartSlice';
import { processPayment } from '../../services/paymentApi';
import { startProcessing, processPaymentSuccess, processPaymentFailure } from '../../store/paymentSlice';

import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';
import { getResponsiveDimensions } from '../../utils/responsive';
import CartItem from '../../components/product/CartItem';

// ---- Types you likely already have elsewhere; swap with real imports if available ----
type AppDispatch = any; // replace with: export type AppDispatch = typeof store.dispatch
type Step = 'card' | 'summary';

export interface CartItemModel {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
}

type CartState = {
    items: ICartItem[];
    total: number;
};

type PaymentState = {
    isProcessing: boolean;
    // other fields exist but aren't used here
};

type RootState = {
    cart: CartState;
    payment: PaymentState;
};

type RootStackParamList = {
    Checkout: undefined;
    Transaction: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export interface CardInfo {
    number: string;
    expiryDate: string; // MM/YY
    cvv: string;
    holderName: string;
}

// ----------------------------------------------------------------------------

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
    const [paymentModalVisible, setPaymentModalVisible] = useState<boolean>(false);
    const [paymentStep, setPaymentStep] = useState<Step>('card');

    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector<RootState, CartState>((state) => state.cart);

    const payment = useSelector<RootState, PaymentState>((state) => state.payment);
    const { modalWidth } = getResponsiveDimensions(); // (used by PaymentModal internally)

    const tax = cart.total * 0.08; // 8% tax
    const finalTotal = cart.total + tax;

    const handlePayWithCard = (): void => {
        setPaymentStep('card');
        setPaymentModalVisible(true);
    };

    const handlePaymentSuccess = async (paymentData: CardInfo): Promise<void> => {
        try {
            dispatch(startProcessing());

            const transactionData = {
                cardInfo: paymentData,
                items: cart.items.map((item) => ({
                    id: item.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
                total: finalTotal,
                tax,
                subtotal: cart.total,
            };

            console.log('paymentData', paymentData)

            const transaction = await processPayment(transactionData);

            dispatch(processPaymentSuccess(transaction));
            dispatch(clearCart());
            setPaymentModalVisible(false);


            console.log('Payment processed successfully:', transaction);

            Toast.show({
                type: 'success',
                text1: 'Payment Successful! 🎉',
                text2: `Transaction ID: ${transaction.id}`,
            });

            setTimeout(() => {
                navigation.navigate('Transaction');
            }, 1500);
        } catch (error: any) {
            dispatch(processPaymentFailure(error?.message ?? 'Unknown error'));
            Toast.show({
                type: 'error',
                text1: 'Payment Failed',
                text2: error?.message ?? 'Unknown error',
            });
        }
    };

    const renderCartItem: ListRenderItem<ICartItem> = ({ item }) => (
        <CartItem item={{ ...item.product, quantity: item.quantity }} />
    );

    const renderEmptyCart = (): React.ReactElement => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>Add some items to get started</Text>
            <Button
                title="Continue Shopping"
                onPress={() => navigation.goBack()}
                style={styles.continueShopping}
            />
        </View>
    );

    const renderOrderSummary = (): React.ReactElement => (
        <View style={styles.orderSummary}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${cart.total.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
        </View>
    );

    if (cart.items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                {renderEmptyCart()}
                <Toast />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList<ICartItem>
                data={cart.items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.cartList}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View>
                        {renderOrderSummary()}
                        <Button
                            title="Pay with Credit Card"
                            onPress={handlePayWithCard}
                            size="large"
                            style={styles.payButton}
                            icon={<Text style={styles.payIcon}>💳</Text>}
                        />
                    </View>
                }
            />


            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    cartList: { padding: SPACING.lg },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyIcon: { fontSize: 80, marginBottom: SPACING.lg },
    emptyTitle: {
        fontSize: SIZES.xl,
        fontWeight: FONTS.bold as any,
        color: COLORS.text,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xxl,
    },
    continueShopping: { minWidth: 200 },

    orderSummary: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginTop: SPACING.lg,
        marginBottom: SPACING.xl,
        ...SHADOW.md,
    },
    summaryTitle: {
        fontSize: SIZES.lg,
        fontWeight: FONTS.bold as any,
        color: COLORS.text,
        marginBottom: SPACING.lg,
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
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.md,
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: SIZES.lg,
        color: COLORS.text,
        fontWeight: FONTS.bold as any,
    },
    totalValue: {
        fontSize: SIZES.lg,
        color: COLORS.primary,
        fontWeight: FONTS.bold as any,
    },

    payButton: { marginBottom: SPACING.xl },
    payIcon: { fontSize: SIZES.lg },

    modal: { margin: 0, justifyContent: 'flex-end' },
});

export default CheckoutScreen;