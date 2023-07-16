import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';





const TransferScreen = () => {
const [transferamount , setTransferamount] = useState(null);
const [recipientEmail , setRecipientEmail ] = useState(null);

const transferFund = async () => {
  try {
    const user = auth().currentUser; 
    const senderDoc = await firestore().collection('usersData').doc(user.email).get();
    const senderData = senderDoc.data();
    if (senderData.balance < transferamount) {
      
      throw new Error("Insufficient funds")

    }
    const recipientQuery = await firestore().collection("userData").where("email", "==", recipientEmail ).get();

    if (recipientQuery.empty) {
      throw new Error('Recipient not found.');
      const recipientDoc = recipientQuery.docs[0];
      const recipientData = recipientDoc.data();
    }





  return (
    <View>
      <Text>TransferScreen</Text>
    </View>
  )
}

export default TransferScreen

const styles = StyleSheet.create({})