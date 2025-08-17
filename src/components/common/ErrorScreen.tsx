import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface Props {
  title?: string;
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  retryText?: string;
}

const ErrorScreen: React.FC<Props> = ({
  title = 'Oops! Something went wrong',
  message = 'The app encountered an unexpected error. Please try again.',
  error,
  onRetry,
  retryText = 'Try Again',
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.error} />
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      {error && (
        <Text style={styles.errorDetails}>
          {error}
        </Text>
      )}
      
      {onRetry && (
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: SPACING.xl,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: FONTS.bold as any,
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: SIZES.md,
    color: '#7f1d1d',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  errorDetails: {
    fontSize: SIZES.sm,
    color: '#991b1b',
    textAlign: 'center',
    fontFamily: 'monospace',
    marginBottom: SPACING.xl,
    backgroundColor: '#fecaca',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.md,
    fontWeight: FONTS.semibold as any,
  },
});

export default ErrorScreen;
