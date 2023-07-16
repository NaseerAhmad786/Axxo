import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import emailjs from '@emailjs/browser';
import { Text } from 'react-native-animatable';

export default function TransferScreen() {
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(null);
  const [otp, setOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');

  const generateOtp = () => {
    // Generate a simple numeric OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    const userEmail = auth().currentUser.email;

    if (!userEmail) {
      Alert.alert('Error', 'No user email found.');
      return;
    }

    // // Send the OTP using EmailJS
    emailjs.send(
      'service_sv6uyxb', // Your EmailJS service ID
      'template_n862xnp', // Your EmailJS template ID
      {
        user_email: userEmail,
        message: `Your OTP is: ${generatedOtp}`,
        to_name : "User"
      },
      '68ly1jeUECkH3YVeM' // Your EmailJS user ID
    )
      .then(() => Alert.alert('OTP sent.'))
      .catch((error) => console.log(error));
  };

  const transferFunds = async () => {
    try {
      if (inputOtp !== otp) {
        throw new Error('Incorrect OTP.');
      }

      // The rest of your fund transfer code...
      const currentUser = auth().currentUser;

      // Get the sender's document from Firestore
      const senderDoc = await firestore().collection('usersData').doc(currentUser.email).get();
      const senderData = senderDoc.data();

      // Check if the sender has enough funds
      if (senderData.balance < transferAmount) {
        throw new Error('Insufficient funds.');
      }

      // Get the recipient's document from Firestore
      const recipientQuery = await firestore()
        .collection('usersData')
        .where('accountNumber', '==', Number(recipientEmail))
        .get();

      if (recipientQuery.empty) {
        throw new Error('Recipient not found.');
      }

      const recipientDoc = recipientQuery.docs[0];
      const recipientData = recipientDoc.data();

      // Transfer the funds
      const batch = firestore().batch();

      const senderRef = firestore().collection('usersData').doc(currentUser.email);
      batch.update(senderRef, {balance: senderData.balance - Number(transferAmount)});

      const recipientRef = firestore().collection('usersData').doc(recipientDoc.id);
      batch.update(recipientRef, {balance: Number(recipientData.balance) + Number(transferAmount)});

      // Record the transaction
   
      const transactionData = {
       userName: recipientData.userName,
        recipientEmail,
       
        amount: Number(transferAmount),
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      console.log('Transaction data:', transactionData);
      batch.set(senderRef.collection('transactions').doc(), transactionData);
      batch.set(recipientRef.collection('transactions').doc(), transactionData);

      await batch.commit();

      Alert.alert('Transfer successful.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Transfer amount"
        value={transferAmount}
        onChangeText={(text) => setTransferAmount(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Recipient email"
        value={recipientEmail}
        onChangeText={(text) => setRecipientEmail(text)}
        autoCapitalize="none"
        keyboardType="numeric"
      />
      <Button title="Get OTP" onPress={generateOtp} />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={inputOtp}
        onChangeText={(text) => setInputOtp(text)}
        keyboardType="numeric"
      />
      <Button title="Transfer" onPress={transferFunds} />
      <Text>{otp}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});
