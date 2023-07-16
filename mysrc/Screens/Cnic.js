import { StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, } from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import fireStore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Recive from "../assets/Receive.svg"
import SuccessModal from '../components/SuccessModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Cnic = () => {
  const [isIssueDatePickerVisible, setIssueDatePickerVisibility] = useState(false);
  const [issueDate, setIssueDate] = useState(new Date());
  const [isExpireDatePickerVisible, setExpireDatePickerVisibility] = useState(false);
  const [expireDate, setExpireDate] = useState(new Date());
  const [cnicNumber, setCnicNumber] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const showIssueDatePicker = () => {
    setIssueDatePickerVisibility(true);
  };

  const hideIssueDatePicker = () => {
    setIssueDatePickerVisibility(false);
  };

  const handleIssueDateConfirm = (selectedDate) => {
    const currentDate = selectedDate || issueDate;
    setIssueDate(currentDate);
    hideIssueDatePicker();
  };

  const showExpireDatePicker = () => {
    setExpireDatePickerVisibility(true);
  };

  const hideExpireDatePicker = () => {
    setExpireDatePickerVisibility(false);
  };

  const handleExpireDateConfirm = (selectedDate) => {
    const currentDate = selectedDate || expireDate;
    setExpireDate(currentDate);
    hideExpireDatePicker();
  };

  const handleCnicNumberChange = (text) => {
    setCnicNumber(text);
  };

const handleSubmit = async()=>{

  const saveValue = async () => {
    try {
      await AsyncStorage.setItem('@storage_Key', cnicNumber)
    } catch (e) {
      // saving error
    }
  }

  if (cnicNumber.length !== 12) {
    alert('CNIC number must be exactly 12 digits');
    return;
  }
  try{
    await fireStore().collection("usersData").doc(auth().currentUser.email).update({

      cnicDetails : {
        issueDate : issueDate,
        expireDate:expireDate,
        cnicNumber:cnicNumber,
      }
    
    }).then(()=>{
      toggleModal();
      saveValue();
      console.log(cnicNumber);
    })
  } catch(err){
    console.log(err)
  }


}


return (
  <Layout title={"CNIC"} textprop={true} style={styles.container} header={{  paddingVertical:responsiveHeight(0)}}>
    <SuccessModal isVisible={isModalVisible} toggleModal={toggleModal} text={"CNIC Uploaded"}/>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >

      <ScrollView contentContainerStyle={styles.scrollView}>
        <DateTimePickerModal
          isVisible={isIssueDatePickerVisible}
          onConfirm={handleIssueDateConfirm}
          onCancel={hideIssueDatePicker}
        />
        <DateTimePickerModal
          isVisible={isExpireDatePickerVisible}
          onConfirm={handleExpireDateConfirm}
          onCancel={hideExpireDatePicker}
        />
        {/* <Recive style={{alignSelf:"center"}} width={responsiveWidth(25)} height={responsiveHeight(25)} /> */}
        <Icon name="id-card-o" size={100} style={{alignSelf:"center"}} color={"#006093"}/>
        <TextInput
          activeUnderlineColor="black"
          underlineColor="#808080"
          label="CNIC Number"
          keyboardType="numeric"
          value={cnicNumber}
          onChangeText={handleCnicNumberChange}
          style={styles.input}
        />
        <TextInput
          activeUnderlineColor="black"
          underlineColor="#808080"
          label="Date of Issue"
          value={issueDate.toDateString()} // Display the selected issue date in the TextInput
          editable={false}
          style={styles.input}
          right={
            <TextInput.Icon
              icon="calendar-month-outline"
              onPress={showIssueDatePicker}
            />
          }
        />
        <TextInput
          activeUnderlineColor="black"
          underlineColor="#808080"
          label="Date of Expire"
          value={expireDate.toDateString()} // Display the selected expire date in the TextInput
          editable={false}
          style={styles.input}
          right={
            <TextInput.Icon
              icon="calendar-month-outline"
              onPress={showExpireDatePicker}
            />
          }
        />
        <Button style={{alignSelf:"center"}} title={"Submit"} onPress={handleSubmit}/>
      </ScrollView>
    </KeyboardAvoidingView>
  </Layout>
);
};



export default Cnic

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    
  },
    input: {
        width: responsiveWidth(80),
        height: responsiveHeight(10),
        marginTop: responsiveHeight(1),
        backgroundColor: 'transparent',
       alignSelf:"center"
      },
      scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
      },
  
})