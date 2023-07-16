import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import React, {useState, useCallback, useEffect, useLayoutEffect} from 'react';
import {
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  Composer,
} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import {IconButton} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import {send} from '@emailjs/browser';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import LiveChat2 from "../assets/LiveChat2.svg"

const Chat = () => {
  const [messagesList, setMessageList] = useState([]);
  const [onFocus, setOnFocus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [email,setEmail]=useState("");
  const navigation = useNavigation();
  const renderFooter = props => {
    if (isTyping) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>User is typing...</Text>
        </View>
      );
    }
    return null;
  };

  // const customtInputToolbar = props => {
  //   return (

  //       <InputToolbar
  //     {...props}

  //     containerStyle={{
  //       backgroundColor: "red",
  //         borderColor:"black",
  //        borderTopWidth:2,
  //        width:"50%",

  //     }}
  //   />

  //   );
  // };
  const route = useRoute();
  function renderSend(props) {
    return (
      <LinearGradient
        colors={['#03588E', '#1C3D73']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.sendingContainer}>
        <Send
          {...props}
          containerStyle={{
            width: 0,
            height: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/Vector.png')}
            style={{bottom: 9, alignSelf: 'center', marginRight: responsiveWidth(1)}}
          />
        </Send>
      </LinearGradient>
    );
  }
  const renderComposer = props => {
    return (
      <Composer
        {...props}
        textInputProps={{
          // onFocus: () => setOnFocus(true),
          // onBlur: () => setOnFocus(false),
          marginHorizontal: 12,
          blurOnSubmit: true,
          paddingVertical: 14,
          paddingHorizontal: 15,
          backgroundColor: '#E8E1DD',
          borderRadius: 15,
          borderColor: '#E8E1DD',
          borderWidth: 1,
          width: '80%',
        }}></Composer>
    );
  };
  const renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{borderTopWidth: 0, paddingVertical: 12}}
      />
    );
  };

  useLayoutEffect(() => {
    const userEmail = auth().currentUser.email;
    setEmail(userEmail);
    const unsubscriber = navigation.addListener('beforeRemove', () => {
      // Delete all conversations when navigating back
      firestore()
        .collection('liveChats')
        .doc( 'b6ca9bb3-b965-43e9-8d0b-0858f7229ae4' +
        ' ' + userEmail)
        .collection('chats')
        .get()
        .then((querySnapshot) => {
          const batch = firestore().batch();
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          return batch.commit();
        })
        .catch((error) => {
          console.log('Error deleting conversations:', error);
        });
        return unsubscriber;
    });
    const unsubscribe = firestore()
      .collection('liveChats')
      .doc(
        '' +
          'b6ca9bb3-b965-43e9-8d0b-0858f7229ae4' +
          ' ' +
          userEmail,
      )
      .collection('chats')
      .orderBy('createdAt', 'desc');
    unsubscribe.onSnapshot(querySnapshot => {
      const allMessages = querySnapshot.docs.map(item => {
        return {
          ...item._data,
          createdAt: item._data.createdAt,
        };
      });
      setMessageList(allMessages);
      return () => {
        unsubscribe();
       
    
      };
    
    });
  }, []);
  const onSend = useCallback((messages = []) => {
    const userEmail = auth().currentUser.email
  
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: 'mubeen190100@gmail.com',
      sendTo: 'naseer@axxo.com',
      createdAt: Date.parse(msg.createdAt),
    };
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    firestore()
      .collection('liveChats')
      .doc(
        '' +
          'b6ca9bb3-b965-43e9-8d0b-0858f7229ae4' +
          ' ' +
          userEmail,
      )
      .collection('chats')
      .add(myMsg);

    firestore()
      .collection('liveChats')
      .doc(
        ' ' +
          userEmail +
          ' ' +
          'b6ca9bb3-b965-43e9-8d0b-0858f7229ae4',
      )
      .collection('chats')
      .add(myMsg);
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FEFEFE'}}>
      <StatusBar translucent={false} backgroundColor="#006093" />

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: 30,
        }}>
        <Image source={require('../assets/Group.png')} resizeMode={'contain'} />
        {/* <LiveChat2 width={responsiveWidth(30)} height={responsiveHeight(4)}/> */}
        <View
          style={{
            width: responsiveWidth(100),
            height: 2,
            backgroundColor: '#006093',
            marginTop: 10,
          }}
        />
      </View>

      <GiftedChat
        alwaysShowSend={true}
        messages={messagesList}
        onSend={messages => onSend(messages)}
        user={{
          _id: email,
        }}
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderSend={renderSend}
        messagesContainerStyle={{paddingBottom: 20}}
        mess
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#006093',
                },
                left: {
                  backgroundColor: '#F0EDE8',
                },
              }}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006093',
    height: 50,
    width: 50,
    borderRadius: 11,
    bottom: responsiveHeight(0.5),
    marginRight:responsiveWidth(2)
  },
});

export default Chat;
