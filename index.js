import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import avatarImage from '../assets/images/avataaars.png'; // Adjust the path as needed
import SyncContactsScreen from '../Screens/SyncContactsScreen.js';
import SheShieldScreen from '../Screens/SheShieldScreen.js';

const CombinedScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false); // State for chatbot visibility
  const [messages, setMessages] = useState([]);
  const [showSyncContacts, setShowSyncContacts] = useState(false); // State for SyncContactsScreen
  const [showSheShield, setShowSheShield] = useState(false); // State for SheShieldScreen

  const navigation = useNavigation();

  useEffect(() => {
    if (showChatbot) {
      setInitialMessages();
    }
  }, [showChatbot]);

  const setInitialMessages = () => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'NariAssist',
          avatar: avatarImage,
        },
      },
    ]);
  };

  const onSend = useCallback((newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    handleBotResponse(newMessages[0].text);
  }, []);

  const handleBotResponse = (userInput) => {
    let botResponse = '';
    const input = userInput.toLowerCase();

    if (input.includes('hi') || input.includes('hello')) {
        botResponse = 'Hi there! I am NariAssist. How can I help you today?';
    } else if (input.includes('who are you')) {
        botResponse = 'I am NariAssist, your virtual assistant in the NariSuraksha app. I am here to guide you through the app and assist you in any situation.';
    } else if (input.includes('emergency') || input.includes('alert')) {
        botResponse = 'In case of an emergency, press the power button three times quickly. This will activate a loud alarm, contact the nearest police station, and share your location with authorities and up to five pre-selected emergency contacts.';
    } else if (input.includes('how to use') || input.includes('features')) {
        botResponse = 'NariSuraksha provides several features to ensure your safety. Besides the emergency alert, you can also customize your emergency contacts and access safety tips. Let me know if you need details on a specific feature.';
    } else if (input.includes('feedback') || input.includes('suggestions')) {
        botResponse = 'We appreciate your feedback! Please share any suggestions you have to help us improve the app.';
    } else if (input.includes('support') || input.includes('contact')) {
        botResponse = 'You can contact our support team via email at support@narisuraksha.com. They are available to assist you with any issues or inquiries you may have.';
    } else if (input.includes('login') || input.includes('account')) {
        botResponse = 'If you are experiencing issues with logging in or managing your account, please refer to the login page or contact our support team for assistance.';
    } else if (input.includes('bye') || input.includes('goodbye')) {
        botResponse = 'Goodbye! If you need further assistance, don’t hesitate to reach out. Stay safe!';
    } else if (input.includes('language') || input.includes('hindi')) {
        botResponse = 'I can assist you in multiple languages, including Hindi. Please let me know if you prefer to continue in Hindi.';
    } else if (input.includes('how to set up emergency contacts')) {
        botResponse = 'To set up your emergency contacts, go to the settings menu in the app and select “Emergency Contacts.” From there, you can add up to five contacts who will be notified in case of an emergency.';
    } else if (input.includes('power off') || input.includes('press power button') || input.includes('three times')) {
        botResponse = 'Pressing the power button three times will activate an emergency alert. This action will trigger a loud alarm, contact the nearest police station, and share your location with your emergency contacts.';
    } else if (input.includes('update profile') || input.includes('change details')) {
        botResponse = 'To update your profile or change your details, please go to the settings menu and select “Profile.” You can modify your personal information there.';
    } else if (input.includes('app crash') || input.includes('not working')) {
        botResponse = 'I’m sorry to hear that you’re experiencing issues. Please try restarting the app, and if the problem persists, contact our support team for help.';
    } else if (input.includes('report') || input.includes('issue')) {
        botResponse = 'To report an issue, please contact our support team with the details of the problem you’re facing. We will address it as soon as possible.';
    } else if (input.includes('settings') || input.includes('preferences')) {
        botResponse = 'You can adjust your app settings and preferences by navigating to the settings menu in the app. Let me know if you need help with a specific setting.';
    } else if (input.includes('location sharing') || input.includes('location sent') || input.includes('how is my location shared') || input.includes('where is my location sent')) {
        botResponse = 'When the emergency alert is activated, your location is shared with the nearest police station and the emergency contacts you selected when setting up the app. This ensures help can reach you quickly.';
    } else if (input.includes('deactivate alert') || input.includes('stop alert') || input.includes('how do i stop the emergency alert') || input.includes('can i turn off the alert')) {
        botResponse = 'To deactivate the emergency alert, you can go to the app and turn off the alert from the notification. You can also contact your emergency contacts directly to inform them that you are safe.';
    } else if (input.includes('battery usage') || input.includes('data usage') || input.includes('does nariSuraksha use a lot of battery') || input.includes('how much data does nariSuraksha use')) {
        botResponse = 'NariSuraksha is designed to be energy-efficient, using minimal battery power while running in the background. Data usage is also kept to a minimum, primarily used for sending location updates during an emergency.';
    } else if (input.includes('permissions') || input.includes('app permissions') || input.includes('why does nariSuraksha need access to my location') || input.includes('what permissions does nariSuraksha require')) {
        botResponse = 'NariSuraksha requires access to your location to function properly in case of an emergency. It also needs permission to send notifications, access your contacts for emergency purposes, and make phone calls to authorities when necessary.';
    } else if (input.includes('safety tips') || input.includes('stay safe') || input.includes('can you give me some safety tips') || input.includes('how can i stay safe')) {
        botResponse = 'NariSuraksha recommends always sharing your location with trusted contacts, staying aware of your surroundings, and keeping your phone charged. If you ever feel unsafe, don\'t hesitate to activate the emergency alert.';
    } else if (input.includes('offline mode') || input.includes('no network') || input.includes('can nariSuraksha work without internet') || input.includes('what if i don’t have a network')) {
        botResponse = 'NariSuraksha requires an internet connection to send your location and make emergency calls. However, the loud alarm will still activate even without internet, helping to draw attention to your situation.';
    } else if (input.includes('emergency contacts setup') || input.includes('how do i set up my emergency contacts') || input.includes('how can i choose who gets alerted')) {
        botResponse = 'To set up your emergency contacts in NariSuraksha, go to the settings menu and select "Emergency Contacts." You can add up to five contacts who will be notified in case of an emergency.';
    } else if (input.includes('profile and account management') || input.includes('how do i update my profile') || input.includes('can i change my details')) {
        botResponse = 'To update your profile or change your details in NariSuraksha, go to the settings menu and select "Profile." Here, you can update your personal information and emergency contact preferences.';
    } else if (input.includes('multi-language support') || input.includes('can i use nariSuraksha in another language') || input.includes('is hindi supported')) {
        botResponse = 'Yes, NariSuraksha supports multiple languages, including Hindi. You can change the app\'s language in the settings menu under "Language Preferences."';
    } else if (input.includes('troubleshooting') || input.includes('nariSuraksha isn’t working properly') || input.includes('what should i do if the app crashes')) {
        botResponse = 'If you encounter issues with NariSuraksha, try restarting the app. If the problem persists, please contact our support team at support@narisuraksha.com for further assistance.';
    } else {
        botResponse = 'Sorry, I didn’t understand that. Can you please clarify?';
    }

    sendBotResponse(botResponse);
};


  const sendBotResponse = (text) => {
    const newBotMessage = {
      _id: Math.random().toString(36).substr(2, 9),
      text: text,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'NariAssist',
        avatar: avatarImage,
      },
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [newBotMessage]));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://aadf-118-185-234-163.ngrok-free.app/login', {
        email,
        password,
      });

      if (response.data.success) {
        console.log("LOGIN SUCCESSFUL");
        setShowGuidelines(true);
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
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
      const response = await axios.post('https://0252-45-127-197-36.ngrok-free.app/create-account', {
        email,
        password,
      });

      if (response.data.success) {
        setShowGuidelines(true);
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

  const openNariAssistChatbot = () => {
    setShowChatbot(true); // Show the chatbot
  };
  const openSyncContacts = () => {
    setShowSyncContacts(true); // Show SyncContactsScreen
  };
  const openSheShield = () => {
    setShowSheShield(true); // Show SheShieldScreen
  };



  if (showChatbot) {
    return (
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#B49AC0', // Lavender
              },
              left: {
                backgroundColor: '#EAEAEA', // Light gray
              },
            }}
          />
        )}
      />
    );
  }
  
  if (showSheShield) {
    return (
      <SheShieldScreen />
    );
  }

  if (showSyncContacts) {
    return (
        <SyncContactsScreen />
     
    );
  }
  
   
 
  if (showGuidelines) {
    return (
      <View style={styles.container}>
         <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>WELCOME SAKHI</Text>
        <Text style={styles.slogan}>By a Woman for the Women</Text>

        <View style={styles.section}>
      
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.image}
          />
          
          <Text style={styles.heading}>Emergency Alert Activation</Text>
         
          <Text style={styles.description}>
            In case of any danger, press the power-off button three times. This will:
            {'\n'}• Trigger a loud alarm
            {'\n'}• Call the nearest police station
            {'\n'}• Share your location with authorities and up to five selected contacts
          </Text>
          <TouchableOpacity style={styles.floatingButton} onPress={openSheShield}>
              <Text style={styles.floatingButtonText}>She-Shield</Text>
            </TouchableOpacity>
          
        </View>
    

        <View style={styles.section} >
       
          <Image
            source={require('../assets/images/contact_sync_icon.png')} // Ensure this path is correct
            style={styles.image}
          />
          
          <Text style={styles.heading}>Sync Contacts</Text> 
          
          <View>
            
          
          </View>

          
          <Text style={styles.description}>
            On this Screen, your contacts will be synced automatically. Please select 5 emergency contacts who will be notified with your location during an emergency.
          </Text>
          <TouchableOpacity style={styles.floatingButton} onPress={openSyncContacts}>
              <Text style={styles.floatingButtonText}>Sync</Text>
            </TouchableOpacity>
         
         
          <View>
          
          </View>
         
    
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
        <TouchableOpacity style={styles.floatingButton} onPress={openNariAssistChatbot}>
  <Text style={styles.floatingButtonText}>NariAssist</Text>
</TouchableOpacity>

    
      </View>
     
     
    );
  }
  


  return (
    <LinearGradient colors={['#E6E6FA', '#D3D3D3']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>{isLogin ? 'Login' : 'Create Account'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={isLogin ? handleLogin : handleCreateAccount}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Create Account'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
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
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#B49AC0', // Lavender
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
 

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#0084FF',
  },
  guidelinesContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  slogan: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#B49AC0', // Lavender color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Adds shadow for better visibility
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow blur radius
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
});

export default CombinedScreen;