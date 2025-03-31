import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get("window");

// Custom SVG Icons with accent color
const ParkingIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" 
          stroke="#4cc9f0" strokeWidth="2"/>
    <Path d="M10 7V17" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M14 7V17" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M7 10H17" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round"/>
    <Path d="M7 14H17" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const ClockIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
          stroke="#4cc9f0" strokeWidth="2"/>
    <Path d="M12 6V12L16 14" stroke="#4cc9f0" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const CarIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 18H6V19C6 19.5523 5.55228 20 5 20H4C3.44772 20 3 19.5523 3 19V11L5.44721 6.10557C5.786 5.428 6.47852 5 7.23607 5H16.7639C17.5215 5 18.214 5.428 18.5528 6.10557L21 11V19C21 19.5523 20.5523 20 20 20H19C18.4477 20 18 19.5523 18 19V18Z" 
          stroke="#4cc9f0" strokeWidth="2"/>
    <Path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="#4cc9f0"/>
    <Path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" fill="#4cc9f0"/>
  </Svg>
);

const BookingScreen = () => {
  const route = useRoute();
  const { bookingDetails } = route.params || {};

  // Animation refs
  const cardScale = useRef(new Animated.Value(1)).current;
  const qrPulse = useRef(new Animated.Value(1)).current;
  const historyItemOpacity = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(true);

  const [currentBooking, setCurrentBooking] = useState({
    location: "",
    slot: "",
    startTime: "",
    endTime: "",
    licensePlate: "",
    carModel: "",
    qrData: "",
  });

  const [bookingHistory, setBookingHistory] = useState([]);

  // QR code pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(qrPulse, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(qrPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (bookingDetails) {
          setCurrentBooking({
            location: bookingDetails.spotName,
            slot: bookingDetails.selectedSlots.join(", "),
            startTime: new Date(bookingDetails.checkInTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            endTime: new Date(bookingDetails.checkOutTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            licensePlate: bookingDetails.numberPlate,
            carModel: bookingDetails.carType,
            qrData: bookingDetails.qrCodeValue,
          });
        }

        const storedBookings = await AsyncStorage.getItem("bookings");
        if (storedBookings) {
          const parsedBookings = JSON.parse(storedBookings);
          const history = parsedBookings.filter(
            (booking) => booking.id !== (bookingDetails?.qrCodeValue || "")
          );
          setBookingHistory(history);
        }

        Animated.timing(historyItemOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }).start();

      } catch (error) {
        console.error("Error loading booking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [bookingDetails]);

  const renderHistoryItem = ({ item, index }) => {
    const translateY = historyItemOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [30 * (index + 1), 0]
    });

    return (
      <Animated.View style={[
        styles.historyCard,
        {
          opacity: historyItemOpacity,
          transform: [{ translateY }]
        }
      ]}>
        <Text style={styles.historyLocation}>{item.spotName}</Text>
        <View style={styles.historyDetailRow}>
          <ParkingIcon />
          <Text style={styles.historyText}>Slot {item.selectedSlots.join(", ")}</Text>
        </View>
        <View style={styles.historyDetailRow}>
          <ClockIcon />
          <Text style={styles.historyText}>
            {new Date(item.checkInTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - {new Date(item.checkOutTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.historyDetailRow}>
          <CarIcon />
          <Text style={styles.historyText}>{item.carType} ({item.numberPlate})</Text>
        </View>
      </Animated.View>
    );
  };

  const qrStyle = {
    transform: [{ scale: qrPulse }]
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#424242', '#000000']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4cc9f0" />
      </LinearGradient> 
    );
  }

  return (
    <LinearGradient colors={['#424242', '#000000']} style={styles.container}>     

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Active Booking Card */}
      <Animated.View style={[styles.bookingCard, { transform: [{ scale: cardScale }]}]}>
        <LinearGradient
          colors={['#4A5568', '#2D3748']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >     
          <Text style={styles.cardTitle}>CURRENT BOOKING</Text>
          
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingLocation}>{currentBooking.location}</Text>
            
            <View style={styles.detailRow}>
              <ParkingIcon />
              <Text style={styles.detailText}>Slot {currentBooking.slot}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <ClockIcon />
              <Text style={styles.detailText}>
                {currentBooking.startTime} - {currentBooking.endTime}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <CarIcon />
              <Text style={styles.detailText}>
                {currentBooking.carModel} ({currentBooking.licensePlate})
              </Text>
            </View>
          </View>
          
          <Animated.View style={[styles.qrContainer, qrStyle]}>
            {currentBooking.qrData ? (
              <>
                <QRCode 
                  value={currentBooking.qrData} 
                  size={120}
                  color="#4cc9f0"
                  backgroundColor="transparent"
                />
                <Text style={styles.qrHint}>Show at parking entrance</Text>
              </>
            ) : (
              <Text style={styles.noBookingText}>No active booking</Text>
            )}
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Booking History */}
      <Text style={styles.historyTitle}>RECENT BOOKINGS</Text>
      
      {bookingHistory.length > 0 ? (
        <FlatList
          data={bookingHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.historyList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No past bookings found</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 0.5,
  },
  bookingCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 12,
    color: 'white',
    marginBottom: 15,
    letterSpacing: 1,
    fontWeight: '600',
  },
  bookingLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  bookingInfo: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#E2E8F0',
    marginLeft: 10,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(76, 201, 240, 0.1)',
    borderRadius: 12,
    alignSelf: 'center',
  },
  qrHint: {
    color: '#4cc9f0',
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
  },
  noBookingText: {
    color: '#4cc9f0',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  historyList: {
    paddingBottom: 30,
  },
  historyCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  historyLocation: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  historyDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyText: {
    fontSize: 14,
    color: '#E2E8F0',
    marginLeft: 10,
  },
  emptyContainer: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#A0AEC0',
    fontSize: 15,
  }
});

export default BookingScreen;