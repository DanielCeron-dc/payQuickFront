import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../store/cartSlice';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';
import { IProduct } from '../../store/cartSlice';


// If you have AppDispatch/RootState types, import them here.
// import type { AppDispatch } from '../../store';
type AppDispatch = any; 



interface Props {
  item: IProduct & { quantity: number };
}

const CartItem: React.FC<Props> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>();


  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = (): void => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }}  style={styles.image}  />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Text style={styles.removeIcon}>❌</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.unitPrice}>${item.price}</Text>
            <Text style={styles.totalPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
        resizeMode: 'cover' as const,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  name: {
    flex: 1,
    fontSize: SIZES.md,
    fontWeight: FONTS.semibold as any, // if FONTS is typed to TextStyle['fontWeight'], remove `as any`
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  removeIcon: {
    fontSize: SIZES.sm,
  },
  description: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  quantityButtonText: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.semibold as any,
    color: COLORS.primary,
  },
  quantity: {
    fontSize: SIZES.md,
    fontWeight: FONTS.semibold as any,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    minWidth: 20,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  unitPrice: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium as any,
  },
  totalPrice: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold as any,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  },
});

export default CartItem;