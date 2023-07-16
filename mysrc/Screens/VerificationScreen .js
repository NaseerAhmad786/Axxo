import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import color from '../config/color';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useRoute} from '@react-navigation/native';
const VerificationScreen = ({navigation}) => {
  const route = useRoute();

  const [emailAddress, setEmailAddress] = useState(null);

  const createUniqueAccountNumber = async () => {
    const randomAccountNumber = generateRandomAccountNumber(); // Generate a random account number
  
    const snapshot = await firestore()
      .collection('usersData')
      .where('accountNumber', '==', randomAccountNumber)
      .get();
  
    if (snapshot.empty) {
      // No matching documents were found, so this accountNumber is unique
      console.log('Unique Account Number:', randomAccountNumber); // Display in console
      return randomAccountNumber;
    } else {
      // A user already has this accountNumber, so we recursively generate a new one
      return createUniqueAccountNumber();
    }
  };
  
  const generateRandomAccountNumber = (() => {
    let currentNumber = 12345; // Starting number
    const countryCode = 'PK'; // Pakistan country code
    const bankCode = 'AXXOBNK'; // Replace with your desired bank code
    const branchCode = 'GRT'; // Replace with your desired branch code
  
    return () => {
      const accountNumber = generateRandomDigits(12); // Generate 12 random digits for the account number
      currentNumber++; // Increment the current number for the next call
  
      return `${countryCode}${bankCode}${branchCode}${accountNumber}`;
    };
  })();
  
  const generateRandomDigits = (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };
  
  // Call the function to generate and display a unique account number
  createUniqueAccountNumber();
  

  const createUserDataInFireStore = async (email,accountNumber) => {
    const uniqueAccountNumber =  createUniqueAccountNumber();
    try {
      
      await firestore()
        .collection('usersData')
        .doc(email)
        .update({
          balance: 2000,
          accountNumber:accountNumber ,
          cnicDetails : {
            issueDate : "issueDate",
            expireDate:"expireDate",
            cnicNumber:"1",
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  const handleResendEmail = async () => {
    try {
      const user = auth().currentUser;
      await user.sendEmailVerification();
      console.log('Email sent');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
  
      
    
 
    if (route.params) {
      setEmailAddress(route.params.myemail);
    } else {
      setEmailAddress(null);
    }
    const emailVerificationInterval = setInterval(async () => {
      const user = auth().currentUser;
      if (user) {
        // setEmailAddress(user.email);
        await user.reload();
        if (user.emailVerified) {
        

          console.log(user.email);
          const accountNumber = await createUniqueAccountNumber();
await createUserDataInFireStore(user.email, accountNumber);

          navigation.replace('HomeScreen');
        } else {
          console.log('Email not verified');
        }
      } else {
        // No user is signed in.
        console.log('No user is signed in.');
      }
    }, 5000);

    return () => {
      clearInterval(emailVerificationInterval);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../assets/verification.png')}
        style={{width: 200, height: 200, top: 100}}
      />
      <Text style={{fontSize: 18, fontWeight: '700', marginTop: 100}}>
        Confirm your email address{' '}
      </Text>
      <Text style={{fontSize: 14, marginTop: 5}}>
        We sent a confirmation email to:
      </Text>
      <Text style={{fontSize: 14, marginTop: 5}}>
        Confirm your email address{' '}
      </Text>
      <Text style={{fontSize: 14, marginTop: 5, fontWeight: '700'}}>
        {emailAddress ? emailAddress.toString() : ''}
      </Text>
      <Text style={{fontSize: 14, marginTop: 5, fontWeight: '700'}}>
        Confirmation Link to continue.
      </Text>
      <View
        style={{
          justifyContent: 'flex-end',
          justifyContent: 'flex-end',
          flex: 1,
          marginBottom: responsiveHeight(10),
        }}>
        <TouchableOpacity
          onPress={() => {
            handleResendEmail();
          }}
          style={{color: '#000', fontSize: 14, marginTop: 20}}>
          <Text style={{color: color.newColor, fontSize: 18}}>
            Resend email
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerificationScreen;

const styles = StyleSheet.create({});
