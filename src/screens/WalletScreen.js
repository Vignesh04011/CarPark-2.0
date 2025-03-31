import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
  Animated,
  Easing,
  Dimensions,
  Platform
} from 'react-native';
import { DataContext } from '../contexts/DataContext';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const WalletScreen = () => {
  const { balance, updateBalance, transactions, addTransaction } = useContext(DataContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('John Doe');
  const [cardExpiry, setCardExpiry] = useState('12/25');
  const [cvv, setCvv] = useState('•••');
  const [showCvv, setShowCvv] = useState(false);

  // Animation values
  const cardRotateX = useRef(new Animated.Value(0)).current;
  const cardRotateY = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const cardElevation = useRef(new Animated.Value(8)).current;
  const balanceScale = useRef(new Animated.Value(1)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.8)).current;
  const addButtonScale = useRef(new Animated.Value(1)).current;
  const transactionItemOpacity = useRef(new Animated.Value(0)).current;

  // Card tilt animation based on gesture
  const handleCardMove = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const rotateX = ((locationY - 100) / 100) * 5;
    const rotateY = ((locationX - (width * 0.4)) / (width * 0.4)) * -5;
    
    Animated.spring(cardRotateX, {
      toValue: rotateX,
      friction: 8,
      useNativeDriver: true
    }).start();
    
    Animated.spring(cardRotateY, {
      toValue: rotateY,
      friction: 8,
      useNativeDriver: true
    }).start();
  };

  const resetCardPosition = () => {
    Animated.parallel([
      Animated.spring(cardRotateX, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true
      }),
      Animated.spring(cardRotateY, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();
  };

  const animateCardPress = () => {
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true
      })
    ]).start();
  };

  const animateBalance = () => {
    Animated.sequence([
      Animated.timing(balanceScale, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(balanceScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1),
        useNativeDriver: true
      })
    ]).start();
  };

  const animateAddButton = () => {
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1),
        useNativeDriver: true
      })
    ]).start();
  };

  const showSuccessAnimation = () => {
    successOpacity.setValue(0);
    successScale.setValue(0.8);
    
    Animated.parallel([
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(successScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      }, 2000);
    });
  };

  const animateTransactions = () => {
    transactionItemOpacity.setValue(0);
    Animated.timing(transactionItemOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  useEffect(() => {
    animateTransactions();
  }, [transactions]);

  const handleAddMoney = () => {
    const amount = Math.round(parseFloat(addAmount) * 100) / 100;
    if (isNaN(amount)) {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
      return;
    }
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than zero.');
      return;
    }
    
    updateBalance(balance + amount);
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    addTransaction({ type: 'Balance Added', time, amount });
    
    setModalVisible(false);
    setAddAmount('');
    animateBalance();
    showSuccessAnimation();
  };

  const handleEditCard = () => {
    animateCardPress();
    setCardModalVisible(true);
  };

  const handleCardNumberChange = (input) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleSaveCard = () => {
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

    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      Alert.alert('Invalid CVV', 'Please enter a 3-digit CVV number.');
      return;
    }

    setCardModalVisible(false);
  };

  const formatExpiryDate = (input) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      const month = cleaned.substring(0, 2);
      const year = cleaned.substring(2);
      const formatted = year ? `${month}/${year}` : month;
      setCardExpiry(formatted || 'MM/YY');
    } else {
      setCardExpiry(cleaned || 'MM/YY');
    }
  };

  const formatCvv = (input) => {
    const cleaned = input.replace(/\D/g, '').slice(0, 3);
    setCvv(cleaned || '•••');
  };

  const cardInterpolateX = cardRotateX.interpolate({
    inputRange: [-5, 0, 5],
    outputRange: ['-5deg', '0deg', '5deg']
  });

  const cardInterpolateY = cardRotateY.interpolate({
    inputRange: [-5, 0, 5],
    outputRange: ['5deg', '0deg', '-5deg']
  });

  const cardShadowOpacity = cardElevation.interpolate({
    inputRange: [8, 20],
    outputRange: [0.2, 0.4]
  });

  const cardShadowRadius = cardElevation.interpolate({
    inputRange: [8, 20],
    outputRange: [10, 20]
  });

  const cardStyle = {
    transform: [
      { rotateX: cardInterpolateX },
      { rotateY: cardInterpolateY },
      { scale: cardScale },
      { perspective: 1000 }
    ],
    elevation: cardElevation,
    shadowOpacity: cardShadowOpacity,
    shadowRadius: cardShadowRadius
  };

  const balanceStyle = {
    transform: [{ scale: balanceScale }]
  };

  const successStyle = {
    opacity: successOpacity,
    transform: [{ scale: successScale }]
  };

  const addButtonStyle = {
    transform: [{ scale: addButtonScale }]
  };

  const transactionItemStyle = (index) => ({
    opacity: transactionItemOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, (transactions.length - index) * 0.2 + 0.6]
    }),
    transform: [
      {
        translateY: transactionItemOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [50 * (index + 1), 0]
        })
      },
      {
        scale: transactionItemOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1]
        })
      }
    ]
  });

  const renderTransactionItem = ({ item, index }) => (
    <Animated.View style={[styles.transactionItem, transactionItemStyle(index)]}>
      <View style={styles.transactionIcon}>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: item.amount < 0 ? '#ff4757' : '#2ed573' }
      ]}>
        {item.amount < 0 ? `-₹${Math.abs(item.amount).toFixed(2)}` : `+₹${item.amount.toFixed(2)}`}
      </Text>
    </Animated.View>
  );

  return (
    <LinearGradient colors={['#424242', '#000000']} style={styles.container}>
      {/* 3D Animated Card */}
      <Animated.View 
        style={[styles.card, cardStyle]}
        onStartShouldSetResponder={() => true}
        onResponderMove={handleCardMove}
        onResponderRelease={resetCardPosition}
        onResponderTerminate={resetCardPosition}
      >
        <TouchableOpacity 
          activeOpacity={1}
          onPress={handleEditCard}
          style={styles.cardTouchable}
        >
          <LinearGradient 
            colors={['#424242', '#000000']} 
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardChip} />
              <TouchableOpacity 
                style={styles.cardCvvButton}
                onPress={() => setShowCvv(!showCvv)}
              >
                <Text style={styles.cardCvvText}>
                  {showCvv ? cvv : '•••'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardNumber}>
              {cardModalVisible || cardNumber === '' 
                ? cardNumber || '1234 5678 9012 3456'
                : '•••• •••• •••• ' + cardNumber.slice(-4)}
            </Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardText}>{cardHolder}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardText}>{cardExpiry}</Text>
              </View>
              <View style={styles.cardLogo}>
                <View style={styles.cardLogoCircleRed} />
                <View style={styles.cardLogoCircleYellow} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Balance Container */}
      <Animated.View style={[styles.balanceContainer, balanceStyle]}>
        <TouchableOpacity 
          onPress={() => {
            setModalVisible(true);
            animateBalance();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
          <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>
          <View style={styles.balanceWave} />
        </TouchableOpacity>
      </Animated.View>

      {/* Transactions List */}
      <Text style={styles.transactionsTitle}>RECENT TRANSACTIONS</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.transactionsContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Money Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ADD MONEY</Text>
            <TextInput
              style={styles.input}
              placeholder="₹ Enter amount"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={addAmount}
              onChangeText={setAddAmount}
              autoFocus={true}
            />
            <Animated.View style={addButtonStyle}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => {
                  handleAddMoney();
                  animateAddButton();
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#424242', '#000000']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.buttonText}>ADD FUNDS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Card Modal */}
      <Modal visible={cardModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EDIT CARD</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CARD NUMBER</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>CARD HOLDER</Text>
              <TextInput
                style={styles.input}
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="John Doe"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>EXPIRY DATE</Text>
                <TextInput
                  style={styles.input}
                  value={cardExpiry}
                  onChangeText={formatExpiryDate}
                  keyboardType="numeric"
                  maxLength={5}
                  placeholder="MM/YY"
                  placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv.replace(/•/g, '')}
                  onChangeText={formatCvv}
                  keyboardType="numeric"
                  maxLength={3}
                  placeholder="123"
                  placeholderTextColor="#999"
                  secureTextEntry={!showCvv}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleSaveCard}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#424242', '#000000']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>SAVE CARD</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setCardModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Animation */}
      <Animated.View style={[styles.successContainer, successStyle]}>
        <LinearGradient
          colors={['#2ed573', '#7bed9f']}
          style={styles.successGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>₹{addAmount} ADDED</Text>
          <Text style={styles.successSubtitle}>to your wallet</Text>
        </LinearGradient>
      </Animated.View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
  },
  cardTouchable: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    padding: 25,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardChip: {
    width: 40,
    height: 30,
    backgroundColor: '#ffd700',
    borderRadius: 5,
  },
  cardCvvButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  cardCvvText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 3,
    marginVertical: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.17)',
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogoCircleRed: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eb445a',
    marginRight: -8,
    zIndex: 2,
  },
  cardLogoCircleYellow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffc409',
  },
  balanceContainer: {
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 25,
    borderRadius: 20,
    marginBottom: 25,
    shadowColor: '#3a0ca3',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    fontWeight: '500',
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3a0ca3',
  },
  balanceWave: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(58,12,163,0.05)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: 'white',
    letterSpacing: 1,
  },
  transactionsContainer: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a0ca3',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  transactionTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
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
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3a0ca3',
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  successContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: '80%',
    maxWidth: 300,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  successGradient: {
    padding: 25,
    alignItems: 'center',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    letterSpacing: 1,
  },
  successSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
});

export default WalletScreen;