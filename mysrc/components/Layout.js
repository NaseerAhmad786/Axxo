import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image,TouchableOpacity,ActivityIndicator,Dimensions } from 'react-native';
import { responsiveScreenHeight, responsiveScreenWidth, responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import TypeWriter from 'react-native-typewriter';

import fireStore from "@react-native-firebase/firestore";
// import color from '../config/color';
// import { TextInput } from 'react-native-paper';
import Auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
// import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';

const Layout = ({ children,title,footer,header,textprop=true,...props}) => {
   let text = textprop;
   const [image, setImage] = useState(null);
   const [imageUrl, setImageUrl] = useState(null);
   const [uploading, setUploading] = useState(false);
   
   const windowWidth = Dimensions.get('window').width;
   const imageSize = windowWidth * 0.4;
   


   const uploadImageToFirebase = async (uri) => {
    setUploading(true); // Set uploading state to true when the upload starts

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      var ref = storage().ref().child(`userProfileImages/${Date.now().toString()}`);
      await ref.put(blob);
      const url = await ref.getDownloadURL();
      fireStore()
        .collection("usersData")
        .doc(Auth().currentUser.email)
        .update({
          profileUri: url
        });

      // Set uploading state to false when the upload is complete
    } catch (error) {
      console.error("Image upload error:", error);
      setUploading(false); // Set uploading state to false in case of an error
    }
  };



  const Picker =()=>{
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64:true,
     
    }).then(image => {
      setImage(image.path);
    uploadImageToFirebase(image.path);
    });
  }
  
useEffect(() => {
  fireStore().collection("usersData").doc(Auth().currentUser.email).onSnapshot(doc =>{
    if (doc.exists) {
      setUploading(false);
      setImageUrl(doc.data().profileUri)
    }
  })

}, [])


  return (
    <LinearGradient
      colors={['#03588E', '#1C3D73']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
      {...props}
    >
      <View style={[styles.header , header]}
      {...header}
      
      >
      {text === true ?   <TypeWriter typing={1} style={{fontWeight:"500",fontSize:responsiveFontSize(4.5) ,color:"white" , marginTop:responsiveHeight(5)}}  >
      {title}
      </TypeWriter>
    : <TouchableOpacity style={{ flex: 1,  marginTop: responsiveScreenHeight(2.5) }} onPress={Picker}>
    <View >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{  width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2, alignSelf:"center"}} />
      ) : (
        <Image source={require("../assets/user.png")} style={{  width: imageSize,
          height: imageSize,
          borderRadius: imageSize / 2, alignSelf:"center"}} resizeMode={"contain"}/>
      )}
      {uploading && (
        <View style={{ position: 'absolute', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, right: 0, bottom: 0 }}>
          <ActivityIndicator size="large" color="white" /> 
        </View>
      )}
    </View>
  </TouchableOpacity>
    
    
    }

     
      </View>
    
      <Animatable.View
      animation="fadeInUpBig" duration={500} useNativeDriver
        
        style={[styles.footer, footer] }
      
      >
       
        {children}
      </Animatable.View>
    </LinearGradient>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
    paddingVertical:responsiveHeight(5),
    marginBottom:responsiveScreenHeight(3)
  },
  footer: {
    flex: 3,
    
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal:20,
    paddingVertical:30
   

  },
});
