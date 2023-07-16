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
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import color from '../config/color';
import AppFormFiled from '../components/AppFormFiled';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppFrom from '../components/AppFrom';
import * as Yup from 'yup';
import SubmitButton from '../components/SubmitButton';
import Layout from '../components/Layout';

const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const validationSchema = Yup.object().shape({
    // email: Yup.string().required().email().label('Email'),
   
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
        // navigation.navigate('LoginScreen');
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please enter a valid email address.');
    }
  };

  return (
  <Layout textprop={true} title={"Change Password"}>
 <Icon name="form-textbox-password" size={90} style={{alignSelf:"center"}} color={"#006093"}/>
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <AppFrom
        initialValues={{ email: auth().currentUser ? auth().currentUser.email : ''}}
        onSubmit={handleResetPassword}
        validationSchema={validationSchema}
      >
        <AppFormFiled
    value={auth().currentUser.email}
    iconName={'email'}
    name={'email'}
    placeholder={'Email'}
    autoCorrect={false}
    keyboardType={'email-address'}
    textContentType={'emailAddress'}
  />
        <SubmitButton title={'Submit'} />
      </AppFrom>
      </View>
  </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    justifyContent:"flex-start"
    ,marginTop:responsiveScreenHeight(30)
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

export default ResetPassword;
