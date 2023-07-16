import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import {StyleSheet} from 'react-native';

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomTextInput = ({
  style,
  secureTextEntry,
  onChangeText,
  iconName,
  ...otherprops
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  return (
    <TextInput
      activeUnderlineColor="black"
      
      underlineColor="#808080"
      {...otherprops}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      secureTextEntry={secureTextEntry ? isPasswordVisible : false}
      left={iconName ?  <TextInput.Icon icon={iconName}  /> : null }
      right={
        secureTextEntry && (
          <TextInput.Icon
            icon={isPasswordVisible ? 'eye' : 'eye-off'}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: responsiveWidth(80),
    height: responsiveHeight(10),
    marginTop: responsiveHeight(1),
    backgroundColor: 'transparent',
  },
});

export default CustomTextInput;
