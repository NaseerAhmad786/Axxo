import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TypeWriter from 'react-native-typewriter';
const Typing = ({text}) => {
  return (
    <TypeWriter typing={1} style={{ color: "#fff", fontSize: 34 }}>
      {text}
    </TypeWriter>
  )
}

export default Typing

const styles = StyleSheet.create({})