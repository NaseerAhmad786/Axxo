import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

import {
  responsiveScreenFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import color from '../config/color';

const Button = ({title, onPress, textStyle, ...props}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        {...props}
        style={[styles.btn, props.style]}
        colors={[ '#1C3D73','#03588E']}
       locations={[0, 1]}
       >
        <Text  style={[styles.btnTxt, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    width: responsiveScreenWidth(80),
    height: responsiveScreenHeight(8),

    marginTop: responsiveScreenHeight(5),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: responsiveScreenHeight(2.5),
  },
  btnTxt: {
    fontSize: responsiveScreenFontSize(3),
    color: color.white,
    fontWeight: '500',
  },
});
