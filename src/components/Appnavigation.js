import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, StyleSheet } from "react-native";

// Import Screens
import HomeScreen from "../screens/HomeScreen";
import WalletScreen from "../screens/WalletScreen";
import NavigationScreen from "../screens/NavigationScreen";
import BookingScreen from "../screens/BookingScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Custom Tab Icon Component (Without Text)
const TabIcon = ({ source, focused }) => (
  <View style={[styles.tabContainer, focused && styles.tabActive]}>
    <Image source={source} style={[styles.icon, focused && styles.iconActive]} />
  </View>
);

const AppNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarShowLabel: false, // Hides the text labels
        tabBarIcon: ({ focused }) => {
          let iconSource;

          switch (route.name) {
            case "Home":
              iconSource = require("../assets/icons/home.png");
              break;
            case "Wallet":
              iconSource = require("../assets/icons/wallet.png");
              break;
            case "Navigation":
              iconSource = require("../assets/icons/navigation.png");
              break;
            case "Booking":
              iconSource = require("../assets/icons/booking.png");
              break;
            case "Profile":
              iconSource = require("../assets/icons/profile.png");
              break;
          }

          return <TabIcon source={iconSource} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Navigation" component={NavigationScreen} />
      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Styles for the 3D Navbar
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "black",
    borderRadius: 25,
    borderWidth: 0,  // Ensures no white border appears
    borderColor: "transparent", // Ensures no border color
    elevation: 5, // Lowered to reduce the white outline effect on Android
    shadowColor: "rgba(0, 0, 0, 0.8)", // More subtle shadow for iOS
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 6, 
    overflow: "hidden", // Ensures the border color does not affect the design
  },
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 35,
  },
  tabActive: {
    borderRadius: 5,
    padding: 1,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#888",
  },
  iconActive: {
    tintColor: "#33e9ff",
  },
});

export default AppNavigation;
