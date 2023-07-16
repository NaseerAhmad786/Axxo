import React from 'react';
import {
  ScrollView,
  View,
  Text,

  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,

} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Yup from 'yup';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import color from '../config/color';
import AppFrom from '../components/AppFrom';
import AppFormFiled from '../components/AppFormFiled';
import SubmitButton from '../components/SubmitButton';
import TypeWriter from 'react-native-typewriter';

import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import messaging from '@react-native-firebase/messaging';
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(8).label('Password'),
  userName: Yup.string().required().label('UserName'),
});

const createUserInFirestore = async (email,  userName) => {
  try {
    const fcmToken = await messaging().getToken();
    await firestore().collection('usersData').doc(email).set({
      email: email,
      registrationDate: new Date(),
      userName: userName,
      fcmToken: fcmToken,
    });
    console.log('User added! document');
  } catch (error) {
    console.log('Error creating user document:', error);
  }
};

const RegisterScreen = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);

  // const handleSignUp = (values) =>
  //   auth()
  //     .createUserWithEmailAndPassword(values.email, values.password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       user.sendEmailVerification();

  //       // Create user document in Firestore
  //       createUserInFirestore(user.email, user.uid,values.userName);

  //     })
  //     .catch((error) => {
  //       // Handle errors
  //       if (error.code === 'auth/email-already-in-use') {
  //         alert('That email address is already in use!');
  //       }
  //     });
  const handleSignUp = values => {
    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(userCredential => {
        const user = userCredential.user;
        user.sendEmailVerification().then(() => {
          // Create user document in Firestore
          createUserInFirestore(user.email,  values.userName);
          setLoading(false);
          navigation.navigate('VerificationScreen', {myemail:values.email} );
        });
      })
      .catch(error => {
        // Handle errors
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }
      });
  };
  return (
    <ScrollView  showsVerticalScrollIndicator={false}>
      <LinearGradient
       colors={['#03588E', '#1C3D73']}
       start={{x: 0, y: 0}}
       end={{x: 1, y: 0}}
       style={styles.container}>
      <StatusBar backgroundColor={color.newColor} barStyle="light-content" />
      <View style={styles.headerContainer}>
      <LottieView source={require("../assets/animation/signUp.json")} autoPlay loop
                style={styles.image}
              />
      </View>
      <Animatable.View animation={'fadeInUp'} style={styles.formContainer}>
        <View style={styles.helloContainer}>
          <TypeWriter typing={1} style={styles.WelcomeText}>
            Welcome!
          </TypeWriter>
        </View>

        <View style={{marginTop: 10}}>
          <AppFrom
            initialValues={{email: '', password: '', userName: ''}}
            onSubmit={handleSignUp}
            validationSchema={validationSchema}>
            <AppFormFiled
              placeholder={'User Name'}
              iconName={'account-circle'}
              name={'userName'}
            />
            <AppFormFiled
              placeholder={'Email'}
              iconName={'email'}
              name={'email'}
            />

            <AppFormFiled
              placeholder={'Password'}
              name={'password'}
              secureTextEntry={true}
              iconName={'lock'}
            />

{loading ? (
  <ActivityIndicator color={color.newColor} size="large" />
) : (
  <SubmitButton title={'Register'} />
)}

          </AppFrom>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Already have an Account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.signUpLink}> Sign In instead</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: color.newColor,
  },
  headerContainer: {
    height: responsiveHeight(40),
    width: '100%',
    paddingHorizontal: responsiveWidth(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: responsiveHeight(40),
    width: responsiveWidth(50),
  
  },
  formContainer: {
    backgroundColor: 'white',
    height: responsiveHeight(100),
    borderTopLeftRadius: responsiveWidth(10),
    borderTopRightRadius: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(10),
  },
  helloContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(4),
  },
  WelcomeText: {
    fontSize: responsiveFontSize(5),
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: responsiveFontSize(1.8),
  },

  signUpLink: {
    color: color.newColor,
    fontSize: responsiveFontSize(1.8),
  },
});

export default RegisterScreen;
