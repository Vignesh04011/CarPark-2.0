import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/components/SplashScreen';
import WelcomeScreen from './src/components/IntroScreen';
import AuthStack from './src/components/AuthStack';
import AppNavigation from './src/components/Appnavigation';
import SlotSelectionScreen from './src/screens/SlotSelectionScreen';
import { DataProvider } from './src/contexts/DataContext'; // Import DataProvider
import ConfirmBookingScreen from './src/screens/ConfirmBookingScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Intro" component={WelcomeScreen} />
          <Stack.Screen name="AuthStack" component={AuthStack} />
          <Stack.Screen name="Home" component={AppNavigation} />
          <Stack.Screen name="Slot" component={SlotSelectionScreen} />
          <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
};

export default App;