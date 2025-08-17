import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Button from '../common/Button';
import { addToCart, IProduct } from '../../store/cartSlice';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants/theme';


// If your store exports AppDispatch, import and use it:
// import type { AppDispatch } from '../../store';
type AppDispatch = any; // replace with your actual AppDispatch type if available

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;


interface Props {
  product: IProduct;
  style?: StyleProp<ViewStyle>;
}

const ProductCard: React.FC<Props> = ({ product, style }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (): void => {
    dispatch(addToCart({ id: product.id, product}));
  };

  const renderStars = (rating: number): string => {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) stars.push('⭐');
    if (hasHalfStar) stars.push('🌟');

    return stars.join('');
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>

          <Text style={styles.description} numberOfLines={3}>
            {product.description}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>{renderStars(product.rating)}</Text>
            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${product.price}</Text>
              <Text style={styles.stock}>{product.stock} in stock</Text>
            </View>
          </View>

          <Button
            title="Add to Cart"
            onPress={handleAddToCart}
            size="small"
            style={styles.addButton}
            icon={<Text style={styles.cartIcon}>🛒</Text>}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover' as const,
  },
  categoryBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    color: COLORS.surface,
    fontSize: SIZES.xs,
    fontWeight: FONTS.medium as any,
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: SIZES.md,
    fontWeight: FONTS.semibold as any,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    minHeight: 40,
  },
  description: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: SPACING.sm,
    minHeight: 54,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  stars: {
    fontSize: SIZES.sm,
    marginRight: SPACING.xs,
  },
  rating: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium as any,
  },
  footer: {
    marginBottom: SPACING.md,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: SIZES.lg,
    fontWeight: FONTS.bold as any,
    color: COLORS.primary,
  },
  stock: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.medium as any,
  },
  addButton: {
    width: '100%',
  },
  cartIcon: {
    fontSize: SIZES.sm,
  },
});

export default ProductCard;