import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GuidelinesScreen = () => {
  const navigation = useNavigation();

  const handleOpenChatbot = () => {
    navigation.navigate('ChildNavigator', { screen: 'NariAssistScreen' });
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>WELCOME SAKHI</Text>
        <Text style={styles.slogan}>By a Woman for the Women</Text>

        <View style={styles.section}>
          <Image
            source={require('../assets/images/logo.png')} // Ensure this path is correct
            style={styles.image}
          />
          <Text style={styles.heading}>Emergency Alert Activation</Text>
          <Text style={styles.description}>
            In case of any danger, press the power-off button three times. This will:
            {'\n'}• Trigger a loud alarm
            {'\n'}• Automatically call the nearest police station
            {'\n'}• Share your location with the authorities and your selected emergency contacts
          </Text>
        </View>

        <View style={styles.section}>
          <Image
            source={require('../assets/images/contact_sync_icon.png')} // Ensure this path is correct
            style={styles.image}
          />
          <Text style={styles.heading}>Syncing Contacts</Text>
          <Text style={styles.description}>
            On the HomeScreen, your contacts will be synced automatically. Please select 5 emergency contacts who will be notified with your location during an emergency.
          </Text>
        </View>

        <View style={styles.section}>
          <Image
            source={require('../assets/images/avataaars.png')} // Ensure this path is correct
            style={styles.image}
          />
          <Text style={styles.heading}>Using NariAssist</Text>
          <Text style={styles.description}>
            Our integrated chatbot 'NariAssist' is available to help you with the app's functionalities and provide guidance in multiple languages, including Hindi. Just tap on the chatbot icon on the screen to start.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Button for NariAssist */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleOpenChatbot}>
        <Text style={styles.floatingButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6FA', // Lavender color
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4B0082', // Dark purple
    textAlign: 'center',
    marginVertical: 20,
  },
  slogan: {
    fontSize: 18,
    color: '#6A5ACD', // Slate blue
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#F3E5F5', // Lighter lavender for section background
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#483D8B', // Dark slate blue
    lineHeight: 22,
  },
  image: {
    width: 60,
    height: 50,
    marginBottom: 15,
    alignSelf: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4B0082', // Dark purple
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Add shadow on Android
  },
  floatingButtonText: {
    color: '#FFFFFF', // White text color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuidelinesScreen;




