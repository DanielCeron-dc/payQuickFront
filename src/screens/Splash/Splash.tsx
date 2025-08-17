// SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  type TextStyle,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { loadCart } from '../../store/cartSlice';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type Props = {
  navigation: {
    replace: (routeName: string) => void;
  };
  // If you use React Navigation types:
  // navigation?: NativeStackScreenProps<RootStackParamList, 'Splash'>['navigation'];
};

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch(); // tip: type with your AppDispatch if available

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    void initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeApp = async (): Promise<void> => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch(loadCart(cartData));
      }
    } catch (error) {
      console.error('Error initializing app:', error);
    } finally {
      setTimeout(() => {
        navigation.replace('Home');
      }, 2500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background gradient fills the whole screen */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark, '#3730a3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={RNStyleSheet.absoluteFillObject}
      />

      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* Content with padding separated from the background */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>💳</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>PayQuick</Text>
          <Text style={styles.subtitle}>Your Fast Payment Solution</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.taglineContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.tagline}>Secure • Fast • Reliable</Text>
        </Animated.View>

        <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
          <View style={styles.loader}>
            <View style={styles.loaderDot} />
            <View style={styles.loaderDot} />
            <View style={styles.loaderDot} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // fallback under the gradient
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // moved from gradient so width isn't reduced
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 50,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: SIZES.xxxl,
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
    fontWeight: FONTS.bold as TextStyle['fontWeight'],
  },
  subtitle: {
    fontSize: SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: FONTS.regular as TextStyle['fontWeight'],
  },
  taglineContainer: {
    position: 'absolute',
    bottom: 150,
    alignItems: 'center',
  },
  tagline: {
    fontSize: SIZES.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 2,
    fontWeight: FONTS.medium as TextStyle['fontWeight'],
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 4,
    opacity: 0.3,
  },
});

export default SplashScreen;