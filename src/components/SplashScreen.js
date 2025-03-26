import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Intro'); // Navigate to Welcome Screen after 3 seconds
    }, 3500);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Logo and Tagline */}
      <Image source={require('../assets/images/app_logo.png')} style={styles.logo} />
      <Text style={styles.tagline}>Your #1 Parking Companion</Text>

      {/* Animated Loading Indicator */}
      <LottieView
        source={require('../assets/animations/loading.json')}
        autoPlay
        loop
        style={styles.loader}
      />

      {/* City Illustration */}
      <Image source={require('../assets/images/splash.png')} style={styles.city} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgb(190, 226, 238)', // Matching color from city image
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: 80, // Adjust position
  },
  tagline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366', // Darker color for better contrast
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase', // Stylish uppercase text
    fontFamily: 'sans-serif-medium', // Modern font (Use a custom one if available)
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loader: {
    width: 120, // Adjust as needed
    height: 120,
    marginTop: 20,
  },
  city: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 500, // Adjust based on your image size
    resizeMode: 'cover',
  },
});

export default SplashScreen;
