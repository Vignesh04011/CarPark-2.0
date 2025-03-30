import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from '../contexts/DataContext';

const WalletScreen = () => {
  const { balance, updateBalance, transactions, addTransaction } = useContext(DataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('**** **** **** 1234');
  const [cardHolder, setCardHolder] = useState('John Doe');
  const [cardExpiry, setCardExpiry] = useState('32/64');
  const [showSuccess, setShowSuccess] = useState(false);
  const successAmount = useRef(0);
  const successTime = useRef('');

  useEffect(() => {
    if (showSuccess) {
      setTimeout(() => setShowSuccess(false), 2500);
    }
  }, [showSuccess]);

  const handleAddMoney = () => {
    const amount = parseFloat(addAmount) || 0;
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    updateBalance(balance + amount);
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addTransaction({ type: 'Balance Added', time, amount });
    setModalVisible(false);
    setAddAmount('');
    successAmount.current = amount;
    successTime.current = time;
    setShowSuccess(true);
  };

  const handleEditCard = () => {
    setCardModalVisible(true);
  };

  const handleSaveCard = () => {
    if (!cardNumber || !cardHolder || !cardExpiry) {
      Alert.alert('Missing Fields', 'Please fill in all card details.');
      return;
    }

    const cleanedNumber = cardNumber.replace(/\s/g, '');
    if (cleanedNumber.length !== 16 || !/^\d+$/.test(cleanedNumber)) {
      Alert.alert('Invalid Card Number', 'Please enter a 16-digit card number.');
      return;
    }

    const cleanedExpiry = cardExpiry.replace(/\D/g, '');
    if (cleanedExpiry.length !== 4 || !/^\d+$/.test(cleanedExpiry)) {
      Alert.alert('Invalid Expiry Date', 'Please enter a valid expiry date (MMYY).');
      return;
    }

    setCardModalVisible(false);
  };

  const formatCardNumber = (input) => {
    const cleaned = input.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const formatExpiryDate = (input) => {
    const cleaned = input.replace(/\D/g, '');
    if (cleaned.length > 4) {
      cleaned = cleaned.substring(0, 4);
    }
    if (cleaned.length >= 2) {
      const month = cleaned.substring(0, 2);
      const year = cleaned.substring(2);
      const formatted = year ? `${month}/${year}` : month;
      setCardExpiry(formatted);
    } else {
      setCardExpiry(cleaned);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleEditCard}>
        <Text style={styles.cardTitle}>Payment Card</Text>
        <Text style={styles.cardNumber}>{cardNumber}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardText}>{cardHolder}</Text>
          <Text style={styles.cardText}>Exp: {cardExpiry}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.balanceContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
      </TouchableOpacity>

      <Text style={styles.transactionsTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionTime}>{item.time}</Text>
            </View>
            <Text style={[
              styles.transactionAmount,
              { color: item.amount < 0 ? 'red' : 'green' }
            ]}>
              {item.amount < 0 ? `-₹${Math.abs(item.amount).toFixed(2)}` : `+₹${item.amount.toFixed(2)}`}
            </Text>
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Money</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={addAmount}
              onChangeText={setAddAmount}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddMoney}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={cardModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Card</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Holder</Text>
              <TextInput
                style={styles.input}
                value={cardHolder}
                onChangeText={setCardHolder}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={cardExpiry}
                onChangeText={formatExpiryDate}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleSaveCard}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setCardModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSuccess} transparent={true}>
        <View style={styles.successOverlay}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>₹{successAmount.current.toFixed(2)} added successfully</Text>
            <View style={styles.successDetails}>
              <Text style={styles.successDetailText}>Amount: ₹{successAmount.current.toFixed(2)}</Text>
              <Text style={styles.successDetailText}>Type: Money Added</Text>
              <Text style={styles.successDetailText}>Time: {successTime.current}</Text>
            </View>
            <Text style={styles.successFooter}>Transaction Successful</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  card: {
    backgroundColor: '#3f51b5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  transactionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionType: {
    fontSize: 16,
    color: '#333',
  },
  transactionTime: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#3f51b5',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  successIcon: {
    backgroundColor: 'green',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  successIconText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successDetails: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  successDetailText: {
    fontSize: 16,
  },
  successFooter: {
    fontSize: 16,
    color: '#888',
  },
});

export default WalletScreen;