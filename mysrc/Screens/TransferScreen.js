import {
  
  StyleSheet,
  Text,
  Alert,

  View,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import color from '../config/color';
import Button from '../components/Button';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {

  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import AppFrom from '../components/AppFrom';
import AppFormFiled from '../components/AppFormFiled';
import * as Yup from 'yup';

import {useRoute} from '@react-navigation/native';
import SubmitButton from '../components/SubmitButton';
// import emailjs from '@emailjs/browser';

import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import {useRef} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const validationSchema = Yup.object().shape({
  accountNumber: Yup.string().required().min(12).label('AccountNumber'),
  messages: Yup.string().label('Message'),
});
const TransferScreen = ({navigation}) => {
  const [amount, setAmount] = useState(null);
  const bottomSheetModalRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState({});
  const [recipientDo, setRecipientDo] = useState({});
  const [accountNumber, setAccountNumber] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [userAccountNumber,setUserAccountNumber ]=useState("");
  const [messages, setMessages] = useState(null);



  const ItemSeparator = () => <View style={styles.separator} />;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // const generatedOtp =  () => {
  //   const generatedOtp = Math.floor(1000 + Math.random() * 9000);
  //   setOtp(generatedOtp)
  //   console.log(generatedOtp);

  //   const userEmail = auth().currentUser.email;
  //   if (!userEmail) {

  //     Alert.alert('Error', 'No user email found.');
  //     return;
  //   }

  //   emailjs
  //     .send(
  //       'service_sv6uyxbp', // Your EmailJS service ID
  //     'template_n862xnpp', // Your EmailJS template ID
  //     {
  //       user_email: userEmail,
  //       message: `Your OTP is: ${generatedOtp}`,
  //       to_name : "User"
  //     },
  //     '68ly1jeUECkH3YVeM' // Your EmailJS user ID
  //     )
  //     .then(() => Alert.alert('OTP sent.',  )
  //     .catch(error => console.log(error), ));
  // };

  const handleSubmit = ({accountNumber, messages}) => {
    
    const fetchData = async () => {
      const recipientQuery = await firestore()
        .collection('usersData')
        .where('accountNumber', '==',accountNumber)
        .get();
      if (recipientQuery.empty) {
        Alert.alert('Error', 'No user found with that account number.');
        return;
      }
      else {
        toggleModal();
      }

      const recipientDoc = recipientQuery.docs[0];
      const recipientData = recipientDoc.data();
      setRecipient(recipientData);
      setRecipientDo(recipientDoc.id);
     

      console.log(recipientData.accountNumber);
    };
    fetchData();
    setMessages(messages);
    setAccountNumber(accountNumber);
 
  };

  const BottomSheetPress = () => {
    bottomSheetModalRef.current.present();
    setIsOpen(true);
  };
  const route = useRoute();
  useEffect(() => {

    if (route.params) {
      setAmount(route.params.amount);
      setUserAccountNumber(route.params.userAccountNumber)
      console.log(userAccountNumber)
    } else {
      setAmount(null);
    }
  }, []);


  const paymentData = [
    {title: 'Title', value: recipient.userName},
    {title: 'Amount', value: amount},
    {title: 'Messages', value: messages},
  ];

  const producePayment =()=>{
    if (accountNumber == userAccountNumber) {
    
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Warning',
        textBody: "Sorry can't send Money to your own Account !",
        button: 'close',
      })
      
    } else {
      navigation.navigate('OtpScreen', {
        accountNumber: accountNumber,
        recipient: recipient,
        amount: amount,
        messages
      ,recipientDo
      });
  
  }
    }
  
  
  
  const renderItems = ({item}) => {
    return (

      <View style={{ marginTop: 20}}>
        <View style={{flexDirection: 'row', width: responsiveScreenWidth(80),alignItems:"center",justifyContent:"space-between",}}>
          <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20,marginRight:responsiveScreenWidth(10)}}>
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




  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <AlertNotificationRoot>
        <LinearGradient colors={['#03588E', '#1C3D73']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}} style={styles.container} blur>
          {/* <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            index={0}
            backgroundStyle={{borderRadius: 50,opacity}}>
            <Text
              style={{
                fontWeight: 'bold',
                marginLeft: 30,
                color: 'black',
                fontSize: 25,
              }}>
              Review Payment
            </Text>
            <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 30}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                Account Title
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  color: 'black',
                  fontSize: 18,
                  marginLeft: 80,
                }}>
                Naseer Ahmad
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 30}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                Amount
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  color: 'black',
                  fontSize: 18,
                  marginLeft: 130,
                }}>
                RS : 50000
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 30}}>
              <Text style={{fontWeight: 'bold', color: 'black', fontSize: 20}}>
                Messages
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  color: 'black',
                  fontSize: 18,
                  marginLeft: 110,
                }}>
                Zakat
              </Text>
            </View>
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
              />
            </View>
          </BottomSheetModal> */}
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
                  ItemSeparatorComponent={ItemSeparator}
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
                     
                  onPress={()=> producePayment() }
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Text
            style={{
              fontSize: 40,
              width: '100%',
              textAlign: 'center',
              paddingRight: 2,
              color: 'white',
              marginTop: responsiveHeight(8),
              paddingBottom: responsiveHeight(5),
            }}>
            Send Money
          </Text>
          <KeyboardAwareScrollView style={{flexShrink: 1, flexGrow: 1}}>
            <Animatable.View
              animation={'fadeInUp'}
              style={{
                height: responsiveHeight(100),
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: color.white,
                borderTopLeftRadius: responsiveHeight(5),
                borderTopRightRadius: responsiveHeight(5),
                width: responsiveWidth(100),
              }}>
              <LottieView source={require("../assets/animation/transfer.json")} autoPlay loop
              style={{width:responsiveWidth(100),height:responsiveHeight(40)}}
              />

             

              <AppFrom
                initialValues={{accountNumber: null, messages: ''}}
                validationSchema={validationSchema}
                
                onSubmit={handleSubmit}>
                   <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: color.newColor,
                  width:"100%",
                  marginTop: responsiveHeight(3),
                  paddingLeft: responsiveWidth(11),
                }}>
                Account Number
              </Text>
                <AppFormFiled
                  placeholder={'Enter Your Account Number'}
                  multiline={true}
                  name="accountNumber"
                  
                  mode="outlined"
                  outlineColor="#281d61"
                  theme={{
                    roundness: 20,
                    colors: {
                      primary: '#808493',
                      underlineColor: 'transparent',
                      placeholder: 'red',
                      onSurfaceVariant: '#808493',
                      
                    },
                    
                  }}
               
                  style={{
                    width: '80%',
                    height: responsiveHeight(9),
                    backgroundColor: '##F2F3F4',
                    
                  }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: color.newColor,
                    width:"100%",
                    paddingLeft: responsiveWidth(10),
                    marginTop: 10,
                  }}>
                  Messages
                </Text>
                <AppFormFiled
                  placeholder={'write your message'}
                  theme={{
                    roundness: 20,
                    colors: {
                      primary: '#808493',
                      underlineColor: 'transparent',
                      placeholder: 'red',
                      onSurfaceVariant: '#808493',
                      
                    },
                    
                  }}
                  name="messages"
                  multiline={true}
                  mode="outlined"
                  style={{
                    width: '80%',
                    height: responsiveHeight(9),
                    backgroundColor: '##F2F3F4',
                  }}
                />
                <SubmitButton title={'Next'} />
              </AppFrom>
              
              <View
                style={{
                  justifyContent: 'flex-end',
                  alignItems: 'center',

                  marginHorizontal: responsiveHeight(5),
                  bottom: responsiveHeight(5),
                  flex: 1,
                  backgroundColor: color.white,
                }}></View>
            </Animatable.View>
          </KeyboardAwareScrollView>
        </LinearGradient >
      </AlertNotificationRoot>
    </GestureHandlerRootView>
  );
};

export default TransferScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.newColor,
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 500,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#D8D8D8', // Change this color to your liking
    marginTop: 5,
  },
});
