import {StyleSheet, Text, View, SafeAreaView, Image, Alert} from 'react-native';
import React from 'react';
import SwipeButton from 'rn-swipe-button';
import Ellipse from '../assets/Ellipse.svg';
import right from '../assets/right.png';
import color from '../config/color';
import Vector1 from '../assets/Vector1.svg';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Ellipse />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          bottom: responsiveFontSize(6),
        }}>
        <Image source={require('../assets/logo.png')} style={styles.img} />
        <SwipeButton
          railBorderColor={color.Primary}
          railFillBackgroundColor={color.Primary}
          railBackgroundColor={color.Primary}
          thumbIconBorderColor="transparent"
          railFillBorderColor="transparent"
          thumbIconImageSource={right}
          thumbIconBackgroundColor={'#fff'}
          title={'Swipe to Get Start'}
          titleColor={'#fff'}
          width={responsiveWidth(80)}
        />
      </View>

      <View style={styles.bottom}>
        <Vector1  />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    alignSelf: 'flex-end',
    width: responsiveWidth(100),
    bottom: 0,
  },
  box: {
    height: 20,
  },
  img: {
    marginBottom: responsiveFontSize(1),
  },
  minicon: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: responsiveFontSize(6),
  },
});
