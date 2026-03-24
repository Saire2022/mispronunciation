import axios from "axios";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import { Alert } from "react-native";
import * as SecureStore from 'expo-secure-store'; // Importar SecureStore

// Obtener el token de la API almacenado, si existe
const getApiToken = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync('huggingface_api_token');
    return storedToken || process.env.EXPO_PUBLIC_API_TOKEN; // Usa el token guardado o el token por defecto
  } catch (error) {
    console.error('Error al obtener el token de HuggingFace:', error);
    return process.env.EXPO_PUBLIC_API_TOKEN; // Si ocurre un error, usa el token por defecto
  }
};

// Función para traducir errores del servidor al español
const traducirError = (mensaje) => {
  // Ejemplo de mapeo de algunos mensajes comunes, puedes agregar más si lo necesitas
  const errores = {
    "Service Unavailable": "Servicio no disponible",
    "The server is busy": "El servidor está ocupado",
    "Model loading error": "Error al cargar el modelo",
    "Invalid input format": "Formato de entrada inválido",
    "Model ctaguchi/killkan_asr is currently loading": "Modelo cargando intentelo en unos segundos"
  };

  // Retorna la traducción si existe, de lo contrario el mensaje original
  return errores[mensaje] || mensaje;
};

export const query = async (audioUri) => {
  console.log("Audio URI:", audioUri);

  try {
    // Obtener el token de la API (actualizado o por defecto)
    const API_TOKEN = await getApiToken();
    console.log("API Token:", API_TOKEN);
    if (!API_TOKEN) {
      throw new Error('API Token no encontrado');
    }

    // Leer el archivo de audio como binario (buffer)
    const audioFile = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await axios({
      url: `https://api-inference.huggingface.co/models/ctaguchi/killkan_asr`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "audio/mpeg", // Asegúrate de enviar el tipo correcto según el formato
      },
      data: Buffer.from(audioFile, 'base64'),  // Convierte el audio base64 en binario
      responseType: 'json',
    });

    console.log("Respuesta del servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en la consulta:", error);

    // Verificar si el error es por código 503
    if (error.response && error.response.status === 503) {
      const mensajeServidor = error.response.data?.error || "Error desconocido";
      const mensajeTraducido = traducirError(mensajeServidor);
      
      // Mostrar alerta con el mensaje traducido
      Alert.alert(
        "Error en el servidor",
        mensajeTraducido,
        [{ text: "OK" }]
      );
    } else {
      // Otros errores pueden ser manejados aquí
      Alert.alert(
        "Error",
        "Ocurrió un error al realizar la consulta. Por favor, intenta de nuevo.",
        [{ text: "OK" }]
      );
    }

    throw error; // Lanzar el error para que el manejador externo pueda atraparlo si es necesario
  }
};
