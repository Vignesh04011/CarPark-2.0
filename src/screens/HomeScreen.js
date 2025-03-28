import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, ImageBackground } from "react-native";

const HomeScreen = () => {
  const [booking, setBooking] = useState({
    status: "Booked",
    slot: "A12",
    location: "Downtown Parking Lot",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    licensePlate: "ABC-1234",
    carModel: "Toyota Corolla",
    paymentStatus: "Paid",
  });

  const nearbyParking = [
    {
      id: 1,
      name: "Toserba Yogya Parking",
      location: "J.L. R.E. Martadinata, Cikole",
      price: "$4.20/hr",
      time: "4 min",
      availableSlots: 28,
      image: require("../assets/images/ParkingA.png"),
    },
    {
      id: 2,
      name: "Central Mall Parking",
      location: "J.L. Sudirman, Bandung",
      price: "$5.00/hr",
      time: "6 min",
      availableSlots: 15,
      image: require("../assets/images/ParkingA.png"),
    },
    {
      id: 3,
      name: "Green Park Basement",
      location: "J.L. Asia Afrika, Jakarta",
      price: "$3.80/hr",
      time: "8 min",
      availableSlots: 20,
      image: require("../assets/images/ParkingA.png"),
    },
  ];

  return (
    <ImageBackground source={require("../assets/images/background.jpg")} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, John Doe 👋</Text>
            <Text style={styles.location}>📍 New York, USA</Text>
          </View>
          <TouchableOpacity>
            <Image source={require("../assets/icons/notification.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Wallet Balance */}
        <View style={styles.walletCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>$4,219.00</Text>
        </View>

        {/* Live Booking */}
        <View style={styles.bookingCard}>
          <Text style={styles.sectionTitle}>🚗 Live Booking Session</Text>
          <Text style={styles.status}>Status: {booking.status}</Text>
          <Text>📍 Location: {booking.location}</Text>
          <Text>🅿️ Slot: {booking.slot}</Text>
          <Text>⏳ Time: {booking.startTime} - {booking.endTime}</Text>
          <Text>🚘 Car: {booking.carModel} ({booking.licensePlate})</Text>
          <Text>💳 Payment: {booking.paymentStatus}</Text>

          {/* Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Extend Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Image source={require("../assets/icons/search.png")} style={styles.icon} />
          <TextInput placeholder="Find Parking Space..." placeholderTextColor="#AAA" style={styles.searchInput} />
        </View>

        {/* Nearby Parking */}
        <Text style={styles.sectionTitle}>📍 Nearby Parking Spaces</Text>
        {nearbyParking.map((spot) => (
          <View key={spot.id} style={styles.parkingCard}>
            <Image source={spot.image} style={styles.parkingImage} />
            <View style={styles.parkingInfo}>
              <Text style={styles.parkingName}>{spot.name}</Text>
              <Text style={styles.parkingLocation}>{spot.location}</Text>
              <Text style={styles.parkingDetails}>
                {spot.price} • {spot.time} away • {spot.availableSlots} Available
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  location: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  walletCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700",
  },
  addButton: {
    backgroundColor: "#FFf",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  bookingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFD700",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "lightgreen",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 12,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: "#fff",
  },
  parkingCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 5,
    alignItems: "center",
  },
  parkingImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 8,
  },
  parkingInfo: {
    flex: 1,
  },
  parkingName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  parkingLocation: {
    fontSize: 14,
    color: "#ccc",
  },
  parkingDetails: {
    fontSize: 14,
    color: "#eee",
    marginTop: 5,
  },
});

export default HomeScreen;
