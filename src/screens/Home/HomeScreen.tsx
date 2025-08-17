import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { useSelector } from 'react-redux';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/common/Button';
import { MOCK_PRODUCTS } from '../../constants/mockData';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';
import { IProduct } from '../../store/cartSlice';

// If you already define this in your navigator types, reuse that instead.
type RootStackParamList = {
  Home: undefined;
  Checkout: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


// If your store exports RootState, import it and replace `any` below:
// import type { RootState } from '../../store';
// or import { CartState } from '../../store/cartSlice' and do (state: { cart: CartState })

type CartState = {
  items: IProduct[];
  total: number;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<IProduct[]>(MOCK_PRODUCTS as IProduct[]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const cart = useSelector<{ cart: CartState }, CartState>((state) => state.cart);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS as IProduct[]);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleGoToCheckout = (): void => {
    navigation.navigate('Checkout');
  };

  const renderProduct: ListRenderItem<IProduct> = ({ item, index }) => (
    <ProductCard
      product={item}
      style={index % 2 === 1 ? { marginLeft: SPACING.lg } : undefined}
    />
  );

  const renderHeader = (): React.ReactElement => (
    <View style={styles.header}>
      <Text style={styles.welcomeText}>Welcome to</Text>
      <Text style={styles.storeTitle}>PayQuick Store</Text>
      <Text style={styles.subtitle}>
        Discover amazing products with secure payment
      </Text>
    </View>
  );

  const renderCartSummary = (): React.ReactElement | null => {
    if (!cart.items.length) return null;

    return (
      <View style={styles.cartSummary}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartText}>
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in cart
          </Text>
          <Text style={styles.cartTotal}>
            Total: ${cart.total.toFixed(2)}
          </Text>
        </View>
        <Button
          title="Checkout"
          onPress={handleGoToCheckout}
          size="medium"
          style={styles.checkoutButton}
          icon={<Text style={styles.checkoutIcon}>🛍️</Text>}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <FlatList<IProduct>
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />

      {renderCartSummary()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  productGrid: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    paddingVertical: SPACING.xxl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontSize: SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: FONTS.regular as any, // if FONTS is typed to TextStyle['fontWeight'], remove `as any`
  },
  storeTitle: {
    fontSize: SIZES.xxxl,
    color: COLORS.primary,
    fontWeight: FONTS.bold as any,
    marginVertical: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    lineHeight: 22,
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    ...SHADOW.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartInfo: {
    flex: 1,
  },
  cartText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium as any,
  },
  cartTotal: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    fontWeight: FONTS.bold as any,
    marginTop: SPACING.xs,
  },
  checkoutButton: {
    minWidth: 120,
    marginLeft: SPACING.md,
  },
  checkoutIcon: {
    fontSize: SIZES.md,
  },
});

export default HomeScreen;