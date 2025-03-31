import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

const MAX_SELECTABLE_SLOTS = 5;
const { width, height } = Dimensions.get('window');

const SlotSelectionScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { spot } = route.params || {};
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const [slots, setSlots] = useState(
    Array.from({ length: spot?.totalSlots || 20 }, (_, index) => ({
      id: index + 1,
      label: `Slot ${index + 1}`,
      reserved: false,
      selected: false,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const reservedSlotsRef = useRef(new Set());

  useEffect(() => {
    const loadReservedSlots = async () => {
      try {
        const bookings = await AsyncStorage.getItem('bookings');
        if (bookings) {
          const parsedBookings = JSON.parse(bookings);
          const now = new Date();

          const activeBookings = parsedBookings.filter((booking) => {
            const checkOutTime = new Date(booking.checkOutTime);
            return checkOutTime > now;
          });

          const reservedSlots = new Set(
            activeBookings
              .filter((booking) => booking.spotId === spot.id)
              .flatMap((booking) => booking.selectedSlots)
          );

          reservedSlotsRef.current = reservedSlots;

          setSlots((prevSlots) =>
            prevSlots.map((slot) => ({
              ...slot,
              reserved: reservedSlots.has(slot.id),
            }))
          );
        }
      } catch (error) {
        console.error('Error loading reserved slots:', error);
        Alert.alert('Error', 'Failed to load slot availability.');
      } finally {
        setLoading(false);
      }
    };

    loadReservedSlots();
  }, [spot?.id]);

  const handleSlotSelection = (id) => {
    const selectedSlotsCount = slots.filter((slot) => slot.selected).length;
    const targetSlot = slots.find((slot) => slot.id === id);

    if (targetSlot.reserved) return;

    if (selectedSlotsCount >= MAX_SELECTABLE_SLOTS && !targetSlot.selected) {
      Alert.alert(
        `Limit Reached`, 
        `You can select up to ${MAX_SELECTABLE_SLOTS} slots.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === id ? { ...slot, selected: !slot.selected } : slot
      )
    );
  };

  const handleConfirmSelection = async () => {
    const selectedSlots = slots.filter((slot) => slot.selected).map((slot) => slot.id);

    if (selectedSlots.length === 0) {
      Alert.alert('No Slots Selected', 'Please select at least one slot.');
      return;
    }

    setConfirming(true);

    try {
      navigation.navigate('ConfirmBooking', { selectedSlots, spot });
    } catch (error) {
      console.error('Error confirming selection:', error);
      Alert.alert('Error', 'Failed to process your selection. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const SlotItem = React.memo(({ slot }) => (
    <Animated.View style={[
      styles.slotContainer,
      { opacity: fadeAnim },
      slot.selected && { transform: [{ scale: pulseAnim }] }
    ]}>
      <TouchableOpacity
        style={[
          styles.slot,
          slot.reserved && styles.reservedSlot,
          slot.selected && styles.selectedSlot,
          !slot.reserved && !slot.selected && styles.availableSlot,
        ]}
        onPress={() => handleSlotSelection(slot.id)}
        disabled={slot.reserved}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.slotText,
          slot.reserved && styles.reservedText,
          slot.selected && styles.selectedText,
        ]}>
          {slot.label}
        </Text>
        {slot.selected && (
          <View style={styles.selectedBadge}>
            <View style={styles.selectedBadgeInner} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  ));

  if (loading) {
    return (
      <LinearGradient
        colors={['#424242', '#000000']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#ff416c" />
        <Text style={styles.loadingText}>Loading Parking Slots...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#424242', '#000000']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Select Your Parking Slots</Text>
          <Text style={styles.subtitle}>{spot?.name || "Parking Location"}</Text>
        </Animated.View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.availableDot]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.reservedDot]} />
              <Text style={styles.legendText}>Reserved</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, styles.selectedDot]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
          </View>

          <Text style={styles.slotLimit}>Select up to {MAX_SELECTABLE_SLOTS} slots</Text>

          <View style={styles.slotsGrid}>
            {[...Array(2)].map((_, col) => (
              <View key={`col-${col}`} style={styles.column}>
                {slots.slice(col * 10, (col + 1) * 10).map((slot) => (
                  <SlotItem key={`slot-${slot.id}`} slot={slot} />
                ))}
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity
            onPress={handleConfirmSelection}
            disabled={confirming}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff416c', '#ff4b2b']}
              style={[styles.confirmButton, confirming && styles.disabledButton]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              {confirming ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm Selection</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 20,
    fontSize: 16,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  availableDot: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  reservedDot: {
    backgroundColor: '#F44336',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDot: {
    backgroundColor: '#FFC107',
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  legendText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  slotLimit: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  slotsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    width: '48%',
  },
  slotContainer: {
    marginBottom: 12,
  },
  slot: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  availableSlot: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  reservedSlot: {
    backgroundColor: 'rgb(255, 18, 1)',
  },
  selectedSlot: {
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
  },
  slotText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reservedText: {
    color: 'rgba(255,255,255,0.7)',
    textDecorationLine: 'line-through',
  },
  selectedText: {
    color: '#333',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default SlotSelectionScreen;