import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SyncContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation(); 

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  const toggleSelectContact = (contact) => {
    if (selectedContacts.some(c => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
    } else if (selectedContacts.length < 5) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const saveContacts = async () => {
    try {
      const id = '1';  // Retrieve or set userId based on your app logic
  
      const response = await fetch('https://aadf-118-185-234-163.ngrok-free.app/save-contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: id, // Ensure userId is included in the request body
          contacts: selectedContacts.map(contact => ({
            name: contact.name,
            number: contact.phoneNumbers[0].number, // Assumes contacts are selected correctly
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
  
      if (result.success) {
        Alert.alert('Success', 'Contacts saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save contacts');
      }
    } catch (error) {
      console.error('Error saving contacts:', error);
      Alert.alert('Error', 'Failed to save contacts');
    }
  };
  
  

  const renderContactItem = ({ item }) => {
    const isSelected = selectedContacts.some(c => c.id === item.id);
    return (
      <TouchableOpacity
        style={[styles.contactItem, isSelected && styles.selectedContact]}
        onPress={() => toggleSelectContact(item)}
      >
        <Ionicons 
          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'} 
          size={24} 
          color={isSelected ? '#4B0082' : '#7D3C98'} 
          style={styles.icon} 
        />
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.phoneNumbers && <Text style={styles.contactNumber}>{item.phoneNumbers[0].number}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()} // Navigate back to the previous screen
        >
          <Ionicons name="arrow-back" size={24} color="#4B0082" />
        </TouchableOpacity>
      <Text style={styles.title}>Select 5 Emergency Contacts</Text>
      <Text style={styles.subtitle}>{`Selected ${selectedContacts.length} of 5 contacts`}</Text>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search Contacts"
        placeholderTextColor="#4B0082"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        extraData={selectedContacts}
      />

      {selectedContacts.length === 5 && (
        <TouchableOpacity
          style={styles.button}
          onPress={saveContacts}
        >
          <LinearGradient
            colors={['#9370DB', '#E6E6FA']}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Save Contacts</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E6E6FA',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7D3C98',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: '#D3B6E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#4B0082',
    backgroundColor: '#FFF0F5',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D3B6E0',
    backgroundColor: '#FFF0F5',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContact: {
    backgroundColor: '#C19EE0',
  },
  icon: {
    marginRight: 15,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  contactNumber: {
    fontSize: 14,
    color: '#7D3C98',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
  gradient: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default SyncContactsScreen;
