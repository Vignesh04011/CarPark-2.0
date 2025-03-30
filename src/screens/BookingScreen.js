import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";

const BookingScreen = () => {
  const route = useRoute();
  const { bookingDetails } = route.params || {};

  const [currentBooking, setCurrentBooking] = useState({
    location: "",
    slot: "",
    startTime: "",
    endTime: "",
    licensePlate: "",
    carModel: "",
    qrData: "",
  });

  useEffect(() => {
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
      console.log("QR Data:", bookingDetails.qrCodeValue);
    }
  }, [bookingDetails]);

  const bookingHistory = [
    {
      id: "1",
      location: "Central Mall Parking",
      slot: "B08",
      startTime: "5:00 PM",
      endTime: "7:00 PM",
      licensePlate: "XYZ-5678",
      carModel: "Honda Civic",
    },
    {
      id: "2",
      location: "Green Park Basement",
      slot: "C22",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      licensePlate: "LMN-7890",
      carModel: "Ford Mustang",
    },
  ];

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>🚗 My Bookings</Text>
          </View>

          <View style={styles.bookingCard}>
            <Text style={styles.sectionTitle}>🔄 Active Booking</Text>
            <Text style={styles.bookingText}>📍 {currentBooking.location}</Text>
            <Text style={styles.bookingText}>🅿️ Slot: {currentBooking.slot}</Text>
            <Text style={styles.bookingText}>
              ⏳ Time: {currentBooking.startTime} - {currentBooking.endTime}
            </Text>
            <Text style={styles.bookingText}>
              🚘 Car: {currentBooking.carModel} ({currentBooking.licensePlate})
            </Text>
            <View style={styles.qrContainer}>
              {currentBooking.qrData ? (
                <QRCode value={currentBooking.qrData} size={150} />
              ) : (
                <Text>No QR Code Data</Text>
              )}
            </View>
          </View>

          <Text style={styles.sectionTitle}>📜 Booking History</Text>
          {bookingHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <Text style={styles.bookingText}>📍 {item.location}</Text>
              <Text style={styles.bookingText}>🅿️ Slot: {item.slot}</Text>
              <Text style={styles.bookingText}>
                ⏳ Time: {item.startTime} - {item.endTime}
              </Text>
              <Text style={styles.bookingText}>
                🚘 Car: {item.carModel} ({item.licensePlate})
              </Text>
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
    paddingBottom: 40,
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
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
});

export default BookingScreen;