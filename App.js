import {StyleSheet, Text, View,AppRegistry} from 'react-native';
import React, { useEffect, useState } from 'react';
import SplashScreen from './mysrc/Screens/SplashScreen';
import LoginScreen from './mysrc/Screens/LoginScreen';
import RegisterScreen from './mysrc/Screens/RegisterScreen';
import HomeScreen from './mysrc/Screens/HomeScreen';
import ForgotPasswordScreen from './mysrc/Screens/ForgotPasswordScreen';
import TransferScreen from './mysrc/Screens/TransferScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AccountScreen from './mysrc/Screens/AccountScreen';
import VerificationScreen from './mysrc/Screens/VerificationScreen ';
import TransactionScreen from './mysrc/Screens/TransactionScreen';
import TransferButtonScreen from './mysrc/Screens/TransferButtonScreen';
import OtpScreen from './mysrc/Screens/OtpScreen';
import PaymentDoneScreen from './mysrc/Screens/PaymentDoneScreen';
import ConfirmationPaymentScreen from './mysrc/Screens/ConfirmationPaymentScreen';
import TransactionInvoiceScreen from './mysrc/Screens/TransactionInvoiceScreen';
import ReceiveScreen from './mysrc/Screens/ReceiveScreen';
import BillsPayment from './mysrc/Screens/BillsPayment';
import LiveChat from './mysrc/Screens/LiveChat';
import {MenuProvider} from 'react-native-popup-menu';
const Stack = createNativeStackNavigator();
import Account from './mysrc/Screens/Account';
import ResetPassword from './mysrc/Screens/ResetPassword';
import Address from './mysrc/Screens/Address';
import messaging from '@react-native-firebase/messaging';
import BiometricPrompt from './mysrc/Screens/BiometricPrompt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Cnic from './mysrc/Screens/Cnic';
const App = () => {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleAuth = (authStatus) => {
    setIsAuthenticated(authStatus);
  };
  useEffect(() => {
    retrieveBiometricPreference();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    AppRegistry.registerComponent('app', () => App);

    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //     Alert.alert('New Transaction', remoteMessage.notification.body);
    //   });

    //   return unsubscribe;
  }, []);
  const retrieveBiometricPreference = async () => {
    const value = await AsyncStorage.getItem('@biometricEnabled');
    if (value !== null) {
      setIsBiometricEnabled(JSON.parse(value));
    }
  };
  return (
    <NavigationContainer>
      {isBiometricEnabled && !isAuthenticated ? (
        <Stack.Navigator   screenOptions={{headerTransparent: true,title: ''}}>
          <Stack.Screen name="BiometricPrompt">
            {(props) => <BiometricPrompt {...props} onAuthenticated={handleAuth} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <MenuProvider>
          <Stack.Navigator screenOptions={{headerTransparent: true, title: '',headerTintColor:"#fff"}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerTransparent: true, title: ''}} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="TransferScreen" component={TransferScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{title: 'Forgot Password'}} />
            <Stack.Screen name="AccountScreen" component={AccountScreen} />
            <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
            <Stack.Screen name="TransactionScreen" component={TransactionScreen} />
            <Stack.Screen name="TransferButtonScreen" component={TransferButtonScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="PaymentDoneScreen" component={PaymentDoneScreen} />
            <Stack.Screen name="ConfirmationPaymentScreen" component={ConfirmationPaymentScreen} />
            <Stack.Screen name="TransactionInvoiceScreen" component={TransactionInvoiceScreen} />
            <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
            <Stack.Screen name="LiveChat" component={LiveChat} options={{headerBackVisible: false}} />
            <Stack.Screen name="BillsPayment" component={BillsPayment} />
            <Stack.Screen name="Account" component={Account} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name='Address' component={Address} />
            <Stack.Screen name='Cnic' component={Cnic} />
          </Stack.Navigator>
        </MenuProvider>
      )}
    </NavigationContainer>
  );
};
export default App;

const styles = StyleSheet.create({});
