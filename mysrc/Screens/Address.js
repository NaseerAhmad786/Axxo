import { StyleSheet, Text, View,PermissionsAndroid, FlatList,TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInput } from 'react-native-paper';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Geolocation from 'react-native-geolocation-service';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import fireStore from '@react-native-firebase/firestore';
import SuccessModal from '../components/SuccessModal';
const Address = () => {

    const [latitude,SetLatitude] = useState(0);
    const [longitude,SetLongitude] = useState(0);
    const [response, setResponse] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);


    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Cool Photo App Camera Permission',
            message: 'Cool Photo App needs access to your camera so you can take awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };
  
    useEffect(() => {
      requestCameraPermission();
    }, [])
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
    const geolocation =()=>{
        Geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            SetLatitude(position.coords.latitude);
            SetLongitude(position.coords.longitude);
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1IjoibmFzZWVyMTIiLCJhIjoiY2xqNHhodzkyMDNwazNkdDBldTJ2aHBsZSJ9.HVXT9CLTvyUByo4vkG7X0g`)
      .then((response) => response.json())
      .then((responseJson) => {
        const placeName = responseJson.features[0].place_name;
        setResponse(placeName);
      })
      .catch((error) => {
        console.log(error);
      });
    
    
      }
      const handleSubmit = async()=>{
       
        try{
          await fireStore().collection("usersData").doc(auth().currentUser.email).update({
      
          Address : response
          
          }).then(()=>{toggleModal()})
        } catch(err){
          console.log(err)
        }
      
      
      }
  return (
   <Layout title={"Address"} textprop={true}>
    <SuccessModal isVisible={isModalVisible} toggleModal={toggleModal} text={"Address uploaded"}/>
  <Icon name="home" size={100} style={{alignSelf:"center"}} color={"#006093"}/>
  <TextInput
          activeUnderlineColor="black"
          underlineColor="#808080"
          label="Enter Your address"
         value={response}
         onChangeText={(text)=>{setResponse(text)}}
          style={styles.input}
          right={
            <TextInput.Icon
              icon="crosshairs-gps"
              onPress={geolocation}
            />
          }
        />
        <Button title={'Submit'} style={{alignSelf:"center"}} onPress={handleSubmit}/>
   </Layout>
  )
}

export default Address

const styles = StyleSheet.create({

    input: {
        width: responsiveWidth(80),
        height: responsiveHeight(10),
        marginTop: responsiveHeight(1),
        backgroundColor: 'transparent',
       alignSelf:"center"
      },

})