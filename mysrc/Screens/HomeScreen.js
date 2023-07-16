import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  StatusBar,
  RefreshControl,
  Linking,
  Image,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo, useRef, useLayoutEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import color from '../config/color';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import Send from "../assets/Send.svg"
import Receive from "../assets/Receive.svg"
import BoxButton from '../components/BoxButton';
import Bill from "../assets/Bill.svg"
import Trans from "../assets/Trans"
import Account from "../assets/Account.svg"
import Customer from "../assets/Customer.svg"
import Water from "../assets/Water.svg"
import Blub from "../assets/Blub.svg"
import Phone from "../assets/Phone.svg"
import Email from "../assets/Email.svg"
import LiveChat from "../assets/LiveChat.svg"
import Gass from "../assets/Gass.svg"
import {Button} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import TypeWriter from 'react-native-typewriter';
import {TouchableOpacity} from 'react-native';

import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';


const HomeScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [Balance, setBalance] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [name,setName]=useState("");
  const [options, setOptions] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [userAccountNumber,setUserAccountNumber ]=useState("");
  const [email, setEmail] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const snapPoints = useMemo(() => ['25%', '36%'], []);





  const handleSwitchToggle = async () => {
    const newSwitchValue = false;
    
    await AsyncStorage.setItem('@biometricEnabled', JSON.stringify(newSwitchValue));
  };






    //phone
    const phoneNumberFunction = () => {

      let phoneNumber = '0300-1234567';
      if (Platform.OS === 'android') {
        phoneNumber = `tel:${'0300-1234567'}`;
      } else {
        phoneNumber = `telprompt:${'0300-1234567'}`;
      }
      Linking.openURL(phoneNumber);
    };

  // ref
  const bottomSheetModalRef = useRef(null);
 
  const ReadData = async () => {
    try {
      const docRef = firestore()
        .collection('usersData')
        .doc(auth().currentUser.email);
  
      const docSnap = await docRef.get();
  
      if (docSnap.exists) {
        const data = docSnap.data();
        setBalance(data.balance);
        setName(data.userName);
        setUserAccountNumber(data.accountNumber);
        setImageUrl(data.profileUri);
        setEmail(data.email);
        setCnic(data.cnicDetails.cnicNumber);
        setAddress(data.Address);
        console.log(userAccountNumber);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.log(error);
    }
  };


  const updateToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      const currentUser = auth().currentUser;
      await firestore().collection('usersData').doc(currentUser.email).update({
        fcmToken: fcmToken,
      });
      console.log('FCM token updated successfully');
    } catch (error) {
      console.log('Failed to update FCM token:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const currentUser = auth().currentUser;

      const transactionsSnapshot = await firestore()
        .collection('usersData')
        .doc(currentUser.email)
        .collection('transactions')
        .orderBy('timestamp', 'desc')
        .limit(2)
        .get();

      const fetchedTransactions = transactionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {...data, id: doc.id};
      });

      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const Buttons = [
    {
      Title: 'Send',
      image: <Send height={30} width={30} />,
      onPress: () => navigation.navigate('TransferButtonScreen' ,{
        userAccountNumber : userAccountNumber,cnic
      } ),
    },

    {
      Title: 'Receive',
      image: <Receive height={33} width={33} />,
      onPress: () => navigation.navigate('ReceiveScreen',{
        userAccountNumber,name
      })
    },
    {
      Title: 'Bill',
      image: <Bill height={33} width={33} style={{marginLeft:6}} />,
      onPress: () => handlePresentModalPressForBill(),
    },
    {
      Title: 'Account',
      Title2: "Managment",
      image: <Account height={35} width={35}/>,
      onPress: () => navigation.navigate('AccountScreen')
    },
    {
      Title: 'Transaction',
      Title2: "History",
      image: <Trans  height={33} width={33}/>,
      onPress: () => navigation.navigate('TransactionScreen',{name}),
    },

    {
      Title: 'Customer',
      Title2: "Support",
      image: <Customer height={33} width={33}/>,
      onPress: () => handlePresentModalPressForCus(),
    },
  ];
  const billOptions = [
    {image: <Water height={33} width={33} />, title: 'Water'},
    {image: <Blub height={33} width={33}/>, title: 'Electricity'},
    {image: <Gass height={33} width={33}/>, title: 'Gas'},
  ];
  const CustomerOptions = [
    {image: <Phone height={33} width={33}/>, title: 'Phone', onPress: phoneNumberFunction},
      {image:<Email height={33} width={33}/> , title: 'Email'  , onPress: () => Linking.openURL('mailto:support@example.com?subject=SendMail&body=Description')},
    {image:<LiveChat height={33} width={33}/> , title: 'Live Chat'    , onPress: () => navigation.navigate('LiveChat')}
  ];

  const handlePresentModalPressForBill = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsOpened(true);
    setOptions(false);
  }, []);
  const handlePresentModalPressForCus = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsOpened(true);
    setOptions(true);
  }, []);
  const logout = async () => {
    handleSwitchToggle();
    try {
      await auth().signOut();
      navigation.replace('LoginScreen');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };
  
  useEffect(() => {
    ReadData();
    updateToken();
    fetchTransactions();
    setModalVisible(false);
  
    const headerLeftComponent = () => (
      <TouchableOpacity onPress={() => navigation.navigate('Account', { name, email, address, cnic })}>
        <View style={{ flexDirection: "row" }}>
          {imageUrl 
            ? <Image source={{ uri: imageUrl }} style={{ width: 45, height: 45, borderRadius: 22.5 }} /> 
            : <Image source={require("../assets/user.png")} style={{ width: 45, height: 45, borderRadius: 22.5 }} />}
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: "500", color: "#DFE2E5" }}>Welcome</Text>
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#fff" }}>{name.toString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  
    const headerRightComponent = () => (
      <TouchableOpacity onPress={() => logout()}>
        <View style={{ flexDirection: "row" }}>
          <Icon name="logout" size={25} color={"#fff"} />
        </View>
      </TouchableOpacity>
    );
  
    navigation.setOptions({
      headerLeft: headerLeftComponent,
      headerRight: headerRightComponent
    });
  }, [navigation, name, userAccountNumber, imageUrl, cnic, email, address]);
  



  

  const onRefresh = async () => {
    setRefreshing(true);
    await ReadData();
    await fetchTransactions();
    setRefreshing(false);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
    
      <LinearGradient
        colors={['#03588E', '#1C3D73']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
    
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>Available Balance</Text>
            <TypeWriter typing={1} style={styles.balanceAmount}>
              {Balance ? ` PKR ${Balance.toString()}` : ` PKR ${0}`}
            </TypeWriter>
          </View>
          <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            
          }>
          <View
            style={{
              justifyContent: 'center',
              flex: 2,
              backgroundColor: '#fff',

              width: responsiveWidth(100),
              paddingHorizontal: responsiveHeight(5),
              marginTop: responsiveHeight(3),
              alignItems: 'center',

              borderTopLeftRadius: responsiveHeight(5),
              borderTopRightRadius: responsiveHeight(5),
            }}>
            <View style={{width: '100%'}}>
              <Text style={styles.recentTransactionText}>
                Recent Transaction
              </Text>
            </View>
            
{
  transactions.length === 0 ? (
    <>
      <View style={styles.transactionItem}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ alignSelf: "center" }}>
            {/* Add your desired content here */}
          </Text>
        </View>
      </View>
      <View style={styles.transactionItem}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ alignSelf: "center" }}>
            {/* Add your desired content here */}
          </Text>
        </View>
      </View>
    </>
  ) : (
    transactions.map((item) => {
      let methodName = "";

      if (item.paymentType === 'billPayment') {
        methodName = 'Bill Payment';
      } else if (item.paymentType === 'transferMoney') {
        methodName = 'Cash Transfer';
      } else {
        methodName = "Cash Receive";
      }

      return (
        <View key={item.id} style={styles.transactionItem}>
          <View style={styles.transactionDetails}>
            <Text style={styles.methodName}>
              {methodName}
            </Text>
            <Text style={styles.transactionDate}>
              {new Date(item.timestamp?.seconds * 1000).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          {item.paymentType === 'billPayment' ? (
            <Text style={styles.transactionAmount}>
              Rs {item.totalAmount}
            </Text>
          ) : (
            <Text style={styles.transactionAmount}>
              Rs {item.amount}
            </Text>
          )}
          {/* <View style={styles.iconContainer}>
            {item.paymentType === 'billPayment' ? (
              <Image
                resizeMode="contain"
                source={require('../assets/BilliconT.png')}
              />
            ) : (
              <Icon
                name="bank-transfer-out"
                size={30}
                color={color.newColor}
              />
            )}
          </View> */}
        </View>
      );
    })
  )
}




            <LinearGradient
              colors={['#03588E', '#1C3D73']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
          
              style={styles.transactionsContainer}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: responsiveHeight(4),

                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {Buttons.map((button, index) => (
                  <BoxButton
                    key={index}
                    image={button.image}
                    Title={button.Title}
                    Title2={button.Title2}
                    onPress={button.onPress}
                  />
                ))}
              </View>
            </LinearGradient>
          </View>

         
          </ScrollView>
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              backgroundStyle={styles.modalBackground}
              backdropComponent={BottomSheetBackdrop}>
              <View style={styles.modalContent}>
                <View style={styles.center}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      fontSize: 25,
                      marginTop: 20,
                    }}>
                    {options ? "Customer Care"  : "Bill Payment"}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: responsiveHeight(4),
                    }}>
                    {
                    options ? (

                      CustomerOptions.map((bill, index) => (
                        <BoxButton
                          key={index}
                          image={bill.image}
                          isModalVisiblee={true}
                          Title={bill.title}
                          textStyle={{color: 'black'}}
                          onPress={bill.onPress}
                        /> 
                      ))
                    ) : (
                      billOptions.map((bill, index) => (
                <BoxButton
                  key={index}
                  image={bill.image}
                  isModalVisiblee={true}
                  Title={bill.title}
                  textStyle={{color: 'black'}}
                  onPress={() => navigation.navigate('BillsPayment',{cnic})}
                />
              ))
                    )
                    }
                  </View>
                </View>
              </View>
            </BottomSheetModal>
          </BottomSheetModalProvider>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.newColor,
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  balanceContainer: {
    height: responsiveHeight(25),
    marginTop: responsiveHeight(8),
    paddingHorizontal: responsiveHeight(3.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 34,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width: responsiveWidth(100),
    paddingBottom: responsiveHeight(5),
    marginTop: responsiveHeight(2),
    borderTopLeftRadius: responsiveHeight(5),
    borderTopRightRadius: responsiveHeight(5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: responsiveWidth(100),
    alignItems: 'center',
  },
  recentTransactionText: {
    fontSize: 20,
    fontWeight: 'bold',

    marginTop: 20,
    alignSelf: 'flex-start',

    color: color.newColor,
  },
  transactionItem: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    backgroundColor: '#DFE2E5',
    height: responsiveHeight(10),
    width: responsiveWidth(90),
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    textAlign: 'center',
    right: responsiveWidth(3),
  
    color: "#023E74",
  },
  transactionDetails: {
    flexDirection: 'column',
    paddingRight: 30,
  },
  methodName: {
    color: "#023E74",
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    marginLeft:responsiveWidth(4),
  },
  transactionDate: {
    left: responsiveWidth(1),
    marginLeft:responsiveWidth(3),
  },
  iconContainer: {
    right: responsiveWidth(12),
  },
  invisibleBox: {
    width: responsiveWidth(30),
    backgroundColor: 'black',
    color: 'black',
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
  Lcontainer: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalBackground: {
    backgroundColor: '#ffffff', // Adjust the color as desired
  },
});
export default HomeScreen;
