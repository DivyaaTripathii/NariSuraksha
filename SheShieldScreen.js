import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av'; 
import * as Location from 'expo-location'; 
import axios from 'axios'; 
import * as SMS from 'expo-sms'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const SheShieldScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [helpCount, setHelpCount] = useState(0);
  const [sound, setSound] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const setup = async () => {
      // Load the beep sound
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/images/alert-beep.mp3') 
      );
      setSound(sound);

      // Fetch user-selected contacts and location
      const contacts = await AsyncStorage.getItem('selectedContacts');
      setSelectedContacts(contacts ? JSON.parse(contacts) : []);
      const userLocation = await getLocation();
      setLocation(userLocation);

      // Set up voice recognition listeners
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechEnd = onSpeechEnd;
    };

    setup();

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const onSpeechResults = (e) => {
    const { value } = e;
    console.log('Speech results:', value);
    if (value.some(v => v.includes('help'))) {
      setHelpCount((prevCount) => {
        const newCount = prevCount + 1;
        console.log('Help count:', newCount); // Debugging line
        if (newCount >= 3) {
          triggerEmergencyAlert();
          return 0; // Reset count after triggering alert
        }
        return newCount;
      });
    }
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    Speech.speak('Stopped listening for commands.');
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      setIsListening(false);
      Voice.stop();
      Speech.speak('Stopped listening for commands.');
    } else {
      setIsListening(true);
      Voice.start('en-US'); 
      Speech.speak('Listening for emergency commands. Please speak now.');
    }
  };

  const sendSmsAlert = async (phoneNumber, message) => {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        const { result } = await SMS.sendSMSAsync([phoneNumber], message);
        console.log(`SMS sent to ${phoneNumber}: ${result}`);
      } else {
        console.error('SMS service is not available on this device');
        Alert.alert('Error', 'SMS service is not available on this device.');
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      Alert.alert('Error', 'Failed to send SMS.');
    }
  };

  const triggerEmergencyAlert = async () => {
    setAlertTriggered(true);
    setIsLoading(true);
  
    Alert.alert('Emergency Alert', 'Help command detected. Triggering alarm.');
  
    if (sound) {
      await sound.playAsync();
    }
  
    Speech.speak('Emergency alert triggered. Help command detected.');
  
    try {
      const userLocation = await getLocation();
      if (!userLocation) {
        Alert.alert('Error', 'Location could not be retrieved.');
        return;
      }
  
      const { coords } = userLocation;
      const googleMapsLink = generateGoogleMapsLink(coords.latitude, coords.longitude);
  
      const nearestPoliceStation = await getNearbyPoliceStations(coords.latitude, coords.longitude);
      if (!nearestPoliceStation) {
        Alert.alert('Error', 'Could not find a nearby police station.');
        return;
      }
  
      const alertMessage = `Emergency alert triggered! Location:\nLatitude: ${coords.latitude}, Longitude: ${coords.longitude}\nGoogle Maps: ${googleMapsLink}`;
  
      for (const contact of selectedContacts) {
        await sendSmsAlert(contact, alertMessage);
      }
  
      // Send SMS to the nearest police station
      if (nearestPoliceStation.formatted_phone_number) {
        await sendSmsAlert(nearestPoliceStation.formatted_phone_number, alertMessage);
      } else {
        console.error('No phone number found for the nearest police station.');
      }
  
    } catch (error) {
      console.error('Error triggering emergency alert:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateGoogleMapsLink = (latitude, longitude) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return null;
      }
      let location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'An error occurred while getting the location.');
      return null;
    }
  };

  const getNearbyPoliceStations = async (latitude, longitude) => {
    try {
      // Mocking a response with a nearby police station
      const mockPoliceStation = {
        name: 'Local Police Station',
        formatted_phone_number: '9068122248', // Example phone number
      };

      // In a real scenario, you'd replace this with an API request to fetch nearby police stations
      console.log(`Fetching nearby police stations for location (${latitude}, ${longitude})`);
      return mockPoliceStation; // Simulate a police station response
    } catch (error) {
      console.error('Error fetching police stations:', error);
      return null;
    }
  };

  const saveSelectedContacts = async (contacts) => {
    await AsyncStorage.setItem('selectedContacts', JSON.stringify(contacts));
    setSelectedContacts(contacts);
  };

  return (
    <LinearGradient
      colors={['#E6E6FA', '#D8BFD8']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/shield-icon.png')}
          style={styles.shieldIcon}
        />
        <Text style={styles.title}>She-Shield</Text>
        <Text style={styles.subtitle}>Empowering Women, Ensuring Safety</Text>

        <TouchableOpacity
          style={[styles.button, isListening && styles.activeButton]}
          onPress={handleVoiceCommand}
        >
          <Text style={styles.buttonText}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={triggerEmergencyAlert}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Trigger Emergency Alert</Text>
        </TouchableOpacity>

        {isLoading && (
          <ActivityIndicator size="large" color="#4B0082" />
        )}

        {alertTriggered && (
          <Text style={styles.message}>Stay Safe!!</Text>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  shieldIcon: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6A5ACD',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#9370DB',
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  activeButton: {
    backgroundColor: '#6A5ACD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 18,
    color: '#FF4500',
    marginTop: 20,
  },
});

export default SheShieldScreen;
