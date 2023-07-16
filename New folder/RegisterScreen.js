import React from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

import Button from '../components/Button';
import LineWithText from '../components/LineWithText';
import SocialLoginButtons from '../components/SocialMediaButton';
import CustomTextInput from '../components/CustomTextInput';
import Vector2 from '../assets/Vector2';

const RegisterScreen = () => {
  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Vector2
          width={responsiveWidth(100)}
          style={styles.vector2}
        />
        <View style={styles.formContainer}>
          <Image
            source={require('../assets/Sign-up.png')}
            style={styles.image}
          />
          <View style={styles.textInputContainer}>
            <CustomTextInput label={'User Name'} />
            <CustomTextInput label={'Email'} />
            <CustomTextInput label={'Password'} secureTextEntry={true} />
            <View style={styles.buttonContainer}>
              <Button title={'Register'} />
              <LineWithText text={'OR'} />
              <SocialLoginButtons />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  vector2: {
    marginBottom: responsiveHeight(10),
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: responsiveFontSize(15),
  },
  image: {
    width: responsiveWidth(80),
    height: responsiveHeight(30),
    marginTop: responsiveHeight(-5),
    resizeMode: 'contain',
  },
  textInputContainer: {
    bottom: responsiveHeight(5),
    marginTop: responsiveHeight(1),
  },
  buttonContainer: {
    marginTop: responsiveHeight(4
      ),
  },
});
