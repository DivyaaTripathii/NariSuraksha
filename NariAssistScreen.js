import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import avatarImage from '../assets/images/avataaars.png'; // Adjust the path as needed


const NariAssistScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setInitialMessages();
  }, []);

  const setInitialMessages = () => {
    setMessages([
      {
        _id: 1,
        text: 'Hello! How can I assist you today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'NariAssist',
          avatar: avatarImage, // Use the imported image
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
  
    // Expanded rule-based logic with specific features of NariSuraksha
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
        avatar: 'C:/Users/EMAIL/NariSuraksha/assets/images/avataaars.png', // Replace with your chatbot's avatar
      },
    };

    setMessages((previousMessages) => GiftedChat.append(previousMessages, [newBotMessage]));
  };

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
              backgroundColor: '#0084ff',
            },
            left: {
              backgroundColor: '#f0f0f0',
            },
          }}
        />
      )}
    />
  );
};

export default NariAssistScreen;

