import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const LineWithText = ({  text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(1),
    flexDirection: 'row',
  },
  line: {
    height: 1,
    backgroundColor: 'black',
    width: responsiveWidth(25),
  },
  text: {
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: '500',
  },
});

export default LineWithText;
