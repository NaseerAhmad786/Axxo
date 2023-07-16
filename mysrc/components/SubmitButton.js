import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {useFormikContext} from 'formik';
import Button from './Button';
const SubmitButton = ({title}) => {
  const {handleSubmit} = useFormikContext();
  return <Button  onPress={handleSubmit} title={title} />;
};

export default SubmitButton;

const styles = StyleSheet.create({});
