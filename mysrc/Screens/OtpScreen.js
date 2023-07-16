import {StyleSheet, Text, TextInput, View, Alert, Modal, } from 'react-native';
import {useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useRef} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Button from '../components/Button';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import LottieView from 'lottie-react-native';
import color from '../config/color'
import uuid from 'react-native-uuid';
import PaymentDoneScreen from './PaymentDoneScreen';
import PushNotification from 'react-native-push-notification';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import { sendPushNotification } from './PushNotification';
import emailjs from '@emailjs/browser';
const OtpScreen = ({navigation ,route}) => {
 const uid = uuid.v4().replace(/-/g, '');
  const [amount, setAmount] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);
  const [messages, setMessages] = useState('');
  const [otp, setOtp] = useState(null);
  const [inputOtp, setInputOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState({});
  const [animationDuration, setAnimationDuration] = useState(0);
  const [transactionData, setTransactionData] = useState(null);
  const [recipientDo, setRecipientDo] = useState({});
  const [dueDate, setDueDate] = useState(new Date());
 
  const [billType, setBillType] = useState('');
  const [amountAfterDueDate, setAmountAfterDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [formattedDueDate, setFormattedDueDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [billQueryResult, setBillQueryResult] = useState(null);
  const [billRefNumber, setBillRefNumber] = useState('');
  const [paymentType, setPaymentType] = useState('transfer');
  const [billDocId, setBillDocId] = useState(null);
  const [billData,setBilldata] = useState(null);
  const [totalamount,setTotalAmount]=useState(null);
  // const otpRef = useRef(null);
  const otpInputRef = useRef(null);
  const Route = useRoute();


  // ...



  const transfer = async () => {

    try {
      if (inputOtp !== otp) {
        throw new  Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Incorrect Otp',
          textBody: "Please Write correct Otp ",
          button: 'close',
        })
       
      }

      const user = auth().currentUser;

      const senderDoc = await firestore()
        .collection('usersData')
        .doc(user.email)
        .get();
      const senderData = senderDoc.data();

      if (senderData.balance < amount) {
        throw new Error('Insufficient funds.');
      }

      const recipientDoc = recipientDo;
      const recipientData = recipient;

      const batch = firestore().batch();

      const senderRef = firestore().collection('usersData').doc(user.email);
      batch.update(senderRef, {balance: senderData.balance - Number(amount)});

      const recipientRef = firestore()
        .collection('usersData')
        .doc(recipientDoc);
      batch.update(recipientRef, {
        balance: Number(recipientData.balance) + Number(amount),
      });

      const transactionData = {
        id:uid,
        recipientUserName: recipientData.userName,
        recipientEmail: recipientData.email,
        senderEmail: user.email,
        senderUserName: senderData.userName,
        messages: messages,
        paymentType: "transferMoney",
        amount: Number(amount),
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      const transactionDataReceiver = {
        id:uid,
        recipientUserName: recipientData.userName,
        recipientEmail: recipientData.email,
        senderEmail: user.email,
        senderUserName: senderData.userName,
        messages: messages,
        amount: Number(amount),
        paymentType: "receiveMoney",
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      console.log('Transaction data:', transactionData);

      batch.set(senderRef.collection('transactions').doc(uid), transactionData);
      batch.set(recipientRef.collection('transactions').doc(uid), transactionDataReceiver);

      await batch.commit();

    
     
    


      setLoading(true);
      setAnimationDuration(1000);
      setTransactionData(transactionData);
      await sendPushNotification(
        recipientData.fcmToken, // Token received from recipient
        'New Transaction', // Title of the notification
        `Your account has been credited with Rs ${amount}.00 from ${senderData.userName}` // Body of the notification
      );

      const configureNotificationChannels = () => {
        PushNotification.createChannel(
          {
            channelId: 'transactions-channel-send', // Channel ID
            channelName: 'Transactions Send', // Channel name
            channelDescription: 'Channel for transactions notifications',
            importance: 4,
            vibrate: true,
          },
          created => console.log(`Notification channel created: ${created}`)
        );
      };
      configureNotificationChannels();
      PushNotification.localNotification({
        channelId: 'transactions-channel-send',
        title: "New Transaction",
        message: `Your account has been deducted Rs ${amount}.00`,
      });

    } catch (error) {
      console.log(error);
    }
  };
  const BillPayment = async () => {
    const userId = auth().currentUser;
    const userwalletRef = firestore().collection('usersData').doc(userId.email);
      
    const userwalletSnapshot = await userwalletRef.get();
      
    const userwalletData = userwalletSnapshot.data();
    console.log(userwalletData);
    const { balance } = userwalletData;
    console.log(balance);
    
    // const billDoc = billQueryResult.docs[0];
    // const billData = billDoc.data();
    const { totalAmount, dueDate, recipient } = billData;
    console.log(billData);
    
    const batch = firestore().batch();
    const billRef = firestore().collection('bills').doc(billDocId);
    
    if (totalAmount < balance) {
      batch.update(billRef, { status: 'paid' });
      if (status === 'paid') {
        Alert.alert('Bill already paid');
      } else {
        batch.update(userwalletRef, { balance: balance - Number(totalAmount) });
        const userEmail =  auth().currentUser.email;
        const transactionData = {
          billRefNumber: billRefNumber,
          billType: billType,
          totalAmount,
          status: status,
          timestamp: firestore.FieldValue.serverTimestamp(),
          customerName: customerName,
          paymentType: paymentType,
          dueDate: dueDate,
          userEmail,
        };
        console.log('Transaction data:', transactionData);
   batch.set(userwalletRef.collection('transactions').doc(), transactionData);
  
        await batch.commit();
        setLoading(true);
        setAnimationDuration(1000);
        setTransactionData(transactionData)
        
        
      }
    } 
  };
  useEffect(() => {
    const generateOtp = async () => {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000);

      console.log(generatedOtp);
      setOtp(generatedOtp);

      const userEmail = auth().currentUser.email;

      if (!userEmail) {
        Alert.alert('Error', 'No user email found.');
        return;
      }

      // Email sending code
      try {
        await emailjs.send(
          'service_sv6uyxb',
          'template_n862xnp',
          {
            user_email: userEmail,
            message: `Your OTP is: ${generatedOtp}`,
            to_name: "User"
          },
          '68ly1jeUECkH3YVeM'
        );
        Alert.alert('OTP sent.');
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Failed to send OTP.');
      }

 

    };
     

   
    

    generateOtp();

    if (route.params) {
      setAmount(route.params?.amount);
      setAccountNumber(route.params?.accountNumber);
      setMessages(route.params?.messages);
      setRecipient(route.params?.recipient);
      setRecipientDo(route.params?.recipientDo);
      // setBillQueryResult(route.params?.billQueryResult);
      setBillRefNumber(route.params?.billRefNumber);
      setBillType(route.params?.billType);
      setBillDocId(route.params?.billlDocId)
     setStatus(route.params?.status);
      setFormattedDueDate(route.params?.formattedDueDate);
      setCustomerName(route.params?.customerName);
      setDueDate(route.params?.dueDate);
      setPaymentType(route.params?.paymentType);
      setBilldata(route.params?.billData)
      
    }
    const timer = setTimeout(() => {
      otpInputRef.current.focusField(0);
    }, 500);

    return () => clearTimeout(timer);

    // setTimeout(() => otpRef.current.focusField(0), 250);
  }, []);

  const onAnimationFinish = () => {
    setLoading(false);
    navigation.replace('PaymentDoneScreen', {transactionData});
  };
  const getHeaderText = () => {
    if (paymentType === 'billPayment') {
      return 'Verify for Bill Payment';
    }
    return 'Verify for Transfer Funds';
  };

  const getLabelText = () => {
    if (paymentType === 'billPayment') {
      return 'We have sent the code verification to your Email Address for bill payment';
    }
    return 'We have sent the code verification to your Email Address for fund transfer';
  };

  const getButtonTitle = () => {
    if (paymentType === 'billPayment') {
      return 'Pay Bill';
    }
    return 'Transfer';
  };
  const Desicion = async () => {
    if (paymentType === 'billPayment') {
      if (otp === inputOtp) {
        BillPayment();
      }else{
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Incorrect Otp',
          textBody: "Please Write correct Otp ",
          button: 'close',
        })
      }
      
    } else {
      transfer();
    };
  };
  return (
    <AlertNotificationRoot>
    <View style={styles.container}>
         
      {loading && (
        <Modal transparent={true} animationType="none">
          <View style={styles.modalBackground}>
            <LottieView
              source={require('../assets/animation/Loading.json')}
              autoPlay
              loop={false}
              speed={3}
              onAnimationLoad={animation => {
                const duration = animation.duration * 1000;
                setAnimationDuration(duration);
              }}
              onAnimationFinish={onAnimationFinish}
            />
          </View>
        </Modal>
      )}
      <Text style={styles.headerText}>{
        getHeaderText()
      }</Text>
      <Text style={styles.labelText}>
        {getLabelText()}
      </Text>
      <OTPInputView
        style={styles.otpInput}
        autoFocusOnLoad={false}
        pinCount={4}
        ref={otpInputRef}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={code => setInputOtp(Number(code))}
      />
      <Button onPress={Desicion} title={getButtonTitle()} />
     
    </View>
    </AlertNotificationRoot>
  );
  
};

export default OtpScreen;

const styles = StyleSheet.create({
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlineStyleBase: {
    width: 52,
    height: 52,
    backgroundColor: '#8084931A',
    borderWidth: 0,
    borderBottomWidth: 1,
    color: color.newColor,
    fontSize: 20,
    borderRadius: 10,
    fontWeight: 'bold',
    borderBottomColor: 'black',
  },
  underlineStyleHighLighted: {
    borderColor: color.newColor,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#131A34',
  },
  labelText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#808493',
  },
  otpInput: {
    width: '80%',
    height: 200,
    marginBottom: 20,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#fff', // this is the semi-transparent background
  },
});

