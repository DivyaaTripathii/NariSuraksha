const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const twilio = require('twilio');
require('dotenv').config();

// Create an instance of Express
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Create a single connection
const connection = mysql.createConnection({
  host: 'localhost',    // Replace with your host
  user: 'root',         // Replace with your MySQL username
  password: 'divyaatripathii', // Replace with your MySQL password
  database: 'NariSuraksha' // Replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

// Example route to fetch data from a table
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password' });
  }

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    if (results.length > 0) {
      // User found, login successful
      res.json({ success: true, message: 'Login successful' });
    } else {
      // User not found or incorrect credentials
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Example route to insert data into a table
app.post('/create-account', (req, res) => {
  const { email, password } = req.body;

  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ success: true, id: results.insertId });
  });
});

const openaiApiKey = 'sk-50Y4P3tYSYJU3e0jIAViKOzmUYL48otTQMS5aUe1SkT3BlbkFJ0vrn3D_WC01b8TwI3Wv4_JYKla8H4l_MY1e4wB7HoA';

// Route to handle chat messages
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'text-davinci-003', // You can choose other models as well
      prompt: message,
      max_tokens: 150,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    res.json({ success: true, response: response.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
  }
});

// Twilio credentials
const accountSid = "AC5d1550e87c40a2d557ada6f1c8f57975";
const authToken = "46d0f441f9303748ec23ea40d2f43eb1";
const twilioPhoneNumber = '+12089745467'; // Ensure this is a string

// Create a Twilio client
const client = twilio(accountSid, authToken);

// Function to send an SMS alert
const sendSmsAlert = async (userId, location) => {
  try {
    // Validate input
    if (!userId) {
      console.log('User ID is required.');
      return;
    }
    
    if (!location || !location.latitude || !location.longitude) {
      console.log('Invalid location data.');
      return;
    }

    // Fetch contacts from the database
    const query = 'SELECT contact_number FROM user_contacts WHERE user_id = ?';
    connection.query(query, [userId], async (err, results) => {
      if (err) {
        console.error('Error fetching contacts:', err.message);
        return;
      }

      if (results.length === 0) {
        console.log('No contacts found for this user.');
        return;
      }

      const contacts = results.map(row => row.contact_number);
      
      // Send SMS alerts
      for (const contact of contacts) {
        try {
            console.log(`Sending alert to ${contact}`);
    
            const message = await client.messages.create({
                body: `Emergency alert triggered!\n\nLocation:\nLatitude: ${location.latitude}\nLongitude: ${location.longitude}`,
                from: twilioPhoneNumber,
                to: contact,
            });
    
            console.log(`Alert sent to ${contact}, SID: ${message.sid}`);
        } catch (smsError) {
            console.error(`Error sending SMS to ${contact}:`, smsError);
            // Additional diagnostic information
            if (smsError.response) {
                console.error(`Response Status Code: ${smsError.response.status}`);
                console.error(`Response Data: ${smsError.response.data}`);
            }
        }
    }
    
};



// Route to handle emergency alerts
app.post('/trigger-alert', async (req, res) => {
  const { userId, location } = req.body;
  console.log('Received data from client: userId:', userId, ', location:', location);

  try {
    const contacts = await getUserContacts(userId);
    if (!contacts) {
      return res.status(404).json({ success: false, message: 'No contacts found for this user' });
    }

    await sendSmsAlert(contacts, location);
    res.status(200).json({ success: true, message: 'Alerts sent!' });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




// Route to save contacts
app.post('/save-contacts', (req, res) => {
  const { user_id, contacts } = req.body;

  // Validation
  if (!user_id || !contacts || contacts.length === 0) {
    return res.status(400).json({ success: false, message: 'User ID and contacts are required' });
  }

  // Prepare the query and insert values
  const query = 'INSERT INTO user_contacts (user_id, contact_name, contact_number) VALUES ?';
  const values = contacts.map(contact => [user_id, contact.name, contact.number]);

  connection.query(query, [values], (error, results) => {
    if (error) {
      console.error('Error saving contacts:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to save contacts' });
    }
    res.json({ success: true, message: 'Contacts saved successfully' });
  });
});






// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
