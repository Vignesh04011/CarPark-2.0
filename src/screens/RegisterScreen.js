import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (passwordStrength < 4) {
      setError('Password must be strong: At least 6 characters, 1 uppercase, 1 number, 1 special character.');
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home'); // Navigate to Home after successful registration
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Try another email.');
      } else {
        setError('Registration failed. Try again.');
      }
    }

    setLoading(false);
  };

  // Function to check password strength
  const checkPasswordStrength = (pass) => {
    setPassword(pass);
    let strength = 0;

    if (pass.length >= 6) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1; // At least one uppercase letter
    if (/[0-9]/.test(pass)) strength += 1; // At least one number
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1; // At least one special character

    setPasswordStrength(strength);
  };

  // Determine color based on strength
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return '#FF3E3E'; // Red (Weak)
      case 2: return '#FFA500'; // Orange (Moderate)
      case 3: return '#FFD700'; // Yellow (Good)
      case 4: return '#28a745'; // Green (Strong)
      default: return '#e0e0e0'; // Grey (Empty)
    }
  };

  return (
    <Container>
      <Title>Register</Title>
      {error ? <ErrorText>{error}</ErrorText> : null}
      
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <PasswordContainer>
        <PasswordInput
          placeholder="Password"
          value={password}
          onChangeText={checkPasswordStrength} // Check strength as user types
          secureTextEntry={!showPassword}
        />
        <ShowHideButton onPress={() => setShowPassword(!showPassword)}>
          <ShowHideText>{showPassword ? 'Hide' : 'Show'}</ShowHideText>
        </ShowHideButton>
      </PasswordContainer>

      {/* Password Strength Bar */}
      <StrengthBar>
        <StrengthSegment filled={passwordStrength >= 1} color={getStrengthColor()} />
        <StrengthSegment filled={passwordStrength >= 2} color={getStrengthColor()} />
        <StrengthSegment filled={passwordStrength >= 3} color={getStrengthColor()} />
        <StrengthSegment filled={passwordStrength >= 4} color={getStrengthColor()} />
      </StrengthBar>
      <StrengthText color={getStrengthColor()}>
        {passwordStrength === 1 && 'Weak'}
        {passwordStrength === 2 && 'Moderate'}
        {passwordStrength === 3 && 'Good'}
        {passwordStrength === 4 && 'Strong'}
      </StrengthText>

      <PasswordContainer>
        <PasswordInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <ShowHideButton onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <ShowHideText>{showConfirmPassword ? 'Hide' : 'Show'}</ShowHideText>
        </ShowHideButton>
      </PasswordContainer>

      <Button onPress={handleRegister}>
        {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Register</ButtonText>}
      </Button>

      <SignupText onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </SignupText>
    </Container>
  );
};

// Styled Components
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

const PasswordContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 90%;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  margin-bottom: 10px;
`;

const PasswordInput = styled.TextInput`
  flex: 1;
  padding: 10px;
`;

const ShowHideButton = styled.TouchableOpacity`
  padding: 10px;
`;

const ShowHideText = styled.Text`
  color: #007bff;
  font-weight: bold;
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

// Password Strength Styles
const StrengthBar = styled.View`
  width: 90%;
  height: 8px;
  flex-direction: row;
  margin-bottom: 10px;
`;

const StrengthSegment = styled.View`
  flex: 1;
  height: 100%;
  margin: 1px;
  background-color: ${(props) => (props.filled ? props.color : '#e0e0e0')};
`;

const StrengthText = styled.Text`
  color: ${(props) => props.color};
  font-weight: bold;
  margin-bottom: 10px;
`;

export default RegisterScreen;
