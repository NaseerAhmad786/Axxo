import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Layout from '../components/Layout'
import CircleRed from "../assets/CircleRed.svg";
import CircleGreen from "../assets/CircleGreen.svg"
import { responsiveFontSize, responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import Button from '../components/Button';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import color from '../config/color';

const TransactionInvoiceScreen = ({navigation}) => {
const route = useRoute();
const timestamp = route.params.item.timestamp;
const date = timestamp.toDate();
let payment =""
if (route.params.item.paymentType === "billPayment") {
 payment = route.params.item.totalAmount;
} else {
  payment = route.params.item.amount;
}
  return (
    <Layout title={"Naseer Ahmad"} footer={{flex:6.5}}  >
        <ScrollView showsVerticalScrollIndicator={false}  >
      <View style={{justifyContent: 'center',alignItems: 'center',}} >
        {
          route.params.item.paymentType === "receiveMoney" ? <CircleGreen width={responsiveScreenWidth(25)} height={responsiveScreenHeight(25)} style={{bottom:responsiveHeight(6),marginTop:responsiveHeight(2)}}/> :
          <CircleRed width={responsiveScreenWidth(25)} height={responsiveScreenHeight(25)} style={{bottom:responsiveHeight(6),marginTop:responsiveHeight(2)}}/>
        }
      
      
      <Text style={{color:"#023E74",fontWeight:"bold",fontSize:responsiveFontSize(3),bottom:responsiveHeight(9)}}>Transaction ID</Text>
      <Text style={{color:"#6C7480",fontSize:responsiveFontSize(2),bottom:responsiveHeight(8)}}>{route.params.item.id}</Text>
      <Text style={{color:"#023E74",fontWeight:"bold",fontSize:responsiveFontSize(2),bottom:responsiveHeight(7)}}>From</Text>
      <Text style={{color:"#6C7480",fontSize:responsiveFontSize(2),bottom:responsiveHeight(7)}}>{route.params.item.paymentType=== "billPayment" ? route.params.item.userEmail : route.params.item.senderEmail}</Text>
      <Text style={{color:"#023E74",fontWeight:"bold",fontSize:responsiveFontSize(2),bottom:responsiveHeight(7)}}>{route.params.item.paymentType=== "billPayment" ? "Billing category" :"Paid to"}</Text>
      <Text style={{color:"#6C7480",fontSize:responsiveFontSize(2),bottom:responsiveHeight(7)}}>{route.params.item.paymentType=== "billPayment" ? route.params.item.billType :route.params.item.recipientEmail}</Text>
      <Text style={{color:"#023E74",fontWeight:"bold",fontSize:responsiveFontSize(2),bottom:responsiveHeight(7)}}>at</Text>
      <Text style={{color:"#6C7480",fontSize:responsiveFontSize(2),bottom:responsiveHeight(7)}}>{date.toString()}</Text>
      <Text style={{color:"#023E74",fontWeight:"bold",fontSize:responsiveFontSize(3),bottom:responsiveHeight(6)}}>{route.params.item.paymentType === "receiveMoney" ? "Received Amount" : "Debit Amount"}</Text>
      <Text style={[{color:"red",fontSize:responsiveFontSize(2),bottom:responsiveHeight(5),fontWeight:"bold"  } ,{color:route.params.item.paymentType === "receiveMoney" ? "#1EC510" : "red"}]}>{`PKR ${route.params.item.paymentType === "receiveMoney" ?"+" : "-"} ${payment}`}</Text>
      <Button title={'Done'} style={{marginTop:responsiveHeight(1),width:responsiveWidth(70)}} onPress={()=>navigation.goBack('TransactionScreen')} />
     
      </View>
      </ScrollView>
    </Layout>
    
  )
}

export default TransactionInvoiceScreen

const styles = StyleSheet.create({})