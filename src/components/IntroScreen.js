import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
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

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  const handleGetStarted = () => {
    navigation.navigate('AuthStack');

  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={handleScroll}
      >
        {data.map((item, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Get Started Button (Above Dots) */}
      {currentIndex === data.length - 1 && (
        <View style={styles.getStartedContainer}>
          <Text style={styles.getStartedText} onPress={handleGetStarted}>Get Started</Text>
        </View>
      )}

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(190, 226, 238)',
    paddingTop: 40,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 10,
    fontFamily: 'sans-serif-medium',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'sans-serif',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10, // Adjusted margin
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    marginBottom: 30,
  },
  activeDot: {
    backgroundColor: '#00008B',
    width: 14,
    height: 14,
  },
  getStartedContainer: {
    position: 'absolute',
    bottom: 80, // Moved above dots
    backgroundColor: '#00008B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 30,
  },
  getStartedText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
