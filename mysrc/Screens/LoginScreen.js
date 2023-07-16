import React, {useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,

  TouchableOpacity,
  StatusBar,

  ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Yup from 'yup';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import color from '../config/color';
import AppFrom from '../components/AppFrom';
import AppFormFiled from '../components/AppFormFiled';
import SubmitButton from '../components/SubmitButton';
import LinearGradient from 'react-native-linear-gradient';
import TypeWriter from 'react-native-typewriter';
import auth, {firebase} from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(8).label('Password'),
});
// const handleSignIn = (values) =>
//   auth()
//     .signInWithEmailAndPassword(values.email, values.password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       if (user.emailVerified) {
//         navigation.navigate('HomeScreen');
//       } else {
//         alert('Please verify your email to login.');
//       }
//     })
//     .catch((error) => {
//       // Handle errors
//     });
// const createUserInFirestore = async (email, uid, userName) => {
//   try {
//     await firestore().collection('users').doc(uid).set({
//       email: email,
//       userName: userName,
//       balance: 1000,
//       accountNumber: Math.floor(Math.random() * 1000000000),
//     });
//     console.log('User added! document');
//   } catch (error) {
//     console.log('Error creating user document:', error);
//   }
// };

// const checkAndCreateUserInFirestore = async (user, userName) => {
//   try {
//     const userDoc = await firestore().collection('users').doc(user.uid).get();
//     if (!userDoc.exists) {
//       createUserInFirestore(user.email, user.uid, userName);
//     }
//   } catch (error) {
//     console.log('Error checking and creating user document:', error);
//   }
// };
const LoginScreen = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  
  const handleSignIn = values => {
    setLoading(true); // Set loading to true
  
    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(userCredential => {
        const user = userCredential.user;
        if (user) {
          setLoading(false); // Set loading back to false
          navigation.replace('HomeScreen');
        } else {
          setLoading(false); // Set loading back to false
          alert('Please verify your email to login.');
        }
      })
      .catch(error => {
        setLoading(false); // Set loading back to false
  
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
  
        console.error(error);
      });
  };
  

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user && user.emailVerified) {
        navigation.replace('HomeScreen');
      }
    });
  }, []);

  return (
    <ScrollView  showsVerticalScrollIndicator={false}>
      <LinearGradient
      colors={['#03588E', '#1C3D73']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={styles.container}>
      <StatusBar backgroundColor={color.newColor} barStyle="light-content" />
      <View style={styles.headerContainer}>
      <LottieView source={require("../assets/animation/login.json")} autoPlay loop
                style={styles.image}
              />
      </View>

      <Animatable.View animation={'fadeInUp'} style={styles.formContainer}>
        <View style={styles.helloContainer}>
          <TypeWriter typing={1} style={styles.welcomeBackText}>
            Welcome back!
          </TypeWriter>
        </View>

        <View style={{marginTop: 10}}>
          <AppFrom
            initialValues={{email: '', password: ''}}
            onSubmit={handleSignIn}
            validationSchema={validationSchema}>
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
            <TouchableOpacity
              >
              <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
            </TouchableOpacity>
            {loading ? (
  <ActivityIndicator color={color.newColor} size="large" />
) : (
  <SubmitButton title={'Login'} />
)}

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>New here? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.signUpLink}>Sign Up instead</Text>
              </TouchableOpacity>
            </View>
          </AppFrom>
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
    height: 300,
    width: '100%',
    paddingHorizontal: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: responsiveHeight(50),
    width: responsiveWidth(50),
    marginTop: responsiveHeight(2),
  },
  formContainer: {
    backgroundColor: 'white',
    height: responsiveHeight(100),
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 35,
  },
  helloContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(4),
  },
  welcomeBackText: {
    fontSize: responsiveFontSize(4.5),
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
  forgotPasswordLink: {
    left: responsiveWidth(50),
    marginTop: responsiveHeight(1.8),
    fontSize: responsiveFontSize(1.8),
    color: color.newColor,
  },
});

export default LoginScreen;
