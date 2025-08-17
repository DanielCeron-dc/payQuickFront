import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from '../screens/Home/HomeScreen';
import { COLORS } from '../constants/theme';



type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Checkout: undefined;
    Transaction: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                
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
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: 'PayQuick Store',
                        headerBackVisible: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
