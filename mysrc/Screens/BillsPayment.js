import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import color from '../config/color';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TypeWriter from 'react-native-typewriter';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LottieView from 'lottie-react-native';

import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import AppFrom from '../components/AppFrom';
import AppFormFiled from '../components/AppFormFiled';
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
import {useRoute} from '@react-navigation/native';
import SubmitButton from '../components/SubmitButton';
import emailjs from '@emailjs/browser';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BlurView} from '@react-native-community/blur';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';


const validationSchema = Yup.object().shape({
  billRefNumber: Yup.string().required().label('Bill Reference Number'),

});


          
  



const BillsPayment= ({navigation}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [billRefNumber, setBillRefNumber] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState('');
  const [billType, setBillType] = useState('');
  const [amountAfterDueDate, setAmountAfterDueDate] = useState('');
  const [status, setStatus] = useState('');
  const [formattedDueDate, setFormattedDueDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [billdataa, setbilldataa] = useState(null);
  const [paymentType, setPaymentType] = useState('billPayment');
  const [billlDocId, setBilllDocId] = useState(null);
  const [cinic,setCnic]=useState("");




const toggleModal = () => {
  setModalVisible(!isModalVisible);
};


const fetchData = async (billRefNumber) => {
  try {
    const Billquery = await firestore().collection('bills').where('billRefNumber', '==', billRefNumber).get();
    
    if (Billquery.empty) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: 'Please Enter Valid Bill Number',
        button: 'close',
      })
      return;
    } 

    const billDocId = Billquery.docs[0].id;
    const billData = Billquery.docs[0].data();
    setBillRefNumber(billData.billRefNumber);
    setBillType(billData.BillType);
    setTotalAmount(billData.totalAmount);
    setAmountAfterDueDate(billData.amountAfterDueDate);
    setCustomerName(billData.customerName);
    setBilllDocId(billDocId);
    setStatus(billData.status);
    setbilldataa(billData);
    console.log(JSON.stringify(billData))
    let fetchedDueDate = billData.dueDate.toDate(); // Convert Firestore Timestamp to JavaScript Date
    let date = ("0" + fetchedDueDate.getDate()).slice(-2);
    let month = ("0" + (fetchedDueDate.getMonth() + 1)).slice(-2);
    let year = fetchedDueDate.getFullYear();
    setFormattedDueDate(`${date}.${month}.${year}`); // Store the formatted date in the state

    toggleModal();
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

const handleSubmit = async ({billRefNumber}) => {
  const userId = auth().currentUser;
  fetchData(billRefNumber);
};

      



  const paymentData = [
      { title: 'Customer Name', value: customerName },
      { title: 'Due Date', value: formattedDueDate},
      { title: 'Bill Type', value: billType },
      { title: 'Status', value: status },
      { title: 'Total Amount', value: totalAmount },
   
    ];    
    const renderItems = ({item}) => {
      
      return (
      
        <View style={{ marginTop: 20}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  
            <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20,paddingRight:"20%",paddingLeft:"5%"}}>
              {item.title}
            </Text>
    
            <Text
              style={{
                fontWeight: '500',
                color: 'black',
                fontSize: 18,
               
              }}>
              {item.value}
            </Text>
          </View>
        </View>
      );
    };
 
    const route = useRoute();

    useEffect(()=>{
    
      setCnic(route.params.cnic)
    },[])


return (
  <View style={styles.container} >
       <AlertNotificationRoot>
    <LinearGradient colors={['#03588E', '#1C3D73']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}} style={{ flex:1}}>
      <TypeWriter typing={1} style={styles.title}>Bill Payment</TypeWriter>
      <KeyboardAwareScrollView style={{flexShrink: 1, flexGrow: 1}}>
        <Animatable.View    animation={'bounceIn'} style={styles.formContainer}>
          <AppFrom
            initialValues={{accountNumber: null, amount: null}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            <Text style={styles.label}>Reference Number</Text>
            <AppFormFiled
            name="billRefNumber"
            placeholder="Bill Reference Number"
            keyboardType="numeric"
          />

          

            <SubmitButton title="Pay Bill" />
          </AppFrom>
        </Animatable.View>
      </KeyboardAwareScrollView>
    </LinearGradient>
     <Modal
          onBackdropPress={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
          isVisible={isModalVisible}
          swipeDirection="down"
          onSwipeComplete={toggleModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={900}
          animationOutTiming={500}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={500}
          style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.center}>
              <View style={styles.barIcon} />
              <Text
                style={{
                  fontWeight: 'bold',
                  marginLeft: 20,
                  color: 'black',
                  fontSize: 25,
                  marginTop: 20,
                }}>
                Review Payment
              </Text>

              <FlatList
                data={paymentData}
                renderItem={renderItems}
                keyExtractor={item => item.title}
               
              />

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                   
                <Button
                  title={'Confirm Payment '}
                  style={{width: 250, height: 50, borderRadius: 10}}
                  textStyle={{fontSize: 22}}
                   
                  onPress={() => {
                    if (status === 'paid') {
                      Dialog.show({
                        type: ALERT_TYPE.WARNING,
                        title: 'Warning',
                        textBody: "Bill Already Paid !",
                        button: 'close',
                      })
                    
                  }else if(cinic === "1"){

                    Dialog.show({
                      type: ALERT_TYPE.WARNING,
                      title: 'Warning',
                      textBody: "Please Add cnic Details first",
                      button: 'close',
                    })

                  } else {

                      navigation.navigate('OtpScreen', {
                          billRefNumber: billRefNumber,
                          amount: totalAmount,
                          status: status,
                          billData: billdataa,
                          customerName: customerName,
                          billType: billType,
                          dueDate: formattedDueDate,
                          paymentType: paymentType,
                          billlDocId,
                      });
                  }
                  
                  }}
                />
              
              </View>
            </View>
          </View>
        </Modal>
        </AlertNotificationRoot>
  </View>
);
};

const styles = StyleSheet.create({
container: {
flex:1,
 

},
title: {
  fontSize: 40,
  textAlign: 'center',
  color: 'white',
  marginTop: 150,

},
formContainer: {
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 20,
  margin: 20,
  marginTop: 80,
},
label: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 20,
},
modalContent: {
  backgroundColor: '#fff',
  paddingTop: 12,
  paddingHorizontal: 12,
  borderTopRightRadius: 20,
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  minHeight: 200,
 width: '100%',

  paddingBottom: 20,
},
center: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
barIcon: {
  width: 60,
  height: 5,
  backgroundColor: '#bbb',
  borderRadius: 3,
},
text: {
  color: '#bbb',
  fontSize: 24,
  marginTop: 10,
},

});

export default BillsPayment; 