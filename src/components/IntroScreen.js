import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const data = [
    {
      image: require('../assets/images/welcome1.png'), 
      title: 'Best Parking Spots',
      description: 'Discover the Best Parking Spots near you with CarPark!',
    },
    {
      image: require('../assets/images/welcome2.png'),
      title: 'Quick Navigation',
      description: 'Find your way to the nearest parking spot in seconds with Quick Navigation!',
    },
    {
      image: require('../assets/images/welcome3.png'), 
      title: 'Easy Booking',
      description: 'Book your parking spot with just a few taps.',
    },
  ];

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('Auth', { screen: 'Login' }); // Navigate to Login screen when the last screen is reached
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={data[currentIndex].image} style={styles.image} />
      </View>
      <Text style={styles.title}>{data[currentIndex].title}</Text>
      <Text style={styles.description}>{data[currentIndex].description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Image source={require('../assets/icons/next.png')} style={styles.logo} />
      </TouchableOpacity>

      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View 
            key={index} 
            style={[styles.dot, currentIndex === index && styles.activeDot]} 
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 55,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  logo: {
    width: 80,
    height: 80,
    marginTop: 80,
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 90,
    backgroundColor: '#D3D3D3',
    margin: 10,
  },
  activeDot: {
    backgroundColor: '#00008B',
  },
});

export default OnboardingScreen;