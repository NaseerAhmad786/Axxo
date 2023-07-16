import React from 'react';
import {  View, Text, Image, StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Button from './Button'; // Assuming you have a custom Button component
import Modal from 'react-native-modal';
const SuccessModal = ({ isVisible, toggleModal,text }) => {
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={toggleModal}
      animationIn="bounceIn"
      animationOut="slideOutDown"
      animationInTiming={900}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={500}
      style={{ width: responsiveWidth(70), marginHorizontal: responsiveWidth(17) }}
    >
      <View style={styles.modalContent}>
        <View style={styles.center}>
          <View style={styles.centerContent}>
            <Image resizeMode="contain" source={require("../assets/Sucess.png")} style={styles.image} />
            <Text style={styles.text}>{text}</Text>
            <Button
              style={styles.button}
              title="OK"
              textStyle={styles.buttonText}
              onPress={toggleModal}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  image: {
    width: 100,
    height: 92,
  },
  text: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "black",
  },
  button: {
    width: responsiveWidth(20),
    height: responsiveHeight(4.5),
  },
  buttonText: {
    fontSize: 20,
  },
});

export default SuccessModal;
