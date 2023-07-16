import { View, Image, Text, TouchableOpacity, FlatList,StyleSheet,PermissionsAndroid,ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import PushNotification from 'react-native-push-notification';

import Modal from 'react-native-modal';
import RNFS from 'react-native-fs';
import {
  responsiveFontSize,
  responsiveHeight,

  responsiveWidth,
} from 'react-native-responsive-dimensions';

import auth from '@react-native-firebase/auth';
import Icon from "react-native-vector-icons/Entypo"
import firestore from '@react-native-firebase/firestore';
import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 
} from 'react-native-popup-menu';

import Button from '../components/Button';
import { useRoute } from '@react-navigation/native';
const AccountScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const route = useRoute();
  const fetchTransactions = async () => {
    setUploading(true);
    try {
      const user = auth().currentUser;
      const transactionsSnapshot = await firestore()
        .collection('usersData')
        .doc(user.email)
        .collection('transactions')
        .orderBy('timestamp', 'desc')
        .get();
  
      const fetchedTransactions = transactionsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      
      setTransactions(fetchedTransactions);
      setUploading(false);
      return fetchedTransactions; // return the fetched transactions
    } catch (error) {
      setUploading(false);
      console.error('Error fetching transactions:', error);
    }
  };
  // Function to initialize notification channels
  const configureNotificationChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'transactions-channel', // Channel ID
        channelName: 'Transactions', // Channel name
        channelDescription: 'Channel for transactions notifications',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Notification channel created: ${created}`)
    );
  };

  const menuContext = React.useContext(MenuContext);
  const animationRef = useRef(null);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to download transactions.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return granted;
      } else {
        console.log('Storage permission denied');
        return granted;
      }
    } catch (err) {
      console.warn(err);
    }
  };
  
  const downloadTransactions = async () => {


    try {
      const fetchedTransactions = await fetchTransactions();
      const granted = await requestStoragePermission();
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission denied');
        return;
      }
      console.log(fetchedTransactions)
      const csvText = "Transaction id,Payment type,Sender Email,Receiver or Bill,amount,Date/Time\n" + fetchedTransactions.map(t => {
        let p = "";
        let PaymentType = "";
        let Amount = "";
        let email = "";
        if (t.paymentType === "receiveMoney") {
          p = "+";
        } else if (t.paymentType === "transferMoney") {
          p = "-";
        }
        if (t.paymentType === "billPayment") {
          PaymentType = t.billType;
          email = t.userEmail;
          Amount = `-${t.totalAmount}`;
        } else {
          PaymentType = t.recipientEmail;
          Amount = t.amount;
          email = t.senderEmail;
        }
  
        return `${t.id},${t.paymentType},${email},${PaymentType},${p} ${Amount},${new Date(t.timestamp?.seconds * 1000).toLocaleString()}`;
      }).join("\n");
      const baseFilename = 'transactions';
      const extension = '.csv';
      let filename = baseFilename + extension;
      let counter = 1;
  
      while (await RNFS.exists(`${RNFS.DownloadDirectoryPath}/${filename}`)) {
        filename = `${baseFilename} (${counter})${extension}`;
        counter++;
      }

      const path = `${RNFS.DownloadDirectoryPath}/${filename}`;
      await RNFS.writeFile(path, csvText, 'utf8');
      toggleModal();
      console.log("Transactions CSV file created at:", path);
         // Show a push notification
         configureNotificationChannels();
    PushNotification.localNotification({
      channelId: 'transactions-channel',
      title: "Transactions Downloaded",
      message: `Transactions File Downloaded at : ${path}`,
    });
    } catch (error) {
      console.error('Error downloading transactions:', error);
    }
  };
  
  


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ padding: 10 }}>
          <Menu>
            <MenuTrigger onPress={() => console.log('Menu icon pressed')}>
              <Icon name={"dots-three-vertical"} size={21} color={"#fff"} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption style={{borderRadius:responsiveWidth(10)}}  onSelect={() => downloadTransactions()}>
                <Text>Download Transaction Report</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </TouchableOpacity>
      ),
    });
    
    
    
 
    fetchTransactions();
  }, []);

  const groupTransactionsByDate = (transactions) => {
    const groupedTransactions = {};
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.timestamp?.seconds * 1000);
      const today = new Date();
      const yesterday = new Date(today);
      
      yesterday.setDate(yesterday.getDate() - 1);

      let formattedDate = transactionDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      if (transactionDate.toDateString() === today.toDateString()) {
        formattedDate = 'Today';
      } else if (transactionDate.toDateString() === yesterday.toDateString()) {
        formattedDate = 'Yesterday';
      }

      if (!groupedTransactions[formattedDate]) {
        groupedTransactions[formattedDate] = [];
      }
      groupedTransactions[formattedDate].push(transaction);
     
    });
    return groupedTransactions;
  
  };

  const groupedTransactions = groupTransactionsByDate(transactions);

  const TransactionItem = ({ item }) => {
    let methodName = "";
    let AmountType = "";
    if (item.paymentType === 'billPayment') {
      methodName = 'Bill Payment';
    } else if (item.paymentType === 'transferMoney'){
      methodName = 'Cash Transfer';
    } else {
      methodName  ="Cash Receive"
    }
    if (item.paymentType === 'billPayment' ) {
      AmountType = `- Rs ${item.totalAmount}`
    }else if (item.paymentType === 'transferMoney' ){
      AmountType = `- Rs ${item.amount}`
    } else {
      AmountType = `+ Rs ${item.amount}`
    }
    return (
     
      <TouchableOpacity style={styles.transactionItem} onPress={() => navigation.navigate('TransactionInvoiceScreen', { item })}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {methodName == 'Cash Receive' ? (
          <Image source={require('../assets/ArrowD.png')} style={{ width: 22, height: 22 ,marginLeft:responsiveWidth(3),marginRight:responsiveWidth(3)}} resizeMode={'contain'} />
        ) : (
          <Image source={require('../assets/Arrow.png')} style={{ width: 22, height: 22 ,marginLeft:responsiveWidth(3),marginRight:responsiveWidth(3)}} resizeMode={'contain'} />
        )}
        <View style={styles.transactionDetails}>
          <Text style={styles.methodName}>{methodName}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.timestamp?.seconds * 1000).toLocaleString(undefined, {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
      </View>
      <Text style={[styles.transactionAmount, { color: methodName == 'Cash Receive' ? 'green' : 'red' }]}>
        {AmountType}
      </Text>
    </TouchableOpacity>
    )
      };

  const TransactionGroup = ({ date, TransactionItemKorunkyliaprop  }) => (
    <View style={styles.transactionGroup}>
      <Text style={styles.transactionGroupDate}>{date}</Text>
      {TransactionItemKorunkyliaprop.map((transaction) => (
        <TransactionItem key={transaction.id} item={transaction} />
      ))}
    
    </View>
  );


  const Separator = () => <View style={styles.separator} />;

  return (
  
    <Layout title={route.params.name} textprop={true}>
    {( uploading&&
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, right: 0, bottom: 0 }}>
          <ActivityIndicator size="large" color="#006093" /> 
        </View>
      )}
      <View style={{marginTop: responsiveHeight(1)}}>
        <Text
          style={{
            color: '#034075',
            fontWeight: 'bold',
            fontSize: responsiveFontSize(2.2),
            paddingBottom:responsiveHeight(5),
          }}>
          Transactions History
        </Text>
      </View>
      <FlatList
  data={Object.keys(groupedTransactions)}
  renderItem={({ item }) => (
    <TransactionGroup date={item} TransactionItemKorunkyliaprop={groupedTransactions[item]} />
  )}
  keyExtractor={(item) => item}
  ItemSeparatorComponent={Separator}
/>
<Modal
          onBackdropPress={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
          isVisible={isModalVisible}
          swipeDirection="down"
          onSwipeComplete={()=>setModalVisible(!isModalVisible)}
          animationIn="bounceIn"
          animationOut="slideOutDown"
          animationInTiming={900}
          animationOutTiming={500}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={500}
          style={{width:responsiveWidth(70),marginHorizontal:responsiveWidth(17)}}>
          <View style={styles.modalContent}>
            <View style={styles.center}>
             
              {/* <Text
                style={{
                  fontWeight: 'bold',
                  marginLeft: 20,
                  color: 'black',
                  fontSize: 25,
                  marginTop: 20,
                }}>
                Review Payment
              </Text> */}

            

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 12,
                  
                }}>
                  
                  <Image resizeMode='contain' source={require("../assets/Sucess.png")} style={{width:100,height:92}}/>
                  <Text style={{marginTop:10,fontSize:15,fontWeight:"600",color:"black"}}>Transactions Records Downloaded</Text>
                <Button style={{width:responsiveWidth(20),height:responsiveHeight(4.5)}} title={'OK'} textStyle={{fontSize:20}} onPress={toggleModal} />
              
              </View>
            </View>
          </View>
        </Modal>
    </Layout>
   
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  transactionAmount: {
    fontSize: responsiveFontSize(2),
    fontWeight: '800',
    textAlign: 'right',
    marginRight:responsiveWidth(4),


  },
  transactionDetails: {
      
  },
  methodName: {
    color: '#023E74',
    fontSize: responsiveFontSize(1.9),
      fontWeight:"500"
  },
  transactionDate: {

    
    
  },

  transactionItem: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    backgroundColor: '#DFE2E5',
    height: responsiveHeight(10),
    width: responsiveWidth(90),
    alignItems:"center",
    justifyContent: 'space-between',
    borderRadius: 15,
    
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E3',
    marginVertical: 10,
  },
  transactionGroup: {
    marginBottom: responsiveHeight(2),
  },
  transactionGroupDate: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#034075',
    marginBottom: responsiveHeight(1),
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
  animation: {
    width: responsiveWidth(10),
    height: responsiveHeight(10),
  },
});
