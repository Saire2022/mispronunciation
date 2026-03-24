import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Colors } from './../../constants/Colors'
import { Audio } from 'expo-av';
import { startRecording, stopRecording } from '../../scripts/record-audio';
import PlayAudio from '../../components/Pronunciation/PlayAudio';
import AnswerModal from '../../components/Pronunciation/AnswerModal';


export default function WordPronunciation() {

  const item = useLocalSearchParams();
  
  const navigation = useNavigation();
  const [sound, setSound] = useState('');
  const [showRecordIcons, setShowRecordIcons] = useState(false);
  const [showPlayIcons, setShowPlayIcons] = useState(true);

  // Grabar Audio
  const [recordingUri, setRecordingUri] = useState(null); // Estado para almacenar el URI del audio
  const [recordingStatus, setRecordingStatus] = useState(""); // Inicializa el estado
  const [isRecording, setIsRecording] = useState(false);
  //const [recordingUri, setRecordingUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  //Play Recorded Audio
  const [textData, setTextData] = useState("");
  const [loading, setLoading] = useState(false);
  // Answer
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState(false);
  const [answerText, setAnswerText] = useState('');


  const router = useRouter();


  // Configuración de las opciones de navegación
  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerTitle: item.word,
    });
  }, [sound]);

  // Función para reproducir el sonido
  async function playSound(audio) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audio });
      setSound(sound);
      console.log('Playing Sound');
      await sound.playAsync();
    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  }

  //Funcion para manejar el botón intentar
  const handleTry = () => {
    setShowPlayIcons(false);
    setShowRecordIcons(true);
  }

  // Funcion para manejar el botón omitir
  const handleOmit = () => {
    router.back();
  }

  /**
   * Funciones para Grabar audio
  */
  const handleRecording = async () => {
    if (isRecording) {
      await stopRecording(recording, setRecordingUri, setRecording, setRecordingDuration, setRecordingStatus);
    } else {
      await startRecording(setRecording, setRecordingDuration, permissionResponse, requestPermission);
    }
    setIsRecording(!isRecording);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center'
      }}>{item?.word}</Text>
      <Text style={{ textAlign: 'center' }}>{item?.spanish}</Text>

      {showPlayIcons &&
        <>
          <TouchableOpacity style={styles.container} onPress={() => playSound(item.audio)}>
            <FontAwesome5
              name={"play-circle"}
              size={200} color={Colors.PRIMARY} />
          </TouchableOpacity>

          <Text style={styles.text}>Por favor presione ▶️ para escuchar la pronunciación</Text>
          <TouchableOpacity style={styles.button} onPress={handleTry}>
            <Text style={styles.textButton}>Intentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.omitirButton} onPress={handleOmit}>
            <Text style={styles.omitButton}>Omitir</Text>
          </TouchableOpacity>
        </>
      }

      {showRecordIcons &&
        <>
          <TouchableOpacity style={styles.container} onPress={handleRecording}>
            <FontAwesome5
              name={isRecording ? "stop" : "microphone"}
              size={200}
              color={isRecording ? "red" : Colors.PRIMARY}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "black", paddingRight: 8 }}>
              {"Grabar"}
            </Text>
            <Text style={{ color: Colors.PRIMARY }}>

              {Math.floor(recordingDuration / 1000 / 60)}:
              {Math.floor((recordingDuration / 1000) % 60)
                .toString()
                .padStart(2, "0")}
            </Text>
          </TouchableOpacity>
          <Text style={styles.text}>Por favor presione 🎙️ para grabar</Text>
          <View style={{ marginTop: 20 }}></View>
          <PlayAudio recordingUri={recordingUri} setRecordingUri={setRecordingUri} word={item?.word} setLoading={setLoading} setAnswer={setAnswer} setAnswerText={setAnswerText} setShowModal={setShowModal}/>
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />
          ) : (
            showModal && <AnswerModal  answer={answer} answerText={answerText} setShowModal={setShowModal} />
          )}
        </>
      }


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginTop: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 15,
    //alignContent: 'center',
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 30
  },
  textButton: {
    color: Colors.WHITE,
    fontSize: 20
  },
  omitirButton: {
    backgroundColor: Colors.GRAY,
    padding: 10,
    borderRadius: 15,
    //alignContent: 'center',
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 30,
  },
  omitButton: {
    color: Colors.WHITE,
    fontSize: 20
  }
});
