import React, { Component, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { useAppInitialization } from './src/hooks/useAppInitialization';
import ErrorScreen from './src/components/common/ErrorScreen';


// --- Types ---
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorScreen
          title="App Crashed"
          message="The app encountered an unexpected error. Please restart the app."
          error={this.state.error?.message || 'Unknown error'}
        />
      );
    }

    return this.props.children ?? null;
  }
}

const AppLoader: React.FC = () => {
  useAppInitialization();

  // App is ready to use
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <AppLoader />
      </ErrorBoundary>
    </Provider>
  );
};


export default App;