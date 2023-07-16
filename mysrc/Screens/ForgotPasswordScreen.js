import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import color from '../config/color';
import AppFormFiled from '../components/AppFormFiled';
import AppFrom from '../components/AppFrom';
import * as Yup from 'yup';
import SubmitButton from '../components/SubmitButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label('Email'),
   
  });

  const handleResetPassword = async (values) => {

    // Add any logic you want to perform using the password value

    if (values.email) {
      try {
        await auth().sendPasswordResetEmail(values.email);
        Alert.alert(
          'Password Reset',
          'A password reset email has been sent to your email address.',
        );
        navigation.navigate('LoginScreen');
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid email address.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <AppFrom
        initialValues={{ email: '', password: '' }}
        onSubmit={handleResetPassword}
        validationSchema={validationSchema}
      >
        <AppFormFiled placeholder={'Email'} iconName={'email'} name={'email'} />
        <SubmitButton title={'Submit'} />
      </AppFrom>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: responsiveFontSize(3),
    marginBottom: responsiveHeight(2),
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: color.newColor,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: color.newColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
  },
});

export default ForgotPasswordScreen;
