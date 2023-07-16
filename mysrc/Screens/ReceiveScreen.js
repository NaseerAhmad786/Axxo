import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from '../components/Layout'
import Recive from "../assets/Receive.svg"
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import CustomTextInput from '../components/CustomTextInput'
import { useRoute } from '@react-navigation/native'

const ReceiveScreen = () => {
  const route = useRoute()
    return (
    <Layout title={"RECEIVE"} >
    <View style={{justifyContent:"center",alignItems:"center"}}>
    <Recive width={responsiveWidth(25)} height={responsiveHeight(25)} />
    <Text style={{alignSelf:"flex-start" ,paddingLeft:responsiveWidth(5),fontSize:responsiveFontSize(1.8),color:"#023E74",fontWeight:"bold"}}>
        Account Title
    </Text>
    <CustomTextInput
    theme={{
        colors: {
          text: 'black',
          placeholder: 'black',
          primary: 'black',
          underlineColor: 'black',
        },
      }}
      style={{
        borderColor: 'black',
        borderWidth: 1,
        height:responsiveHeight(8)
      }} 
      value={route.params.name}
    editable={false}/>
    <Text style={{alignSelf:"flex-start" ,paddingLeft:responsiveWidth(5),fontSize:responsiveFontSize(1.8),color:"#023E74",fontWeight:"bold" ,marginTop:5}}>
    Account Number
    </Text>
    <CustomTextInput
    theme={{
        colors: {
          text: 'black',
          placeholder: 'black',
          primary: 'black',
          underlineColor: 'black',
        },
      }}
      style={{
        borderColor: 'black',
        borderWidth: 1,
       
        height:responsiveHeight(8)
      }} 
      value={route.params.userAccountNumber}
    editable={false}/>
    </View>
    </Layout>
  )
}

export default ReceiveScreen

const styles = StyleSheet.create({})