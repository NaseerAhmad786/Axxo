import {StyleSheet, Text, View,  TouchableOpacity} from 'react-native';
import React from 'react';
import color from '../config/color';
import LinearGradient from 'react-native-linear-gradient';
import {useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';



const BoxButton = ({image, Title,Title2,imagestyle, isModalVisiblee ,textStyle, ...props }) => {

  return (

      <View  >
    {isModalVisiblee === true ?  ( <LinearGradient  colors={['#03588E', '#1C3D73']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      
      style={{
        width: responsiveWidth(19),
        height: responsiveHeight(9.5),
        backgroundColor: '#fff',
   
      marginHorizontal:responsiveWidth(4),
     
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsiveWidth(4),
      }}
      {...props}>
    <TouchableOpacity
    onPress={props.onPress}
      >
   {image}
    
    </TouchableOpacity>
    </LinearGradient> )
    : (   <TouchableOpacity
      style={{
        width: responsiveWidth(19),
        height: responsiveHeight(9.5),
        backgroundColor: '#fff',
   
      marginHorizontal:responsiveWidth(4),
     
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsiveWidth(4),
      }}
      {...props}>
        {image}
     
    </TouchableOpacity> )}
 
    <View style ={{flexDirection:"column"}}>
    <Text style={[{color: '#fff', fontSize: 13, fontWeight: '700',alignSelf:"center",marginTop:responsiveHeight(0.5)},textStyle]  }>
     {Title}
   
      </Text>
      <Text style={{color: '#fff', fontSize: 13, fontWeight: '700',alignSelf:"center",marginTop:responsiveHeight(0.2)}}>
      {Title2}
      </Text>
    </View>
   
  
    </View>
  );
};

export default BoxButton;

const styles = StyleSheet.create({});
