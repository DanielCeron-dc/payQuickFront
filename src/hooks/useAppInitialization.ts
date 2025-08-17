import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { secureRetrieve } from '../utils/encryption';
import { loadCart } from '../store/cartSlice';
import { loadSecureTransaction } from '../store/paymentSlice';
import { AppDispatch } from '../store';

interface UseAppInitializationReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export const useAppInitialization = (): UseAppInitializationReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeApp = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Load saved cart data
      const savedCart: unknown = await secureRetrieve('cart');
      if (savedCart != null) {
        dispatch(loadCart(savedCart as any));
      }

      // Load saved transaction data
      const savedTransaction: unknown = await secureRetrieve('lastTransaction');
      if (savedTransaction != null) {
        dispatch(loadSecureTransaction(savedTransaction as any));
      }

      setIsInitialized(true);
    } catch (initError) {
      const errorMessage = initError instanceof Error 
        ? initError.message 
        : 'Failed to initialize app data';
      
      console.error('Error initializing app:', initError);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const retry = (): void => {
    void initializeApp();
  };

  useEffect(() => {
    void initializeApp();
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    retry,
  };
};
