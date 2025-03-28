import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/components/SplashScreen';
import WelcomeScreen from './src/components/IntroScreen';
import AuthStack from './src/components/AuthStack';
import AppNavigation from './src/components/AppNavigation'; // ✅ Import Bottom Navigation

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Intro" component={WelcomeScreen} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="Home" component={AppNavigation} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
