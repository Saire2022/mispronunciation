import { View, Text, StyleSheet, TextInput, Pressable, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Colors } from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { startRecording, stopRecording } from '../../scripts/record-audio';
import { Audio } from "expo-av";
import { Picker } from '@react-native-picker/picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../config/FirebaseConfig';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function AddWord() {
    const navigation = useNavigation();
    const router = useRouter()
    const [loader, setLoader] = useState(false);
    const [isRecording, setIsRecording] = useState();

    const [recordingUri, setRecordingUri] = useState("");
    const [recording, setRecording] = useState();
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordingStatus, setRecordingStatus] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    const [isPlaying, setIsPlaying] = useState(false);

    const [formData, setFormData] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        navigation.setOptions({
            title: 'Agregar Nueva Palabra',
        })
    }, [])

    const handleRecording = async () => {
        if (isRecording) {
            await stopRecording(recording, setRecordingUri, setRecording, setRecordingDuration, setRecordingStatus);
        } else {
            await startRecording(setRecording, setRecordingDuration, permissionResponse, requestPermission);
        }
        setIsRecording(!isRecording);
    };

    // Función para reproducir el sonido
    async function playSound(audio) {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: audio });
            console.log('Playing Sound');
            setIsPlaying(true);

            // Escuchar los cambios de estado de reproducción
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    // Si el sonido terminó de reproducirse, cambiar el estado a false
                    setIsPlaying(false);
                }
            });

            await sound.playAsync();
        } catch (error) {
            console.error('Error loading or playing sound:', error);
        }
    }

    //Funcion para eliminar el audio 
    const handleDeleteRecording = async () => {
        try {
            setRecordingUri(null);
            setIsPlaying(false);
            setRecordingDuration(0);
            setRecording(null);
            console.log("Grabación eliminada");
        } catch (error) {
            console.error("Error al eliminar la grabación:", error);
        }
    };

    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const UploadAudio = async () => {
        try {
            console.log("Subiendo audio");
            setLoader(true);

            // Obtener el archivo de audio como blob
            const resp = await fetch(recordingUri);
            const blobAudio = await resp.blob();

            // Crear referencia al archivo en Firebase Storage
            const storageRef = ref(storage, `/Beginner/${Date.now()}.mp3`);

            // Subir el archivo a Firebase Storage
            await uploadBytes(storageRef, blobAudio);
            console.log("File Uploaded!");

            // Obtener la URL de descarga
            const downloadURL = await getDownloadURL(storageRef);
            console.log(downloadURL);

            // Guardar los datos del formulario con la URL del audio
            SaveFormData(downloadURL);

        } catch (error) {
            console.error("Error al subir el archivo:", error);
        } finally {
            setLoader(false);
        }
    };


    const SaveFormData = async (audio) => {
        const docId = Date.now().toString();
        try {
            // Guarda los datos en Firestore
            await setDoc(doc(db, 'Beginner', docId), {
                ...formData,
                audio: audio, // Usar el parámetro 'audio' aquí
            });

            setLoader(false);
            router.replace({
                pathname: 'beginner',
                params:{level: formData.category}
            });
        } catch (error) {
            console.error("Error guardando los datos:", error.message);
            setLoader(false);
        }
    };

    const checkIfWordExists = async (word) => {
        try {
            const q = query(collection(db, 'Beginner'), where('word', '==', word));

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Si hay resultados, la palabra ya existe
                return true;
            }

            // Si no hay resultados, la palabra no existe
            return false;
        } catch (error) {
            console.error('Error verificando la existencia de la palabra:', error);
            return false; // Por defecto, retornamos false si ocurre un error
        }
    };


    const OnSubmit = async () => {
        if (!recordingUri) {
            ToastAndroid.show('Por favor, graba un audio antes de enviar.', ToastAndroid.SHORT);
            return;
        }

        if (Object.keys(formData).length != 3) {
            ToastAndroid.show('Por favor, completa todos los detalles.', ToastAndroid.SHORT);
            return;
        }

        // Verificar si la palabra ya existe
        const isWordExists = await checkIfWordExists(formData.word);
        if (isWordExists) {
            ToastAndroid.show('Esta palabra ya existe en la base de datos.', ToastAndroid.SHORT);
            return;
        }

        // Si la palabra no existe, proceder a subir el audio y guardar los datos
        UploadAudio();
    };

    return (
        <View style={{ padding: 20 }}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Palabra*</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => handleInputChange('word', value)}
                    placeholder="Ejemplo: Hatuna"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Significado en Español*</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(value) => handleInputChange('spanish', value)}
                    placeholder="Ejemplo: Vender"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Categoria*</Text>
                <Picker
                selectedValue={selectedCategory}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => {
                    setSelectedCategory(itemValue);
                    handleInputChange('category', itemValue);
                }}>
                <Picker.Item label="Seleccione una categoría" value="" />
                <Picker.Item label="Principiante" value="Principiante" />
                <Picker.Item label="Medio" value="Medio" />
                <Picker.Item label="Avanzado" value="Avanzado" />
            </Picker>
            </View>


            <View style={styles.inputContainer}>
                <Text style={styles.label}>Grabar Audio*</Text>
                <View style={styles.recordContainer}>
                    <Pressable onPress={handleRecording}>
                        <FontAwesome5
                            name={isRecording ? "stop" : "microphone"}
                            size={50}
                            color={isRecording ? "red" : Colors.LIGHT_PRIMARY}
                        />
                        <Text>{isRecording ? "Detener" : "Grabar"}</Text>
                    </Pressable>
                    {recordingUri && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap:25, alignItems:'center' }}>
                            <Pressable onPress={() => playSound(recordingUri)}>
                                <FontAwesome5
                                    name={isPlaying ? "pause" : "play"}
                                    size={24}
                                    color={Colors.LIGHT_PRIMARY}
                                />
                                <Text>Play</Text>
                            </Pressable>

                            <TouchableOpacity onPress={handleDeleteRecording}>
                                <FontAwesome5 name="trash" size={24} color="#FC304B" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity onPress={OnSubmit} style={styles.buttonContainer}>
                {loader ? <ActivityIndicator size={'large'} /> :
                    <Text style={{ textAlign: 'center', color: Colors.WHITE, fontSize:16 }}>
                        Subir
                    </Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 5
    },
    input: {
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 7
    },
    label: {
        marginVertical: 5,
    },
    buttonContainer: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,  // Asegúrate de que este color sea válido
        borderRadius: 15,
        marginVertical: 10,
        marginBottom: 50
    },
    recordContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignContent: 'center'

    }
})