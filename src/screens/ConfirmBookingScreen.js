import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import { DataContext } from '../contexts/DataContext';

const ConfirmBookingScreen = () => {
  const { balance, updateBalance, addTransaction } = useContext(DataContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedSlots, spot } = route.params;

  const [carType, setCarType] = useState('SUV');
  const [numberPlate, setNumberPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(balance);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const now = new Date();
  const initialCheckOut = new Date(now.getTime() + 60 * 60 * 1000);
  const [checkInTime, setCheckInTime] = useState(now);
  const [checkOutTime, setCheckOutTime] = useState(initialCheckOut);

  const duration = useMemo(() => Math.ceil((checkOutTime - checkInTime) / (1000 * 60 * 60)), [
    checkInTime,
    checkOutTime,
  ]);

  const bookingCost = useMemo(() => selectedSlots.length * duration * 50, [selectedSlots, duration]);

  useEffect(() => {
    setWalletBalance(balance);
  }, [balance]);

  const validateVehicleNumber = (number) => {
    const regex = /^[A-Z0-9]{6,10}$/i;
    return regex.test(number.trim());
  };

  const validateInputs = () => {
    if (!numberPlate.trim()) {
      Alert.alert('Validation Error', 'Please enter your vehicle number plate.');
      return false;
    }
    if (!validateVehicleNumber(numberPlate)) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid number plate (6-10 alphanumeric characters).'
      );
      return false;
    }
    if (duration < 1) {
      Alert.alert('Validation Error', 'Minimum booking duration is 1 hour.');
      return false;
    }
    if (walletBalance < bookingCost) {
      Alert.alert(
        'Insufficient Balance',
        `You need ₹${(bookingCost - walletBalance).toFixed(2)} more to complete this booking.`
      );
      return false;
    }
    return true;
  };

  const handleTimeChange = (type) => (event, date) => {
    if (type === 'checkIn') {
      setShowCheckInPicker(false);
      if (date) {
        setCheckInTime(date);
        if (checkOutTime <= date) {
          setCheckOutTime(new Date(date.getTime() + 60 * 60 * 1000));
        }
      }
    } else {
      setShowCheckOutPicker(false);
      if (date && date > checkInTime) {
        setCheckOutTime(date);
      }
    }
  };

  const handleConfirmBooking = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    updateBalance(walletBalance - bookingCost);
    addTransaction({
      type: 'Booking Payment',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      amount: -bookingCost,
    });

    const bookingId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const bookingDetails = {
      id: bookingId,
      spotId: spot.id,
      selectedSlots,
      carType,
      numberPlate: numberPlate.toUpperCase(),
      checkInTime: checkInTime.toISOString(),
      checkOutTime: checkOutTime.toISOString(),
      spotName: spot.name,
      qrCodeValue: bookingId,
      cost: bookingCost,
      status: 'confirmed',
    };

    try {
      const existingBookings = await AsyncStorage.getItem('bookings');
      const updatedBookings = existingBookings ? JSON.parse(existingBookings) : [];
      updatedBookings.push(bookingDetails);
      await AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));

      Alert.alert('Booking Confirmed!', `₹${bookingCost.toFixed(2)} has been deducted from your wallet.`, [
        { text: 'OK', onPress: () => navigation.navigate('Booking', { bookingDetails }) },
      ]);
    } catch (error) {
      console.error('Booking Error:', error);
      Alert.alert('Booking Error', 'Failed to complete booking. Please try again.');
      updateBalance(balance + bookingCost);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#424242', '#000000']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirm Booking</Text>
        <Text style={styles.subtitle}>{spot.name}</Text>
        <Text style={styles.slotsText}>Slots: {selectedSlots.join(', ')}</Text>

        <View style={styles.walletContainer}>
          <Text style={styles.walletBalance}>Wallet Balance: ₹{walletBalance.toFixed(2)}</Text>
        </View>

        <View style={styles.costContainer}>
          <Text style={styles.costText}>Total Cost: ₹{bookingCost.toFixed(2)}</Text>
          <Text style={styles.durationText}>({duration} hour{duration > 1 ? 's' : ''})</Text>
        </View>

        <View style={styles.inputContainer}>
          <Picker
            selectedValue={carType}
            onValueChange={setCarType}
            style={styles.picker}
            dropdownIconColor="#007bff"
          >
            <Picker.Item label="SUV" value="SUV" />
            <Picker.Item label="Sedan" value="Sedan" />
            <Picker.Item label="Hatchback" value="Hatchback" />
            <Picker.Item label="Truck" value="Truck" />
            <Picker.Item label="Motorcycle" value="Motorcycle" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Vehicle Number Plate"
          placeholderTextColor="#999"
          value={numberPlate}
          onChangeText={setNumberPlate}
          maxLength={10}
          autoCapitalize="characters"
          accessibilityLabel="Vehicle number plate input"
        />

        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowCheckInPicker(true)}
            accessibilityLabel="Select check-in time"
          >
            <Text style={styles.timeText}>
              Check-In: {checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowCheckOutPicker(true)}
            accessibilityLabel="Select check-out time"
          >
            <Text style={styles.timeText}>
              Check-Out: {checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {showCheckInPicker && (
          <DateTimePicker
            value={checkInTime}
            mode="time"
            is24Hour={true}
            display="clock"
            onChange={handleTimeChange('checkIn')}
            minimumDate={new Date()}
          />
        )}
        {showCheckOutPicker && (
          <DateTimePicker
            value={checkOutTime}
            mode="time"
            is24Hour={true}
            display="clock"
            onChange={handleTimeChange('checkOut')}
            minimumDate={new Date(checkInTime.getTime() + 60 * 60 * 1000)}
          />
        )}

        <TouchableOpacity
          style={[styles.confirmButton, (loading || walletBalance < bookingCost) && styles.disabledButton]}
          onPress={handleConfirmBooking}
          disabled={loading || walletBalance < bookingCost}
          accessibilityLabel="Confirm booking button"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {walletBalance < bookingCost ? 'Insufficient Balance' : 'Confirm Booking'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Slot Selection</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ccc',
    marginBottom: 15,
  },
  slotsText: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
    fontWeight: '500',
  },
  walletContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  walletBalance: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  costContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  costText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  durationText: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  timeText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#7a9cc6',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ccc',
    textDecorationLine: 'underline',
  },
});

export default ConfirmBookingScreen;