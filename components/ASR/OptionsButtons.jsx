import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "./../../constants/Colors"
import { handleButtonUpload } from "./../../scripts/subir_audio"
import { Audio } from "expo-av";
import { startRecording, stopRecording } from '../../scripts/record-audio'; 


export default function OptionsButtons({ setRecordingUri }) {
    const [audio, setAudio] = useState(null);

    // Grabar Audio
    const [recordingStatus, setRecordingStatus] = useState(""); // Inicializa el estado
    const [isRecording, setIsRecording] = useState(false);
    //const [recordingUri, setRecordingUri] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recording, setRecording] = useState();
    const [permissionResponse, requestPermission] = Audio.usePermissions();


    const handleUploadAudio = async () => {
        const uri = await handleButtonUpload(); // Aquí llamas a tu función para cargar audio
        setRecordingUri(uri); // Actualizas el estado con el URI del archivo de audio cargado
    };

    /**
     * Funciones para Grabar audio
    */
    const handleRecording = async () => {
        if (isRecording) {
            await stopRecording(recording, setRecordingUri, setRecording, setRecordingDuration, setRecordingStatus);
        } else {
            await startRecording(setRecording,setRecordingDuration,permissionResponse, requestPermission);
        }
        setIsRecording(!isRecording);
    };

    return (
        <View
            style={styles.container}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : styles.buttonDefault,
                ]}
                onPress={() => handleButtonUpload(setRecordingUri)} // Llama a la función de cargar audio
            >
                <Feather name="paperclip" size={24} color={Colors.LIGHT_PRIMARY} />
                <Text style={{ color: "white" }}> Subir audio</Text>
            </Pressable>

            {/* Record Audio */}
            <Pressable
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : styles.buttonDefault,
                ]}
            onPress={handleRecording}
            >
                <FontAwesome5
                    name={isRecording ? "stop" : "microphone"}
                    size={24}
                    color={isRecording ? "red" : Colors.LIGHT_PRIMARY}
                    style={{ marginRight: 8 }}
                />
                <Text style={{ color: "white", paddingRight: 8 }}>
                    {"Grabar"}
                </Text>
                <Text style={{ color: Colors.LIGHT_PRIMARY }}>
                    
                    {Math.floor(recordingDuration / 1000 / 60)}:
                    {Math.floor((recordingDuration / 1000) % 60)
                        .toString()
                        .padStart(2, "0")}
                </Text>
            </Pressable>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginHorizontal: 15,
        marginVertical:10
    },

    button: {
        borderRadius: 15,
        alignContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        alignItems: "center",
    },
    buttonPressed: {
        borderColor: Colors.SECONDARY,
        backgroundColor: Colors.SECONDARY,
    },
    buttonDefault: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.PRIMARY,
    },
})