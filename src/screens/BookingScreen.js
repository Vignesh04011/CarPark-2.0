import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground } from "react-native";
import QRCode from "react-native-qrcode-svg";

const BookingScreen = () => {
  const [currentBooking, setCurrentBooking] = useState({
    location: "Downtown Parking Lot",
    slot: "A12",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    licensePlate: "ABC-1234",
    carModel: "Toyota Corolla",
    paymentStatus: "Paid",
    qrData: "ABC-1234_A12_10:00-12:00",
  });

  const bookingHistory = [
    {
      id: "1",
      location: "Central Mall Parking",
      slot: "B08",
      startTime: "5:00 PM",
      endTime: "7:00 PM",
      licensePlate: "XYZ-5678",
      carModel: "Honda Civic",
      paymentStatus: "Paid",
    },
    {
      id: "2",
      location: "Green Park Basement",
      slot: "C22",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      licensePlate: "LMN-7890",
      carModel: "Ford Mustang",
      paymentStatus: "Paid",
    },
  ];

  return (
    <ImageBackground source={require("../assets/images/background.jpg")} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🚗 My Bookings</Text>
          </View>

          {/* Current Booking with QR Code */}
          <View style={styles.bookingCard}>
            <Text style={styles.sectionTitle}>🔄 Active Booking</Text>
            <Text style={styles.bookingText}>📍 {currentBooking.location}</Text>
            <Text style={styles.bookingText}>🅿️ Slot: {currentBooking.slot}</Text>
            <Text style={styles.bookingText}>⏳ Time: {currentBooking.startTime} - {currentBooking.endTime}</Text>
            <Text style={styles.bookingText}>🚘 Car: {currentBooking.carModel} ({currentBooking.licensePlate})</Text>
            <Text style={[styles.paymentStatus, { color: "green" }]}>💳 {currentBooking.paymentStatus}</Text>
            <View style={styles.qrContainer}>
              <QRCode value={currentBooking.qrData} size={150} />
            </View>
          </View>

          {/* Booking History */}
          <Text style={styles.sectionTitle}>📜 Booking History</Text>
          {bookingHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <Text style={styles.bookingText}>📍 {item.location}</Text>
              <Text style={styles.bookingText}>🅿️ Slot: {item.slot}</Text>
              <Text style={styles.bookingText}>⏳ Time: {item.startTime} - {item.endTime}</Text>
              <Text style={styles.bookingText}>🚘 Car: {item.carModel} ({item.licensePlate})</Text>
              <Text style={[styles.paymentStatus, { color: "green" }]}>💳 {item.paymentStatus}</Text>
            </View>
          ))}

        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40, // Added padding for scrolling
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
  },
  bookingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  qrContainer: {
    marginTop: 15,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFD700",
  },
  bookingText: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 3,
  },
  paymentStatus: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
});

export default BookingScreen;
