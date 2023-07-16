import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import color from '../config/color';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable';
import AppFrom from '../components/AppFrom';
import AppFormFiled from '../components/AppFormFiled';
import * as Yup from 'yup';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import SubmitButton from '../components/SubmitButton';
import {TextInput} from 'react-native-paper';

const ConfirmationPaymentScreen = ({navigation}) => {
  const route = useRoute();
  const [transactionRecord, setTransactionRecord] = useState({});
  const [recipient, setRecipient] = useState({});
  useEffect(() => {
    if (route.params) {
      setTransactionRecord(route.params);
    }
    const fetchData = async () => {
      const recipientQuery = await firestore()
        .collection('usersData')
        .where('accountNumber', '==', Number(transactionRecord.accountNumber))
        .get();
      if (recipientQuery.empty) {
        Alert.alert('Error', 'No user found with that account number.');
        return;
      }
      const recipient = recipientQuery.docs[0].data();
      setRecipient(recipient);
      console.log(recipient);
    };
    if (transactionRecord.accountNumber) {
        fetchData();
      }
  }, [transactionRecord]);

  return (
    <View
      style={{flex: 1, backgroundColor: color.newColor, alignItems: 'center'}}>
      <Text
        style={{
          fontSize: 30,
          width: '100%',
          textAlign: 'center',
          paddingRight: 2,
          color: 'white',
          marginTop: responsiveHeight(5),
          paddingBottom: 50,
        }}>
        Payment Confirmation
      </Text>
      <KeyboardAwareScrollView style={{flexShrink: 1, flexGrow: 1}}>
        <Animatable.View
          animation={'fadeInUp'}
          style={{
            height: responsiveHeight(100),
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: color.white,
            borderTopLeftRadius: responsiveHeight(5),
            borderTopRightRadius: responsiveHeight(5),
            width: responsiveWidth(100),
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#281d61',
              right: responsiveWidth(30),
              marginTop: 50,
            }}>
            Account Title
          </Text>
          <TextInput
            editable={false}
            value={recipient.userName}
            style={{
              width: '80%',
              height: responsiveHeight(8),
              backgroundColor: '#fff',
            }}
          />
           <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#281d61',
              right: responsiveWidth(25),
              marginTop: 10,
            }}>
            Account Number
          </Text>
          <TextInput
            editable={false}
            value={transactionRecord.accountNumber}
            style={{
              width: '80%',
              height: responsiveHeight(8),
              backgroundColor: '#fff',
            }}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#281d61',
              right: 130,
              marginTop: 10,
            }}>
            Amount
          </Text>
          <TextInput
            editable={false}
            value={transactionRecord.amount}
            style={{
              width: '80%',
              height: responsiveHeight(8),
              backgroundColor: '#fff',
            }}
          />
         
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#281d61',
              right: 130,
              marginTop: 10,
            }}>
            Messages
          </Text>
          <TextInput
            editable={false}
            value={transactionRecord.messages}
            style={{
              width: '80%',
              height: responsiveHeight(8),
              backgroundColor: '#fff',
            }}
          />
          <Button
            title="Proceed to OTP"
            onPress={() => navigation.navigate('OtpScreen', transactionRecord)}
          />
        </Animatable.View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ConfirmationPaymentScreen;
