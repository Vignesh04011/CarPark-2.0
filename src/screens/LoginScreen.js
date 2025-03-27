import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { AuthContext } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home'); // Navigate after successful login
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <Container>
      <Title>Login</Title>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleLogin}>
        {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Login</ButtonText>}
      </Button>
      <SignupText onPress={() => navigation.navigate('Register')}>
        Don't have an account? Sign Up
      </SignupText>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
`;

const Button = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  width: 90%;
  align-items: center;
  border-radius: 5px;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

const SignupText = styled.Text`
  margin-top: 10px;
  color: #007bff;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
`;

export default LoginScreen;
