import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios'; // Ensure axios is installed
import { useNavigation } from '@react-navigation/native';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    setLoading(true);
  
    try {
      // Replace with your actual backend URL
      const response = await axios.post('https://26bc-45-127-197-36.ngrok-free.app/login', {
        email,
        password,
      });
  
      if (response.data.success) {
        console.log("LOGIN SUCCESSFULL");
        navigation.navigate('GuidelinesScreen'); // Navigate to the next screen on successful login
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false); // Stop loading spinner or indicator
    }
  };
  
  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match!");
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://54f9-45-127-197-36.ngrok-free.app/create-account', {
        email,
        password,
      });

      if (response.data.success) {
        navigation.navigate('Guidelines');
      } else {
        Alert.alert('Account Creation Failed', response.data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Account creation error:', error);
      Alert.alert('Error', 'An error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E6E6FA', '#D8BFD8']} style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo.png')} // Add your logo here
          style={styles.logo}
        />
        <Text style={styles.title}>NariSuraksha</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000000"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#000000"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={isLogin ? handleLogin : handleCreateAccount}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? (isLogin ? 'Logging in...' : 'Creating Account...') : (isLogin ? 'Login' : 'Create Account')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleText}>
            {isLogin ? "Don't have an account? Create one" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 150, // Increased width
    height: 150, // Increased height
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4B0082', // Deep Purple for contrast
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#4B0082', // Deep Purple for both buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default AuthScreen;