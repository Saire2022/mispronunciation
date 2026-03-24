import { View, Text, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import * as Clipboard from 'expo-clipboard';
import { Snackbar } from 'react-native-paper';

export default function CopyButton({ textToCopy }) {
  const [visible, setVisible] = useState(false); // Para manejar la visibilidad del Snackbar

  const handleCopy = async () => {
    if (textToCopy) {
      await Clipboard.setStringAsync(textToCopy); // Copiar texto al portapapeles
      setVisible(true); // Mostrar Snackbar
    }
  };

  const onDismissSnackBar = () => setVisible(false); // Ocultar Snackbar

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : styles.buttonDefault,
        ]}
        onPress={handleCopy}
      >
        <FontAwesome5 name="copy" size={24} color={Colors.LIGHT_PRIMARY} />
        <Text style={{ color: "white" }}> Copiar</Text>
      </Pressable>

      {/* Snackbar para mostrar el mensaje temporalmente */}
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={2000} // Duración del Snackbar en milisegundos
      >
        Texto copiado al portapapeles.
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
    borderRadius: 15,
    alignContent: "center",
    flexDirection: "row",
    padding: 10,
    width: '25%',
  },
  buttonPressed: {
    borderColor: Colors.SECONDARY,
    backgroundColor: "#48c9b0",
  },
  buttonDefault: {
    borderColor: "#3498db",
    backgroundColor: "#3498db",
  },
});
