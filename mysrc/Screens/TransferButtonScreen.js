import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import color from '../config/color';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
const TransferButtonScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const [userAccountNumber,setUserAccountNumber ]=useState("");

  const route =useRoute();
  const mona = title => {
    if (title === 'X') {
      setValue(value.substring(0, value.length - 1));
    } else if (value.length < 12) {
      setValue(value + title);
    }
  };

const navigateToNext =()=>{
  if (route.params.cnic === "1") {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Warning',
      textBody: "Please Add Your CNIC First",
      button: 'close',
    })
  }else{
    navigation.navigate('TransferScreen', {amount: value ,userAccountNumber})
  }
}

 useEffect(()=>{
 setUserAccountNumber(route.params.userAccountNumber);
 console.log(userAccountNumber);



 },[])


  const Btn = ({title, iconName}) => {



    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => mona(title)}>
        {iconName ? (
          <Icon name={iconName} size={30} color="black" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <AlertNotificationRoot >
    <LinearGradient colors={['#03588E', '#1C3D73']}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}} style={styles.container}>
      <Text style={styles.valueText}>{`₨ : ${value}`}</Text>
    
      <Animatable.View
        animation={'fadeInUp'}
        style={styles.buttonContainer}>
        <Btn title="1" />
        <Btn title="2" />
        <Btn title="3" />
        <Btn title="4" />
        <Btn title="5" />
        <Btn title="6" />
        <Btn title="7" />
        <Btn title="8" />
        <Btn title="9" />
        <Btn title="" />
        <Btn title="0" />
        <Btn iconName={'backspace'} title={'X'} />
        <View style={styles.nextButtonContainer}>
          <Button
            title={'Next'}
            onPress={() => navigateToNext()}
          />
         
        </View>
      </Animatable.View>
      
    </LinearGradient>
    </AlertNotificationRoot>
  );
};

export default TransferButtonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.newColor,
    alignItems: 'center',
    paddingTop: responsiveHeight(6),
  },
  valueText: {
    fontSize: 40,
    width: '100%',
    textAlign: 'center',
    paddingRight: 2,
    color: 'white',
    marginTop: responsiveHeight(5),
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',

    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
    borderTopLeftRadius: responsiveHeight(5),
    borderTopRightRadius: responsiveHeight(5),
    height: '100%',
  },
  button: {
    backgroundColor: color.white,
    marginLeft: responsiveWidth(3.5),
    marginTop: responsiveHeight(5),
    height: responsiveHeight(11),
    width: responsiveWidth(25),
    borderRadius: responsiveFontSize(4),
    padding: responsiveFontSize(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 37,
    color: 'black',
    textAlign: 'center',
  },
  nextButtonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: responsiveHeight(5),
    bottom: responsiveHeight(5),
    flex: 1,
    backgroundColor: color.white,
  },
});
