import { View, Text, TextInput, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Colors } from './../../constants/Colors';
import * as SecureStore from 'expo-secure-store'; // Importar SecureStore

export default function Credenciales() {
  const [apiKey, setApiKey] = useState(''); // Estado para almacenar el valor del input

  const handleUpdate = async () => {
    if (!apiKey) {
      Alert.alert('Error', 'Por favor ingrese la nueva API de Hugging Face');
      return;
    }

    try {
      // Guardar la API key en SecureStore
      await SecureStore.setItemAsync('huggingface_api_token', apiKey);
      Alert.alert('Éxito', 'API de Hugging Face guardada correctamente');
      setApiKey(''); // Vaciar el TextInput después de guardar
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un problema al guardar la API');
    }
  };

  const handleLinkPress = () => {
    const url = 'https://huggingface.co/settings/tokens';
    Linking.openURL(url).catch(err => console.error('Error al abrir el enlace:', err));
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f7f8fa', // Color de fondo suave
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: '#fff', // Fondo blanco para el contenedor
          borderRadius: 15,
          padding: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3, // Para sombras en Android
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: Colors.PRIMARY }}>
          Actualizar Hugging Face API Token
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 10, color: '#333' }}>
          Si tiene inconvenientes con usar la App debe actualizar el API token de HuggingFace.
          Para esto siga los siguientes pasos:
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5, color: '#555' }}>
          1. Ingrese a su cuenta de Hugging Face en:{' '}
          <TouchableOpacity onPress={handleLinkPress}>
            <Text style={{ color: '#007bff', textDecorationLine: 'underline' }}>
              https://huggingface.co/settings/tokens
            </Text>
          </TouchableOpacity>
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5, color: '#555' }}>
          2. Si no tiene un token, haga clic en "New token" para generar uno nuevo.
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5, color: '#555' }}>
          3. Asigne un nombre y seleccione los permisos adecuados (al menos "read").
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5, color: '#555' }}>
          4. Copie el token generado.
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5, color: '#555' }}>
          5. Vuelva a la aplicación y pegue el token en el campo correspondiente.
        </Text>
        <Text style={{ fontSize: 14, marginBottom: 5, color: '#555' }}>
          6. Presione el botón "Actualizar" para guardar el nuevo token.
        </Text>
        <Text style={{ fontSize: 14, color: '#555' }}>
          7. Ahora, su aplicación está lista para usar el nuevo API token.
        </Text>
      </View>

      <TextInput
        style={{
          width: '100%',
          height: 50,
          borderColor: Colors.GRAY,
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          marginTop: 30,
          backgroundColor: '#fff', // Fondo blanco para el input
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 3,
        }}
        placeholder="Ingrese HuggingFace API"
        placeholderTextColor={Colors.GRAY}
        onChangeText={(text) => setApiKey(text)} // Actualizar estado al cambiar texto
        value={apiKey}
      />

      <TouchableOpacity
        style={{
          marginTop: 30,
          width: '100%',
          height: 50,
          backgroundColor: Colors.PRIMARY,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 5,
        }}
        onPress={handleUpdate}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Actualizar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
