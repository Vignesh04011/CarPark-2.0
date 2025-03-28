import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, Modal, ImageBackground } from "react-native";

const WalletScreen = () => {
  const [balance, setBalance] = useState(4219.0);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  
  const transactions = [
    { id: "1", type: "Added", amount: "+$100.00", date: "March 28, 2025", color: "lightgreen" },
    { id: "2", type: "Paid for Parking", amount: "-$4.20", date: "March 27, 2025", color: "red" },
    { id: "3", type: "Added", amount: "+$50.00", date: "March 26, 2025", color: "lightgreen" },
  ];

  const addMoney = () => {
    const newBalance = balance + parseFloat(amount);
    setBalance(newBalance);
    setModalVisible(false);
    setAmount(""); 
  };

  return (
    <ImageBackground source={require("../assets/images/background.jpg")} style={styles.background}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 My Wallet</Text>
        </View>

        {/* Wallet Balance */}
        <View style={styles.walletCard}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add Money</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>🧾 Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={[styles.transactionAmount, { color: item.color }]}>{item.amount}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
          )}
        />

        {/* Add Money Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter amount..."
                placeholderTextColor="#AAA"
                value={amount}
                onChangeText={setAmount}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={addMoney}>
                  <Text style={styles.buttonText}>Add Money</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
  walletCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFD700",
  },
  transactionItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  transactionDate: {
    fontSize: 14,
    color: "#ccc",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    width: "100%",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WalletScreen;
