import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ErrorMsg = ({error,visible}) => {
  if (!visible || !error) return null;
    return (
    <View>
      <Text style={styles.error} >{error}</Text>
    </View>
  )
}

export default ErrorMsg

const styles = StyleSheet.create({
error:{
    color:"red"
}

})