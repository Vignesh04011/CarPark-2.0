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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MAX_SELECTABLE_SLOTS = 5;
const { width } = Dimensions.get('window');

const SlotSelectionScreen = () => {
  const route = useRoute();
  const { spot } = route.params || {};

  if (!spot) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No Parking Spot Data!</Text>
      </View>
    );
  }

  const navigation = useNavigation();
  const [slots, setSlots] = useState(
    Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      label: `Slots ${index + 1}`,
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
  }, [spot.id]);

  const handleSlotSelection = (id) => {
    const selectedSlotsCount = slots.filter((slot) => slot.selected).length;
    const targetSlot = slots.find((slot) => slot.id === id);

    if (selectedSlotsCount >= MAX_SELECTABLE_SLOTS && !targetSlot.selected) {
      Alert.alert(`Limit Reached`, `You can select up to ${MAX_SELECTABLE_SLOTS} slots.`);
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
      await AsyncStorage.setItem(`selectedSlots_${spot.id}`, JSON.stringify(selectedSlots));
      navigation.navigate('ConfirmBooking', { selectedSlots, spot });
    } catch (error) {
      console.error('Error saving slots:', error);
      Alert.alert('Error', 'Failed to save your selection. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  // Split slots into two columns dynamically
  const chunkedSlots = [];
  for (let i = 0; i < slots.length; i += Math.ceil(slots.length / 2)) {
    chunkedSlots.push(slots.slice(i, i + Math.ceil(slots.length / 2)));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select Slots for {spot.name}</Text>

      {/* Slot Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.availableSlot]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.reservedSlot]} />
          <Text style={styles.legendText}>Reserved</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.selectedSlot]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      <Text style={styles.slotLimitText}>Maximum {MAX_SELECTABLE_SLOTS} Slots per booking.</Text>

      {/* Slots Grid */}
      <View style={styles.slotsContainer}>
        {chunkedSlots.map((column, columnIndex) => (
          <View key={columnIndex} style={styles.column}>
            {column.map((slot) => (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slot,
                  slot.reserved
                    ? styles.reservedSlot
                    : slot.selected
                    ? styles.selectedSlot
                    : styles.availableSlot,
                ]}
                onPress={() => !slot.reserved && handleSlotSelection(slot.id)}
                disabled={slot.reserved}
              >
                <Text style={[styles.slotText, slot.reserved && styles.reservedSlotText]}>
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={[styles.confirmButton, confirming && styles.disabledButton]}
        onPress={handleConfirmSelection}
        disabled={confirming}
      >
        {confirming ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Define the styles object
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50, // Adjust padding for better spacing
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: width * 0.04,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  slot: {
    width: width * 0.4,
    height: width * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  availableSlot: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reservedSlot: {
    backgroundColor: 'red',
    opacity: 0.8,
  },
  selectedSlot: {
    backgroundColor: '#ffeb3b',
    borderWidth: 2,
    borderColor: '#ff9800',
  },
  confirmButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});

export default SlotSelectionScreen;
