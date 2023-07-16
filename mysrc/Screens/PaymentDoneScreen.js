import React, {useEffect, useRef,useState,} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import color from '../config/color';
import * as Animatable from 'react-native-animatable';
import Button from '../components/Button';
import { responsiveFontSize, responsiveHeight , responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';

const PaymentDoneScreen = ({navigation,route}) => {
  const animationRef = useRef(null);
  
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleString());
  const {transactionData} = route.params;
  
  useEffect(() => {
    
    // if (route.params) {
    //     setRecipientUserName(route.params.recipientUserName);
    //     setSenderEmail(route.params.SenderEmail);
    //     setRecipientEmail(route.params.RecipientEmail);
    //     setAmount(route.params.amount);
    //     setSenderUserName(route.params.senderUserName);

    //   }

    animationRef.current.play(); // Plays the animation
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require('../assets/animation/payment.json')} // Change this to the path of your animation file
        style={styles.animation}
        loop={false}
      />
      <Animatable.View animation="fadeInUp" style={{flex:1,justifyContent:"flex-start",alignItems:"center"}}>
      <Text style={styles.textAmount}>{transactionData.paymentType=== "billPayment" ? `Rs : ${transactionData.totalAmount}.00` : `Rs : ${transactionData.amount}.00`}</Text>
      <Text style={styles.date}>Date & time</Text>
      <Text style={styles.datetxt}>{currentDate}</Text>
      <Text style={styles.paid}>{transactionData.paymentType=== "billPayment" ? "Billing category" :"Paid to" }</Text>
      <Text style={styles.naseer}>{transactionData.paymentType=== "billPayment" ? `${transactionData.billType} Bill` :transactionData.recipientUserName} </Text>
      {
        transactionData.paymentType=== "billPayment" &&  <Text style={{fontSize:responsiveFontSize(2),color:"grey",fontWeight:"500"}}>{transactionData.billRefNumber} </Text>
      }
      {transactionData.paymentType=== "transferMoney" &&<Text style={styles.email}>{transactionData.recipientEmail} </Text>
}
      <Text style={styles.date}>From Account :</Text>
      <Text style={styles.naseer}>{transactionData.paymentType=== "billPayment" ? transactionData.customerName:transactionData.senderUserName} </Text>
      <Text style={styles.email}>{transactionData. senderEmail}</Text>
      </Animatable.View>
      <Button title={'Done'} onPress={()=> navigation.replace("HomeScreen")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textAmount: {
    fontSize: 30,
    fontWeight: 'bold',
 
    color: color.newColor,
  },
  PaymentDone:{
    fontSize: 30,
    fontWeight: 'bold',
    color: color.newColor,
  },
  animation: {
    width: responsiveWidth(40),
    height: responsiveHeight(40),
  },
  date: {
    fontSize: 20,
    color: color.newColor,
    fontWeight: 'bold',
    marginTop: 5,
  },
  datetxt: {
    fontSize: 15,
    marginTop: 5,
    color:"grey",fontWeight:"500"
  },
  paid: {
    fontSize: 20,
    color: color.newColor,
    fontWeight: 'bold',
    marginTop: 5,
  },
  naseer: {
    fontSize: 15,
    marginTop: 5,

    marginTop: 5,
    color: color.newColor,
    fontWeight: '600',
  },
  email: {
    fontSize: 12,
    marginTop: 10,
  },
});

export default PaymentDoneScreen;
