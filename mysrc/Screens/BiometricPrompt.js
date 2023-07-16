
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Fingerprint from 'react-native-vector-icons/FontAwesome5';
const BiometricPrompt = ({ onAuthenticated }) => {
  useEffect(() => {
    const authenticateUser = async () => {
      const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });
      const promptConfig = {
        promptMessage: 'Scan your finger',
        cancelButtonText: 'Cancel',
        disableBackup: true,cancelButtonVisible: false,
      };

      const { success } = await rnBiometrics.simplePrompt(promptConfig);

      if (success) {
        onAuthenticated(success);
      }else {
        console.log('Fingerprint authentication failed');
        authenticateUser();
      }

      
    };

    authenticateUser();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor:"#023E74" }}>
     <TouchableOpacity onPress={()=>{authenticateUser();}}>
     <Fingerprint name={"fingerprint"} size={100} color="#B5B9BE"  />
     </TouchableOpacity>
    </View>
  );
};

export default BiometricPrompt;