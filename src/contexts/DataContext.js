import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [balance, setBalance] = useState(0.00);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        const storedTransactions = await AsyncStorage.getItem('transactions');

        if (storedBalance) {
          setBalance(parseFloat(storedBalance));
        }

        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('balance', balance.toString());
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [balance, transactions]);

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  return (
    <DataContext.Provider value={{ balance, updateBalance, transactions, addTransaction }}>
      {children}
    </DataContext.Provider>
  );
};