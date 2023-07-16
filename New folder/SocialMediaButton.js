import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ico from 'react-native-vector-icons/Ionicons';
import { responsiveHeight } from 'react-native-responsive-dimensions';

const SocialLoginButtons = ({ onFacebookPress, onGooglePress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity  onPress={onFacebookPress}>
        <Icon name="facebook" size={28} style={{ margin: 5 }} />
      </TouchableOpacity>
      <TouchableOpacity  onPress={onGooglePress}>
        <Ico name="ios-logo-google" size={25} style={{ margin: 5 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  
    flexDirection: 'row',

  },
 
});

export default SocialLoginButtons;
