import { View, Text, Pressable, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import { Colors } from "./../../constants/Colors"
import { playAudio } from '../../scripts/play-audio';
import { query } from '../../scripts/query-to-servidor';
import AnswerModal from './AnswerModal';

export default function PlayAudio({ recordingUri, setRecordingUri, word, setLoading, setAnswer, setAnswerText, setShowModal }) {
    // Reproducir Audio
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(0);

    const handlePlayRecording = () => {
        if (recordingUri) {
            playAudio(
                recordingUri,
                sound,
                setSound,
                isPlaying,
                setIsPlaying,
                setAudioDuration,
                setCurrentPosition
            );
            //setShowModal(true);
        } else {
            console.log("No hay grabación para reproducir.");
        }
    };

    const handleDeleteRecording = async () => {
        try {
            if (sound) {
                await sound.unloadAsync(); // Detener y descargar el sonido si está en reproducción
                setSound(null);
            }

            setRecordingUri(null); // Limpiar la URI del audio
            setIsPlaying(false);
            setCurrentPosition(0);
            setAudioDuration(0);

            console.log("Grabación eliminada");
        } catch (error) {
            console.error("Error al eliminar la grabación:", error);
        }
    };

    /**
     * Send Upload Audio to Model
     */
    const handleSendRecording = async () => {
        setLoading(true);
        try {
            const data = { inputs: recordingUri }; // Make sure recordingUri is defined
            console.log("Cargando modelo ...");
            const response = await query(recordingUri);
            // Asegúrate de extraer el texto correctamente
            const textResponse = response.text || "";
            if (word + '.' === textResponse) {
                console.log("La respuesta del modelo coincide con la palabra ingresada");
                setAnswer(true);
                setShowModal(true);
            } else {
                console.log("La respuesta no coincide", '\n', 'Modelo: ', textResponse, '\n', 'Respuesta correcta: ', word + '.');
                setShowModal(true);
                setAnswerText(textResponse);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error --->:", error);
            setLoading(false);
        }
    };

    return (
        <View
            style={styles.container}
        >
            {recordingUri && (
                <>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Pressable
                            style={({ pressed }) =>
                                [styles.button,
                                pressed ? styles.buttonPressed : styles.buttonDefault,
                                ]
                            }
                            onPress={handlePlayRecording}
                        >
                            <FontAwesome5
                                name={isPlaying ? "pause" : "play"}
                                size={24}
                                color={Colors.LIGHT_PRIMARY}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={{ color: "white" }}>
                                {Math.floor(currentPosition / 1000 / 60)}:
                                {Math.floor((currentPosition / 1000) % 60)
                                    .toString()
                                    .padStart(2, "0")}{" "}
                                / {Math.floor(audioDuration / 1000 / 60)}:
                                {Math.floor((audioDuration / 1000) % 60)
                                    .toString()
                                    .padStart(2, "0")}
                            </Text>
                        </Pressable>

                        {/* Trash Icon as a Button */}
                        <TouchableOpacity
                            onPress={handleDeleteRecording}
                            style={{ marginTop: 5, marginLeft: 10 }}
                        >
                            <FontAwesome5 name="trash" size={24} color="#FC304B" />
                        </TouchableOpacity>
                    </View>
                    {/* Send button */}
                    <View>
                        <TouchableOpacity
                            onPress={handleSendRecording}
                            style={{ marginTop: 10, marginRight: 10 }}
                        >
                            <FontAwesome name="send" size={30} color={Colors.LIGHT_PRIMARY} />
                            <Text>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'space-between',
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        marginHorizontal: 20,
        justifyContent: "space-between",

        // Propiedades de sombra para iOS
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
        shadowOpacity: 0.25, // Opacidad de la sombra
        shadowRadius: 3.84, // Radio de la sombra
        // Propiedad de sombra para Android
        elevation: 5, // Nivel de elevación
    },
    button: {
        marginTop: 15,
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
    loadingIndicator: {
        marginTop: 50,
    },
})