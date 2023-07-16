import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,

  Switch,
} from 'react-native';
import Layout from '../components/Layout';

// import CustomTextInput from '../components/CustomTextInput';
// import { responsiveHeight } from 'react-native-responsive-dimensions';
// import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fingerprint from 'react-native-vector-icons/FontAwesome5';
// import color from '../config/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import { responsiveWidth } from 'react-native-responsive-dimensions';
const AccountScreen = ({ navigation }) => {
  const [isSwitchEnabled, setIsSwitchEnabled] = useState(false);
  // const checkFingerprintAvailability = async () => {
  //   const { available } = await ReactNativeBiometrics.isSensorAvailable();
  //   console.log(available)
  //   setIsFingerprintAvailable(available);
  // };
  
  // const [isFingerprintAvailable, setIsFingerprintAvailable] = useState(false);
  useEffect(() => {
    retrieveBiometricPreference();


  }, []);

  const retrieveBiometricPreference = async () => {
    const value = await AsyncStorage.getItem('@biometricEnabled');
    if (value !== null) {
    
      setIsSwitchEnabled(JSON.parse(value));
    }
  };

  const handleSwitchToggle = async () => {
    const newSwitchValue = !isSwitchEnabled;
    setIsSwitchEnabled(newSwitchValue);
    await AsyncStorage.setItem('@biometricEnabled', JSON.stringify(newSwitchValue));
  };

  // const requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Cool Photo App Camera Permission',
  //         message: 'Cool Photo App needs access to your camera so you can take awesome pictures.',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       }
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log('You can use the camera');
  //     } else {
  //       console.log('Camera permission denied');
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  // useEffect(() => {
  //   requestCameraPermission();
  // }, []);

  const data = [
    { id: '1', text: 'Update CNIC', iconName: 'id-card', onPress: () => navigation.navigate('Cnic') },
    { id: '2', text: 'Change Password', iconName: 'key', onPress: () => navigation.navigate('ResetPassword') },
    { id: '3', text: 'Address', iconName: 'home', onPress: () => navigation.navigate('Address') },
    // Add more items as needed
  ];
  const renderItem = ({ item }) => (
    <TouchableOpacity style={{ flexDirection: 'row', marginTop: '5%' }} onPress={item.onPress}>
      <Icon name={item.iconName} size={25} color="#B5B9BE" />
      <Text style={{ marginLeft: '2%', fontSize: 18, fontWeight: '400', color: '#192129' }}>{item.text}</Text>
      <View style={{ flex: 1, alignItems: 'flex-end', marginRight: '2%' }}>
        <Icon name="arrow-right" size={20} color="#B5B9BE" />
      </View>
      
    </TouchableOpacity>
    
  );
  
  return (
    <Layout title="naseer" textprop={false}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#192129', marginTop: '5%' }}>Account Settings</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
    
        />
        <View style={{flex:10}}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#192129', marginTop: '2%' }}>Security Settings</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
       
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '4%' }}>
            <Fingerprint name={"fingerprint"} size={25} color="#B5B9BE"  />
            <Text style={{ marginLeft: '2%', fontSize: 18, fontWeight: '400', color: '#192129',marginLeft:responsiveWidth(2) }}>Fingerprint</Text>
          </View>
          <Switch
        value={isSwitchEnabled}
        onValueChange={handleSwitchToggle}
        trackColor={{ false: '#767577', true: '#1C3D73' }}
        thumbColor={isSwitchEnabled ? '#03588E' : '#1C3D73'}
      />
        </View>
        </View>
      </View>
    </Layout>
  );
  


     
   

};

export default AccountScreen;

const styles = StyleSheet.create({});
