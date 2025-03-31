import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Image, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import NavigationScreen from '../screens/NavigationScreen';
import BookingScreen from '../screens/BookingScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import your custom icons
const icons = {
  Home: require('../assets/icons/home.png'),
  HomeFocused: require('../assets/icons/home.png'),
  Wallet: require('../assets/icons/wallet.png'),
  WalletFocused: require('../assets/icons/wallet.png'),
  Navigation: require('../assets/icons/navigation.png'),
  NavigationFocused: require('../assets/icons/navigation.png'),
  Booking: require('../assets/icons/booking.png'),
  BookingFocused: require('../assets/icons/booking.png'),
  Profile: require('../assets/icons/profile.png'),
  ProfileFocused: require('../assets/icons/profile.png'),
};

const Tab = createBottomTabNavigator();
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const TabButton = ({ item, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 300,
          easing: Easing.elastic(1.5),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      rotateValue.setValue(0);
    }
  }, [focused]);

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Get the appropriate icon based on route name and focus state
  const iconSource = focused 
    ? icons[`${item.name}Focused`] 
    : icons[item.name];

  return (
    <AnimatedTouchable
      onPress={onPress}
      activeOpacity={1}
      style={[
        styles.tabButton,
        {
          transform: [
            { scale: scaleValue },
            { rotate: rotateInterpolation },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={focused ? ['#424242', '#000000'] : ['transparent', 'transparent']}
        style={[styles.tabIconContainer, focused && styles.activeTab]}
      >
        <Image 
          source={iconSource}
          style={[
            styles.icon,
            focused && styles.iconActive,
            item.name === 'Navigation' && styles.centralIcon
          ]}
          resizeMode="contain"
        />
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const AppNavigation = () => {
  const tabs = [
    { name: 'Home', component: HomeScreen },
    { name: 'Wallet', component: WalletScreen },
    { name: 'Navigation', component: NavigationScreen },
    { name: 'Booking', component: BookingScreen },
    { name: 'Profile', component: ProfileScreen },
  ];

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.background}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
        }}
      >
        {tabs.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.name}
            component={item.component}
            options={{
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        ))}
      </Tab.Navigator>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: 'rgba(25, 25, 40, 0.8)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    elevation: 15,
    shadowColor: '#00d2ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -5,
  },
  activeTab: {
    shadowColor: '#00d2ff',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#888',
  },
  iconActive: {
    tintColor: '#fff',
    width: 28,
    height: 28,
  },
  centralIcon: {
    width: 30,
    height: 30,
  },
});

export default AppNavigation;