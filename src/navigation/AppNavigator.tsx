import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import { COLORS } from '../constants/theme';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import SplashScreen from '../screens/Splash/Splash';
import TransactionScreen from '../screens/Transaction/TransactionScreen';



export type IRootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Checkout: undefined;
    Transaction: undefined;
};

const Stack = createNativeStackNavigator<IRootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                }}>

                    <Stack.Screen
                        name="Splash"
                        component={SplashScreen}
                        options={{
                            headerShown: false,
                        }}
                    />

                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'PayQuick Store',
                        headerBackVisible: false,
                    }}
                />

                <Stack.Screen
                    name="Checkout"
                    component={CheckoutScreen}
                    options={{
                        title: 'Checkout',
                    }}
                />

                <Stack.Screen
                    name="Transaction"
                    component={TransactionScreen}
                    options={{
                        title: 'Transaction',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
