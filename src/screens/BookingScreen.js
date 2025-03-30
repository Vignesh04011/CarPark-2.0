import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const [bookingHistory, setBookingHistory] = useState([]);

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

  useEffect(() => {
    const loadBookingHistory = async () => {
      try {
        const storedBookings = await AsyncStorage.getItem("bookings");
        if (storedBookings) {
          const parsedBookings = JSON.parse(storedBookings);
          const history = parsedBookings.filter(
            (booking) => booking.id !== currentBooking.qrData
          );
          setBookingHistory(history);
        }
      } catch (error) {
        console.error("Error loading booking history:", error);
      }
    };
    loadBookingHistory();
  }, [currentBooking.qrData]);

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyCard}>
      <Text style={styles.bookingText}>📍 {item.spotName}</Text>
      <Text style={styles.bookingText}>🅿️ Slot: {item.selectedSlots.join(", ")}</Text>
      <Text style={styles.bookingText}>
        ⏳ Time: {new Date(item.checkInTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })} -{" "}
        {new Date(item.checkOutTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={styles.bookingText}>
        🚘 Car: {item.carType} ({item.numberPlate})
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/background.jpg")}
      style={styles.background}
    >
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
        <FlatList
          data={bookingHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          style={styles.flatList} // added style to flatlist
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
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
  flatList: {
    flex: 1,
  }
});

export default BookingScreen;