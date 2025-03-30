import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const data = [
    {
      image: require('../assets/images/welcome1.png'),
      title: 'Find Perfect Parking',
      description: 'Discover the best parking spots near you with CarPark!',
      colors: ['#4a90e2', '#1a73e8'],
    },
    {
      image: require('../assets/images/welcome2.png'),
      title: 'Quick Navigation',
      description: 'Get turn-by-turn directions to available parking spots in seconds',
      colors: ['#6e45e2', '#4a3ce0'],
    },
    {
      image: require('../assets/images/welcome3.png'),
      title: 'Easy Booking',
      description: 'Reserve your spot with just a few taps - no hassle, no stress',
      colors: ['#e24a90', '#e21a73'],
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

  const handleSkip = () => {
    navigation.navigate('AuthStack');
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.pagination}>
        {data.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { 
                  width: dotWidth,
                  opacity: dotOpacity,
                  backgroundColor: currentIndex === index ? data[index].colors[0] : '#ddd'
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderGetStartedButton = () => {
    if (currentIndex === data.length - 1) {
      return (
        <TouchableOpacity 
          style={[styles.getStartedContainer, { backgroundColor: data[currentIndex].colors[0] }]}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
          <View style={styles.arrowPlaceholder} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const imageScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });
          const imageTranslateY = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, 50],
            extrapolate: 'clamp',
          });

          return (
            <View key={index} style={[styles.slide, { width }]}>
              <View style={[styles.gradientBackground, {
                backgroundColor: item.colors[0]
              }]} />
              
              <Animated.Image
                source={item.image}
                style={[
                  styles.image, 
                  { 
                    transform: [{ scale: imageScale }, { translateY: imageTranslateY }],
                  }
                ]}
              />
              
              {/* Icon placeholder - replace with your actual icon */}
              <View style={styles.iconPlaceholder}>
                <Text style={styles.iconPlaceholderText}>{item.icon}</Text>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Action buttons and pagination - REORDERED */}
      <View style={styles.bottomContainer}>
        {renderGetStartedButton()}
        {renderPaginationDots()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 10,
    padding: 10,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  iconPlaceholderText: {
    color: '#fff',
    fontSize: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 40,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  pagination: {
    marginTop: 20, // Added space between button and dots
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  getStartedContainer: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 10,
  },

});

export default OnboardingScreen;