import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ErrorMsg from './ErrorMsg';
import { useFormikContext } from 'formik';
import CustomTextInput from './CustomTextInput';
const AppFormFiled = ({name,...othersProps}) => {
  const  {setFieldTouched,handleChange,errors,handleSubmit,touched} =useFormikContext();
  return (
    <>
           <CustomTextInput
                 {...othersProps}
                  onChangeText={handleChange(name)}
                  // onBlur={() => setFieldTouched(name)}
                />
                <ErrorMsg error={errors[name]} visible={touched[name]} />
    </>
  )
}

export default AppFormFiled

const styles = StyleSheet.create({})