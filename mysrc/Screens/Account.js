import { StyleSheet, Text, View,  FlatList } from 'react-native'
import React from 'react'
import Layout from '../components/Layout'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import CustomTextInput from '../components/CustomTextInput';
import { useRoute } from '@react-navigation/native';

const Account = () => {
    const route = useRoute();
    const accountTitles = [
        { id: 1, title: 'Account Title',value : route.params.name },
        { id: 2, title: 'CNIC' ,value :route.params.cnic},
        { id: 3, title: 'Email',value :route.params.email },
        { id: 4, title: 'Address',value :route.params.address},
        // Add more account titles as needed
      ];
   
      const renderItem = ({ item }) => (
        <View style={{ paddingLeft: responsiveWidth(5) }}>
          <Text
            style={{
              fontSize: responsiveFontSize(1.8),
              color: '#023E74',
              fontWeight: 'bold',
            }}>
            {item.title}
          </Text>
          <CustomTextInput
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
                primary: 'black',
                underlineColor: 'black',
              },
            }}
            style={{
              borderColor: 'black',
              borderWidth: 1,
              height: responsiveHeight(8),
            }}
            value={item.value}
            editable={false}
          />
        </View>
      );
      
  return (
<Layout textprop={false}>
<FlatList
      data={accountTitles}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
</Layout>
  )
}

export default Account

const styles = StyleSheet.create({})